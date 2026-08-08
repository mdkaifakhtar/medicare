import { useEffect, useState } from 'react';
import { Truck, Phone, MapPin, Wrench, CheckCircle2, Clock, Plus } from 'lucide-react';
import { PageHeader, Card, Badge, Button, StatCard, Modal } from '../../../components/ui/index.jsx';
import { mockApi } from '../../../services/mockApi.js';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';

const statusConfig = {
  available: { variant: 'success', label: 'Available' },
  on_call: { variant: 'warning', label: 'On Call' },
  maintenance: { variant: 'error', label: 'Maintenance' },
};

const typeLabels = { ALS: 'Advanced Life Support', BLS: 'Basic Life Support', Neonatal: 'Neonatal Transport' };

export default function AmbulanceMgmt() {
  const { user } = useSelector((s) => s.auth);
  const [ambulances, setAmbulances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editAmb, setEditAmb] = useState(null);
  const [form, setForm] = useState({ status: 'available', location: '', driver: '', driverPhone: '' });

  const load = () => {
    setLoading(true);
    mockApi.listAmbulances({ limit: 100 }).then((r) => { setAmbulances(r.items); setLoading(false); });
  };
  useEffect(load, []);

  const openEdit = (amb) => { setEditAmb(amb); setForm({ status: amb.status, location: amb.location, driver: amb.driver || '', driverPhone: amb.driverPhone || '' }); };
  const save = async () => {
    await mockApi.updateAmbulance(editAmb.id, form, { id: user?.id, name: user?.name, role: user?.role });
    toast.success(`Ambulance ${editAmb.vehicleNo} updated`);
    setEditAmb(null); load();
  };

  const counts = {
    total: ambulances.length,
    available: ambulances.filter((a) => a.status === 'available').length,
    onCall: ambulances.filter((a) => a.status === 'on_call').length,
    maintenance: ambulances.filter((a) => a.status === 'maintenance').length,
  };

  return (
    <div>
      <PageHeader title="Ambulance Fleet" description="Manage ambulance fleet, drivers, and dispatch status." />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Truck} label="Total Vehicles" value={counts.total} color="primary" delay={0} />
        <StatCard icon={CheckCircle2} label="Available" value={counts.available} color="success" delay={0.05} />
        <StatCard icon={Clock} label="On Call" value={counts.onCall} color="warning" delay={0.1} />
        <StatCard icon={Wrench} label="In Maintenance" value={counts.maintenance} color="error" delay={0.15} />
      </div>

      {loading ? <div className="skeleton h-96" /> : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ambulances.map((amb, i) => {
            const sc = statusConfig[amb.status] || statusConfig.available;
            return (
              <Card key={amb.id} className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="grid h-12 w-12 place-items-center rounded-xl bg-primary-100 text-primary-600"><Truck className="h-6 w-6" /></div>
                    <div><p className="font-mono font-semibold text-neutral-900">{amb.vehicleNo}</p><p className="text-xs text-neutral-500">{typeLabels[amb.type] || amb.type}</p></div>
                  </div>
                  <Badge variant={sc.variant}>{sc.label}</Badge>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-neutral-600"><MapPin className="h-4 w-4 text-neutral-400" /> {amb.location}</div>
                  {amb.driver ? (<div className="flex items-center gap-2 text-neutral-600"><Phone className="h-4 w-4 text-neutral-400" /> {amb.driver} · {amb.driverPhone}</div>) : (<div className="text-xs text-neutral-400 italic">No driver assigned</div>)}
                  <div className="flex items-center gap-2 text-neutral-500"><Wrench className="h-4 w-4 text-neutral-400" /> Last service: {new Date(amb.lastService).toLocaleDateString()}</div>
                </div>
                <Button size="sm" variant="outline" className="mt-4 w-full" onClick={() => openEdit(amb)}>Update Status</Button>
              </Card>
            );
          })}
        </div>
      )}

      <Modal open={!!editAmb} onClose={() => setEditAmb(null)} title={`Update ${editAmb?.vehicleNo || ''}`}>
        <form onSubmit={(e) => { e.preventDefault(); save(); }} className="space-y-4">
          <div><label className="label">Status</label><select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="input">{Object.entries(statusConfig).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}</select></div>
          <div><label className="label">Location</label><input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="input" /></div>
          <div><label className="label">Driver Name</label><input value={form.driver} onChange={(e) => setForm({ ...form, driver: e.target.value })} className="input" /></div>
          <div><label className="label">Driver Phone</label><input value={form.driverPhone} onChange={(e) => setForm({ ...form, driverPhone: e.target.value })} className="input" /></div>
          <div className="flex justify-end gap-2"><Button variant="outline" type="button" onClick={() => setEditAmb(null)}>Cancel</Button><Button type="submit">Save</Button></div>
        </form>
      </Modal>
    </div>
  );
}
