import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import {
  Users, UserPlus, UserCheck, TrendingUp, TrendingDown,
  Activity, Calendar, Clock, ArrowRight, MoreHorizontal,
  Stethoscope, Heart, Pill, FlaskConical, BedDouble, Ambulance,
  CheckCircle2, ChevronRight, Search, Send, Plus, Bell,
} from 'lucide-react';
import {
  PieChart, Pie, Cell, ResponsiveContainer,
  AreaChart, Area, XAxis, YAxis, Tooltip as RTooltip,
} from 'recharts';
import { mockApi } from '../../services/mockApi.js';

const DONUT_COLORS = ['#2aa870', '#d4f5e4'];
const WEEK_DATA = [
  { day: 'Mon', visits: 120 },
  { day: 'Tue', visits: 145 },
  { day: 'Wed', visits: 132 },
  { day: 'Thu', visits: 168 },
  { day: 'Fri', visits: 190 },
  { day: 'Sat', visits: 175 },
  { day: 'Sun', visits: 140 },
];

const genderData = [
  { name: 'Female', value: 40, color: '#2aa870' },
  { name: 'Male', value: 60, color: '#d4f5e4' },
];

const events = [
  { id: 1, title: 'Team meeting', time: '10:00 AM', on: true },
  { id: 2, title: 'Nobel prize ceremony', time: '02:00 PM', on: true },
  { id: 3, title: 'Board review', time: '04:30 PM', on: false },
];

const todayPatients = [
  { id: 1, name: 'Sarah Johnson', time: '09:00', dept: 'Cardiology', avatar: 'SJ' },
  { id: 2, name: 'Michael Chen', time: '10:30', dept: 'Neurology', avatar: 'MC' },
  { id: 3, name: 'Emily Davis', time: '11:15', dept: 'Pediatrics', avatar: 'ED' },
  { id: 4, name: 'Robert Wilson', time: '14:00', dept: 'Orthopedics', avatar: 'RW' },
  { id: 5, name: 'Lisa Anderson', time: '15:30', dept: 'General', avatar: 'LA' },
];

const chatMessages = [
  { id: 1, from: 'them', text: 'Hello! How can I help you today?', time: '10:24' },
  { id: 2, from: 'me', text: 'I need to reschedule my appointment.', time: '10:25' },
  { id: 3, from: 'them', text: 'Sure, I can help with that. What time works?', time: '10:26' },
];

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.4, ease: [0.16, 1, 0.3, 1] } }),
};

function StatCard({ icon: Icon, label, value, change, changeType, color = 'primary' }) {
  const colorMap = {
    primary: 'bg-primary-100 text-primary-600',
    accent: 'bg-accent-100 text-accent-600',
    success: 'bg-success-100 text-success-600',
    error: 'bg-error-100 text-error-600',
  };
  return (
    <div className="card p-5 card-hover">
      <div className="flex items-start justify-between">
        <div className={`grid h-11 w-11 place-items-center rounded-xl ${colorMap[color]}`}>
          <Icon className="h-5 w-5" />
        </div>
        {change && (
          <span className={`badge ${changeType === 'up' ? 'badge-success' : 'badge-error'}`}>
            {changeType === 'up' ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {change}
          </span>
        )}
      </div>
      <p className="mt-4 font-display text-2xl font-bold text-neutral-900">{value}</p>
      <p className="mt-0.5 text-sm text-neutral-500">{label}</p>
    </div>
  );
}

export default function AdminDashboard() {
  const { user } = useSelector((s) => s.auth);
  const [stats, setStats] = useState({
    totalPatients: 0, doctors: 0, appointments: 0, revenue: 0,
    beds: 0, staff: 0, medicines: 0, labTests: 0,
  });
  const [recentPatients, setRecentPatients] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState(chatMessages);

  useEffect(() => {
    (async () => {
      try {
        const [patients, doctors, appts, beds, staff, meds, labs, invoices] = await Promise.all([
          mockApi.listPatients(), mockApi.listDoctors(), mockApi.listAppointments(),
          mockApi.listBeds(), mockApi.listStaff(), mockApi.listMedicines(),
          mockApi.listLabTests(), mockApi.listInvoices(),
        ]);
        const arr = (r) => r?.items || r || [];
        setStats({
          totalPatients: arr(patients).length, doctors: arr(doctors).length,
          appointments: arr(appts).length, revenue: arr(invoices).reduce((s, i) => s + (i.total || 0), 0),
          beds: arr(beds).length, staff: arr(staff).length, medicines: arr(meds).length, labTests: arr(labs).length,
        });
        setRecentPatients(arr(patients).slice(0, 5));
      } catch { /* mock data fallback */ }
    })();
  }, []);

  const handleSend = () => {
    if (!chatInput.trim()) return;
    setMessages([...messages, { id: Date.now(), from: 'me', text: chatInput, time: 'now' }]);
    setChatInput('');
  };

  return (
    <div className="space-y-6">
      {/* ── Header row ──────────────────────────────────── */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-neutral-900">Dashboard</h1>
          <p className="text-sm text-neutral-500">Welcome back, {user?.name}</p>
        </div>
        <p className="text-sm text-neutral-500">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
      </div>

      {/* ── Main grid: left/center content + right panel ─ */}
      <div className="grid gap-6 xl:grid-cols-[1fr_300px]">
        {/* LEFT / CENTER ───────────────────────────────── */}
        <div className="space-y-6">
          {/* Stat cards row */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* Donut chart card */}
            <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0} className="card p-5">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold text-neutral-700">Patients</p>
                <MoreHorizontal className="h-4 w-4 text-neutral-400" />
              </div>
              <div className="relative h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={genderData} dataKey="value" cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={2} cornerRadius={8}>
                      {genderData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 grid place-items-center">
                  <div className="text-center">
                    <p className="font-display text-2xl font-bold text-neutral-900">784</p>
                    <p className="text-[11px] text-neutral-500">Total</p>
                  </div>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-center gap-4 text-xs">
                <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-primary-500" /> Woman 40%</span>
                <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-primary-100" /> Man 60%</span>
              </div>
            </motion.div>

            {/* New / Old patients card */}
            <motion.div variants={fadeUp} initial="hidden" animate="show" custom={1} className="card p-5">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-semibold text-neutral-700">Patients Overview</p>
                <MoreHorizontal className="h-4 w-4 text-neutral-400" />
              </div>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-neutral-500">New patients</span>
                    <span className="badge badge-success"><TrendingUp className="h-3 w-3" /> +51%</span>
                  </div>
                  <p className="font-display text-xl font-bold text-neutral-900">54</p>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-neutral-100">
                    <div className="h-full rounded-full bg-primary-500" style={{ width: '62%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-neutral-500">Old patients</span>
                    <span className="badge badge-error"><TrendingDown className="h-3 w-3" /> -02%</span>
                  </div>
                  <p className="font-display text-xl font-bold text-neutral-900">32</p>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-neutral-100">
                    <div className="h-full rounded-full bg-primary-300" style={{ width: '38%' }} />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Analytics line chart card */}
            <motion.div variants={fadeUp} initial="hidden" animate="show" custom={2} className="card p-5">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold text-neutral-700">Analytics</p>
                <button className="flex items-center gap-1 rounded-lg bg-neutral-50 px-2 py-1 text-xs font-medium text-neutral-500">
                  This week <ChevronRight className="h-3 w-3 rotate-90" />
                </button>
              </div>
              <div className="h-32">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={WEEK_DATA} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#2aa870" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="#2aa870" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                    <RTooltip cursor={false} contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', fontSize: 12 }} />
                    <Area type="monotone" dataKey="visits" stroke="#2aa870" strokeWidth={2.5} fill="url(#areaGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>

          {/* Quick stat mini-cards */}
          <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
            <StatCard icon={UserCheck} label="Doctors" value={stats.doctors} change="+3" changeType="up" color="primary" />
            <StatCard icon={Calendar} label="Appointments" value={stats.appointments} change="+12" changeType="up" color="accent" />
            <StatCard icon={BedDouble} label="Beds" value={stats.beds} change="-4" changeType="down" color="success" />
            <StatCard icon={FlaskConical} label="Lab Tests" value={stats.labTests} change="+8" changeType="up" color="error" />
          </div>

          {/* Events + Today's patients */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Events */}
            <motion.div variants={fadeUp} initial="hidden" animate="show" custom={3} className="card p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display text-base font-bold text-neutral-900">Events</h3>
                <button className="text-xs font-semibold text-primary-600 hover:text-primary-700">View all</button>
              </div>
              <div className="space-y-3">
                {events.map((ev) => (
                  <div key={ev.id} className="flex items-center justify-between rounded-xl border border-neutral-100 p-3">
                    <div className="flex items-center gap-3">
                      <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary-100 text-primary-600">
                        <Calendar className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-neutral-900">{ev.title}</p>
                        <p className="text-xs text-neutral-500">{ev.time}</p>
                      </div>
                    </div>
                    <button className={`relative h-6 w-11 rounded-full transition-colors ${ev.on ? 'bg-primary-500' : 'bg-neutral-200'}`}>
                      <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${ev.on ? 'translate-x-5' : 'translate-x-0.5'}`} />
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Today's patients */}
            <motion.div variants={fadeUp} initial="hidden" animate="show" custom={4} className="card p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display text-base font-bold text-neutral-900">Your patients today</h3>
                <button className="text-xs font-semibold text-primary-600 hover:text-primary-700">View all</button>
              </div>
              <div className="space-y-2">
                {todayPatients.map((p, i) => (
                  <div key={p.id} className="flex items-center gap-3 rounded-xl hover:bg-neutral-50 p-2 transition">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary-100 text-xs font-bold text-primary-700">
                      {p.avatar}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-neutral-900 truncate">{p.name}</p>
                      <p className="text-xs text-neutral-500">{p.dept}</p>
                    </div>
                    <span className="text-xs font-medium text-neutral-400">{p.time}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* RIGHT PANEL ───────────────────────────────────── */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={5} className="card p-5 xl:sticky xl:top-0 xl:self-start">
          {/* Profile circle with dashed ring */}
          <div className="flex flex-col items-center text-center">
            <div className="relative">
              <div className="grid h-20 w-20 place-items-center rounded-full border-2 border-dashed border-primary-400 p-1">
                <div className="grid h-full w-full place-items-center rounded-full bg-primary-500 text-xl font-bold text-white">
                  {user?.avatar || user?.name?.[0]}
                </div>
              </div>
            </div>
            <p className="mt-3 font-display text-base font-bold text-neutral-900">{user?.name}</p>
            <p className="text-xs text-neutral-500">Administrator</p>
          </div>

          {/* Activity ring */}
          <div className="mt-6 rounded-2xl bg-primary-50 p-4 text-center">
            <div className="relative mx-auto h-24 w-24">
              <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" fill="none" stroke="#d4f5e4" strokeWidth="8" />
                <circle cx="50" cy="50" r="42" fill="none" stroke="#2aa870" strokeWidth="8" strokeLinecap="round" strokeDasharray="264" strokeDashoffset="37" />
              </svg>
              <div className="absolute inset-0 grid place-items-center">
                <span className="font-display text-xl font-bold text-primary-600">86%</span>
              </div>
            </div>
            <p className="mt-2 text-sm font-medium text-neutral-700">Your activity today</p>
          </div>

          <button className="btn-primary w-full justify-center mt-4">
            All activity <ArrowRight className="h-4 w-4" />
          </button>

          {/* Support chat */}
          <div className="mt-6">
            <p className="mb-3 text-sm font-semibold text-neutral-700">Support Chat</p>
            <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-hide">
              {messages.map((m) => (
                <div key={m.id} className={`flex ${m.from === 'me' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-2xl px-3 py-2 text-xs ${m.from === 'me' ? 'bg-primary-500 text-white' : 'bg-neutral-100 text-neutral-700'}`}>
                    {m.text}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 flex items-center gap-2 rounded-xl border border-neutral-200 bg-white p-1.5">
              <input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type a message..."
                className="flex-1 bg-transparent px-2 text-xs focus:outline-none placeholder:text-neutral-400"
              />
              <button onClick={handleSend} className="grid h-7 w-7 place-items-center rounded-lg bg-primary-500 text-white hover:bg-primary-600 transition">
                <Send className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
