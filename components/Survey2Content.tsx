'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';

const QUESTIONS = [
  { id: 'bridge_1', section: 'Follow-up', question: 'How do you stay connected across different parts of the group?', type: 'textarea', placeholder: 'Describe your bridging role...', required: false },
  { id: 'bridge_2', section: 'Follow-up', question: 'Who would you go to for help outside your usual area?', type: 'nominate', required: false, maxSelections: 3 },
  { id: 'role_1', section: 'Follow-up', question: 'How has your role changed recently?', type: 'single', required: false, options: [
    { value: 'more_central', label: 'More central/influential' },
    { value: 'less_central', label: 'Less central' },
    { value: 'same', label: 'Stayed the same' },
    { value: 'changed', label: 'Changed in nature' }
  ]},
  { id: 'role_2', section: 'Follow-up', question: 'If you stepped back, who could fill your role?', type: 'nominate', required: false, maxSelections: 3 },
  { id: 'values_1', section: 'Follow-up', question: 'When did you feel most aligned with the group?', type: 'textarea', placeholder: 'A specific moment...', required: false },
  { id: 'values_2', section: 'Follow-up', question: 'When did you feel least aligned with the group?', type: 'textarea', placeholder: 'A specific moment...', required: false },
  { id: 'gap_1', section: 'Follow-up', question: 'Who do you wish you knew better?', type: 'nominate', required: false, maxSelections: 3 },
  { id: 'gap_2', section: 'Follow-up', question: 'Who seems isolated or disconnected?', type: 'nominate', required: false, maxSelections: 3 },
  { id: 'influence_1', section: 'Follow-up', question: 'Who influences you most?', type: 'nominate', required: false, maxSelections: 3 },
  { id: 'influence_2', section: 'Follow-up', question: 'How do you influence decisions?', type: 'single', required: false, options: [
    { value: 'direct', label: 'Speak up in discussions' },
    { value: 'indirect', label: 'One-on-one conversations' },
    { value: 'expert', label: 'My expertise carries weight' },
    { value: 'behind', label: 'Behind the scenes' }
  ]}
];

export default function Survey2Content({ token }: { token: string }) {
  const { t } = useLanguage();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [memberId, setMemberId] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [knownMembers, setKnownMembers] = useState<{id: string; display_name: string}[]>([]);

  useEffect(() => {
    const init = async () => {
      setMemberId(token);
      try {
        await fetch('/api/survey', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'get_or_create_member', anonymous_id: token }) });
        const rosterRes = await fetch('/api/survey', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'get_roster' }) });
        const rosterData = await rosterRes.json();
        setKnownMembers(rosterData.roster || []);
      } catch (e) { console.error(e); }
      setIsLoading(false);
    };
    init();
  }, [token]);

  const handleAnswer = (questionId: string, value: any) => setAnswers(prev => ({ ...prev, [questionId]: value }));

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const responses = Object.entries(answers).map(([question_id, answer_value]) => ({ question_id, answer_value, answer_type: QUESTIONS.find(q => q.id === question_id)?.type || 'text' })).filter(r => r.answer_value !== undefined);
      if (responses.length > 0) await fetch('/api/survey', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'submit_survey', member_id: memberId, survey_type: 'survey2', responses }) });
      await fetch('/api/survey', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'update_member', member_id: memberId, survey_stage: 'survey2_completed' }) });
      setCompleted(true);
    } catch (e) { console.error(e); }
    setIsSubmitting(false);
  };

  if (isLoading) return (
    <div className="container">
      <div className="card" style={{ textAlign: 'center', padding: 'var(--space-10)' }}>
        <p className="text-muted">{t.survey2.loading}</p>
      </div>
    </div>
  );

  if (completed) return (
    <div className="container">
      <div className="card" style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
        <h2>{t.survey2.completed}</h2>
        <p className="text-muted mt-3">{t.survey2.completedMessage}</p>
        <div style={{ marginTop: 'var(--space-6)' }}>
          <LanguageSwitcher />
        </div>
      </div>
    </div>
  );

  const q = QUESTIONS[currentQuestion];
  const progress = ((currentQuestion + 1) / QUESTIONS.length) * 100;

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 'var(--space-4)' }}>
        <LanguageSwitcher />
      </div>
      <div className="progress">
        <div className="progress-header"><span className="progress-label">{t.survey2.followUpQuestions}</span><span className="progress-count">{currentQuestion + 1} / {QUESTIONS.length}</span></div>
        <div className="progress-bar"><div className="progress-bar-fill" style={{ width: `${progress}%` }} /></div>
      </div>

      <div className="card" style={{ padding: 'var(--space-6)' }}>
        <h2 style={{ marginBottom: 'var(--space-2)', fontSize: '1.375rem' }}>{q.question}</h2>
        
        <div style={{ marginTop: 'var(--space-5)' }}>
          {q.type === 'textarea' && <textarea className="textarea" placeholder={q.placeholder} value={answers[q.id] || ''} onChange={(e) => handleAnswer(q.id, e.target.value)} />}
          
          {q.type === 'single' && q.options && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              {q.options.map(opt => (
                <div key={opt.value} className={`option ${answers[q.id] === opt.value ? 'selected' : ''}`} onClick={() => handleAnswer(q.id, opt.value)}>
                  <div className="option-label">{opt.label}</div>
                </div>
              ))}
            </div>
          )}

          {q.type === 'nominate' && (
            <div>
              <p className="hint" style={{ marginBottom: 'var(--space-3)' }}>{t.survey2.selectUpTo.replace('{count}', String(q.maxSelections))}</p>
              <div className="tag-input" style={{ marginBottom: 'var(--space-3)' }}>
                {(answers[q.id] || []).map((id: string) => {
                  const m = knownMembers.find(x => x.id === id);
                  return <div key={id} className="tag">{m?.display_name || 'Unknown'}<span className="tag-remove" onClick={() => handleAnswer(q.id, (answers[q.id] || []).filter((v: string) => v !== id))}>×</span></div>;
                })}
              </div>
              <select className="select" value="" onChange={(e) => { if (e.target.value) { const current = answers[q.id] || []; if (!current.includes(e.target.value) && current.length < (q.maxSelections || 10)) handleAnswer(q.id, [...current, e.target.value]); e.target.value = ''; } }}>
                <option value="">{t.survey2.back}</option>
                {knownMembers.filter(m => m.id !== memberId).map(m => <option key={m.id} value={m.id}>{m.display_name || 'Anonymous'}</option>)}
              </select>
            </div>
          )}
        </div>

        <div className="flex justify-between" style={{ marginTop: 'var(--space-6)' }}>
          <button className="btn btn-secondary" onClick={() => setCurrentQuestion(p => p - 1)} disabled={currentQuestion === 0}>{t.survey2.back}</button>
          {currentQuestion === QUESTIONS.length - 1 ? (
            <button className="btn btn-primary" onClick={handleSubmit} disabled={isSubmitting}>{isSubmitting ? t.survey2.submitting : t.survey2.submit}</button>
          ) : (
            <button className="btn btn-primary" onClick={() => setCurrentQuestion(p => p + 1)}>{t.survey2.continue}</button>
          )}
        </div>
      </div>
    </div>
  );
}
