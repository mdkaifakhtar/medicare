import { useDispatch, useSelector } from 'react-redux';
import { logout as logoutAction } from '../redux/store.js';

// Small convenience wrapper over the auth slice used by guards and layouts.
export function useAuth() {
  const dispatch = useDispatch();
  const { user, token, status, error } = useSelector((s) => s.auth);
  return {
    user,
    token,
    status,
    error,
    role: user?.role || null,
    isAuthenticated: Boolean(user),
    logout: () => dispatch(logoutAction()),
  };
}

// Resolves the correct "Book Appointment" destination for public CTAs.
// Logged-in users go straight to the booking page (never asked to log in again);
// anonymous visitors go to login and are returned to booking afterwards.
export function useBookingLink() {
  const { user } = useSelector((s) => s.auth);
  if (user) {
    const canBook = ['patient', 'receptionist', 'hospital_admin'].includes(user.role);
    return { to: canBook ? '/dashboard/book-appointment' : '/dashboard/appointments', state: undefined };
  }
  return { to: '/login', state: { from: { pathname: '/dashboard/book-appointment' } } };
}

export default useAuth;

