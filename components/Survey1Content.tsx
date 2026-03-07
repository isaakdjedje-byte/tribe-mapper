'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { SurveyContext, getContextConfig } from '@/lib/survey/context';
import { getSurveyQuestions, Question } from '@/lib/survey/questions';

interface Survey1ContentProps {
  token: string;
  context?: SurveyContext;
}

export default function Survey1Content({ token, context = 'tribe' }: Survey1ContentProps) {
  const { t, language } = useLanguage();
  const contextConfig = getContextConfig(context);
  
  const [currentSection, setCurrentSection] = useState<'consent' | 'profile' | 'relationships' | 'reflection' | 'completed'>('consent');
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [memberId, setMemberId] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [knownMembers, setKnownMembers] = useState<{id: string; display_name: string}[]>([]);
  const [manualEntryName, setManualEntryName] = useState('');
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [provisionalMembers, setProvisionalMembers] = useState<{id: string; name: string}[]>([]);
  
  const questions = getSurveyQuestions(context);
  const profileQuestions = questions.filter(q => q.dataTarget === 'member_profile');
  const relationshipQuestions = questions.filter(q => q.dataTarget === 'relationship');
  const reflectionQuestions = questions.filter(q => q.dataTarget === 'survey_response');

  // Load member data and roster - with resume support
  useEffect(() => {
    const init = async () => {
      setMemberId(token);
      try {
        // Get full survey state including saved progress
        const stateRes = await fetch('/api/survey', { 
          method: 'POST', 
          headers: { 'Content-Type': 'application/json' }, 
          body: JSON.stringify({ action: 'get_survey_state', member_id: token }) 
        });
        
        if (!stateRes.ok) {
          // Member not found - treat as new user
          setIsLoading(false);
          return;
        }
        
        const stateData = await stateRes.json();
        if (stateData.error) {
          // Member lookup failed - treat as new user
          setIsLoading(false);
          return;
        }
        
        const { member, relationships, responses } = stateData;
        
        if (member?.status === 'completed') {
          setCurrentSection('completed');
          setIsLoading(false);
          return;
        }

        // Restore profile data from member record
        if (member) {
          const restoredAnswers: Record<string, any> = {};
          profileQuestions.forEach(q => {
            if (q.profileField && member[q.profileField] !== undefined && member[q.profileField] !== null) {
              // Handle consent checkboxes
              if (q.profileField.startsWith('consent_')) {
                restoredAnswers[q.id] = member[q.profileField] === 1;
              } else {
                restoredAnswers[q.id] = member[q.profileField];
              }
            }
          });
          setAnswers(restoredAnswers);
        }

        // Restore relationships from DB
        if (relationships && relationships.length > 0) {
          const relationshipAnswers: Record<string, string[]> = {};
          relationships.forEach((rel: any) => {
            const targetId = rel.source_id === token ? rel.target_id : rel.source_id;
            const relType = rel.relationship_type;
            if (targetId && relType) {
              if (!relationshipAnswers[relType]) {
                relationshipAnswers[relType] = [];
              }
              relationshipAnswers[relType].push(targetId);
            }
          });
          
          // Build all answers at once
          const relRestoredAnswers: Record<string, string[]> = {};
          relationshipQuestions.forEach(q => {
            if (q.relationshipType) {
              const relType = q.relationshipType;
              if (relationshipAnswers[relType]) {
                relRestoredAnswers[q.id] = relationshipAnswers[relType];
              }
            }
          });
          
          // Apply all at once
          if (Object.keys(relRestoredAnswers).length > 0) {
            setAnswers(prev => ({ ...prev, ...relRestoredAnswers }));
          }
        }

        // Restore reflection responses from DB
        if (responses && responses.length > 0) {
          const reflectionRestoredAnswers: Record<string, any> = {};
          responses.forEach((resp: any) => {
            let answerValue = resp.answer_value;
            try {
              answerValue = JSON.parse(answerValue);
            } catch (e) {}
            reflectionRestoredAnswers[resp.question_id] = answerValue;
          });
          setAnswers(prev => ({ ...prev, ...reflectionRestoredAnswers }));
        }

        // Determine current section based on survey_stage
        const stage = member?.survey_stage;
        if (stage === 'reflection' || stage === 'survey1') {
          setCurrentSection('reflection');
        } else if (stage === 'relationships') {
          setCurrentSection('relationships');
        } else if (stage === 'profile') {
          setCurrentSection('profile');
        } else {
          // Default to profile if profile data exists, otherwise consent
          const hasProfileData = profileQuestions.some(q => 
            q.profileField && member && member[q.profileField] !== undefined && member[q.profileField] !== null
          );
          setCurrentSection(hasProfileData ? 'profile' : 'consent');
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

  const handleRemoveProvisional = (id: string) => {
    setProvisionalMembers(prev => prev.filter(m => m.id !== id));
  };

  const handleProfileSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Extract profile fields
      const profileData: Record<string, any> = {};
      profileQuestions.forEach(q => {
        if (q.profileField && answers[q.id] !== undefined) {
          if (q.id === 'additional_languages') {
            // Parse comma-separated languages into array
            profileData[q.profileField] = answers[q.id].split(',').map((l: string) => l.trim()).filter(Boolean);
          } else if (q.type === 'checkbox') {
            profileData[q.profileField] = answers[q.id] ? 1 : 0;
          } else {
            profileData[q.profileField] = answers[q.id];
          }
        }
      });

      await fetch('/api/survey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_member',
          member_id: memberId,
          survey_stage: 'relationships',
          ...profileData
        })
      });

      setCurrentSection('relationships');
    } catch (e) {
      console.error(e);
    }
    setIsSubmitting(false);
  };

  const handleRelationshipsSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Save relationships
      for (const q of relationshipQuestions) {
        const nominations = answers[q.id] || [];
        if (nominations.length > 0 && q.relationshipType) {
          await fetch('/api/survey', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'process_nominations',
              member_id: memberId,
              nominations,
              relationship_type: q.relationshipType
            })
          });
        }
      }

      // Save provisional members as relationships too
      for (const q of relationshipQuestions) {
        const provisionalNominations = (answers[q.id] || [])
          .filter((id: string) => id.startsWith('provisional_'));
        
        for (const provId of provisionalNominations) {
          const prov = provisionalMembers.find(m => m.id === provId);
          if (prov && q.relationshipType) {
            await fetch('/api/survey', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                action: 'save_provisional_relationship',
                member_id: memberId,
                provisional_name: prov.name,
                relationship_type: q.relationshipType
              })
            });
          }
        }
      }

      // Update survey stage
      await fetch('/api/survey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_member',
          member_id: memberId,
          survey_stage: 'reflection'
        })
      });

      setCurrentSection('reflection');
    } catch (e) {
      console.error(e);
    }
    setIsSubmitting(false);
  };

  const handleReflectionSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Save reflection responses
      const responses = reflectionQuestions.map(q => ({
        question_id: q.id,
        answer_value: answers[q.id] || '',
        answer_type: q.type
      })).filter(r => r.answer_value !== '');

      await fetch('/api/survey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'submit_survey',
          member_id: memberId,
          survey_type: 'survey1',
          responses
        })
      });

      setCurrentSection('completed');
    } catch (e) {
      console.error(e);
    }
    setIsSubmitting(false);
  };

  const getQuestionTranslation = (q: Question) => {
    const isFr = language === 'fr';
    return {
      section: isFr ? q.sectionFr : q.section,
      question: isFr ? q.questionFr : q.question,
      description: isFr ? q.descriptionFr : q.description,
      placeholder: isFr ? q.placeholderFr : q.placeholder
    };
  };

  const renderQuestion = (q: Question) => {
    const trans = getQuestionTranslation(q);
    const value = answers[q.id];

    return (
      <div key={q.id} className="question-card" style={{ marginBottom: 'var(--space-6)' }}>
        <div style={{ marginBottom: 'var(--space-3)' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: 'var(--space-1)' }}>
            {trans.question}
          </h3>
          {trans.description && (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              {trans.description}
            </p>
          )}
        </div>

        {q.type === 'text' && (
          <input
            type="text"
            className="input"
            placeholder={trans.placeholder || ''}
            value={value || ''}
            onChange={(e) => handleAnswer(q.id, e.target.value)}
          />
        )}

        {q.type === 'textarea' && (
          <textarea
            className="textarea"
            placeholder={trans.placeholder || ''}
            value={value || ''}
            onChange={(e) => handleAnswer(q.id, e.target.value)}
            rows={4}
          />
        )}

        {q.type === 'date' && (
          <input
            type="date"
            className="input"
            value={value || ''}
            onChange={(e) => handleAnswer(q.id, e.target.value)}
          />
        )}

        {q.type === 'single' && q.options && (
          <div className="options-list">
            {q.options.map(opt => (
              <label 
                key={opt.value} 
                className={`option-label ${value === opt.value ? 'selected' : ''}`}
                style={{
                  display: 'block',
                  padding: 'var(--space-3)',
                  marginBottom: 'var(--space-2)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  cursor: 'pointer',
                  background: value === opt.value ? 'var(--primary-subtle)' : 'transparent'
                }}
              >
                <input
                  type="radio"
                  name={q.id}
                  value={opt.value}
                  checked={value === opt.value}
                  onChange={() => handleAnswer(q.id, opt.value)}
                  style={{ marginRight: 'var(--space-2)' }}
                />
                <span>{language === 'fr' ? opt.labelFr : opt.label}</span>
              </label>
            ))}
          </div>
        )}

        {q.type === 'checkbox' && (
          <label className="checkbox-label" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <input
              type="checkbox"
              checked={value || false}
              onChange={(e) => handleAnswer(q.id, e.target.checked)}
            />
            <span style={{ fontSize: '0.875rem' }}>
              {language === 'fr' ? 'Je consens' : 'I consent'}
            </span>
          </label>
        )}

        {q.type === 'scale' && q.options && (
          <div className="scale-options">
            {q.options.map(opt => (
              <label 
                key={opt.value}
                className={`scale-option ${value === opt.value ? 'selected' : ''}`}
                style={{
                  display: 'inline-block',
                  padding: 'var(--space-3)',
                  margin: 'var(--space-1)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  cursor: 'pointer',
                  background: value === opt.value ? 'var(--primary-subtle)' : 'transparent'
                }}
              >
                <input
                  type="radio"
                  name={q.id}
                  value={opt.value}
                  checked={value === opt.value}
                  onChange={() => handleAnswer(q.id, opt.value)}
                  style={{ display: 'none' }}
                />
                <span>{language === 'fr' ? opt.labelFr : opt.label}</span>
              </label>
            ))}
          </div>
        )}

        {q.type === 'nominate' && (
          <div className="nominate-input">
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: 'var(--space-2)' }}>
              {t.survey.selectUpTo?.replace('{count}', String(q.maxSelections || 5))}
            </p>
            
            {/* Selected people */}
            <div style={{ marginBottom: 'var(--space-3)' }}>
              {(value || []).map((id: string) => {
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
                      onClick={() => handleAnswer(q.id, (value || []).filter((v: string) => v !== id))}
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
                <option value="">{t.survey.navigation?.selectSomeone}</option>
                {knownMembers
                  .filter(m => m.id !== memberId && !(value || []).includes(m.id))
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
                  {t.survey.navigation?.addSomeone}
                </button>
              ) : (
                <div style={{ display: 'flex', gap: 'var(--space-2)', flex: 1 }}>
                  <input
                    type="text"
                    className="input"
                    placeholder={t.survey.navigation?.typeName}
                    value={manualEntryName}
                    onChange={(e) => setManualEntryName(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddManualEntry()}
                    style={{ flex: 1 }}
                  />
                  <button className="btn btn-primary" onClick={handleAddManualEntry}>
                    {t.survey.navigation?.add}
                  </button>
                  <button className="btn btn-secondary" onClick={() => setShowManualEntry(false)}>
                    {t.survey.navigation?.back}
                  </button>
                </div>
              )}
            </div>

            {/* Show provisional members that can be selected */}
            {provisionalMembers.length > 0 && (
              <div style={{ marginTop: 'var(--space-3)' }}>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 'var(--space-1)' }}>
                  {language === 'fr' ? 'Personnes ajoutées manuellement:' : 'Manually added people:'}
                </p>
                {provisionalMembers
                  .filter(m => !(value || []).includes(m.id))
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
    );
  };

  const canSubmitProfile = () => {
    return profileQuestions
      .filter(q => q.required)
      .every(q => answers[q.id] && answers[q.id] !== '');
  };

  if (isLoading) {
    return (
      <div className="loading" style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
        <div className="spinner" style={{ margin: '0 auto var(--space-4)' }} />
        <p>{t.survey?.loading}</p>
      </div>
    );
  }

  if (currentSection === 'completed') {
    return (
      <div className="completed" style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
        <h2 style={{ marginBottom: 'var(--space-4)' }}>{t.survey?.completed}</h2>
        <p>{t.survey?.completedMessage}</p>
      </div>
    );
  }

  if (currentSection === 'consent') {
    return (
      <div className="consent-screen" style={{ maxWidth: '600px', margin: '0 auto', padding: 'var(--space-6)' }}>
        <div style={{ marginBottom: 'var(--space-4)', textAlign: 'right' }}>
          <LanguageSwitcher />
        </div>
        <h1 style={{ marginBottom: 'var(--space-4)' }}>
          {language === 'fr' ? t.survey?.consent?.titleFr : t.survey?.consent?.title}
        </h1>
        <p style={{ marginBottom: 'var(--space-4)', color: 'var(--text-secondary)' }}>
          {language === 'fr' ? t.survey?.consent?.descriptionFr : t.survey?.consent?.description}
        </p>
        <p style={{ marginBottom: 'var(--space-4)', fontSize: '0.875rem' }}>
          {language === 'fr' ? t.survey?.consent?.privacyFr : t.survey?.consent?.privacy}
        </p>
        <p style={{ marginBottom: 'var(--space-6)', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          {language === 'fr' ? t.survey?.consent?.skipFr : t.survey?.consent?.skip}
        </p>
        <button 
          className="btn btn-primary" 
          onClick={async () => {
            // Track that user has started the survey
            await fetch('/api/survey', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                action: 'update_member',
                member_id: memberId,
                survey_stage: 'profile'
              })
            });
            setCurrentSection('profile');
          }}
          style={{ width: '100%' }}
        >
          {language === 'fr' ? t.survey?.consent?.continueFr : t.survey?.consent?.continue}
        </button>
      </div>
    );
  }

  const currentQuestions = currentSection === 'profile' ? profileQuestions :
                          currentSection === 'relationships' ? relationshipQuestions :
                          reflectionQuestions;

  return (
    <div className="survey-container" style={{ maxWidth: '700px', margin: '0 auto', padding: 'var(--space-6)' }}>
      <div style={{ marginBottom: 'var(--space-4)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '1.25rem' }}>
          {language === 'fr' 
            ? (currentSection === 'profile' ? t.survey?.sections?.profileFr 
                : currentSection === 'relationships' ? t.survey?.sections?.connectionsFr
                : t.survey?.sections?.reflectionFr)
            : (currentSection === 'profile' ? t.survey?.sections?.profile
                : currentSection === 'relationships' ? t.survey?.sections?.connections
                : t.survey?.sections?.reflection)
          }
        </h2>
        <LanguageSwitcher />
      </div>

      <div className="questions">
        {currentQuestions.map(renderQuestion)}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'var(--space-8)' }}>
        <button 
          className="btn btn-secondary"
          onClick={() => {
            if (currentSection === 'profile') setCurrentSection('consent');
            else if (currentSection === 'relationships') setCurrentSection('profile');
            else if (currentSection === 'reflection') setCurrentSection('relationships');
          }}
        >
          {t.survey?.navigation?.back}
        </button>

        <button 
          className="btn btn-primary"
          onClick={() => {
            if (currentSection === 'profile') handleProfileSubmit();
            else if (currentSection === 'relationships') handleRelationshipsSubmit();
            else if (currentSection === 'reflection') handleReflectionSubmit();
          }}
          disabled={currentSection === 'profile' && !canSubmitProfile() || isSubmitting}
        >
          {isSubmitting 
            ? t.survey?.navigation?.submitting
            : currentSection === 'reflection' 
              ? t.survey?.navigation?.submit
              : t.survey?.navigation?.continue
          }
        </button>
      </div>
    </div>
  );
}
