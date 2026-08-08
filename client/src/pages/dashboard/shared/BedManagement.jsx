import { useEffect, useState } from 'react';
import { BedDouble, Building2, Activity, Plus, Search } from 'lucide-react';
import { PageHeader, Card, Badge, Button, Modal, StatCard, EmptyState } from '../../../components/ui/index.jsx';
import { mockApi } from '../../../services/mockApi.js';
import toast from 'react-hot-toast';

export default function BedManagement() {
  const [beds, setBeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [wardFilter, setWardFilter] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ number: '', ward: 'General Ward A', type: 'General', dailyRate: '' });

  const load = () => {
    setLoading(true);
    mockApi.listBeds({ limit: 200 }).then((res) => {
      setBeds(res.items || []);
      setLoading(false);
    });
  };

  useEffect(() => { load(); }, []);

  const wards = [...new Set(beds.map((b) => b.ward))];
  const filtered = beds.filter((b) => {
    if (wardFilter !== 'all' && b.ward !== wardFilter) return false;
    if (search && !b.number.toLowerCase().includes(search.toLowerCase()) && !b.patientName?.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const totalBeds = beds.length;
  const occupied = beds.filter((b) => b.status === 'occupied').length;
  const available = beds.filter((b) => b.status === 'available').length;
  const maintenance = beds.filter((b) => b.status === 'maintenance').length;

  const wardStats = wards.map((w) => {
    const wBeds = beds.filter((b) => b.ward === w);
    return { name: w, total: wBeds.length, occupied: wBeds.filter((b) => b.status === 'occupied').length, available: wBeds.filter((b) => b.status === 'available').length };
  });

  const save = (e) => {
    e.preventDefault();
    mockApi.createBed({ number: form.number, ward: form.ward, type: form.type, dailyRate: Number(form.dailyRate), status: 'available', patientId: null, patientName: null }).then(() => {
      toast.success('Bed added');
      setModalOpen(false);
      setForm({ number: '', ward: 'General Ward A', type: 'General', dailyRate: '' });
      load();
    });
  };

  const toggleStatus = (bed) => {
    const next = bed.status === 'available' ? 'maintenance' : 'available';
    mockApi.updateBed(bed.id, { status: next, patientId: null, patientName: null }).then(() => { load(); toast.success(`Bed ${bed.number} marked ${next}`); });
  };

  return (
    <div>
      <PageHeader title="Beds & Rooms" description="Monitor ward occupancy and bed availability in real-time." action={<Button onClick={() => setModalOpen(true)}><Plus className="h-4 w-4" /> Add Bed</Button>} />
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={BedDouble} label="Total Beds" value={totalBeds} color="primary" delay={0} />
        <StatCard icon={Activity} label="Occupied" value={occupied} color="warning" delay={0.05} />
        <StatCard icon={BedDouble} label="Available" value={available} color="success" delay={0.1} />
        <StatCard icon={Building2} label="Wards" value={wards.length} color="secondary" delay={0.15} />
      </div>

      {wardStats.length > 0 && (
        <div className="mb-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {wardStats.map((w) => {
            const pct = w.total > 0 ? Math.round((w.occupied / w.total) * 100) : 0;
            return (
              <Card key={w.name} className="p-5 card-hover">
                <div className="flex items-start justify-between">
                  <div><h3 className="font-display font-bold text-neutral-900">{w.name}</h3><p className="text-xs text-neutral-500">{w.total} beds</p></div>
                  <Badge variant={pct >= 90 ? 'error' : pct >= 70 ? 'warning' : 'success'}>{pct}% full</Badge>
                </div>
                <div className="mt-4">
                  <div className="flex justify-between text-sm"><span className="text-neutral-500">Occupancy</span><span className="font-medium text-neutral-900">{w.occupied}/{w.total}</span></div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-neutral-100">
                    <div className={`h-full rounded-full ${pct >= 90 ? 'bg-error-500' : pct >= 70 ? 'bg-warning-500' : 'bg-success-500'}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
                <div className="mt-3 flex gap-2 text-xs">
                  <span className="rounded-lg bg-success-100 px-2 py-1 text-success-600">{w.available} available</span>
                  <span className="rounded-lg bg-error-100 px-2 py-1 text-error-600">{w.occupied} occupied</span>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <Card className="overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-100 p-4">
          <div className="relative max-w-xs flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search bed or patient..." className="input pl-9" />
          </div>
          <select value={wardFilter} onChange={(e) => setWardFilter(e.target.value)} className="input max-w-[200px]">
            <option value="all">All Wards</option>
            {wards.map((w) => <option key={w} value={w}>{w}</option>)}
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-neutral-50 text-xs uppercase text-neutral-500">
              <tr><th className="px-4 py-3">Bed No</th><th className="px-4 py-3">Ward</th><th className="px-4 py-3">Type</th><th className="px-4 py-3">Patient</th><th className="px-4 py-3">Rate/day</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Action</th></tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {loading ? (
                <tr><td colSpan="7" className="px-4 py-8 text-center text-neutral-400">Loading...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan="7" className="px-4 py-8"><EmptyState icon={BedDouble} title="No beds found" /></td></tr>
              ) : filtered.map((b) => (
                <tr key={b.id} className="table-row-hover">
                  <td className="px-4 py-3 font-medium text-neutral-900">{b.number}</td>
                  <td className="px-4 py-3 text-neutral-500">{b.ward}</td>
                  <td className="px-4 py-3"><Badge variant="info">{b.type}</Badge></td>
                  <td className="px-4 py-3 text-neutral-500">{b.patientName || '—'}</td>
                  <td className="px-4 py-3">₹{b.dailyRate?.toLocaleString()}</td>
                  <td className="px-4 py-3"><Badge variant={b.status === 'available' ? 'success' : b.status === 'occupied' ? 'error' : 'warning'}>{b.status}</Badge></td>
                  <td className="px-4 py-3"><Button variant="ghost" size="sm" onClick={() => toggleStatus(b)}>{b.status === 'available' ? 'Set Maintenance' : 'Set Available'}</Button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add Bed">
        <form onSubmit={save} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div><label className="label">Bed Number</label><input required value={form.number} onChange={(e) => setForm({ ...form, number: e.target.value })} className="input" placeholder="e.g. G-10" /></div>
            <div><label className="label">Ward</label><select value={form.ward} onChange={(e) => setForm({ ...form, ward: e.target.value })} className="input">{['General Ward A', 'General Ward B', 'Private Ward', 'ICU', 'NICU', 'Post-Op Ward'].map((w) => <option key={w}>{w}</option>)}</select></div>
            <div><label className="label">Type</label><select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="input">{['General', 'Private', 'ICU', 'NICU', 'Surgical'].map((t) => <option key={t}>{t}</option>)}</select></div>
            <div><label className="label">Daily Rate (₹)</label><input type="number" min="0" required value={form.dailyRate} onChange={(e) => setForm({ ...form, dailyRate: e.target.value })} className="input" /></div>
          </div>
          <div className="flex justify-end gap-2"><Button variant="outline" type="button" onClick={() => setModalOpen(false)}>Cancel</Button><Button type="submit">Add</Button></div>
        </form>
      </Modal>
    </div>
  );
}
