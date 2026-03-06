'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

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
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [roster, setRoster] = useState<Member[]>([]);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'roster' | 'analytics' | 'settings'>('overview');
  const [linkCount, setLinkCount] = useState(1);
  const [generatedLinks, setGeneratedLinks] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [statsRes, rosterRes, analyticsRes] = await Promise.all([
        fetch('/api/survey', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'get_dashboard_stats' })
        }),
        fetch('/api/survey', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'get_roster' })
        }),
        fetch('/api/survey', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'get_analytics' })
        })
      ]);

      const statsData = await statsRes.json();
      const rosterData = await rosterRes.json();
      const analyticsData = await analyticsRes.json();

      setStats(statsData);
      setRoster(rosterData.roster || []);
      setAnalysis(analyticsData.analysis);
    } catch (e) {
      console.error('Load error:', e);
    }
  };

  const generateLinks = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/survey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'generate_link', count: linkCount })
      });
      const data = await res.json();
      setGeneratedLinks(data.links || []);
    } catch (e) {
      console.error('Generate error:', e);
    }
    setIsGenerating(false);
  };

  const triggerSurvey2 = async (memberIds: string[], criteria: string) => {
    try {
      await fetch('/api/survey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'trigger_survey2', member_ids: memberIds, criteria })
      });
      loadData();
    } catch (e) {
      console.error('Trigger error:', e);
    }
  };

  return (
    <div className="container" style={{ maxWidth: 1200 }}>
      <div className="flex justify-between items-center mb-4">
        <h1>TribeMapper Admin</h1>
        <div className="flex gap-2">
          <button className="btn btn-secondary" onClick={loadData}>Refresh</button>
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        {(['overview', 'roster', 'analytics', 'settings'] as const).map(tab => (
          <button
            key={tab}
            className={`btn ${activeTab === tab ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && stats && (
        <>
          <div className="stats-grid mb-4">
            <div className="stat-card">
              <div className="stat-value">{stats.totalMembers}</div>
              <div className="stat-label">Total Members</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{stats.completedMembers}</div>
              <div className="stat-label">Completed Survey</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{stats.activeMembers}</div>
              <div className="stat-label">Active</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{stats.pendingMembers}</div>
              <div className="stat-label">Pending</div>
            </div>
          </div>

          {analysis && (
            <div className="card mb-4">
              <h2>Quick Insights</h2>
              <div className="grid grid-2 mt-3 gap-4">
                <div>
                  <div className="badge badge-success mb-2">
                    {analysis.bridges.length} Bridges
                  </div>
                  <p className="text-sm text-muted">
                    Members connecting different parts of the group
                  </p>
                </div>
                <div>
                  <div className="badge badge-warning mb-2">
                    {analysis.isolates.length} Isolates
                  </div>
                  <p className="text-sm text-muted">
                    Members with few connections
                  </p>
                </div>
                <div>
                  <div className="badge badge-info mb-2">
                    {analysis.clusters.length} Clusters
                  </div>
                  <p className="text-sm text-muted">
                    Sub-groups detected in the network
                  </p>
                </div>
                <div>
                  <div className={`badge mb-2 ${analysis.overallHealth >= 4 ? 'badge-success' : analysis.overallHealth >= 3 ? 'badge-warning' : 'badge-danger'}`}>
                    Health: {analysis.overallHealth.toFixed(1)}/5
                  </div>
                  <p className="text-sm text-muted">
                    Overall group health perception
                  </p>
                </div>
              </div>

              {analysis.dataQuality.gaps.length > 0 && (
                <div className="mt-4">
                  <h3>Data Quality Gaps</h3>
                  <ul style={{ marginTop: '0.5rem', paddingLeft: '1.25rem' }}>
                    {analysis.dataQuality.gaps.map((gap, i) => (
                      <li key={i} className="text-sm text-muted">{gap}</li>
                    ))}
                  </ul>
                </div>
              )}

              {analysis.survey2Recommendations.length > 0 && (
                <div className="mt-4">
                  <h3>Survey 2 Recommendations</h3>
                  <p className="text-sm text-muted mt-1">
                    {analysis.survey2Recommendations.length} members recommended for follow-up
                  </p>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {activeTab === 'roster' && (
        <div className="card">
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Status</th>
                  <th>Stage</th>
                  <th>Trust ↓</th>
                  <th>Trust ↑</th>
                  <th>Collab</th>
                  <th>Influence</th>
                  <th>Score</th>
                </tr>
              </thead>
              <tbody>
                {roster.map(member => (
                  <tr key={member.id}>
                    <td>{member.display_name || 'Anonymous'}</td>
                    <td>
                      <span className={`badge ${
                        member.status === 'completed' ? 'badge-success' : 
                        member.status === 'active' ? 'badge-info' : 'badge-warning'
                      }`}>
                        {member.status}
                      </span>
                    </td>
                    <td>{member.survey_stage || 'none'}</td>
                    <td>{member.trustReceived || 0}</td>
                    <td>{member.trustGiven || 0}</td>
                    <td>{member.collaborationCount || 0}</td>
                    <td>{member.influenceCount || 0}</td>
                    <td>{(member.centralityScore || 0).toFixed(1)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'analytics' && analysis && (
        <div className="grid gap-4">
          <div className="card">
            <h2>Network Analysis</h2>
            
            <h3 className="mt-4">Bridges</h3>
            {analysis.bridges.length > 0 ? (
              <ul style={{ paddingLeft: '1.25rem' }}>
                {analysis.bridges.map(b => (
                  <li key={b.id}>{b.display_name || 'Anonymous'}</li>
                ))}
              </ul>
            ) : (
              <p className="text-muted text-sm">No bridges detected yet</p>
            )}

            <h3 className="mt-4">Isolates</h3>
            {analysis.isolates.length > 0 ? (
              <ul style={{ paddingLeft: '1.25rem' }}>
                {analysis.isolates.map(i => (
                  <li key={i.id}>{i.display_name || 'Anonymous'}</li>
                ))}
              </ul>
            ) : (
              <p className="text-muted text-sm">No isolates detected yet</p>
            )}

            <h3 className="mt-4">Clusters</h3>
            {analysis.clusters.length > 0 ? (
              <div className="grid grid-2 gap-2 mt-2">
                {analysis.clusters.map(c => (
                  <div key={c.id} className="card" style={{ padding: '0.75rem' }}>
                    <div className="text-sm">Cluster {c.id.replace('cluster_', '')}</div>
                    <div className="text-sm text-muted">Density: {(c.density * 100).toFixed(0)}%</div>
                    <div className="text-sm text-muted">{c.members.length} members</div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted text-sm">No clusters detected yet</p>
            )}
          </div>

          <div className="card">
            <h2>Survey 2 Recommendations</h2>
            {analysis.survey2Recommendations.length > 0 ? (
              <div className="mt-2">
                {analysis.survey2Recommendations.slice(0, 10).map((rec, i) => (
                  <div key={i} className="flex justify-between items-center py-2" style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <div>
                      <div className="text-sm">{rec.reason}</div>
                      <div className="text-sm text-muted">Priority: {rec.priority}</div>
                    </div>
                    <button 
                      className="btn btn-secondary text-sm"
                      onClick={() => triggerSurvey2([rec.memberId], rec.reason)}
                    >
                      Trigger
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted text-sm">No recommendations yet</p>
            )}
          </div>

          {analysis.interviewShortlist.length > 0 && (
            <div className="card">
              <h2>Interview Shortlist</h2>
              <p className="text-muted text-sm mt-1">Members recommended for interview follow-up</p>
              <ul style={{ paddingLeft: '1.25rem', marginTop: '0.5rem' }}>
                {analysis.interviewShortlist.map((item, i) => (
                  <li key={i} className="text-sm">{item.reason}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="card">
          <h2>Generate Survey Links</h2>
          <p className="text-muted mt-1">Create unique survey links to invite members</p>
          
          <div className="flex gap-2 mt-4">
            <input
              type="number"
              className="input"
              style={{ width: 100 }}
              min={1}
              max={50}
              value={linkCount}
              onChange={(e) => setLinkCount(parseInt(e.target.value) || 1)}
            />
            <button 
              className="btn btn-primary" 
              onClick={generateLinks}
              disabled={isGenerating}
            >
              {isGenerating ? 'Generating...' : 'Generate'}
            </button>
          </div>

          {generatedLinks.length > 0 && (
            <div className="mt-4">
              <h3>Generated Links</h3>
              <div className="mt-2" style={{ fontSize: '0.875rem' }}>
                {generatedLinks.map((link, i) => (
                  <div key={i} className="flex justify-between items-center py-1" style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <code style={{ fontSize: '0.75rem' }}>{link}</code>
                    <button 
                      className="btn btn-ghost text-sm"
                      onClick={() => navigator.clipboard.writeText(window.location.origin + link)}
                    >
                      Copy
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-4 pt-4" style={{ borderTop: '1px solid var(--color-border)' }}>
            <h3>Database</h3>
            <button 
              className="btn btn-secondary mt-2"
              onClick={async () => {
                await fetch('/api/survey', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ action: 'init' })
                });
                alert('Database initialized');
              }}
            >
              Initialize Database
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
