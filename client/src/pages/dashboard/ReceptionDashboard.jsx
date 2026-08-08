import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Users, Calendar, Clock, BedDouble, ArrowUpRight, Plus, ChevronRight,
  CheckCircle, Phone, MapPin, User, Activity, Stethoscope, AlertCircle,
  Bed, TrendingUp, FileText, CalendarPlus, ClipboardCheck, UserPlus,
  DoorOpen, Hash, Timer,
} from 'lucide-react';
import { Badge, Button, SectionCard, EmptyState } from '../../components/ui/index.jsx';
import { mockApi } from '../../services/mockApi.js';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';

export default function ReceptionDashboard() {
  const { user } = useSelector((s) => s.auth);
  const [analytics, setAnalytics] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [beds, setBeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  const load = () => {
    setLoading(true);
    Promise.all([
      mockApi.getAnalytics(),
      mockApi.listAppointments({ limit: 10 }),
      mockApi.listPatients({ limit: 8 }),
      mockApi.listBeds({ limit: 50 }),
    ]).then(([a, appts, p, b]) => {
      setAnalytics(a); setAppointments(appts.items); setPatients(p.items); setBeds(b.items); setLoading(false);
    });
  };
  useEffect(load, []);

  if (!analytics) return <DashboardSkeleton />;

  const s = analytics.stats || analytics;
  const todayAppts = appointments.filter((a) => a.status === 'scheduled' || a.status === 'confirmed');
  const walkIns = appointments.filter((a) => a.type === 'Walk-in' || a.type === 'walk-in');
  const occupiedBeds = beds.filter((b) => b.status === 'occupied');
  const availableBeds = beds.filter((b) => b.status === 'available');
  const recentPatients = patients.slice(0, 6);

  const tabs = [
    { key: 'overview', label: 'Overview', icon: Activity },
    { key: 'appointments', label: "Today's Queue", icon: Calendar, badge: todayAppts.length },
    { key: 'patients', label: 'Registrations', icon: Users },
    { key: 'beds', label: 'Bed Status', icon: BedDouble },
  ];

  return (
    <div className="space-y-6">
      {/* Header — front-desk console style */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-primary-500" />
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Front Desk · {new Date().toLocaleDateString('en', { weekday: 'long', day: 'numeric', month: 'short' })}</span>
          </div>
          <h1 className="mt-2 font-display text-2xl font-bold tracking-tight text-neutral-900">
            Welcome, {user?.name?.split(' ')[0]}
          </h1>
          <p className="mt-1 text-sm text-neutral-500">Patient flow, registrations, and bed management</p>
        </div>
        <div className="flex gap-2">
          <Link to="/dashboard/book-appointment"><Button variant="outline" size="sm"><CalendarPlus className="h-4 w-4" /> Book</Button></Link>
          <Link to="/dashboard/patients"><Button size="sm"><UserPlus className="h-4 w-4" /> Register</Button></Link>
        </div>
      </div>

      {/* Front-desk KPI strip — 4 tiles with patient flow metrics */}
      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
        {[
          { icon: Users, label: 'Patients Today', value: todayAppts.length + walkIns.length, sub: `${walkIns.length} walk-ins`, color: 'primary' },
          { icon: Calendar, label: 'Appointments', value: todayAppts.length, sub: 'scheduled today', color: 'secondary' },
          { icon: BedDouble, label: 'Beds Available', value: availableBeds.length, sub: `${occupiedBeds.length} occupied`, color: occupiedBeds.length > availableBeds.length ? 'error' : 'success' },
          { icon: Clock, label: 'Avg Wait', value: '12 min', sub: 'current estimate', color: 'accent' },
        ].map((k, i) => (
          <motion.div key={k.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="card p-4 card-hover group">
            <div className="flex items-center justify-between mb-3">
              <div className={`grid h-9 w-9 place-items-center rounded-lg bg-${k.color}-100${k.color}-900/30 text-${k.color}-600${k.color}-400 transition-transform group-hover:scale-110`}>
                <k.icon className="h-4.5 w-4.5" />
              </div>
              <span className="text-xs text-neutral-400">{k.sub}</span>
            </div>
            <p className="font-display text-2xl font-bold tracking-tight text-neutral-900">{k.value}</p>
            <p className="mt-0.5 text-xs text-neutral-500">{k.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Tab navigation — underline style */}
      <div className="flex flex-wrap gap-1.5 border-b border-neutral-200 pb-px">
        {tabs.map((tab) => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className={`relative flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors ${activeTab === tab.key ? 'text-primary-600' : 'text-neutral-500 hover:text-neutral-800'}`}>
            <tab.icon className="h-4 w-4" />
            {tab.label}
            {tab.badge !== undefined && tab.badge > 0 && (
              <span className="rounded-full bg-error-500 px-1.5 py-0.5 text-[10px] font-bold text-white">{tab.badge}</span>
            )}
            {activeTab === tab.key && <motion.div layoutId="receptionTab" className="absolute -bottom-px left-0 right-0 h-0.5 rounded-full bg-primary-600" />}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'overview' && (
          <motion.div key="overview" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }} className="grid gap-6 lg:grid-cols-12">
            {/* Patient queue board — 8 cols */}
            <div className="card p-6 lg:col-span-8">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h3 className="font-display text-base font-semibold text-neutral-900">Today's Patient Queue</h3>
                  <p className="mt-0.5 text-sm text-neutral-500">Real-time patient flow through the front desk</p>
                </div>
                <Link to="/dashboard/appointments" className="text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center gap-1">View all <ArrowUpRight className="h-3.5 w-3.5" /></Link>
              </div>
              {todayAppts.length === 0 ? <EmptyState icon={Calendar} title="No appointments today" description="The queue is empty." /> : (
                <div className="space-y-2">
                  {todayAppts.slice(0, 7).map((a, i) => (
                    <motion.div key={a.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                      className="flex items-center gap-4 rounded-xl border border-neutral-100 p-4 card-hover group">
                      {/* Token number badge */}
                      <div className="flex flex-col items-center justify-center min-w-[60px]">
                        <div className="grid h-12 w-12 place-items-center rounded-xl bg-primary-100 text-primary-600 font-display font-bold text-sm">
                          {a.token || `T${(i + 1).toString().padStart(2, '0')}`}
                        </div>
                      </div>
                      <div className="h-10 w-px bg-neutral-200" />
                      {/* Patient info */}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-neutral-900 truncate">{a.patientName || 'Patient'}</p>
                        <p className="text-xs text-neutral-500 truncate">{a.doctorName || 'Doctor'} · {a.departmentName || a.department || ''} · {a.time || '10:00'}</p>
                      </div>
                      {/* Status + wait time */}
                      <div className="flex items-center gap-3 shrink-0">
                        <div className="hidden sm:flex items-center gap-1.5 text-xs text-neutral-400">
                          <Timer className="h-3.5 w-3.5" /> ~{10 + i * 5} min
                        </div>
                        <Badge variant={a.status === 'confirmed' ? 'success' : 'warning'} dot>{a.status}</Badge>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Right column — quick actions + bed occupancy */}
            <div className="lg:col-span-4 space-y-6">
              {/* Quick actions grid */}
              <div className="card p-5">
                <h3 className="font-display text-sm font-semibold text-neutral-900 mb-3">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { to: '/dashboard/book-appointment', label: 'Book', icon: CalendarPlus, color: 'primary' },
                    { to: '/dashboard/patients', label: 'Register', icon: UserPlus, color: 'secondary' },
                    { to: '/dashboard/beds', label: 'Beds', icon: BedDouble, color: 'accent' },
                    { to: '/dashboard/invoices', label: 'Billing', icon: FileText, color: 'success' },
                  ].map((a) => (
                    <Link key={a.to} to={a.to} className="flex flex-col items-center gap-2 rounded-xl border border-neutral-100 p-4 card-hover group">
                      <div className={`grid h-10 w-10 place-items-center rounded-xl bg-${a.color}-100${a.color}-900/30 text-${a.color}-600${a.color}-400 transition-transform group-hover:scale-110`}>
                        <a.icon className="h-5 w-5" />
                      </div>
                      <span className="text-xs font-medium text-neutral-700">{a.label}</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Bed occupancy visual */}
              <div className="card p-5">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-display text-sm font-semibold text-neutral-900">Bed Occupancy</h3>
                  <Link to="/dashboard/beds" className="text-xs font-medium text-primary-600">Details</Link>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="rounded-xl bg-success-50/50 p-3 text-center">
                    <p className="font-display text-2xl font-bold text-success-700">{availableBeds.length}</p>
                    <p className="text-xs text-success-600">Available</p>
                  </div>
                  <div className="rounded-xl bg-error-50/50 p-3 text-center">
                    <p className="font-display text-2xl font-bold text-error-700">{occupiedBeds.length}</p>
                    <p className="text-xs text-error-600">Occupied</p>
                  </div>
                </div>
                {/* Visual bar */}
                <div className="h-3 rounded-full bg-neutral-100 overflow-hidden flex">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${(occupiedBeds.length / (beds.length || 1)) * 100}%` }} transition={{ duration: 0.6, ease: 'easeOut' }} className="h-full bg-gradient-to-r from-error-500 to-warning-500" />
                  <motion.div initial={{ width: 0 }} animate={{ width: `${(availableBeds.length / (beds.length || 1)) * 100}%` }} transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }} className="h-full bg-gradient-to-r from-success-400 to-success-500" />
                </div>
                <p className="mt-2 text-center text-xs text-neutral-500">{Math.round((occupiedBeds.length / (beds.length || 1)) * 100)}% occupied · {beds.length} total beds</p>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'appointments' && (
          <motion.div key="appointments" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
            <div className="card p-6">
              <h3 className="font-display text-base font-semibold text-neutral-900 mb-1">Today's Appointments</h3>
              <p className="text-sm text-neutral-500 mb-5">Full schedule with patient details and wait times</p>
              {todayAppts.length === 0 ? <EmptyState icon={Calendar} title="No appointments scheduled" /> : (
                <div className="space-y-2">
                  {todayAppts.map((a, i) => (
                    <motion.div key={a.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                      className="flex items-center gap-4 rounded-xl border border-neutral-100 p-4 card-hover">
                      <div className="grid h-12 w-12 place-items-center rounded-xl bg-primary-100 text-primary-600 font-display font-bold">{a.token || `T${i + 1}`}</div>
                      <div className="flex-1">
                        <p className="font-medium text-neutral-900">{a.patientName || 'Patient'}</p>
                        <p className="text-xs text-neutral-500">{a.time || '10:00'} · {a.doctorName || 'Doctor'} · {a.departmentName || ''}</p>
                      </div>
                      <Badge variant={a.status === 'confirmed' ? 'success' : 'warning'} dot>{a.status}</Badge>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {activeTab === 'patients' && (
          <motion.div key="patients" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
            <div className="card p-6">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h3 className="font-display text-base font-semibold text-neutral-900">Recent Registrations</h3>
                  <p className="mt-0.5 text-sm text-neutral-500">Newly registered patients at the front desk</p>
                </div>
                <Link to="/dashboard/patients" className="text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center gap-1">View all <ArrowUpRight className="h-3.5 w-3.5" /></Link>
              </div>
              {recentPatients.length === 0 ? <EmptyState icon={Users} title="No patients registered" /> : (
                <div className="grid gap-3 sm:grid-cols-2">
                  {recentPatients.map((p, i) => (
                    <motion.div key={p.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                      <Link to={`/dashboard/patients/${p.id}`} className="flex items-center gap-3 rounded-xl border border-neutral-100 p-4 card-hover group">
                        <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-primary-500/10 to-secondary-500/10 text-sm font-semibold text-primary-600">{p.name?.[0]}</div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-neutral-900 truncate">{p.name}</p>
                          <p className="text-xs text-neutral-500">{p.age} yrs · {p.gender} · {p.bloodGroup}</p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-neutral-300 group-hover:text-primary-500 transition" />
                      </Link>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {activeTab === 'beds' && (
          <motion.div key="beds" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
            <div className="card p-6">
              <h3 className="font-display text-base font-semibold text-neutral-900 mb-1">Bed Status</h3>
              <p className="text-sm text-neutral-500 mb-5">Real-time bed availability across all wards</p>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {beds.slice(0, 24).map((b, i) => (
                  <motion.div key={b.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.03 }}
                    className={`rounded-xl border p-4 ${b.status === 'available' ? 'border-success-200 bg-success-50/30' : 'border-error-200 bg-error-50/30'} card-hover`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Bed className={`h-5 w-5 ${b.status === 'available' ? 'text-success-600' : 'text-error-600'}`} />
                        <div>
                          <p className="text-sm font-semibold text-neutral-900">Bed {b.bedNumber || b.number}</p>
                          <p className="text-xs text-neutral-500">{b.ward || b.type || 'General'}</p>
                        </div>
                      </div>
                      <Badge variant={b.status === 'available' ? 'success' : 'error'} dot>{b.status}</Badge>
                    </div>
                    {b.patientName && <p className="mt-2 text-xs text-neutral-500">Patient: {b.patientName}</p>}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="skeleton h-10 w-64" />
      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton h-24" />)}</div>
      <div className="skeleton h-80" />
    </div>
  );
}
