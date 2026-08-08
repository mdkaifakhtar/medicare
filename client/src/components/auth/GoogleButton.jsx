import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { googleAuthAsync } from '../../redux/store.js';
import {
  GOOGLE_CLIENT_ID, hasGoogleClientId, loadGoogleScript, buildDemoCredential,
} from '../../services/googleAuth.js';

function GoogleGlyph({ className = 'h-5 w-5' }) {
  return (
    <svg className={className} viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.6l6.7-6.7C35.5 2.5 30.1 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.8 6.1C12.3 13.2 17.6 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-2.8-.4-4.1H24v8.5h12.8c-.3 2.1-1.7 5.3-5 7.4l7.6 5.9c4.5-4.2 7.1-10.3 7.1-17.7z" />
      <path fill="#FBBC05" d="M10.4 28.7A14.7 14.7 0 0 1 9.6 24c0-1.6.3-3.2.8-4.7l-7.8-6.1A24 24 0 0 0 0 24c0 3.9.9 7.5 2.6 10.8l7.8-6.1z" />
      <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.8-5.8l-7.6-5.9c-2 1.4-4.8 2.4-8.2 2.4-6.4 0-11.7-3.7-13.6-9l-7.8 6.1C6.5 42.6 14.6 48 24 48z" />
    </svg>
  );
}

/**
 * "Continue with Google" for both Login and Register.
 *
 * With VITE_GOOGLE_CLIENT_ID set, the official Google Identity Services button
 * is rendered and the resulting ID token goes to POST /api/auth/google.
 * Without a client id (offline preview), a clearly-labelled demo account
 * chooser produces the same flow against the local data layer so the whole
 * sign-up → dashboard journey stays testable.
 */
export default function GoogleButton({ mode = 'signin', redirectTo = '/dashboard' }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const holder = useRef(null);
  const [busy, setBusy] = useState(false);
  const [demoOpen, setDemoOpen] = useState(false);
  const [demo, setDemo] = useState({ name: '', email: '' });

  const finish = async (credential) => {
    setBusy(true);
    try {
      const res = await dispatch(googleAuthAsync({ credential })).unwrap();
      toast.success(res.created ? `Account created — welcome, ${res.user.name.split(' ')[0]}!` : `Welcome back, ${res.user.name.split(' ')[0]}!`);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      toast.error(typeof err === 'string' ? err : err?.message || 'Google sign-in failed');
    } finally {
      setBusy(false);
      setDemoOpen(false);
    }
  };

  useEffect(() => {
    if (!hasGoogleClientId) return;
    let cancelled = false;
    loadGoogleScript()
      .then((google) => {
        if (cancelled || !holder.current) return;
        google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: (response) => finish(response.credential),
          auto_select: false,
          cancel_on_tap_outside: true,
          ux_mode: 'popup',
        });
        holder.current.innerHTML = '';
        google.accounts.id.renderButton(holder.current, {
          theme: 'outline',
          size: 'large',
          shape: 'pill',
          width: holder.current.offsetWidth || 320,
          text: mode === 'signup' ? 'signup_with' : 'signin_with',
          logo_alignment: 'left',
        });
      })
      .catch(() => toast.error('Could not load Google Sign-In'));
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  const submitDemo = (e) => {
    e.preventDefault();
    const email = demo.email.trim().toLowerCase();
    if (!email || !demo.name.trim()) return toast.error('Enter a name and Google email');
    finish(buildDemoCredential({ name: demo.name.trim(), email }));
  };

  return (
    <div className="w-full">
      <div className="my-5 flex items-center gap-3">
        <span className="h-px flex-1 bg-neutral-200" />
        <span className="text-xs font-medium uppercase tracking-wide text-neutral-500">or</span>
        <span className="h-px flex-1 bg-neutral-200" />
      </div>

      {hasGoogleClientId ? (
        <div ref={holder} className="flex w-full justify-center [color-scheme:light]" />
      ) : (
        <button
          type="button"
          disabled={busy}
          onClick={() => setDemoOpen(true)}
          className="flex w-full items-center justify-center gap-3 rounded-full border border-neutral-300 bg-white px-5 py-2.5 text-sm font-semibold text-neutral-800 shadow-sm transition hover:border-primary-500 hover:bg-primary-50 hover:text-primary-800 disabled:opacity-50 dark:bg-[#172A22] dark:text-neutral-100"
        >
          <GoogleGlyph />
          {busy ? 'Signing in…' : mode === 'signup' ? 'Sign up with Google' : 'Continue with Google'}
        </button>
      )}

      {demoOpen && (
        <div className="fixed inset-0 z-[60] grid place-items-center bg-neutral-950/50 p-4" role="dialog" aria-modal="true">
          <form onSubmit={submitDemo} className="card w-full max-w-sm p-6">
            <div className="flex items-center gap-3">
              <GoogleGlyph className="h-6 w-6" />
              <div>
                <p className="font-display text-lg font-bold text-neutral-900">Choose an account</p>
                <p className="text-xs text-neutral-500">to continue to MedCare</p>
              </div>
            </div>
            <p className="mt-4 rounded-xl bg-warning-100 px-3 py-2 text-xs font-medium text-[#8a5300]">
              Offline preview mode — set <code>VITE_GOOGLE_CLIENT_ID</code> to use real Google OAuth.
            </p>
            <div className="mt-4 space-y-3">
              <div>
                <label className="label">Full name</label>
                <input autoFocus required value={demo.name} onChange={(e) => setDemo({ ...demo, name: e.target.value })} className="input" placeholder="Rahul Sharma" />
              </div>
              <div>
                <label className="label">Google email</label>
                <input required type="email" value={demo.email} onChange={(e) => setDemo({ ...demo, email: e.target.value })} className="input" placeholder="you@gmail.com" />
              </div>
            </div>
            <div className="mt-5 flex gap-2">
              <button type="button" onClick={() => setDemoOpen(false)} className="btn-white flex-1 justify-center">Cancel</button>
              <button type="submit" disabled={busy} className="btn-primary flex-1 justify-center">{busy ? 'Please wait…' : 'Continue'}</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
