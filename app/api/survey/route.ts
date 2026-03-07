import { NextRequest, NextResponse } from 'next/server';
import { initializeDatabase, createMember, getMemberByAnonymousId, updateMember, saveSurveyResponse, getAllMembers, getAllRelationships, getAllResponsesWithMembers, getSurveyResponses, getMemberCount, getSurveyStats, saveRelationship, getInferredProperties, saveInferredProperty, getTribeSignals, saveTribeSignal, getMember, getRelationships, isConfigured } from '@/lib/db';
import { analyzeTribe } from '@/lib/analytics/engine';
import { verifyAdminSession } from '@/lib/auth';

// Actions that require admin authentication
const adminActions = [
  'init',
  'get_dashboard_stats',
  'get_roster',
  'get_analytics',
  'get_survey2_triggers',
  'trigger_survey2',
  'generate_link',
  'get_relationships'
];

export async function POST(request: NextRequest) {
  try {
    await initializeDatabase();
    
    if (!isConfigured()) {
      return NextResponse.json({ error: 'Database not configured. Please set DATABASE_URL.' }, { status: 500 });
    }
    
    const body = await request.json();
    const { action, ...data } = body;

    // Check admin auth for protected actions
    if (adminActions.includes(action)) {
      const isAdmin = await verifyAdminSession(request);
      if (!isAdmin) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    switch (action) {
      case 'init': {
        return NextResponse.json({ status: 'ok', message: 'Database initialized' });
      }

      case 'create_member': {
        const memberId = await createMember(data);
        return NextResponse.json({ memberId });
      }

      case 'get_or_create_member': {
        const { anonymous_id } = data;
        let member = await getMemberByAnonymousId(anonymous_id);
        if (!member) {
          const memberId = await createMember({ anonymous_id });
          member = await getMember(memberId);
        }
        return NextResponse.json({ member });
      }

      case 'get_survey_state': {
        const { member_id } = data;
        const member = await getMember(member_id);
        if (!member) {
          return NextResponse.json({ error: 'Member not found' }, { status: 404 });
        }
        const relationships = await getRelationships(undefined, member_id);
        const responses = await getSurveyResponses(member_id, 'survey1');
        return NextResponse.json({ 
          member,
          relationships,
          responses
        });
      }

      case 'update_member': {
        const { member_id, ...updates } = data;
        await updateMember(member_id, updates);
        return NextResponse.json({ status: 'ok' });
      }

      case 'submit_survey': {
        const { member_id, survey_type, responses } = data;
        
        for (const response of responses) {
          await saveSurveyResponse({
            member_id,
            survey_type,
            question_id: response.question_id,
            answer_value: JSON.stringify(response.answer_value),
            answer_type: response.answer_type
          });
        }

        await updateMember(member_id, {
          status: 'completed',
          survey_stage: survey_type
        });

        return NextResponse.json({ status: 'ok' });
      }

      case 'get_survey_responses': {
        const { member_id, survey_type } = data;
        const responses = await getSurveyResponses(member_id, survey_type);
        return NextResponse.json({ responses });
      }

      case 'get_survey2_triggers': {
        const { member_id } = data;
        const allMembers = await getAllMembers();
        const allRelationships = await getAllRelationships();
        const member = await getMember(member_id);
        
        const triggers = [];
        const nominationsReceived = allRelationships.filter(r => 
          r.target_id === member_id && r.relationship_type === 'trust'
        ).length;
        
        const nominationsGiven = allRelationships.filter(r => 
          r.source_id === member_id && r.relationship_type === 'trust'
        ).length;

        if (nominationsReceived >= 3 && nominationsGiven < nominationsReceived * 0.5) {
          triggers.push('bridge_investigation');
        }

        const memberHasRelationships = allRelationships.some(r => r.source_id === member_id);
        if (member?.status === 'completed' && !memberHasRelationships) {
          triggers.push('missing_data');
        }

        return NextResponse.json({ triggers });
      }

      case 'get_analytics': {
        const members = await getAllMembers();
        const relationships = await getAllRelationships();
        const surveyResponses = await getAllResponsesWithMembers();
        
        const analysis = analyzeTribe(members, relationships, surveyResponses);
        
        return NextResponse.json({ analysis });
      }

      case 'get_dashboard_stats': {
        const totalMembers = await getMemberCount();
        const activeMembers = await getMemberCount('active');
        const completedMembers = await getMemberCount('completed');
        const survey1Stats = await getSurveyStats('survey1');
        const survey2Stats = await getSurveyStats('survey2');
        
        return NextResponse.json({
          totalMembers,
          activeMembers,
          completedMembers,
          pendingMembers: totalMembers - activeMembers - completedMembers,
          survey1: survey1Stats,
          survey2: survey2Stats
        });
      }

      case 'get_roster': {
        const members = await getAllMembers();
        const relationships = await getAllRelationships();
        
        const roster = members.map(m => {
          const trustReceived = relationships.filter(r => r.target_id === m.id && r.relationship_type === 'trust').length;
          const trustGiven = relationships.filter(r => r.source_id === m.id && r.relationship_type === 'trust').length;
          const collabCount = relationships.filter(r => 
            (r.source_id === m.id || r.target_id === m.id) && 
            r.relationship_type === 'collaboration'
          ).length;
          const influenceCount = relationships.filter(r => 
            (r.target_id === m.id) && 
            r.relationship_type === 'influence'
          ).length;

          return {
            ...m,
            trustReceived,
            trustGiven,
            collaborationCount: collabCount,
            influenceCount,
            centralityScore: trustReceived + collabCount * 0.8 + influenceCount * 1.2
          };
        });

        return NextResponse.json({ roster });
      }

      case 'get_relationships': {
        const { type, member_id } = data;
        const relationships = await getRelationships(type, member_id);
        return NextResponse.json({ relationships });
      }

      case 'process_nominations': {
        const { member_id, nominations, relationship_type } = data;
        
        for (const targetId of nominations) {
          if (targetId !== member_id && !targetId.startsWith('provisional_')) {
            await saveRelationship({
              source_id: member_id,
              target_id: targetId,
              relationship_type,
              strength: 3,
              source_confidence: 3
            });
          }
        }

        return NextResponse.json({ status: 'ok' });
      }

      case 'save_provisional_relationship': {
        const { member_id, provisional_name, relationship_type } = data;
        
        // Create a provisional member
        const provisionalMember = await createMember({
          display_name: provisional_name,
          anonymous_id: `provisional_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        });
        
        // Create relationship to provisional member
        await saveRelationship({
          source_id: member_id,
          target_id: provisionalMember,
          relationship_type,
          strength: 3,
          source_confidence: 3
        });

        return NextResponse.json({ status: 'ok', provisional_id: provisionalMember });
      }

      case 'generate_link': {
        const { count } = data;
        const links: string[] = [];
        
        for (let i = 0; i < (count || 1); i++) {
          const anonymous_id = `tm_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          const memberId = await createMember({ anonymous_id });
          await updateMember(memberId, { status: 'active' });
          links.push(`/survey/${memberId}`);
        }

        return NextResponse.json({ links });
      }

      case 'trigger_survey2': {
        const { member_ids, criteria } = data;
        
        for (const memberId of member_ids) {
          await updateMember(memberId, { survey_stage: 'survey2_pending' });
        }

        return NextResponse.json({ status: 'ok', triggered: member_ids.length });
      }

      default:
        return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
    }
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    await initializeDatabase();
    
    if (!isConfigured()) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }
    
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    switch (action) {
      case 'health': {
        const totalMembers = await getMemberCount();
        return NextResponse.json({ status: 'ok', totalMembers });
      }

      default:
        return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
