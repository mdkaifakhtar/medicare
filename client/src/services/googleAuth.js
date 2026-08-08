// Google Identity Services (GIS) helper — production Google Sign-In without
// Firebase or any third-party auth SDK. The browser receives a Google ID token
// (JWT) which is POSTed to our own Express backend (/api/auth/google) where it
// is verified with google-auth-library before a MedCare JWT pair is issued.

export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
export const hasGoogleClientId = Boolean(GOOGLE_CLIENT_ID);

const GIS_SRC = 'https://accounts.google.com/gsi/client';
let gisPromise = null;

export function loadGoogleScript() {
  if (typeof window === 'undefined') return Promise.reject(new Error('No window'));
  if (window.google?.accounts?.id) return Promise.resolve(window.google);
  if (gisPromise) return gisPromise;
  gisPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${GIS_SRC}"]`);
    const script = existing || document.createElement('script');
    script.src = GIS_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve(window.google);
    script.onerror = () => { gisPromise = null; reject(new Error('Failed to load Google Identity Services')); };
    if (!existing) document.head.appendChild(script);
  });
  return gisPromise;
}

// Decode the (already-verified-by-Google) ID token payload for optimistic UI.
export function decodeGoogleCredential(credential) {
  try {
    const base64 = credential.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const json = decodeURIComponent(
      atob(base64).split('').map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`).join(''),
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
}

// Build an unsigned, clearly-marked demo credential used ONLY when no
// VITE_GOOGLE_CLIENT_ID is configured (offline/preview mode). The backend never
// accepts these — they are consumed by the local mock data layer.
export function buildDemoCredential({ name, email, picture = '' }) {
  const encode = (obj) => btoa(JSON.stringify(obj)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  const header = encode({ alg: 'none', typ: 'JWT' });
  const payload = encode({
    iss: 'https://accounts.google.com',
    sub: `demo-${email}`,
    email,
    email_verified: true,
    name,
    picture,
    demo: true,
    iat: Math.floor(Date.now() / 1000),
  });
  return `${header}.${payload}.demo`;
}
