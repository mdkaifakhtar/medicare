import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity, Heart, Thermometer, Droplet, Clock, User, AlertCircle,
  Stethoscope, ClipboardList, Bell, Plus, Send, ShieldAlert, BedDouble,
  Wind, ChevronRight, TrendingUp, TrendingDown, Minus,
} from 'lucide-react';
import { Badge, Button, Modal } from '../../components/ui/index.jsx';
import { mockApi } from '../../services/mockApi.js';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';

export default function NurseDashboard() {
  const { user } = useSelector((s) => s.auth);
  const [assignments, setAssignments] = useState([]);
  const [vitals, setVitals] = useState([]);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [vitalsModal, setVitalsModal] = useState(null);
  const [noteModal, setNoteModal] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [vitalsForm, setVitalsForm] = useState({ heartRate: '', bloodPressure: '', temperature: '', oxygenSat: '', respiratoryRate: '', notes: '' });
  const [noteForm, setNoteForm] = useState({ note: '', type: 'observation', severity: 'normal' });

  const load = () => {
    setLoading(true);
    Promise.all([
      mockApi.listNurseAssignments({ limit: 50 }),
      mockApi.listVitals({ limit: 50 }),
      mockApi.listNurseNotes({ limit: 50 }),
    ]).then(([a, v, n]) => {
      setAssignments(a.items); setVitals(v.items); setNotes(n.items); setLoading(false);
    });
  };
  useEffect(load, []);

  const recordVitals = async () => {
    await mockApi.recordVitals({
      patientId: vitalsModal.patientId, patientName: vitalsModal.patientName,
      heartRate: Number(vitalsForm.heartRate), bloodPressure: vitalsForm.bloodPressure,
      temperature: Number(vitalsForm.temperature), oxygenSat: Number(vitalsForm.oxygenSat),
      respiratoryRate: Number(vitalsForm.respiratoryRate) || 18, notes: vitalsForm.notes,
    }, { id: user?.id, name: user?.name, role: user?.role });
    toast.success('Vitals recorded — doctor notified if abnormal');
    setVitalsModal(null); setVitalsForm({ heartRate: '', bloodPressure: '', temperature: '', oxygenSat: '', respiratoryRate: '', notes: '' });
    load();
  };

  const addNote = async () => {
    await mockApi.addNurseNote({
      patientId: noteModal.patientId, patientName: noteModal.patientName,
      note: noteForm.note, type: noteForm.type, severity: noteForm.severity,
    }, { id: user?.id, name: user?.name, role: user?.role });
    toast.success('Note added to patient record');
    setNoteModal(null); setNoteForm({ note: '', type: 'observation', severity: 'normal' });
    load();
  };

  const myPatients = assignments.filter((a) => a.nurseId === user?.id || a.nurseName === user?.name);
  const emergencyAlerts = vitals.filter((v) => v.heartRate > 100 || v.heartRate < 60 || v.oxygenSat < 92);
  const recentVitals = vitals.slice(0, 8);

  const vitalsTrend = (val, normal) => {
    if (val > normal) return 'up';
    if (val < normal) return 'down';
    return 'stable';
  };

  return (
    <div className="space-y-6">
      {/* Header — monitoring station style */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-secondary-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-secondary-500" />
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Monitoring Station · Active</span>
          </div>
          <h1 className="mt-2 font-display text-2xl font-bold tracking-tight text-neutral-900">
            Nurse Station, {user?.name?.split(' ')[0]}
          </h1>
          <p className="mt-1 text-sm text-neutral-500">Patient monitoring & care tasks for today</p>
        </div>
        <div className="flex gap-2">
          <div className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-3 py-2">
            <BedDouble className="h-4 w-4 text-secondary-500" />
            <span className="text-xs font-medium text-neutral-600">{myPatients.length} patients</span>
          </div>
        </div>
      </div>

      {/* Vital signs summary strip — 4 compact metric tiles */}
      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
        {[
          { icon: Heart, label: 'Heart Rate', value: recentVitals[0]?.heartRate || '—', unit: 'bpm', normal: '60-100', trend: recentVitals[0] ? vitalsTrend(recentVitals[0].heartRate, 80) : 'stable', color: 'error' },
          { icon: Activity, label: 'Blood Pressure', value: recentVitals[0]?.bloodPressure || '—', unit: 'mmHg', normal: '120/80', trend: 'stable', color: 'primary' },
          { icon: Thermometer, label: 'Temperature', value: recentVitals[0]?.temperature ? `${recentVitals[0].temperature}°` : '—', unit: 'F', normal: '97-99', trend: recentVitals[0] ? vitalsTrend(recentVitals[0].temperature, 98.6) : 'stable', color: 'warning' },
          { icon: Droplet, label: 'Oxygen Sat', value: recentVitals[0]?.oxygenSat ? `${recentVitals[0].oxygenSat}%` : '—', unit: 'SpO2', normal: '95-100', trend: recentVitals[0] ? vitalsTrend(recentVitals[0].oxygenSat, 98) : 'stable', color: 'secondary' },
        ].map((v, i) => {
          const TrendIcon = v.trend === 'up' ? TrendingUp : v.trend === 'down' ? TrendingDown : Minus;
          const trendColor = v.trend === 'stable' ? 'text-neutral-400' : v.trend === 'up' ? 'text-error-500' : 'text-primary-500';
          return (
            <motion.div key={v.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="card p-4 card-hover group">
              <div className="flex items-center justify-between mb-3">
                <div className={`grid h-9 w-9 place-items-center rounded-lg bg-${v.color}-100${v.color}-900/30 text-${v.color}-600${v.color}-400 transition-transform group-hover:scale-110`}>
                  <v.icon className="h-4.5 w-4.5" />
                </div>
                <TrendIcon className={`h-4 w-4 ${trendColor}`} />
              </div>
              <p className="font-display text-2xl font-bold tracking-tight text-neutral-900">{v.value}</p>
              <p className="mt-0.5 text-xs text-neutral-500">{v.label} · {v.unit}</p>
              <p className="mt-1 text-[10px] text-neutral-400">Normal: {v.normal}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Emergency alerts — prominent banner */}
      {emergencyAlerts.length > 0 && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="relative overflow-hidden rounded-2xl border border-error-200 bg-error-50/50 p-5">
          <div className="absolute right-0 top-0 h-full w-1 bg-error-500" />
          <div className="flex items-center gap-3 mb-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-error-100 text-error-600">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-error-800">{emergencyAlerts.length} emergency alert{emergencyAlerts.length > 1 ? 's' : ''} — abnormal vitals</p>
              <p className="text-xs text-error-600">Attending doctors have been notified automatically</p>
            </div>
          </div>
          <div className="space-y-2">
            {emergencyAlerts.slice(0, 4).map((v) => (
              <div key={v.id} className="flex items-center justify-between rounded-xl bg-white p-3 border border-error-100">
                <div className="flex items-center gap-3">
                  <div className="grid h-8 w-8 place-items-center rounded-lg bg-error-100 text-error-600 text-xs font-bold">{v.patientName?.[0]}</div>
                  <div>
                    <p className="text-sm font-medium text-neutral-900">{v.patientName}</p>
                    <p className="text-xs text-neutral-500">{new Date(v.recordedAt).toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="flex items-center gap-1 text-error-600"><Heart className="h-3 w-3" /> {v.heartRate}</span>
                  <span className="flex items-center gap-1 text-neutral-500"><Activity className="h-3 w-3" /> {v.bloodPressure}</span>
                  <span className="flex items-center gap-1 text-error-600"><Droplet className="h-3 w-3" /> {v.oxygenSat}%</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Two-column: Patient cards + Activity feed */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Patient monitoring cards — 7 cols */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-base font-semibold text-neutral-900">Assigned Patients</h2>
            <Badge variant="secondary" dot>{myPatients.length} active</Badge>
          </div>
          {myPatients.length === 0 ? (
            <div className="card p-8 text-center">
              <User className="mx-auto h-10 w-10 text-neutral-300" />
              <p className="mt-3 text-sm text-neutral-500">No patients currently assigned.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {myPatients.map((a, i) => {
                const patientVitals = vitals.filter((v) => v.patientId === a.patientId || v.patientName === a.patientName);
                const latest = patientVitals[0];
                const hasAlert = latest && (latest.heartRate > 100 || latest.heartRate < 60 || latest.oxygenSat < 92);
                return (
                  <motion.div key={a.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                    className={`card p-5 card-hover ${hasAlert ? 'border-error-200' : ''}`}>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`grid h-11 w-11 place-items-center rounded-xl text-sm font-bold ${hasAlert ? 'bg-error-100 text-error-600' : 'bg-secondary-100 text-secondary-600'}`}>
                          {a.patientName?.[0]}
                        </div>
                        <div>
                          <p className="font-medium text-neutral-900">{a.patientName}</p>
                          <p className="text-xs text-neutral-500">{a.ward} · Bed {a.bedNumber} · {a.shift} shift</p>
                        </div>
                      </div>
                      {hasAlert ? <Badge variant="error" dot>Alert</Badge> : <Badge variant="success" dot>Stable</Badge>}
                    </div>

                    {/* Latest vitals mini-grid */}
                    {latest && (
                      <div className="mb-4 grid grid-cols-4 gap-2">
                        {[
                          { icon: Heart, val: latest.heartRate, label: 'HR', color: 'error' },
                          { icon: Activity, val: latest.bloodPressure, label: 'BP', color: 'primary' },
                          { icon: Thermometer, val: `${latest.temperature}°`, label: 'Temp', color: 'warning' },
                          { icon: Droplet, val: `${latest.oxygenSat}%`, label: 'O2', color: 'secondary' },
                        ].map((v) => (
                          <div key={v.label} className="rounded-lg bg-neutral-50 p-2.5 text-center">
                            <v.icon className={`mx-auto h-3.5 w-3.5 text-${v.color}-500 mb-1`} />
                            <p className="text-sm font-semibold text-neutral-900">{v.val}</p>
                            <p className="text-[10px] text-neutral-400">{v.label}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Doctor instructions */}
                    <div className="rounded-xl bg-primary-50/40 border border-primary-100/60 p-3 mb-3">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-primary-600 mb-1">Doctor Orders — {a.doctorName}</p>
                      <p className="text-sm text-neutral-700">{a.instructions}</p>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => setVitalsModal(a)}><Activity className="h-3.5 w-3.5" /> Record Vitals</Button>
                      <Button size="sm" variant="outline" onClick={() => setNoteModal(a)}><ClipboardList className="h-3.5 w-3.5" /> Add Note</Button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* Activity feed — 5 cols */}
        <div className="lg:col-span-5 space-y-6">
          {/* Recent vitals feed */}
          <div className="card p-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-sm font-semibold text-neutral-900">Recent Vitals</h3>
              <Clock className="h-4 w-4 text-neutral-400" />
            </div>
            {recentVitals.length === 0 ? <p className="py-6 text-center text-sm text-neutral-400">No vitals recorded yet.</p> : (
              <div className="space-y-2">
                {recentVitals.map((v, i) => (
                  <motion.div key={v.id} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                    className="flex items-center gap-3 rounded-xl border border-neutral-100 p-3 card-hover">
                    <div className="grid h-8 w-8 place-items-center rounded-lg bg-neutral-100 text-xs font-bold text-neutral-600">{v.patientName?.[0]}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-neutral-900 truncate">{v.patientName}</p>
                      <div className="flex items-center gap-2 text-xs text-neutral-500">
                        <span className="flex items-center gap-0.5"><Heart className="h-3 w-3 text-error-500" />{v.heartRate}</span>
                        <span className="flex items-center gap-0.5"><Droplet className="h-3 w-3 text-secondary-500" />{v.oxygenSat}%</span>
                        <span className="flex items-center gap-0.5"><Thermometer className="h-3 w-3 text-warning-500" />{v.temperature}°</span>
                      </div>
                    </div>
                    <span className="text-[10px] text-neutral-400 shrink-0">{new Date(v.recordedAt).toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' })}</span>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Nursing notes feed */}
          <div className="card p-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-sm font-semibold text-neutral-900">Nursing Notes</h3>
              <ClipboardList className="h-4 w-4 text-neutral-400" />
            </div>
            {notes.length === 0 ? <p className="py-6 text-center text-sm text-neutral-400">No notes yet.</p> : (
              <div className="space-y-2">
                {notes.slice(0, 6).map((n, i) => (
                  <motion.div key={n.id} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                    className={`rounded-xl border p-3 ${n.severity === 'critical' ? 'border-error-200/60 bg-error-50/30' : n.severity === 'warning' ? 'border-warning-200/60 bg-warning-50/30' : 'border-neutral-100'}`}>
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-neutral-900">{n.patientName}</p>
                      <Badge variant={n.severity === 'critical' ? 'error' : n.severity === 'warning' ? 'warning' : 'neutral'}>{n.type}</Badge>
                    </div>
                    <p className="text-sm text-neutral-600">{n.note}</p>
                    <p className="mt-1 text-xs text-neutral-400">{n.nurseName} · {new Date(n.createdAt).toLocaleString()}</p>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Record Vitals Modal */}
      <Modal open={!!vitalsModal} onClose={() => setVitalsModal(null)} title={`Record Vitals — ${vitalsModal?.patientName || ''}`}>
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div><label className="label">Heart Rate (bpm)</label><input type="number" required value={vitalsForm.heartRate} onChange={(e) => setVitalsForm({ ...vitalsForm, heartRate: e.target.value })} className="input" placeholder="72" /></div>
            <div><label className="label">Blood Pressure</label><input required value={vitalsForm.bloodPressure} onChange={(e) => setVitalsForm({ ...vitalsForm, bloodPressure: e.target.value })} className="input" placeholder="120/80" /></div>
            <div><label className="label">Temperature (°F)</label><input type="number" step="0.1" required value={vitalsForm.temperature} onChange={(e) => setVitalsForm({ ...vitalsForm, temperature: e.target.value })} className="input" placeholder="98.6" /></div>
            <div><label className="label">Oxygen Sat (%)</label><input type="number" required value={vitalsForm.oxygenSat} onChange={(e) => setVitalsForm({ ...vitalsForm, oxygenSat: e.target.value })} className="input" placeholder="98" /></div>
            <div><label className="label">Respiratory Rate</label><input type="number" value={vitalsForm.respiratoryRate} onChange={(e) => setVitalsForm({ ...vitalsForm, respiratoryRate: e.target.value })} className="input" placeholder="18" /></div>
          </div>
          <div><label className="label">Notes</label><textarea rows={2} value={vitalsForm.notes} onChange={(e) => setVitalsForm({ ...vitalsForm, notes: e.target.value })} className="input" placeholder="Patient stable..." /></div>
          <div className="rounded-xl bg-secondary-50 p-3 text-xs text-secondary-700 flex items-start gap-2">
            <Wind className="h-4 w-4 shrink-0 mt-0.5" />
            <span>If any vitals are abnormal (HR &gt;100 or &lt;60, O2 &lt;92%), the attending doctor will be automatically alerted.</span>
          </div>
          <div className="flex justify-end gap-2"><Button variant="outline" onClick={() => setVitalsModal(null)}>Cancel</Button><Button onClick={recordVitals}><Send className="h-4 w-4" /> Save & Sync</Button></div>
        </div>
      </Modal>

      {/* Add Note Modal */}
      <Modal open={!!noteModal} onClose={() => setNoteModal(null)} title={`Add Note — ${noteModal?.patientName || ''}`}>
        <div className="space-y-4">
          <div><label className="label">Note Type</label><select value={noteForm.type} onChange={(e) => setNoteForm({ ...noteForm, type: e.target.value })} className="input">{['observation','procedure','medication','incident','handover'].map((t) => <option key={t}>{t}</option>)}</select></div>
          <div><label className="label">Severity</label><select value={noteForm.severity} onChange={(e) => setNoteForm({ ...noteForm, severity: e.target.value })} className="input">{['normal','warning','critical'].map((s) => <option key={s}>{s}</option>)}</select></div>
          <div><label className="label">Note</label><textarea rows={4} required value={noteForm.note} onChange={(e) => setNoteForm({ ...noteForm, note: e.target.value })} className="input" placeholder="Patient complains of..." /></div>
          <div className="flex justify-end gap-2"><Button variant="outline" onClick={() => setNoteModal(null)}>Cancel</Button><Button onClick={addNote}><Plus className="h-4 w-4" /> Add Note</Button></div>
        </div>
      </Modal>
    </div>
  );
}
