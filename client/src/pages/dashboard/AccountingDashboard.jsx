import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Wallet, TrendingUp, TrendingDown, Receipt, Shield, CreditCard,
  ArrowDownLeft, ArrowUpRight, Download, Plus, CheckCircle, Clock,
} from 'lucide-react';
import { PageHeader, Card, Badge, Button, Modal, StatCard } from '../../components/ui/index.jsx';
import { RevenueChart } from '../../components/charts/Charts.jsx';
import DataTable from '../../components/ui/DataTable.jsx';
import { mockApi } from '../../services/mockApi.js';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';

export default function AccountingDashboard() {
  const { user } = useSelector((s) => s.auth);
  const [analytics, setAnalytics] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [payments, setPayments] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [expenseModal, setExpenseModal] = useState(false);
  const [expenseForm, setExpenseForm] = useState({ category: '', description: '', amount: '', date: new Date().toISOString().split('T')[0], method: 'Bank Transfer' });

  const load = () => {
    setLoading(true);
    Promise.all([
      mockApi.getAnalytics(),
      mockApi.listInvoices({ limit: 50 }),
      mockApi.listPayments({ limit: 50 }),
      mockApi.listExpenses({ limit: 50 }),
      mockApi.listInsuranceClaims({ limit: 50 }),
    ]).then(([a, inv, pay, exp, clm]) => {
      setAnalytics(a); setInvoices(inv.items); setPayments(pay.items); setExpenses(exp.items); setClaims(clm.items); setLoading(false);
    });
  };
  useEffect(load, []);

  const addExpense = async () => {
    await mockApi.createExpense({ ...expenseForm, amount: Number(expenseForm.amount), status: 'pending' }, { id: user?.id, name: user?.name, role: user?.role });
    toast.success('Expense recorded');
    setExpenseModal(false); setExpenseForm({ category: '', description: '', amount: '', date: new Date().toISOString().split('T')[0], method: 'Bank Transfer' });
    load();
  };

  const approveClaim = async (claim, amount) => {
    await mockApi.approveInsuranceClaim(claim.id, amount, { id: user?.id, name: user?.name, role: user?.role });
    toast.success(`Insurance claim approved for ₹${amount || claim.claimAmount}`);
    load();
  };

  if (!analytics) return <div className="skeleton h-96" />;
  const s = analytics.stats || analytics;
  const paidInvoices = invoices.filter((i) => i.status === 'paid');
  const unpaidInvoices = invoices.filter((i) => i.status === 'unpaid');
  const totalRevenue = paidInvoices.reduce((sum, i) => sum + (i.total || 0), 0) + (s?.revenue || 0);
  const totalExpenses = expenses.filter((e) => e.status === 'paid').reduce((sum, e) => sum + e.amount, 0);
  const pendingClaims = claims.filter((c) => c.status === 'pending');
  const taxCollected = paidInvoices.reduce((sum, i) => sum + i.tax, 0);

  const tabs = [
    { key: 'overview', label: 'Overview', icon: TrendingUp },
    { key: 'invoices', label: 'Invoices', icon: Receipt },
    { key: 'payments', label: 'Payments', icon: CreditCard },
    { key: 'expenses', label: 'Expenses', icon: ArrowDownLeft },
    { key: 'insurance', label: 'Insurance Claims', icon: Shield },
  ];

  return (
    <div>
      <PageHeader title="Accounting & Finance" description="Revenue, expenses, insurance claims, and financial analytics." action={<Button onClick={() => setExpenseModal(true)}><Plus className="h-4 w-4" /> Add Expense</Button>} />

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={TrendingUp} label="Total Revenue" value={`₹${(totalRevenue / 100000).toFixed(1)}L`} change={15} color="success" delay={0} />
        <StatCard icon={TrendingDown} label="Total Expenses" value={`₹${(totalExpenses / 100000).toFixed(1)}L`} change={8} color="error" delay={0.05} />
        <StatCard icon={Wallet} label="Net Profit" value={`₹${((totalRevenue - totalExpenses) / 100000).toFixed(1)}L`} change={12} color="primary" delay={0.1} />
        <StatCard icon={Receipt} label="Tax Collected" value={`₹${(taxCollected / 1000).toFixed(0)}K`} color="warning" delay={0.15} />
      </div>

      {/* Tabs */}
      <div className="mt-6 mb-4 flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition ${activeTab === tab.key ? 'bg-primary-600 text-white shadow-sm' : 'bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50'}`}>
            <tab.icon className="h-4 w-4" /> {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-6">
          <Card className="p-5">
            <h3 className="font-display font-bold text-neutral-900 mb-4">Revenue vs Expenses</h3>
            <RevenueChart data={analytics.revenueTrend || analytics.revenueData || []} />
          </Card>
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="p-5">
              <h3 className="font-display font-bold text-neutral-900 mb-4">Daily Collection (Last 7 Days)</h3>
              <div className="space-y-2">
                {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((day, i) => {
                  const amt = 45000 + Math.round(Math.sin(i) * 12000 + i * 3000);
                  return (
                    <div key={day} className="flex items-center justify-between">
                      <span className="text-sm text-neutral-500">{day}</span>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-32 rounded-full bg-neutral-100"><div className="h-full rounded-full bg-success-500" style={{ width: `${(amt / 70000) * 100}%` }} /></div>
                        <span className="text-sm font-medium text-neutral-900 w-16 text-right">₹{(amt / 1000).toFixed(0)}K</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
            <Card className="p-5">
              <h3 className="font-display font-bold text-neutral-900 mb-4">Payment Methods</h3>
              <div className="space-y-3">
                {[
                  ['UPI', 45, 'primary'], ['Card', 25, 'secondary'], ['Cash', 18, 'accent'],
                  ['Insurance', 8, 'success'], ['Bank Transfer', 4, 'warning'],
                ].map(([method, pct, color]) => (
                  <div key={method}>
                    <div className="flex justify-between text-sm mb-1"><span className="text-neutral-600">{method}</span><span className="font-medium text-neutral-900">{pct}%</span></div>
                    <div className="h-2 rounded-full bg-neutral-100"><div className={`h-full rounded-full bg-${color}-500`} style={{ width: `${pct}%` }} /></div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}

      {activeTab === 'invoices' && (
        <DataTable
          columns={[
            { key: 'invoiceNo', label: 'Invoice #', render: (r) => <span className="font-mono text-xs font-semibold text-primary-600">{r.invoiceNo}</span> },
            { key: 'patientName', label: 'Patient' },
            { key: 'items', label: 'Items', render: (r) => `${r.items?.length || 0} items` },
            { key: 'total', label: 'Amount', render: (r) => `₹${r.total.toLocaleString()}` },
            { key: 'status', label: 'Status', render: (r) => <Badge variant={r.status === 'paid' ? 'success' : 'warning'}>{r.status}</Badge> },
            { key: 'createdAt', label: 'Date', render: (r) => new Date(r.createdAt).toLocaleDateString() },
          ]}
          rows={invoices} loading={loading}
        />
      )}

      {activeTab === 'payments' && (
        <Card className="p-5">
          <h3 className="font-display font-bold text-neutral-900 mb-4">Payment History</h3>
          {payments.length === 0 ? <p className="py-6 text-center text-sm text-neutral-400">No payments recorded yet.</p> : (
            <div className="space-y-2">
              {payments.map((p) => (
                <div key={p.id} className="flex items-center justify-between rounded-xl border border-neutral-100 p-3">
                  <div className="flex items-center gap-3">
                    <div className="grid h-9 w-9 place-items-center rounded-lg bg-success-100 text-success-600"><ArrowUpRight className="h-4.5 w-4.5" /></div>
                    <div><p className="text-sm font-medium text-neutral-900">{p.invoiceNo} — {p.patientName}</p><p className="text-xs text-neutral-500">{p.method} · {new Date(p.createdAt).toLocaleString()}</p></div>
                  </div>
                  <span className="font-semibold text-success-600">+₹{p.amount.toLocaleString()}</span>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {activeTab === 'expenses' && (
        <DataTable
          columns={[
            { key: 'description', label: 'Description', render: (r) => <div><p className="font-medium text-neutral-900">{r.description}</p><p className="text-xs text-neutral-500">{r.category}</p></div> },
            { key: 'amount', label: 'Amount', render: (r) => <span className="text-error-600">₹{r.amount.toLocaleString()}</span> },
            { key: 'method', label: 'Method' },
            { key: 'date', label: 'Date', render: (r) => new Date(r.date).toLocaleDateString() },
            { key: 'status', label: 'Status', render: (r) => <Badge variant={r.status === 'paid' ? 'success' : 'warning'}>{r.status}</Badge> },
          ]}
          rows={expenses} loading={loading}
        />
      )}

      {activeTab === 'insurance' && (
        <Card className="p-5">
          <h3 className="font-display font-bold text-neutral-900 mb-4">Insurance Claims</h3>
          {claims.length === 0 ? <p className="py-6 text-center text-sm text-neutral-400">No insurance claims.</p> : (
            <div className="space-y-3">
              {claims.map((c) => (
                <div key={c.id} className="rounded-xl border border-neutral-100 p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-neutral-900">{c.patientName}</p>
                      <p className="text-xs text-neutral-500">{c.provider} · {c.policyNo}</p>
                    </div>
                    <Badge variant={c.status === 'approved' ? 'success' : 'warning'}>{c.status}</Badge>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="text-sm"><span className="text-neutral-500">Claim:</span> <span className="font-medium text-neutral-900">₹{c.claimAmount.toLocaleString()}</span></div>
                    {c.approvedAmount && <div className="text-sm"><span className="text-neutral-500">Approved:</span> <span className="font-medium text-success-600">₹{c.approvedAmount.toLocaleString()}</span></div>}
                  </div>
                  {c.status === 'pending' && (
                    <Button size="sm" className="mt-3" onClick={() => approveClaim(c, c.claimAmount)}><CheckCircle className="h-3.5 w-3.5" /> Approve Claim</Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {/* Add Expense Modal */}
      <Modal open={expenseModal} onClose={() => setExpenseModal(false)} title="Add Expense">
        <form onSubmit={(e) => { e.preventDefault(); addExpense(); }} className="space-y-4">
          <div><label className="label">Category</label><select required value={expenseForm.category} onChange={(e) => setExpenseForm({ ...expenseForm, category: e.target.value })} className="input">{['Salaries','Equipment','Supplies','Utilities','Maintenance','Marketing','Other'].map((c) => <option key={c}>{c}</option>)}</select></div>
          <div><label className="label">Description</label><input required value={expenseForm.description} onChange={(e) => setExpenseForm({ ...expenseForm, description: e.target.value })} className="input" /></div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div><label className="label">Amount (₹)</label><input type="number" min="0" required value={expenseForm.amount} onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })} className="input" /></div>
            <div><label className="label">Date</label><input type="date" required value={expenseForm.date} onChange={(e) => setExpenseForm({ ...expenseForm, date: e.target.value })} className="input" /></div>
          </div>
          <div><label className="label">Payment Method</label><select value={expenseForm.method} onChange={(e) => setExpenseForm({ ...expenseForm, method: e.target.value })} className="input">{['Cash','Bank Transfer','UPI','Card','Cheque'].map((m) => <option key={m}>{m}</option>)}</select></div>
          <div className="flex justify-end gap-2"><Button variant="outline" type="button" onClick={() => setExpenseModal(false)}>Cancel</Button><Button type="submit">Add Expense</Button></div>
        </form>
      </Modal>
    </div>
  );
}
