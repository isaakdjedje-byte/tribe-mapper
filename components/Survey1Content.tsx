'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';

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

  // Define questions with translation keys
  const QUESTIONS = [
    { 
      id: 'a1_name', 
      section: t.survey1.sections.identity, 
      question: t.survey1.questions.a1_name.question, 
      description: t.survey1.questions.a1_name.description, 
      type: 'text' as const, 
      placeholder: t.survey1.questions.a1_name.placeholder, 
      required: false 
    },
    { 
      id: 'a2_role', 
      section: t.survey1.sections.identity, 
      question: t.survey1.questions.a2_role.question, 
      description: t.survey1.questions.a2_role.description, 
      type: 'textarea' as const, 
      placeholder: t.survey1.questions.a2_role.placeholder, 
      required: true 
    },
    { 
      id: 'a3_duration', 
      section: t.survey1.sections.identity, 
      question: t.survey1.questions.a3_duration.question, 
      type: 'single' as const, 
      required: true, 
      options: [
        { value: 'less_3mo', label: t.survey1.options.duration.less_3mo },
        { value: '3mo_1yr', label: t.survey1.options.duration['3mo_1yr'] },
        { value: '1yr_2yr', label: t.survey1.options.duration['1yr_2yr'] },
        { value: '2yr_5yr', label: t.survey1.options.duration['2yr_5yr'] },
        { value: '5yr_plus', label: t.survey1.options.duration['5yr_plus'] }
      ]
    },
    { 
      id: 'b1_trust', 
      section: t.survey1.sections.relationships, 
      question: t.survey1.questions.b1_trust.question, 
      description: t.survey1.questions.b1_trust.description, 
      type: 'nominate' as const, 
      required: true, 
      maxSelections: 5 
    },
    { 
      id: 'b2_collaboration', 
      section: t.survey1.sections.relationships, 
      question: t.survey1.questions.b2_collaboration.question, 
      type: 'nominate' as const, 
      required: true, 
      maxSelections: 8 
    },
    { 
      id: 'b3_influence', 
      section: t.survey1.sections.relationships, 
      question: t.survey1.questions.b3_influence.question, 
      type: 'nominate' as const, 
      required: true, 
      maxSelections: 5 
    },
    { 
      id: 'b4_conflicts', 
      section: t.survey1.sections.relationships, 
      question: t.survey1.questions.b4_conflicts.question, 
      description: t.survey1.questions.b4_conflicts.description, 
      type: 'nominate' as const, 
      required: false, 
      maxSelections: 5 
    },
    { 
      id: 'c1_decision', 
      section: t.survey1.sections.behavior, 
      question: t.survey1.questions.c1_decision.question, 
      type: 'single' as const, 
      required: true, 
      options: [
        { value: 'leader_decides', label: t.survey1.options.decision.leader_decides.label, description: t.survey1.options.decision.leader_decides.description },
        { value: 'consensus', label: t.survey1.options.decision.consensus.label, description: t.survey1.options.decision.consensus.description },
        { value: 'vote', label: t.survey1.options.decision.vote.label, description: t.survey1.options.decision.vote.description },
        { value: 'organic', label: t.survey1.options.decision.organic.label, description: t.survey1.options.decision.organic.description }
      ]
    },
    { 
      id: 'c2_conflict', 
      section: t.survey1.sections.behavior, 
      question: t.survey1.questions.c2_conflict.question, 
      type: 'single' as const, 
      required: true, 
      options: [
        { value: 'avoid', label: t.survey1.options.conflict.avoid.label, description: t.survey1.options.conflict.avoid.description },
        { value: 'mediate', label: t.survey1.options.conflict.mediate.label, description: t.survey1.options.conflict.mediate.description },
        { value: 'confront', label: t.survey1.options.conflict.confront.label, description: t.survey1.options.conflict.confront.description },
        { value: 'escalate', label: t.survey1.options.conflict.escalate.label, description: t.survey1.options.conflict.escalate.description }
      ]
    },
    { 
      id: 'c3_initiative', 
      section: t.survey1.sections.behavior, 
      question: t.survey1.questions.c3_initiative.question, 
      type: 'single' as const, 
      required: true, 
      options: [
        { value: 'permission', label: t.survey1.options.initiative.permission.label, description: t.survey1.options.initiative.permission.description },
        { value: 'volunteers', label: t.survey1.options.initiative.volunteers.label, description: t.survey1.options.initiative.volunteers.description },
        { value: 'anyone', label: t.survey1.options.initiative.anyone.label, description: t.survey1.options.initiative.anyone.description },
        { value: 'committee', label: t.survey1.options.initiative.committee.label, description: t.survey1.options.initiative.committee.description }
      ]
    },
    { 
      id: 'c4_information', 
      section: t.survey1.sections.behavior, 
      question: t.survey1.questions.c4_information.question, 
      type: 'single' as const, 
      required: true, 
      options: [
        { value: 'top_down', label: t.survey1.options.information.top_down.label, description: t.survey1.options.information.top_down.description },
        { value: 'hubs', label: t.survey1.options.information.hubs.label, description: t.survey1.options.information.hubs.description },
        { value: 'network', label: t.survey1.options.information.network.label, description: t.survey1.options.information.network.description },
        { value: 'chaos', label: t.survey1.options.information.chaos.label, description: t.survey1.options.information.chaos.description }
      ]
    },
    { 
      id: 'd1_values', 
      section: t.survey1.sections.values, 
      question: t.survey1.questions.d1_values.question, 
      description: t.survey1.questions.d1_values.description, 
      type: 'multi' as const, 
      required: true, 
      minSelections: 3, 
      maxSelections: 3, 
      options: [
        { value: 'quality', label: t.survey1.options.values.quality },
        { value: 'speed', label: t.survey1.options.values.speed },
        { value: 'community', label: t.survey1.options.values.community },
        { value: 'innovation', label: t.survey1.options.values.innovation },
        { value: 'stability', label: t.survey1.options.values.stability },
        { value: 'autonomy', label: t.survey1.options.values.autonomy },
        { value: 'impact', label: t.survey1.options.values.impact },
        { value: 'fairness', label: t.survey1.options.values.fairness }
      ]
    },
    { 
      id: 'd2_language', 
      section: t.survey1.sections.values, 
      question: t.survey1.questions.d2_language.question, 
      type: 'textarea' as const, 
      placeholder: t.survey1.questions.d2_language.placeholder, 
      required: true 
    },
    { 
      id: 'd3_experiences', 
      section: t.survey1.sections.values, 
      question: t.survey1.questions.d3_experiences.question, 
      type: 'textarea' as const, 
      placeholder: t.survey1.questions.d3_experiences.placeholder, 
      required: true 
    },
    { 
      id: 'd4_vision', 
      section: t.survey1.sections.values, 
      question: t.survey1.questions.d4_vision.question, 
      type: 'textarea' as const, 
      placeholder: t.survey1.questions.d4_vision.placeholder, 
      required: true 
    },
    { 
      id: 'e1_health', 
      section: t.survey1.sections.reflection, 
      question: t.survey1.questions.e1_health.question, 
      type: 'scale' as const, 
      required: true, 
      options: [
        { value: '1', label: t.survey1.options.health['1'] },
        { value: '2', label: t.survey1.options.health['2'] },
        { value: '3', label: t.survey1.options.health['3'] },
        { value: '4', label: t.survey1.options.health['4'] },
        { value: '5', label: t.survey1.options.health['5'] }
      ]
    },
    { 
      id: 'e2_influence', 
      section: t.survey1.sections.reflection, 
      question: t.survey1.questions.e2_influence.question, 
      type: 'scale' as const, 
      required: true, 
      options: [
        { value: '1', label: t.survey1.options.influence['1'] },
        { value: '2', label: t.survey1.options.influence['2'] },
        { value: '3', label: t.survey1.options.influence['3'] },
        { value: '4', label: t.survey1.options.influence['4'] },
        { value: '5', label: t.survey1.options.influence['5'] }
      ]
    }
  ];

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
                <option value="">{t.survey1.navigation.selectSomeone}</option>
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
