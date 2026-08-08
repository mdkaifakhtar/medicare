import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Calendar, Users, Pill, FlaskConical, Activity, ArrowUpRight, Stethoscope,
  Clock, CheckCircle, AlertCircle, Download, GitCompare, MessageSquare,
  TrendingUp, Star, FileText, Plus, ChevronRight, Eye, ShieldCheck,
  TestTube, Microscope, Heart,
} from 'lucide-react';
import { StatCard, Card, PageHeader, Badge, Button, Modal, SectionCard, EmptyState } from '../../components/ui/index.jsx';
import { mockApi } from '../../services/mockApi.js';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';

const testCatalog = [
  { name: 'Complete Blood Count (CBC)', type: 'Hematology', category: 'Blood Test', room: 'hematology' },
  { name: 'Blood Glucose (Fasting)', type: 'Biochemistry', category: 'Blood Test', room: 'biochemistry' },
  { name: 'Lipid Profile', type: 'Biochemistry', category: 'Blood Test', room: 'biochemistry' },
  { name: 'Liver Function Test (LFT)', type: 'Biochemistry', category: 'Blood Test', room: 'biochemistry' },
  { name: 'Kidney Function Test (KFT)', type: 'Biochemistry', category: 'Blood Test', room: 'biochemistry' },
  { name: 'Thyroid Panel (T3/T4/TSH)', type: 'Biochemistry', category: 'Blood Test', room: 'biochemistry' },
  { name: 'Urine Routine Analysis', type: 'Pathology', category: 'Urine Test', room: 'urine' },
  { name: 'Urine Culture', type: 'Microbiology', category: 'Urine Test', room: 'microbiology' },
  { name: 'ECG (12-Lead)', type: 'Cardiology', category: 'ECG', room: 'ecg' },
  { name: 'Echocardiogram', type: 'Cardiology', category: 'ECG', room: 'ecg' },
  { name: 'X-Ray Chest PA', type: 'Radiology', category: 'X-Ray', room: 'xray' },
  { name: 'X-Ray Limb', type: 'Radiology', category: 'X-Ray', room: 'xray' },
  { name: 'MRI Brain', type: 'Radiology', category: 'MRI', room: 'mri' },
  { name: 'MRI Spine', type: 'Radiology', category: 'MRI', room: 'mri' },
  { name: 'CT Scan Head', type: 'Radiology', category: 'CT Scan', room: 'ct' },
  { name: 'CT Scan Abdomen', type: 'Radiology', category: 'CT Scan', room: 'ct' },
  { name: 'Ultrasound Abdomen', type: 'Radiology', category: 'Ultrasound', room: 'usg' },
  { name: 'Doppler Study', type: 'Radiology', category: 'Ultrasound', room: 'usg' },
  { name: 'Tissue Biopsy', type: 'Pathology', category: 'Pathology', room: 'pathology' },
  { name: 'Cytology', type: 'Pathology', category: 'Pathology', room: 'pathology' },
  { name: 'Culture & Sensitivity', type: 'Microbiology', category: 'Microbiology', room: 'microbiology' },
  { name: 'Gram Stain', type: 'Microbiology', category: 'Microbiology', room: 'microbiology' },
  { name: 'Coagulation Profile', type: 'Hematology', category: 'Blood Test', room: 'hematology' },
  { name: 'Blood Group & Rh', type: 'Hematology', category: 'Blood Test', room: 'hematology' },
];

const labStages = [
  { key: 'pending', label: 'Requested' },
  { key: 'sample_collected', label: 'Collected' },
  { key: 'in_progress', label: 'Processing' },
  { key: 'completed', label: 'Uploaded' },
  { key: 'verified', label: 'Verified' },
  { key: 'approved', label: 'Approved' },
];

const saveReportPdf = async (row) => {
  const t = toast.loading('Generating PDF…');
  try {
    const { downloadLabReportPdf } = await import('../../utils/labReportPdf.js');
    const file = await downloadLabReportPdf({ test: row, patient: { name: row?.patientName, id: row?.patientId } });
    toast.success(`Downloaded ${file}`, { id: t });
  } catch (err) {
    toast.error(err?.message || 'Could not generate the PDF', { id: t });
  }
};

export default function DoctorDashboard() {
  const { user } = useSelector((s) => s.auth);
  const [data, setData] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [labTests, setLabTests] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [requestModal, setRequestModal] = useState(false);
  const [reportModal, setReportModal] = useState(null);
  const [compareModal, setCompareModal] = useState(false);
  const [comment, setComment] = useState('');
  const [requestForm, setRequestForm] = useState({ patientId: '', testName: '', priority: 'normal', notes: '' });

  const load = () => {
    setLoading(true);
    mockApi.getAnalytics().then(setData);
    mockApi.listAppointments({ limit: 8 }).then((r) => setAppointments(r.items));
    mockApi.listLabTests({ limit: 50 }).then((r) => setLabTests(r.items));
    mockApi.listPatients({ limit: 10 }).then((r) => setPatients(r.items));
    setLoading(false);
  };
  useEffect(load, []);

  if (!data) return <DashboardSkeleton />;

  const s = data.stats || data;
  const todayAppts = appointments.filter((a) => a.status === 'scheduled' || a.status === 'confirmed');
  const pendingResults = labTests.filter((t) => t.status === 'pending' || t.status === 'sample_collected' || t.status === 'in_progress');
  const completedResults = labTests.filter((t) => t.status === 'completed' || t.status === 'verified' || t.status === 'approved');
  const approvedResults = labTests.filter((t) => t.status === 'approved');

  const stats = [
    { icon: Calendar, label: "Today's Appointments", value: todayAppts.length, change: 10, color: 'secondary' },
    { icon: Users, label: 'My Patients', value: patients.length, change: 5, color: 'secondary' },
    { icon: FlaskConical, label: 'Pending Lab Results', value: pendingResults.length, change: 15, color: 'warning' },
    { icon: Star, label: 'Avg Rating', value: '4.9', change: 2, color: 'success' },
  ];

  const submitRequest = async () => {
    const patient = patients.find((p) => p.id === requestForm.patientId);
    const testDef = testCatalog.find((t) => t.name === requestForm.testName);
    await mockApi.requestLabTest({
      patientId: requestForm.patientId,
      patientName: patient?.name,
      testName: requestForm.testName,
      testType: testDef?.type || 'General',
      category: testDef?.category || 'General',
      doctorName: user?.name,
      doctorId: user?.id,
      priority: requestForm.priority,
      notes: requestForm.notes,
    }, { id: user?.id, name: user?.name, role: user?.role });
    toast.success(`Lab test requested: ${requestForm.testName}`);
    setRequestModal(false);
    setRequestForm({ patientId: '', testName: '', priority: 'normal', notes: '' });
    load();
  };

  const addComment = async () => {
    if (!comment.trim() || !reportModal) return;
    await mockApi.addLabComment(reportModal.id, comment, { id: user?.id, name: user?.name, role: user?.role });
    toast.success('Comment added');
    setComment('');
    const updated = { ...reportModal, comments: [...(reportModal.comments || []), { text: comment, userName: user?.name, role: user?.role, createdAt: new Date().toISOString() }] };
    setReportModal(updated);
    load();
  };

  const tabs = [
    { key: 'overview', label: 'Overview', icon: Activity },
    { key: 'schedule', label: 'Today\'s Schedule', icon: Calendar, badge: todayAppts.length },
    { key: 'lab', label: 'Lab Tests', icon: FlaskConical, badge: pendingResults.length },
    { key: 'patients', label: 'My Patients', icon: Users },
  ];

  return (
    <div>
      <PageHeader
        title={`Good ${greeting()}, Dr. ${user?.name?.split(' ').slice(-1)[0]}`}
        description="Your schedule, patient updates, and lab results at a glance."
        breadcrumb="Doctor · Dashboard"
        action={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setCompareModal(true)} disabled={approvedResults.length < 2}><GitCompare className="h-4 w-4" /> Compare Reports</Button>
            <Button onClick={() => setRequestModal(true)}><Plus className="h-4 w-4" /> Request Lab Test</Button>
          </div>
        }
      />

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((st, i) => <StatCard key={st.label} {...st} delay={i * 0.05} />)}
      </div>

      {/* Pending results alert */}
      {pendingResults.length > 0 && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mt-6 flex items-center gap-4 rounded-2xl border border-warning-200 bg-warning-50/50 p-4">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-warning-100 text-warning-600">
            <AlertCircle className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-warning-800">{pendingResults.length} lab test{pendingResults.length > 1 ? 's' : ''} awaiting results</p>
            <p className="text-xs text-warning-600">You'll be notified automatically when reports are approved.</p>
          </div>
          <Button size="sm" variant="outline" onClick={() => setActiveTab('lab')}>View Tests</Button>
        </motion.div>
      )}

      {/* Tabs */}
      <div className="mt-8 mb-5 flex flex-wrap gap-1.5">
        {tabs.map((tab) => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-medium transition-all duration-200 ${
              activeTab === tab.key ? 'bg-secondary-600 text-white shadow-sm shadow-secondary-600/20' : 'bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50'
            }`}>
            <tab.icon className="h-4 w-4" />
            {tab.label}
            {tab.badge !== undefined && tab.badge > 0 && (
              <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${activeTab === tab.key ? 'bg-white/20' : 'bg-error-500 text-white'}`}>{tab.badge}</span>
            )}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* OVERVIEW */}
        {activeTab === 'overview' && (
          <motion.div key="overview" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Today's Schedule — spans 2 */}
              <SectionCard title="Today's Schedule" className="lg:col-span-2"
                action={<Link to="/dashboard/appointments" className="text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center gap-1">View all <ArrowUpRight className="h-3.5 w-3.5" /></Link>}>
                {todayAppts.length === 0 ? <EmptyState icon={Calendar} title="No appointments today" description="Your schedule is clear." /> : (
                  <div className="space-y-2">
                    {todayAppts.slice(0, 6).map((a, i) => (
                      <motion.div key={a.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                        className="flex items-center gap-4 rounded-xl border border-neutral-100 p-4 card-hover">
                        <div className="flex flex-col items-center justify-center min-w-[56px]">
                          <span className="font-display text-lg font-bold text-primary-600">{a.time || '10:00'}</span>
                          <span className="text-[10px] text-neutral-400 uppercase">{a.date?.split('-').slice(1).join('/') || 'Today'}</span>
                        </div>
                        <div className="h-10 w-px bg-neutral-200" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-neutral-900 truncate">{a.patientName || 'Patient'}</p>
                          <p className="text-xs text-neutral-500">{a.reason || a.type || 'Consultation'} · Token: {a.token || 'T-001'}</p>
                        </div>
                        <Badge variant={a.status === 'confirmed' ? 'success' : 'warning'} dot>{a.status}</Badge>
                      </motion.div>
                    ))}
                  </div>
                )}
              </SectionCard>

              {/* Quick Actions + Lab Summary */}
              <div className="space-y-6">
                <SectionCard title="Quick Actions">
                  <div className="space-y-2">
                    {[
                      { to: '/dashboard/prescriptions', label: 'New Prescription', icon: Pill, color: 'secondary' },
                      { to: '/dashboard/patients', label: 'Patient History', icon: Users, color: 'primary' },
                      { to: '/dashboard/lab-reports', label: 'Lab Reports', icon: FlaskConical, color: 'accent' },
                      { to: '/dashboard/medical-records', label: 'Medical Records', icon: FileText, color: 'success' },
                    ].map((a) => (
                      <Link key={a.to} to={a.to} className="flex items-center gap-3 rounded-xl border border-neutral-100 p-3.5 card-hover group">
                        <div className={`grid h-9 w-9 place-items-center rounded-lg bg-${a.color}-100${a.color}-900/40 text-${a.color}-600${a.color}-400 transition-transform group-hover:scale-110`}>
                          <a.icon className="h-4.5 w-4.5" />
                        </div>
                        <span className="flex-1 text-sm font-medium text-neutral-700">{a.label}</span>
                        <ChevronRight className="h-4 w-4 text-neutral-300 group-hover:text-primary-500 transition" />
                      </Link>
                    ))}
                  </div>
                </SectionCard>

                <SectionCard title="Lab Summary">
                  <div className="space-y-3">
                    {[
                      { label: 'Pending Results', value: pendingResults.length, icon: Clock, color: 'warning' },
                      { label: 'Reports Ready', value: completedResults.length, icon: CheckCircle, color: 'success' },
                      { label: 'Approved Reports', value: approvedResults.length, icon: ShieldCheck, color: 'primary' },
                    ].map((m) => (
                      <div key={m.label} className="flex items-center justify-between rounded-xl border border-neutral-100 p-3">
                        <div className="flex items-center gap-2.5">
                          <div className={`grid h-8 w-8 place-items-center rounded-lg bg-${m.color}-100${m.color}-900/40 text-${m.color}-600${m.color}-400`}>
                            <m.icon className="h-4 w-4" />
                          </div>
                          <span className="text-sm text-neutral-600">{m.label}</span>
                        </div>
                        <span className="font-display text-lg font-bold text-neutral-900">{m.value}</span>
                      </div>
                    ))}
                  </div>
                </SectionCard>
              </div>
            </div>
          </motion.div>
        )}

        {/* SCHEDULE */}
        {activeTab === 'schedule' && (
          <motion.div key="schedule" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
            <SectionCard title="Today's Appointments" description="Full schedule with patient details">
              {todayAppts.length === 0 ? <EmptyState icon={Calendar} title="No appointments scheduled" /> : (
                <div className="space-y-2">
                  {todayAppts.map((a, i) => (
                    <motion.div key={a.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                      className="flex items-center gap-4 rounded-xl border border-neutral-100 p-4 card-hover">
                      <div className="grid h-12 w-12 place-items-center rounded-xl bg-primary-100 text-primary-600 font-display font-bold">
                        {a.token || 'T01'}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-neutral-900">{a.patientName || 'Patient'}</p>
                        <p className="text-xs text-neutral-500">{a.time || '10:00'} · {a.reason || a.type || 'Consultation'}</p>
                      </div>
                      <Badge variant={a.status === 'confirmed' ? 'success' : 'warning'} dot>{a.status}</Badge>
                      <Link to="/dashboard/appointments"><Button size="sm" variant="ghost"><Eye className="h-4 w-4" /></Button></Link>
                    </motion.div>
                  ))}
                </div>
              )}
            </SectionCard>
          </motion.div>
        )}

        {/* LAB TESTS */}
        {activeTab === 'lab' && (
          <motion.div key="lab" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
            <SectionCard title="Lab Tests" description="Tests you've requested — track progress, view results, and add comments."
              action={<Button size="sm" onClick={() => setRequestModal(true)}><Plus className="h-4 w-4" /> Request Test</Button>}>
              {labTests.length === 0 ? <EmptyState icon={FlaskConical} title="No lab tests requested" description="Request a lab test for your patient to get started." action={<Button onClick={() => setRequestModal(true)}><Plus className="h-4 w-4" /> Request Test</Button>} /> : (
                <div className="space-y-3">
                  {labTests.map((lab, i) => {
                    const currentStage = labStages.findIndex((s) => s.key === lab.status);
                    return (
                      <motion.div key={lab.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                        className="rounded-2xl border border-neutral-100 p-4 card-hover">
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div className="flex items-center gap-3">
                            <div className={`grid h-10 w-10 place-items-center rounded-xl ${lab.status === 'approved' ? 'bg-success-100 text-success-600' : 'bg-primary-100 text-primary-600'}`}>
                              {lab.status === 'approved' ? <CheckCircle className="h-5 w-5" /> : <TestTube className="h-5 w-5" />}
                            </div>
                            <div>
                              <p className="font-medium text-neutral-900">{lab.testName}</p>
                              <p className="text-xs text-neutral-500">{lab.patientName} · {lab.testType} · {new Date(lab.createdAt).toLocaleDateString('en', { day: 'numeric', month: 'short' })}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={lab.priority === 'high' ? 'error' : 'neutral'}>{lab.priority || 'normal'}</Badge>
                            <Badge variant={lab.status === 'approved' ? 'success' : lab.status === 'completed' ? 'accent' : 'warning'} dot>{lab.status}</Badge>
                            {(lab.status === 'completed' || lab.status === 'approved') && (
                              <button onClick={() => setReportModal(lab)} className="grid h-8 w-8 place-items-center rounded-lg bg-neutral-100 text-neutral-500 hover:text-primary-600 transition">
                                <Eye className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        </div>
                        {/* Workflow tracker */}
                        <div className="flex items-center gap-1">
                          {labStages.map((stage, si) => {
                            const isActive = si <= currentStage && currentStage >= 0;
                            const isCurrent = si === currentStage;
                            return (
                              <div key={stage.key} className="flex flex-1 items-center">
                                {si > 0 && <div className={`h-0.5 flex-1 ${si <= currentStage ? 'bg-primary-500' : 'bg-neutral-200'}`} />}
                                <div className={`flex items-center gap-1.5 rounded-full px-2 py-1 text-[10px] font-medium transition ${isCurrent ? 'bg-primary-600 text-white' : isActive ? 'text-primary-600' : 'text-neutral-400'}`}>
                                  <div className={`grid h-5 w-5 place-items-center rounded-full text-[9px] ${isActive ? 'bg-primary-600 text-white' : 'bg-neutral-200 text-neutral-400'}`}>
                                    {isActive ? <CheckCircle className="h-3 w-3" /> : si + 1}
                                  </div>
                                  <span className="hidden sm:inline">{stage.label}</span>
                                </div>
                                {si < labStages.length - 1 && <div className={`h-0.5 flex-1 ${si < currentStage ? 'bg-primary-500' : 'bg-neutral-200'}`} />}
                              </div>
                            );
                          })}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </SectionCard>
          </motion.div>
        )}

        {/* PATIENTS */}
        {activeTab === 'patients' && (
          <motion.div key="patients" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
            <SectionCard title="My Patients" description="Recent patients under your care"
              action={<Link to="/dashboard/patients" className="text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center gap-1">View all <ArrowUpRight className="h-3.5 w-3.5" /></Link>}>
              {patients.length === 0 ? <EmptyState icon={Users} title="No patients yet" /> : (
                <div className="grid gap-3 sm:grid-cols-2">
                  {patients.map((p, i) => (
                    <motion.div key={p.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                      <Link to={`/dashboard/patients/${p.id}`} className="flex items-center gap-3 rounded-xl border border-neutral-100 p-4 card-hover group">
                        <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-primary-500/10 to-secondary-500/10 text-sm font-semibold text-primary-600">
                          {p.name?.[0]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-neutral-900 truncate">{p.name}</p>
                          <p className="text-xs text-neutral-500">{p.age} yrs · {p.gender} · {p.bloodGroup}</p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-neutral-300 group-hover:text-primary-500 transition" />
                      </Link>
                    </motion.div>
                  ))}
                </div>
              )}
            </SectionCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Request Lab Test Modal */}
      <Modal open={requestModal} onClose={() => setRequestModal(false)} title="Request Lab Test" size="lg">
        <div className="space-y-4">
          <div>
            <label className="label">Select Patient</label>
            <select value={requestForm.patientId} onChange={(e) => setRequestForm({ ...requestForm, patientId: e.target.value })} className="input">
              <option value="">Choose a patient...</option>
              {patients.map((p) => <option key={p.id} value={p.id}>{p.name} — {p.age}y, {p.gender}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Test Name</label>
            <select value={requestForm.testName} onChange={(e) => setRequestForm({ ...requestForm, testName: e.target.value })} className="input">
              <option value="">Choose a test...</option>
              {testCatalog.map((t) => <option key={t.name} value={t.name}>{t.name} ({t.category})</option>)}
            </select>
          </div>
          <div>
            <label className="label">Priority</label>
            <div className="flex gap-2">
              {['normal', 'urgent', 'high'].map((p) => (
                <button key={p} onClick={() => setRequestForm({ ...requestForm, priority: p })}
                  className={`flex-1 rounded-xl border px-3 py-2.5 text-sm font-medium transition ${requestForm.priority === p ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-neutral-200 text-neutral-600 hover:bg-neutral-50'}`}>
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="label">Clinical Notes (optional)</label>
            <textarea rows={3} value={requestForm.notes} onChange={(e) => setRequestForm({ ...requestForm, notes: e.target.value })} className="input" placeholder="Reason for test, symptoms, etc." />
          </div>
          <div className="rounded-xl bg-primary-50/50 border border-primary-100 p-3.5">
            <p className="text-xs text-primary-700 leading-relaxed flex items-start gap-2">
              <FlaskConical className="h-4 w-4 shrink-0 mt-0.5" />
              <span>Once submitted, the lab will receive the test request automatically. You'll be notified when the report is uploaded, verified, and approved.</span>
            </p>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setRequestModal(false)}>Cancel</Button>
            <Button onClick={submitRequest} disabled={!requestForm.patientId || !requestForm.testName}><FlaskConical className="h-4 w-4" /> Submit Request</Button>
          </div>
        </div>
      </Modal>

      {/* Report View Modal */}
      <Modal open={!!reportModal} onClose={() => setReportModal(null)} title={reportModal?.testName || 'Lab Report'} size="lg">
        {reportModal && (
          <div className="space-y-5">
            {/* Workflow tracker */}
            <div className="flex items-center justify-between gap-1">
              {labStages.map((stage, i) => {
                const currentIdx = labStages.findIndex((s) => s.key === reportModal.status);
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
              <InfoRow label="Test" value={reportModal.testName} />
              <InfoRow label="Type" value={reportModal.testType} />
              <InfoRow label="Patient" value={reportModal.patientName} />
              <InfoRow label="Priority" value={<Badge variant={reportModal.priority === 'high' ? 'error' : 'neutral'}>{reportModal.priority || 'normal'}</Badge>} />
              <InfoRow label="Requested" value={new Date(reportModal.createdAt).toLocaleDateString()} />
              <InfoRow label="Status" value={<Badge variant={reportModal.status === 'approved' ? 'success' : 'warning'} dot>{reportModal.status}</Badge>} />
            </div>

            {reportModal.result && (
              <div className="rounded-xl border border-neutral-100 p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2">Result</p>
                <p className="text-sm text-neutral-900 whitespace-pre-wrap">{reportModal.result}</p>
                {reportModal.normalRange && <p className="mt-2 text-xs text-neutral-500">Reference: {reportModal.normalRange}</p>}
              </div>
            )}

            {/* Comments */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-3">Comments & Notes</p>
              <div className="space-y-2 mb-3">
                {(reportModal.comments || []).length === 0 ? <p className="text-sm text-neutral-400">No comments yet.</p> :
                  (reportModal.comments || []).map((c, i) => (
                    <div key={i} className="rounded-xl border border-neutral-100 p-3">
                      <p className="text-sm text-neutral-900">{c.text}</p>
                      <p className="mt-1 text-xs text-neutral-400">{c.userName} ({c.role}) · {new Date(c.createdAt).toLocaleString()}</p>
                    </div>
                  ))}
              </div>
              <div className="flex gap-2">
                <input value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Add a clinical comment..." className="input" onKeyDown={(e) => e.key === 'Enter' && addComment()} />
                <Button size="sm" onClick={addComment}><MessageSquare className="h-4 w-4" /></Button>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-neutral-100">
              <Button variant="outline" onClick={() => saveReportPdf(reportModal)}><Download className="h-4 w-4" /> Download</Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Compare Reports Modal */}
      <Modal open={compareModal} onClose={() => setCompareModal(false)} title="Compare Lab Reports" size="xl">
        <div className="space-y-4">
          <p className="text-sm text-neutral-500">Compare patient test results side-by-side to track changes over time.</p>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-neutral-100">
                  <th className="py-3 pr-4 text-xs font-semibold uppercase tracking-wider text-neutral-500">Parameter</th>
                  {approvedResults.slice(0, 4).map((lab) => (
                    <th key={lab.id} className="py-3 px-4 text-xs font-semibold uppercase tracking-wider text-neutral-500 whitespace-nowrap">
                      {lab.testName}<br />
                      <span className="font-normal normal-case text-neutral-400">{lab.patientName} · {new Date(lab.createdAt).toLocaleDateString('en', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                <tr><td className="py-3 pr-4 text-neutral-500">Patient</td>{approvedResults.slice(0, 4).map((lab) => <td key={lab.id} className="py-3 px-4 text-neutral-700">{lab.patientName}</td>)}</tr>
                <tr><td className="py-3 pr-4 text-neutral-500">Type</td>{approvedResults.slice(0, 4).map((lab) => <td key={lab.id} className="py-3 px-4 text-neutral-700">{lab.testType}</td>)}</tr>
                <tr><td className="py-3 pr-4 text-neutral-500">Category</td>{approvedResults.slice(0, 4).map((lab) => <td key={lab.id} className="py-3 px-4 text-neutral-700">{lab.category}</td>)}</tr>
                <tr><td className="py-3 pr-4 text-neutral-500">Result</td>{approvedResults.slice(0, 4).map((lab) => <td key={lab.id} className="py-3 px-4 text-neutral-700 max-w-xs truncate">{lab.result || '—'}</td>)}</tr>
                <tr><td className="py-3 pr-4 text-neutral-500">Reference Range</td>{approvedResults.slice(0, 4).map((lab) => <td key={lab.id} className="py-3 px-4 text-neutral-700">{lab.normalRange || '—'}</td>)}</tr>
                <tr><td className="py-3 pr-4 text-neutral-500">TAT</td>{approvedResults.slice(0, 4).map((lab) => <td key={lab.id} className="py-3 px-4 text-neutral-700">{lab.tatHours ? `${lab.tatHours}h` : '—'}</td>)}</tr>
              </tbody>
            </table>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function InfoRow({ label, value }) {
  return <div><p className="text-xs text-neutral-500">{label}</p><p className="mt-0.5 text-sm font-medium text-neutral-900">{value}</p></div>;
}

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'morning'; if (h < 17) return 'afternoon'; return 'evening';
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="skeleton h-10 w-64" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton h-28" />)}</div>
      <div className="grid gap-6 lg:grid-cols-3"><div className="skeleton h-80 lg:col-span-2" /><div className="skeleton h-80" /></div>
    </div>
  );
}
