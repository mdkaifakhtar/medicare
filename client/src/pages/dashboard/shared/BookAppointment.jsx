import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, User, Stethoscope, Check } from 'lucide-react';
import { PageHeader, Card, Button, Badge } from '../../../components/ui/index.jsx';
import { mockApi } from '../../../services/mockApi.js';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function BookAppointment() {
  const [departments, setDepartments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ department: '', doctor: '', date: '', time: '', reason: '', type: 'Consultation' });
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((s) => s.auth);
  const navigate = useNavigate();

  useEffect(() => {
    mockApi.listDepartments({ limit: 50 }).then((r) => setDepartments(r.items));
    mockApi.listDoctors({ limit: 50 }).then((r) => setDoctors(r.items));
  }, []);

  const availableDoctors = form.department ? doctors.filter((d) => d.department === form.department && d.status === 'available') : doctors;

  const submit = async () => {
    setLoading(true);
    const dep = departments.find((d) => d.id === form.department);
    const doc = doctors.find((d) => d.id === form.doctor);
    await mockApi.createAppointment({
      patientId: user?.patientId || 'p_1',
      patientName: user?.name,
      phone: user?.phone,
      doctorId: form.doctor,
      doctorName: doc?.name,
      department: dep?.name,
      date: form.date,
      time: form.time,
      reason: form.reason,
      type: form.type,
    });
    setLoading(false);
    toast.success('Appointment booked successfully!');
    navigate('/dashboard/appointments');
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div>
      <PageHeader title="Book Appointment" description="Schedule a consultation with our specialists in three easy steps." />
      <div className="mx-auto max-w-2xl">
        {/* Steps */}
        <div className="mb-8 flex items-center justify-between gap-1 overflow-hidden">
          {['Department', 'Doctor & Time', 'Confirm'].map((label, i) => {
            const n = i + 1;
            const active = step >= n;
            return (
              <div key={label} className="flex flex-1 items-center">
                <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-full text-sm font-semibold transition ${active ? 'bg-primary-600 text-white' : 'bg-neutral-200 text-neutral-500'}`}>{active && step > n ? <Check className="h-4 w-4" /> : n}</div>
                <span className={`ml-2 hidden truncate text-sm font-medium sm:inline ${active ? 'text-neutral-900' : 'text-neutral-400'}`}>{label}</span>
                {i < 2 && <div className={`mx-2 h-px flex-1 sm:mx-3 ${step > n ? 'bg-primary-600' : 'bg-neutral-200'}`} />}
              </div>
            );
          })}
        </div>

        <Card className="p-6">
          {step === 1 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <h3 className="mb-4 font-display text-lg font-bold text-neutral-900">Select Department</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {departments.map((d) => (
                  <button key={d.id} onClick={() => { setForm({ ...form, department: d.id, doctor: '' }); setStep(2); }} className={`flex items-center gap-3 rounded-xl border p-4 text-left transition ${form.department === d.id ? 'border-primary-500 bg-primary-50' : 'border-neutral-200 hover:border-primary-300'}`}>
                    <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary-100 text-primary-600"><Stethoscope className="h-5 w-5" /></div>
                    <div><p className="font-medium text-neutral-900">{d.name}</p><p className="text-xs text-neutral-500">Floor {d.floor}</p></div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <h3 className="mb-4 font-display text-lg font-bold text-neutral-900">Choose Doctor & Time</h3>
              <div className="space-y-3">
                {availableDoctors.length === 0 ? <p className="text-sm text-neutral-500">No doctors available in this department.</p> : availableDoctors.map((d) => (
                  <button key={d.id} onClick={() => setForm({ ...form, doctor: d.id })} className={`flex w-full items-center gap-4 rounded-xl border p-4 text-left transition ${form.doctor === d.id ? 'border-primary-500 bg-primary-50' : 'border-neutral-200 hover:border-primary-300'}`}>
                    <img src={d.image} alt={d.name} className="h-12 w-12 rounded-full object-cover" />
                    <div className="flex-1"><p className="font-medium text-neutral-900">{d.name}</p><p className="text-xs text-neutral-500">{d.specialization} · ₹{d.consultationFee}</p></div>
                    <Badge variant="success">Available</Badge>
                  </button>
                ))}
              </div>
              {form.doctor && (
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div><label className="label">Date</label><input type="date" min={today} value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="input" /></div>
                  <div><label className="label">Time Slot</label><select value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} className="input"><option value="">Select time</option>{(doctors.find((d) => d.id === form.doctor)?.timeSlots || []).map((t) => <option key={t} value={t}>{t}</option>)}</select></div>
                </div>
              )}
              <div className="mt-6 flex justify-between">
                <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
                <Button disabled={!form.doctor || !form.date || !form.time} onClick={() => setStep(3)}>Continue</Button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <h3 className="mb-4 font-display text-lg font-bold text-neutral-900">Confirm Details</h3>
              <div className="space-y-3 rounded-xl bg-neutral-50 p-4">
                {[['Patient', user?.name], ['Department', departments.find((d) => d.id === form.department)?.name], ['Doctor', doctors.find((d) => d.id === form.doctor)?.name], ['Date', form.date], ['Time', form.time], ['Type', form.type]].map(([k, v]) => (
                  <div key={k} className="flex justify-between text-sm"><span className="text-neutral-500">{k}</span><span className="font-medium text-neutral-900">{v || '—'}</span></div>
                ))}
              </div>
              <div className="mt-4"><label className="label">Reason for visit (optional)</label><textarea rows={2} value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} className="input" placeholder="Describe your symptoms..." /></div>
              <div className="mt-6 flex justify-between">
                <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
                <Button disabled={loading} onClick={submit}>{loading ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> : 'Confirm Booking'}</Button>
              </div>
            </motion.div>
          )}
        </Card>
      </div>
    </div>
  );
}
