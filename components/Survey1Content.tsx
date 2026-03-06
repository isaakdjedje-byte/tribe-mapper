'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';

const QUESTIONS = [
  { id: 'a1_name', section: 'Identity', question: 'What should we call you?', description: 'Your name or nickname in the system', type: 'text', placeholder: 'Your name', required: false },
  { id: 'a2_role', section: 'Identity', question: 'How would you describe your role?', description: 'What you actually do day-to-day', type: 'textarea', placeholder: 'e.g., I coordinate between teams, handle logistics, etc.', required: true },
  { id: 'a3_duration', section: 'Identity', question: 'How long have you been part of this group?', type: 'single', required: true, options: [
    { value: 'less_3mo', label: 'Less than 3 months' },
    { value: '3mo_1yr', label: '3–12 months' },
    { value: '1yr_2yr', label: '1–2 years' },
    { value: '2yr_5yr', label: '2–5 years' },
    { value: '5yr_plus', label: '5+ years' }
  ]},
  { id: 'b1_trust', section: 'Relationships', question: 'Who do you trust most?', description: 'Up to 5 people you rely on', type: 'nominate', required: true, maxSelections: 5 },
  { id: 'b2_collaboration', section: 'Relationships', question: 'Who do you work with most closely?', type: 'nominate', required: true, maxSelections: 8 },
  { id: 'b3_influence', section: 'Relationships', question: 'Whose opinions sway decisions?', type: 'nominate', required: true, maxSelections: 5 },
  { id: 'b4_conflicts', section: 'Relationships', question: 'Anyone you find difficult to work with?', description: 'Optional — private and confidential', type: 'nominate', required: false, maxSelections: 5 },
  { id: 'c1_decision', section: 'Behavior', question: 'How are major decisions made?', type: 'single', required: true, options: [
    { value: 'leader_decides', label: 'Leaders decide', description: 'One or two people make the call' },
    { value: 'consensus', label: 'Consensus', description: 'Everyone discusses until agreement' },
    { value: 'vote', label: 'Voting', description: 'Majority rules' },
    { value: 'organic', label: 'Emerges organically', description: 'No explicit process' }
  ]},
  { id: 'c2_conflict', section: 'Behavior', question: 'How are disagreements handled?', type: 'single', required: true, options: [
    { value: 'avoid', label: 'Avoided', description: 'Swept under the rug' },
    { value: 'mediate', label: 'Mediated', description: 'Third party helps resolve' },
    { value: 'confront', label: 'Direct', description: 'Those involved work it out' },
    { value: 'escalate', label: 'Escalated', description: 'Leaders step in' }
  ]},
  { id: 'c3_initiative', section: 'Behavior', question: 'How do new projects start?', type: 'single', required: true, options: [
    { value: 'permission', label: 'Require permission', description: 'Leadership approval needed' },
    { value: 'volunteers', label: 'Volunteers form teams', description: 'Natural collaboration' },
    { value: 'anyone', label: 'Anyone can start', description: 'No formal process' },
    { value: 'committee', label: 'Committee evaluation', description: 'Structured assessment' }
  ]},
  { id: 'c4_information', section: 'Behavior', question: 'How does information flow?', type: 'single', required: true, options: [
    { value: 'top_down', label: 'Top-down', description: 'Leaders announce to group' },
    { value: 'hubs', label: 'Through key people', description: 'Certain individuals spread it' },
    { value: 'network', label: 'Network', description: 'Many conversations' },
    { value: 'chaos', label: 'Chaotic', description: 'Unclear, sometimes late' }
  ]},
  { id: 'd1_values', section: 'Values', question: 'What matters most to this group?', description: 'Select exactly 3', type: 'multi', required: true, minSelections: 3, maxSelections: 3, options: [
    { value: 'quality', label: 'Quality & Excellence' },
    { value: 'speed', label: 'Speed & Results' },
    { value: 'community', label: 'Community & Belonging' },
    { value: 'innovation', label: 'Innovation' },
    { value: 'stability', label: 'Stability' },
    { value: 'autonomy', label: 'Autonomy' },
    { value: 'impact', label: 'Impact' },
    { value: 'fairness', label: 'Fairness' }
  ]},
  { id: 'd2_language', section: 'Values', question: 'What phrases would an outsider not understand?', type: 'textarea', placeholder: 'Inside jokes, project codenames, etc.', required: true },
  { id: 'd3_experiences', section: 'Values', question: 'What moments define this group?', type: 'textarea', placeholder: 'Launches, crises, retreats...', required: true },
  { id: 'd4_vision', section: 'Values', question: 'What should the group work toward?', type: 'textarea', placeholder: 'Where should we be in 1 year?', required: true },
  { id: 'e1_health', section: 'Reflection', question: 'How is the group doing overall?', type: 'scale', required: true, options: [
    { value: '1', label: 'Struggling' },
    { value: '2', label: 'Challenged' },
    { value: '3', label: 'Stable' },
    { value: '4', label: 'Growing' },
    { value: '5', label: 'Thriving' }
  ]},
  { id: 'e2_influence', section: 'Reflection', question: 'How much influence do you have?', type: 'scale', required: true, options: [
    { value: '1', label: 'Minimal' },
    { value: '2', label: 'Some' },
    { value: '3', label: 'Moderate' },
    { value: '4', label: 'High' },
    { value: '5', label: 'Very High' }
  ]}
];

export default function Survey1Content({ token }: { token: string }) {
  const { t } = useLanguage();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [memberId, setMemberId] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [showConsent, setShowConsent] = useState(true);
  const [consentGiven, setConsentGiven] = useState(false);
  const [knownMembers, setKnownMembers] = useState<{id: string; display_name: string}[]>([]);

  useEffect(() => {
    const init = async () => {
      setMemberId(token);
      try {
        const res = await fetch('/api/survey', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'get_or_create_member', anonymous_id: token }) });
        const data = await res.json();
        if (data.member?.status === 'completed') setCompleted(true);
        const rosterRes = await fetch('/api/survey', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'get_roster' }) });
        const rosterData = await rosterRes.json();
        setKnownMembers(rosterData.roster || []);
      } catch (e) { console.error(e); }
      setIsLoading(false);
    };
    init();
  }, [token]);

  const handleAnswer = (questionId: string, value: any) => setAnswers(prev => ({ ...prev, [questionId]: value }));

  const canProceed = () => {
    const q = QUESTIONS[currentQuestion];
    const a = answers[q.id];
    if (!q.required) return true;
    if (a === undefined || a === null) return false;
    if (Array.isArray(a) && a.length === 0) return false;
    if (typeof a === 'string' && a.trim() === '') return false;
    return true;
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const responses = Object.entries(answers).map(([question_id, answer_value]) => ({ question_id, answer_value, answer_type: QUESTIONS.find(q => q.id === question_id)?.type || 'text' }));
      await fetch('/api/survey', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'submit_survey', member_id: memberId, survey_type: 'survey1', responses }) });
      if (answers.a1_name) await fetch('/api/survey', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'update_member', member_id: memberId, display_name: answers.a1_name }) });
      ['b1_trust', 'b2_collaboration', 'b3_influence', 'b4_conflicts'].forEach(async type => {
        const noms = answers[type];
        if (noms?.length) await fetch('/api/survey', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'process_nominations', member_id: memberId, nominations: noms, relationship_type: type.replace('b1_', 'trust').replace('b2_', 'collaboration').replace('b3_', 'influence').replace('b4_', 'conflict') }) });
      });
      setCompleted(true);
    } catch (e) { console.error(e); }
    setIsSubmitting(false);
  };

  if (isLoading) return (
    <div className="container">
      <div className="card" style={{ textAlign: 'center', padding: 'var(--space-10)' }}>
        <p className="text-muted">{t.survey1.loading}</p>
      </div>
    </div>
  );

  if (completed) return (
    <div className="container">
      <div className="card" style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
        <h2>{t.survey1.completed}</h2>
        <p className="text-muted mt-3">{t.survey1.completedMessage}</p>
        <div style={{ marginTop: 'var(--space-6)' }}>
          <LanguageSwitcher />
        </div>
      </div>
    </div>
  );

  if (showConsent) return (
    <div className="container">
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 'var(--space-4)' }}>
          <LanguageSwitcher />
        </div>
        <h2 style={{ marginBottom: 'var(--space-3)' }}>{t.survey1.consent.title}</h2>
        <p className="text-secondary">{t.survey1.consent.description}</p>
        <div className="consent">
          <label className="consent-item"><input type="checkbox" className="checkbox" checked={consentGiven} onChange={(e) => setConsentGiven(e.target.checked)} /><span>{t.survey1.consent.privacy}</span></label>
          <label className="consent-item"><input type="checkbox" className="checkbox" /><span>{t.survey1.consent.skip}</span></label>
          <label className="consent-item"><input type="checkbox" className="checkbox" /><span>{t.survey1.consent.confidential}</span></label>
        </div>
        <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => setShowConsent(false)} disabled={!consentGiven}>{t.survey1.consent.continue}</button>
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
        <div className="progress-header"><span className="progress-label">{q.section}</span><span className="progress-count">{currentQuestion + 1} / {QUESTIONS.length}</span></div>
        <div className="progress-bar"><div className="progress-bar-fill" style={{ width: `${progress}%` }} /></div>
      </div>

      <div className="card" style={{ padding: 'var(--space-6)' }}>
        <h2 style={{ marginBottom: 'var(--space-2)', fontSize: '1.375rem' }}>{q.question}</h2>
        {q.description && <p className="text-muted" style={{ marginBottom: 'var(--space-5)' }}>{q.description}</p>}

        <div style={{ marginTop: 'var(--space-5)' }}>
          {q.type === 'text' && <input type="text" className="input" placeholder={q.placeholder} value={answers[q.id] || ''} onChange={(e) => handleAnswer(q.id, e.target.value)} />}
          {q.type === 'textarea' && <textarea className="textarea" placeholder={q.placeholder} value={answers[q.id] || ''} onChange={(e) => handleAnswer(q.id, e.target.value)} />}

          {(q.type === 'single') && q.options && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              {q.options.map(opt => (
                <div key={opt.value} className={`option ${answers[q.id] === opt.value ? 'selected' : ''}`} onClick={() => handleAnswer(q.id, opt.value)}>
                  <div className="option-label">{opt.label}</div>
                  {'description' in opt && opt.description && <div className="option-desc">{opt.description}</div>}
                </div>
              ))}
            </div>
          )}

          {q.type === 'multi' && q.options && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              {q.options.map(opt => {
                const selected = (answers[q.id] || []).includes(opt.value);
                return (
                  <div key={opt.value} className={`option ${selected ? 'selected' : ''}`} onClick={() => {
                    const current = answers[q.id] || [];
                    if (selected) handleAnswer(q.id, current.filter((v: string) => v !== opt.value));
                    else if (current.length < (q.maxSelections || 10)) handleAnswer(q.id, [...current, opt.value]);
                  }}>
                    <div className="flex items-center gap-3">
                      <div style={{ width: 18, height: 18, borderRadius: 3, border: '2px solid var(--border-strong)', background: selected ? 'var(--primary)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 11 }}>{selected && '✓'}</div>
                      <span className="option-label">{opt.label}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {q.type === 'scale' && q.options && (
            <div className="scale">
              {q.options.map(opt => (
                <div key={opt.value} className={`scale-option ${answers[q.id] === opt.value ? 'selected' : ''}`} onClick={() => handleAnswer(q.id, opt.value)}>
                  <div className="scale-label">{opt.label}</div>
                </div>
              ))}
            </div>
          )}

          {q.type === 'nominate' && (
            <div>
              <p className="hint" style={{ marginBottom: 'var(--space-3)' }}>{t.survey1.selectUpTo.replace('{count}', String(q.maxSelections))}</p>
              <div className="tag-input" style={{ marginBottom: 'var(--space-3)' }}>
                {(answers[q.id] || []).map((id: string) => {
                  const m = knownMembers.find(x => x.id === id);
                  return <div key={id} className="tag">{m?.display_name || 'Unknown'}<span className="tag-remove" onClick={() => handleAnswer(q.id, (answers[q.id] || []).filter((v: string) => v !== id))}>×</span></div>;
                })}
              </div>
              <select className="select" value="" onChange={(e) => { if (e.target.value) { const current = answers[q.id] || []; if (!current.includes(e.target.value) && current.length < (q.maxSelections || 10)) handleAnswer(q.id, [...current, e.target.value]); e.target.value = ''; } }}>
                <option value="">{t.survey1.navigation.back}</option>
                {knownMembers.filter(m => m.id !== memberId).map(m => <option key={m.id} value={m.id}>{m.display_name || 'Anonymous'}</option>)}
              </select>
            </div>
          )}
        </div>

        <div className="flex justify-between" style={{ marginTop: 'var(--space-6)' }}>
          <button className="btn btn-secondary" onClick={() => setCurrentQuestion(p => p - 1)} disabled={currentQuestion === 0}>{t.survey1.navigation.back}</button>
          {currentQuestion === QUESTIONS.length - 1 ? (
            <button className="btn btn-primary" onClick={handleSubmit} disabled={!canProceed() || isSubmitting}>{isSubmitting ? t.survey1.navigation.submitting : t.survey1.navigation.submit}</button>
          ) : (
            <button className="btn btn-primary" onClick={() => setCurrentQuestion(p => p + 1)} disabled={!canProceed()}>{t.survey1.navigation.continue}</button>
          )}
        </div>
      </div>
    </div>
  );
}
