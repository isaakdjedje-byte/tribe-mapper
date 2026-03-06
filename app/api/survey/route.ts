import { NextRequest, NextResponse } from 'next/server';
import { initializeDatabase, createMember, getMemberByAnonymousId, updateMember, saveSurveyResponse, getAllMembers, getAllRelationships, getAllResponsesWithMembers, getSurveyResponses, getMemberCount, getSurveyStats, saveRelationship, getInferredProperties, saveInferredProperty, getTribeSignals, saveTribeSignal, getMember, getRelationships } from '@/lib/db';
import { analyzeTribe } from '@/lib/analytics/engine';

export async function POST(request: NextRequest) {
  try {
    initializeDatabase();
    const body = await request.json();
    const { action, ...data } = body;

    switch (action) {
      case 'init': {
        return NextResponse.json({ status: 'ok', message: 'Database initialized' });
      }

      case 'create_member': {
        const memberId = createMember(data);
        return NextResponse.json({ memberId });
      }

      case 'get_or_create_member': {
        const { anonymous_id } = data;
        let member = getMemberByAnonymousId(anonymous_id);
        if (!member) {
          const memberId = createMember({ anonymous_id });
          member = getMember(memberId);
        }
        return NextResponse.json({ member });
      }

      case 'update_member': {
        const { member_id, ...updates } = data;
        updateMember(member_id, updates);
        return NextResponse.json({ status: 'ok' });
      }

      case 'submit_survey': {
        const { member_id, survey_type, responses } = data;
        
        for (const response of responses) {
          saveSurveyResponse({
            member_id,
            survey_type,
            question_id: response.question_id,
            answer_value: JSON.stringify(response.answer_value),
            answer_type: response.answer_type
          });
        }

        updateMember(member_id, {
          status: 'completed',
          survey_stage: survey_type
        });

        return NextResponse.json({ status: 'ok' });
      }

      case 'get_survey_responses': {
        const { member_id, survey_type } = data;
        const responses = getSurveyResponses(member_id, survey_type);
        return NextResponse.json({ responses });
      }

      case 'get_survey2_triggers': {
        const { member_id } = data;
        const allMembers = getAllMembers();
        const allRelationships = getAllRelationships();
        const member = getMember(member_id);
        
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
        const members = getAllMembers();
        const relationships = getAllRelationships();
        const surveyResponses = getAllResponsesWithMembers();
        
        const analysis = analyzeTribe(members, relationships, surveyResponses);
        
        return NextResponse.json({ analysis });
      }

      case 'get_dashboard_stats': {
        const totalMembers = getMemberCount();
        const activeMembers = getMemberCount('active');
        const completedMembers = getMemberCount('completed');
        const survey1Stats = getSurveyStats('survey1');
        const survey2Stats = getSurveyStats('survey2');
        
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
        const members = getAllMembers();
        const relationships = getAllRelationships();
        
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
        const relationships = getRelationships(type, member_id);
        return NextResponse.json({ relationships });
      }

      case 'process_nominations': {
        const { member_id, nominations, relationship_type } = data;
        
        for (const targetId of nominations) {
          if (targetId !== member_id) {
            saveRelationship({
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

      case 'generate_link': {
        const { count } = data;
        const links: string[] = [];
        
        for (let i = 0; i < (count || 1); i++) {
          const anonymous_id = `tm_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          const memberId = createMember({ anonymous_id });
          updateMember(memberId, { status: 'active' });
          links.push(`/survey/${memberId}`);
        }

        return NextResponse.json({ links });
      }

      case 'trigger_survey2': {
        const { member_ids, criteria } = data;
        
        for (const memberId of member_ids) {
          updateMember(memberId, { survey_stage: 'survey2_pending' });
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
    initializeDatabase();
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    switch (action) {
      case 'health': {
        const totalMembers = getMemberCount();
        return NextResponse.json({ status: 'ok', totalMembers });
      }

      default:
        return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
