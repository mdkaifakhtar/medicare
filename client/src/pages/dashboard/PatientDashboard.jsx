import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Calendar, Pill, FlaskConical, Receipt, FileText, Heart, Shield, Activity,
  Download, ArrowUpRight, Clock, CheckCircle, AlertCircle, Wallet, Phone,
  Stethoscope, CalendarPlus, CreditCard, GitCompare, ChevronRight, TrendingUp,
} from 'lucide-react';
import { StatCard, Card, PageHeader, Badge, Button, Modal, SectionCard, EmptyState } from '../../components/ui/index.jsx';
import { mockApi } from '../../services/mockApi.js';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';

// Generates and downloads the real A4 lab-report PDF (identical to the preview).
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


export default function PatientDashboard() {
  const { user } = useSelector((s) => s.auth);
  const [data, setData] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [labTests, setLabTests] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [patient, setPatient] = useState(null);
  const [compareModal, setCompareModal] = useState(false);
  const [reportDetail, setReportDetail] = useState(null);

  useEffect(() => {
    mockApi.getAnalytics().then(setData);
    const pid = user?.patientId || 'p_1';
    mockApi.getPatient(pid).then((p) => {
      setPatient(p);
      setAppointments(p.appointments || []);
      setPrescriptions(p.prescriptions || []);
      setLabTests(p.labTests || []);
      setInvoices(p.invoices || []);
    }).catch(() => {
      mockApi.listAppointments({ limit: 5 }).then((r) => setAppointments(r.items));
      mockApi.listPrescriptions({ limit: 5 }).then((r) => setPrescriptions(r.items));
      mockApi.listLabTests({ limit: 5 }).then((r) => setLabTests(r.items));
      mockApi.listInvoices({ limit: 5 }).then((r) => setInvoices(r.items));
    });
  }, [user]);

  if (!data) return <SkeletonLoader />;

  const upcomingAppts = appointments.filter((a) => a.status === 'scheduled' || a.status === 'confirmed');
  const pendingLabs = labTests.filter((t) => t.status !== 'approved' && t.status !== 'completed');
  const completedLabs = labTests.filter((t) => t.status === 'completed' || t.status === 'approved' || t.status === 'verified');
  const unpaidInvoices = invoices.filter((i) => i.status === 'unpaid');
  const totalBilled = invoices.reduce((s, i) => s + i.total, 0);
  const totalPaid = invoices.filter((i) => i.status === 'paid').reduce((s, i) => s + i.total, 0);

  const stats = [
    { icon: Calendar, label: 'Upcoming Appointments', value: upcomingAppts.length, color: 'accent' },
    { icon: Pill, label: 'Active Prescriptions', value: prescriptions.length, color: 'secondary' },
    { icon: FlaskConical, label: 'Lab Reports', value: completedLabs.length, color: 'accent' },
    { icon: Wallet, label: 'Pending Bills', value: unpaidInvoices.length, color: 'warning' },
  ];

  const timeline = [
    ...appointments.map((a) => ({ date: a.date || a.createdAt, title: `Appointment ${a.token}`, desc: `${a.doctorName} · ${a.departmentName || ''} · ${a.reason || ''}`, type: 'appointment', status: a.status })),
    ...prescriptions.map((p) => ({ date: p.createdAt, title: 'Prescription', desc: `${p.doctorName} — ${p.diagnosis}`, type: 'prescription', status: p.status })),
    ...labTests.map((l) => ({ date: l.createdAt, title: `Lab: ${l.testName}`, desc: `${l.doctorName} — ${l.status}`, type: 'lab', status: l.status })),
    ...invoices.map((i) => ({ date: i.createdAt, title: `Invoice ${i.invoiceNo}`, desc: `₹${i.total} — ${i.status}`, type: 'invoice', status: i.status })),
  ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 8);

  const labStages = [
    { key: 'pending', label: 'Requested' },
    { key: 'sample_collected', label: 'Collected' },
    { key: 'in_progress', label: 'Processing' },
    { key: 'completed', label: 'Completed' },
    { key: 'verified', label: 'Verified' },
    { key: 'approved', label: 'Approved' },
  ];

  return (
    <div>
      <PageHeader
        title={`Hello, ${user?.name?.split(' ')[0]}`}
        description="Your complete health summary at a glance."
        action={<Link to="/dashboard/book-appointment"><Button><CalendarPlus className="h-4 w-4" /> Book Appointment</Button></Link>}
      />

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((st, i) => <StatCard key={st.label} {...st} delay={i * 0.05} />)}
      </div>

      {/* Hero Health Summary — unique asymmetric layout */}
      <div className="mt-8 grid gap-6 lg:grid-cols-12">
        {/* Health Summary — spans 5 cols */}
        <SectionCard title="Health Summary" className="lg:col-span-5">
          <div className="flex items-center gap-4 mb-5">
            <div className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-primary-500/10 to-secondary-500/10 text-2xl font-bold text-primary-600">
              {patient?.avatar || user?.avatar || user?.name?.[0]}
            </div>
            <div>
              <p className="font-display text-lg font-bold text-neutral-900">{patient?.name || user?.name}</p>
              <p className="text-sm text-neutral-500">{patient ? `${patient.age} yrs · ${patient.gender}` : '—'} · {patient?.bloodGroup || 'Unknown'}</p>
            </div>
          </div>
          <div className="space-y-2.5">
            {[
              { label: 'Blood Group', value: patient?.bloodGroup || 'O+', icon: Heart, color: 'error' },
              { label: 'Allergies', value: patient?.allergies?.length ? patient.allergies.join(', ') : 'None', icon: AlertCircle, color: 'warning' },
              { label: 'Chronic Conditions', value: patient?.chronicConditions?.length ? patient.chronicConditions.join(', ') : 'None', icon: Stethoscope, color: 'secondary' },
              { label: 'Insurance', value: patient?.insurance?.provider ? `${patient.insurance.provider} · ₹${(patient.insurance.coverage || 0).toLocaleString()}` : 'Not enrolled', icon: Shield, color: 'success' },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between rounded-xl border border-neutral-100 p-3 transition hover:bg-neutral-50/60">
                <div className="flex items-center gap-2.5">
                  <div className={`grid h-8 w-8 place-items-center rounded-lg bg-${item.color}-100${item.color}-900/40 text-${item.color}-600${item.color}-400`}>
                    <item.icon className="h-4 w-4" />
                  </div>
                  <span className="text-sm text-neutral-500">{item.label}</span>
                </div>
                <span className="text-sm font-medium text-neutral-900">{item.value}</span>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Billing Summary — spans 4 cols */}
        <SectionCard title="Billing Summary" className="lg:col-span-4">
          <div className="rounded-2xl bg-gradient-to-br from-neutral-50 to-neutral-100 p-5 mb-4">
            <div className="flex items-end justify-between mb-3">
              <div>
                <p className="text-xs text-neutral-500">Outstanding Balance</p>
                <p className="font-display text-3xl font-bold text-neutral-900 mt-1">₹{(totalBilled - totalPaid).toLocaleString()}</p>
              </div>
              {unpaidInvoices.length > 0 && <Badge variant="error" dot>{unpaidInvoices.length} unpaid</Badge>}
            </div>
            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-neutral-200/60">
              <div><p className="text-xs text-neutral-500">Total Billed</p><p className="text-sm font-semibold text-neutral-900">₹{totalBilled.toLocaleString()}</p></div>
              <div><p className="text-xs text-neutral-500">Total Paid</p><p className="text-sm font-semibold text-success-600">₹{totalPaid.toLocaleString()}</p></div>
            </div>
          </div>
          {unpaidInvoices.length === 0 ? (
            <div className="flex items-center gap-2.5 rounded-xl bg-success-50 p-3">
              <CheckCircle className="h-5 w-5 text-success-600" />
              <p className="text-sm text-success-700">All bills are paid.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {unpaidInvoices.map((inv) => (
                <div key={inv.id} className="flex items-center justify-between rounded-xl border border-neutral-100 p-3 card-hover">
                  <div><p className="text-sm font-medium text-neutral-900">{inv.invoiceNo}</p><p className="text-xs text-neutral-500">{inv.items?.length || 0} items</p></div>
                  <div className="text-right"><p className="text-sm font-semibold text-error-600">₹{inv.total.toLocaleString()}</p><Badge variant="warning">Unpaid</Badge></div>
                </div>
              ))}
            </div>
          )}
        </SectionCard>

        {/* Emergency — spans 3 cols */}
        <SectionCard title="Emergency" className="lg:col-span-3">
          <div className="rounded-2xl bg-gradient-to-br from-error-500 to-error-600 p-5 text-white">
            <div className="flex items-center gap-2 mb-1"><Phone className="h-4 w-4" /><span className="text-xs font-medium uppercase tracking-wide text-white/80">Hotline</span></div>
            <a href="tel:1066" className="font-display text-3xl font-bold tracking-tight">1066</a>
            <p className="mt-1 text-xs text-white/70">24/7 Emergency Response</p>
          </div>
          <div className="mt-3 space-y-2">
            <div className="rounded-xl border border-neutral-100 p-3">
              <p className="text-xs text-neutral-500">Personal Contact</p>
              <p className="mt-0.5 text-sm font-medium text-neutral-900">{patient?.emergencyContact || 'Not set'}</p>
            </div>
            {patient?.insurance && (
              <div className="rounded-xl border border-neutral-100 p-3">
                <p className="text-xs text-neutral-500">Insurance</p>
                <p className="mt-0.5 text-sm font-medium text-neutral-900">{patient.insurance.provider}</p>
                <p className="text-xs text-neutral-400">{patient.insurance.policyNo}</p>
              </div>
            )}
          </div>
        </SectionCard>
      </div>

      {/* Lab Reports — full tracking + comparison */}
      <SectionCard
        title="Lab Reports"
        description="Track test progress, download results, and compare previous reports."
        className="mt-8"
        action={completedLabs.length >= 2 && <Button variant="outline" size="sm" onClick={() => setCompareModal(true)}><GitCompare className="h-4 w-4" /> Compare Reports</Button>}
      >
        {labTests.length === 0 ? (
          <EmptyState icon={FlaskConical} title="No lab tests yet" description="Your lab reports will appear here once your doctor requests a test." />
        ) : (
          <div className="space-y-3">
            {labTests.map((lab, i) => {
              const currentStage = labStages.findIndex((s) => s.key === lab.status);
              return (
                <motion.div
                  key={lab.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.04 }}
                  className="rounded-2xl border border-neutral-100 p-4 card-hover"
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`grid h-10 w-10 place-items-center rounded-xl ${lab.status === 'approved' ? 'bg-success-100 text-success-600' : 'bg-warning-100 text-warning-600'}`}>
                        {lab.status === 'approved' ? <CheckCircle className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
                      </div>
                      <div>
                        <p className="font-medium text-neutral-900">{lab.testName}</p>
                        <p className="text-xs text-neutral-500">{lab.testType} · {lab.doctorName} · {new Date(lab.createdAt).toLocaleDateString('en', { day: 'numeric', month: 'short' })}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={lab.status === 'approved' ? 'success' : lab.status === 'completed' ? 'accent' : 'warning'} dot>{lab.status}</Badge>
                      {(lab.status === 'completed' || lab.status === 'approved') && (
                        <button onClick={() => setReportDetail(lab)} className="grid h-8 w-8 place-items-center rounded-lg bg-neutral-100 text-neutral-500 hover:text-primary-600 transition">
                          <Download className="h-4 w-4" />
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

      {/* Upcoming Appointments + Prescriptions — side by side */}
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <SectionCard
          title="Upcoming Appointments"
          action={<Link to="/dashboard/appointments" className="text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center gap-1">View all <ArrowUpRight className="h-3.5 w-3.5" /></Link>}
        >
          {upcomingAppts.length === 0 ? (
            <EmptyState icon={Calendar} title="No upcoming appointments" action={<Link to="/dashboard/book-appointment"><Button variant="outline" size="sm"><CalendarPlus className="h-4 w-4" /> Book one now</Button></Link>} />
          ) : (
            <div className="space-y-2.5">
              {upcomingAppts.map((a) => (
                <div key={a.id} className="flex items-center gap-4 rounded-xl border border-neutral-100 p-4 card-hover">
                  <div className="grid h-12 w-12 place-items-center rounded-xl bg-primary-100 text-primary-600">
                    <Calendar className="h-6 w-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-neutral-900 truncate">{a.doctorName}</p>
                    <p className="text-xs text-neutral-500">{a.departmentName} · {a.date} at {a.time}</p>
                  </div>
                  <Badge variant={a.status === 'confirmed' ? 'success' : 'warning'} dot>{a.status}</Badge>
                </div>
              ))}
            </div>
          )}
        </SectionCard>

        <SectionCard
          title="Recent Prescriptions"
          action={<Link to="/dashboard/prescriptions" className="text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center gap-1">View all <ArrowUpRight className="h-3.5 w-3.5" /></Link>}
        >
          {prescriptions.length === 0 ? (
            <EmptyState icon={Pill} title="No prescriptions yet" />
          ) : (
            <div className="space-y-2.5">
              {prescriptions.slice(0, 5).map((rx) => (
                <div key={rx.id} className="flex items-center justify-between rounded-xl border border-neutral-100 p-4 card-hover">
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-secondary-100 text-secondary-600">
                      <Pill className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-neutral-900">{rx.diagnosis}</p>
                      <p className="text-xs text-neutral-500">{rx.doctorName} · {rx.medicines?.length || 0} medicines</p>
                    </div>
                  </div>
                  <Badge variant={rx.status === 'dispensed' ? 'success' : 'warning'} dot>{rx.status}</Badge>
                </div>
              ))}
            </div>
          )}
        </SectionCard>
      </div>

      {/* Health Timeline */}
      <SectionCard title="Health Timeline" description="Your complete medical journey, chronologically." className="mt-8">
        {timeline.length === 0 ? (
          <EmptyState icon={Activity} title="No activity yet" />
        ) : (
          <div className="space-y-1">
            {timeline.map((t, i) => {
              const icons = { appointment: Calendar, prescription: Pill, lab: FlaskConical, invoice: Receipt };
              const Icon = icons[t.type] || FileText;
              const colors = { appointment: 'primary', prescription: 'secondary', lab: 'accent', invoice: 'error' };
              return (
                <div key={i} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`grid h-9 w-9 place-items-center rounded-full bg-${colors[t.type]}-100${colors[t.type]}-900/40 text-${colors[t.type]}-600${colors[t.type]}-400`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    {i < timeline.length - 1 && <div className="my-1 w-px flex-1 bg-neutral-200" />}
                  </div>
                  <div className="flex-1 pb-5">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-neutral-900">{t.title}</p>
                      <span className="text-xs text-neutral-400">{new Date(t.date).toLocaleDateString('en', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    </div>
                    <p className="mt-0.5 text-sm text-neutral-500">{t.desc}</p>
                    <Badge variant={t.status === 'completed' || t.status === 'paid' || t.status === 'dispensed' || t.status === 'approved' ? 'success' : t.status === 'confirmed' ? 'info' : 'warning'} className="mt-1.5" dot>{t.status}</Badge>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </SectionCard>

      {/* Report Detail Modal */}
      <Modal open={!!reportDetail} onClose={() => setReportDetail(null)} title={reportDetail?.testName || 'Lab Report'} size="lg">
        {reportDetail && (
          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <InfoRow label="Test" value={reportDetail.testName} />
              <InfoRow label="Type" value={reportDetail.testType} />
              <InfoRow label="Category" value={reportDetail.category} />
              <InfoRow label="Doctor" value={reportDetail.doctorName} />
              <InfoRow label="Date" value={new Date(reportDetail.createdAt).toLocaleDateString()} />
              <InfoRow label="Status" value={<Badge variant={reportDetail.status === 'approved' ? 'success' : 'warning'}>{reportDetail.status}</Badge>} />
            </div>
            {reportDetail.result && (
              <div className="rounded-xl border border-neutral-100 p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2">Result</p>
                <p className="text-sm text-neutral-900 whitespace-pre-wrap">{reportDetail.result}</p>
                {reportDetail.normalRange && <p className="mt-2 text-xs text-neutral-500">Reference: {reportDetail.normalRange}</p>}
              </div>
            )}
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => saveReportPdf(reportDetail)}><Download className="h-4 w-4" /> Download</Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Compare Reports Modal */}
      <Modal open={compareModal} onClose={() => setCompareModal(false)} title="Compare Lab Reports" size="xl">
        <div className="space-y-4">
          <p className="text-sm text-neutral-500">Compare your previous test results side-by-side to track changes over time.</p>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-neutral-100">
                  <th className="py-3 pr-4 text-xs font-semibold uppercase tracking-wider text-neutral-500">Parameter</th>
                  {completedLabs.slice(0, 4).map((lab) => (
                    <th key={lab.id} className="py-3 px-4 text-xs font-semibold uppercase tracking-wider text-neutral-500 whitespace-nowrap">
                      {lab.testName}<br/>
                      <span className="font-normal normal-case text-neutral-400">{new Date(lab.createdAt).toLocaleDateString('en', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                <tr><td className="py-3 pr-4 text-neutral-500">Status</td>{completedLabs.slice(0, 4).map((lab) => <td key={lab.id} className="py-3 px-4"><Badge variant={lab.status === 'approved' ? 'success' : 'warning'}>{lab.status}</Badge></td>)}</tr>
                <tr><td className="py-3 pr-4 text-neutral-500">Type</td>{completedLabs.slice(0, 4).map((lab) => <td key={lab.id} className="py-3 px-4 text-neutral-700">{lab.testType}</td>)}</tr>
                <tr><td className="py-3 pr-4 text-neutral-500">Category</td>{completedLabs.slice(0, 4).map((lab) => <td key={lab.id} className="py-3 px-4 text-neutral-700">{lab.category}</td>)}</tr>
                <tr><td className="py-3 pr-4 text-neutral-500">Result</td>{completedLabs.slice(0, 4).map((lab) => <td key={lab.id} className="py-3 px-4 text-neutral-700 max-w-xs truncate">{lab.result || '—'}</td>)}</tr>
                <tr><td className="py-3 pr-4 text-neutral-500">TAT</td>{completedLabs.slice(0, 4).map((lab) => <td key={lab.id} className="py-3 px-4 text-neutral-700">{lab.tatHours ? `${lab.tatHours}h` : '—'}</td>)}</tr>
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

function SkeletonLoader() {
  return (
    <div className="space-y-6">
      <div className="skeleton h-10 w-64" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton h-28" />)}</div>
      <div className="grid gap-6 lg:grid-cols-12">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="skeleton h-64 lg:col-span-4" />)}</div>
    </div>
  );
}
