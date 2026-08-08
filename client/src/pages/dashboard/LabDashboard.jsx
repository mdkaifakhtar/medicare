import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FlaskConical, Clock, CheckCircle, AlertCircle, Upload, Download, Search,
  Microscope, Activity, TrendingUp, TestTube, FileText, XCircle, Beaker,
  Droplet, Scan, Radiation, Brain, Baby, Syringe, Stethoscope, Printer,
  ShieldCheck, Eye, MessageSquare, GitCompare, ChevronRight, Filter,
} from 'lucide-react';
import { PageHeader, Card, Badge, Button, Modal, StatCard, EmptyState, SectionCard } from '../../components/ui/index.jsx';
import { mockApi } from '../../services/mockApi.js';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';

const labRooms = [
  { id: 'sample', name: 'Sample Collection Room', icon: TestTube, color: 'primary', tests: ['Blood Test', 'Urine Analysis'] },
  { id: 'blood', name: 'Blood Collection Area', icon: Droplet, color: 'error', tests: ['CBC', 'Blood Glucose', 'Lipid Profile'] },
  { id: 'urine', name: 'Urine Sample Collection', icon: FlaskConical, color: 'warning', tests: ['Urinalysis'] },
  { id: 'ecg', name: 'ECG Room', icon: Activity, color: 'success', tests: ['ECG', 'Echocardiogram'] },
  { id: 'xray', name: 'X-Ray Room', icon: Radiation, color: 'accent', tests: ['X-Ray Chest', 'X-Ray Limb'] },
  { id: 'mri', name: 'MRI Room', icon: Brain, color: 'primary', tests: ['MRI Brain', 'MRI Spine'] },
  { id: 'ct', name: 'CT Scan Room', icon: Scan, color: 'secondary', tests: ['CT Head', 'CT Abdomen'] },
  { id: 'usg', name: 'Ultrasound Room', icon: Baby, color: 'accent', tests: ['Ultrasound', 'Doppler'] },
  { id: 'pathology', name: 'Pathology Lab', icon: Beaker, color: 'warning', tests: ['Tissue Biopsy', 'Cytology'] },
  { id: 'microbiology', name: 'Microbiology Lab', icon: Microscope, color: 'success', tests: ['Culture & Sensitivity', 'Gram Stain'] },
  { id: 'biochemistry', name: 'Biochemistry Lab', icon: FlaskConical, color: 'primary', tests: ['LFT', 'KFT', 'Thyroid Panel'] },
  { id: 'hematology', name: 'Hematology Lab', icon: Droplet, color: 'error', tests: ['CBC', 'Coagulation Profile', 'Blood Group'] },
];

const workflowStages = [
  { key: 'pending', label: 'Test Requested', color: 'warning' },
  { key: 'sample_collected', label: 'Sample Collected', color: 'primary' },
  { key: 'in_progress', label: 'Test In Progress', color: 'info' },
  { key: 'completed', label: 'Report Uploaded', color: 'accent' },
  { key: 'verified', label: 'Report Verified', color: 'secondary' },
  { key: 'approved', label: 'Report Approved', color: 'success' },
];

export default function LabDashboard() {
  const { user } = useSelector((s) => s.auth);
  const [tests, setTests] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');
  const [search, setSearch] = useState('');
  const [view, setView] = useState('queue');
  const [uploadTarget, setUploadTarget] = useState(null);
  const [rejectTarget, setRejectTarget] = useState(null);
  const [detailTarget, setDetailTarget] = useState(null);
  const [compareTarget, setCompareTarget] = useState(null);
  const [reportForm, setReportForm] = useState({ result: '', normalRange: '' });
  const [rejectReason, setRejectReason] = useState('');
  const [comment, setComment] = useState('');

  const load = () => {
    setLoading(true);
    Promise.all([
      mockApi.listLabTests({ limit: 200 }),
      mockApi.listEquipment({ limit: 50 }),
    ]).then(([t, e]) => {
      setTests(t.items); setEquipment(e.items); setLoading(false);
    });
  };
  useEffect(load, []);

  const filtered = useMemo(() => {
    return tests.filter((t) => {
      if (activeTab !== 'all' && t.status !== activeTab) return false;
      if (search && !t.patientName?.toLowerCase().includes(search.toLowerCase()) && !t.testName?.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [tests, activeTab, search]);

  const pending = tests.filter((t) => t.status === 'pending');
  const collected = tests.filter((t) => t.status === 'sample_collected');
  const inProgress = tests.filter((t) => t.status === 'in_progress');
  const completed = tests.filter((t) => t.status === 'completed' || t.status === 'verified' || t.status === 'approved');
  const approved = tests.filter((t) => t.status === 'approved');
  const highPriority = tests.filter((t) => t.priority === 'high' && t.status !== 'approved');
  const avgTAT = approved.filter((t) => t.tatHours).reduce((s, t) => s + t.tatHours, 0) / (approved.filter((t) => t.tatHours).length || 1);

  const tabs = [
    { key: 'pending', label: 'Pending', count: pending.length, icon: Clock, color: 'warning' },
    { key: 'sample_collected', label: 'Sample Collected', count: collected.length, icon: TestTube, color: 'primary' },
    { key: 'in_progress', label: 'In Progress', count: inProgress.length, icon: Activity, color: 'info' },
    { key: 'completed', label: 'Completed', count: completed.length, icon: CheckCircle, color: 'success' },
    { key: 'approved', label: 'Approved', count: approved.length, icon: ShieldCheck, color: 'secondary' },
    { key: 'all', label: 'All Tests', count: tests.length, icon: FlaskConical, color: 'neutral' },
  ];

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

  const rejectReport = async () => {
    await mockApi.rejectLabReport(rejectTarget.id, rejectReason, { id: user?.id, name: user?.name, role: user?.role });
    toast.success('Report rejected — lab team notified');
    setRejectTarget(null); setRejectReason('');
    load();
  };

  const addComment = async () => {
    if (!comment.trim() || !detailTarget) return;
    await mockApi.addLabComment(detailTarget.id, comment, { id: user?.id, name: user?.name, role: user?.role });
    toast.success('Comment added');
    setComment('');
    load();
    // Refresh detail target
    const updated = tests.find((t) => t.id === detailTarget.id);
    setDetailTarget({ ...detailTarget, comments: [...(detailTarget.comments || []), { text: comment, userName: user?.name, createdAt: new Date().toISOString() }] });
  };

  const downloadReport = async (test) => {
    const t = toast.loading('Generating PDF…');
    try {
      const { downloadLabReportPdf } = await import('../../utils/labReportPdf.js');
      const file = await downloadLabReportPdf({ test, patient: { name: test?.patientName, id: test?.patientId } });
      toast.success(`Downloaded ${file}`, { id: t });
    } catch (err) {
      toast.error(err?.message || 'Could not generate the PDF', { id: t });
    }
  };

  const printReport = (test) => {
    toast.success(`Printing ${test.testName} report...`);
  };

  // Room occupancy calculation
  const roomStats = labRooms.map((room) => {
    const roomTests = tests.filter((t) => room.tests.some((rt) => t.testName?.includes(rt)) && t.status !== 'approved');
    return { ...room, activeCount: roomTests.length, tests: roomTests };
  });

  const columns = [
    { key: 'testName', label: 'Test', render: (r) => (
      <div className="flex items-center gap-3">
        <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary-100 text-primary-600 shrink-0">
          {getTestIcon(r.testName)}
        </div>
        <div>
          <p className="font-medium text-neutral-900">{r.testName}</p>
          <p className="text-xs text-neutral-500">{r.testType} · {r.category}</p>
        </div>
      </div>
    )},
    { key: 'patientName', label: 'Patient', render: (r) => <span className="text-sm font-medium">{r.patientName}</span> },
    { key: 'doctorName', label: 'Requested By', render: (r) => <span className="text-sm text-neutral-500">{r.doctorName}</span> },
    { key: 'priority', label: 'Priority', render: (r) => <Badge variant={r.priority === 'high' ? 'error' : 'neutral'} dot>{r.priority || 'normal'}</Badge> },
    { key: 'tatHours', label: 'TAT', render: (r) => r.tatHours ? <span className="text-sm font-medium">{r.tatHours}h</span> : <span className="text-neutral-300">—</span> },
    { key: 'status', label: 'Status', render: (r) => <StatusBadge status={r.status} /> },
    { key: 'actions', label: 'Actions', render: (r) => (
      <div className="flex gap-1.5" onClick={(e) => e.stopPropagation()}>
        {r.status === 'pending' && (
          <ActionBtn icon={TestTube} label="Collect" color="primary" onClick={() => collectSample(r)} />
        )}
        {r.status === 'sample_collected' && (
          <ActionBtn icon={Upload} label="Upload" color="success" onClick={() => setUploadTarget(r)} />
        )}
        {(r.status === 'completed') && (
          <ActionBtn icon={Eye} label="Verify" color="info" onClick={() => verifyReport(r)} />
        )}
        {(r.status === 'verified') && (
          <ActionBtn icon={ShieldCheck} label="Approve" color="success" onClick={() => approveReport(r)} />
        )}
        {(r.status === 'completed' || r.status === 'verified' || r.status === 'approved') && (
          <>
            <ActionBtn icon={Download} label="" color="neutral" onClick={() => downloadReport(r)} />
            <ActionBtn icon={Printer} label="" color="neutral" onClick={() => printReport(r)} />
          </>
        )}
        {(r.status !== 'approved' && r.status !== 'pending') && (
          <ActionBtn icon={XCircle} label="" color="error" onClick={() => setRejectTarget(r)} />
        )}
      </div>
    )},
  ];

  return (
    <div>
      <PageHeader
        title="Laboratory Testing Center"
        description="Complete diagnostic workflow — from sample collection to report approval and delivery."
        breadcrumb="Laboratory · Testing Center"
      />

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard icon={Clock} label="Pending Requests" value={pending.length} color="warning" delay={0} />
        <StatCard icon={TestTube} label="Samples Collected" value={collected.length} color="primary" delay={0.05} />
        <StatCard icon={Activity} label="In Progress" value={inProgress.length} color="accent" delay={0.1} />
        <StatCard icon={CheckCircle} label="Reports Completed" value={completed.length} color="success" delay={0.15} />
        <StatCard icon={TrendingUp} label="Avg Turnaround" value={`${avgTAT.toFixed(1)}h`} color="secondary" delay={0.2} />
      </div>

      {/* High Priority Alert */}
      {highPriority.length > 0 && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mt-6 flex items-center gap-4 rounded-2xl border border-error-200 bg-error-50/50 p-4">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-error-100 text-error-600">
            <AlertCircle className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-error-800">{highPriority.length} high-priority test{highPriority.length > 1 ? 's' : ''} require immediate attention</p>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {highPriority.map((t) => (
                <span key={t.id} className="rounded-lg bg-error-100 px-2 py-0.5 text-xs font-medium text-error-700">
                  {t.testName} — {t.patientName}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* View Toggle */}
      <div className="mt-8 mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-1.5">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => { setActiveTab(tab.key); setView('queue'); }}
              className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-medium transition-all duration-200 ${
                activeTab === tab.key && view === 'queue'
                  ? 'bg-primary-500 text-white shadow-sm shadow-primary-500/20'
                  : 'bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
              <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                activeTab === tab.key && view === 'queue' ? 'bg-white/20' : 'bg-neutral-100'
              }`}>{tab.count}</span>
            </button>
          ))}
        </div>
        <div className="flex gap-1.5">
          <button
            onClick={() => setView('queue')}
            className={`rounded-xl px-3.5 py-2 text-sm font-medium transition ${view === 'queue' ? 'bg-neutral-900 text-white' : 'bg-white border border-neutral-200 text-neutral-600'}`}
          >
            Queue
          </button>
          <button
            onClick={() => setView('rooms')}
            className={`rounded-xl px-3.5 py-2 text-sm font-medium transition ${view === 'rooms' ? 'bg-neutral-900 text-white' : 'bg-white border border-neutral-200 text-neutral-600'}`}
          >
            Testing Rooms
          </button>
          <button
            onClick={() => setView('equipment')}
            className={`rounded-xl px-3.5 py-2 text-sm font-medium transition ${view === 'equipment' ? 'bg-neutral-900 text-white' : 'bg-white border border-neutral-200 text-neutral-600'}`}
          >
            Equipment
          </button>
        </div>
      </div>

      {/* Queue View */}
      {view === 'queue' && (
        <>
          <div className="mb-4 relative max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search patient or test..." className="input pl-9" />
          </div>
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-neutral-100 bg-neutral-50/50">
                    {columns.map((c) => (
                      <th key={c.key} className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-neutral-500 whitespace-nowrap">{c.label}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {loading ? (
                    Array.from({ length: 4 }).map((_, i) => (
                      <tr key={i}>{columns.map((c) => <td key={c.key} className="px-5 py-4"><div className="skeleton h-4 w-full max-w-[120px]" /></td>)}</tr>
                    ))
                  ) : filtered.length === 0 ? (
                    <tr><td colSpan={columns.length}>
                      <EmptyState icon={FlaskConical} title="No tests in this stage" description="Tests will appear here as they move through the workflow pipeline." />
                    </td></tr>
                  ) : (
                    filtered.map((row, i) => (
                      <motion.tr
                        key={row.id || i}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.2, delay: Math.min(i * 0.02, 0.3) }}
                        onClick={() => setDetailTarget(row)}
                        className="table-row-hover cursor-pointer"
                      >
                        {columns.map((c) => <td key={c.key} className="px-5 py-3.5 whitespace-nowrap text-neutral-700">{c.render ? c.render(row) : row[c.key]}</td>)}
                      </motion.tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Testing Rooms View */}
      {view === 'rooms' && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {roomStats.map((room, i) => (
            <motion.div
              key={room.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.04, ease: [0.16, 1, 0.3, 1] }}
            >
              <SectionCard className="h-full card-hover">
                <div className="flex items-start justify-between">
                  <div className={`grid h-12 w-12 place-items-center rounded-2xl bg-${room.color}-100${room.color}-900/40 text-${room.color}-600${room.color}-400`}>
                    <room.icon className="h-6 w-6" strokeWidth={1.8} />
                  </div>
                  {room.activeCount > 0 ? (
                    <Badge variant="warning" dot>{room.activeCount} active</Badge>
                  ) : (
                    <Badge variant="success" dot>Available</Badge>
                  )}
                </div>
                <h3 className="mt-4 font-display text-sm font-semibold text-neutral-900">{room.name}</h3>
                <p className="mt-1 text-xs text-neutral-500">
                  {room.tests.join(' · ')}
                </p>
                {room.activeCount > 0 && (
                  <div className="mt-3 space-y-1.5">
                    {room.tests.slice(0, 3).map((t, idx) => {
                      const test = room.tests[idx];
                      const activeTest = tests.find((tt) => tt.testName?.includes(test) && tt.status !== 'approved');
                      if (!activeTest) return null;
                      return (
                        <div key={idx} className="flex items-center justify-between text-xs">
                          <span className="text-neutral-600 truncate">{activeTest.patientName}</span>
                          <StatusBadge status={activeTest.status} />
                        </div>
                      );
                    })}
                  </div>
                )}
              </SectionCard>
            </motion.div>
          ))}
        </div>
      )}

      {/* Equipment View */}
      {view === 'equipment' && (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <SectionCard title="Lab Equipment Status" description="Real-time monitoring of all diagnostic equipment">
              <div className="grid gap-3 sm:grid-cols-2">
                {equipment.map((eq) => (
                  <div key={eq.id} className="rounded-2xl border border-neutral-100 p-4 card-hover">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`grid h-10 w-10 place-items-center rounded-xl ${eq.status === 'operational' ? 'bg-success-100 text-success-600' : 'bg-warning-100 text-warning-600'}`}>
                          <Beaker className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-neutral-900">{eq.name}</p>
                          <p className="text-xs text-neutral-500">{eq.location}</p>
                        </div>
                      </div>
                      <Badge variant={eq.status === 'operational' ? 'success' : 'warning'} dot>{eq.status}</Badge>
                    </div>
                    <div className="mb-2">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-neutral-500">Utilization</span>
                        <span className="font-medium text-neutral-900">{eq.utilization}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-neutral-100">
                        <div className={`h-full rounded-full ${eq.utilization > 80 ? 'bg-error-500' : eq.utilization > 60 ? 'bg-warning-500' : 'bg-success-500'}`} style={{ width: `${eq.utilization}%` }} />
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-neutral-500">
                      <span>Last: {new Date(eq.lastService).toLocaleDateString('en', { day: 'numeric', month: 'short' })}</span>
                      <span>Next: {new Date(eq.nextService).toLocaleDateString('en', { day: 'numeric', month: 'short' })}</span>
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>
          <SectionCard title="Lab Analytics" description="Performance metrics">
            <div className="space-y-3">
              {[
                { label: 'Total Tests Processed', value: tests.length, icon: FlaskConical, color: 'primary' },
                { label: 'Reports Approved', value: approved.length, icon: ShieldCheck, color: 'success' },
                { label: 'Pending Verification', value: tests.filter((t) => t.status === 'completed').length, icon: Eye, color: 'warning' },
                { label: 'Avg Turnaround Time', value: `${avgTAT.toFixed(1)}h`, icon: Clock, color: 'accent' },
                { label: 'Completion Rate', value: `${Math.round((completed.length / (tests.length || 1)) * 100)}%`, icon: TrendingUp, color: 'secondary' },
              ].map((m) => (
                <div key={m.label} className="flex items-center justify-between rounded-xl border border-neutral-100 p-3.5">
                  <div className="flex items-center gap-3">
                    <div className={`grid h-9 w-9 place-items-center rounded-lg bg-${m.color}-100${m.color}-900/40 text-${m.color}-600${m.color}-400`}>
                      <m.icon className="h-4.5 w-4.5" />
                    </div>
                    <span className="text-sm text-neutral-600">{m.label}</span>
                  </div>
                  <span className="font-display text-lg font-bold text-neutral-900">{m.value}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-xl bg-primary-50/50 border border-primary-100 p-4">
              <p className="text-xs text-primary-700 leading-relaxed">
                All approved reports automatically sync to the patient's medical record and notify the requesting doctor. Reports are available for download and comparison.
              </p>
            </div>
          </SectionCard>
        </div>
      )}

      {/* Upload Report Modal */}
      <Modal open={!!uploadTarget} onClose={() => setUploadTarget(null)} title={`Upload Report — ${uploadTarget?.testName || ''}`} size="lg">
        <div className="space-y-4">
          <div className="rounded-xl bg-neutral-50 p-4 space-y-1.5 text-sm">
            <div className="flex justify-between"><span className="text-neutral-500">Patient</span><span className="font-medium text-neutral-900">{uploadTarget?.patientName}</span></div>
            <div className="flex justify-between"><span className="text-neutral-500">Test</span><span className="font-medium text-neutral-900">{uploadTarget?.testName}</span></div>
            <div className="flex justify-between"><span className="text-neutral-500">Sample Collected</span><span className="font-medium text-neutral-900">{uploadTarget?.sampleCollectedAt ? new Date(uploadTarget.sampleCollectedAt).toLocaleString() : '—'}</span></div>
            <div className="flex justify-between"><span className="text-neutral-500">Requested By</span><span className="font-medium text-neutral-900">{uploadTarget?.doctorName}</span></div>
          </div>
          <div>
            <label className="label">Result / Findings</label>
            <textarea rows={5} required value={reportForm.result} onChange={(e) => setReportForm({ ...reportForm, result: e.target.value })} className="input" placeholder="Enter detailed findings and observations..." />
          </div>
          <div>
            <label className="label">Normal Reference Range</label>
            <input value={reportForm.normalRange} onChange={(e) => setReportForm({ ...reportForm, normalRange: e.target.value })} className="input" placeholder="e.g. WBC: 4000-11000 cells/μL" />
          </div>
          <div className="rounded-xl bg-primary-50/50 border border-primary-100 p-3.5">
            <p className="text-xs text-primary-700 leading-relaxed flex items-start gap-2">
              <ShieldCheck className="h-4 w-4 shrink-0 mt-0.5" />
              <span>On upload, the report enters verification. Once verified and approved, the patient will be notified to download their report, and the requesting doctor will receive the completed results automatically.</span>
            </p>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setUploadTarget(null)}>Cancel</Button>
            <Button onClick={uploadReport}><Upload className="h-4 w-4" /> Upload Report</Button>
          </div>
        </div>
      </Modal>

      {/* Reject Report Modal */}
      <Modal open={!!rejectTarget} onClose={() => setRejectTarget(null)} title={`Reject Report — ${rejectTarget?.testName || ''}`}>
        <div className="space-y-4">
          <div className="rounded-xl bg-error-50/50 border border-error-100 p-3.5">
            <p className="text-sm text-error-700">Rejection will send the test back to the lab team for recollection. The patient will be notified of the delay.</p>
          </div>
          <div>
            <label className="label">Reason for Rejection</label>
            <textarea rows={3} required value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} className="input" placeholder="e.g. Sample hemolyzed. Please recollect." />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setRejectTarget(null)}>Cancel</Button>
            <Button variant="danger" onClick={rejectReport}><XCircle className="h-4 w-4" /> Reject Report</Button>
          </div>
        </div>
      </Modal>

      {/* Test Detail Modal */}
      <Modal open={!!detailTarget} onClose={() => setDetailTarget(null)} title="Test Details" size="lg">
        {detailTarget && (
          <div className="space-y-5">
            {/* Workflow tracker */}
            <div className="flex items-center justify-between gap-1">
              {workflowStages.map((stage, i) => {
                const currentIdx = workflowStages.findIndex((s) => s.key === detailTarget.status);
                const isActive = i <= currentIdx;
                const isCurrent = i === currentIdx;
                return (
                  <div key={stage.key} className="flex flex-1 flex-col items-center">
                    <div className="flex w-full items-center">
                      {i > 0 && <div className={`h-0.5 flex-1 ${i <= currentIdx ? 'bg-primary-500' : 'bg-neutral-200'}`} />}
                      <div className={`grid h-8 w-8 place-items-center rounded-full text-xs font-semibold transition-all ${isActive ? 'bg-primary-600 text-white' : 'bg-neutral-100 text-neutral-400'} ${isCurrent ? 'ring-4 ring-primary-500/20' : ''}`}>
                        {isActive ? <CheckCircle className="h-4 w-4" /> : i + 1}
                      </div>
                      {i < workflowStages.length - 1 && <div className={`h-0.5 flex-1 ${i < currentIdx ? 'bg-primary-500' : 'bg-neutral-200'}`} />}
                    </div>
                    <span className={`mt-1.5 text-[10px] text-center ${isActive ? 'text-primary-600 font-medium' : 'text-neutral-400'}`}>{stage.label}</span>
                  </div>
                );
              })}
            </div>

            {/* Test info */}
            <div className="grid gap-3 sm:grid-cols-2">
              <InfoRow label="Test Name" value={detailTarget.testName} />
              <InfoRow label="Test Type" value={detailTarget.testType} />
              <InfoRow label="Category" value={detailTarget.category} />
              <InfoRow label="Priority" value={<Badge variant={detailTarget.priority === 'high' ? 'error' : 'neutral'}>{detailTarget.priority || 'normal'}</Badge>} />
              <InfoRow label="Patient" value={detailTarget.patientName} />
              <InfoRow label="Requested By" value={detailTarget.doctorName} />
              <InfoRow label="Created" value={new Date(detailTarget.createdAt).toLocaleString()} />
              <InfoRow label="TAT" value={detailTarget.tatHours ? `${detailTarget.tatHours}h` : 'In progress'} />
            </div>

            {/* Report result */}
            {detailTarget.result && (
              <div className="rounded-xl border border-neutral-100 p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2">Report Result</p>
                <p className="text-sm text-neutral-900 whitespace-pre-wrap">{detailTarget.result}</p>
                {detailTarget.normalRange && <p className="mt-2 text-xs text-neutral-500">Reference: {detailTarget.normalRange}</p>}
              </div>
            )}

            {/* Comments */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-3">Comments & Notes</p>
              <div className="space-y-2 mb-3">
                {(detailTarget.comments || []).length === 0 ? (
                  <p className="text-sm text-neutral-400">No comments yet.</p>
                ) : (
                  (detailTarget.comments || []).map((c, i) => (
                    <div key={i} className="rounded-xl border border-neutral-100 p-3">
                      <p className="text-sm text-neutral-900">{c.text}</p>
                      <p className="mt-1 text-xs text-neutral-400">{c.userName} · {new Date(c.createdAt).toLocaleString()}</p>
                    </div>
                  ))
                )}
              </div>
              <div className="flex gap-2">
                <input value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Add a comment..." className="input" onKeyDown={(e) => e.key === 'Enter' && addComment()} />
                <Button size="sm" onClick={addComment}><MessageSquare className="h-4 w-4" /></Button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-2 pt-2 border-t border-neutral-100">
              {detailTarget.status === 'pending' && <Button onClick={() => { collectSample(detailTarget); setDetailTarget(null); }}><TestTube className="h-4 w-4" /> Collect Sample</Button>}
              {detailTarget.status === 'sample_collected' && <Button onClick={() => { setUploadTarget(detailTarget); setDetailTarget(null); }}><Upload className="h-4 w-4" /> Upload Report</Button>}
              {detailTarget.status === 'completed' && <Button onClick={() => { verifyReport(detailTarget); setDetailTarget(null); }}><Eye className="h-4 w-4" /> Verify Report</Button>}
              {detailTarget.status === 'verified' && <Button onClick={() => { approveReport(detailTarget); setDetailTarget(null); }}><ShieldCheck className="h-4 w-4" /> Approve Report</Button>}
              {(detailTarget.status === 'completed' || detailTarget.status === 'verified' || detailTarget.status === 'approved') && (
                <>
                  <Button variant="outline" onClick={() => downloadReport(detailTarget)}><Download className="h-4 w-4" /> Download</Button>
                  <Button variant="outline" onClick={() => printReport(detailTarget)}><Printer className="h-4 w-4" /> Print</Button>
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
    sample_collected: { variant: 'info', label: 'Sample Collected' },
    in_progress: { variant: 'info', label: 'In Progress' },
    completed: { variant: 'accent', label: 'Report Uploaded' },
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
  return (
    <div>
      <p className="text-xs text-neutral-500">{label}</p>
      <p className="mt-0.5 text-sm font-medium text-neutral-900">{value}</p>
    </div>
  );
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
