import { useEffect, useState } from 'react';
import { Activity, Wrench, CheckCircle2, Gauge, MapPin, Calendar } from 'lucide-react';
import { PageHeader, Card, Badge, Button, StatCard, Modal } from '../../../components/ui/index.jsx';
import { mockApi } from '../../../services/mockApi.js';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';

const statusConfig = {
  operational: { variant: 'success', label: 'Operational' },
  maintenance: { variant: 'warning', label: 'Maintenance' },
  breakdown: { variant: 'error', label: 'Breakdown' },
};

export default function EquipmentMgmt() {
  const { user } = useSelector((s) => s.auth);
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editEq, setEditEq] = useState(null);
  const [form, setForm] = useState({ status: 'operational', nextService: '', utilization: 0 });

  const load = () => {
    setLoading(true);
    mockApi.listEquipment({ limit: 100 }).then((r) => { setEquipment(r.items); setLoading(false); });
  };
  useEffect(load, []);

  const openEdit = (eq) => { setEditEq(eq); setForm({ status: eq.status, nextService: eq.nextService, utilization: eq.utilization }); };
  const save = async () => {
    await mockApi.updateEquipment(editEq.id, form, { id: user?.id, name: user?.name, role: user?.role });
    toast.success(`${editEq.name} updated`);
    setEditEq(null); load();
  };

  const counts = {
    total: equipment.length,
    operational: equipment.filter((e) => e.status === 'operational').length,
    maintenance: equipment.filter((e) => e.status === 'maintenance').length,
    avgUtil: equipment.length ? Math.round(equipment.reduce((s, e) => s + (e.utilization || 0), 0) / equipment.length) : 0,
  };

  return (
    <div>
      <PageHeader title="Equipment Management" description="Monitor medical equipment status, utilization, and maintenance schedules." />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Activity} label="Total Equipment" value={counts.total} color="primary" delay={0} />
        <StatCard icon={CheckCircle2} label="Operational" value={counts.operational} color="success" delay={0.05} />
        <StatCard icon={Wrench} label="In Maintenance" value={counts.maintenance} color="warning" delay={0.1} />
        <StatCard icon={Gauge} label="Avg Utilization" value={`${counts.avgUtil}%`} color="accent" delay={0.15} />
      </div>

      {loading ? <div className="skeleton h-96" /> : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {equipment.map((eq) => {
            const sc = statusConfig[eq.status] || statusConfig.operational;
            const utilColor = eq.utilization > 80 ? 'error' : eq.utilization > 60 ? 'warning' : 'success';
            return (
              <Card key={eq.id} className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="grid h-12 w-12 place-items-center rounded-xl bg-primary-100 text-primary-600"><Activity className="h-6 w-6" /></div>
                    <div><p className="font-semibold text-neutral-900">{eq.name}</p><p className="text-xs text-neutral-500 flex items-center gap-1"><MapPin className="h-3 w-3" /> {eq.location}</p></div>
                  </div>
                  <Badge variant={sc.variant}>{sc.label}</Badge>
                </div>
                <div className="mb-3">
                  <div className="flex justify-between text-xs mb-1"><span className="text-neutral-500">Utilization</span><span className="font-medium text-neutral-900">{eq.utilization}%</span></div>
                  <div className="h-2 rounded-full bg-neutral-100"><div className={`h-full rounded-full bg-${utilColor}-500`} style={{ width: `${eq.utilization}%` }} /></div>
                </div>
                <div className="flex items-center justify-between text-xs text-neutral-500 mb-4">
                  <span>Last service: {new Date(eq.lastService).toLocaleDateString()}</span>
                  <span>Next: {new Date(eq.nextService).toLocaleDateString()}</span>
                </div>
                <Button size="sm" variant="outline" className="w-full" onClick={() => openEdit(eq)}>Update Status</Button>
              </Card>
            );
          })}
        </div>
      )}

      <Modal open={!!editEq} onClose={() => setEditEq(null)} title={`Update ${editEq?.name || ''}`}>
        <form onSubmit={(e) => { e.preventDefault(); save(); }} className="space-y-4">
          <div><label className="label">Status</label><select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="input">{Object.entries(statusConfig).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}</select></div>
          <div><label className="label">Next Service Date</label><input type="date" value={form.nextService} onChange={(e) => setForm({ ...form, nextService: e.target.value })} className="input" /></div>
          <div><label className="label">Utilization (%)</label><input type="number" min="0" max="100" value={form.utilization} onChange={(e) => setForm({ ...form, utilization: Number(e.target.value) })} className="input" /></div>
          <div className="flex justify-end gap-2"><Button variant="outline" type="button" onClick={() => setEditEq(null)}>Cancel</Button><Button type="submit">Save</Button></div>
        </form>
      </Modal>
    </div>
  );
}
