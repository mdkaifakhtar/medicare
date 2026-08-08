import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Phone, ArrowRight, UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';
import { mockApi } from '../../services/mockApi.js';
import { useDispatch } from 'react-redux';
import { loginAsync } from '../../redux/store.js';
import Logo from '../../components/ui/Logo.jsx';
import ThemeToggle from '../../components/ui/ThemeToggle.jsx';
import GoogleButton from '../../components/auth/GoogleButton.jsx';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '', gender: 'Male', age: '', bloodGroup: 'O+', emergencyContact: '' });
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) return toast.error('Passwords do not match');
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try {
      const res = await mockApi.register({ name: form.name, email: form.email, phone: form.phone, password: form.password, gender: form.gender, age: Number(form.age), bloodGroup: form.bloodGroup, emergencyContact: form.emergencyContact });
      await dispatch(loginAsync({ email: form.email, password: form.password })).unwrap();
      toast.success('Account created! Welcome to MedCare.');
      navigate('/dashboard');
    } catch (err) { toast.error(err.message || 'Registration failed'); }
    finally { setLoading(false); }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-gradient-to-br from-primary-500 via-primary-600 to-secondary-600 lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div className="absolute inset-0 bg-grid-dark opacity-20" />
        <div className="absolute -left-20 bottom-20 h-80 w-80 rounded-full bg-secondary-400/30 blur-3xl" />
        <div className="relative"><Logo className="rounded-xl bg-white px-2.5 py-1.5" /></div>
        <div className="relative text-white">
          <h1 className="font-display text-4xl font-bold leading-tight">Your health journey<br />starts here.</h1>
          <p className="mt-4 max-w-sm text-primary-100">Create a patient account to book appointments, access medical records, pay bills, and manage your healthcare online.</p>
        </div>
        <p className="relative text-xs text-primary-200">© {new Date().getFullYear()} MedCare Hospital</p>
      </div>
      <div className="flex items-center justify-center bg-neutral-50 p-6">
        <div className="w-full max-w-md">
          <div className="mb-6 flex items-center justify-between lg:hidden"><Logo /><ThemeToggle /></div>
          <div className="mb-8 hidden lg:flex lg:justify-end"><ThemeToggle /></div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h2 className="font-display text-3xl font-bold text-neutral-900">Create account</h2>
            <p className="mt-2 text-sm text-neutral-500">Register as a patient to get started.</p>
            <form onSubmit={submit} className="mt-6 space-y-4">
              <div><label className="label">Full Name</label><div className="relative"><User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" /><input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input pl-9" placeholder="John Doe" /></div></div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div><label className="label">Email</label><div className="relative"><Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" /><input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input pl-9" placeholder="you@email.com" /></div></div>
                <div><label className="label">Phone</label><div className="relative"><Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" /><input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input pl-9" placeholder="+91 90000 00000" /></div></div>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div><label className="label">Gender</label><select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })} className="input"><option>Male</option><option>Female</option><option>Other</option></select></div>
                <div><label className="label">Age</label><input required type="number" min="1" max="120" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} className="input" placeholder="30" /></div>
                <div><label className="label">Blood</label><select value={form.bloodGroup} onChange={(e) => setForm({ ...form, bloodGroup: e.target.value })} className="input">{['O+','O-','A+','A-','B+','B-','AB+','AB-'].map((b) => <option key={b}>{b}</option>)}</select></div>
              </div>
              <div><label className="label">Emergency Contact</label><input value={form.emergencyContact} onChange={(e) => setForm({ ...form, emergencyContact: e.target.value })} className="input" placeholder="+91 90000 00000" /></div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div><label className="label">Password</label><div className="relative"><Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" /><input required type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="input pl-9" placeholder="••••••••" /></div></div>
                <div><label className="label">Confirm</label><div className="relative"><Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" /><input required type="password" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} className="input pl-9" placeholder="••••••••" /></div></div>
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full justify-center">{loading ? <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" /> : <><UserPlus className="h-4 w-4" /> Create Account</>}</button>
            </form>

            <GoogleButton mode="signup" redirectTo="/dashboard" />

            <p className="mt-6 text-center text-sm text-neutral-500">Already have an account? <Link to="/login" className="font-semibold text-primary-600 hover:text-primary-700">Sign in</Link></p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
