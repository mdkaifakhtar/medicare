import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Ambulance, Radio, Navigation, Phone, User, Clock, MapPin, RefreshCcw,
  Wrench, CheckCircle, XCircle, AlertCircle, Send, Activity,
  Siren, ChevronRight, ShieldCheck, UserPlus,
} from 'lucide-react';
import { PageHeader, StatCard, Badge, Button, Modal, EmptyState } from '../../../components/ui/index.jsx';
import { mockApi } from '../../../services/mockApi.js';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';

const STATUS_META = {
  available: {
    label: 'Available',     variant: 'success', dot: 'bg-success-500', badge: 'success',
    icon: CheckCircle,      iconColor: 'text-success-600',
    bg: 'bg-success-50', border: 'border-success-200',
  },
  'on-call': {
    label: 'On Call',       variant: 'error',   dot: 'bg-error-500',   badge: 'error',
    icon: Siren,            iconColor: 'text-error-600',
    bg: 'bg-error-50/50', border: 'border-error-200',
  },
  maintenance: {
    label: 'Maintenance',   variant: 'warning', dot: 'bg-warning-500', badge: 'warning',
    icon: Wrench,           iconColor: 'text-warning-600',
    bg: 'bg-warning-50/50', border: 'border-warning-200',
  },
  offline: {
    label: 'Offline',       variant: 'neutral', dot: 'bg-neutral-400', badge: 'neutral',
    icon: XCircle,          iconColor: 'text-neutral-400',
    bg: 'bg-neutral-50', border: 'border-neutral-200',
  },
};

const AMBULANCE_TYPES = { Advanced: 'ALS', Basic: 'BLS', Cardiac: 'CCU', Neonatal: 'NICU', ALS: 'ALS', BLS: 'BLS' };

function PulsingDot({ color = 'bg-error-500' }) {
  return (
    <span className="relative flex h-2.5 w-2.5 shrink-0">
      <span className={`absolute inline-flex h-full w-full animate-ping rounded-full ${color} opacity-75`} />
      <span className={`relative inline-flex h-2.5 w-2.5 rounded-full ${color}`} />
    </span>
  );
}

function AmbulanceCard({ amb, onDispatch, onUpdate }) {
  const meta = STATUS_META[amb.status] || STATUS_META.available;
  const Icon = meta.icon;
  const isOnCall = amb.status === 'on-call';
  const typeLabel = AMBULANCE_TYPES[amb.type] || amb.type || '—';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className={`card p-5 card-hover border ${meta.border}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`grid h-12 w-12 place-items-center rounded-2xl ${meta.bg} border ${meta.border}`}>
            <Ambulance className={`h-6 w-6 ${meta.iconColor}`} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              {isOnCall && <PulsingDot color="bg-error-500" />}
              <p className="font-mono text-sm font-bold text-neutral-900">{amb.vehicleNumber || amb.vehicleNo}</p>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="rounded-md bg-neutral-100 px-1.5 py-0.5 text-[10px] font-semibold text-neutral-600">{typeLabel}</span>
              <Badge variant={meta.badge} dot>{meta.label}</Badge>
            </div>
          </div>
        </div>
        <div className="flex gap-1">
          <button onClick={() => onUpdate(amb)} className="grid h-8 w-8 place-items-center rounded-lg border border-neutral-200 text-neutral-400 hover:text-primary-600 transition">
            <Wrench className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Driver info */}
      <div className="space-y-2 text-sm mb-4">
        {amb.driver ? (
          <div className="flex items-center gap-2 text-neutral-600">
            <User className="h-3.5 w-3.5 text-neutral-400 shrink-0" /> {amb.driver}
          </div>
        ) : <p className="text-xs text-neutral-400 italic">No driver assigned</p>}
        {amb.driverPhone && (
          <div className="flex items-center gap-2 text-neutral-600">
            <Phone className="h-3.5 w-3.5 text-neutral-400 shrink-0" />
            <a href={`tel:${amb.driverPhone}`} className="hover:text-primary-600 transition">{amb.driverPhone}</a>
          </div>
        )}
        <div className="flex items-center gap-2 text-neutral-500">
          <MapPin className="h-3.5 w-3.5 text-neutral-400 shrink-0" /> {amb.currentLocation || amb.location || 'Location unknown'}
        </div>
        {amb.lastServiceDate && (
          <div className="flex items-center gap-2 text-neutral-400 text-xs">
            <Clock className="h-3.5 w-3.5 shrink-0" /> Last service: {new Date(amb.lastServiceDate).toLocaleDateString()}
          </div>
        )}
      </div>

      {/* Live mission info */}
      {isOnCall && (
        <div className="rounded-xl bg-error-50/60 border border-error-200 p-3 mb-4">
          <p className="text-xs font-semibold text-error-700 flex items-center gap-1.5">
            <Activity className="h-3.5 w-3.5" /> Active Dispatch — Mission in Progress
          </p>
          <p className="text-xs text-error-600 mt-0.5">Returning to base or at scene</p>
        </div>
      )}

      {/* Action button */}
      {amb.status === 'available' && (
        <Button onClick={() => onDispatch(amb)} className="w-full justify-center bg-error-600 hover:bg-error-700 text-white">
          <Send className="h-4 w-4" /> Dispatch
        </Button>
      )}
      {amb.status === 'on-call' && (
        <button onClick={() => onUpdate({ ...amb, status: 'available' })} className="w-full rounded-xl border border-success-300 py-2.5 text-sm font-medium text-success-700 hover:bg-success-50 transition">
          <CheckCircle className="inline h-4 w-4 mr-1.5" /> Mark Returned
        </button>
      )}
      {amb.status === 'maintenance' && (
        <button onClick={() => onUpdate({ ...amb, status: 'available' })} className="w-full rounded-xl border border-success-300 py-2.5 text-sm font-medium text-success-700 hover:bg-success-50 transition">
          <CheckCircle className="inline h-4 w-4 mr-1.5" /> Mark Operational
        </button>
      )}
    </motion.div>
  );
}

export default function EmergencyAmbulances() {
  const { user } = useSelector((s) => s.auth);
  const [ambulances, setAmbulances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [dispatchTarget, setDispatchTarget] = useState(null);
  const [updateTarget, setUpdateTarget] = useState(null);
  const [dispatchForm, setDispatchForm] = useState({ destination: '', missionType: 'Patient Pickup', notes: '' });
  const [updateForm, setUpdateForm] = useState({ status: 'available', driver: '', driverPhone: '', currentLocation: '' });
  const [filterStatus, setFilterStatus] = useState('all');

  const load = useCallback(async () => {
    try {
      const r = await mockApi.listAmbulances({ limit: 50 });
      setAmbulances(r?.items || []);
      setLastRefresh(new Date());
    } catch { /* silent */ }
    setLoading(false);
  }, []);

  useEffect(() => { load(); const t = setInterval(load, 20000); return () => clearInterval(t); }, [load]);

  const doDispatch = async () => {
    if (!dispatchTarget) return;
    try {
      await mockApi.updateAmbulance(dispatchTarget._id || dispatchTarget.id, { status: 'on-call', currentLocation: dispatchForm.destination || 'Dispatched' }, { id: user?.id, name: user?.name, role: user?.role });
      toast.success(`${dispatchTarget.vehicleNumber || dispatchTarget.vehicleNo} dispatched`);
      setDispatchTarget(null);
      load();
    } catch { toast.error('Dispatch failed'); }
  };

  const doUpdate = async (amb) => {
    try {
      await mockApi.updateAmbulance(amb._id || amb.id, { status: amb.status, driver: amb.driver, driverPhone: amb.driverPhone, currentLocation: amb.currentLocation }, { id: user?.id, name: user?.name, role: user?.role });
      toast.success('Ambulance status updated');
      setUpdateTarget(null);
      load();
    } catch { toast.error('Update failed'); }
  };

  const openUpdate = (amb) => {
    setUpdateTarget(amb);
    setUpdateForm({ status: amb.status, driver: amb.driver || '', driverPhone: amb.driverPhone || '', currentLocation: amb.currentLocation || amb.location || '' });
  };

  const filtered = filterStatus === 'all' ? ambulances : ambulances.filter((a) => a.status === filterStatus);

  const counts = {
    total: ambulances.length,
    available: ambulances.filter((a) => a.status === 'available').length,
    onCall: ambulances.filter((a) => a.status === 'on-call').length,
    maintenance: ambulances.filter((a) => a.status === 'maintenance').length,
  };

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Radio className="h-4 w-4 text-error-500" />
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Emergency · Fleet Management</span>
          </div>
          <h1 className="mt-1.5 font-display text-2xl font-bold text-neutral-900">Ambulance Tracking</h1>
          <p className="text-sm text-neutral-500">Live fleet status. Last updated {lastRefresh.toLocaleTimeString()}</p>
        </div>
        <button onClick={load} className="flex items-center gap-2 rounded-xl border border-neutral-200 px-3.5 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-50 transition">
          <RefreshCcw className="h-4 w-4" /> Refresh
        </button>
      </div>

      {/* Stats strip */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard icon={Ambulance} label="Total Fleet" value={counts.total} color="primary" delay={0} />
        <StatCard icon={CheckCircle} label="Available" value={counts.available} color="success" delay={0.05} />
        <StatCard icon={Siren} label="On Call" value={counts.onCall} color="error" delay={0.1} />
        <StatCard icon={Wrench} label="Maintenance" value={counts.maintenance} color="warning" delay={0.15} />
      </div>

      {/* Filter tabs */}
      <div className="mb-6 flex flex-wrap gap-1.5">
        {[
          { key: 'all', label: `All (${counts.total})` },
          { key: 'available', label: `Available (${counts.available})` },
          { key: 'on-call', label: `On Call (${counts.onCall})` },
          { key: 'maintenance', label: `Maintenance (${counts.maintenance})` },
        ].map((tab) => (
          <button key={tab.key} onClick={() => setFilterStatus(tab.key)} className={`rounded-xl px-3.5 py-2 text-sm font-medium transition ${filterStatus === tab.key ? 'bg-neutral-900 text-white shadow-sm' : 'bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50'}`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Ambulance cards */}
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton h-64" />)}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState icon={Ambulance} title="No ambulances found" description="No ambulances match the current filter." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence>
            {filtered.map((amb) => (
              <AmbulanceCard key={amb._id || amb.id} amb={amb} onDispatch={setDispatchTarget} onUpdate={openUpdate} />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Live Map placeholder */}
      <div className="mt-8 card overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100">
          <h3 className="font-display text-base font-semibold text-neutral-900">Fleet Overview</h3>
          <Badge variant="success" dot>Live</Badge>
        </div>
        <div className="grid gap-3 p-5 sm:grid-cols-2 lg:grid-cols-3">
          {ambulances.map((amb) => {
            const meta = STATUS_META[amb.status] || STATUS_META.available;
            return (
              <div key={amb._id || amb.id} className={`flex items-center gap-3 rounded-xl border p-3.5 ${meta.border} ${meta.bg}`}>
                <div className={`grid h-9 w-9 place-items-center rounded-xl ${meta.bg} border ${meta.border}`}>
                  <Ambulance className={`h-4.5 w-4.5 ${meta.iconColor}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-mono text-sm font-bold text-neutral-900">{amb.vehicleNumber || amb.vehicleNo}</p>
                  <p className="text-xs text-neutral-500 truncate">{amb.currentLocation || amb.location || 'Base'}</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={`h-2 w-2 rounded-full ${meta.dot}`} />
                  <span className="text-xs font-medium text-neutral-600">{meta.label}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dispatch Modal */}
      <Modal open={!!dispatchTarget} onClose={() => setDispatchTarget(null)} title={`Dispatch — ${dispatchTarget?.vehicleNumber || dispatchTarget?.vehicleNo}`}>
        <div className="space-y-4">
          <div className="rounded-xl bg-error-50/60 border border-error-200 p-4">
            <div className="flex items-center gap-2 text-error-700">
              <AlertCircle className="h-4.5 w-4.5 shrink-0" />
              <p className="text-sm font-semibold">Dispatching {dispatchTarget?.vehicleNumber || dispatchTarget?.vehicleNo} — Driver: {dispatchTarget?.driver || 'Unassigned'}</p>
            </div>
          </div>
          <div><label className="label">Mission Type</label><select value={dispatchForm.missionType} onChange={(e) => setDispatchForm({ ...dispatchForm, missionType: e.target.value })} className="input">{['Patient Pickup','Trauma Response','ICU Transfer','Neonatal Transfer','Inter-Hospital Transfer','Other'].map((m) => <option key={m}>{m}</option>)}</select></div>
          <div><label className="label">Destination</label><div className="relative"><MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" /><input value={dispatchForm.destination} onChange={(e) => setDispatchForm({ ...dispatchForm, destination: e.target.value })} className="input pl-9" placeholder="Address or location" /></div></div>
          <div><label className="label">Notes (optional)</label><textarea rows={2} value={dispatchForm.notes} onChange={(e) => setDispatchForm({ ...dispatchForm, notes: e.target.value })} className="input" placeholder="Mission details..." /></div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDispatchTarget(null)}>Cancel</Button>
            <Button onClick={doDispatch} className="bg-error-600 hover:bg-error-700"><Send className="h-4 w-4" /> Dispatch Now</Button>
          </div>
        </div>
      </Modal>

      {/* Update Status Modal */}
      <Modal open={!!updateTarget} onClose={() => setUpdateTarget(null)} title={`Update — ${updateTarget?.vehicleNumber || updateTarget?.vehicleNo}`}>
        <div className="space-y-4">
          <div><label className="label">Status</label><select value={updateForm.status} onChange={(e) => setUpdateForm({ ...updateForm, status: e.target.value })} className="input">{['available','on-call','maintenance','offline'].map((s) => <option key={s} value={s}>{STATUS_META[s]?.label || s}</option>)}</select></div>
          <div><label className="label">Driver Name</label><input value={updateForm.driver} onChange={(e) => setUpdateForm({ ...updateForm, driver: e.target.value })} className="input" placeholder="Driver full name" /></div>
          <div><label className="label">Driver Phone</label><input value={updateForm.driverPhone} onChange={(e) => setUpdateForm({ ...updateForm, driverPhone: e.target.value })} className="input" placeholder="+91 ..." /></div>
          <div><label className="label">Current Location</label><input value={updateForm.currentLocation} onChange={(e) => setUpdateForm({ ...updateForm, currentLocation: e.target.value })} className="input" placeholder="e.g. Main Gate" /></div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setUpdateTarget(null)}>Cancel</Button>
            <Button onClick={() => doUpdate({ ...updateTarget, ...updateForm })}><ShieldCheck className="h-4 w-4" /> Save Changes</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
