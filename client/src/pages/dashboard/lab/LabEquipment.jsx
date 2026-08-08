import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Microscope, Beaker, Activity, ShieldCheck, TrendingUp, Clock,
  Search, Plus,
} from 'lucide-react';
import { PageHeader, Card, Badge, Button, Modal, StatCard, SectionCard, EmptyState } from '../../../components/ui/index.jsx';
import { mockApi } from '../../../services/mockApi.js';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';

export default function LabEquipment() {
  const { user } = useSelector((s) => s.auth);
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const load = () => {
    setLoading(true);
    mockApi.listEquipment({ limit: 100 }).then((r) => { setEquipment(r.items); setLoading(false); });
  };
  useEffect(load, []);

  const filtered = equipment.filter((e) =>
    !search || e.name?.toLowerCase().includes(search.toLowerCase()) || e.location?.toLowerCase().includes(search.toLowerCase())
  );

  const operational = equipment.filter((e) => e.status === 'operational');
  const maintenance = equipment.filter((e) => e.status === 'maintenance' || e.status === 'under_maintenance');
  const avgUtilization = equipment.length > 0 ? Math.round(equipment.reduce((s, e) => s + (e.utilization || 0), 0) / equipment.length) : 0;

  const updateStatus = async (eq, status) => {
    await mockApi.updateEquipment(eq.id, { status }, { id: user?.id, name: user?.name, role: user?.role });
    toast.success(`${eq.name} marked as ${status}`);
    load();
  };

  return (
    <div>
      <PageHeader title="Equipment Status" description="Real-time monitoring of all laboratory and diagnostic equipment." breadcrumb="Laboratory · Equipment" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Microscope} label="Total Equipment" value={equipment.length} color="primary" delay={0} />
        <StatCard icon={ShieldCheck} label="Operational" value={operational.length} color="success" delay={0.05} />
        <StatCard icon={Clock} label="Under Maintenance" value={maintenance.length} color="warning" delay={0.1} />
        <StatCard icon={TrendingUp} label="Avg Utilization" value={`${avgUtilization}%`} color="accent" delay={0.15} />
      </div>

      <div className="mt-6 mb-4 relative max-w-xs">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search equipment..." className="input pl-9" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => <div key={i} className="skeleton h-48" />)
        ) : filtered.length === 0 ? (
          <div className="col-span-full"><EmptyState icon={Microscope} title="No equipment found" /></div>
        ) : (
          filtered.map((eq, i) => (
            <motion.div key={eq.id || i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
              <SectionCard className="h-full card-hover">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`grid h-11 w-11 place-items-center rounded-xl ${eq.status === 'operational' ? 'bg-success-100 text-success-600' : 'bg-warning-100 text-warning-600'}`}>
                      <Beaker className="h-5.5 w-5.5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-neutral-900">{eq.name}</p>
                      <p className="text-xs text-neutral-500">{eq.location || 'General'}</p>
                    </div>
                  </div>
                  <Badge variant={eq.status === 'operational' ? 'success' : 'warning'} dot>{eq.status}</Badge>
                </div>
                <div className="mb-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-neutral-500">Utilization</span>
                    <span className="font-medium text-neutral-900">{eq.utilization || 0}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-neutral-100">
                    <div className={`h-full rounded-full ${(eq.utilization || 0) > 80 ? 'bg-error-500' : (eq.utilization || 0) > 60 ? 'bg-warning-500' : 'bg-success-500'}`} style={{ width: `${eq.utilization || 0}%` }} />
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs text-neutral-500 mb-3">
                  <span>Last Service: {eq.lastService ? new Date(eq.lastService).toLocaleDateString('en', { day: 'numeric', month: 'short' }) : '—'}</span>
                  <span>Next: {eq.nextService ? new Date(eq.nextService).toLocaleDateString('en', { day: 'numeric', month: 'short' }) : '—'}</span>
                </div>
                <div className="flex gap-2">
                  {eq.status !== 'operational' && (
                    <Button size="sm" onClick={() => updateStatus(eq, 'operational')}><ShieldCheck className="h-3.5 w-3.5" /> Mark Operational</Button>
                  )}
                  {eq.status === 'operational' && (
                    <Button size="sm" variant="outline" onClick={() => updateStatus(eq, 'maintenance')}><Clock className="h-3.5 w-3.5" /> Schedule Maintenance</Button>
                  )}
                </div>
              </SectionCard>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
