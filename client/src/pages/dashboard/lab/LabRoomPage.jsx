import { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Droplet, HeartPulse, Radiation, Scan, Brain, Baby, Beaker, Microscope,
  FlaskConical, TestTube, Activity, Clock, CheckCircle, AlertCircle,
  Search, Upload, Eye, ShieldCheck, Download, Printer, XCircle,
} from 'lucide-react';
import { PageHeader, Card, Badge, Button, Modal, StatCard, SectionCard, EmptyState } from '../../../components/ui/index.jsx';
import { mockApi } from '../../../services/mockApi.js';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';

const saveReportPdf = async (row) => {
  const t = toast.loading('Generating PDF…');
  try {
    const { downloadLabReportPdf } = await import('../../../utils/labReportPdf.js');
    const file = await downloadLabReportPdf({ test: row, patient: { name: row?.patientName, id: row?.patientId } });
    toast.success(`Downloaded ${file}`, { id: t });
  } catch (err) {
    toast.error(err?.message || 'Could not generate the PDF', { id: t });
  }
};

const roomConfig = {
  'blood-collection': { title: 'Blood Collection Area', icon: Droplet, color: 'error', testKeywords: ['blood', 'cbc', 'glucose', 'lipid', 'lft', 'kft', 'thyroid', 'coagulation', 'hematology'] },
  'ecg': { title: 'ECG Room', icon: HeartPulse, color: 'success', testKeywords: ['ecg', 'echo', 'cardiolog'] },
  'xray': { title: 'X-Ray Room', icon: Radiation, color: 'accent', testKeywords: ['x-ray', 'xray'] },
  'ct-scan': { title: 'CT Scan Room', icon: Scan, color: 'secondary', testKeywords: ['ct', 'scan'] },
  'mri': { title: 'MRI Room', icon: Brain, color: 'primary', testKeywords: ['mri'] },
  'ultrasound': { title: 'Ultrasound Room', icon: Baby, color: 'accent', testKeywords: ['ultrasound', 'doppler'] },
  'pathology': { title: 'Pathology Lab', icon: Beaker, color: 'warning', testKeywords: ['biopsy', 'cytology', 'pathology', 'tissue'] },
  'microbiology': { title: 'Microbiology Lab', icon: Microscope, color: 'success', testKeywords: ['culture', 'gram', 'microbiology', 'urine culture'] },
  'biochemistry': { title: 'Biochemistry Lab', icon: FlaskConical, color: 'primary', testKeywords: ['glucose', 'lipid', 'lft', 'kft', 'thyroid', 'biochem'] },
  'hematology': { title: 'Hematology Lab', icon: Droplet, color: 'error', testKeywords: ['cbc', 'coagulation', 'blood group', 'hematology'] },
};

const labStages = [
  { key: 'pending', label: 'Requested' },
  { key: 'sample_collected', label: 'Collected' },
  { key: 'in_progress', label: 'Processing' },
  { key: 'completed', label: 'Uploaded' },
  { key: 'verified', label: 'Verified' },
  { key: 'approved', label: 'Approved' },
];

export default function LabRoomPage({ roomKey }) {
  const { user } = useSelector((s) => s.auth);
  const config = roomConfig[roomKey] || roomConfig['blood-collection'];
  const Icon = config.icon;
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [uploadTarget, setUploadTarget] = useState(null);
  const [detailTarget, setDetailTarget] = useState(null);
  const [reportForm, setReportForm] = useState({ result: '', normalRange: '' });
  const [comment, setComment] = useState('');

  const load = () => {
    setLoading(true);
    mockApi.listLabTests({ limit: 200 }).then((r) => { setRows(r.items); setLoading(false); });
  };
  useEffect(load, [roomKey]);

  const roomTests = useMemo(() => {
    return rows.filter((t) => {
      const name = (t.testName || '').toLowerCase();
      const cat = (t.category || '').toLowerCase();
      const type = (t.testType || '').toLowerCase();
      return config.testKeywords.some((kw) => name.includes(kw) || cat.includes(kw) || type.includes(kw));
    });
  }, [rows, config]);

  const filtered = roomTests.filter((t) =>
    !search || t.patientName?.toLowerCase().includes(search.toLowerCase()) || t.testName?.toLowerCase().includes(search.toLowerCase())
  );

  const pending = roomTests.filter((t) => t.status === 'pending');
  const processing = roomTests.filter((t) => t.status === 'sample_collected' || t.status === 'in_progress');
  const completed = roomTests.filter((t) => t.status === 'completed' || t.status === 'verified' || t.status === 'approved');
  const approved = roomTests.filter((t) => t.status === 'approved');

  const collectSample = async (test) => {
    await mockApi.collectSample(test.id, { id: user?.id, name: user?.name, role: user?.role });
    toast.success(`Sample collected for ${test.testName}`);
    load();
  };

  const uploadReport = async () => {
    await mockApi.uploadLabReport(uploadTarget.id, reportForm, { id: user?.id, name: user?.name, role: user?.role });
    toast.success('Report uploaded — patient & doctor notified');
    setUploadTarget(null); setReportForm({ result: '', normalRange: '' });
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

  const addComment = async () => {
    if (!comment.trim() || !detailTarget) return;
    await mockApi.addLabComment(detailTarget.id, comment, { id: user?.id, name: user?.name, role: user?.role });
    toast.success('Comment added');
    setComment('');
    setDetailTarget({ ...detailTarget, comments: [...(detailTarget.comments || []), { text: comment, userName: user?.name, role: user?.role, createdAt: new Date().toISOString() }] });
    load();
  };

  return (
    <div>
      <PageHeader title={config.title} description={`Tests assigned to the ${config.title}. Manage samples, upload reports, and track status.`} breadcrumb="Laboratory · Rooms" />

      {/* Room header banner */}
      <div className={`mb-6 flex items-center gap-4 rounded-2xl bg-gradient-to-br from-${config.color}-500/10 to-${config.color}-500/5 border border-${config.color}-200/50${config.color}-900/30 p-5`}>
        <div className={`grid h-14 w-14 place-items-center rounded-2xl bg-${config.color}-100${config.color}-900/40 text-${config.color}-600${config.color}-400`}>
          <Icon className="h-7 w-7" strokeWidth={1.8} />
        </div>
        <div>
          <p className="font-display text-lg font-bold text-neutral-900">{config.title}</p>
          <p className="text-sm text-neutral-500">{roomTests.length} tests assigned · {processing.length} in progress · {approved.length} approved</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Clock} label="Pending" value={pending.length} color="warning" delay={0} />
        <StatCard icon={Activity} label="In Progress" value={processing.length} color="primary" delay={0.05} />
        <StatCard icon={CheckCircle} label="Completed" value={completed.length} color="success" delay={0.1} />
        <StatCard icon={ShieldCheck} label="Approved" value={approved.length} color="secondary" delay={0.15} />
      </div>

      {/* Search */}
      <div className="mt-6 mb-4 relative max-w-xs">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search patient or test..." className="input pl-9" />
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
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i}>{Array.from({ length: 6 }).map((_, j) => <td key={j} className="px-5 py-4"><div className="skeleton h-4 w-full max-w-[120px]" /></td>)}</tr>
                ))
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6}><EmptyState icon={Icon} title={`No tests in ${config.title}`} description="Tests will appear here when assigned to this room." /></td></tr>
              ) : (
                filtered.map((row, i) => (
                  <motion.tr key={row.id || i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: Math.min(i * 0.02, 0.3) }}
                    onClick={() => setDetailTarget(row)} className="table-row-hover cursor-pointer">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className={`grid h-9 w-9 place-items-center rounded-lg bg-${config.color}-100${config.color}-900/40 text-${config.color}-600${config.color}-400 shrink-0`}>
                          <TestTube className="h-4.5 w-4.5" />
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
                      <div className="flex gap-1.5" onClick={(e) => e.stopPropagation()}>
                        {row.status === 'pending' && <ActionBtn icon={TestTube} label="Collect" color="primary" onClick={() => collectSample(row)} />}
                        {row.status === 'sample_collected' && <ActionBtn icon={Upload} label="Upload" color="success" onClick={() => setUploadTarget(row)} />}
                        {row.status === 'completed' && <ActionBtn icon={Eye} label="Verify" color="info" onClick={() => verifyReport(row)} />}
                        {row.status === 'verified' && <ActionBtn icon={ShieldCheck} label="Approve" color="success" onClick={() => approveReport(row)} />}
                        {(row.status === 'completed' || row.status === 'verified' || row.status === 'approved') && (
                          <>
                            <ActionBtn icon={Download} label="" color="neutral" onClick={() => saveReportPdf(row)} />
                            <ActionBtn icon={Printer} label="" color="neutral" onClick={() => toast.success('Printing...')} />
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

      {/* Upload Modal */}
      <Modal open={!!uploadTarget} onClose={() => setUploadTarget(null)} title={`Upload Report — ${uploadTarget?.testName || ''}`} size="lg">
        <div className="space-y-4">
          <div className="rounded-xl bg-neutral-50 p-4 space-y-1.5 text-sm">
            <div className="flex justify-between"><span className="text-neutral-500">Patient</span><span className="font-medium text-neutral-900">{uploadTarget?.patientName}</span></div>
            <div className="flex justify-between"><span className="text-neutral-500">Test</span><span className="font-medium text-neutral-900">{uploadTarget?.testName}</span></div>
            <div className="flex justify-between"><span className="text-neutral-500">Doctor</span><span className="font-medium text-neutral-900">{uploadTarget?.doctorName}</span></div>
          </div>
          <div><label className="label">Result / Findings</label><textarea rows={5} required value={reportForm.result} onChange={(e) => setReportForm({ ...reportForm, result: e.target.value })} className="input" placeholder="Enter detailed findings..." /></div>
          <div><label className="label">Normal Reference Range</label><input value={reportForm.normalRange} onChange={(e) => setReportForm({ ...reportForm, normalRange: e.target.value })} className="input" placeholder="e.g. WBC: 4000-11000 cells/μL" /></div>
          <div className="flex justify-end gap-2"><Button variant="outline" onClick={() => setUploadTarget(null)}>Cancel</Button><Button onClick={uploadReport}><Upload className="h-4 w-4" /> Upload Report</Button></div>
        </div>
      </Modal>

      {/* Detail Modal */}
      <Modal open={!!detailTarget} onClose={() => setDetailTarget(null)} title="Test Details" size="lg">
        {detailTarget && (
          <div className="space-y-5">
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
              <div className="flex gap-2">
                <input value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Add a comment..." className="input" onKeyDown={(e) => e.key === 'Enter' && addComment()} />
                <Button size="sm" onClick={addComment}>Add</Button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-2 border-t border-neutral-100">
              {detailTarget.status === 'pending' && <Button onClick={() => { collectSample(detailTarget); setDetailTarget(null); }}><TestTube className="h-4 w-4" /> Collect Sample</Button>}
              {detailTarget.status === 'sample_collected' && <Button onClick={() => { setUploadTarget(detailTarget); setDetailTarget(null); }}><Upload className="h-4 w-4" /> Upload Report</Button>}
              {detailTarget.status === 'completed' && <Button onClick={() => { verifyReport(detailTarget); setDetailTarget(null); }}><Eye className="h-4 w-4" /> Verify</Button>}
              {detailTarget.status === 'verified' && <Button onClick={() => { approveReport(detailTarget); setDetailTarget(null); }}><ShieldCheck className="h-4 w-4" /> Approve</Button>}
              {(detailTarget.status === 'completed' || detailTarget.status === 'verified' || detailTarget.status === 'approved') && (
                <>
                  <Button variant="outline" onClick={() => saveReportPdf(detailTarget)}><Download className="h-4 w-4" /> Download</Button>
                  <Button variant="outline" onClick={() => toast.success('Printing...')}><Printer className="h-4 w-4" /> Print</Button>
                </>
              )}
            </div>
          </div>
        )}
      </Modal>
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
