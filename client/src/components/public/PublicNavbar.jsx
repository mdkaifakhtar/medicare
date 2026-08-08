import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, ArrowRight } from 'lucide-react';
import Logo from '../ui/Logo.jsx';
import { useSelector } from 'react-redux';

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/departments', label: 'Departments' },
  { to: '/doctors', label: 'Doctors' },
  { to: '/lab', label: 'Laboratory' },
  { to: '/treatments', label: 'Services' },
  { to: '/blogs', label: 'Blog' },
  { to: '/contact', label: 'Contact' },
];

const moreItems = [
  { to: '/departments', label: 'Departments' },
  { to: '/facilities', label: 'Facilities' },
  { to: '/emergency', label: 'Emergency' },
  { to: '/contact', label: 'Contact' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/testimonials', label: 'Testimonials' },
  { to: '/careers', label: 'Careers' },
  { to: '/faq', label: 'FAQ' },
  { to: '/privacy', label: 'Privacy' },
  { to: '/terms', label: 'Terms' },
];

export default function PublicNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const { pathname } = useLocation();
  const { user } = useSelector((s) => s.auth);

  useEffect(() => { setMobileOpen(false); setMoreOpen(false); }, [pathname]);

  return (
    <header className="public-navbar sticky top-0 z-40 border-b border-neutral-200">
      <nav className="section flex items-center justify-between gap-4 py-3.5">
        <Link to="/" className="shrink-0" aria-label="MedCare home">
          <Logo className="hidden sm:inline-flex" />
          <Logo compact className="sm:hidden" />
        </Link>

        {/* Desktop nav — centered */}
        <div className="hidden flex-1 items-center justify-center gap-1 lg:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `text-sm font-medium px-3 py-2 rounded-full transition-colors ${
                  isActive
                    ? 'text-primary-600'
                    : 'text-neutral-700 hover:text-primary-600'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}

          {/* More dropdown */}
          <div className="relative" onMouseEnter={() => setMoreOpen(true)} onMouseLeave={() => setMoreOpen(false)}>
            <button className="flex items-center gap-1 text-sm font-medium px-3 py-2 rounded-full text-neutral-700 hover:text-primary-600 transition-colors">
              More
              <ChevronDown className={`h-3.5 w-3.5 transition-transform ${moreOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {moreOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.18 }}
                  className="absolute right-0 top-full w-44 pt-3"
                >
                  <div className="card p-2">
                    {moreItems.map((m) => (
                      <Link
                        key={m.to}
                        to={m.to}
                        className="block rounded-xl px-3 py-2 text-sm text-neutral-600 hover:bg-primary-50 hover:text-primary-600 transition"
                      >
                        {m.label}
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right — auth actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {user ? (
            <Link to="/dashboard" className="btn-primary hidden sm:inline-flex items-center gap-2">
              <span className="grid h-6 w-6 shrink-0 place-items-center overflow-hidden rounded-full bg-white/25 text-[10px] font-bold">
                {user?.picture
                  ? <img src={user.picture} alt={`${user?.name || 'User'} profile photo`} className="h-full w-full object-cover" />
                  : (user?.avatar || user?.name?.[0])}
              </span>
              Dashboard <ArrowRight className="h-4 w-4" />
            </Link>

          ) : (
            <>
              <Link to="/login" className="btn-outline hidden sm:inline-flex">Login</Link>
              <Link to="/register" className="btn-primary hidden sm:inline-flex">
                Register <ArrowRight className="h-4 w-4" />
              </Link>
            </>
          )}
          <button
            onClick={() => setMobileOpen(true)}
            className="grid h-10 w-10 place-items-center rounded-xl border border-neutral-200 hover:bg-neutral-50 transition lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-neutral-950/40 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="absolute right-0 top-0 h-full w-80 max-w-[85vw] bg-white p-6 overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <Logo />
                <button onClick={() => setMobileOpen(false)} className="grid h-10 w-10 place-items-center rounded-xl hover:bg-neutral-100 transition">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="flex flex-col gap-1">
                {[...navItems, ...moreItems].map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === '/'}
                    className={({ isActive }) =>
                      `rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                        isActive
                          ? 'bg-primary-50 text-primary-700'
                          : 'text-neutral-700 hover:bg-neutral-50'
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                ))}
              </div>
              <div className="mt-6">
                {user ? (
                  <Link to="/dashboard" className="btn-primary w-full justify-center">
                    Dashboard <ArrowRight className="h-4 w-4" />
                  </Link>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Link to="/login" className="btn-primary w-full justify-center">Sign In</Link>
                    <Link to="/register" className="btn-outline w-full justify-center">Register</Link>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
