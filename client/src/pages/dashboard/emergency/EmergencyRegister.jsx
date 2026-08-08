import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserPlus, Heart, Activity, Thermometer, Droplet, Wind, ChevronRight, Check, AlertTriangle, ShieldAlert, Ambulance, Stethoscope, BedDouble, Phone, User, Clock, ArrowLeft, ChevronDown } from 'lucide-react';
import { Button, Badge } from '../../../components/ui/index.jsx';
import { mockApi } from '../../../services/mockApi.js';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';

const TRAUMA_LEVELS = [
  { value: 'Level 1 Critical',    label: 'Level 1 — Critical',     color: 'bg-error-600',   text: 'text-white', desc: 'Immediately life-threatening. Heart attack, stroke, severe bleeding, respiratory failure.' },
  { value: 'Level 2 Emergent',    label: 'Level 2 — Emergent',     color: 'bg-error-500',   text: 'text-white', desc: 'High risk of deterioration. Severe pain, altered mental status, significant injury.' },
  { value: 'Level 3 Urgent',      label: 'Level 3 — Urgent',       color: 'bg-warning-500', text: 'text-white', desc: 'Stable but needs prompt attention. Fever >38.5, moderate pain, fracture.' },
  { value: 'Level 4 Less Urgent', label: 'Level 4 — Less Urgent',  color: 'bg-accent-500',  text: 'text-white', desc: 'Stable. Minor injury, mild symptoms, can wait 1-2 hours.' },
  { value: 'Level 5 Non-Urgent',  label: 'Level 5 — Non-Urgent',   color: 'bg-success-500', text: 'text-white', desc: 'Non-emergency. Minor complaints, medication refill, stable chronic conditions.' },
];

const ARRIVAL_MODES = ['Walk-in', 'Ambulance', 'Police', 'Referral', 'Transfer'];

const CHIEF_COMPLAINTS = [
  'Chest Pain', 'Shortness of Breath', 'Altered Mental Status', 'Severe Headache',
  'Abdominal Pain', 'Fever', 'Trauma / Injury', 'Seizure', 'Stroke Symptoms',
  'Allergic Reaction', 'Overdose / Poisoning', 'Cardiac Arrest', 'Bleeding',
  'Fracture / Dislocation', 'Burns', 'Eye Injury', 'Back Pain', 'Other',
];

const STEP_LABELS = ['Patient Info', 'Chief Complaint & Trauma', 'Vitals', 'Resources', 'Review'];

const defaultVitals = { heartRate: '', bloodPressure: '', temperature: '', oxygenSat: '', respiratoryRate: '', gcs: 15 };

export default function EmergencyRegister() {
  const { user } = useSelector((s) => s.auth);
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [ambulances, setAmbulances] = useState([]);
  const [beds, setBeds] = useState([]);
  const [form, setForm] = useState({
    patientName: '', patientAge: '', patientGender: 'Male', contactPhone: '',
    chiefComplaint: '', traumaLevel: '', arrivalMode: 'Walk-in',
    vitals: { ...defaultVitals },
    assignedDoctorName: '', ambulanceId: '', assignedBedNumber: '',
    notes: '', priorityFlag: false,
  });

  useEffect(() => {
    mockApi.listDoctors({ limit: 50 }).then((r) => setDoctors(r.items || [])).catch(() => {});
    mockApi.listAmbulances({ limit: 50 }).then((r) => setAmbulances((r.items || []).filter((a) => a.status === 'available'))).catch(() => {});
    mockApi.listBeds({ limit: 100 }).then((r) => setBeds((r.items || []).filter((b) => b.status === 'available'))).catch(() => {});
  }, []);

  const setField = (key, val) => setForm((f) => ({ ...f, [key]: val }));
  const setVital = (key, val) => setForm((f) => ({ ...f, vitals: { ...f.vitals, [key]: val } }));

  const validateStep = () => {
    if (step === 0 && (!form.patientName.trim() || !form.contactPhone.trim())) { toast.error('Patient name and contact phone are required'); return false; }
    if (step === 1 && (!form.chiefComplaint || !form.traumaLevel)) { toast.error('Chief complaint and trauma level are required'); return false; }
    return true;
  };

  const submit = async () => {
    if (!form.patientName || !form.chiefComplaint || !form.traumaLevel) { toast.error('Please complete all required fields'); return; }
    setLoading(true);
    try {
      const traumaPriority = form.traumaLevel.includes('Level 1') || form.traumaLevel.includes('Level 2') ? 'critical' : form.traumaLevel.includes('Level 3') ? 'urgent' : form.traumaLevel.includes('Level 4') ? 'moderate' : 'minor';
      const selectedDoctor = doctors.find((d) => d.name === form.assignedDoctorName);
      const selectedBed = beds.find((b) => (b.bedNumber || b.number) === form.assignedBedNumber);
      const selectedAmbulance = ambulances.find((a) => (a._id || a.id) === form.ambulanceId);
      const payload = {
        patientName: form.patientName.trim(),
        patientAge: Number(form.patientAge) || 0,
        patientGender: form.patientGender,
        patientPhone: form.contactPhone.trim(),
        chiefComplaint: form.chiefComplaint,
        traumaLevel: form.traumaLevel,
        priority: traumaPriority,
        arrivalMode: form.arrivalMode,
        vitals: {
          heartRate: Number(form.vitals.heartRate) || 0,
          bloodPressure: form.vitals.bloodPressure,
          temperature: Number(form.vitals.temperature) || 0,
          oxygenSat: Number(form.vitals.oxygenSat) || 0,
          respiratoryRate: Number(form.vitals.respiratoryRate) || 0,
          gcs: Number(form.vitals.gcs) || 15,
        },
        doctorId: selectedDoctor?.id || null,
        doctorName: form.assignedDoctorName || '',
        bedId: selectedBed?.id || null,
        bedNumber: form.assignedBedNumber || null,
        ambulanceId: form.ambulanceId || null,
        ambulanceNo: selectedAmbulance?.vehicleNo || null,
        status: 'waiting',
        notes: form.notes ? [{ text: form.notes, author: user?.name, role: user?.role, createdAt: new Date().toISOString() }] : [],
      };
      await mockApi.createEmergencyCase(payload);
      toast.success(`Emergency case registered — ${form.traumaLevel}`);
      navigate('/dashboard/emergency/queue');
    } catch (err) {
      toast.error('Failed to register case');
    } finally {
      setLoading(false);
    }
  };

  const isAbnormal = (key, val) => {
    const v = Number(val);
    if (key === 'heartRate') return v > 100 || v < 60;
    if (key === 'oxygenSat') return v < 92;
    if (key === 'temperature') return v > 100.4 || v < 96;
    if (key === 'gcs') return v < 14;
    return false;
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <button onClick={() => navigate('/dashboard/emergency')} className="grid h-9 w-9 place-items-center rounded-xl border border-neutral-200 text-neutral-500 hover:text-primary-600 transition">
          <ArrowLeft className="h-4.5 w-4.5" />
        </button>
        <div>
          <h1 className="font-display text-2xl font-bold text-neutral-900">Register Emergency Case</h1>
          <p className="text-sm text-neutral-500">Complete all steps to register a new emergency patient</p>
        </div>
      </div>

      {/* Step indicator */}
      <div className="mb-8 flex items-center justify-between">
        {STEP_LABELS.map((label, i) => (
          <div key={label} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <div className={`grid h-9 w-9 place-items-center rounded-full text-sm font-semibold transition-all duration-300 ${i < step ? 'bg-success-600 text-white' : i === step ? 'bg-error-600 text-white ring-4 ring-error-500/20' : 'bg-neutral-200 text-neutral-500'}`}>
                {i < step ? <Check className="h-4 w-4" /> : i + 1}
              </div>
              <span className={`mt-1.5 text-[11px] text-center hidden sm:block font-medium ${i === step ? 'text-error-600' : i < step ? 'text-success-600' : 'text-neutral-400'}`}>{label}</span>
            </div>
            {i < STEP_LABELS.length - 1 && (
              <div className={`flex-1 h-0.5 mx-2 mt-[-18px] sm:mt-[-26px] ${i < step ? 'bg-success-500' : 'bg-neutral-200'}`} />
            )}
          </div>
        ))}
      </div>

      <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
        <div className="mx-auto max-w-2xl">
          <div className="card p-6 space-y-5">
            {/* Step 0: Patient Info */}
            {step === 0 && (
              <>
                <h2 className="font-display text-lg font-bold text-neutral-900">Patient Information</h2>
                <div><label className="label">Full Name <span className="text-error-500">*</span></label><div className="relative"><User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" /><input required value={form.patientName} onChange={(e) => setField('patientName', e.target.value)} className="input pl-9" placeholder="Patient full name" /></div></div>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div><label className="label">Age</label><input type="number" min="0" max="150" value={form.patientAge} onChange={(e) => setField('patientAge', e.target.value)} className="input" placeholder="Years" /></div>
                  <div><label className="label">Gender</label><select value={form.patientGender} onChange={(e) => setField('patientGender', e.target.value)} className="input"><option>Male</option><option>Female</option><option>Other</option><option>Unknown</option></select></div>
                  <div><label className="label">Contact Phone <span className="text-error-500">*</span></label><div className="relative"><Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" /><input required value={form.contactPhone} onChange={(e) => setField('contactPhone', e.target.value)} className="input pl-9" placeholder="+91 ..." /></div></div>
                </div>
                <div><label className="label">Arrival Mode</label>
                  <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
                    {ARRIVAL_MODES.map((m) => (
                      <button key={m} type="button" onClick={() => setField('arrivalMode', m)} className={`rounded-xl border py-2.5 text-sm font-medium transition ${form.arrivalMode === m ? 'border-error-500 bg-error-50 text-error-700' : 'border-neutral-200 text-neutral-600 hover:bg-neutral-50'}`}>
                        {m}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Step 1: Complaint & Trauma */}
            {step === 1 && (
              <>
                <h2 className="font-display text-lg font-bold text-neutral-900">Chief Complaint & Trauma Level</h2>
                <div>
                  <label className="label">Chief Complaint <span className="text-error-500">*</span></label>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {CHIEF_COMPLAINTS.map((c) => (
                      <button key={c} type="button" onClick={() => setField('chiefComplaint', c)} className={`rounded-xl border px-3 py-2.5 text-sm font-medium text-left transition ${form.chiefComplaint === c ? 'border-error-500 bg-error-50 text-error-700' : 'border-neutral-200 text-neutral-600 hover:bg-neutral-50'}`}>
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="label">Trauma Level (Triage) <span className="text-error-500">*</span></label>
                  <div className="space-y-2">
                    {TRAUMA_LEVELS.map((t) => (
                      <button key={t.value} type="button" onClick={() => setField('traumaLevel', t.value)} className={`w-full flex items-center gap-3 rounded-xl border p-3.5 text-left transition ${form.traumaLevel === t.value ? 'border-neutral-400 ring-2 ring-neutral-900/20' : 'border-neutral-200 hover:bg-neutral-50'}`}>
                        <div className={`grid h-10 w-10 place-items-center rounded-xl shrink-0 ${t.color} ${t.text}`}>
                          <ShieldAlert className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-neutral-900">{t.label}</p>
                          <p className="text-xs text-neutral-500 truncate">{t.desc}</p>
                        </div>
                        {form.traumaLevel === t.value && <Check className="h-5 w-5 text-success-600 shrink-0" />}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Step 2: Vitals */}
            {step === 2 && (
              <>
                <h2 className="font-display text-lg font-bold text-neutral-900">Vital Signs</h2>
                <p className="text-sm text-neutral-500">Record current vitals. Abnormal values will be automatically flagged.</p>
                <div className="grid gap-4 sm:grid-cols-2">
                  {[
                    { key: 'heartRate', label: 'Heart Rate (bpm)', icon: Heart, placeholder: '72', normal: '60-100' },
                    { key: 'bloodPressure', label: 'Blood Pressure', icon: Activity, placeholder: '120/80', normal: 'Normal <120/80' },
                    { key: 'temperature', label: 'Temperature (°F)', icon: Thermometer, placeholder: '98.6', normal: '96.8-100.4' },
                    { key: 'oxygenSat', label: 'Oxygen Saturation (%)', icon: Droplet, placeholder: '98', normal: '>95%' },
                    { key: 'respiratoryRate', label: 'Respiratory Rate (bpm)', icon: Wind, placeholder: '16', normal: '12-20' },
                    { key: 'gcs', label: 'GCS Score (3-15)', icon: Activity, placeholder: '15', normal: 'Normal: 15' },
                  ].map((v) => {
                    const val = form.vitals[v.key];
                    const abnormal = val && v.key !== 'bloodPressure' && isAbnormal(v.key, val);
                    return (
                      <div key={v.key}>
                        <label className="label flex items-center gap-1.5">{v.label} {abnormal && <span className="rounded-full bg-error-100 px-1.5 py-0.5 text-[10px] font-bold text-error-600">ABNORMAL</span>}</label>
                        <div className="relative">
                          <v.icon className={`absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 ${abnormal ? 'text-error-500' : 'text-neutral-400'}`} />
                          <input
                            type={v.key === 'bloodPressure' ? 'text' : 'number'}
                            step={v.key === 'temperature' ? '0.1' : '1'}
                            value={val}
                            onChange={(e) => setVital(v.key, e.target.value)}
                            className={`input pl-9 ${abnormal ? 'border-error-400 focus:border-error-500 focus:ring-error-500/20' : ''}`}
                            placeholder={v.placeholder}
                          />
                        </div>
                        <p className="mt-1 text-[10px] text-neutral-400">Normal: {v.normal}</p>
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            {/* Step 3: Resources */}
            {step === 3 && (
              <>
                <h2 className="font-display text-lg font-bold text-neutral-900">Assign Resources</h2>
                <div>
                  <label className="label">Assign Doctor</label>
                  <select value={form.assignedDoctorName} onChange={(e) => setField('assignedDoctorName', e.target.value)} className="input">
                    <option value="">Select doctor (optional)</option>
                    {doctors.map((d) => <option key={d._id || d.id} value={d.name}>{d.name} — {d.specialization || d.departmentName}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Assign Ambulance</label>
                  <select value={form.ambulanceId} onChange={(e) => setField('ambulanceId', e.target.value)} className="input">
                    <option value="">No ambulance (optional)</option>
                    {ambulances.map((a) => <option key={a._id || a.id} value={a._id || a.id}>{a.vehicleNumber || a.vehicleNo} — {a.driver || 'No driver'}</option>)}
                  </select>
                  {ambulances.length === 0 && <p className="mt-1 text-xs text-warning-600">No ambulances currently available</p>}
                </div>
                <div>
                  <label className="label">Assign Bed</label>
                  <select value={form.assignedBedNumber} onChange={(e) => setField('assignedBedNumber', e.target.value)} className="input">
                    <option value="">No bed assignment yet</option>
                    {beds.map((b) => <option key={b._id || b.id} value={b.bedNumber || b.number}>{b.bedNumber || b.number} — {b.ward || b.type || 'General'}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Initial Notes</label>
                  <textarea rows={3} value={form.notes} onChange={(e) => setField('notes', e.target.value)} className="input" placeholder="Additional clinical notes, context, or instructions..." />
                </div>
              </>
            )}

            {/* Step 4: Review */}
            {step === 4 && (
              <>
                <h2 className="font-display text-lg font-bold text-neutral-900">Review & Confirm</h2>
                {form.traumaLevel && (
                  <div className={`flex items-center gap-3 rounded-2xl p-4 ${TRAUMA_LEVELS.find((t) => t.value === form.traumaLevel)?.color} text-white`}>
                    <ShieldAlert className="h-6 w-6 shrink-0" />
                    <div>
                      <p className="font-semibold">{form.traumaLevel}</p>
                      <p className="text-xs opacity-80">{TRAUMA_LEVELS.find((t) => t.value === form.traumaLevel)?.desc}</p>
                    </div>
                  </div>
                )}
                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    ['Patient Name', form.patientName],
                    ['Age / Gender', `${form.patientAge || '—'} yrs / ${form.patientGender}`],
                    ['Contact', form.contactPhone],
                    ['Arrival Mode', form.arrivalMode],
                    ['Chief Complaint', form.chiefComplaint],
                    ['Doctor', form.assignedDoctorName || 'Not assigned'],
                    ['Bed', form.assignedBedNumber || 'Not assigned'],
                  ].map(([k, v]) => (
                    <div key={k} className="rounded-xl border border-neutral-100 p-3">
                      <p className="text-xs text-neutral-500">{k}</p>
                      <p className="mt-0.5 text-sm font-semibold text-neutral-900">{v}</p>
                    </div>
                  ))}
                </div>
                {Object.values(form.vitals).some((v) => v) && (
                  <div className="rounded-xl border border-neutral-100 p-3">
                    <p className="text-xs text-neutral-500 mb-2">Vitals</p>
                    <div className="flex flex-wrap gap-2">
                      {form.vitals.heartRate && <VitalReview label="HR" val={form.vitals.heartRate} unit="bpm" alert={isAbnormal('heartRate', form.vitals.heartRate)} />}
                      {form.vitals.bloodPressure && <VitalReview label="BP" val={form.vitals.bloodPressure} unit="" alert={false} />}
                      {form.vitals.temperature && <VitalReview label="Temp" val={form.vitals.temperature} unit="°F" alert={isAbnormal('temperature', form.vitals.temperature)} />}
                      {form.vitals.oxygenSat && <VitalReview label="SpO2" val={form.vitals.oxygenSat} unit="%" alert={isAbnormal('oxygenSat', form.vitals.oxygenSat)} />}
                    </div>
                  </div>
                )}
                <div className="rounded-xl bg-primary-50/50 border border-primary-100 p-3.5">
                  <p className="text-xs text-primary-700 leading-relaxed">
                    Submitting this form will register the patient in the emergency queue. If trauma level is L1 or L2, all available emergency staff will be notified immediately.
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Navigation */}
          <div className="mt-5 flex items-center justify-between">
            <Button variant="outline" onClick={() => step === 0 ? navigate('/dashboard/emergency') : setStep(step - 1)}>
              <ArrowLeft className="h-4 w-4" /> {step === 0 ? 'Cancel' : 'Back'}
            </Button>
            {step < STEP_LABELS.length - 1 ? (
              <Button onClick={() => { if (validateStep()) setStep(step + 1); }}>
                Continue <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={submit} disabled={loading} className="bg-error-600 hover:bg-error-700">
                {loading ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> : <><UserPlus className="h-4 w-4" /> Register Emergency Case</>}
              </Button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function VitalReview({ label, val, unit, alert }) {
  return (
    <span className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold ${alert ? 'bg-error-100 text-error-700' : 'bg-neutral-100 text-neutral-700'}`}>
      {label}: {val}{unit} {alert && '⚠'}
    </span>
  );
}
