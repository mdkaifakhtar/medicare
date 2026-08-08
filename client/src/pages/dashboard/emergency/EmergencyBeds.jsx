import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  BedDouble, Activity, RefreshCcw, UserPlus, CheckCircle, XCircle,
  Wrench, User, Clock, Building2, AlertTriangle, ShieldAlert, Radio,
  ChevronRight, Filter, Search,
} from 'lucide-react';
import { StatCard, Badge, Button, Modal, EmptyState } from '../../../components/ui/index.jsx';
import { mockApi } from '../../../services/mockApi.js';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';

const TYPE_META = {
  ICU:     { color: 'from-error-500 to-error-600',   bg: 'bg-error-50',     border: 'border-error-200',   text: 'text-error-600' },
  NICU:    { color: 'from-error-400 to-error-500',   bg: 'bg-error-50/60',  border: 'border-error-200/60', text: 'text-error-500' },
  Private: { color: 'from-primary-500 to-primary-600', bg: 'bg-primary-50',   border: 'border-primary-200', text: 'text-primary-600' },
  General: { color: 'from-neutral-400 to-neutral-500', bg: 'bg-neutral-50',    border: 'border-neutral-200',   text: 'text-neutral-500' },
  Deluxe:  { color: 'from-accent-500 to-accent-600',  bg: 'bg-accent-50',     border: 'border-accent-200',   text: 'text-accent-600' },
};

const STATUS_ACTIONS = {
  available:   { next: 'occupied',     label: 'Admit Patient', color: 'bg-primary-100 text-primary-700 hover:bg-primary-200' },
  occupied:    { next: 'available',    label: 'Mark Discharged', color: 'bg-success-100 text-success-700 hover:bg-success-200' },
  maintenance: { next: 'available',    label: 'Mark Available', color: 'bg-success-100 text-success-700 hover:bg-success-200' },
  reserved:    { next: 'occupied',     label: 'Mark Occupied',  color: 'bg-warning-100 text-warning-700 hover:bg-warning-200' },
};

function BedCell({ bed, onAction }) {
  const typeM = TYPE_META[bed.type] || TYPE_META.General;
  const isOccupied = bed.status === 'occupied';
  const isMaint = bed.status === 'maintenance';
  const action = STATUS_ACTIONS[bed.status];

  return (
    <motion.div layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className={`rounded-2xl border p-4 card-hover ${isOccupied ? `border-error-200 bg-error-50/40` : isMaint ? 'border-warning-200 bg-warning-50/40' : 'border-neutral-200 bg-white'}`}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className={`grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br ${typeM.color} text-white`}>
            <BedDouble className="h-4.5 w-4.5" />
          </div>
          <div>
            <p className="text-sm font-bold text-neutral-900">{bed.bedNumber || bed.number}</p>
            <p className={`text-[11px] font-medium ${typeM.text}`}>{bed.type}</p>
          </div>
        </div>
        <div>
          {isOccupied ? <span className="inline-flex h-2.5 w-2.5 rounded-full bg-error-500" /> : isMaint ? <span className="inline-flex h-2.5 w-2.5 rounded-full bg-warning-500" /> : <span className="inline-flex h-2.5 w-2.5 rounded-full bg-success-500" />}
        </div>
      </div>
      <p className="text-xs text-neutral-500 mb-1">{bed.ward}</p>
      {isOccupied && bed.patientName && (
        <p className="text-xs font-medium text-neutral-700 flex items-center gap-1 mb-1"><User className="h-3 w-3" /> {bed.patientName}</p>
      )}
      {bed.dailyRate && <p className="text-xs text-neutral-400">₹{bed.dailyRate}/day</p>}
      {action && (
        <button onClick={() => onAction(bed, action.next)} className={`mt-3 w-full rounded-xl py-1.5 text-xs font-medium transition ${action.color}`}>
          {action.label}
        </button>
      )}
    </motion.div>
  );
}

export default function EmergencyBeds() {
  const { user } = useSelector((s) => s.auth);
  const [beds, setBeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [filterWard, setFilterWard] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [search, setSearch] = useState('');
  const [admitModal, setAdmitModal] = useState(null);
  const [admitForm, setAdmitForm] = useState({ patientName: '', patientId: '' });
  const [patients, setPatients] = useState([]);

  const load = useCallback(async () => {
    try {
      const r = await mockApi.listBeds({ limit: 200 });
      setBeds(r?.items || []);
      setLastRefresh(new Date());
    } catch { /* silent */ }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
    mockApi.listPatients({ limit: 50 }).then((r) => setPatients(r?.items || [])).catch(() => {});
    const t = setInterval(load, 20000);
    return () => clearInterval(t);
  }, [load]);

  const handleAction = async (bed, nextStatus) => {
    if (nextStatus === 'occupied') {
      setAdmitModal(bed);
      setAdmitForm({ patientName: '', patientId: '' });
      return;
    }
    try {
      await mockApi.updateBed(bed._id || bed.id, { status: nextStatus, patientName: nextStatus === 'available' ? '' : bed.patientName, patient: nextStatus === 'available' ? null : bed.patient });
      toast.success(`Bed ${bed.bedNumber || bed.number} status updated`);
      load();
    } catch { toast.error('Failed to update bed'); }
  };

  const admitPatient = async () => {
    if (!admitModal) return;
    try {
      await mockApi.updateBed(admitModal._id || admitModal.id, { status: 'occupied', patientName: admitForm.patientName, patient: admitForm.patientId || null, assignedAt: new Date().toISOString() });
      toast.success(`Patient admitted to Bed ${admitModal.bedNumber || admitModal.number}`);
      setAdmitModal(null);
      load();
    } catch { toast.error('Failed to admit patient'); }
  };

  const wards = ['all', ...new Set(beds.map((b) => b.ward).filter(Boolean))];
  const types = ['all', 'ICU', 'NICU', 'Private', 'General', 'Deluxe'];

  const filtered = beds.filter((b) => {
    if (filterWard !== 'all' && b.ward !== filterWard) return false;
    if (filterStatus !== 'all' && b.status !== filterStatus) return false;
    if (filterType !== 'all' && b.type !== filterType) return false;
    if (search && !(b.bedNumber || b.number)?.toLowerCase().includes(search.toLowerCase()) && !b.patientName?.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const stats = {
    total: beds.length,
    available: beds.filter((b) => b.status === 'available').length,
    occupied: beds.filter((b) => b.status === 'occupied').length,
    icu: beds.filter((b) => b.type === 'ICU').length,
    icuAvailable: beds.filter((b) => b.type === 'ICU' && b.status === 'available').length,
    maintenance: beds.filter((b) => b.status === 'maintenance').length,
    occupancyPct: beds.length ? Math.round((beds.filter((b) => b.status === 'occupied').length / beds.length) * 100) : 0,
  };

  // Group by ward for ward-view
  const bedsByWard = filtered.reduce((acc, bed) => {
    const ward = bed.ward || 'General';
    if (!acc[ward]) acc[ward] = [];
    acc[ward].push(bed);
    return acc;
  }, {});

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Radio className="h-4 w-4 text-error-500" />
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Emergency · Bed Management</span>
          </div>
          <h1 className="mt-1.5 font-display text-2xl font-bold text-neutral-900">Bed & ICU Availability</h1>
          <p className="text-sm text-neutral-500">Real-time occupancy across all wards. Updated {lastRefresh.toLocaleTimeString()}</p>
        </div>
        <button onClick={load} className="flex items-center gap-2 rounded-xl border border-neutral-200 px-3.5 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-50 transition">
          <RefreshCcw className="h-4 w-4" /> Refresh
        </button>
      </div>

      {/* Stats strip */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard icon={BedDouble} label="Total Beds" value={stats.total} color="primary" delay={0} />
        <StatCard icon={CheckCircle} label="Available" value={stats.available} color="success" delay={0.05} />
        <StatCard icon={Activity} label="Occupied" value={stats.occupied} color="error" delay={0.1} />
        <StatCard icon={ShieldAlert} label="ICU Available" value={`${stats.icuAvailable}/${stats.icu}`} color="warning" delay={0.15} />
      </div>

      {/* Occupancy bar */}
      <div className="card p-4 mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-neutral-900">Overall Occupancy</span>
          <span className={`font-display text-lg font-bold ${stats.occupancyPct > 85 ? 'text-error-600' : stats.occupancyPct > 70 ? 'text-warning-600' : 'text-success-600'}`}>{stats.occupancyPct}%</span>
        </div>
        <div className="h-3 rounded-full bg-neutral-100 overflow-hidden flex">
          <motion.div initial={{ width: 0 }} animate={{ width: `${stats.occupancyPct}%` }} transition={{ duration: 0.6, ease: 'easeOut' }} className={`h-full rounded-full ${stats.occupancyPct > 85 ? 'bg-error-500' : stats.occupancyPct > 70 ? 'bg-warning-500' : 'bg-success-500'}`} />
        </div>
        <div className="mt-2 flex items-center gap-4 text-xs text-neutral-500">
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-success-500" /> {stats.available} Available</span>
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-error-500" /> {stats.occupied} Occupied</span>
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-warning-500" /> {stats.maintenance} Maintenance</span>
        </div>
      </div>

      {/* ICU alert */}
      {stats.icuAvailable === 0 && stats.icu > 0 && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-6 flex items-center gap-4 rounded-2xl border border-error-200 bg-error-50/50 p-4">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-error-100 text-error-600"><AlertTriangle className="h-5 w-5" /></div>
          <div>
            <p className="text-sm font-bold text-error-800">All ICU beds occupied</p>
            <p className="text-xs text-error-600">Consider arranging inter-hospital transfers for critical patients.</p>
          </div>
        </motion.div>
      )}

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search bed or patient..." className="input pl-9" />
        </div>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="input max-w-40">
          <option value="all">All Status</option>
          <option value="available">Available</option>
          <option value="occupied">Occupied</option>
          <option value="maintenance">Maintenance</option>
          <option value="reserved">Reserved</option>
        </select>
        <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="input max-w-40">
          {types.map((t) => <option key={t} value={t}>{t === 'all' ? 'All Types' : t}</option>)}
        </select>
        <select value={filterWard} onChange={(e) => setFilterWard(e.target.value)} className="input max-w-44">
          {wards.map((w) => <option key={w} value={w}>{w === 'all' ? 'All Wards' : w}</option>)}
        </select>
      </div>

      {/* Beds grouped by ward */}
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => <div key={i} className="skeleton h-40" />)}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState icon={BedDouble} title="No beds match filters" description="Adjust the filters above to view beds." />
      ) : filterWard !== 'all' ? (
        // Single ward — flat grid
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
          <AnimatePresence>
            {filtered.map((bed) => <BedCell key={bed._id || bed.id} bed={bed} onAction={handleAction} />)}
          </AnimatePresence>
        </div>
      ) : (
        // All wards — section per ward
        Object.entries(bedsByWard).map(([ward, wardBeds]) => {
          const wardAvail = wardBeds.filter((b) => b.status === 'available').length;
          const typeM = TYPE_META[wardBeds[0]?.type] || TYPE_META.General;
          return (
            <div key={ward} className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className={`grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br ${typeM.color} text-white`}>
                    <Building2 className="h-4.5 w-4.5" />
                  </div>
                  <h3 className="font-display text-base font-semibold text-neutral-900">{ward}</h3>
                  <Badge variant={wardAvail > 0 ? 'success' : 'error'} dot>{wardAvail} available / {wardBeds.length}</Badge>
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
                <AnimatePresence>
                  {wardBeds.map((bed) => <BedCell key={bed._id || bed.id} bed={bed} onAction={handleAction} />)}
                </AnimatePresence>
              </div>
            </div>
          );
        })
      )}

      {/* Admit Patient Modal */}
      <Modal open={!!admitModal} onClose={() => setAdmitModal(null)} title={`Admit Patient — Bed ${admitModal?.bedNumber || admitModal?.number}`}>
        <div className="space-y-4">
          <div className="rounded-xl bg-neutral-50 p-4 text-sm space-y-1.5">
            <div className="flex justify-between"><span className="text-neutral-500">Bed</span><span className="font-medium text-neutral-900">{admitModal?.bedNumber || admitModal?.number}</span></div>
            <div className="flex justify-between"><span className="text-neutral-500">Ward</span><span className="font-medium text-neutral-900">{admitModal?.ward}</span></div>
            <div className="flex justify-between"><span className="text-neutral-500">Type</span><span className="font-medium text-neutral-900">{admitModal?.type}</span></div>
            <div className="flex justify-between"><span className="text-neutral-500">Daily Rate</span><span className="font-medium text-neutral-900">₹{admitModal?.dailyRate || '—'}</span></div>
          </div>
          <div>
            <label className="label">Select Patient</label>
            <select value={admitForm.patientId} onChange={(e) => {
              const p = patients.find((x) => (x._id || x.id) === e.target.value);
              setAdmitForm({ patientId: e.target.value, patientName: p?.name || '' });
            }} className="input">
              <option value="">Choose a registered patient...</option>
              {patients.map((p) => <option key={p._id || p.id} value={p._id || p.id}>{p.name} — {p.age}y {p.gender?.[0]}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Or Enter Patient Name Manually</label>
            <div className="relative"><User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" /><input value={admitForm.patientName} onChange={(e) => setAdmitForm({ ...admitForm, patientName: e.target.value })} className="input pl-9" placeholder="Full patient name" /></div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setAdmitModal(null)}>Cancel</Button>
            <Button onClick={admitPatient} disabled={!admitForm.patientName}><UserPlus className="h-4 w-4" /> Admit Patient</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
