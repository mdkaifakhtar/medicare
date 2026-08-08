import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Radio, Clock, ShieldAlert, AlertTriangle, Heart, Activity, Droplet,
  Thermometer, ChevronDown, Search, RefreshCcw, Filter, Eye,
  CheckCircle, Siren, UserPlus, ArrowLeft, MessageSquare, X,
} from 'lucide-react';
import { PageHeader, Badge, Button, Modal, EmptyState } from '../../../components/ui/index.jsx';
import { mockApi } from '../../../services/mockApi.js';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';

const TRAUMA_META = {
  'Level 1 Critical':    { short: 'L1', color: 'bg-error-600',   ring: 'ring-error-500',   textColor: 'text-error-600',   badge: 'error',   sortOrder: 0 },
  'Level 2 Emergent':    { short: 'L2', color: 'bg-error-400',   ring: 'ring-error-400',   textColor: 'text-error-500',   badge: 'error',   sortOrder: 1 },
  'Level 3 Urgent':      { short: 'L3', color: 'bg-warning-500', ring: 'ring-warning-400', textColor: 'text-warning-600', badge: 'warning', sortOrder: 2 },
  'Level 4 Less Urgent': { short: 'L4', color: 'bg-accent-500',  ring: 'ring-accent-400',  textColor: 'text-accent-600',  badge: 'warning', sortOrder: 3 },
  'Level 5 Non-Urgent':  { short: 'L5', color: 'bg-success-500', ring: 'ring-success-400', textColor: 'text-success-600', badge: 'success', sortOrder: 4 },
};

const STATUS_FLOW = ['waiting', 'triaged', 'under-treatment', 'admitted', 'discharged'];
const STATUS_LABELS = {
  waiting: 'Waiting',
  triaged: 'Triaged',
  'under-treatment': 'In Treatment',
  admitted: 'Admitted',
  discharged: 'Discharged',
  transferred: 'Transferred',
  deceased: 'Deceased',
};

function waitTime(arrivedAt) {
  if (!arrivedAt) return '—';
  const mins = Math.floor((Date.now() - new Date(arrivedAt)) / 60000);
  if (mins < 60) return `${mins}m`;
  return `${Math.floor(mins / 60)}h ${mins % 60}m`;
}

function PulsingDot({ color = 'bg-error-500' }) {
  return (
    <span className="relative flex h-2.5 w-2.5 shrink-0">
      <span className={`absolute inline-flex h-full w-full animate-ping rounded-full ${color} opacity-75`} />
      <span className={`relative inline-flex h-2.5 w-2.5 rounded-full ${color}`} />
    </span>
  );
}

function CaseRow({ c, onAdvance, onView }) {
  const t = TRAUMA_META[c.traumaLevel] || TRAUMA_META['Level 3 Urgent'];
  const isUrgent = t.sortOrder <= 1;
  const nextStatus = STATUS_FLOW[STATUS_FLOW.indexOf(c.status) + 1];
  const arrivedAt = c.arrivedAt || c.createdAt;

  return (
    <motion.tr layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className={`table-row-hover ${isUrgent ? 'bg-error-50/30' : ''}`}>
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-2">
          {isUrgent && <PulsingDot />}
          <div className={`grid h-9 w-9 place-items-center rounded-full text-xs font-bold text-white ${t.color}`}>{t.short}</div>
        </div>
      </td>
      <td className="px-4 py-3.5">
        <p className="font-semibold text-neutral-900 text-sm">{c.patientName}</p>
        <p className="text-xs text-neutral-500">{c.caseNumber} · {c.patientAge || '?'}y {c.patientGender?.[0] || '?'}</p>
      </td>
      <td className="px-4 py-3.5">
        <p className="text-sm text-neutral-800">{c.chiefComplaint}</p>
        <p className="text-xs text-neutral-500">{c.arrivalMode}</p>
      </td>
      <td className="px-4 py-3.5">
        <div className="flex flex-wrap gap-1">
          {c.vitals?.heartRate ? <span className={`text-xs px-2 py-0.5 rounded-full ${c.vitals.heartRate > 100 || c.vitals.heartRate < 60 ? 'bg-error-100 text-error-700' : 'bg-neutral-100 text-neutral-600'}`}><Heart className="inline h-3 w-3" /> {c.vitals.heartRate}</span> : null}
          {c.vitals?.oxygenSat ? <span className={`text-xs px-2 py-0.5 rounded-full ${c.vitals.oxygenSat < 92 ? 'bg-error-100 text-error-700' : 'bg-neutral-100 text-neutral-600'}`}><Droplet className="inline h-3 w-3" /> {c.vitals.oxygenSat}%</span> : null}
          {c.vitals?.bloodPressure ? <span className="text-xs px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600"><Activity className="inline h-3 w-3" /> {c.vitals.bloodPressure}</span> : null}
        </div>
      </td>
      <td className="px-4 py-3.5">
        <Badge variant={c.status === 'under-treatment' ? 'error' : c.status === 'admitted' ? 'success' : 'warning'} dot>{STATUS_LABELS[c.status] || c.status}</Badge>
      </td>
      <td className="px-4 py-3.5">
        <span className={`text-sm font-mono font-medium flex items-center gap-1 ${isUrgent && waitTime(arrivedAt) !== '—' ? 'text-error-600' : 'text-neutral-600'}`}>
          <Clock className="h-3.5 w-3.5" /> {waitTime(arrivedAt)}
        </span>
      </td>
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-1.5">
          <button onClick={() => onView(c)} className="grid h-8 w-8 place-items-center rounded-lg bg-neutral-100 text-neutral-500 hover:text-primary-600 transition">
            <Eye className="h-4 w-4" />
          </button>
          {nextStatus && !['discharged','transferred','deceased'].includes(c.status) && (
            <button onClick={() => onAdvance(c._id || c.id, nextStatus)} className="rounded-lg bg-primary-100 px-2.5 py-1.5 text-xs font-medium text-primary-700 hover:bg-primary-200 transition whitespace-nowrap">
              → {STATUS_LABELS[nextStatus]}
            </button>
          )}
        </div>
      </td>
    </motion.tr>
  );
}

export default function EmergencyQueue() {
  const { user } = useSelector((s) => s.auth);
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('active');
  const [filterTrauma, setFilterTrauma] = useState('all');
  const [viewCase, setViewCase] = useState(null);
  const [noteText, setNoteText] = useState('');
  const [addingNote, setAddingNote] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  const load = useCallback(async () => {
    try {
      const data = await mockApi.listEmergencyCases({ limit: 100 });
      setCases(data?.items || []);
      setLastRefresh(new Date());
    } catch { /* silent */ }
    setLoading(false);
  }, []);

  useEffect(() => { load(); const t = setInterval(load, 15000); return () => clearInterval(t); }, [load]);

  const advance = async (id, status) => {
    try {
      await mockApi.updateEmergencyCase(id, { status });
      toast.success(`Moved to: ${STATUS_LABELS[status]}`);
      if (viewCase && (viewCase._id === id || viewCase.id === id)) setViewCase((v) => ({ ...v, status }));
      load();
    } catch { toast.error('Failed to update'); }
  };

  const addNote = async () => {
    if (!noteText.trim() || !viewCase) return;
    setAddingNote(true);
    try {
      await mockApi.addEmergencyNote(viewCase._id || viewCase.id, { text: noteText, author: user?.name, role: user?.role });
      toast.success('Note added');
      setNoteText('');
      load();
      setViewCase((v) => ({ ...v, notes: [...(v.notes || []), { text: noteText, author: user?.name, createdAt: new Date().toISOString() }] }));
    } catch { toast.error('Failed to add note'); }
    setAddingNote(false);
  };

  const filtered = cases.filter((c) => {
    if (filterStatus === 'active' && ['discharged','transferred','deceased'].includes(c.status)) return false;
    if (filterStatus !== 'active' && filterStatus !== 'all' && c.status !== filterStatus) return false;
    if (filterTrauma !== 'all' && c.traumaLevel !== filterTrauma) return false;
    if (search && !c.patientName?.toLowerCase().includes(search.toLowerCase()) && !c.caseNumber?.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }).sort((a, b) => {
    const tOrder = { 'Level 1 Critical': 0, 'Level 2 Emergent': 1, 'Level 3 Urgent': 2, 'Level 4 Less Urgent': 3, 'Level 5 Non-Urgent': 4 };
    const tDiff = (tOrder[a.traumaLevel] ?? 3) - (tOrder[b.traumaLevel] ?? 3);
    if (tDiff !== 0) return tDiff;
    return new Date(a.arrivedAt || a.createdAt) - new Date(b.arrivedAt || b.createdAt);
  });

  const countByStatus = (s) => cases.filter((c) => s === 'active' ? !['discharged','transferred','deceased'].includes(c.status) : c.status === s).length;

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Radio className="h-4 w-4 text-error-500" />
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Emergency · Live Queue</span>
            <span className="text-xs text-neutral-400">Updated {lastRefresh.toLocaleTimeString()}</span>
          </div>
          <h1 className="mt-1.5 font-display text-2xl font-bold text-neutral-900">Emergency Queue</h1>
          <p className="text-sm text-neutral-500">Priority-sorted patient queue. L1/L2 at top.</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={load} className="grid h-9 w-9 place-items-center rounded-xl border border-neutral-200 text-neutral-500 hover:text-primary-600 transition">
            <RefreshCcw className="h-4 w-4" />
          </button>
          <Link to="/dashboard/emergency/register"><Button><UserPlus className="h-4 w-4" /> New Case</Button></Link>
        </div>
      </div>

      {/* Quick status tabs */}
      <div className="mb-4 flex flex-wrap gap-1.5">
        {[
          { key: 'active', label: `Active (${countByStatus('active')})`, color: 'error' },
          { key: 'waiting', label: `Waiting (${countByStatus('waiting')})` },
          { key: 'triaged', label: `Triaged (${countByStatus('triaged')})` },
          { key: 'under-treatment', label: `In Treatment (${countByStatus('under-treatment')})` },
          { key: 'all', label: 'All' },
        ].map((tab) => (
          <button key={tab.key} onClick={() => setFilterStatus(tab.key)} className={`rounded-xl px-3.5 py-2 text-sm font-medium transition ${filterStatus === tab.key ? 'bg-error-600 text-white shadow-sm' : 'bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50'}`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search + trauma filter */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search patient or case number..." className="input pl-9" />
        </div>
        <select value={filterTrauma} onChange={(e) => setFilterTrauma(e.target.value)} className="input max-w-xs">
          <option value="all">All Trauma Levels</option>
          {Object.keys(TRAUMA_META).map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-neutral-100 bg-neutral-50/50">
                <th className="px-4 py-3.5 text-xs font-semibold uppercase tracking-wider text-neutral-500">Triage</th>
                <th className="px-4 py-3.5 text-xs font-semibold uppercase tracking-wider text-neutral-500">Patient</th>
                <th className="px-4 py-3.5 text-xs font-semibold uppercase tracking-wider text-neutral-500">Complaint</th>
                <th className="px-4 py-3.5 text-xs font-semibold uppercase tracking-wider text-neutral-500">Vitals</th>
                <th className="px-4 py-3.5 text-xs font-semibold uppercase tracking-wider text-neutral-500">Status</th>
                <th className="px-4 py-3.5 text-xs font-semibold uppercase tracking-wider text-neutral-500">Wait</th>
                <th className="px-4 py-3.5 text-xs font-semibold uppercase tracking-wider text-neutral-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>{Array.from({ length: 7 }).map((_, j) => <td key={j} className="px-4 py-4"><div className="skeleton h-4 w-24" /></td>)}</tr>
                ))
              ) : filtered.length === 0 ? (
                <tr><td colSpan={7}>
                  <EmptyState icon={CheckCircle} title="Queue is clear" description="No cases matching current filter. Adjust filters or register a new case." action={<Link to="/dashboard/emergency/register"><Button><UserPlus className="h-4 w-4" /> Register Case</Button></Link>} />
                </td></tr>
              ) : (
                <AnimatePresence>
                  {filtered.map((c) => (
                    <CaseRow key={c._id || c.id} c={c} onAdvance={advance} onView={setViewCase} />
                  ))}
                </AnimatePresence>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Case Detail Modal */}
      <Modal open={!!viewCase} onClose={() => setViewCase(null)} title={viewCase?.caseNumber || 'Case Details'} size="lg">
        {viewCase && (
          <div className="space-y-5">
            {/* Trauma badge */}
            {viewCase.traumaLevel && (
              <div className={`flex items-center gap-3 rounded-2xl p-4 ${TRAUMA_META[viewCase.traumaLevel]?.color || 'bg-warning-500'} text-white`}>
                <ShieldAlert className="h-6 w-6 shrink-0" />
                <div>
                  <p className="font-bold">{viewCase.traumaLevel}</p>
                  <p className="text-xs opacity-80">{STATUS_LABELS[viewCase.status]}</p>
                </div>
                <div className="ml-auto text-right">
                  <p className="text-xs opacity-70">Wait time</p>
                  <p className="font-mono font-bold">{waitTime(viewCase.arrivedAt || viewCase.createdAt)}</p>
                </div>
              </div>
            )}

            {/* Patient info */}
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                ['Patient', viewCase.patientName],
                ['Age / Gender', `${viewCase.patientAge || '?'} yrs / ${viewCase.patientGender || '?'}`],
                ['Contact', viewCase.contactPhone || '—'],
                ['Arrival Mode', viewCase.arrivalMode || '—'],
                ['Chief Complaint', viewCase.chiefComplaint || '—'],
                ['Assigned Doctor', viewCase.assignedDoctorName || 'Not assigned'],
                ['Bed', viewCase.assignedBedNumber || 'Not assigned'],
                ['Status', STATUS_LABELS[viewCase.status] || viewCase.status],
              ].map(([k, v]) => (
                <div key={k} className="rounded-xl border border-neutral-100 p-3">
                  <p className="text-xs text-neutral-500">{k}</p>
                  <p className="mt-0.5 text-sm font-semibold text-neutral-900">{v}</p>
                </div>
              ))}
            </div>

            {/* Vitals */}
            {viewCase.vitals && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2">Vitals</p>
                <div className="flex flex-wrap gap-2">
                  {viewCase.vitals.heartRate ? <VitalChipM label="HR" val={viewCase.vitals.heartRate} unit="bpm" alert={viewCase.vitals.heartRate > 100 || viewCase.vitals.heartRate < 60} /> : null}
                  {viewCase.vitals.bloodPressure ? <VitalChipM label="BP" val={viewCase.vitals.bloodPressure} unit="" alert={false} /> : null}
                  {viewCase.vitals.temperature ? <VitalChipM label="Temp" val={viewCase.vitals.temperature} unit="°F" alert={viewCase.vitals.temperature > 100.4} /> : null}
                  {viewCase.vitals.oxygenSat ? <VitalChipM label="SpO2" val={viewCase.vitals.oxygenSat} unit="%" alert={viewCase.vitals.oxygenSat < 92} /> : null}
                  {viewCase.vitals.respiratoryRate ? <VitalChipM label="RR" val={viewCase.vitals.respiratoryRate} unit="bpm" alert={false} /> : null}
                  {viewCase.vitals.gcs ? <VitalChipM label="GCS" val={viewCase.vitals.gcs} unit="" alert={viewCase.vitals.gcs < 14} /> : null}
                </div>
              </div>
            )}

            {/* Notes */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2">Clinical Notes</p>
              <div className="space-y-2 mb-3">
                {!(viewCase.notes?.length) ? <p className="text-sm text-neutral-400">No notes yet.</p> :
                  viewCase.notes.map((n, i) => (
                    <div key={i} className="rounded-xl border border-neutral-100 p-3">
                      <p className="text-sm text-neutral-900">{n.text}</p>
                      <p className="mt-1 text-xs text-neutral-400">{n.author || 'Staff'} · {n.createdAt ? new Date(n.createdAt).toLocaleString() : '—'}</p>
                    </div>
                  ))
                }
              </div>
              <div className="flex gap-2">
                <input value={noteText} onChange={(e) => setNoteText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addNote()} placeholder="Add clinical note..." className="input" />
                <Button size="sm" onClick={addNote} disabled={addingNote}><MessageSquare className="h-4 w-4" /></Button>
              </div>
            </div>

            {/* Advance status */}
            {!['discharged','transferred','deceased'].includes(viewCase.status) && (
              <div className="flex flex-wrap gap-2 pt-2 border-t border-neutral-100">
                {STATUS_FLOW.filter((s) => STATUS_FLOW.indexOf(s) > STATUS_FLOW.indexOf(viewCase.status)).map((nextS) => (
                  <button key={nextS} onClick={() => advance(viewCase._id || viewCase.id, nextS)} className="rounded-xl px-3 py-2 text-sm font-medium bg-neutral-100 text-neutral-700 hover:bg-primary-100 hover:text-primary-700 transition">
                    Move to: {STATUS_LABELS[nextS]}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}

function VitalChipM({ label, val, unit, alert }) {
  return (
    <span className={`rounded-lg px-3 py-1.5 text-sm font-semibold flex items-center gap-1 ${alert ? 'bg-error-100 text-error-700' : 'bg-neutral-100 text-neutral-700'}`}>
      {label}: {val}{unit} {alert && '⚠'}
    </span>
  );
}
