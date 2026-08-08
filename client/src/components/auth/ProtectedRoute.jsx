import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ShieldAlert as LoginIcon } from 'lucide-react';

export function ProtectedRoute({ children, roles }) {
  const { user } = useSelector((s) => s.auth);
  const location = useLocation();
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  if (roles && !roles.includes(user.role)) {
    return (
      <div className="grid min-h-screen place-items-center bg-neutral-50 p-6">
        <div className="card max-w-md p-8 text-center">
          <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-error-100 text-error-600">
            <LoginIcon className="h-7 w-7" />
          </div>
          <h1 className="font-display text-xl font-bold text-neutral-900">Access Denied</h1>
          <p className="mt-2 text-sm text-neutral-500">You don't have permission to view this page.</p>
        </div>
      </div>
    );
  }
  return children;
}
