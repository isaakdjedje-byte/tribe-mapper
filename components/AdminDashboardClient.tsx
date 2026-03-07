'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Member {
  id: string;
  anonymous_id: string;
  display_name: string | null;
  email: string | null;
  phone_number: string | null;
  full_name: string | null;
  date_of_birth: string | null;
  profession: string | null;
  current_activity_or_job_title: string | null;
  primary_language: string | null;
  additional_languages: string | null;
  role_in_tribe: string | null;
  tenure: string | null;
  current_address_line1: string | null;
  current_address_line2: string | null;
  current_city: string | null;
  current_postal_code: string | null;
  current_country: string | null;
  profile_notes: string | null;
  created_at: string;
  status: string;
  survey_stage: string;
  consent_data: number;
  consent_followup: number;
  consent_storage: number;
  consent_analysis: number;
  consent_contact: number;
  consent_birthday_reminder: number;
}

interface SubmissionGroup {
  member_id: string;
  survey_type: string;
  display_name: string | null;
  anonymous_id: string | null;
  created_at: string;
  response_count: number;
}

interface SubmissionDetail {
  member_id: string;
  survey_type: string;
  display_name: string;
  anonymous_id: string;
  submitted_at: string;
  profile_data: { field: string; value: string }[];
  relationships: { type: string; target_name: string; target_id: string }[];
  reflection_responses: { question_id: string; answer_value: string }[];
}

interface Relationship {
  id: string;
  source_id: string;
  target_id: string;
  relationship_type: string;
  strength: number;
  direction: string;
  source_confidence: number;
  created_at: string;
  source_name: string | null;
  target_name: string | null;
}

interface SurveyLink {
  id: string;
  token: string;
  context: string;
  status: string;
  member_id: string | null;
  created_at: string;
  updated_at: string;
  deactivated_at: string | null;
  submitted_at: string | null;
  member_name: string | null;
}

interface DashboardStats {
  totalMembers: number;
  activeMembers: number;
  completedMembers: number;
  pendingMembers: number;
}

interface SurveyResponse {
  id: string;
  member_id: string;
  survey_type: string;
  question_id: string;
  answer_value: string;
  answer_type: string;
  created_at: string;
  display_name: string | null;
  anonymous_id: string | null;
}

interface Relationship {
  id: string;
  source_id: string;
  target_id: string;
  relationship_type: string;
  strength: number;
  direction: string;
  source_confidence: number;
  created_at: string;
  source_name: string | null;
  target_name: string | null;
}

interface SurveyLink {
  id: string;
  token: string;
  context: string;
  status: string;
  member_id: string | null;
  created_at: string;
  updated_at: string;
  deactivated_at: string | null;
  submitted_at: string | null;
  member_name: string | null;
}

interface DashboardStats {
  totalMembers: number;
  activeMembers: number;
  completedMembers: number;
  pendingMembers: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activeTab, setActiveTab] = useState<'members' | 'responses' | 'relationships' | 'links' | 'settings'>('members');
  const [members, setMembers] = useState<Member[]>([]);
  const [submissions, setSubmissions] = useState<SubmissionGroup[]>([]);
  const [relationships, setRelationships] = useState<Relationship[]>([]);
  const [surveyLinks, setSurveyLinks] = useState<SurveyLink[]>([]);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [selectedSubmission, setSelectedSubmission] = useState<SubmissionDetail | null>(null);
  const [selectedRelationship, setSelectedRelationship] = useState<Relationship | null>(null);
  const [memberSubmissions, setMemberSubmissions] = useState<SubmissionGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [linkCount, setLinkCount] = useState(1);
  const [generatedLinks, setGeneratedLinks] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [linkSuccess, setLinkSuccess] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterRelType, setFilterRelType] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<{type: string; id: string; name: string} | null>(null);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [statsRes, membersRes, submissionsRes, relationshipsRes, linksRes] = await Promise.all([
        fetch('/api/survey', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'get_dashboard_stats' }) }),
        fetch('/api/survey', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'get_all_members' }) }),
        fetch('/api/survey', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'get_all_submissions' }) }),
        fetch('/api/survey', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'get_all_relationships' }) }),
        fetch('/api/survey', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'get_survey_links' }) }),
      ]);
      const statsData = await statsRes.json();
      const membersData = await membersRes.json();
      const submissionsData = await submissionsRes.json();
      const relationshipsData = await relationshipsRes.json();
      const linksData = await linksRes.json();
      setStats(statsData);
      setMembers(membersData.members || []);
      setSubmissions(submissionsData.submissions || []);
      setRelationships(relationshipsData.relationships || []);
      setSurveyLinks(linksData.links || []);
    } catch (e) { console.error('Load error:', e); }
    setIsLoading(false);
  };

  const loadMemberSubmissions = async (memberId: string) => {
    try {
      const res = await fetch('/api/survey', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'get_submissions_by_member', member_id: memberId }) });
      const data = await res.json();
      setMemberSubmissions(data.submissions || []);
    } catch (e) { console.error('Load member submissions error:', e); }
  };

  const loadSubmissionDetail = async (memberId: string, surveyType: string) => {
    try {
      const res = await fetch('/api/survey', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'get_submission_detail', member_id: memberId, survey_type: surveyType }) });
      const data = await res.json();
      if (data.detail) {
        setSelectedSubmission(data.detail);
      }
    } catch (e) { console.error('Load submission detail error:', e); }
  };

  const openSubmission = (sub: SubmissionGroup) => {
    loadSubmissionDetail(sub.member_id, sub.survey_type);
  };

  const openMemberFromSubmission = (memberId: string) => {
    const member = members.find(m => m.id === memberId);
    if (member) {
      setSelectedMember(member);
      loadMemberSubmissions(memberId);
      setSelectedSubmission(null);
    }
  };

  const generateLinks = async () => {
    setIsGenerating(true);
    setLinkSuccess('');
    setGeneratedLinks([]);
    try {
      const res = await fetch('/api/survey', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'generate_link', count: linkCount }) });
      const data = await res.json();
      if (data.links && data.links.length > 0) {
        setGeneratedLinks(data.links);
        setLinkSuccess(`Generated ${data.links.length} survey link${data.links.length > 1 ? 's' : ''}`);
        loadData();
      }
    } catch (e) { console.error('Generate error:', e); }
    setIsGenerating(false);
  };

  const copyLink = (link: string) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const fullUrl = origin + link;
    navigator.clipboard.writeText(fullUrl);
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    try {
      let action = '';
      if (confirmDelete.type === 'member') action = 'delete_member';
      else if (confirmDelete.type === 'response') action = 'delete_response';
      else if (confirmDelete.type === 'relationship') action = 'delete_relationship';
      else if (confirmDelete.type === 'link') action = 'delete_link';
      
      await fetch('/api/survey', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action, [`${confirmDelete.type}_id`]: confirmDelete.id }) });
      setConfirmDelete(null);
      loadData();
      if (confirmDelete.type === 'member') setSelectedMember(null);
    } catch (e) { console.error('Delete error:', e); }
  };

  const handleUpdateMember = async (memberId: string, updates: Record<string, any>) => {
    try {
      await fetch('/api/survey', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'update_member', member_id: memberId, ...updates }) });
      loadData();
      const updated = members.find(m => m.id === memberId);
      if (updated) setSelectedMember({ ...updated, ...updates });
    } catch (e) { console.error('Update error:', e); }
  };

  const handleDeactivateLink = async (linkId: string) => {
    await fetch('/api/survey', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'deactivate_link', link_id: linkId }) });
    loadData();
  };

  const handleReactivateLink = async (linkId: string) => {
    await fetch('/api/survey', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'reactivate_link', link_id: linkId }) });
    loadData();
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  };

  const getStatusClass = (status: string) => {
    if (status === 'completed') return 'status-completed';
    if (status === 'active') return 'status-active';
    if (status === 'deactivated') return 'status-pending';
    return 'status-pending';
  };

  const filteredMembers = filterStatus ? members.filter(m => m.status === filterStatus) : members;
  const filteredRelationships = filterRelType ? relationships.filter(r => r.relationship_type === filterRelType) : relationships;

  if (isLoading) {
    return <div className="loading" style={{ textAlign: 'center', padding: 'var(--space-8)' }}>Loading...</div>;
  }

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
        {(['members', 'responses', 'relationships', 'links', 'settings'] as const).map(tab => (
          <button key={tab} className={`nav-tab ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {activeTab === 'members' && (
        <div className="flex gap-4">
          <div style={{ flex: 1 }}>
            <div className="flex justify-between items-center mb-3">
              <h3>Members ({filteredMembers.length})</h3>
              <select className="input" style={{ width: 150 }} value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th>Stage</th>
                    <th>Created</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMembers.map(member => (
                    <tr key={member.id} onClick={() => { setSelectedMember(member); loadMemberSubmissions(member.id); }} style={{ cursor: 'pointer', background: selectedMember?.id === member.id ? 'var(--primary-subtle)' : undefined }}>
                      <td style={{ fontWeight: 500 }}>{member.display_name || member.full_name || 'Anonymous'}</td>
                      <td className="text-muted">{member.email || '—'}</td>
                      <td><span className={`status ${getStatusClass(member.status)}`}>{member.status}</span></td>
                      <td className="text-muted">{member.survey_stage || '—'}</td>
                      <td className="text-muted">{member.created_at ? new Date(member.created_at).toLocaleDateString() : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {selectedMember && (
            <div style={{ width: 400, borderLeft: '1px solid var(--border)', paddingLeft: 'var(--space-4)', marginLeft: 'var(--space-4)' }}>
              <div className="flex justify-between items-center mb-3">
                <h3>Member Details</h3>
                <button className="btn btn-small" onClick={() => setSelectedMember(null)}>×</button>
              </div>
              
              <div style={{ display: 'grid', gap: 'var(--space-3)', fontSize: '0.875rem' }}>
                <Field label="Display Name" value={selectedMember.display_name} onSave={(v) => handleUpdateMember(selectedMember.id, { display_name: v })} />
                <Field label="Full Name" value={selectedMember.full_name} onSave={(v) => handleUpdateMember(selectedMember.id, { full_name: v })} />
                <Field label="Email" value={selectedMember.email} onSave={(v) => handleUpdateMember(selectedMember.id, { email: v })} />
                <Field label="Phone" value={selectedMember.phone_number} onSave={(v) => handleUpdateMember(selectedMember.id, { phone_number: v })} />
                <Field label="Date of Birth" value={selectedMember.date_of_birth} onSave={(v) => handleUpdateMember(selectedMember.id, { date_of_birth: v })} />
                <Field label="Profession" value={selectedMember.profession} onSave={(v) => handleUpdateMember(selectedMember.id, { profession: v })} />
                <Field label="Current Activity" value={selectedMember.current_activity_or_job_title} onSave={(v) => handleUpdateMember(selectedMember.id, { current_activity_or_job_title: v })} />
                <Field label="Primary Language" value={selectedMember.primary_language} onSave={(v) => handleUpdateMember(selectedMember.id, { primary_language: v })} />
                <Field label="Additional Languages" value={selectedMember.additional_languages} onSave={(v) => handleUpdateMember(selectedMember.id, { additional_languages: v })} />
                <Field label="Role in Circle" value={selectedMember.role_in_tribe} onSave={(v) => handleUpdateMember(selectedMember.id, { role_in_tribe: v })} />
                <Field label="Tenure" value={selectedMember.tenure} onSave={(v) => handleUpdateMember(selectedMember.id, { tenure: v })} />
                <Field label="City" value={selectedMember.current_city} onSave={(v) => handleUpdateMember(selectedMember.id, { current_city: v })} />
                <Field label="Country" value={selectedMember.current_country} onSave={(v) => handleUpdateMember(selectedMember.id, { current_country: v })} />
                <div className="flex justify-between items-center" style={{ padding: 'var(--space-2) 0', borderTop: '1px solid var(--border)' }}>
                  <span className="text-muted">Status</span>
                  <span className={`status ${getStatusClass(selectedMember.status)}`}>{selectedMember.status}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted">Survey Stage</span>
                  <span>{selectedMember.survey_stage || 'none'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted">Created</span>
                  <span>{selectedMember.created_at ? new Date(selectedMember.created_at).toLocaleString() : '—'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted">ID</span>
                  <code style={{ fontSize: '0.7rem' }}>{selectedMember.id.slice(0, 8)}...</code>
                </div>

                {memberSubmissions.length > 0 && (
                  <div style={{ marginTop: 'var(--space-4)', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--border)' }}>
                    <h4 style={{ fontSize: '0.875rem', marginBottom: 'var(--space-2)' }}>Survey Submissions</h4>
                    {memberSubmissions.map((sub, idx) => (
                      <div 
                        key={idx} 
                        onClick={() => loadSubmissionDetail(selectedMember.id, sub.survey_type)}
                        style={{ 
                          padding: 'var(--space-2)', 
                          marginBottom: 'var(--space-1)', 
                          background: 'var(--bg)', 
                          borderRadius: 'var(--radius)',
                          cursor: 'pointer',
                          fontSize: '0.8rem'
                        }}
                      >
                        <span className="status status-active">{sub.survey_type}</span>
                        <span className="text-muted" style={{ marginLeft: 'var(--space-2)' }}>
                          {sub.response_count} responses - {sub.created_at ? new Date(sub.created_at).toLocaleDateString() : ''}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                <div style={{ marginTop: 'var(--space-4)', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--border)' }}>
                  <button className="btn btn-small" style={{ background: 'var(--danger)', color: 'white' }} onClick={() => setConfirmDelete({ type: 'member', id: selectedMember.id, name: selectedMember.display_name || 'Member' })}>
                    Delete Member
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'responses' && (
        <div className="flex gap-4">
          <div style={{ flex: 1 }}>
            <h3 className="mb-3">Survey Submissions ({submissions.length})</h3>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Member</th>
                    <th>Survey Type</th>
                    <th>Responses</th>
                    <th>Submitted</th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.map((sub, idx) => (
                    <tr key={`${sub.member_id}-${sub.survey_type}-${idx}`} onClick={() => openSubmission(sub)} style={{ cursor: 'pointer', background: selectedSubmission?.member_id === sub.member_id && selectedSubmission?.survey_type === sub.survey_type ? 'var(--primary-subtle)' : undefined }}>
                      <td style={{ fontWeight: 500 }}>{sub.display_name || sub.anonymous_id?.slice(0, 8) || 'Anonymous'}</td>
                      <td><span className="status status-active">{sub.survey_type}</span></td>
                      <td>{sub.response_count} answers</td>
                      <td className="text-muted">{sub.created_at ? new Date(sub.created_at).toLocaleDateString() : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {selectedSubmission && (
            <div style={{ width: 450, borderLeft: '1px solid var(--border)', paddingLeft: 'var(--space-4)', marginLeft: 'var(--space-4)', maxHeight: '80vh', overflow: 'auto' }}>
              <div className="flex justify-between items-center mb-3">
                <h3>Submission Details</h3>
                <button className="btn btn-small" onClick={() => setSelectedSubmission(null)}>×</button>
              </div>
              
              <div style={{ fontSize: '0.875rem', marginBottom: 'var(--space-4)' }}>
                <div className="flex gap-2 mb-3">
                  <button className="btn btn-small" onClick={() => openMemberFromSubmission(selectedSubmission.member_id)}>
                    View Member
                  </button>
                </div>
                <div><span className="text-muted">Member:</span> <strong>{selectedSubmission.display_name}</strong></div>
                <div><span className="text-muted">Survey:</span> {selectedSubmission.survey_type}</div>
                <div><span className="text-muted">Submitted:</span> {selectedSubmission.submitted_at ? new Date(selectedSubmission.submitted_at).toLocaleString() : '—'}</div>
              </div>

              {selectedSubmission.profile_data && selectedSubmission.profile_data.length > 0 && (
                <div style={{ marginBottom: 'var(--space-4)' }}>
                  <h4 style={{ fontSize: '0.875rem', marginBottom: 'var(--space-2)', paddingBottom: 'var(--space-2)', borderBottom: '1px solid var(--border)' }}>Profile</h4>
                  {selectedSubmission.profile_data.map((r, i) => (
                    <div key={i} style={{ fontSize: '0.8rem', marginBottom: 'var(--space-1)' }}>
                      <span className="text-muted">{r.field}:</span> {String(r.value).substring(0, 100)}
                    </div>
                  ))}
                </div>
              )}

              {selectedSubmission.relationships && selectedSubmission.relationships.length > 0 && (
                <div style={{ marginBottom: 'var(--space-4)' }}>
                  <h4 style={{ fontSize: '0.875rem', marginBottom: 'var(--space-2)', paddingBottom: 'var(--space-2)', borderBottom: '1px solid var(--border)' }}>Relationships / Nominations</h4>
                  {selectedSubmission.relationships.map((r, i) => (
                    <div key={i} style={{ fontSize: '0.8rem', marginBottom: 'var(--space-1)' }}>
                      <span className="text-muted">{r.type}:</span> {r.target_name || r.target_id}
                    </div>
                  ))}
                </div>
              )}

              {selectedSubmission.reflection_responses.length > 0 && (
                <div style={{ marginBottom: 'var(--space-4)' }}>
                  <h4 style={{ fontSize: '0.875rem', marginBottom: 'var(--space-2)', paddingBottom: 'var(--space-2)', borderBottom: '1px solid var(--border)' }}>Reflection</h4>
                  {selectedSubmission.reflection_responses.map((r, i) => (
                    <div key={i} style={{ fontSize: '0.8rem', marginBottom: 'var(--space-2)' }}>
                      <span className="text-muted">{r.question_id}:</span>
                      <div style={{ marginTop: '2px', paddingLeft: 'var(--space-2)', borderLeft: '2px solid var(--primary)' }}>{String(r.answer_value)}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {activeTab === 'relationships' && (
        <div className="flex gap-4">
          <div style={{ flex: 1 }}>
            <div className="flex justify-between items-center mb-3">
              <h3>Relationships ({filteredRelationships.length})</h3>
              <select className="input" style={{ width: 180 }} value={filterRelType} onChange={(e) => setFilterRelType(e.target.value)}>
                <option value="">All Types</option>
                <option value="closeness">Closeness</option>
                <option value="support">Support</option>
                <option value="trust">Trust</option>
                <option value="collaboration">Collaboration</option>
                <option value="influence">Influence</option>
                <option value="bridge">Bridge</option>
                <option value="tension">Tension</option>
                <option value="emotional_closeness">Emotional Closeness</option>
                <option value="reliance">Reliance</option>
              </select>
            </div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>From</th>
                    <th>Relationship</th>
                    <th>To</th>
                    <th>Strength</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRelationships.map(rel => (
                    <tr key={rel.id} onClick={() => setSelectedRelationship(rel)} style={{ cursor: 'pointer', background: selectedRelationship?.id === rel.id ? 'var(--primary-subtle)' : undefined }}>
                      <td>{rel.source_name || rel.source_id?.slice(0, 8) || '—'}</td>
                      <td><span className="status status-active">{rel.relationship_type}</span></td>
                      <td>{rel.target_name || rel.target_id?.slice(0, 8) || '—'}</td>
                      <td style={{ textAlign: 'center' }}>{rel.strength}</td>
                      <td className="text-muted">{rel.created_at ? new Date(rel.created_at).toLocaleDateString() : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {selectedRelationship && (
            <div style={{ width: 350, borderLeft: '1px solid var(--border)', paddingLeft: 'var(--space-4)', marginLeft: 'var(--space-4)' }}>
              <div className="flex justify-between items-center mb-3">
                <h3>Relationship Details</h3>
                <button className="btn btn-small" onClick={() => setSelectedRelationship(null)}>×</button>
              </div>
              <div style={{ fontSize: '0.875rem', display: 'grid', gap: 'var(--space-2)' }}>
                <div><span className="text-muted">ID:</span> <code>{selectedRelationship.id.slice(0, 12)}...</code></div>
                <div><span className="text-muted">From:</span> {selectedRelationship.source_name || selectedRelationship.source_id}</div>
                <div><span className="text-muted">To:</span> {selectedRelationship.target_name || selectedRelationship.target_id}</div>
                <div><span className="text-muted">Type:</span> {selectedRelationship.relationship_type}</div>
                <div><span className="text-muted">Strength:</span> {selectedRelationship.strength}</div>
                <div><span className="text-muted">Confidence:</span> {selectedRelationship.source_confidence}</div>
                <div><span className="text-muted">Direction:</span> {selectedRelationship.direction}</div>
                <div><span className="text-muted">Created:</span> {selectedRelationship.created_at ? new Date(selectedRelationship.created_at).toLocaleString() : '—'}</div>
                <button className="btn btn-small mt-3" style={{ background: 'var(--danger)', color: 'white' }} onClick={() => setConfirmDelete({ type: 'relationship', id: selectedRelationship.id, name: 'Relationship' })}>
                  Delete Relationship
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'links' && (
        <div>
          <h3 className="mb-3">Survey Links History ({surveyLinks.length})</h3>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Token</th>
                  <th>Context</th>
                  <th>Status</th>
                  <th>Member</th>
                  <th>Created</th>
                  <th>Submitted</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {surveyLinks.map(link => (
                  <tr key={link.id}>
                    <td><code style={{ fontSize: '0.75rem' }}>/survey/{link.token}</code></td>
                    <td><span className="status status-active">{link.context}</span></td>
                    <td><span className={`status ${getStatusClass(link.status)}`}>{link.status}</span></td>
                    <td>{link.member_name || link.member_id?.slice(0, 8) || '—'}</td>
                    <td className="text-muted">{link.created_at ? new Date(link.created_at).toLocaleDateString() : '—'}</td>
                    <td className="text-muted">{link.submitted_at ? new Date(link.submitted_at).toLocaleDateString() : '—'}</td>
                    <td>
                      <div className="flex gap-2">
                        <button className="btn btn-small" style={{ color: 'var(--primary)', border: 'none', background: 'none' }} onClick={() => window.open(`/survey/${link.token}`, '_blank')}>Open</button>
                        <button className="btn btn-small" style={{ color: 'var(--primary)', border: 'none', background: 'none' }} onClick={() => copyLink(`/survey/${link.token}`)}>Copy</button>
                        {link.status === 'active' ? (
                          <button className="btn btn-small" style={{ color: 'var(--danger)', border: 'none', background: 'none' }} onClick={() => handleDeactivateLink(link.id)}>Deactivate</button>
                        ) : link.status === 'deactivated' ? (
                          <button className="btn btn-small" style={{ color: 'var(--success)', border: 'none', background: 'none' }} onClick={() => handleReactivateLink(link.id)}>Reactivate</button>
                        ) : null}
                        <button className="btn btn-small" style={{ color: 'var(--text-muted)', border: 'none', background: 'none' }} onClick={() => setConfirmDelete({ type: 'link', id: link.id, name: 'Link' })}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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

          {linkSuccess && (
            <div style={{ padding: 'var(--space-3)', background: 'var(--primary-subtle)', color: 'var(--primary)', borderRadius: 'var(--radius)', fontSize: '0.875rem', marginTop: 'var(--space-4)' }}>
              {linkSuccess}
            </div>
          )}

          {generatedLinks.length > 0 && (
            <div className="mt-6 pt-6" style={{ borderTop: '1px solid var(--border)' }}>
              <div className="section-title">Generated Links</div>
              <div style={{ marginTop: 'var(--space-3)', fontSize: '0.8125rem' }}>
                {generatedLinks.map((link, i) => (
                  <div key={i} className="flex justify-between items-center" style={{ padding: 'var(--space-2) 0', borderBottom: '1px solid var(--border)' }}>
                    <code style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{link}</code>
                    <button className="btn btn-small" style={{ color: 'var(--primary)', border: 'none', background: 'none' }} onClick={() => copyLink(link)}>
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
              loadData();
            }}>
              Initialize Database
            </button>
          </div>
        </div>
      )}

      {confirmDelete && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div className="card" style={{ maxWidth: 400 }}>
            <h3>Confirm Delete</h3>
            <p className="mt-3">Are you sure you want to delete this {confirmDelete.type}?</p>
            <p className="text-muted" style={{ fontSize: '0.875rem' }}>"{confirmDelete.name}"</p>
            <p className="text-muted mt-2" style={{ fontSize: '0.75rem', color: 'var(--danger)' }}>This action cannot be undone.</p>
            <div className="flex gap-2 mt-4">
              <button className="btn btn-secondary" onClick={() => setConfirmDelete(null)}>Cancel</button>
              <button className="btn btn-primary" style={{ background: 'var(--danger)' }} onClick={handleDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, value, onSave }: { label: string; value: string | null; onSave: (v: string) => void }) {
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(value || '');

  if (editing) {
    return (
      <div className="flex gap-2 items-center">
        <span className="text-muted" style={{ minWidth: 100 }}>{label}:</span>
        <input className="input" style={{ flex: 1, fontSize: '0.8rem' }} value={editValue} onChange={(e) => setEditValue(e.target.value)} />
        <button className="btn btn-small" onClick={() => { onSave(editValue); setEditing(false); }}>Save</button>
        <button className="btn btn-small" onClick={() => setEditing(false)}>×</button>
      </div>
    );
  }

  return (
    <div className="flex justify-between items-center" style={{ padding: 'var(--space-1) 0' }}>
      <span className="text-muted">{label}:</span>
      <span className="flex gap-2 items-center">
        {value || '—'}
        <button className="btn btn-small" style={{ border: 'none', background: 'none', color: 'var(--primary)', fontSize: '0.7rem', padding: '2px 4px' }} onClick={() => setEditValue(value || '')}>Edit</button>
      </span>
    </div>
  );
}
