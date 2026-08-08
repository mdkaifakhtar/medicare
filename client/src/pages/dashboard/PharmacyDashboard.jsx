import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Package, AlertCircle, Pill, CheckCircle, Clock, Plus, ChevronRight, ArrowUpRight, TrendingUp, TrendingDown, Search, Calendar, FileText, ShoppingCart, Activity, Boxes, ScanBarcode, AlertTriangle, XCircle, DollarSign, Filter, ArrowDownUp } from 'lucide-react';
import { Card, PageHeader, Badge, Button, SectionCard, EmptyState } from '../../components/ui/index.jsx';
import { mockApi } from '../../services/mockApi.js';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';

export default function PharmacyDashboard() {
  const { user } = useSelector((s) => s.auth);
  const [analytics, setAnalytics] = useState(null);
  const [medicines, setMedicines] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [search, setSearch] = useState('');
  const [stockFilter, setStockFilter] = useState('all');

  const load = () => {
    setLoading(true);
    Promise.all([
      mockApi.getAnalytics(),
      mockApi.listMedicines({ limit: 50 }),
      mockApi.listPrescriptions({ limit: 20 }),
    ]).then(([a, m, p]) => {
      setAnalytics(a); setMedicines(m.items); setPrescriptions(p.items); setLoading(false);
    });
  };
  useEffect(load, []);

  // Hooks must run on every render — keep them above the loading early-return.
  const filteredMeds = useMemo(() => {
    return medicines.filter((m) => {
      if (search && !m.name?.toLowerCase().includes(search.toLowerCase()) && !m.category?.toLowerCase().includes(search.toLowerCase())) return false;
      if (stockFilter === 'low' && m.stock >= 20) return false;
      if (stockFilter === 'out' && m.stock !== 0) return false;
      if (stockFilter === 'ok' && m.stock < 20) return false;
      return true;
    });
  }, [medicines, search, stockFilter]);

  if (!analytics) return <DashboardSkeleton />;

  const lowStock = medicines.filter((m) => m.stock < 20 && m.stock > 0);
  const outOfStock = medicines.filter((m) => m.stock === 0);
  const expiringSoon = medicines.filter((m) => {
    if (!m.expiry) return false;
    const diff = new Date(m.expiry) - new Date();
    return diff < 90 * 24 * 60 * 60 * 1000 && diff > 0;
  });
  const expired = medicines.filter((m) => m.expiry && new Date(m.expiry) < new Date());
  const pendingRx = prescriptions.filter((p) => p.status === 'pending' || p.status === 'active');
  const dispensedRx = prescriptions.filter((p) => p.status === 'dispensed');
  const inventoryValue = medicines.reduce((s, m) => s + (m.price || 0) * (m.stock || 0), 0);

  const stockCategories = [
    { label: 'Well Stocked', value: medicines.filter((m) => m.stock >= 50).length, color: 'success', icon: CheckCircle },
    { label: 'Adequate', value: medicines.filter((m) => m.stock >= 20 && m.stock < 50).length, color: 'primary', icon: Boxes },
    { label: 'Low Stock', value: lowStock.length, color: 'warning', icon: AlertTriangle },
    { label: 'Out of Stock', value: outOfStock.length, color: 'error', icon: XCircle },
  ];

  const tabs = [
    { key: 'overview', label: 'Overview', icon: Activity },
    { key: 'inventory', label: 'Inventory', icon: Package, badge: lowStock.length + outOfStock.length },
    { key: 'prescriptions', label: 'Prescriptions', icon: Pill, badge: pendingRx.length },
  ];


  return (
    <div className="space-y-6">
      {/* Header — inventory-system style */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-rose-100 text-rose-600">
              <ScanBarcode className="h-5 w-5" />
            </div>
            <div>
              <h1 className="font-display text-xl font-bold tracking-tight text-neutral-900">Pharmacy Inventory</h1>
              <p className="text-xs text-neutral-500">Stock management & prescription fulfillment</p>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Link to="/dashboard/pharmacy"><Button variant="outline" size="sm"><Package className="h-4 w-4" /> Manage</Button></Link>
          <Link to="/dashboard/prescriptions"><Button size="sm"><Pill className="h-4 w-4" /> Dispense</Button></Link>
        </div>
      </div>

      {/* Inventory KPIs — compact row with value ticker */}
      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="card p-4">
          <div className="flex items-center gap-2 mb-2"><Package className="h-4 w-4 text-primary-500" /><span className="text-xs text-neutral-500">Total Items</span></div>
          <p className="font-display text-2xl font-bold text-neutral-900">{medicines.length}</p>
          <p className="text-xs text-neutral-400 mt-0.5">across {new Set(medicines.map((m) => m.category)).size} categories</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="card p-4">
          <div className="flex items-center gap-2 mb-2"><DollarSign className="h-4 w-4 text-success-500" /><span className="text-xs text-neutral-500">Inventory Value</span></div>
          <p className="font-display text-2xl font-bold text-neutral-900">₹{(inventoryValue / 1000).toFixed(1)}K</p>
          <p className="text-xs text-neutral-400 mt-0.5">current stock value</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card p-4 border-warning-200/60">
          <div className="flex items-center gap-2 mb-2"><AlertTriangle className="h-4 w-4 text-warning-500" /><span className="text-xs text-neutral-500">Low / Out</span></div>
          <p className="font-display text-2xl font-bold text-warning-600">{lowStock.length + outOfStock.length}</p>
          <p className="text-xs text-neutral-400 mt-0.5">{lowStock.length} low · {outOfStock.length} out</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="card p-4 border-error-200/60">
          <div className="flex items-center gap-2 mb-2"><Clock className="h-4 w-4 text-error-500" /><span className="text-xs text-neutral-500">Expiring</span></div>
          <p className="font-display text-2xl font-bold text-error-600">{expiringSoon.length + expired.length}</p>
          <p className="text-xs text-neutral-400 mt-0.5">{expiringSoon.length} soon · {expired.length} expired</p>
        </motion.div>
      </div>

      {/* Alerts strip */}
      {(lowStock.length > 0 || expiringSoon.length > 0 || expired.length > 0) && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap items-center gap-3 rounded-2xl border border-warning-200 bg-warning-50/40 p-4">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-warning-100 text-warning-600">
            <AlertCircle className="h-4.5 w-4.5" />
          </div>
          <div className="flex-1 flex flex-wrap gap-2">
            {lowStock.length > 0 && <span className="rounded-lg bg-warning-100 px-2.5 py-1 text-xs font-medium text-warning-700">{lowStock.length} low stock</span>}
            {expiringSoon.length > 0 && <span className="rounded-lg bg-error-100 px-2.5 py-1 text-xs font-medium text-error-700">{expiringSoon.length} expiring soon</span>}
            {expired.length > 0 && <span className="rounded-lg bg-error-100 px-2.5 py-1 text-xs font-medium text-error-700">{expired.length} expired</span>}
          </div>
          <Button size="sm" variant="outline" onClick={() => setActiveTab('inventory')}>Review</Button>
        </motion.div>
      )}

      {/* Tab navigation — underline style */}
      <div className="flex flex-wrap gap-1.5 border-b border-neutral-200 pb-px">
        {tabs.map((tab) => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className={`relative flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors ${activeTab === tab.key ? 'text-rose-600' : 'text-neutral-500 hover:text-neutral-800'}`}>
            <tab.icon className="h-4 w-4" />
            {tab.label}
            {tab.badge !== undefined && tab.badge > 0 && (
              <span className="rounded-full bg-error-500 px-1.5 py-0.5 text-[10px] font-bold text-white">{tab.badge}</span>
            )}
            {activeTab === tab.key && <motion.div layoutId="pharmTab" className="absolute -bottom-px left-0 right-0 h-0.5 rounded-full bg-rose-600" />}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'overview' && (
          <motion.div key="overview" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }} className="grid gap-6 lg:grid-cols-12">
            {/* Stock distribution donut-like bars — 5 cols */}
            <div className="card p-6 lg:col-span-5">
              <h3 className="font-display text-base font-semibold text-neutral-900">Stock Distribution</h3>
              <p className="mt-0.5 mb-5 text-sm text-neutral-500">Inventory health by stock level</p>
              <div className="space-y-4">
                {stockCategories.map((cat, i) => {
                  const pct = medicines.length ? (cat.value / medicines.length) * 100 : 0;
                  const colorClass = { success: 'bg-success-500', primary: 'bg-primary-500', warning: 'bg-warning-500', error: 'bg-error-500' }[cat.color];
                  return (
                    <motion.div key={cat.label} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <cat.icon className={`h-4 w-4 text-${cat.color}-500`} />
                          <span className="text-sm font-medium text-neutral-700">{cat.label}</span>
                        </div>
                        <span className="font-display text-sm font-bold text-neutral-900">{cat.value}</span>
                      </div>
                      <div className="h-2.5 rounded-full bg-neutral-100 overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ delay: i * 0.06 + 0.2, duration: 0.6, ease: 'easeOut' }} className={`h-full rounded-full ${colorClass}`} />
                      </div>
                    </motion.div>
                  );
                })}
              </div>
              <div className="mt-5 pt-5 border-t border-neutral-100">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-neutral-500">Total Inventory Value</span>
                  <span className="font-display text-lg font-bold text-neutral-900">₹{inventoryValue.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Pending prescriptions — 7 cols */}
            <div className="card p-6 lg:col-span-7">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h3 className="font-display text-base font-semibold text-neutral-900">Pending Fulfillment</h3>
                  <p className="mt-0.5 text-sm text-neutral-500">{pendingRx.length} prescriptions awaiting dispense</p>
                </div>
                <Link to="/dashboard/prescriptions" className="text-sm font-medium text-rose-600 hover:text-rose-700 flex items-center gap-1">View all <ArrowUpRight className="h-3.5 w-3.5" /></Link>
              </div>
              {pendingRx.length === 0 ? <EmptyState icon={Pill} title="No pending prescriptions" description="All prescriptions have been dispensed." /> : (
                <div className="space-y-2">
                  {pendingRx.slice(0, 6).map((rx, i) => (
                    <motion.div key={rx.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                      className="flex items-center gap-3 rounded-xl border border-neutral-100 p-3.5 card-hover group">
                      <div className="grid h-10 w-10 place-items-center rounded-xl bg-rose-100 text-rose-600">
                        <Pill className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-neutral-900 truncate">{rx.patientName || 'Patient'}</p>
                        <p className="text-xs text-neutral-500">{rx.doctorName || 'Doctor'} · {rx.medicines?.length || 0} medicines · {new Date(rx.createdAt).toLocaleDateString('en', { day: 'numeric', month: 'short' })}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="warning" dot>{rx.status}</Badge>
                        <Link to="/dashboard/prescriptions" className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <ChevronRight className="h-4 w-4 text-neutral-400" />
                        </Link>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {activeTab === 'inventory' && (
          <motion.div key="inventory" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }} className="card p-6">
            <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <h3 className="font-display text-base font-semibold text-neutral-900">Medicine Inventory</h3>
              <div className="flex flex-wrap gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                  <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search medicines..." className="input pl-9 w-48" />
                </div>
                <div className="flex gap-1">
                  {[{ k: 'all', l: 'All' }, { k: 'ok', l: 'In Stock' }, { k: 'low', l: 'Low' }, { k: 'out', l: 'Out' }].map((f) => (
                    <button key={f.k} onClick={() => setStockFilter(f.k)}
                      className={`rounded-lg px-3 py-2 text-xs font-medium transition ${stockFilter === f.k ? 'bg-rose-600 text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'}`}>
                      {f.l}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-neutral-100 bg-neutral-50/50">
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-500">Medicine</th>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-500">Category</th>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-500">Stock Level</th>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-500">Price</th>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-500">Expiry</th>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-500">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {filteredMeds.length === 0 ? (
                    <tr><td colSpan={6}><EmptyState icon={Package} title="No medicines found" /></td></tr>
                  ) : filteredMeds.slice(0, 20).map((m, i) => {
                    const isExpired = m.expiry && new Date(m.expiry) < new Date();
                    const isExpiringSoon = m.expiry && !isExpired && new Date(m.expiry) - new Date() < 90 * 24 * 60 * 60 * 1000;
                    return (
                      <motion.tr key={m.id || i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: Math.min(i * 0.02, 0.3) }} className="table-row-hover">
                        <td className="px-4 py-3"><p className="font-medium text-neutral-900">{m.name}</p></td>
                        <td className="px-4 py-3 text-neutral-500">{m.category || 'General'}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-neutral-900 w-8">{m.stock}</span>
                            <div className="h-1.5 w-20 rounded-full bg-neutral-100">
                              <div className={`h-full rounded-full ${m.stock === 0 ? 'bg-error-500' : m.stock < 20 ? 'bg-warning-500' : 'bg-success-500'}`} style={{ width: `${Math.min(100, (m.stock / 100) * 100)}%` }} />
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-neutral-700">₹{m.price || 0}</td>
                        <td className="px-4 py-3">
                          {m.expiry ? (
                            <span className={`text-xs ${isExpired ? 'text-error-600 font-medium' : isExpiringSoon ? 'text-warning-600 font-medium' : 'text-neutral-500'}`}>
                              {new Date(m.expiry).toLocaleDateString('en', { day: 'numeric', month: 'short', year: '2-digit' })}
                            </span>
                          ) : <span className="text-neutral-300">—</span>}
                        </td>
                        <td className="px-4 py-3"><Badge variant={m.stock === 0 ? 'error' : m.stock < 20 ? 'warning' : 'success'} dot>{m.stock === 0 ? 'Out' : m.stock < 20 ? 'Low' : 'OK'}</Badge></td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {activeTab === 'prescriptions' && (
          <motion.div key="prescriptions" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }} className="grid gap-6 lg:grid-cols-2">
            <div className="card p-6">
              <h3 className="font-display text-base font-semibold text-neutral-900 mb-1">Pending</h3>
              <p className="text-sm text-neutral-500 mb-4">{pendingRx.length} awaiting dispense</p>
              {pendingRx.length === 0 ? <EmptyState icon={Clock} title="All caught up" /> : (
                <div className="space-y-2">
                  {pendingRx.map((rx, i) => (
                    <motion.div key={rx.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                      className="flex items-center gap-3 rounded-xl border border-warning-200/60 bg-warning-50/30 p-3.5 card-hover">
                      <div className="grid h-9 w-9 place-items-center rounded-lg bg-warning-100 text-warning-600"><Pill className="h-4.5 w-4.5" /></div>
                      <div className="flex-1 min-w-0"><p className="text-sm font-medium text-neutral-900 truncate">{rx.patientName}</p><p className="text-xs text-neutral-500">{rx.doctorName} · {rx.medicines?.length || 0} meds</p></div>
                      <Badge variant="warning" dot>{rx.status}</Badge>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
            <div className="card p-6">
              <h3 className="font-display text-base font-semibold text-neutral-900 mb-1">Dispensed</h3>
              <p className="text-sm text-neutral-500 mb-4">{dispensedRx.length} completed today</p>
              {dispensedRx.length === 0 ? <EmptyState icon={CheckCircle} title="None dispensed yet" /> : (
                <div className="space-y-2">
                  {dispensedRx.slice(0, 8).map((rx, i) => (
                    <motion.div key={rx.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                      className="flex items-center gap-3 rounded-xl border border-success-200/60 bg-success-50/30 p-3.5 card-hover">
                      <div className="grid h-9 w-9 place-items-center rounded-lg bg-success-100 text-success-600"><CheckCircle className="h-4.5 w-4.5" /></div>
                      <div className="flex-1 min-w-0"><p className="text-sm font-medium text-neutral-900 truncate">{rx.patientName}</p><p className="text-xs text-neutral-500">{rx.doctorName} · {rx.medicines?.length || 0} meds</p></div>
                      <Badge variant="success" dot>{rx.status}</Badge>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="skeleton h-10 w-64" />
      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton h-24" />)}</div>
      <div className="skeleton h-80" />
    </div>
  );
}
