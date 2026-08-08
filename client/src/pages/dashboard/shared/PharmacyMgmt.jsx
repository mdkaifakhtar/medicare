import { useEffect, useState } from 'react';
import { Plus, Package, AlertCircle, Search } from 'lucide-react';
import { PageHeader, Card, Badge, Button, Modal, StatCard, EmptyState } from '../../../components/ui/index.jsx';
import { MedicineSalesChart } from '../../../components/charts/Charts.jsx';
import { mockApi } from '../../../services/mockApi.js';
import toast from 'react-hot-toast';

export default function PharmacyMgmt() {
  const [meds, setMeds] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ name: '', category: '', stock: '', price: '', expiry: '', supplier: '', reorderLevel: '' });

  const load = () => {
    setLoading(true);
    mockApi.listMedicines({ limit: 200 }).then((res) => { setMeds(res.items || []); setLoading(false); });
    mockApi.getAnalytics().then(setAnalytics);
  };

  useEffect(() => { load(); }, []);

  const filtered = meds.filter((m) => !search || m.name.toLowerCase().includes(search.toLowerCase()) || m.category.toLowerCase().includes(search.toLowerCase()));
  const lowStock = meds.filter((m) => m.stock <= m.reorderLevel).length;
  const expiringSoon = meds.filter((m) => new Date(m.expiry) < new Date(Date.now() + 90 * 86400000)).length;

  const save = (e) => {
    e.preventDefault();
    mockApi.createMedicine({ name: form.name, category: form.category, stock: Number(form.stock), price: Number(form.price), expiry: form.expiry, supplier: form.supplier, reorderLevel: Number(form.reorderLevel) || 50 }).then(() => {
      toast.success('Medicine added'); setModalOpen(false); setForm({ name: '', category: '', stock: '', price: '', expiry: '', supplier: '', reorderLevel: '' }); load();
    });
  };

  return (
    <div>
      <PageHeader title="Pharmacy Inventory" description="Manage medicine stock, suppliers, and expiry alerts." action={<Button onClick={() => setModalOpen(true)}><Plus className="h-4 w-4" /> Add Medicine</Button>} />
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Package} label="Total Medicines" value={meds.length} color="primary" delay={0} />
        <StatCard icon={Package} label="Total Stock Units" value={meds.reduce((a, m) => a + m.stock, 0)} color="secondary" delay={0.05} />
        <StatCard icon={AlertCircle} label="Low Stock" value={lowStock} color="warning" delay={0.1} />
        <StatCard icon={AlertCircle} label="Expiring Soon" value={expiringSoon} color="error" delay={0.15} />
      </div>

      {analytics && (
        <Card className="mb-6 p-5">
          <h3 className="mb-4 font-display font-bold text-neutral-900">Medicine Sales Trend</h3>
          <MedicineSalesChart data={analytics.medicineSales} />
        </Card>
      )}

      <Card className="overflow-hidden">
        <div className="border-b border-neutral-100 p-4">
          <div className="relative max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search medicines..." className="input pl-9" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-neutral-50 text-xs uppercase text-neutral-500">
              <tr><th className="px-4 py-3">Medicine</th><th className="px-4 py-3">Category</th><th className="px-4 py-3">Stock</th><th className="px-4 py-3">Price</th><th className="px-4 py-3">Expiry</th><th className="px-4 py-3">Supplier</th><th className="px-4 py-3">Status</th></tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {loading ? (
                <tr><td colSpan="7" className="px-4 py-8 text-center text-neutral-400">Loading...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan="7" className="px-4 py-8"><EmptyState icon={Package} title="No medicines found" /></td></tr>
              ) : filtered.map((m) => (
                <tr key={m.id} className="table-row-hover">
                  <td className="px-4 py-3 font-medium text-neutral-900">{m.name}</td>
                  <td className="px-4 py-3"><Badge variant="info">{m.category}</Badge></td>
                  <td className="px-4 py-3">{m.stock}</td>
                  <td className="px-4 py-3">₹{m.price}</td>
                  <td className="px-4 py-3">{new Date(m.expiry).toLocaleDateString('en', { month: 'short', year: 'numeric' })}</td>
                  <td className="px-4 py-3 text-neutral-500">{m.supplier}</td>
                  <td className="px-4 py-3">{m.stock <= m.reorderLevel ? <Badge variant="warning">Low Stock</Badge> : new Date(m.expiry) < new Date(Date.now() + 90 * 86400000) ? <Badge variant="error">Expiring</Badge> : <Badge variant="success">In Stock</Badge>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add Medicine">
        <form onSubmit={save} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div><label className="label">Medicine Name</label><input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input" /></div>
            <div><label className="label">Category</label><input required value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input" /></div>
            <div><label className="label">Stock Quantity</label><input type="number" min="0" required value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className="input" /></div>
            <div><label className="label">Price (₹)</label><input type="number" min="0" required value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="input" /></div>
            <div><label className="label">Expiry Date</label><input type="date" required value={form.expiry} onChange={(e) => setForm({ ...form, expiry: e.target.value })} className="input" /></div>
            <div><label className="label">Supplier</label><input required value={form.supplier} onChange={(e) => setForm({ ...form, supplier: e.target.value })} className="input" /></div>
            <div><label className="label">Reorder Level</label><input type="number" min="0" value={form.reorderLevel} onChange={(e) => setForm({ ...form, reorderLevel: e.target.value })} className="input" placeholder="50" /></div>
          </div>
          <div className="flex justify-end gap-2"><Button variant="outline" type="button" onClick={() => setModalOpen(false)}>Cancel</Button><Button type="submit">Add</Button></div>
        </form>
      </Modal>
    </div>
  );
}
