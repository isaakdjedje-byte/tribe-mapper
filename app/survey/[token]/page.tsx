'use client';

import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

interface Question {
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
  };
}

const SURVEY1_QUESTIONS: Question[] = [
  {
    id: 'a1_name',
    section: 'Identity',
    question: 'What should we call you?',
    description: 'This is how you\'ll appear in the system. You can use your real name or a nickname.',
    type: 'text',
    placeholder: 'Your name or alias',
    required: false,
    internal_mapping: { signal_type: 'identity', property_type: 'display_name' }
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
    internal_mapping: { signal_type: 'self_role_description', property_type: 'role_self_description' }
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
    internal_mapping: { signal_type: 'tenure', property_type: 'member_tenure' }
  },
  {
    id: 'b1_trust',
    section: 'Relationships',
    question: 'Who in the group do you trust most?',
    description: 'People you would go to with a problem, share sensitive info with, or rely on when it matters. List up to 5.',
    type: 'nominate',
    required: true,
    maxSelections: 5,
    internal_mapping: { signal_type: 'trust_nomination', edge_type: 'trust', property_type: 'trusted_by' }
  },
  {
    id: 'b2_collaboration',
    section: 'Relationships',
    question: 'Who do you work with most closely on group activities?',
    description: 'People you regularly coordinate with, collaborate with, or work alongside.',
    type: 'nominate',
    required: true,
    maxSelections: 8,
    internal_mapping: { signal_type: 'collaboration_nomination', edge_type: 'collaboration', property_type: 'collaborates_with' }
  },
  {
    id: 'b3_influence',
    section: 'Relationships',
    question: 'Whose opinions typically sway decisions in the group?',
    description: 'When these people speak up, others tend to listen and go along.',
    type: 'nominate',
    required: true,
    maxSelections: 5,
    internal_mapping: { signal_type: 'influence_nomination', edge_type: 'influence', property_type: 'influenced_by' }
  },
  {
    id: 'b4_conflicts',
    section: 'Relationships',
    question: 'Are there people you sometimes disagree with or find difficult to work with?',
    description: 'This is private. It helps identify tension points. You can skip this.',
    type: 'nominate',
    required: false,
    maxSelections: 5,
    internal_mapping: { signal_type: 'conflict_nomination', edge_type: 'conflict', property_type: 'tension_with' }
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
    internal_mapping: { signal_type: 'decision_pattern', property_type: 'culture_decision_style' }
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
    internal_mapping: { signal_type: 'conflict_resolution', property_type: 'culture_conflict_style' }
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
    internal_mapping: { signal_type: 'initiative_pattern', property_type: 'culture_initiation_style' }
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
    internal_mapping: { signal_type: 'information_flow', property_type: 'culture_communication_style' }
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
    internal_mapping: { signal_type: 'values_nomination', property_type: 'group_values' }
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
    internal_mapping: { signal_type: 'tribe_language', property_type: 'shared_vocabulary' }
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
    internal_mapping: { signal_type: 'shared_experiences', property_type: 'group_narrative' }
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
    internal_mapping: { signal_type: 'vision', property_type: 'group_aspiration' }
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
    internal_mapping: { signal_type: 'group_health', property_type: 'perceived_group_state' }
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
    internal_mapping: { signal_type: 'self_perceived_influence', property_type: 'self_centrality' }
  }
];

interface Props {
  params: Promise<{ token: string }>;
}

export default function SurveyPage({ params }: Props) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [memberId, setMemberId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [showConsent, setShowConsent] = useState(true);
  const [consentGiven, setConsentGiven] = useState(false);
  const [knownMembers, setKnownMembers] = useState<{id: string; display_name: string}[]>([]);

  useEffect(() => {
    const initSurvey = async () => {
      const { token } = await params;
      setMemberId(token);
      
      try {
        const res = await fetch('/api/survey', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            action: 'get_or_create_member', 
            anonymous_id: token 
          })
        });
        const data = await res.json();
        
        if (data.member?.status === 'completed') {
          setCompleted(true);
        }
        
        const rosterRes = await fetch('/api/survey', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'get_roster' })
        });
        const rosterData = await rosterRes.json();
        setKnownMembers(rosterData.roster || []);
        
      } catch (e) {
        console.error('Init error:', e);
      }
      
      setIsLoading(false);
    };
    
    initSurvey();
  }, [params]);

  const handleAnswer = (questionId: string, value: any) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleNext = () => {
    if (currentQuestion < SURVEY1_QUESTIONS.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const canProceed = () => {
    const question = SURVEY1_QUESTIONS[currentQuestion];
    const answer = answers[question.id];
    
    if (!question.required) return true;
    if (answer === undefined || answer === null) return false;
    if (Array.isArray(answer) && answer.length === 0) return false;
    if (typeof answer === 'string' && answer.trim() === '') return false;
    return true;
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      const responses = Object.entries(answers).map(([question_id, answer_value]) => ({
        question_id,
        answer_value,
        answer_type: SURVEY1_QUESTIONS.find(q => q.id === question_id)?.type || 'text'
      }));

      const res = await fetch('/api/survey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'submit_survey',
          member_id: memberId,
          survey_type: 'survey1',
          responses
        })
      });

      if (answers.a1_name) {
        await fetch('/api/survey', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'update_member',
            member_id: memberId,
            display_name: answers.a1_name
          })
        });
      }

      const trustNoms = answers.b1_trust || [];
      const collabNoms = answers.b2_collaboration || [];
      const influenceNoms = answers.b3_influence || [];
      const conflictNoms = answers.b4_conflicts || [];

      if (trustNoms.length > 0) {
        await fetch('/api/survey', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'process_nominations',
            member_id: memberId,
            nominations: trustNoms,
            relationship_type: 'trust'
          })
        });
      }

      if (collabNoms.length > 0) {
        await fetch('/api/survey', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'process_nominations',
            member_id: memberId,
            nominations: collabNoms,
            relationship_type: 'collaboration'
          })
        });
      }

      if (influenceNoms.length > 0) {
        await fetch('/api/survey', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'process_nominations',
            member_id: memberId,
            nominations: influenceNoms,
            relationship_type: 'influence'
          })
        });
      }

      if (conflictNoms.length > 0) {
        await fetch('/api/survey', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'process_nominations',
            member_id: memberId,
            nominations: conflictNoms,
            relationship_type: 'conflict'
          })
        });
      }

      setCompleted(true);
    } catch (e) {
      console.error('Submit error:', e);
    }
    
    setIsSubmitting(false);
  };

  if (isLoading) {
    return (
      <div className="container">
        <div className="card text-center" style={{ padding: '4rem' }}>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (completed) {
    return (
      <div className="container">
        <div className="card text-center" style={{ padding: '3rem' }}>
          <h1>Thank You!</h1>
          <p className="text-muted mt-2">
            Your responses have been recorded. Your input helps us understand the group better.
          </p>
        </div>
      </div>
    );
  }

  if (showConsent) {
    return (
      <div className="container">
        <div className="card">
          <h1>Help Us Understand Our Group</h1>
          <p className="text-muted mt-2">
            This survey helps us map relationships, understand roles, and identify how we work together.
          </p>
          
          <div className="consent-box">
            <h3>Your Privacy</h3>
            <div className="consent-item">
              <input type="checkbox" className="checkbox" id="consent1" />
              <label htmlFor="consent1">
                I understand that my responses are confidential and will be used to understand group dynamics.
              </label>
            </div>
            <div className="consent-item">
              <input type="checkbox" className="checkbox" id="consent2" />
              <label htmlFor="consent2">
                I can skip any question or withdraw at any time.
              </label>
            </div>
            <div className="consent-item">
              <input type="checkbox" className="checkbox" id="consent3" />
              <label htmlFor="consent3">
                I understand my data will be stored securely and won't be shared with other members.
              </label>
            </div>
          </div>
          
          <button 
            className="btn btn-primary" 
            style={{ width: '100%', marginTop: '1rem' }}
            onClick={() => setShowConsent(false)}
          >
            Continue to Survey
          </button>
        </div>
      </div>
    );
  }

  const question = SURVEY1_QUESTIONS[currentQuestion];
  const progress = ((currentQuestion + 1) / SURVEY1_QUESTIONS.length) * 100;

  return (
    <div className="container">
      <div className="progress-bar">
        <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
      </div>
      
      <div className="card">
        <div className="flex justify-between items-center mb-2">
          <span className="badge badge-info">{question.section}</span>
          <span className="text-sm text-muted">{currentQuestion + 1} / {SURVEY1_QUESTIONS.length}</span>
        </div>
        
        <h2>{question.question}</h2>
        {question.description && <p className="description mt-2">{question.description}</p>}
        
        <div style={{ marginTop: '1.5rem' }}>
          {question.type === 'text' && (
            <input
              type="text"
              className="input"
              placeholder={question.placeholder}
              value={answers[question.id] || ''}
              onChange={(e) => handleAnswer(question.id, e.target.value)}
            />
          )}
          
          {question.type === 'textarea' && (
            <textarea
              className="textarea"
              placeholder={question.placeholder}
              value={answers[question.id] || ''}
              onChange={(e) => handleAnswer(question.id, e.target.value)}
            />
          )}
          
          {(question.type === 'single' || question.type === 'scenario') && question.options && (
            <div className="grid gap-2 mt-2">
              {question.options.map((opt) => (
                <div
                  key={opt.value}
                  className={`option-card ${answers[question.id] === opt.value ? 'selected' : ''}`}
                  onClick={() => handleAnswer(question.id, opt.value)}
                >
                  <div className="option-label">{opt.label}</div>
                  {opt.description && <div className="option-description">{opt.description}</div>}
                </div>
              ))}
            </div>
          )}
          
          {question.type === 'multi' && question.options && (
            <div className="grid gap-2 mt-2">
              {question.options.map((opt) => {
                const selected = (answers[question.id] || []).includes(opt.value);
                return (
                  <div
                    key={opt.value}
                    className={`option-card ${selected ? 'selected' : ''}`}
                    onClick={() => {
                      const current = answers[question.id] || [];
                      let updated;
                      if (selected) {
                        updated = current.filter((v: string) => v !== opt.value);
                      } else {
                        if (current.length >= (question.maxSelections || 10)) return;
                        updated = [...current, opt.value];
                      }
                      handleAnswer(question.id, updated);
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <div style={{
                        width: 20, height: 20,
                        borderRadius: 4,
                        border: '2px solid var(--color-border)',
                        background: selected ? 'var(--color-primary)' : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: 12
                      }}>
                        {selected && '✓'}
                      </div>
                      <div>
                        <div className="option-label">{opt.label}</div>
                        {opt.description && <div className="option-description">{opt.description}</div>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          
          {question.type === 'scale' && question.options && (
            <div className="scale-container mt-2">
              {question.options.map((opt) => (
                <div
                  key={opt.value}
                  className={`scale-option ${answers[question.id] === opt.value ? 'selected' : ''}`}
                  onClick={() => handleAnswer(question.id, opt.value)}
                >
                  <div className="scale-label">{opt.label}</div>
                  <div className="scale-desc">{opt.description}</div>
                </div>
              ))}
            </div>
          )}
          
          {question.type === 'nominate' && (
            <div>
              <p className="text-sm text-muted mb-2">
                Select up to {question.maxSelections} people. You can search or select from the list.
              </p>
              <div className="tag-input-container" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                {(answers[question.id] || []).map((id: string) => {
                  const member = knownMembers.find(m => m.id === id);
                  return (
                    <div key={id} className="tag">
                      {member?.display_name || 'Unknown'}
                      <span className="tag-remove" onClick={() => {
                        const current = answers[question.id] || [];
                        handleAnswer(question.id, current.filter((v: string) => v !== id));
                      }}>×</span>
                    </div>
                  );
                })}
              </div>
              <select
                className="select mt-2"
                onChange={(e) => {
                  if (!e.target.value) return;
                  const current = answers[question.id] || [];
                  if (!current.includes(e.target.value) && current.length < (question.maxSelections || 10)) {
                    handleAnswer(question.id, [...current, e.target.value]);
                  }
                  e.target.value = '';
                }}
                value=""
              >
                <option value="">Select someone...</option>
                {knownMembers.filter(m => m.id !== memberId).map(m => (
                  <option key={m.id} value={m.id}>{m.display_name || 'Anonymous'}</option>
                ))}
              </select>
            </div>
          )}
        </div>
        
        <div className="flex justify-between mt-4">
          <button
            className="btn btn-ghost"
            onClick={handlePrev}
            disabled={currentQuestion === 0}
          >
            Back
          </button>
          
          {currentQuestion === SURVEY1_QUESTIONS.length - 1 ? (
            <button
              className="btn btn-primary"
              onClick={handleSubmit}
              disabled={!canProceed() || isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          ) : (
            <button
              className="btn btn-primary"
              onClick={handleNext}
              disabled={!canProceed()}
            >
              Continue
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
