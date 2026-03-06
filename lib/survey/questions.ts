export interface Question {
  id: string;
  section: string;
  question: string;
  description?: string;
  type: 'text' | 'textarea' | 'single' | 'multi' | 'scale' | 'nominate' | 'duration' | 'scenario';
  options?: { value: string; label: string; description?: string }[];
  placeholder?: string;
  required: boolean;
  maxSelections?: number;
  minSelections?: number;
  internal_mapping: {
    signal_type: string;
    edge_type?: string;
    property_type?: string;
    scoring_notes?: string;
  };
  logic?: {
    show_if?: { question_id: string; operator: 'equals' | 'not_equals' | 'contains'; value: any };
  };
}

export const SURVEY1_QUESTIONS: Question[] = [
  {
    id: 'a1_name',
    section: 'Identity',
    question: 'What should we call you?',
    description: 'This is how you\'ll appear in the system. You can use your real name or a nickname.',
    type: 'text',
    placeholder: 'Your name or alias',
    required: false,
    internal_mapping: {
      signal_type: 'identity',
      property_type: 'display_name'
    }
  },
  {
    id: 'a2_role',
    section: 'Identity',
    question: 'How would you describe your role in this group?',
    description: 'Think about what you actually do, not just a title.',
    type: 'textarea',
    placeholder: 'e.g., I coordinate between teams, I handle the numbers, I keep things moving...',
    required: true,
    maxSelections: 100,
    internal_mapping: {
      signal_type: 'self_role_description',
      property_type: 'role_self_description'
    }
  },
  {
    id: 'a3_duration',
    section: 'Identity',
    question: 'How long have you been part of this group?',
    type: 'single',
    required: true,
    options: [
      { value: 'less_3mo', label: 'Less than 3 months' },
      { value: '3mo_1yr', label: '3 months to 1 year' },
      { value: '1yr_2yr', label: '1 to 2 years' },
      { value: '2yr_5yr', label: '2 to 5 years' },
      { value: '5yr_plus', label: 'More than 5 years' }
    ],
    internal_mapping: {
      signal_type: 'tenure',
      property_type: 'member_tenure'
    }
  },
  {
    id: 'b1_trust',
    section: 'Relationships',
    question: 'Who in the group do you trust most?',
    description: 'People you would go to with a problem, share sensitive info with, or rely on when it matters. List up to 5.',
    type: 'nominate',
    required: true,
    maxSelections: 5,
    internal_mapping: {
      signal_type: 'trust_nomination',
      edge_type: 'trust',
      property_type: 'trusted_by'
    }
  },
  {
    id: 'b2_collaboration',
    section: 'Relationships',
    question: 'Who do you work with most closely on group activities?',
    description: 'People you regularly coordinate with, collaborate with, or work alongside.',
    type: 'nominate',
    required: true,
    maxSelections: 8,
    internal_mapping: {
      signal_type: 'collaboration_nomination',
      edge_type: 'collaboration',
      property_type: 'collaborates_with'
    }
  },
  {
    id: 'b3_influence',
    section: 'Relationships',
    question: 'Whose opinions typically sway decisions in the group?',
    description: 'When these people speak up, others tend to listen and go along.',
    type: 'nominate',
    required: true,
    maxSelections: 5,
    internal_mapping: {
      signal_type: 'influence_nomination',
      edge_type: 'influence',
      property_type: 'influenced_by'
    }
  },
  {
    id: 'b4_conflicts',
    section: 'Relationships',
    question: 'Are there people you sometimes disagree with or find difficult to work with?',
    description: 'This is private. It helps identify tension points. You can skip this.',
    type: 'nominate',
    required: false,
    maxSelections: 5,
    internal_mapping: {
      signal_type: 'conflict_nomination',
      edge_type: 'conflict',
      property_type: 'tension_with'
    }
  },
  {
    id: 'c1_decision',
    section: 'Behavior',
    question: 'A major decision needs to be made. What typically happens?',
    description: 'Think about how decisions actually get made in practice.',
    type: 'scenario',
    required: true,
    options: [
      { value: 'leader_decides', label: 'One or two people decide for everyone', description: 'A clear leader or small group makes the call' },
      { value: 'consensus', label: 'We discuss until we reach consensus', description: 'Everyone talks until we all agree' },
      { value: 'vote', label: 'We take a vote', description: 'Majority rules' },
      { value: 'organic', label: 'It emerges organically', description: 'Decisions just sort of happen without explicit process' }
    ],
    internal_mapping: {
      signal_type: 'decision_pattern',
      property_type: 'culture_decision_style'
    }
  },
  {
    id: 'c2_conflict',
    section: 'Behavior',
    question: 'A disagreement emerges between two members. What usually happens?',
    type: 'scenario',
    required: true,
    options: [
      { value: 'avoid', label: 'It gets avoided or swept under the rug', description: 'People try not to make it a thing' },
      { value: 'mediate', label: 'Someone mediates or facilitates', description: 'A third party helps work it through' },
      { value: 'confront', label: 'People work it out directly', description: 'Those involved hash it out' },
      { value: 'escalate', label: 'It gets escalated to leadership', description: 'Leaders step in to resolve' }
    ],
    internal_mapping: {
      signal_type: 'conflict_resolution',
      property_type: 'culture_conflict_style'
    }
  },
  {
    id: 'c3_initiative',
    section: 'Behavior',
    question: 'Someone has an idea for a new project or initiative. What usually occurs?',
    type: 'scenario',
    required: true,
    options: [
      { value: 'permission', label: 'They need permission to proceed', description: 'Ideas require approval from leadership' },
      { value: 'volunteers', label: 'A few volunteers form a team', description: 'Those interested naturally coalesce' },
      { value: 'anyone_jumps', label: 'Anyone can just jump in and start', description: 'No formal process needed' },
      { value: 'committee', label: 'It goes to a committee for evaluation', description: 'Structured assessment before proceeding' }
    ],
    internal_mapping: {
      signal_type: 'initiative_pattern',
      property_type: 'culture_initiation_style'
    }
  },
  {
    id: 'c4_information',
    section: 'Behavior',
    question: 'Important news or information travels through the group. How?',
    type: 'scenario',
    required: true,
    options: [
      { value: 'top_down', label: 'Top-down announcements', description: 'Leaders share with the group' },
      { value: 'hubs', label: 'Through a few key hubs', description: 'Certain people spread it to others' },
      { value: 'network', label: 'Network of conversations', description: 'Information flows through many conversations' },
      { value: 'chaos', label: 'It\'s a bit chaotic', description: 'Not clear how info travels, sometimes people find out late' }
    ],
    internal_mapping: {
      signal_type: 'information_flow',
      property_type: 'culture_communication_style'
    }
  },
  {
    id: 'd1_values',
    section: 'Values',
    question: 'What matters most to this group?',
    description: 'Select the 3 that best represent what this group actually cares about.',
    type: 'multi',
    required: true,
    minSelections: 3,
    maxSelections: 3,
    options: [
      { value: 'quality', label: 'Quality & Excellence', description: 'Doing things at the highest level' },
      { value: 'speed', label: 'Speed & Results', description: 'Getting things done fast' },
      { value: 'community', label: 'Community & Belonging', description: 'People and relationships first' },
      { value: 'innovation', label: 'Innovation & experimentation', description: 'Trying new things' },
      { value: 'stability', label: 'Stability & reliability', description: 'Consistency and predictability' },
      { value: 'autonomy', label: 'Independence & autonomy', description: 'Freedom to work as you see fit' },
      { value: 'impact', label: 'Impact & purpose', description: 'Making a real difference' },
      { value: 'fairness', label: 'Fairness & equality', description: 'Level playing field for everyone' }
    ],
    internal_mapping: {
      signal_type: 'values_nomination',
      property_type: 'group_values'
    }
  },
  {
    id: 'd2_language',
    section: 'Values',
    question: 'What words, phrases, or inside jokes would a newcomer not understand?',
    description: 'These are the things that make this group feel like a tribe.',
    type: 'textarea',
    placeholder: 'e.g., "That\'s a Yanny moment", "The Friday sync", "Project Phoenix"...',
    required: true,
    maxSelections: 200,
    internal_mapping: {
      signal_type: 'tribe_language',
      property_type: 'shared_vocabulary'
    }
  },
  {
    id: 'd3_experiences',
    section: 'Values',
    question: 'What moments or experiences define this group?',
    description: 'The shared memories that bind everyone together.',
    type: 'textarea',
    placeholder: 'e.g., The big launch, the retreat, that crisis we weathered together...',
    required: true,
    maxSelections: 300,
    internal_mapping: {
      signal_type: 'shared_experiences',
      property_type: 'group_narrative'
    }
  },
  {
    id: 'd4_vision',
    section: 'Values',
    question: 'What should this group be working toward?',
    description: 'Your vision for where we\'re headed.',
    type: 'textarea',
    placeholder: 'Where should we be in 1 year? What\'s the big goal?',
    required: true,
    maxSelections: 300,
    internal_mapping: {
      signal_type: 'vision',
      property_type: 'group_aspiration'
    }
  },
  {
    id: 'e1_health',
    section: 'Perception',
    question: 'How would you describe the group\'s current state?',
    type: 'scale',
    required: true,
    options: [
      { value: '1', label: 'Struggling', description: 'Significant challenges, unclear direction' },
      { value: '2', label: 'Challenged', description: 'Working through difficulties' },
      { value: '3', label: 'Stable', description: 'Getting by, but not thriving' },
      { value: '4', label: 'Growing', description: 'Making progress, things are working' },
      { value: '5', label: 'Thriving', description: 'Strong, aligned, accomplishing goals' }
    ],
    internal_mapping: {
      signal_type: 'group_health',
      property_type: 'perceived_group_state'
    }
  },
  {
    id: 'e2_influence',
    section: 'Perception',
    question: 'How do you see your influence in this group?',
    description: 'Slide to where you think you fall.',
    type: 'scale',
    required: true,
    options: [
      { value: '1', label: 'Minimal', description: 'I participate but don\'t sway much' },
      { value: '2', label: 'Some influence', description: 'My views carry some weight' },
      { value: '3', label: 'Moderate', description: 'I have a noticeable impact' },
      { value: '4', label: 'High', description: 'People often look to me' },
      { value: '5', label: 'Very high', description: 'I significantly shape direction' }
    ],
    internal_mapping: {
      signal_type: 'self_perceived_influence',
      property_type: 'self_centrality'
    }
  }
];

export const SURVEY2_TRIGGER_CRITERIA = [
  {
    id: 'high_centrality_low_trust',
    name: 'High Centrality, Low Trust',
    description: 'Member is nominated frequently but doesn\'t reciprocate',
    trigger: (member: any, allMembers: any[], relationships: any[]) => {
      const nominations = relationships.filter(r => r.target_id === member.id && r.relationship_type === 'trust');
      const reciprocations = relationships.filter(r => 
        r.source_id === member.id && 
        relationships.some(r2 => r2.target_id === member.id && r2.source_id === r.target_id && r2.relationship_type === 'trust')
      );
      return nominations.length >= 3 && reciprocations.length < nominations.length * 0.5;
    }
  },
  {
    id: 'role_discrepancy',
    name: 'Role Discrepancy',
    description: 'Self-description differs significantly from how others describe them',
    trigger: (member: any, allMembers: any[], relationships: any[]) => {
      const selfDesc = member.display_name; // Simplified
      const othersDesc = relationships.filter(r => r.target_id === member.id);
      return othersDesc.length >= 3; // Placeholder logic
    }
  },
  {
    id: 'isolated_nominator',
    name: 'Isolated Nominator',
    description: 'Member was nominated by many but didn\'t nominate anyone',
    trigger: (member: any, allMembers: any[], relationships: any[]) => {
      const nominatedBy = relationships.filter(r => r.target_id === member.id);
      const nominatedOthers = relationships.filter(r => r.source_id === member.id);
      return nominatedBy.length >= 2 && nominatedOthers.length === 0;
    }
  },
  {
    id: 'trust_asymmetry',
    name: 'Trust Asymmetry',
    description: 'A trusts B but B doesn\'t trust A (unilateral trust)',
    trigger: (member: any, allMembers: any[], relationships: any[]) => {
      const trustGiven = relationships.filter(r => r.source_id === member.id && r.relationship_type === 'trust');
      return trustGiven.some(t => !relationships.some(r => 
        r.source_id === t.target_id && 
        r.target_id === member.id && 
        r.relationship_type === 'trust'
      ));
    }
  },
  {
    id: 'missing_data',
    name: 'Missing Relationship Data',
    description: 'No relationship nominations from this member',
    trigger: (member: any, allMembers: any[], relationships: any[]) => {
      const hasRelationships = relationships.some(r => r.source_id === member.id);
      return member.status === 'completed' && !hasRelationships;
    }
  }
];

export const SURVEY2_QUESTIONS: Question[] = [
  {
    id: 'bridge_1',
    section: 'Bridge Investigation',
    question: 'You were mentioned by people in different parts of the group. How do you stay connected across areas?',
    description: 'We noticed you interact with various subgroups. Tell us about those connections.',
    type: 'textarea',
    required: false,
    placeholder: 'How do you bridge different parts of the group?',
    internal_mapping: {
      signal_type: 'bridge_behavior',
      property_type: 'bridging_connections'
    }
  },
  {
    id: 'bridge_2',
    section: 'Bridge Investigation',
    question: 'Who in the group would you go to for help with a problem outside your usual area?',
    type: 'nominate',
    required: false,
    maxSelections: 3,
    internal_mapping: {
      signal_type: 'cross_cluster_connections',
      property_type: 'bridge_targets'
    }
  },
  {
    id: 'role_1',
    section: 'Role Clarification',
    question: 'How do you see your role changing over the past 6 months?',
    type: 'single',
    required: false,
    options: [
      { value: 'more_central', label: 'Become more central/influential' },
      { value: 'less_central', label: 'Become less central' },
      { value: 'same', label: 'Stayed about the same' },
      { value: 'changed_nature', label: 'Changed in nature but same level' }
    ],
    internal_mapping: {
      signal_type: 'role_evolution',
      property_type: 'role_trajectory'
    }
  },
  {
    id: 'role_2',
    section: 'Role Clarification',
    question: 'If you had to step back from the group, who could fill your role?',
    type: 'nominate',
    required: false,
    maxSelections: 3,
    internal_mapping: {
      signal_type: 'succession',
      property_type: 'role_successors'
    }
  },
  {
    id: 'values_1',
    section: 'Values Deep-dive',
    question: 'When have you felt most aligned with this group? Describe a specific moment.',
    type: 'textarea',
    required: false,
    placeholder: 'A moment when you felt "this is exactly who we are"...',
    internal_mapping: {
      signal_type: 'values_alignment_moment',
      property_type: 'values_examples'
    }
  },
  {
    id: 'values_2',
    section: 'Values Deep-dive',
    question: 'When have you felt least aligned with this group? Describe a specific moment.',
    type: 'textarea',
    required: false,
    placeholder: 'A moment when you felt "this isn\'t what we\'re about"...',
    internal_mapping: {
      signal_type: 'values_tension_moment',
      property_type: 'tension_examples'
    }
  },
  {
    id: 'gap_1',
    section: 'Gap Filling',
    question: 'Who in the group do you wish you knew better?',
    description: 'People you\'d like to connect with more.',
    type: 'nominate',
    required: false,
    maxSelections: 3,
    internal_mapping: {
      signal_type: 'desired_connections',
      property_type: 'connection_aspirations'
    }
  },
  {
    id: 'gap_2',
    section: 'Gap Filling',
    question: 'Who in the group seems isolated or disconnected?',
    description: 'People you think might be on the periphery.',
    type: 'nominate',
    required: false,
    maxSelections: 3,
    internal_mapping: {
      signal_type: 'perceived_isolates',
      property_type: 'isolate_nominations'
    }
  },
  {
    id: 'influence_1',
    section: 'Influence Mapping',
    question: 'Who influences you the most in this group?',
    type: 'nominate',
    required: false,
    maxSelections: 3,
    internal_mapping: {
      signal_type: 'influence_sources',
      property_type: 'personal_influence'
    }
  },
  {
    id: 'influence_2',
    section: 'Influence Mapping',
    question: 'How do you typically influence decisions?',
    type: 'single',
    required: false,
    options: [
      { value: 'direct', label: 'I speak up directly in discussions' },
      { value: 'indirect', label: 'I influence through conversations 1-on-1' },
      { value: 'expert', label: 'My expertise carries weight' },
      { value: 'behind', label: 'I prefer to work behind the scenes' }
    ],
    internal_mapping: {
      signal_type: 'influence_style',
      property_type: 'influence_method'
    }
  }
];

export function getSurvey2ForMember(memberId: string, triggerCriteria: string[]): Question[] {
  const questions: Question[] = [];
  
  for (const triggerId of triggerCriteria) {
    switch (triggerId) {
      case 'high_centrality_low_trust':
      case 'bridge_investigation':
        questions.push(...SURVEY2_QUESTIONS.filter(q => q.section === 'Bridge Investigation'));
        break;
      case 'role_discrepancy':
        questions.push(...SURVEY2_QUESTIONS.filter(q => q.section === 'Role Clarification'));
        break;
      case 'values_tension':
        questions.push(...SURVEY2_QUESTIONS.filter(q => q.section === 'Values Deep-dive'));
        break;
      case 'missing_data':
        questions.push(...SURVEY2_QUESTIONS.filter(q => q.section === 'Gap Filling'));
        break;
      case 'trust_asymmetry':
        questions.push(...SURVEY2_QUESTIONS.filter(q => q.section === 'Influence Mapping'));
        break;
    }
  }
  
  // Remove duplicates
  const seen = new Set();
  return questions.filter(q => {
    if (seen.has(q.id)) return false;
    seen.add(q.id);
    return true;
  });
}
