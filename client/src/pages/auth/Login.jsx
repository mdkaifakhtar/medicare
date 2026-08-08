import { useState } from 'react';
import { Link, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, Activity, Heart } from 'lucide-react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { loginAsync } from '../../redux/store.js';
import Logo from '../../components/ui/Logo.jsx';
import ThemeToggle from '../../components/ui/ThemeToggle.jsx';
import GoogleButton from '../../components/auth/GoogleButton.jsx';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { user: currentUser } = useSelector((s) => s.auth);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await dispatch(loginAsync(form)).unwrap();
      toast.success(`Welcome back, ${res.user.name.split(' ')[0]}!`);
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err || 'Login failed');
    } finally { setLoading(false); }
  };

  // Already signed in? Never ask again — go straight to the intended page.
  if (currentUser) return <Navigate to={from} replace />;

  const quickFill = (email, password) => setForm({ email, password });

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Left visual */}
      <div className="relative hidden overflow-hidden bg-gradient-to-br from-primary-500 via-primary-600 to-secondary-600 lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div className="absolute inset-0 bg-grid-dark opacity-20" />
        <div className="absolute -right-20 top-20 h-80 w-80 rounded-full bg-secondary-400/30 blur-3xl" />
        <div className="absolute -left-10 bottom-20 h-64 w-64 rounded-full bg-accent-400/15 blur-3xl" />
        <div className="relative"><Logo className="rounded-xl bg-white px-2.5 py-1.5" /></div>
        <div className="relative text-white">
          <h1 className="font-display text-4xl font-bold leading-tight">Welcome back to<br />better healthcare.</h1>
          <p className="mt-4 max-w-sm text-primary-100">Sign in to manage appointments, prescriptions, lab reports, billing, and more — all in one secure place.</p>
          <div className="mt-8 space-y-3">
            {[['HIPAA-grade security', ShieldCheck], ['Real-time updates', Activity], ['Compassionate care', Heart]].map(([t, Icon]) => (
              <div key={t} className="flex items-center gap-3 text-primary-100"><div className="grid h-9 w-9 place-items-center rounded-lg bg-white/10"><Icon className="h-5 w-5" /></div>{t}</div>
            ))}
          </div>
        </div>
        <p className="relative text-xs text-primary-200">© {new Date().getFullYear()} MedCare Hospital. All rights reserved.</p>
      </div>

      {/* Right form */}
      <div className="flex items-center justify-center bg-neutral-50 p-6">
        <div className="w-full max-w-md">
          <div className="mb-6 flex items-center justify-between lg:hidden"><Logo /><ThemeToggle /></div>
          <div className="mb-8 hidden lg:flex lg:justify-end"><ThemeToggle /></div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h2 className="font-display text-3xl font-bold text-neutral-900">Sign in</h2>
            <p className="mt-2 text-sm text-neutral-500">Enter your credentials to access your dashboard.</p>
            <form onSubmit={submit} className="mt-8 space-y-4">
              <div>
                <label className="label">Email address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                  <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@medcare.health" className="input pl-9" />
                </div>
              </div>
              <div>
                <label className="label">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                  <input required type={show ? 'text' : 'password'} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="••••••••" className="input pl-9 pr-9" />
                  <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600">{show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-neutral-600"><input type="checkbox" className="rounded border-neutral-300" /> Remember me</label>
                <Link to="/forgot-password" className="font-medium text-primary-600 hover:text-primary-700">Forgot password?</Link>
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full justify-center">{loading ? <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" /> : <>Sign In <ArrowRight className="h-4 w-4" /></>}</button>
            </form>

            <GoogleButton mode="signin" redirectTo={from} />

            <div className="mt-6 rounded-xl border border-neutral-200 bg-neutral-50 p-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-neutral-500">Demo Credentials</p>
              <div className="grid grid-cols-1 gap-1.5 text-xs">
              {[
  ['Hospital Admin', 'hadmin@medcare.health', 'Hospital@123'],
  ['Doctor', 'ananya@medcare.health', 'Doctor@123'],
  ['Patient', 'rahul@example.com', 'Patient@123'],
  ['Reception', 'reception@medcare.health', 'Reception@123'],
  ['Lab Technician', 'lab@medcare.health', 'Lab@123'],
  ['Nurse', 'nurse@medcare.health', 'Nurse@123'],
  ['Pharmacist', 'pharmacy@medcare.health', 'Pharmacy@123'],
].map(([role, email, pwd]) => (
                  <button key={email} type="button" onClick={() => quickFill(email, pwd)} className="flex items-center justify-between rounded-lg px-2 py-1.5 text-left hover:bg-white">
                    <span className="font-medium text-neutral-700">{role}</span>
                    <span className="text-neutral-500">{email}</span>
                  </button>
                ))}
              </div>
            </div>

            <p className="mt-6 text-center text-sm text-neutral-500">Don't have an account? <Link to="/register" className="font-semibold text-primary-600 hover:text-primary-700">Register here</Link></p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
