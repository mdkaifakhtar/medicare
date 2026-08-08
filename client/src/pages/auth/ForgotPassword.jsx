import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, ArrowRight, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { mockApi } from '../../services/mockApi.js';
import Logo from '../../components/ui/Logo.jsx';
import ThemeToggle from '../../components/ui/ThemeToggle.jsx';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try { await mockApi.forgotPassword(email); setSent(true); toast.success('Reset link sent!'); }
    catch { toast.error('Something went wrong'); }
    finally { setLoading(false); }
  };

  return (
    <div className="grid min-h-screen place-items-center bg-neutral-50 p-6">
      <div className="mb-6 flex items-center justify-between w-full max-w-md"><Logo /><ThemeToggle /></div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card w-full max-w-md p-8">
        {sent ? (
          <div className="text-center">
            <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-success-100 text-success-600"><CheckCircle className="h-7 w-7" /></div>
            <h2 className="font-display text-xl font-bold text-neutral-900">Check your email</h2>
            <p className="mt-2 text-sm text-neutral-500">We've sent a password reset link to <span className="font-medium text-neutral-700">{email}</span>. The link expires in 30 minutes.</p>
            <Link to="/login" className="btn-primary mt-6 w-full justify-center">Back to Sign In</Link>
          </div>
        ) : (
          <>
            <h2 className="font-display text-2xl font-bold text-neutral-900">Forgot password?</h2>
            <p className="mt-2 text-sm text-neutral-500">Enter your email and we'll send you a reset link.</p>
            <form onSubmit={submit} className="mt-6 space-y-4">
              <div><label className="label">Email address</label><div className="relative"><Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" /><input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input pl-9" placeholder="you@medcare.health" /></div></div>
              <button type="submit" disabled={loading} className="btn-primary w-full justify-center">{loading ? <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" /> : <>Send Reset Link <ArrowRight className="h-4 w-4" /></>}</button>
            </form>
            <p className="mt-6 text-center text-sm text-neutral-500"><Link to="/login" className="font-semibold text-primary-600">Back to sign in</Link></p>
          </>
        )}
      </motion.div>
    </div>
  );
}
