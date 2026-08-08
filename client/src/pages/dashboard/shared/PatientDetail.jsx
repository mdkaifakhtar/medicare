import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Calendar, Pill, FlaskConical, Receipt, Activity, Heart,
  Shield, AlertCircle, Phone, MapPin, Download, Clock, CheckCircle,
} from 'lucide-react';
import { Card, Badge, Button, PageHeader } from '../../../components/ui/index.jsx';
import { mockApi } from '../../../services/mockApi.js';

export default function PatientDetail() {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    mockApi.getPatient(id).then((p) => { setPatient(p); setLoading(false); }).catch(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="skeleton h-96" />;
  if (!patient) return <div className="text-center text-neutral-400 py-20">Patient not found</div>;

  const timeline = [
    ...patient.appointments.map((a) => ({ date: a.date || a.createdAt, title: `Appointment ${a.token}`, desc: `${a.doctorName} — ${a.reason || a.status}`, type: 'appointment', status: a.status })),
    ...patient.prescriptions.map((p) => ({ date: p.createdAt, title: 'Prescription', desc: `${p.doctorName} — ${p.diagnosis}`, type: 'prescription', status: p.status })),
    ...patient.labTests.map((l) => ({ date: l.createdAt, title: l.testName, desc: `${l.doctorName} — ${l.status}`, type: 'lab', status: l.status })),
    ...patient.invoices.map((i) => ({ date: i.createdAt, title: `Invoice ${i.invoiceNo}`, desc: `₹${i.total} — ${i.status}`, type: 'invoice', status: i.status })),
  ].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div>
      <Link to="/dashboard/patients" className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-primary-600 transition-colors mb-4">
        <ArrowLeft className="h-4 w-4" /> Back to Patients
      </Link>
      <PageHeader title={patient.name} description={`Patient ID: ${patient.id} · Registered ${new Date(patient.registeredAt).toLocaleDateString()}`} />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Patient Info */}
        <Card className="p-5">
          <div className="flex items-center gap-4 mb-4">
            <div className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 text-xl font-bold text-white">{patient.avatar || patient.name[0]}</div>
            <div><h3 className="font-display text-lg font-bold text-neutral-900">{patient.name}</h3><p className="text-sm text-neutral-500">{patient.age} yrs · {patient.gender} · {patient.bloodGroup}</p></div>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-neutral-600"><Phone className="h-4 w-4 text-neutral-400" /> {patient.phone}</div>
            <div className="flex items-center gap-2 text-neutral-600"><MapPin className="h-4 w-4 text-neutral-400" /> {patient.address || '—'}</div>
            <div className="flex items-center gap-2 text-neutral-600"><AlertCircle className="h-4 w-4 text-error-500" /> Allergies: {patient.allergies?.length ? patient.allergies.join(', ') : 'None'}</div>
            <div className="flex items-center gap-2 text-neutral-600"><Heart className="h-4 w-4 text-error-500" /> Chronic: {patient.chronicConditions?.length ? patient.chronicConditions.join(', ') : 'None'}</div>
            <div className="flex items-center gap-2 text-neutral-600"><Shield className="h-4 w-4 text-success-500" /> Insurance: {patient.insurance?.provider || 'None'} ({patient.insurance?.policyNo || '—'})</div>
            <div className="flex items-center gap-2 text-neutral-600"><Phone className="h-4 w-4 text-neutral-400" /> Emergency: {patient.emergencyContact || '—'}</div>
          </div>
        </Card>

        {/* Stats */}
        <div className="lg:col-span-2 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Calendar, label: 'Appointments', value: patient.appointments.length, color: 'primary' },
            { icon: Pill, label: 'Prescriptions', value: patient.prescriptions.length, color: 'secondary' },
            { icon: FlaskConical, label: 'Lab Tests', value: patient.labTests.length, color: 'accent' },
            { icon: Receipt, label: 'Invoices', value: patient.invoices.length, color: 'error' },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="card p-4">
              <div className={`grid h-10 w-10 place-items-center rounded-xl bg-${s.color}-100 text-${s.color}-600${s.color}-900/40 mb-3`}><s.icon className="h-5 w-5" /></div>
              <p className="font-display text-2xl font-bold text-neutral-900">{s.value}</p>
              <p className="text-xs text-neutral-500">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recent Vitals */}
      {patient.vitals?.length > 0 && (
        <Card className="mt-6 p-5">
          <h3 className="font-display font-bold text-neutral-900 mb-4">Recent Vitals</h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {patient.vitals.slice(0, 4).map((v) => (
              <div key={v.id} className="rounded-xl border border-neutral-100 p-3">
                <p className="text-xs text-neutral-500">{new Date(v.recordedAt).toLocaleString()}</p>
                <div className="mt-2 space-y-1 text-sm">
                  <div className="flex justify-between"><span className="text-neutral-500">BP</span><span className="font-medium text-neutral-900">{v.bloodPressure}</span></div>
                  <div className="flex justify-between"><span className="text-neutral-500">HR</span><span className="font-medium text-neutral-900">{v.heartRate} bpm</span></div>
                  <div className="flex justify-between"><span className="text-neutral-500">O2</span><span className="font-medium text-neutral-900">{v.oxygenSat}%</span></div>
                  <div className="flex justify-between"><span className="text-neutral-500">Temp</span><span className="font-medium text-neutral-900">{v.temperature}°F</span></div>
                </div>
                {v.notes && <p className="mt-2 text-xs text-neutral-400 italic">{v.notes}</p>}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Unified Timeline */}
      <Card className="mt-6 p-5">
        <h3 className="font-display font-bold text-neutral-900 mb-4">Patient Timeline</h3>
        <div className="space-y-4">
          {timeline.map((t, i) => {
            const icons = { appointment: Calendar, prescription: Pill, lab: FlaskConical, invoice: Receipt };
            const Icon = icons[t.type] || Activity;
            return (
              <div key={i} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="grid h-9 w-9 place-items-center rounded-full bg-primary-100 text-primary-600"><Icon className="h-4 w-4" /></div>
                  {i < timeline.length - 1 && <div className="my-1 w-px flex-1 bg-neutral-200" />}
                </div>
                <div className="flex-1 pb-4">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-neutral-900">{t.title}</p>
                    <span className="text-xs text-neutral-400">{new Date(t.date).toLocaleDateString('en', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </div>
                  <p className="mt-0.5 text-sm text-neutral-500">{t.desc}</p>
                  <Badge variant={t.status === 'completed' || t.status === 'paid' || t.status === 'dispensed' ? 'success' : 'warning'} className="mt-1">{t.status}</Badge>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
