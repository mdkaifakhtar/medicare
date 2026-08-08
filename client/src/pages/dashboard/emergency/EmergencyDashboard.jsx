import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Siren, AlertTriangle, Activity, BedDouble, Ambulance, Phone, Radio,
  Clock, Users, CheckCircle, XCircle, ArrowUpRight, ChevronRight,
  Heart, Thermometer, Droplet, Wind, Zap, ShieldAlert, TrendingUp,
  AlertCircle, Stethoscope, UserPlus, Navigation, RefreshCcw,
} from 'lucide-react';
import { motion as m } from 'framer-motion';
import { Badge, Button, EmptyState, StatCard } from '../../../components/ui/index.jsx';
import { mockApi } from '../../../services/mockApi.js';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';

const TRAUMA_META = {
  'Level 1 Critical':   { color: 'error',   bg: 'bg-error-600',   ring: 'ring-error-500',   dot: 'bg-error-500',   label: 'L1 Critical' },
  'Level 2 Emergent':   { color: 'error',   bg: 'bg-error-500',   ring: 'ring-error-400',   dot: 'bg-error-400',   label: 'L2 Emergent' },
  'Level 3 Urgent':     { color: 'warning', bg: 'bg-warning-500', ring: 'ring-warning-400', dot: 'bg-warning-400', label: 'L3 Urgent' },
  'Level 4 Less Urgent':{ color: 'accent',  bg: 'bg-accent-500',  ring: 'ring-accent-400',  dot: 'bg-accent-400',  label: 'L4 Less Urgent' },
  'Level 5 Non-Urgent': { color: 'success', bg: 'bg-success-500', ring: 'ring-success-400', dot: 'bg-success-400',  label: 'L5 Non-Urgent' },
};

const STATUS_META = {
  waiting:         { label: 'Waiting',    variant: 'warning' },
  triaged:         { label: 'Triaged',    variant: 'info' },
  'under-treatment': { label: 'In Treatment', variant: 'error' },
  admitted:        { label: 'Admitted',   variant: 'success' },
  discharged:      { label: 'Discharged', variant: 'neutral' },
  transferred:     { label: 'Transferred', variant: 'neutral' },
  deceased:        { label: 'Deceased',   variant: 'error' },
};

function PulsingDot({ color = 'bg-error-500' }) {
  return (
    <span className="relative flex h-2.5 w-2.5">
      <span className={`absolute inline-flex h-full w-full animate-ping rounded-full ${color} opacity-75`} />
      <span className={`relative inline-flex h-2.5 w-2.5 rounded-full ${color}`} />
    </span>
  );
}

function VitalChip({ icon: Icon, value, label, alert }) {
  return (
    <div className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 ${alert ? 'bg-error-100 text-error-700' : 'bg-neutral-100 text-neutral-700'}`}>
      <Icon className="h-3.5 w-3.5 shrink-0" />
      <span className="text-xs font-semibold">{value}</span>
      <span className="text-[10px] text-neutral-400">{label}</span>
    </div>
  );
}

function CaseCard({ c, onStatusChange }) {
  const t = TRAUMA_META[c.traumaLevel] || TRAUMA_META['Level 3 Urgent'];
  const s = STATUS_META[c.status] || STATUS_META.waiting;
  const isAlert = c.traumaLevel === 'Level 1 Critical' || c.traumaLevel === 'Level 2 Emergent';
  const waitMins = c.arrivedAt ? Math.floor((Date.now() - new Date(c.arrivedAt)) / 60000) : 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className={`relative overflow-hidden rounded-2xl border p-4 transition-all duration-200 ${isAlert ? 'border-error-200 bg-error-50/40' : 'border-neutral-200 bg-white'}`}
    >
      {isAlert && <div className="absolute left-0 top-0 h-full w-1 rounded-l-2xl bg-error-500" />}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5">
          {isAlert && <PulsingDot />}
          <div>
            <p className="text-sm font-semibold text-neutral-900 leading-none">{c.patientName}</p>
            <p className="mt-0.5 text-xs text-neutral-500">{c.caseNumber} · {c.chiefComplaint}</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold text-white ${t.bg}`}>{t.label}</span>
          <Badge variant={s.variant} dot className="text-[10px]">{s.label}</Badge>
        </div>
      </div>
      {c.vitals && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          <VitalChip icon={Heart} value={`${c.vitals.heartRate || '—'}`} label="bpm" alert={c.vitals.heartRate > 100 || c.vitals.heartRate < 60} />
          <VitalChip icon={Activity} value={c.vitals.bloodPressure || '—'} label="BP" alert={false} />
          <VitalChip icon={Droplet} value={`${c.vitals.oxygenSat || '—'}%`} label="O2" alert={c.vitals.oxygenSat < 92} />
          <VitalChip icon={Thermometer} value={`${c.vitals.temperature || '—'}°`} label="F" alert={c.vitals.temperature > 100.4} />
        </div>
      )}
      <div className="mt-3 flex items-center justify-between">
        <span className="flex items-center gap-1 text-xs text-neutral-400"><Clock className="h-3 w-3" /> {waitMins}m wait</span>
        <div className="flex items-center gap-1.5">
          {c.assignedDoctorName && <span className="text-xs text-neutral-500">{c.assignedDoctorName}</span>}
          {onStatusChange && c.status === 'waiting' && (
            <button onClick={() => onStatusChange(c._id || c.id, 'triaged')} className="rounded-lg bg-primary-100 px-2.5 py-1 text-xs font-medium text-primary-700 hover:bg-primary-200 transition">
              Triage
            </button>
          )}
          {c.status === 'triaged' && onStatusChange && (
            <button onClick={() => onStatusChange(c._id || c.id, 'under-treatment')} className="rounded-lg bg-error-100 px-2.5 py-1 text-xs font-medium text-error-700 hover:bg-error-200 transition">
              Treat
            </button>
          )}
          <Link to="/dashboard/emergency/queue" className="grid h-7 w-7 place-items-center rounded-lg bg-neutral-100 text-neutral-500 hover:text-primary-600 transition">
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export default function EmergencyDashboard() {
  const { user } = useSelector((s) => s.auth);
  const [stats, setStats] = useState(null);
  const [cases, setCases] = useState([]);
  const [beds, setBeds] = useState([]);
  const [ambulances, setAmbulances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [sosActive, setSosActive] = useState(false);

  const load = useCallback(async () => {
    try {
      const [cData, bData, aData] = await Promise.all([
        mockApi.listEmergencyCases({ limit: 20 }).catch(() => ({ items: [] })),
        mockApi.listBeds({ limit: 100 }).catch(() => ({ items: [] })),
        mockApi.listAmbulances({ limit: 50 }).catch(() => ({ items: [] })),
      ]);
      const cItems = cData?.items || [];
      const bItems = bData?.items || [];
      const aItems = aData?.items || [];
      setCases(cItems);
      setBeds(bItems);
      setAmbulances(aItems);
      const critical = cItems.filter((c) => c.traumaLevel === 'Level 1 Critical').length;
      const emergent = cItems.filter((c) => c.traumaLevel === 'Level 2 Emergent').length;
      const waiting = cItems.filter((c) => c.status === 'waiting').length;
      const inTreatment = cItems.filter((c) => c.status === 'under-treatment').length;
      const icuBeds = bItems.filter((b) => b.ward === 'ICU' || b.type === 'ICU');
      const availICU = icuBeds.filter((b) => b.status === 'available').length;
      const totalICU = icuBeds.length;
      const availAmb = aItems.filter((a) => a.status === 'available').length;
      setStats({ critical, emergent, waiting, inTreatment, totalActive: cItems.filter((c) => !['discharged','transferred','deceased'].includes(c.status)).length, availICU, totalICU, availAmb, totalAmb: aItems.length });
      setLastRefresh(new Date());
    } catch { /* keep silent */ }
    setLoading(false);
  }, []);

  useEffect(() => { load(); const t = setInterval(load, 20000); return () => clearInterval(t); }, [load]);

  const handleStatusChange = async (id, status) => {
    try {
      await mockApi.updateEmergencyCase(id, { status });
      toast.success(`Case status updated to ${status}`);
      load();
    } catch { toast.error('Failed to update status'); }
  };

  const triggerSOS = () => {
    setSosActive(true);
    toast.error('SOS ALERT — Emergency Response Activated!', { duration: 5000, icon: '🚨' });
    setTimeout(() => setSosActive(false), 3000);
  };

  const activeCases = cases.filter((c) => !['discharged', 'transferred', 'deceased'].includes(c.status));
  const criticalCases = activeCases.filter((c) => c.traumaLevel === 'Level 1 Critical' || c.traumaLevel === 'Level 2 Emergent');
  const queueCases = activeCases.filter((c) => c.status === 'waiting' || c.status === 'triaged');

  const icuBeds = beds.filter((b) => b.ward === 'ICU' || b.type === 'ICU');
  const availICU = icuBeds.filter((b) => b.status === 'available');

  if (loading) return <DashboardSkeleton />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <PulsingDot color="bg-error-500" />
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Emergency · Live</span>
            <span className="text-xs text-neutral-400">Updated {lastRefresh.toLocaleTimeString()}</span>
          </div>
          <h1 className="mt-2 font-display text-2xl font-bold tracking-tight text-neutral-900">
            Emergency Command Center
          </h1>
          <p className="mt-0.5 text-sm text-neutral-500">Real-time monitoring of all emergency cases, beds, and resources</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={load} className="grid h-9 w-9 place-items-center rounded-xl border border-neutral-200 text-neutral-500 hover:text-primary-600 transition">
            <RefreshCcw className="h-4 w-4" />
          </button>
          <Link to="/dashboard/emergency/register">
            <Button variant="outline"><UserPlus className="h-4 w-4" /> Register Case</Button>
          </Link>
          <motion.button
            whileTap={{ scale: 0.95 }}
            animate={sosActive ? { scale: [1, 1.05, 1], boxShadow: ['0 0 0 0 rgba(239,68,68,0)', '0 0 0 20px rgba(239,68,68,0.3)', '0 0 0 0 rgba(239,68,68,0)'] } : {}}
            onClick={triggerSOS}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 font-semibold text-white transition-all duration-200 ${sosActive ? 'bg-error-700 shadow-lg shadow-error-500/40' : 'bg-error-600 hover:bg-error-700 shadow-sm hover:shadow-error-500/30'}`}
          >
            <Siren className={`h-4 w-4 ${sosActive ? 'animate-pulse' : ''}`} />
            SOS
          </motion.button>
        </div>
      </div>

      {/* KPI Strip */}
      <div className="grid gap-3 grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
        {[
          { label: 'Total Active', value: stats?.totalActive ?? 0, icon: Activity, color: 'primary', pulse: false },
          { label: 'Critical (L1)', value: stats?.critical ?? 0, icon: ShieldAlert, color: 'error', pulse: (stats?.critical ?? 0) > 0 },
          { label: 'Emergent (L2)', value: stats?.emergent ?? 0, icon: AlertTriangle, color: 'warning', pulse: false },
          { label: 'In Treatment', value: stats?.inTreatment ?? 0, icon: Stethoscope, color: 'accent', pulse: false },
          { label: 'ICU Available', value: `${stats?.availICU ?? 0}/${stats?.totalICU ?? 0}`, icon: BedDouble, color: (stats?.availICU ?? 0) === 0 ? 'error' : 'success', pulse: false },
          { label: 'Ambulances', value: `${stats?.availAmb ?? 0} free`, icon: Ambulance, color: 'secondary', pulse: false },
        ].map((k, i) => (
          <motion.div key={k.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} className="card p-4 card-hover group">
            <div className="flex items-center justify-between mb-3">
              <div className={`grid h-9 w-9 place-items-center rounded-lg bg-${k.color}-100${k.color}-900/30 text-${k.color}-600${k.color}-400 transition-transform group-hover:scale-110`}>
                <k.icon className="h-4.5 w-4.5" />
              </div>
              {k.pulse && <PulsingDot />}
            </div>
            <p className="font-display text-2xl font-bold tracking-tight text-neutral-900">{k.value}</p>
            <p className="mt-0.5 text-xs text-neutral-500">{k.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Critical Banner */}
      <AnimatePresence>
        {criticalCases.length > 0 && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="relative overflow-hidden rounded-2xl border border-error-200 bg-error-50/50 p-4">
            <div className="absolute right-0 top-0 h-full w-1 bg-error-500" />
            <div className="flex flex-wrap items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-error-100 text-error-600 shrink-0">
                <ShieldAlert className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-error-800">{criticalCases.length} CRITICAL CASE{criticalCases.length > 1 ? 'S' : ''} — Immediate attention required</p>
                <div className="mt-1.5 flex flex-wrap gap-2">
                  {criticalCases.map((c) => (
                    <span key={c._id || c.id} className="rounded-lg bg-error-100 px-2.5 py-0.5 text-xs font-medium text-error-700">
                      {c.caseNumber} · {c.patientName}
                    </span>
                  ))}
                </div>
              </div>
              <Link to="/dashboard/emergency/queue" className="shrink-0">
                <Button variant="danger" size="sm">View Queue <ArrowUpRight className="h-3.5 w-3.5" /></Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main grid: Live Queue + Side panels */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Live Queue — 8 cols */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-base font-semibold text-neutral-900 flex items-center gap-2">
              <Radio className="h-4.5 w-4.5 text-error-500" /> Live Queue
              <span className="rounded-full bg-error-500 px-1.5 py-0.5 text-[10px] font-bold text-white">{queueCases.length}</span>
            </h2>
            <Link to="/dashboard/emergency/queue" className="text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center gap-1">Full queue <ArrowUpRight className="h-3.5 w-3.5" /></Link>
          </div>

          {activeCases.length === 0 ? (
            <div className="card p-10 text-center">
              <CheckCircle className="mx-auto h-10 w-10 text-success-500" />
              <p className="mt-3 font-display text-base font-semibold text-neutral-900">Emergency Room Clear</p>
              <p className="mt-1 text-sm text-neutral-500">No active emergency cases at this time.</p>
              <Link to="/dashboard/emergency/register" className="btn-primary mt-4 inline-flex"><UserPlus className="h-4 w-4" /> Register New Case</Link>
            </div>
          ) : (
            <div className="space-y-3">
              <AnimatePresence>
                {[...activeCases]
                  .sort((a, b) => {
                    const order = { 'Level 1 Critical': 0, 'Level 2 Emergent': 1, 'Level 3 Urgent': 2, 'Level 4 Less Urgent': 3, 'Level 5 Non-Urgent': 4 };
                    return (order[a.traumaLevel] ?? 3) - (order[b.traumaLevel] ?? 3);
                  })
                  .slice(0, 8)
                  .map((c) => (
                    <CaseCard key={c._id || c.id} c={c} onStatusChange={handleStatusChange} />
                  ))
                }
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Right column — 4 cols */}
        <div className="lg:col-span-4 space-y-5">
          {/* ICU Status */}
          <div className="card p-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-sm font-semibold text-neutral-900 flex items-center gap-2"><BedDouble className="h-4.5 w-4.5 text-primary-500" /> ICU Beds</h3>
              <Link to="/dashboard/emergency/beds" className="text-xs font-medium text-primary-600">View all</Link>
            </div>
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="rounded-xl bg-success-50/50 p-3 text-center">
                <p className="font-display text-2xl font-bold text-success-700">{availICU.length}</p>
                <p className="text-xs text-success-600">Available</p>
              </div>
              <div className="rounded-xl bg-error-50/50 p-3 text-center">
                <p className="font-display text-2xl font-bold text-error-700">{icuBeds.length - availICU.length}</p>
                <p className="text-xs text-error-600">Occupied</p>
              </div>
            </div>
            {icuBeds.length > 0 && (
              <div className="h-2 rounded-full bg-neutral-100 overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${((icuBeds.length - availICU.length) / icuBeds.length) * 100}%` }} transition={{ duration: 0.6 }} className={`h-full rounded-full ${availICU.length === 0 ? 'bg-error-500' : availICU.length <= 2 ? 'bg-warning-500' : 'bg-success-500'}`} />
              </div>
            )}
            {icuBeds.length === 0 && <p className="text-xs text-center text-neutral-400 py-2">ICU bed data unavailable</p>}
          </div>

          {/* Ambulance Status */}
          <div className="card p-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-sm font-semibold text-neutral-900 flex items-center gap-2"><Ambulance className="h-4.5 w-4.5 text-secondary-500" /> Ambulances</h3>
              <Link to="/dashboard/emergency/ambulances" className="text-xs font-medium text-primary-600">Track all</Link>
            </div>
            <div className="space-y-2">
              {ambulances.length === 0 ? <p className="py-3 text-center text-xs text-neutral-400">Ambulance data unavailable</p> :
                ambulances.slice(0, 4).map((a) => (
                  <div key={a._id || a.id} className="flex items-center gap-3 rounded-xl border border-neutral-100 p-2.5 card-hover">
                    <div className={`grid h-8 w-8 place-items-center rounded-lg ${a.status === 'available' ? 'bg-success-100 text-success-600' : a.status === 'on-call' ? 'bg-error-100 text-error-600' : 'bg-neutral-100 text-neutral-500'}`}>
                      <Ambulance className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-neutral-900 truncate">{a.vehicleNumber || a.vehicleNo}</p>
                      <p className="text-[10px] text-neutral-500">{a.driver || 'No driver'}</p>
                    </div>
                    <Badge variant={a.status === 'available' ? 'success' : a.status === 'on-call' ? 'error' : 'warning'} dot className="text-[10px] shrink-0">{a.status}</Badge>
                  </div>
                ))
              }
            </div>
          </div>

          {/* Emergency Contacts */}
          <div className="card p-5">
            <h3 className="font-display text-sm font-semibold text-neutral-900 flex items-center gap-2 mb-4"><Phone className="h-4.5 w-4.5 text-error-500" /> Emergency Contacts</h3>
            <div className="space-y-2">
              {[
                { label: 'Emergency Hotline', number: '1066', color: 'error' },
                { label: 'Police', number: '100', color: 'primary' },
                { label: 'Fire & Rescue', number: '101', color: 'warning' },
                { label: 'Ambulance', number: '108', color: 'success' },
              ].map((c) => (
                <a key={c.label} href={`tel:${c.number}`} className="flex items-center justify-between rounded-xl border border-neutral-100 px-3 py-2.5 hover:bg-neutral-50 transition group">
                  <span className="text-sm text-neutral-700">{c.label}</span>
                  <span className={`font-display text-base font-bold text-${c.color}-600${c.color}-400 flex items-center gap-1 group-hover:gap-2 transition-all`}>
                    {c.number} <Phone className="h-3.5 w-3.5" />
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card p-5">
            <h3 className="font-display text-sm font-semibold text-neutral-900 mb-3">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                { to: '/dashboard/emergency/register', icon: UserPlus, label: 'Register', color: 'error' },
                { to: '/dashboard/emergency/queue', icon: Radio, label: 'Live Queue', color: 'warning' },
                { to: '/dashboard/emergency/ambulances', icon: Ambulance, label: 'Dispatch', color: 'secondary' },
                { to: '/dashboard/emergency/beds', icon: BedDouble, label: 'Beds', color: 'primary' },
              ].map((a) => (
                <Link key={a.to} to={a.to} className="flex flex-col items-center gap-1.5 rounded-xl border border-neutral-100 p-3.5 card-hover group text-center">
                  <div className={`grid h-10 w-10 place-items-center rounded-xl bg-${a.color}-100${a.color}-900/30 text-${a.color}-600${a.color}-400 transition-transform group-hover:scale-110`}>
                    <a.icon className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-medium text-neutral-700">{a.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="skeleton h-10 w-72" />
      <div className="grid gap-3 grid-cols-2 md:grid-cols-6">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="skeleton h-24" />)}</div>
      <div className="grid gap-6 lg:grid-cols-12"><div className="skeleton h-96 lg:col-span-8" /><div className="skeleton h-96 lg:col-span-4" /></div>
    </div>
  );
}
