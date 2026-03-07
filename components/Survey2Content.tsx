'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';

interface Survey2ContentProps {
  token: string;
}

// Survey 2 is lighter and context-aware
// It clarifies bridges, role changes, missing people
export default function Survey2Content({ token }: Survey2ContentProps) {
  const { t, language } = useLanguage();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [memberId, setMemberId] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [knownMembers, setKnownMembers] = useState<{id: string; display_name: string}[]>([]);
  const [manualEntryName, setManualEntryName] = useState('');
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [provisionalMembers, setProvisionalMembers] = useState<{id: string; name: string}[]>([]);

  // Simple Survey 2 questions - lighter follow-up
  const QUESTIONS = [
    {
      id: 'bridge_clarify',
      section: language === 'fr' ? 'Suivi' : 'Follow-up',
      question: language === 'fr' 
        ? 'Y a-t-il des personnes qui connectent différentes parties de votre réseau ?'
        : 'Are there people who connect different parts of your network?',
      description: language === 'fr'
        ? 'Ceux qui présentent les gens ou maintiennent le lien entre différents groupes'
        : 'Those who introduce people or keep connections between different groups',
      type: 'nominate' as const,
      required: false,
      maxSelections: 5
    },
    {
      id: 'role_changed',
      section: language === 'fr' ? 'Suivi' : 'Follow-up',
      question: language === 'fr'
        ? 'Ta place dans ce réseau a-t-elle changé récemment ?'
        : 'Has your place in this network changed recently?',
      type: 'single' as const,
      required: false,
      options: [
        { value: 'more_central', label: language === 'fr' ? 'Plus central(e)' : 'More central' },
        { value: 'less_central', label: language === 'fr' ? 'Moins central(e)' : 'Less central' },
        { value: 'same', label: language === 'fr' ? 'Restée la même' : 'Stayed the same' },
        { value: 'different', label: language === 'fr' ? 'Différente mais pas plus/moins' : 'Different but not more/less' }
      ]
    },
    {
      id: 'missing_people',
      section: language === 'fr' ? 'Suivi' : 'Follow-up',
      question: language === 'fr'
        ? 'Y a-t-il des personnes importantes qui ne sont pas encore dans cette liste ?'
        : 'Are there important people not yet on this list?',
      description: language === 'fr'
        ? 'Noms de personnes qui devraient être incluses'
        : 'Names of people who should be included',
      type: 'textarea' as const,
      placeholder: language === 'fr' 
        ? 'Ex. Sarah, mon cousin Marc...'
        : 'e.g., Sarah, my cousin Mark...',
      required: false
    },
    {
      id: 'deeper_insight',
      section: language === 'fr' ? 'Suivi' : 'Follow-up',
      question: language === 'fr'
        ? 'Y a-t-il quelque chose d\'important que nous n\'avons pas encore capturé ?'
        : 'Is there anything important we haven\'t captured yet?',
      type: 'textarea' as const,
      placeholder: language === 'fr'
        ? 'Toute observation, sentiment, ou détail qui aiderait à mieux comprendre...'
        : 'Any observation, feeling, or detail that would help understand better...',
      required: false
    }
  ];

  useEffect(() => {
    const init = async () => {
      setMemberId(token);
      try {
        const res = await fetch('/api/survey', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'get_or_create_member', anonymous_id: token })
        });
        const data = await res.json();
        if (data.member?.status === 'completed' && data.member?.survey_stage !== 'survey2_pending') {
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
        console.error(e);
      }
      setIsLoading(false);
    };
    init();
  }, [token]);

  const handleAnswer = (questionId: string, value: any) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleAddManualEntry = () => {
    if (manualEntryName.trim()) {
      const provisionalId = `provisional_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      setProvisionalMembers(prev => [...prev, { id: provisionalId, name: manualEntryName.trim() }]);
      setManualEntryName('');
      setShowManualEntry(false);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Save responses
      const responses = QUESTIONS.map(q => ({
        question_id: q.id,
        answer_value: JSON.stringify(answers[q.id] || ''),
        answer_type: q.type
      })).filter(r => r.answer_value !== '""');

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

      // Process nominations for bridge_clarify
      const bridgeNominations = answers['bridge_clarify'] || [];
      if (bridgeNominations.length > 0) {
        await fetch('/api/survey', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'process_nominations',
            member_id: memberId,
            nominations: bridgeNominations.filter((id: string) => !id.startsWith('provisional_')),
            relationship_type: 'bridge'
          })
        });
      }

      setCompleted(true);
    } catch (e) {
      console.error(e);
    }
    setIsSubmitting(false);
  };

  const canProceed = () => {
    const q = QUESTIONS[currentQuestion];
    if (!q.required) return true;
    const val = answers[q.id];
    return val && (Array.isArray(val) ? val.length > 0 : val !== '');
  };

  if (isLoading) {
    return (
      <div className="loading" style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
        <div className="spinner" style={{ margin: '0 auto var(--space-4)' }} />
        <p>{t.survey?.loading}</p>
      </div>
    );
  }

  if (completed) {
    return (
      <div className="completed" style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
        <h2 style={{ marginBottom: 'var(--space-4)' }}>{t.survey?.completed}</h2>
        <p>{t.survey?.completedMessage}</p>
      </div>
    );
  }

  const q = QUESTIONS[currentQuestion];

  return (
    <div className="survey-container" style={{ maxWidth: '700px', margin: '0 auto', padding: 'var(--space-6)' }}>
      <div style={{ marginBottom: 'var(--space-4)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            {language === 'fr' ? 'Suivi' : 'Follow-up'} • {currentQuestion + 1} / {QUESTIONS.length}
          </span>
          <h2 style={{ fontSize: '1.25rem', marginTop: 'var(--space-1)' }}>{q.section}</h2>
        </div>
        <LanguageSwitcher />
      </div>

      <div className="question-card" style={{ marginBottom: 'var(--space-6)' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: 'var(--space-2)' }}>
          {q.question}
        </h3>
        {q.description && (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: 'var(--space-3)' }}>
            {q.description}
          </p>
        )}

        {q.type === 'textarea' && (
          <textarea
            className="textarea"
            placeholder={q.placeholder || ''}
            value={answers[q.id] || ''}
            onChange={(e) => handleAnswer(q.id, e.target.value)}
            rows={4}
          />
        )}

        {q.type === 'single' && q.options && (
          <div className="options-list">
            {q.options.map(opt => (
              <label
                key={opt.value}
                className={`option-label ${answers[q.id] === opt.value ? 'selected' : ''}`}
                style={{
                  display: 'block',
                  padding: 'var(--space-3)',
                  marginBottom: 'var(--space-2)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  cursor: 'pointer',
                  background: answers[q.id] === opt.value ? 'var(--primary-subtle)' : 'transparent'
                }}
              >
                <input
                  type="radio"
                  name={q.id}
                  value={opt.value}
                  checked={answers[q.id] === opt.value}
                  onChange={() => handleAnswer(q.id, opt.value)}
                  style={{ marginRight: 'var(--space-2)' }}
                />
                <span>{opt.label}</span>
              </label>
            ))}
          </div>
        )}

        {q.type === 'nominate' && (
          <div className="nominate-input">
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: 'var(--space-2)' }}>
              {t.survey?.selectUpTo?.replace('{count}', String(q.maxSelections || 5))}
            </p>
            
            {/* Selected people */}
            <div style={{ marginBottom: 'var(--space-3)' }}>
              {(answers[q.id] || []).map((id: string) => {
                const known = knownMembers.find(m => m.id === id);
                const provisional = provisionalMembers.find(m => m.id === id);
                return (
                  <span
                    key={id}
                    className="tag"
                    style={{
                      display: 'inline-block',
                      padding: 'var(--space-1) var(--space-2)',
                      margin: 'var(--space-1)',
                      background: 'var(--primary-subtle)',
                      borderRadius: 'var(--radius)',
                      fontSize: '0.875rem'
                    }}
                  >
                    {known?.display_name || provisional?.name || 'Unknown'}
                    <button
                      onClick={() => handleAnswer(q.id, (answers[q.id] || []).filter((v: string) => v !== id))}
                      style={{
                        marginLeft: 'var(--space-1)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: 'var(--text-muted)'
                      }}
                    >
                      ×
                    </button>
                  </span>
                );
              })}
            </div>

            {/* Roster dropdown + manual entry */}
            <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
              <select
                className="select"
                value=""
                onChange={(e) => {
                  if (e.target.value) {
                    const current = answers[q.id] || [];
                    if (!current.includes(e.target.value) && current.length < (q.maxSelections || 10)) {
                      handleAnswer(q.id, [...current, e.target.value]);
                    }
                    e.target.value = '';
                  }
                }}
                style={{ flex: 1, minWidth: '200px' }}
              >
                <option value="">{t.survey?.navigation?.selectSomeone}</option>
                {knownMembers
                  .filter(m => m.id !== memberId && !(answers[q.id] || []).includes(m.id))
                  .map(m => (
                    <option key={m.id} value={m.id}>{m.display_name || 'Anonymous'}</option>
                  ))}
              </select>

              {!showManualEntry ? (
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowManualEntry(true)}
                  style={{ whiteSpace: 'nowrap' }}
                >
                  {t.survey?.navigation?.addSomeone}
                </button>
              ) : (
                <div style={{ display: 'flex', gap: 'var(--space-2)', flex: 1 }}>
                  <input
                    type="text"
                    className="input"
                    placeholder={t.survey?.navigation?.typeName}
                    value={manualEntryName}
                    onChange={(e) => setManualEntryName(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddManualEntry()}
                    style={{ flex: 1 }}
                  />
                  <button className="btn btn-primary" onClick={handleAddManualEntry}>
                    {t.survey?.navigation?.add}
                  </button>
                  <button className="btn btn-secondary" onClick={() => setShowManualEntry(false)}>
                    {t.survey?.navigation?.back}
                  </button>
                </div>
              )}
            </div>

            {/* Show provisional members */}
            {provisionalMembers.length > 0 && (
              <div style={{ marginTop: 'var(--space-3)' }}>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 'var(--space-1)' }}>
                  {language === 'fr' ? 'Personnes ajoutées manuellement:' : 'Manually added people:'}
                </p>
                {provisionalMembers
                  .filter(m => !(answers[q.id] || []).includes(m.id))
                  .map(m => (
                    <button
                      key={m.id}
                      onClick={() => {
                        const current = answers[q.id] || [];
                        if (current.length < (q.maxSelections || 10)) {
                          handleAnswer(q.id, [...current, m.id]);
                        }
                      }}
                      style={{
                        display: 'inline-block',
                        padding: 'var(--space-1) var(--space-2)',
                        margin: 'var(--space-1)',
                        background: 'var(--surface-alt)',
                        border: '1px dashed var(--border)',
                        borderRadius: 'var(--radius)',
                        fontSize: '0.875rem',
                        cursor: 'pointer'
                      }}
                    >
                      + {m.name}
                    </button>
                  ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <button
          className="btn btn-secondary"
          onClick={() => setCurrentQuestion(p => p - 1)}
          disabled={currentQuestion === 0}
        >
          {t.survey?.navigation?.back}
        </button>

        {currentQuestion === QUESTIONS.length - 1 ? (
          <button
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? t.survey?.navigation?.submitting : t.survey?.navigation?.submit}
          </button>
        ) : (
          <button
            className="btn btn-primary"
            onClick={() => setCurrentQuestion(p => p + 1)}
            disabled={!canProceed()}
          >
            {t.survey?.navigation?.continue}
          </button>
        )}
      </div>
    </div>
  );
}
