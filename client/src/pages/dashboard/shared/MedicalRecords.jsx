import { useEffect, useState } from 'react';
import { FileText, Activity, Heart, Thermometer, Download, Stethoscope, FlaskConical, Pill } from 'lucide-react';
import { PageHeader, Card, Badge, Button, EmptyState } from '../../../components/ui/index.jsx';
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

export default function MedicalRecords() {
  const [labTests, setLabTests] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [vitals, setVitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useSelector((s) => s.auth);

  useEffect(() => {
    const pid = user?.patientId || 'p_1';
    Promise.all([
      mockApi.listLabTests({ patientId: pid, limit: 50 }),
      mockApi.listPrescriptions({ patientId: pid, limit: 50 }),
      mockApi.listAppointments({ patientId: pid, limit: 50 }),
      mockApi.listVitals({ patientId: pid, limit: 10 }),
    ]).then(([labs, rxs, appts, vit]) => {
      setLabTests(labs.items || []);
      setPrescriptions(rxs.items || []);
      setAppointments(appts.items || []);
      setVitals(vit.items || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [user]);

  const downloadAllRecords = async () => {
    const ready = labTests.filter((l) => l.status === 'completed' || l.status === 'approved');
    if (!ready.length) { toast.error('No completed reports available yet'); return; }
    const t = toast.loading(`Generating ${ready.length} PDF${ready.length > 1 ? 's' : ''}…`);
    try {
      const { downloadLabReportPdf } = await import('../../../utils/labReportPdf.js');
      for (const lab of ready) {
        await downloadLabReportPdf({ test: lab, patient: { name: lab?.patientName, id: lab?.patientId } });
      }
      toast.success(`Downloaded ${ready.length} report${ready.length > 1 ? 's' : ''}`, { id: t });
    } catch (err) {
      toast.error(err?.message || 'Could not generate the PDFs', { id: t });
    }
  };

  const timeline = [
    ...appointments.map((a) => ({ date: a.date, title: `Consultation — ${a.doctorName}`, desc: a.reason || 'Appointment', type: 'consultation' })),
    ...labTests.map((l) => ({ date: l.createdAt?.slice(0, 10) || '', title: `Lab Test — ${l.testName}`, desc: l.result || l.status, type: 'lab' })),
    ...prescriptions.map((p) => ({ date: p.createdAt?.slice(0, 10) || '', title: `Prescription — ${p.doctorName}`, desc: p.diagnosis || '', type: 'prescription' })),
  ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 12);

  const latestVitals = vitals[0];
  const vitalCards = latestVitals ? [
    { icon: Heart, label: 'Heart Rate', value: `${latestVitals.heartRate} bpm`, color: 'error', range: '60-100' },
    { icon: Activity, label: 'Blood Pressure', value: latestVitals.bloodPressure, color: 'primary', range: '90-120' },
    { icon: Thermometer, label: 'Temperature', value: `${latestVitals.temperature}°F`, color: 'warning', range: '97-99' },
    { icon: Activity, label: 'Oxygen Sat', value: `${latestVitals.oxygenSat}%`, color: 'success', range: '95-100' },
  ] : [];

  return (
    <div>
      <PageHeader title="Medical Records" description={user?.role === 'patient' ? 'Your complete medical history and health summary.' : 'Patient medical records and vitals.'} />

      {(user?.role === 'nurse' || user?.role === 'doctor') && vitalCards.length > 0 && (
        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {vitalCards.map((v) => (
            <Card key={v.label} className="p-5">
              <div className="flex items-center justify-between">
                <div><p className="text-sm text-neutral-500">{v.label}</p><p className="mt-1 font-display text-2xl font-bold text-neutral-900">{v.value}</p><p className="text-xs text-neutral-400">Normal: {v.range}</p></div>
                <div className={`grid h-10 w-10 place-items-center rounded-xl bg-${v.color}-100 text-${v.color}-600${v.color}-900/40`}><v.icon className="h-5 w-5" /></div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
          <h3 className="mb-4 font-display font-bold text-neutral-900">Health Timeline</h3>
          {loading ? <p className="text-neutral-400">Loading...</p> : timeline.length === 0 ? <EmptyState icon={Activity} title="No records yet" /> : (
            <div className="space-y-4">
              {timeline.map((t, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`grid h-9 w-9 place-items-center rounded-full ${t.type === 'lab' ? 'bg-primary-100 text-primary-600' : t.type === 'prescription' ? 'bg-secondary-100 text-secondary-600' : 'bg-accent-100 text-accent-600'}`}>
                      {t.type === 'lab' ? <FlaskConical className="h-4 w-4" /> : t.type === 'prescription' ? <Pill className="h-4 w-4" /> : <Stethoscope className="h-4 w-4" />}
                    </div>
                    {i < timeline.length - 1 && <div className="my-1 w-px flex-1 bg-neutral-200" />}
                  </div>
                  <div className="flex-1 pb-4">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-neutral-900">{t.title}</p>
                      <span className="text-xs text-neutral-400">{t.date ? new Date(t.date).toLocaleDateString('en', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}</span>
                    </div>
                    <p className="mt-1 text-sm text-neutral-500">{t.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
        <Card className="p-5">
          <h3 className="mb-4 font-display font-bold text-neutral-900">Documents</h3>
          <div className="space-y-2">
            {labTests.filter((l) => l.status === 'completed' || l.status === 'approved').slice(0, 5).map((lab) => (
              <div key={lab.id} className="flex items-center justify-between rounded-xl border border-neutral-100 p-3">
                <div className="flex items-center gap-3"><div className="grid h-9 w-9 place-items-center rounded-lg bg-error-100 text-error-600"><FileText className="h-4 w-4" /></div><div><p className="text-sm font-medium text-neutral-900">{lab.testName}</p><p className="text-xs text-neutral-500">{lab.status}</p></div></div>
                <button onClick={() => saveReportPdf(lab)} aria-label={`Download ${lab.testName} report`} className="text-neutral-500 hover:text-primary-600"><Download className="h-4 w-4" /></button>
              </div>
            ))}
            {labTests.filter((l) => l.status === 'completed' || l.status === 'approved').length === 0 && <EmptyState icon={FileText} title="No documents" />}
          </div>
          <Button variant="outline" className="mt-4 w-full justify-center" onClick={downloadAllRecords}><Download className="h-4 w-4" /> Download All Records</Button>
        </Card>
      </div>
    </div>
  );
}
