import { Outlet, useLocation } from 'react-router-dom';
import PublicNavbar from '../components/public/PublicNavbar.jsx';
import PublicFooter from '../components/public/PublicFooter.jsx';

export default function PublicLayout() {
  const { pathname } = useLocation();
  const isHome = pathname === '/';
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <PublicNavbar transparent={isHome} />
      <main className="flex-1">
        <Outlet />
      </main>
      <PublicFooter />
    </div>
  );
}
