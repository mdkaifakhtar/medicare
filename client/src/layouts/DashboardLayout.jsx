import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu, X, LogOut, Bell, Search, CheckCheck,
  Settings, User, Sun, Moon, Command, CornerDownLeft, Home,
} from 'lucide-react';
import { useState, useEffect, useCallback, useRef } from 'react';
import { toggleMobileSidebar, setMobileSidebar, logout } from '../redux/store.js';
import { navByRole, roleLabels } from '../config/navigation.js';
import { mockApi } from '../services/mockApi.js';
import ThemeToggle from '../components/ui/ThemeToggle.jsx';
import Logo from '../components/ui/Logo.jsx';

import { useTheme } from '../context/ThemeContext.jsx';

export default function DashboardLayout() {
  const { user } = useSelector((s) => s.auth);
  const { mobileSidebarOpen } = useSelector((s) => s.ui);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [cmdQuery, setCmdQuery] = useState('');
  const cmdRef = useRef(null);

  const nav = navByRole[user?.role] || navByRole.patient;
  const { theme, toggle } = useTheme();

  const fetchNotifs = useCallback(() => {
    if (user?.id) mockApi.listNotificationsFor(user.role, user.id).then((res) => setNotifications(res?.items || []));
  }, [user?.id, user?.role]);

  useEffect(() => {
    fetchNotifs();
    const interval = setInterval(fetchNotifs, 15000);
    return () => clearInterval(interval);
  }, [fetchNotifs]);

  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setCmdOpen((v) => !v); }
      if (e.key === 'Escape') { setCmdOpen(false); setNotifOpen(false); setProfileOpen(false); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = async () => {
    await mockApi.markAllNotificationsRead(user.role, user.id);
    fetchNotifs();
  };

  const handleLogout = () => { dispatch(logout()); navigate('/'); };

  const allNavItems = nav.flatMap((s) => s.items);
  const cmdResults = cmdQuery
    ? allNavItems.filter((item) => item.label.toLowerCase().includes(cmdQuery.toLowerCase()))
    : allNavItems;

  // Flatten all nav items for the icon sidebar
  const flatItems = nav.flatMap((s) => s.items);

  const IconSidebar = () => (
    <div className="flex h-full flex-col items-center py-4">
      {/* Logo mark */}
      <div className="mb-6 grid h-10 w-10 place-items-center rounded-xl bg-white/20 shrink-0">
        <Logo compact />
      </div>


      {/* Nav icons */}
      <nav className="flex-1 flex flex-col items-center gap-1.5 overflow-y-auto scrollbar-hide">
        {flatItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/dashboard'}
            onClick={() => dispatch(setMobileSidebar(false))}
            className={({ isActive }) =>
              `group relative grid h-11 w-11 place-items-center rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-white/25 text-white'
                  : 'text-white/70 hover:bg-white/15 hover:text-white'
              }`
            }
            title={item.label}
          >
            {({ isActive }) => (
              <>
                <item.icon className="h-5 w-5" />
                {/* Tooltip */}
                <span className="pointer-events-none absolute left-14 z-50 whitespace-nowrap rounded-lg bg-neutral-900 px-2.5 py-1.5 text-xs font-medium text-white opacity-0 transition-opacity group-hover:opacity-100 shadow-lg">
                  {item.label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User avatar + logout */}
      <div className="mt-4 flex flex-col items-center gap-3">
        <button
          onClick={() => navigate('/dashboard/profile')}
          className="grid h-10 w-10 place-items-center overflow-hidden rounded-full bg-white/25 text-sm font-bold text-white ring-2 ring-white/30 hover:ring-white/60 transition"
          title={user?.name}
        >
          {user?.picture
            ? <img src={user.picture} alt={`${user?.name || 'User'} profile photo`} className="h-full w-full object-cover" />
            : (user?.avatar || user?.name?.[0])}
        </button>

        <button
          onClick={handleLogout}
          className="grid h-10 w-10 place-items-center rounded-xl text-white/70 hover:bg-white/15 hover:text-white transition"
          title="Sign Out"
        >
          <LogOut className="h-5 w-5" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="dash-bg min-h-screen">
      {/* ── Desktop layout ─────────────────────────────── */}
      <div className="hidden lg:flex h-screen overflow-hidden">
        {/* Icon sidebar */}
        <aside className="w-[72px] shrink-0 bg-sidebar">
          <IconSidebar />
        </aside>

        {/* Main content */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Header */}
          <header className="flex h-16 items-center justify-between px-6">
            {/* Search */}
            <button
              onClick={() => setCmdOpen(true)}
              className="group flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-sm text-neutral-400 hover:border-primary-300 transition w-full max-w-md"
            >
              <Search className="h-4 w-4 shrink-0" />
              <span className="flex-1 text-left truncate">Search anything...</span>
              <kbd className="inline-flex items-center rounded-md border border-neutral-200 bg-neutral-50 px-1.5 py-0.5 text-[10px] font-medium text-neutral-400">
                ⌘K
              </kbd>
            </button>

            {/* Right actions */}
            <div className="flex items-center gap-3">
              {/* Back to the public website — keeps the session intact */}
              <Link
                to="/"
                className="hidden items-center gap-2 rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition sm:inline-flex"
              >
                <Home className="h-4 w-4 text-primary-600" /> Back to Website
              </Link>
              <ThemeToggle />
              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
                  className="relative grid h-10 w-10 place-items-center rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 transition"
                >
                  <Bell className="h-5 w-5 text-neutral-600" />
                  {unreadCount > 0 && (
                    <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-primary-500 px-1 text-[10px] font-bold text-white ring-2 ring-white">
                      {unreadCount}
                    </span>
                  )}
                </button>
                <AnimatePresence>
                  {notifOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.97 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-2 w-80 card p-2 z-50 shadow-card-lg"
                      >
                        <div className="flex items-center justify-between px-3 py-2">
                          <p className="text-sm font-semibold text-neutral-900">Notifications</p>
                          {unreadCount > 0 && (
                            <button onClick={markAllRead} className="flex items-center gap-1 text-xs font-medium text-primary-600 hover:text-primary-700">
                              <CheckCheck className="h-3.5 w-3.5" /> Mark all read
                            </button>
                          )}
                        </div>
                        <div className="divider" />
                        <div className="max-h-80 overflow-y-auto">
                          {notifications.length === 0 ? (
                            <p className="px-3 py-8 text-center text-sm text-neutral-400">No notifications.</p>
                          ) : (
                            notifications.slice(0, 12).map((n) => (
                              <div key={n.id} className={`rounded-xl px-3 py-2.5 hover:bg-neutral-50 transition ${!n.read ? 'bg-primary-50/40' : ''}`}>
                                <div className="flex items-start gap-2.5">
                                  <span className={`mt-1.5 h-2 w-2 rounded-full shrink-0 ${n.priority === 'high' ? 'bg-error-500' : !n.read ? 'bg-primary-500' : 'bg-neutral-300'}`} />
                                  <div>
                                    <p className="text-sm font-medium text-neutral-900 leading-snug">{n.message}</p>
                                    <p className="mt-0.5 text-xs text-neutral-400">{new Date(n.createdAt).toLocaleString()}</p>
                                  </div>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

              {/* Profile */}
              <div className="relative">
                <button
                  onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
                  className="flex items-center gap-2.5 rounded-xl border border-neutral-200 bg-white px-2 py-1.5 hover:bg-neutral-50 transition"
                >
                  <div className="grid h-8 w-8 place-items-center overflow-hidden rounded-lg bg-primary-500 text-xs font-semibold text-white">
                    {user?.picture
                      ? <img src={user.picture} alt={`${user?.name || 'User'} profile photo`} className="h-full w-full object-cover" />
                      : (user?.avatar || user?.name?.[0])}
                  </div>

                  <div className="hidden text-left leading-tight sm:block">
                    <p className="text-sm font-semibold text-neutral-900">{user?.name}</p>
                    <p className="text-xs text-neutral-500">{roleLabels[user?.role]}</p>
                  </div>
                </button>
                <AnimatePresence>
                  {profileOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.97 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-2 w-60 card p-2 z-50 shadow-card-lg"
                      >
                        <div className="px-3 py-2.5 border-b border-neutral-100">
                          <p className="text-sm font-semibold text-neutral-900">{user?.name}</p>
                          <p className="text-xs text-neutral-500">{user?.email}</p>
                        </div>
                        <div className="py-1">
                          <button onClick={() => { navigate('/dashboard/profile'); setProfileOpen(false); }} className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-100 transition">
                            <User className="h-4 w-4 text-neutral-400" /> Profile
                          </button>
                          <button onClick={() => { navigate('/'); setProfileOpen(false); }} className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-100 transition">
                            <Home className="h-4 w-4 text-neutral-400" /> Back to Website
                          </button>
                          <button onClick={() => { navigate('/dashboard/settings'); setProfileOpen(false); }} className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-100 transition">
                            <Settings className="h-4 w-4 text-neutral-400" /> Settings
                          </button>
                          <button onClick={toggle} className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-100 transition">
                            {theme === 'dark' ? <Sun className="h-4 w-4 text-neutral-400" /> : <Moon className="h-4 w-4 text-neutral-400" />}
                            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                          </button>
                        </div>
                        <div className="divider my-1" />
                        <button onClick={handleLogout} className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-error-600 hover:bg-error-50 transition">
                          <LogOut className="h-4 w-4" /> Sign Out
                        </button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </header>

          {/* Page content */}
          <main className="flex-1 overflow-y-auto">
            <div className="mx-auto max-w-7xl px-6 py-6 lg:py-8">
              <Outlet />
            </div>
          </main>
        </div>
      </div>

      {/* ── Mobile layout ──────────────────────────────── */}
      <div className="lg:hidden">
        {/* Mobile header */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between bg-white border-b border-neutral-200 px-4">
          <button onClick={() => dispatch(toggleMobileSidebar())} className="grid h-10 w-10 place-items-center rounded-xl border border-neutral-200">
            <Menu className="h-5 w-5" />
          </button>
          <Logo compact />

          <div className="grid h-10 w-10 place-items-center overflow-hidden rounded-xl bg-primary-500 text-xs font-bold text-white">
            {user?.picture
              ? <img src={user.picture} alt={`${user?.name || 'User'} profile photo`} className="h-full w-full object-cover" />
              : (user?.avatar || user?.name?.[0])}
          </div>

        </header>

        {/* Mobile drawer */}
        <AnimatePresence>
          {mobileSidebarOpen && (
            <div className="fixed inset-0 z-50">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => dispatch(setMobileSidebar(false))} className="absolute inset-0 bg-neutral-950/50 backdrop-blur-sm" />
              <motion.aside
                initial={{ x: -280 }}
                animate={{ x: 0 }}
                exit={{ x: -280 }}
                transition={{ type: 'spring', damping: 32, stiffness: 320 }}
                className="absolute left-0 top-0 h-full w-64 bg-sidebar"
              >
                <div className="flex h-full flex-col">
                  <div className="flex h-16 items-center justify-between px-5 border-b border-white/20">
                    <span className="font-display text-lg font-bold text-white">MedCare</span>
                    <button onClick={() => dispatch(setMobileSidebar(false))} className="grid h-9 w-9 place-items-center rounded-xl text-white/80 hover:bg-white/10">
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  <nav className="flex-1 overflow-y-auto px-3 py-4 scrollbar-hide">
                    {nav.map((section) => (
                      <div key={section.group} className="mb-4">
                        <p className="mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-wider text-white/50">{section.group}</p>
                        <div className="space-y-0.5">
                          {section.items.map((item) => (
                            <NavLink
                              key={item.to}
                              to={item.to}
                              end={item.to === '/dashboard'}
                              onClick={() => dispatch(setMobileSidebar(false))}
                              className={({ isActive }) =>
                                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                                  isActive ? 'bg-white/25 text-white' : 'text-white/70 hover:bg-white/15 hover:text-white'
                                }`
                              }
                            >
                              <item.icon className="h-5 w-5 shrink-0" />
                              <span className="truncate">{item.label}</span>
                            </NavLink>
                          ))}
                        </div>
                      </div>
                    ))}
                  </nav>
                  <div className="border-t border-white/20 p-3 space-y-1">
                    <Link
                      to="/"
                      onClick={() => dispatch(setMobileSidebar(false))}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/80 hover:bg-white/15 hover:text-white transition"
                    >
                      <Home className="h-5 w-5" /> Back to Website
                    </Link>
                    <button onClick={handleLogout} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/70 hover:bg-white/15 transition">
                      <LogOut className="h-5 w-5" /> Sign Out
                    </button>
                  </div>
                </div>
              </motion.aside>
            </div>
          )}
        </AnimatePresence>

        {/* Mobile content */}
        <main className="dash-bg min-h-[calc(100vh-4rem)] px-4 py-6">
          <Outlet />
        </main>
      </div>

      {/* Command Palette */}
      <AnimatePresence>
        {cmdOpen && (
          <div className="fixed inset-0 z-[60] flex items-start justify-center p-4 pt-[15vh]">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setCmdOpen(false)} className="absolute inset-0 bg-neutral-950/50 backdrop-blur-md" />
            <motion.div
              ref={cmdRef}
              initial={{ opacity: 0, scale: 0.97, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: -8 }}
              transition={{ duration: 0.15 }}
              className="relative w-full max-w-xl card overflow-hidden shadow-card-lg"
            >
              <div className="flex items-center gap-3 border-b border-neutral-100 px-4">
                <Search className="h-5 w-5 text-neutral-400" />
                <input
                  autoFocus
                  value={cmdQuery}
                  onChange={(e) => setCmdQuery(e.target.value)}
                  placeholder="Type a command or search..."
                  className="flex-1 bg-transparent py-4 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none"
                />
                <kbd className="rounded-md border border-neutral-200 bg-neutral-50 px-1.5 py-0.5 text-[10px] font-medium text-neutral-400">ESC</kbd>
              </div>
              <div className="max-h-80 overflow-y-auto p-2">
                {cmdResults.length === 0 ? (
                  <p className="px-3 py-8 text-center text-sm text-neutral-400">No results found.</p>
                ) : (
                  cmdResults.map((item) => (
                    <button
                      key={item.to}
                      onClick={() => { navigate(item.to); setCmdOpen(false); setCmdQuery(''); }}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-neutral-700 hover:bg-primary-50 transition group"
                    >
                      <item.icon className="h-4 w-4 text-neutral-400 group-hover:text-primary-500" />
                      <span className="flex-1 text-left">{item.label}</span>
                      <CornerDownLeft className="h-3.5 w-3.5 text-neutral-300 opacity-0 group-hover:opacity-100" />
                    </button>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
