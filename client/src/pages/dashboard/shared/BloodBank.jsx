import { useEffect, useState } from 'react';
import { Droplet, Plus, AlertCircle, Search } from 'lucide-react';
import { PageHeader, Card, Badge, Button, Modal, StatCard, EmptyState } from '../../../components/ui/index.jsx';
import { BloodInventoryChart } from '../../../components/charts/Charts.jsx';
import { mockApi } from '../../../services/mockApi.js';
import toast from 'react-hot-toast';

export default function BloodBank() {
  const [bloodData, setBloodData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState(null);
  const [donateOpen, setDonateOpen] = useState(false);
  const [form, setForm] = useState({ name: '', group: 'O+', units: '', phone: '' });

  const load = () => {
    setLoading(true);
    mockApi.listBloodBank({ limit: 50 }).then((res) => { setBloodData(res.items || []); setLoading(false); });
    mockApi.getAnalytics().then(setAnalytics);
  };

  useEffect(() => { load(); }, []);

  const submit = (e) => {
    e.preventDefault();
    const existing = bloodData.find((b) => b.group === form.group);
    if (existing) {
      mockApi.updateBloodBankEntry(existing.id, { units: existing.units + Number(form.units), status: existing.units + Number(form.units) < existing.capacity * 0.3 ? 'low' : 'good' }).then(() => {
        toast.success('Donation recorded. Thank you for saving lives!');
        setDonateOpen(false); setForm({ name: '', group: 'O+', units: '', phone: '' }); load();
      });
    } else {
      toast.error('Unknown blood group');
    }
  };

  const total = bloodData.reduce((a, b) => a + b.units, 0);
  const lowStock = bloodData.filter((b) => b.status === 'low').length;
  const totalCapacity = bloodData.reduce((a, b) => a + b.capacity, 0);

  return (
    <div>
      <PageHeader title="Blood Bank" description="Manage blood inventory, donations, and dispatch." action={<Button onClick={() => setDonateOpen(true)}><Plus className="h-4 w-4" /> Record Donation</Button>} />
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Droplet} label="Total Units" value={total} color="error" delay={0} />
        <StatCard icon={AlertCircle} label="Low Stock Groups" value={lowStock} color="warning" delay={0.05} />
        <StatCard icon={Droplet} label="Total Capacity" value={totalCapacity} color="primary" delay={0.1} />
        <StatCard icon={Plus} label="Blood Groups" value={bloodData.length} color="secondary" delay={0.15} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-5">
          <h3 className="mb-4 font-display font-bold text-neutral-900">Inventory by Blood Group</h3>
          {loading ? <p className="text-neutral-400">Loading...</p> : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {bloodData.map((b) => {
                const pct = b.capacity > 0 ? Math.round((b.units / b.capacity) * 100) : 0;
                return (
                  <div key={b.group} className={`rounded-xl border p-3 text-center ${b.status === 'low' ? 'border-error-300 bg-error-50' : 'border-neutral-200'}`}>
                    <div className="flex items-center justify-center gap-1"><Droplet className={`h-4 w-4 ${b.status === 'low' ? 'text-error-500' : 'text-error-400'}`} /><span className="font-display text-lg font-bold text-neutral-900">{b.group}</span></div>
                    <p className="mt-1 text-sm font-medium text-neutral-700">{b.units} units</p>
                    <p className="text-xs text-neutral-400">of {b.capacity}</p>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-neutral-100"><div className={`h-full rounded-full ${b.status === 'low' ? 'bg-error-500' : 'bg-success-500'}`} style={{ width: `${pct}%` }} /></div>
                    {b.status === 'low' && <Badge variant="error" className="mt-2">Low</Badge>}
                  </div>
                );
              })}
            </div>
          )}
        </Card>
        <Card className="p-5">
          <h3 className="mb-4 font-display font-bold text-neutral-900">Inventory Chart</h3>
          {analytics && <BloodInventoryChart data={analytics.bloodInventory} />}
        </Card>
      </div>

      <Modal open={donateOpen} onClose={() => setDonateOpen(false)} title="Record Blood Donation">
        <form onSubmit={submit} className="space-y-4">
          <div><label className="label">Donor Name</label><input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input" /></div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div><label className="label">Blood Group</label><select value={form.group} onChange={(e) => setForm({ ...form, group: e.target.value })} className="input">{['O+','O-','A+','A-','B+','B-','AB+','AB-'].map((b) => <option key={b}>{b}</option>)}</select></div>
            <div><label className="label">Units (350ml each)</label><input type="number" min="1" max="4" required value={form.units} onChange={(e) => setForm({ ...form, units: e.target.value })} className="input" /></div>
          </div>
          <div><label className="label">Contact Number</label><input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input" /></div>
          <div className="flex justify-end gap-2"><Button variant="outline" type="button" onClick={() => setDonateOpen(false)}>Cancel</Button><Button type="submit">Record</Button></div>
        </form>
      </Modal>
    </div>
  );
}
