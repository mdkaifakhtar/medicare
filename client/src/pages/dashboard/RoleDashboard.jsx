import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { StatCard, Card, PageHeader, Badge, Button } from '../../components/ui/index.jsx';
import { mockApi } from '../../services/mockApi.js';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  Calendar, Users, Clock, Activity, Pill, FlaskConical, Receipt, BedDouble,
  TrendingUp, ArrowUpRight, Stethoscope, Package, AlertCircle, CheckCircle,
} from 'lucide-react';

// Generic role dashboard that adapts based on role prop
export default function RoleDashboard({ role }) {
  const [data, setData] = useState(null);
  const [recent, setRecent] = useState([]);
  const { user } = useSelector((s) => s.auth);

  useEffect(() => {
    mockApi.getAnalytics().then(setData);
    mockApi.listAppointments({ limit: 5 }).then((r) => setRecent(r.items));
  }, []);

  if (!data) return <Skeleton />;

  const s = data.stats || data;
  const configs = {
    doctor: {
      title: `Good ${greeting()}, Dr. ${user?.name?.split(' ').slice(-1)[0]}`,
      desc: "Here's your schedule and patient updates for today.",
      stats: [
        { icon: Calendar, label: "Today's Appointments", value: 8, change: 10, color: 'primary' },
        { icon: Users, label: 'My Patients', value: 142, change: 5, color: 'secondary' },
        { icon: Pill, label: 'Prescriptions', value: 36, change: 8, color: 'accent' },
        { icon: Activity, label: 'Avg Rating', value: '4.9', change: 2, color: 'success' },
      ],
      quickActions: [{ to: '/dashboard/appointments', label: 'View Schedule', icon: Calendar }, { to: '/dashboard/prescriptions', label: 'New Prescription', icon: Pill }, { to: '/dashboard/patients', label: 'Patient History', icon: Users }],
    },
    receptionist: {
      title: `Welcome, ${user?.name?.split(' ')[0]}`,
      desc: 'Front desk operations and patient flow at a glance.',
      stats: [
        { icon: Users, label: 'Patients Today', value: 47, change: 12, color: 'primary' },
        { icon: Calendar, label: 'Appointments', value: 32, change: 8, color: 'secondary' },
        { icon: Clock, label: 'Walk-ins', value: 15, change: 5, color: 'accent' },
        { icon: BedDouble, label: 'Beds Available', value: s.bedsTotal - s.bedsOccupied, change: -3, color: 'warning' },
      ],
      quickActions: [{ to: '/dashboard/book-appointment', label: 'Book Appointment', icon: Calendar }, { to: '/dashboard/patients', label: 'Register Patient', icon: Users }, { to: '/dashboard/beds', label: 'Bed Status', icon: BedDouble }],
    },
    nurse: {
      title: `Hello, ${user?.name?.split(' ')[0]}`,
      desc: 'Your assigned patients and care tasks for today.',
      stats: [
        { icon: Users, label: 'Assigned Patients', value: 12, change: 0, color: 'primary' },
        { icon: Activity, label: 'Vitals Pending', value: 5, change: -10, color: 'warning' },
        { icon: Pill, label: 'Med Rounds', value: 8, change: 5, color: 'secondary' },
        { icon: BedDouble, label: 'Ward Beds', value: 24, change: 2, color: 'accent' },
      ],
      quickActions: [{ to: '/dashboard/patients', label: 'My Patients', icon: Users }, { to: '/dashboard/medical-records', label: 'Record Vitals', icon: Activity }, { to: '/dashboard/beds', label: 'Ward Status', icon: BedDouble }],
    },
    lab_technician: {
      title: `Welcome, ${user?.name?.split(' ')[0]}`,
      desc: 'Lab test queue and pending reports overview.',
      stats: [
        { icon: FlaskConical, label: 'Pending Tests', value: 18, change: 15, color: 'warning' },
        { icon: CheckCircle, label: 'Completed Today', value: 42, change: 20, color: 'success' },
        { icon: Users, label: 'Patients', value: 60, change: 8, color: 'primary' },
        { icon: Activity, label: 'Avg TAT', value: '2.4h', change: -5, color: 'secondary' },
      ],
      quickActions: [{ to: '/dashboard/lab-reports', label: 'Lab Tests', icon: FlaskConical }, { to: '/dashboard/patients', label: 'Patients', icon: Users }],
    },
    pharmacist: {
      title: `Hello, ${user?.name?.split(' ')[0]}`,
      desc: 'Pharmacy inventory and prescription fulfillment.',
      stats: [
        { icon: Package, label: 'Medicines', value: 348, change: 5, color: 'primary' },
        { icon: AlertCircle, label: 'Low Stock', value: 12, change: -8, color: 'warning' },
        { icon: AlertCircle, label: 'Expiring Soon', value: 6, change: 10, color: 'error' },
        { icon: Pill, label: 'Dispensed Today', value: 87, change: 15, color: 'secondary' },
      ],
      quickActions: [{ to: '/dashboard/pharmacy', label: 'Inventory', icon: Package }, { to: '/dashboard/prescriptions', label: 'Prescriptions', icon: Pill }, { to: '/dashboard/invoices', label: 'Invoices', icon: Receipt }],
    },
    accountant: {
      title: `Welcome, ${user?.name?.split(' ')[0]}`,
      desc: 'Financial overview and collection summary.',
      stats: [
        { icon: Receipt, label: 'Daily Collection', value: '₹1.2L', change: 12, color: 'success' },
        { icon: TrendingUp, label: 'Monthly Revenue', value: `₹${(s.revenue / 100000).toFixed(1)}L`, change: 15, color: 'primary' },
        { icon: Receipt, label: 'Pending Invoices', value: 23, change: -5, color: 'warning' },
        { icon: Users, label: 'Insurance Claims', value: 14, change: 8, color: 'secondary' },
      ],
      quickActions: [{ to: '/dashboard/invoices', label: 'Invoices', icon: Receipt }, { to: '/dashboard/analytics', label: 'Analytics', icon: TrendingUp }],
    },
    patient: {
      title: `Hello, ${user?.name?.split(' ')[0]}`,
      desc: 'Your health summary and upcoming appointments.',
      stats: [
        { icon: Calendar, label: 'Upcoming', value: 2, change: 0, color: 'primary' },
        { icon: Pill, label: 'Prescriptions', value: 5, change: 0, color: 'secondary' },
        { icon: FlaskConical, label: 'Lab Reports', value: 3, change: 0, color: 'accent' },
        { icon: Receipt, label: 'Pending Bills', value: 1, change: 0, color: 'warning' },
      ],
      quickActions: [{ to: '/dashboard/book-appointment', label: 'Book Appointment', icon: Calendar }, { to: '/dashboard/medical-records', label: 'Medical Records', icon: Activity }, { to: '/dashboard/prescriptions', label: 'Prescriptions', icon: Pill }],
    },
  };

  const cfg = configs[role] || configs.patient;

  return (
    <div>
      <PageHeader title={cfg.title} description={cfg.desc} action={<div className="flex gap-2">{cfg.quickActions.slice(0, 2).map((a) => <Link key={a.to} to={a.to}><Button variant="outline" className="hidden sm:inline-flex"><a.icon className="h-4 w-4" /> {a.label}</Button></Link>)}</div>} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cfg.stats.map((st, i) => <StatCard key={st.label} {...st} delay={i * 0.05} />)}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-display font-bold text-neutral-900">Recent Appointments</h3>
            <Link to="/dashboard/appointments" className="text-sm font-medium text-primary-600 flex items-center gap-1">View all <ArrowUpRight className="h-3.5 w-3.5" /></Link>
          </div>
          <div className="space-y-2">
            {recent.length === 0 ? <p className="py-8 text-center text-sm text-neutral-400">No appointments yet.</p> : recent.map((a) => (
              <div key={a.id} className="flex items-center justify-between rounded-xl border border-neutral-100 p-3">
                <div className="flex items-center gap-3">
                  <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary-100 text-primary-600 text-xs font-semibold">{a.token || 'T-001'}</div>
                  <div><p className="text-sm font-medium text-neutral-900">{a.patientName || 'Patient'}</p><p className="text-xs text-neutral-500">{a.date || 'Today'} · {a.time || '10:00'}</p></div>
                </div>
                <Badge variant={a.status === 'scheduled' ? 'info' : a.status === 'completed' ? 'success' : 'warning'}>{a.status || 'scheduled'}</Badge>
              </div>
            ))}
          </div>
        </Card>
        <Card className="p-5">
          <h3 className="font-display font-bold text-neutral-900">Quick Actions</h3>
          <div className="mt-4 space-y-2">
            {cfg.quickActions.map((a) => (
              <Link key={a.to} to={a.to} className="flex items-center gap-3 rounded-xl border border-neutral-100 p-3 hover:bg-neutral-50 transition-colors">
                <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary-100 text-primary-600"><a.icon className="h-4.5 w-4.5" /></div>
                <span className="text-sm font-medium text-neutral-700">{a.label}</span>
                <ArrowUpRight className="ml-auto h-4 w-4 text-neutral-400" />
              </Link>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'morning'; if (h < 17) return 'afternoon'; return 'evening';
}

function Skeleton() {
  return (
    <div className="space-y-6">
      <div className="skeleton h-10 w-64" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton h-28" />)}</div>
      <div className="grid gap-6 lg:grid-cols-3"><div className="skeleton h-80 lg:col-span-2" /><div className="skeleton h-80" /></div>
    </div>
  );
}
