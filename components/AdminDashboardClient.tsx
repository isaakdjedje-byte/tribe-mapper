'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';

interface DashboardStats {
  totalMembers: number;
  activeMembers: number;
  completedMembers: number;
  pendingMembers: number;
  survey1: { respondents: number; total_responses: number };
  survey2: { respondents: number; total_responses: number };
}

interface Member {
  id: string;
  display_name: string;
  status: string;
  survey_stage: string;
  trustReceived: number;
  trustGiven: number;
  collaborationCount: number;
  influenceCount: number;
  centralityScore: number;
}

interface Analysis {
  totalMembers: number;
  completedSurveys: number;
  responseRate: number;
  clusters: { id: string; members: string[]; density: number }[];
  bridges: { id: string; display_name: string }[];
  isolates: { id: string; display_name: string }[];
  potentialBottlenecks: { id: string; display_name: string }[];
  missingLinks: { source: string; target: string; reason: string }[];
  tensionHotspots: { members: string[]; strength: number }[];
  survey2Recommendations: { memberId: string; reason: string; priority: number }[];
  interviewShortlist: { memberId: string; reason: string }[];
  overallHealth: number;
  dataQuality: {
    completeness: number;
    confidence: number;
    gaps: string[];
  };
}

export default function AdminDashboardClient() {
  const { t } = useLanguage();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [roster, setRoster] = useState<Member[]>([]);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'roster' | 'analytics' | 'settings'>('overview');
  const [linkCount, setLinkCount] = useState(1);
  const [generatedLinks, setGeneratedLinks] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [linkError, setLinkError] = useState('');
  const [linkSuccess, setLinkSuccess] = useState('');

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const [statsRes, rosterRes, analyticsRes] = await Promise.all([
        fetch('/api/survey', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'get_dashboard_stats' }) }),
        fetch('/api/survey', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'get_roster' }) }),
        fetch('/api/survey', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'get_analytics' }) })
      ]);
      const statsData = await statsRes.json();
      const rosterData = await rosterRes.json();
      const analyticsData = await analyticsRes.json();
      setStats(statsData);
      setRoster(rosterData.roster || []);
      setAnalysis(analyticsData.analysis);
    } catch (e) { console.error('Load error:', e); }
  };

  const generateLinks = async () => {
    setIsGenerating(true);
    setLinkError('');
    setLinkSuccess('');
    setGeneratedLinks([]);
    
    try {
      const res = await fetch('/api/survey', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'generate_link', count: linkCount }) });
      const data = await res.json();
      
      if (!res.ok) {
        setLinkError(data.error || t.admin.failedLinks);
      } else if (!data.links || data.links.length === 0) {
        setLinkError(t.admin.noLinksGenerated);
      } else {
        setGeneratedLinks(data.links);
        const successMsg = data.links.length === 1 
          ? t.admin.linkGenerated.replace('{count}', '1')
          : t.admin.linksGenerated.replace('{count}', String(data.links.length));
        setLinkSuccess(successMsg);
      }
    } catch (e) { 
      console.error('Generate error:', e);
      setLinkError(t.admin.networkError);
    }
    setIsGenerating(false);
  };

  const copyLink = (link: string) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const fullUrl = origin + link;
    navigator.clipboard.writeText(fullUrl);
  };

  const triggerSurvey2 = async (memberIds: string[]) => {
    try {
      await fetch('/api/survey', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'trigger_survey2', member_ids: memberIds }) });
      loadData();
    } catch (e) { console.error('Trigger error:', e); }
  };

  const getStatusClass = (status: string) => {
    if (status === 'completed') return 'status-completed';
    if (status === 'active') return 'status-active';
    return 'status-pending';
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/admin/login');
      router.refresh();
    } catch (e) {
      console.error('Logout error:', e);
    }
  };

  const handleInitDb = async () => {
    try {
      await fetch('/api/survey', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'init' }) });
      alert(t.admin.databaseInitialized);
    } catch (e) {
      console.error('Init error:', e);
    }
  };

  return (
    <div className="container-admin">
      <div className="flex justify-between items-center mb-4">
        <h1>{t.admin.title}</h1>
        <div className="flex gap-2 items-center">
          <LanguageSwitcher />
          <button className="btn btn-secondary btn-small" onClick={loadData}>{t.admin.refresh}</button>
          <button className="btn btn-small" onClick={handleLogout} style={{ color: 'var(--text-muted)', border: '1px solid var(--border)' }}>{t.admin.logout}</button>
        </div>
      </div>

      <div className="nav-tabs">
        {(['overview', 'roster', 'analytics', 'settings'] as const).map(tab => (
          <button key={tab} className={`nav-tab ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
            {t.admin.tabs[tab]}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && stats && (
        <>
          <div className="grid-4 mb-6">
            <div>
              <div className="section-title">{t.admin.stats.totalMembers}</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 600 }}>{stats.totalMembers}</div>
            </div>
            <div>
              <div className="section-title">{t.admin.stats.completed}</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 600, color: 'var(--success)' }}>{stats.completedMembers}</div>
            </div>
            <div>
              <div className="section-title">{t.admin.stats.active}</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 600, color: 'var(--info)' }}>{stats.activeMembers}</div>
            </div>
            <div>
              <div className="section-title">{t.admin.stats.pending}</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>{stats.pendingMembers}</div>
            </div>
          </div>

          {analysis && (
            <div className="card">
              <h3 style={{ marginBottom: 'var(--space-4)' }}>{t.admin.networkOverview}</h3>
              
              <div className="grid-2" style={{ gap: 'var(--space-5)' }}>
                <div>
                  <div className="section-title">{t.admin.structuralElements}</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                    <div className="flex justify-between items-center">
                      <span className="text-secondary">{t.admin.bridges}</span>
                      <span style={{ fontWeight: 600 }}>{analysis.bridges.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-secondary">{t.admin.isolates}</span>
                      <span style={{ fontWeight: 600 }}>{analysis.isolates.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-secondary">{t.admin.clusters}</span>
                      <span style={{ fontWeight: 600 }}>{analysis.clusters.length}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="section-title">{t.admin.healthAndQuality}</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                    <div className="flex justify-between items-center">
                      <span className="text-secondary">{t.admin.overallHealth}</span>
                      <span style={{ fontWeight: 600, color: analysis.overallHealth >= 4 ? 'var(--success)' : analysis.overallHealth >= 3 ? 'var(--accent)' : 'var(--danger)' }}>
                        {analysis.overallHealth.toFixed(1)}/5
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-secondary">{t.admin.dataCompleteness}</span>
                      <span style={{ fontWeight: 600 }}>{(analysis.dataQuality.completeness * 100).toFixed(0)}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-secondary">{t.admin.confidence}</span>
                      <span style={{ fontWeight: 600 }}>{(analysis.dataQuality.confidence * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                </div>
              </div>

              {analysis.dataQuality.gaps.length > 0 && (
                <div className="mt-6 pt-6" style={{ borderTop: '1px solid var(--border)' }}>
                  <div className="section-title">{t.admin.dataQualityGaps}</div>
                  <ul style={{ marginTop: 'var(--space-2)', paddingLeft: '1.25rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    {analysis.dataQuality.gaps.map((gap, i) => <li key={i}>{gap}</li>)}
                  </ul>
                </div>
              )}

              {analysis.survey2Recommendations.length > 0 && (
                <div className="mt-6 pt-6" style={{ borderTop: '1px solid var(--border)' }}>
                  <div className="section-title">{t.admin.recommendations}</div>
                  <p className="text-muted mt-2">{analysis.survey2Recommendations.length} {t.admin.membersFlagged}</p>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {activeTab === 'roster' && (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>{t.admin.table.member}</th>
                <th>{t.admin.table.status}</th>
                <th>{t.admin.table.stage}</th>
                <th style={{ textAlign: 'center' }}>{t.admin.table.trustIn}</th>
                <th style={{ textAlign: 'center' }}>{t.admin.table.trustOut}</th>
                <th style={{ textAlign: 'center' }}>{t.admin.table.collab}</th>
                <th style={{ textAlign: 'right' }}>{t.admin.table.score}</th>
              </tr>
            </thead>
            <tbody>
              {roster.map(member => (
                <tr key={member.id}>
                  <td style={{ fontWeight: 500 }}>{member.display_name || t.admin.table.anonymous}</td>
                  <td><span className={`status ${getStatusClass(member.status)}`}>{t.admin.status[member.status as keyof typeof t.admin.status] || member.status}</span></td>
                  <td className="text-muted">{member.survey_stage || '—'}</td>
                  <td style={{ textAlign: 'center' }}>{member.trustReceived || 0}</td>
                  <td style={{ textAlign: 'center' }}>{member.trustGiven || 0}</td>
                  <td style={{ textAlign: 'center' }}>{member.collaborationCount || 0}</td>
                  <td style={{ textAlign: 'right', fontWeight: 600 }}>{(member.centralityScore || 0).toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'analytics' && analysis && (
        <div className="card">
          <h3 style={{ marginBottom: 'var(--space-5)' }}>{t.admin.detailedAnalysis}</h3>
          
          <div className="section">
            <div className="section-title">{t.admin.bridges}</div>
            {analysis.bridges.length > 0 ? (
              <ul style={{ marginTop: 'var(--space-2)', fontSize: '0.875rem' }}>
                {analysis.bridges.map(b => <li key={b.id} style={{ padding: 'var(--space-1) 0' }}>{b.display_name || t.admin.table.anonymous}</li>)}
              </ul>
            ) : <p className="text-muted mt-2">{t.admin.noBridges}</p>}
          </div>

          <div className="section">
            <div className="section-title">{t.admin.isolates}</div>
            {analysis.isolates.length > 0 ? (
              <ul style={{ marginTop: 'var(--space-2)', fontSize: '0.875rem' }}>
                {analysis.isolates.map(i => <li key={i.id} style={{ padding: 'var(--space-1) 0' }}>{i.display_name || t.admin.table.anonymous}</li>)}
              </ul>
            ) : <p className="text-muted mt-2">{t.admin.noIsolates}</p>}
          </div>

          <div className="section">
            <div className="section-title">{t.admin.clusters}</div>
            {analysis.clusters.length > 0 ? (
              <div className="grid-3 mt-3">
                {analysis.clusters.map(c => (
                  <div key={c.id} style={{ padding: 'var(--space-3)', background: 'var(--bg)', borderRadius: 'var(--radius)', fontSize: '0.875rem' }}>
                    <div style={{ fontWeight: 600 }}>{t.admin.clusterId} {c.id.replace('cluster_', '')}</div>
                    <div className="text-muted">{c.members.length} {t.admin.membersCount} · {(c.density * 100).toFixed(0)}% {t.admin.density}</div>
                  </div>
                ))}
              </div>
            ) : <p className="text-muted mt-2">{t.admin.noClusters}</p>}
          </div>

          {analysis.survey2Recommendations.length > 0 && (
            <div className="section">
              <div className="section-title">{t.admin.followUpRequired}</div>
              <div style={{ marginTop: 'var(--space-3)' }}>
                {analysis.survey2Recommendations.slice(0, 10).map((rec, i) => (
                  <div key={i} className="flex justify-between items-center" style={{ padding: 'var(--space-3) 0', borderBottom: '1px solid var(--border)' }}>
                    <div>
                      <div style={{ fontSize: '0.875rem' }}>{rec.reason}</div>
                      <div className="text-small text-muted">Priority {rec.priority}</div>
                    </div>
                    <button className="btn btn-secondary btn-small" onClick={() => triggerSurvey2([rec.memberId])}>{t.admin.trigger}</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {analysis.interviewShortlist.length > 0 && (
            <div className="section">
              <div className="section-title">{t.admin.interviewShortlist}</div>
              <p className="text-muted mt-2">{analysis.interviewShortlist.length} {t.admin.membersRecommended}</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="card">
          <h3 style={{ marginBottom: 'var(--space-2)' }}>{t.admin.generateLinks}</h3>
          <p className="text-muted">{t.admin.createTokens}</p>
          
          <div className="flex items-center gap-3 mt-4">
            <input type="number" className="input" style={{ width: 80 }} min={1} max={50} value={linkCount} onChange={(e) => setLinkCount(parseInt(e.target.value) || 1)} />
            <button className="btn btn-primary" onClick={generateLinks} disabled={isGenerating}>
              {isGenerating ? t.admin.generating : t.admin.generate}
            </button>
          </div>

          {linkError && (
            <div style={{ 
              padding: 'var(--space-3)', 
              background: 'var(--danger-subtle)', 
              color: 'var(--danger)',
              borderRadius: 'var(--radius)',
              fontSize: '0.875rem',
              marginTop: 'var(--space-4)'
            }}>
              {linkError}
            </div>
          )}

          {linkSuccess && (
            <div style={{ 
              padding: 'var(--space-3)', 
              background: 'var(--primary-subtle)', 
              color: 'var(--primary)',
              borderRadius: 'var(--radius)',
              fontSize: '0.875rem',
              marginTop: 'var(--space-4)'
            }}>
              {linkSuccess}
            </div>
          )}

          {generatedLinks.length > 0 && (
            <div className="mt-6 pt-6" style={{ borderTop: '1px solid var(--border)' }}>
              <div className="section-title">{t.admin.generatedLinks}</div>
              <div style={{ marginTop: 'var(--space-3)', fontSize: '0.8125rem' }}>
                {generatedLinks.map((link, i) => (
                  <div key={i} className="flex justify-between items-center" style={{ padding: 'var(--space-2) 0', borderBottom: '1px solid var(--border)' }}>
                    <code style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{link}</code>
                    <button className="btn btn-small" style={{ color: 'var(--primary)', border: 'none', background: 'none' }} onClick={() => copyLink(link)}>
                      {t.admin.copy}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 pt-6" style={{ borderTop: '1px solid var(--border)' }}>
            <div className="section-title">{t.admin.database}</div>
            <button className="btn btn-secondary btn-small mt-3" onClick={handleInitDb}>
              {t.admin.initializeDatabase}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
