import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, FlaskConical, Download, CheckCircle, Clock, Upload, Eye, ShieldCheck,
  XCircle, Printer, Search, TestTube, Activity, TrendingUp, AlertCircle,
  Microscope, Brain, Scan, Radiation, Baby, Droplet, Beaker, FileText,
  Filter, ChevronRight,
} from 'lucide-react';
import { PageHeader, Card, Badge, Button, Modal, StatCard, SectionCard, EmptyState } from '../../../components/ui/index.jsx';
import { mockApi } from '../../../services/mockApi.js';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { LabReportModal } from '../../../components/lab/LabReportDocument.jsx';

const labStages = [
  { key: 'pending', label: 'Requested', color: 'warning' },
  { key: 'sample_collected', label: 'Collected', color: 'primary' },
  { key: 'in_progress', label: 'Processing', color: 'info' },
  { key: 'completed', label: 'Uploaded', color: 'accent' },
  { key: 'verified', label: 'Verified', color: 'secondary' },
  { key: 'approved', label: 'Approved', color: 'success' },
];

const testCatalog = [
  { name: 'Complete Blood Count (CBC)', type: 'Hematology', category: 'Blood Test' },
  { name: 'Blood Glucose (Fasting)', type: 'Biochemistry', category: 'Blood Test' },
  { name: 'Lipid Profile', type: 'Biochemistry', category: 'Blood Test' },
  { name: 'Liver Function Test (LFT)', type: 'Biochemistry', category: 'Blood Test' },
  { name: 'Kidney Function Test (KFT)', type: 'Biochemistry', category: 'Blood Test' },
  { name: 'Thyroid Panel (T3/T4/TSH)', type: 'Biochemistry', category: 'Blood Test' },
  { name: 'Urine Routine Analysis', type: 'Pathology', category: 'Urine Test' },
  { name: 'Urine Culture', type: 'Microbiology', category: 'Urine Test' },
  { name: 'ECG (12-Lead)', type: 'Cardiology', category: 'ECG' },
  { name: 'Echocardiogram', type: 'Cardiology', category: 'ECG' },
  { name: 'X-Ray Chest PA', type: 'Radiology', category: 'X-Ray' },
  { name: 'MRI Brain', type: 'Radiology', category: 'MRI' },
  { name: 'CT Scan Head', type: 'Radiology', category: 'CT Scan' },
  { name: 'Ultrasound Abdomen', type: 'Radiology', category: 'Ultrasound' },
  { name: 'Tissue Biopsy', type: 'Pathology', category: 'Pathology' },
  { name: 'Culture & Sensitivity', type: 'Microbiology', category: 'Microbiology' },
];

export default function LabReports() {
  const { user } = useSelector((s) => s.auth);
  // Patients get a read-only "My Reports" view: the lab prepares and completes
  // reports, and they appear here automatically. Patients never upload anything.
  const isPatient = user?.role === 'patient';
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [uploadTarget, setUploadTarget] = useState(null);
  const [detailTarget, setDetailTarget] = useState(null);
  const [rejectTarget, setRejectTarget] = useState(null);
  const [form, setForm] = useState({ patientName: '', testName: '', doctorName: '', type: 'Blood Test', priority: 'normal' });
  const [reportForm, setReportForm] = useState({ result: '', normalRange: '' });
  const [rejectReason, setRejectReason] = useState('');
  const [comment, setComment] = useState('');
  const [reportTarget, setReportTarget] = useState(null);
  const [reportPatient, setReportPatient] = useState(null);

  const load = () => {
    setLoading(true);
    mockApi.listLabTests({ limit: 200 }).then((r) => {
      let items = r.items;
      if (isPatient) {
        const pid = user?.patientId || user?.id;
        const pname = (user?.name || '').toLowerCase();
        items = items.filter((t) => (pid && t.patientId === pid) || (pname && (t.patientName || '').toLowerCase() === pname));
      }
      setRows(items);
      setLoading(false);
    });
  };
  useEffect(load, []);


  // Pull the full patient record so the printed report header carries
  // age / gender / ID exactly like a hospital-issued report.
  useEffect(() => {
    if (!reportTarget?.patientId) { setReportPatient(null); return; }
    let alive = true;
    mockApi.getPatient(reportTarget.patientId)
      .then((p) => { if (alive) setReportPatient(p || null); })
      .catch(() => { if (alive) setReportPatient(null); });
    return () => { alive = false; };
  }, [reportTarget]);


  const filtered = useMemo(() => {
    return rows.filter((t) => {
      if (statusFilter !== 'all' && t.status !== statusFilter) return false;
      if (search && !t.patientName?.toLowerCase().includes(search.toLowerCase()) && !t.testName?.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [rows, search, statusFilter]);

  const pending = rows.filter((t) => t.status === 'pending');
  const inProgress = rows.filter((t) => t.status === 'sample_collected' || t.status === 'in_progress');
  const completed = rows.filter((t) => t.status === 'completed' || t.status === 'verified' || t.status === 'approved');
  const approved = rows.filter((t) => t.status === 'approved');
  const highPriority = rows.filter((t) => t.priority === 'high' && t.status !== 'approved');
  const avgTAT = approved.filter((t) => t.tatHours).reduce((s, t) => s + t.tatHours, 0) / (approved.filter((t) => t.tatHours).length || 1);

  const create = async (e) => {
    e.preventDefault();
    const testDef = testCatalog.find((t) => t.name === form.testName);
    await mockApi.requestLabTest({
      patientName: form.patientName,
      testName: form.testName,
      testType: testDef?.type || form.type,
      category: testDef?.category || 'General',
      doctorName: form.doctorName,
      priority: form.priority,
    }, { id: user?.id, name: user?.name, role: user?.role });
    toast.success('Lab test requested');
    setModalOpen(false);
    setForm({ patientName: '', testName: '', doctorName: '', type: 'Blood Test', priority: 'normal' });
    load();
  };

  const collectSample = async (test) => {
    await mockApi.collectSample(test.id, { id: user?.id, name: user?.name, role: user?.role });
    toast.success(`Sample collected for ${test.testName}`);
    load();
  };

  const uploadReport = async () => {
    await mockApi.uploadLabReport(uploadTarget.id, reportForm, { id: user?.id, name: user?.name, role: user?.role });
    toast.success('Report uploaded — patient & doctor notified');
    setUploadTarget(null);
    setReportForm({ result: '', normalRange: '' });
    load();
  };

  const verifyReport = async (test) => {
    await mockApi.verifyLabReport(test.id, { id: user?.id, name: user?.name, role: user?.role });
    toast.success('Report verified');
    load();
  };

  const approveReport = async (test) => {
    await mockApi.approveLabReport(test.id, { id: user?.id, name: user?.name, role: user?.role });
    toast.success('Report approved — patient & doctor notified');
    load();
  };

  const rejectReport = async () => {
    await mockApi.rejectLabReport(rejectTarget.id, rejectReason, { id: user?.id, name: user?.name, role: user?.role });
    toast.success('Report rejected');
    setRejectTarget(null);
    setRejectReason('');
    load();
  };

  const addComment = async () => {
    if (!comment.trim() || !detailTarget) return;
    await mockApi.addLabComment(detailTarget.id, comment, { id: user?.id, name: user?.name, role: user?.role });
    toast.success('Comment added');
    setComment('');
    load();
    setDetailTarget({ ...detailTarget, comments: [...(detailTarget.comments || []), { text: comment, userName: user?.name, role: user?.role, createdAt: new Date().toISOString() }] });
  };

  const statusTabs = [
    { key: 'all', label: 'All', count: rows.length },
    { key: 'pending', label: 'Pending', count: pending.length },
    { key: 'sample_collected', label: 'Collected', count: rows.filter((t) => t.status === 'sample_collected').length },
    { key: 'in_progress', label: 'Processing', count: rows.filter((t) => t.status === 'in_progress').length },
    { key: 'completed', label: 'Uploaded', count: rows.filter((t) => t.status === 'completed').length },
    { key: 'verified', label: 'Verified', count: rows.filter((t) => t.status === 'verified').length },
    { key: 'approved', label: 'Approved', count: approved.length },
  ];

  return (
    <div>
      <PageHeader
        title={isPatient ? 'My Lab Reports' : 'Lab Reports'}
        description={isPatient ? 'Your reports appear here automatically once the laboratory completes them — view, download or print any time.' : 'Complete diagnostic workflow — from test request to report approval.'}
        breadcrumb={isPatient ? 'Laboratory · My Reports' : 'Laboratory · Reports'}
        action={isPatient ? null : <Button onClick={() => setModalOpen(true)}><Plus className="h-4 w-4" /> Request Test</Button>}
      />


      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard icon={Clock} label="Pending" value={pending.length} color="warning" delay={0} />
        <StatCard icon={TestTube} label="In Progress" value={inProgress.length} color="primary" delay={0.05} />
        <StatCard icon={CheckCircle} label="Completed" value={completed.length} color="success" delay={0.1} />
        <StatCard icon={ShieldCheck} label="Approved" value={approved.length} color="secondary" delay={0.15} />
        <StatCard icon={TrendingUp} label="Avg TAT" value={`${avgTAT.toFixed(1)}h`} color="accent" delay={0.2} />
      </div>

      {/* High priority alert */}
      {highPriority.length > 0 && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mt-6 flex items-center gap-4 rounded-2xl border border-error-200 bg-error-50/50 p-4">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-error-100 text-error-600">
            <AlertCircle className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-error-800">{highPriority.length} high-priority test{highPriority.length > 1 ? 's' : ''} need attention</p>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {highPriority.slice(0, 5).map((t) => (
                <span key={t.id} className="rounded-lg bg-error-100 px-2 py-0.5 text-xs font-medium text-error-700">{t.testName} — {t.patientName}</span>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Filter tabs + search */}
      <div className="mt-8 mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-1.5">
          {statusTabs.map((tab) => (
            <button key={tab.key} onClick={() => setStatusFilter(tab.key)}
              className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-all ${statusFilter === tab.key ? 'bg-primary-600 text-white shadow-sm shadow-primary-600/20' : 'bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50'}`}>
              {tab.label}
              <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${statusFilter === tab.key ? 'bg-white/20' : 'bg-neutral-100'}`}>{tab.count}</span>
            </button>
          ))}
        </div>
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search patient or test..." className="input pl-9" />
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-neutral-100 bg-neutral-50/50">
                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-neutral-500">Test</th>
                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-neutral-500">Patient</th>
                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-neutral-500">Doctor</th>
                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-neutral-500">Priority</th>
                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-neutral-500">Status</th>
                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-neutral-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>{Array.from({ length: 6 }).map((_, j) => <td key={j} className="px-5 py-4"><div className="skeleton h-4 w-full max-w-[120px]" /></td>)}</tr>
                ))
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6}>{isPatient
                  ? <EmptyState icon={FlaskConical} title="No lab reports yet" description="Once the laboratory completes a booked test, your report will appear here automatically." />
                  : <EmptyState icon={FlaskConical} title="No tests found" description="Request a new lab test to get started." action={<Button onClick={() => setModalOpen(true)}><Plus className="h-4 w-4" /> Request Test</Button>} />}</td></tr>
              ) : (
                filtered.map((row, i) => (
                  <motion.tr key={row.id || i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: Math.min(i * 0.02, 0.3) }}
                    onClick={() => setDetailTarget(row)} className="table-row-hover cursor-pointer">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary-100 text-primary-600 shrink-0">
                          {getTestIcon(row.testName)}
                        </div>
                        <div>
                          <p className="font-medium text-neutral-900">{row.testName}</p>
                          <p className="text-xs text-neutral-500">{row.testType} · {row.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-sm font-medium text-neutral-700">{row.patientName}</td>
                    <td className="px-5 py-3.5 text-sm text-neutral-500">{row.doctorName}</td>
                    <td className="px-5 py-3.5"><Badge variant={row.priority === 'high' ? 'error' : 'neutral'} dot>{row.priority || 'normal'}</Badge></td>
                    <td className="px-5 py-3.5"><StatusBadge status={row.status} /></td>
                    <td className="px-5 py-3.5">
                      <div className="flex flex-wrap gap-1.5" onClick={(e) => e.stopPropagation()}>
                        {isPatient ? (
                          (row.status === 'completed' || row.status === 'verified' || row.status === 'approved') ? (
                            <>
                              <ActionBtn icon={Eye} label="View" color="primary" onClick={() => setReportTarget(row)} />
                              <ActionBtn icon={Download} label="Download" color="success" onClick={() => setReportTarget(row)} />
                              <ActionBtn icon={Printer} label="Print" color="neutral" onClick={() => setReportTarget(row)} />
                            </>
                          ) : (
                            <span className="text-xs text-neutral-500">Report in preparation</span>
                          )
                        ) : (
                          <>
                            {row.status === 'pending' && <ActionBtn icon={TestTube} label="Collect" color="primary" onClick={() => collectSample(row)} />}
                            {row.status === 'sample_collected' && <ActionBtn icon={Upload} label="Upload" color="success" onClick={() => setUploadTarget(row)} />}
                            {row.status === 'completed' && <ActionBtn icon={Eye} label="Verify" color="info" onClick={() => verifyReport(row)} />}
                            {row.status === 'verified' && <ActionBtn icon={ShieldCheck} label="Approve" color="success" onClick={() => approveReport(row)} />}
                            {(row.status === 'completed' || row.status === 'verified' || row.status === 'approved') && (
                              <>
                                <ActionBtn icon={Download} label="" color="neutral" onClick={() => setReportTarget(row)} />
                                <ActionBtn icon={Printer} label="" color="neutral" onClick={() => setReportTarget(row)} />
                              </>
                            )}
                            {row.status !== 'approved' && row.status !== 'pending' && <ActionBtn icon={XCircle} label="" color="error" onClick={() => setRejectTarget(row)} />}
                          </>
                        )}
                      </div>
                    </td>

                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Request Test Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Request Lab Test" size="lg">
        <form onSubmit={create} className="space-y-4">
          <div><label className="label">Test Name</label>
            <select value={form.testName} onChange={(e) => setForm({ ...form, testName: e.target.value })} className="input" required>
              <option value="">Choose a test...</option>
              {testCatalog.map((t) => <option key={t.name} value={t.name}>{t.name} ({t.category})</option>)}
            </select>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div><label className="label">Patient Name</label><input required value={form.patientName} onChange={(e) => setForm({ ...form, patientName: e.target.value })} className="input" /></div>
            <div><label className="label">Requested By (Doctor)</label><input required value={form.doctorName} onChange={(e) => setForm({ ...form, doctorName: e.target.value })} className="input" /></div>
          </div>
          <div>
            <label className="label">Priority</label>
            <div className="flex gap-2">
              {['normal', 'urgent', 'high'].map((p) => (
                <button key={p} type="button" onClick={() => setForm({ ...form, priority: p })}
                  className={`flex-1 rounded-xl border px-3 py-2.5 text-sm font-medium transition ${form.priority === p ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-neutral-200 text-neutral-600 hover:bg-neutral-50'}`}>
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2"><Button variant="outline" type="button" onClick={() => setModalOpen(false)}>Cancel</Button><Button type="submit">Request Test</Button></div>
        </form>
      </Modal>

      {/* Upload Report Modal */}
      <Modal open={!!uploadTarget} onClose={() => setUploadTarget(null)} title={`Upload Report — ${uploadTarget?.testName || ''}`} size="lg">
        <div className="space-y-4">
          <div className="rounded-xl bg-neutral-50 p-4 space-y-1.5 text-sm">
            <div className="flex justify-between"><span className="text-neutral-500">Patient</span><span className="font-medium text-neutral-900">{uploadTarget?.patientName}</span></div>
            <div className="flex justify-between"><span className="text-neutral-500">Test</span><span className="font-medium text-neutral-900">{uploadTarget?.testName}</span></div>
            <div className="flex justify-between"><span className="text-neutral-500">Doctor</span><span className="font-medium text-neutral-900">{uploadTarget?.doctorName}</span></div>
          </div>
          <div><label className="label">Result / Findings</label><textarea rows={5} required value={reportForm.result} onChange={(e) => setReportForm({ ...reportForm, result: e.target.value })} className="input" placeholder="Enter detailed findings..." /></div>
          <div><label className="label">Normal Reference Range</label><input value={reportForm.normalRange} onChange={(e) => setReportForm({ ...reportForm, normalRange: e.target.value })} className="input" placeholder="e.g. WBC: 4000-11000 cells/μL" /></div>
          <div className="rounded-xl bg-primary-50/50 border border-primary-100 p-3.5">
            <p className="text-xs text-primary-700 leading-relaxed flex items-start gap-2">
              <ShieldCheck className="h-4 w-4 shrink-0 mt-0.5" />
              <span>On upload, the report enters verification. Once approved, the patient and doctor are notified automatically.</span>
            </p>
          </div>
          <div className="flex justify-end gap-2"><Button variant="outline" onClick={() => setUploadTarget(null)}>Cancel</Button><Button onClick={uploadReport}><Upload className="h-4 w-4" /> Upload Report</Button></div>
        </div>
      </Modal>

      {/* Reject Modal */}
      <Modal open={!!rejectTarget} onClose={() => setRejectTarget(null)} title={`Reject Report — ${rejectTarget?.testName || ''}`}>
        <div className="space-y-4">
          <div className="rounded-xl bg-error-50/50 border border-error-100 p-3.5">
            <p className="text-sm text-error-700">Rejection sends the test back to the lab team. The patient will be notified of the delay.</p>
          </div>
          <div><label className="label">Reason</label><textarea rows={3} required value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} className="input" placeholder="e.g. Sample hemolyzed. Please recollect." /></div>
          <div className="flex justify-end gap-2"><Button variant="outline" onClick={() => setRejectTarget(null)}>Cancel</Button><Button variant="danger" onClick={rejectReport}><XCircle className="h-4 w-4" /> Reject</Button></div>
        </div>
      </Modal>

      {/* Detail Modal */}
      <Modal open={!!detailTarget} onClose={() => setDetailTarget(null)} title="Test Details" size="lg">
        {detailTarget && (
          <div className="space-y-5">
            {/* Workflow tracker */}
            <div className="flex items-center justify-between gap-1">
              {labStages.map((stage, i) => {
                const currentIdx = labStages.findIndex((s) => s.key === detailTarget.status);
                const isActive = i <= currentIdx;
                const isCurrent = i === currentIdx;
                return (
                  <div key={stage.key} className="flex flex-1 flex-col items-center">
                    <div className="flex w-full items-center">
                      {i > 0 && <div className={`h-0.5 flex-1 ${i <= currentIdx ? 'bg-primary-500' : 'bg-neutral-200'}`} />}
                      <div className={`grid h-8 w-8 place-items-center rounded-full text-xs font-semibold transition ${isActive ? 'bg-primary-600 text-white' : 'bg-neutral-100 text-neutral-400'} ${isCurrent ? 'ring-4 ring-primary-500/20' : ''}`}>
                        {isActive ? <CheckCircle className="h-4 w-4" /> : i + 1}
                      </div>
                      {i < labStages.length - 1 && <div className={`h-0.5 flex-1 ${i < currentIdx ? 'bg-primary-500' : 'bg-neutral-200'}`} />}
                    </div>
                    <span className={`mt-1.5 text-[10px] text-center ${isActive ? 'text-primary-600 font-medium' : 'text-neutral-400'}`}>{stage.label}</span>
                  </div>
                );
              })}
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <InfoRow label="Test" value={detailTarget.testName} />
              <InfoRow label="Type" value={detailTarget.testType} />
              <InfoRow label="Patient" value={detailTarget.patientName} />
              <InfoRow label="Doctor" value={detailTarget.doctorName} />
              <InfoRow label="Priority" value={<Badge variant={detailTarget.priority === 'high' ? 'error' : 'neutral'}>{detailTarget.priority || 'normal'}</Badge>} />
              <InfoRow label="Status" value={<StatusBadge status={detailTarget.status} />} />
            </div>

            {detailTarget.result && (
              <div className="rounded-xl border border-neutral-100 p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2">Result</p>
                <p className="text-sm text-neutral-900 whitespace-pre-wrap">{detailTarget.result}</p>
                {detailTarget.normalRange && <p className="mt-2 text-xs text-neutral-500">Reference: {detailTarget.normalRange}</p>}
              </div>
            )}

            {/* Comments */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-3">Comments</p>
              <div className="space-y-2 mb-3">
                {(detailTarget.comments || []).length === 0 ? <p className="text-sm text-neutral-400">No comments yet.</p> :
                  (detailTarget.comments || []).map((c, i) => (
                    <div key={i} className="rounded-xl border border-neutral-100 p-3">
                      <p className="text-sm text-neutral-900">{c.text}</p>
                      <p className="mt-1 text-xs text-neutral-400">{c.userName} ({c.role}) · {new Date(c.createdAt).toLocaleString()}</p>
                    </div>
                  ))}
              </div>
              {!isPatient && (
                <div className="flex gap-2">
                  <input value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Add a comment..." className="input" onKeyDown={(e) => e.key === 'Enter' && addComment()} />
                  <Button size="sm" onClick={addComment}>Add</Button>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-2 pt-2 border-t border-neutral-100">
              {!isPatient && detailTarget.status === 'pending' && <Button onClick={() => { collectSample(detailTarget); setDetailTarget(null); }}><TestTube className="h-4 w-4" /> Collect Sample</Button>}
              {!isPatient && detailTarget.status === 'sample_collected' && <Button onClick={() => { setUploadTarget(detailTarget); setDetailTarget(null); }}><Upload className="h-4 w-4" /> Upload Report</Button>}
              {!isPatient && detailTarget.status === 'completed' && <Button onClick={() => { verifyReport(detailTarget); setDetailTarget(null); }}><Eye className="h-4 w-4" /> Verify</Button>}
              {!isPatient && detailTarget.status === 'verified' && <Button onClick={() => { approveReport(detailTarget); setDetailTarget(null); }}><ShieldCheck className="h-4 w-4" /> Approve</Button>}
              {(detailTarget.status === 'completed' || detailTarget.status === 'verified' || detailTarget.status === 'approved') && (
                <>
                  <Button variant="outline" onClick={() => { setReportTarget(detailTarget); setDetailTarget(null); }}><Download className="h-4 w-4" /> Download PDF</Button>
                  <Button variant="outline" onClick={() => { setReportTarget(detailTarget); setDetailTarget(null); }}><Printer className="h-4 w-4" /> Print</Button>
                </>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Printable A4 lab report — the preview is the PDF */}
      <LabReportModal
        open={!!reportTarget}
        onClose={() => setReportTarget(null)}
        test={reportTarget || {}}
        patient={reportPatient || { id: reportTarget?.patientId, name: reportTarget?.patientName }}
        verifiedBy={reportTarget?.verifiedBy || reportTarget?.doctorName}
      />

    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    pending: { variant: 'warning', label: 'Pending' },
    sample_collected: { variant: 'info', label: 'Collected' },
    in_progress: { variant: 'info', label: 'Processing' },
    completed: { variant: 'accent', label: 'Uploaded' },
    verified: { variant: 'secondary', label: 'Verified' },
    approved: { variant: 'success', label: 'Approved' },
    rejected: { variant: 'error', label: 'Rejected' },
  };
  const cfg = map[status] || { variant: 'neutral', label: status };
  return <Badge variant={cfg.variant} dot>{cfg.label}</Badge>;
}

function ActionBtn({ icon: Icon, label, color, onClick }) {
  const colors = {
    primary: 'bg-primary-100 text-primary-700 hover:bg-primary-200',
    success: 'bg-success-100 text-success-700 hover:bg-success-200',
    error: 'bg-error-100 text-error-700 hover:bg-error-200',
    info: 'bg-primary-100 text-primary-700 hover:bg-primary-200',
    neutral: 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200',
  };
  return (
    <button onClick={onClick} className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium transition ${colors[color]}`}>
      <Icon className="h-3.5 w-3.5" /> {label}
    </button>
  );
}

function InfoRow({ label, value }) {
  return <div><p className="text-xs text-neutral-500">{label}</p><p className="mt-0.5 text-sm font-medium text-neutral-900">{value}</p></div>;
}

function getTestIcon(testName) {
  const name = (testName || '').toLowerCase();
  if (name.includes('mri')) return <Brain className="h-4.5 w-4.5" />;
  if (name.includes('ct') || name.includes('scan')) return <Scan className="h-4.5 w-4.5" />;
  if (name.includes('x-ray') || name.includes('xray')) return <Radiation className="h-4.5 w-4.5" />;
  if (name.includes('ecg') || name.includes('echo')) return <Activity className="h-4.5 w-4.5" />;
  if (name.includes('blood') || name.includes('cbc') || name.includes('hematology')) return <Droplet className="h-4.5 w-4.5" />;
  if (name.includes('urine')) return <FlaskConical className="h-4.5 w-4.5" />;
  if (name.includes('ultrasound') || name.includes('doppler')) return <Baby className="h-4.5 w-4.5" />;
  if (name.includes('biopsy') || name.includes('pathology')) return <Beaker className="h-4.5 w-4.5" />;
  if (name.includes('culture') || name.includes('microbiology')) return <Microscope className="h-4.5 w-4.5" />;
  return <TestTube className="h-4.5 w-4.5" />;
}
