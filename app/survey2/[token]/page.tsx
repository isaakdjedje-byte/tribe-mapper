'use client';

import { useState, useEffect } from 'react';

interface Question {
  id: string;
  section: string;
  question: string;
  description?: string;
  type: 'text' | 'textarea' | 'single' | 'multi' | 'nominate';
  options?: { value: string; label: string; description?: string }[];
  placeholder?: string;
  required: boolean;
  maxSelections?: number;
}

const SURVEY2_QUESTIONS: Question[] = [
  {
    id: 'bridge_1',
    section: 'Bridge Investigation',
    question: 'You were mentioned by people in different parts of the group. How do you stay connected across areas?',
    description: 'We noticed you interact with various subgroups. Tell us about those connections.',
    type: 'textarea',
    required: false,
    placeholder: 'How do you bridge different parts of the group?'
  },
  {
    id: 'bridge_2',
    section: 'Bridge Investigation',
    question: 'Who in the group would you go to for help with a problem outside your usual area?',
    type: 'nominate',
    required: false,
    maxSelections: 3
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
    ]
  },
  {
    id: 'role_2',
    section: 'Role Clarification',
    question: 'If you had to step back from the group, who could fill your role?',
    type: 'nominate',
    required: false,
    maxSelections: 3
  },
  {
    id: 'values_1',
    section: 'Values Deep-dive',
    question: 'When have you felt most aligned with this group? Describe a specific moment.',
    type: 'textarea',
    required: false,
    placeholder: 'A moment when you felt "this is exactly who we are"...'
  },
  {
    id: 'values_2',
    section: 'Values Deep-dive',
    question: 'When have you felt least aligned with this group? Describe a specific moment.',
    type: 'textarea',
    required: false,
    placeholder: 'A moment when you felt "this isn\'t what we\'re about"...'
  },
  {
    id: 'gap_1',
    section: 'Gap Filling',
    question: 'Who in the group do you wish you knew better?',
    description: 'People you\'d like to connect with more.',
    type: 'nominate',
    required: false,
    maxSelections: 3
  },
  {
    id: 'gap_2',
    section: 'Gap Filling',
    question: 'Who in the group seems isolated or disconnected?',
    description: 'People you think might be on the periphery.',
    type: 'nominate',
    required: false,
    maxSelections: 3
  },
  {
    id: 'influence_1',
    section: 'Influence Mapping',
    question: 'Who influences you the most in this group?',
    type: 'nominate',
    required: false,
    maxSelections: 3
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
    ]
  }
];

interface Props {
  params: Promise<{ token: string }>;
}

export default function Survey2Page({ params }: Props) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [memberId, setMemberId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completed, setCompleted] = useState(false);
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
    if (currentQuestion < SURVEY2_QUESTIONS.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      const responses = Object.entries(answers).map(([question_id, answer_value]) => ({
        question_id,
        answer_value,
        answer_type: SURVEY2_QUESTIONS.find(q => q.id === question_id)?.type || 'text'
      })).filter(r => r.answer_value !== undefined);

      if (responses.length > 0) {
        await fetch('/api/survey', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'submit_survey',
            member_id: memberId,
            survey_type: 'survey2',
            responses
          })
        });
      }

      await fetch('/api/survey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_member',
          member_id: memberId,
          survey_stage: 'survey2_completed'
        })
      });

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
            Your additional insights are valuable for understanding the group better.
          </p>
        </div>
      </div>
    );
  }

  const question = SURVEY2_QUESTIONS[currentQuestion];
  const progress = ((currentQuestion + 1) / SURVEY2_QUESTIONS.length) * 100;

  return (
    <div className="container">
      <div className="progress-bar">
        <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
      </div>
      
      <div className="card">
        <div className="flex justify-between items-center mb-2">
          <span className="badge badge-warning">Follow-up Survey</span>
          <span className="text-sm text-muted">{currentQuestion + 1} / {SURVEY2_QUESTIONS.length}</span>
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
          
          {question.type === 'single' && question.options && (
            <div className="grid gap-2 mt-2">
              {question.options.map((opt) => (
                <div
                  key={opt.value}
                  className={`option-card ${answers[question.id] === opt.value ? 'selected' : ''}`}
                  onClick={() => handleAnswer(question.id, opt.value)}
                >
                  <div className="option-label">{opt.label}</div>
                </div>
              ))}
            </div>
          )}
          
          {question.type === 'nominate' && (
            <div>
              <p className="text-sm text-muted mb-2">
                Select up to {question.maxSelections} people.
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
          
          {currentQuestion === SURVEY2_QUESTIONS.length - 1 ? (
            <button
              className="btn btn-primary"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          ) : (
            <button
              className="btn btn-primary"
              onClick={handleNext}
            >
              Continue
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
