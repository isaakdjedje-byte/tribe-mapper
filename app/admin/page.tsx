'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

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

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [roster, setRoster] = useState<Member[]>([]);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'roster' | 'analytics' | 'settings'>('overview');
  const [linkCount, setLinkCount] = useState(1);
  const [generatedLinks, setGeneratedLinks] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

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
    try {
      const res = await fetch('/api/survey', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'generate_link', count: linkCount }) });
      const data = await res.json();
      setGeneratedLinks(data.links || []);
    } catch (e) { console.error('Generate error:', e); }
    setIsGenerating(false);
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

  return (
    <div className="container-admin">
      <div className="flex justify-between items-center mb-4">
        <h1>TribeMapper Admin</h1>
        <div className="flex gap-2">
          <button className="btn btn-secondary btn-small" onClick={loadData}>Refresh</button>
          <button className="btn btn-small" onClick={handleLogout} style={{ color: 'var(--text-muted)', border: '1px solid var(--border)' }}>Logout</button>
        </div>
      </div>

      <div className="nav-tabs">
        {(['overview', 'roster', 'analytics', 'settings'] as const).map(tab => (
          <button key={tab} className={`nav-tab ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && stats && (
        <>
          <div className="grid-4 mb-6">
            <div>
              <div className="section-title">Total Members</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 600 }}>{stats.totalMembers}</div>
            </div>
            <div>
              <div className="section-title">Completed</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 600, color: 'var(--success)' }}>{stats.completedMembers}</div>
            </div>
            <div>
              <div className="section-title">Active</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 600, color: 'var(--info)' }}>{stats.activeMembers}</div>
            </div>
            <div>
              <div className="section-title">Pending</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>{stats.pendingMembers}</div>
            </div>
          </div>

          {analysis && (
            <div className="card">
              <h3 style={{ marginBottom: 'var(--space-4)' }}>Network Overview</h3>
              
              <div className="grid-2" style={{ gap: 'var(--space-5)' }}>
                <div>
                  <div className="section-title">Structural Elements</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                    <div className="flex justify-between items-center">
                      <span className="text-secondary">Bridges</span>
                      <span style={{ fontWeight: 600 }}>{analysis.bridges.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-secondary">Isolates</span>
                      <span style={{ fontWeight: 600 }}>{analysis.isolates.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-secondary">Clusters</span>
                      <span style={{ fontWeight: 600 }}>{analysis.clusters.length}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="section-title">Health & Quality</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                    <div className="flex justify-between items-center">
                      <span className="text-secondary">Overall Health</span>
                      <span style={{ fontWeight: 600, color: analysis.overallHealth >= 4 ? 'var(--success)' : analysis.overallHealth >= 3 ? 'var(--accent)' : 'var(--danger)' }}>
                        {analysis.overallHealth.toFixed(1)}/5
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-secondary">Data Completeness</span>
                      <span style={{ fontWeight: 600 }}>{(analysis.dataQuality.completeness * 100).toFixed(0)}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-secondary">Confidence</span>
                      <span style={{ fontWeight: 600 }}>{(analysis.dataQuality.confidence * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                </div>
              </div>

              {analysis.dataQuality.gaps.length > 0 && (
                <div className="mt-6 pt-6" style={{ borderTop: '1px solid var(--border)' }}>
                  <div className="section-title">Data Quality Gaps</div>
                  <ul style={{ marginTop: 'var(--space-2)', paddingLeft: '1.25rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    {analysis.dataQuality.gaps.map((gap, i) => <li key={i}>{gap}</li>)}
                  </ul>
                </div>
              )}

              {analysis.survey2Recommendations.length > 0 && (
                <div className="mt-6 pt-6" style={{ borderTop: '1px solid var(--border)' }}>
                  <div className="section-title">Recommendations</div>
                  <p className="text-muted mt-2">{analysis.survey2Recommendations.length} members flagged for follow-up</p>
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
                <th>Member</th>
                <th>Status</th>
                <th>Stage</th>
                <th style={{ textAlign: 'center' }}>Trust In</th>
                <th style={{ textAlign: 'center' }}>Trust Out</th>
                <th style={{ textAlign: 'center' }}>Collab</th>
                <th style={{ textAlign: 'right' }}>Score</th>
              </tr>
            </thead>
            <tbody>
              {roster.map(member => (
                <tr key={member.id}>
                  <td style={{ fontWeight: 500 }}>{member.display_name || 'Anonymous'}</td>
                  <td><span className={`status ${getStatusClass(member.status)}`}>{member.status}</span></td>
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
          <h3 style={{ marginBottom: 'var(--space-5)' }}>Detailed Analysis</h3>
          
          <div className="section">
            <div className="section-title">Bridges</div>
            {analysis.bridges.length > 0 ? (
              <ul style={{ marginTop: 'var(--space-2)', fontSize: '0.875rem' }}>
                {analysis.bridges.map(b => <li key={b.id} style={{ padding: 'var(--space-1) 0' }}>{b.display_name || 'Anonymous'}</li>)}
              </ul>
            ) : <p className="text-muted mt-2">No bridges detected</p>}
          </div>

          <div className="section">
            <div className="section-title">Isolates</div>
            {analysis.isolates.length > 0 ? (
              <ul style={{ marginTop: 'var(--space-2)', fontSize: '0.875rem' }}>
                {analysis.isolates.map(i => <li key={i.id} style={{ padding: 'var(--space-1) 0' }}>{i.display_name || 'Anonymous'}</li>)}
              </ul>
            ) : <p className="text-muted mt-2">No isolates detected</p>}
          </div>

          <div className="section">
            <div className="section-title">Clusters</div>
            {analysis.clusters.length > 0 ? (
              <div className="grid-3 mt-3">
                {analysis.clusters.map(c => (
                  <div key={c.id} style={{ padding: 'var(--space-3)', background: 'var(--bg)', borderRadius: 'var(--radius)', fontSize: '0.875rem' }}>
                    <div style={{ fontWeight: 600 }}>Cluster {c.id.replace('cluster_', '')}</div>
                    <div className="text-muted">{c.members.length} members · {(c.density * 100).toFixed(0)}% density</div>
                  </div>
                ))}
              </div>
            ) : <p className="text-muted mt-2">No clusters detected</p>}
          </div>

          {analysis.survey2Recommendations.length > 0 && (
            <div className="section">
              <div className="section-title">Follow-up Required</div>
              <div style={{ marginTop: 'var(--space-3)' }}>
                {analysis.survey2Recommendations.slice(0, 10).map((rec, i) => (
                  <div key={i} className="flex justify-between items-center" style={{ padding: 'var(--space-3) 0', borderBottom: '1px solid var(--border)' }}>
                    <div>
                      <div style={{ fontSize: '0.875rem' }}>{rec.reason}</div>
                      <div className="text-small text-muted">Priority {rec.priority}</div>
                    </div>
                    <button className="btn btn-secondary btn-small" onClick={() => triggerSurvey2([rec.memberId])}>Trigger</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {analysis.interviewShortlist.length > 0 && (
            <div className="section">
              <div className="section-title">Interview Shortlist</div>
              <p className="text-muted mt-2">{analysis.interviewShortlist.length} members recommended</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="card">
          <h3 style={{ marginBottom: 'var(--space-2)' }}>Generate Survey Links</h3>
          <p className="text-muted">Create unique tokens for tribe members</p>
          
          <div className="flex items-center gap-3 mt-4">
            <input type="number" className="input" style={{ width: 80 }} min={1} max={50} value={linkCount} onChange={(e) => setLinkCount(parseInt(e.target.value) || 1)} />
            <button className="btn btn-primary" onClick={generateLinks} disabled={isGenerating}>
              {isGenerating ? 'Generating...' : 'Generate'}
            </button>
          </div>

          {generatedLinks.length > 0 && (
            <div className="mt-6 pt-6" style={{ borderTop: '1px solid var(--border)' }}>
              <div className="section-title">Generated Links</div>
              <div style={{ marginTop: 'var(--space-3)', fontSize: '0.8125rem' }}>
                {generatedLinks.map((link, i) => (
                  <div key={i} className="flex justify-between items-center" style={{ padding: 'var(--space-2) 0', borderBottom: '1px solid var(--border)' }}>
                    <code style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{link}</code>
                    <button className="btn btn-small" style={{ color: 'var(--primary)', border: 'none', background: 'none' }} onClick={() => navigator.clipboard.writeText(window.location.origin + link)}>
                      Copy
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 pt-6" style={{ borderTop: '1px solid var(--border)' }}>
            <div className="section-title">Database</div>
            <button className="btn btn-secondary btn-small mt-3" onClick={async () => {
              await fetch('/api/survey', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'init' }) });
              alert('Database initialized');
            }}>
              Initialize Database
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
