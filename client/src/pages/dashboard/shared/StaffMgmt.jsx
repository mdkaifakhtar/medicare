import { useEffect, useState } from 'react';
import { UserCheck, UserX, Clock, Users, Stethoscope, FlaskConical, Pill, Calculator, Phone } from 'lucide-react';
import { PageHeader, Card, Badge, Button, StatCard, Modal } from '../../../components/ui/index.jsx';
import DataTable from '../../../components/ui/DataTable.jsx';
import { mockApi } from '../../../services/mockApi.js';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';

const roleLabels = {
  nurse: 'Nurse', lab_technician: 'Lab Technician', pharmacist: 'Pharmacist',
  receptionist: 'Receptionist', accountant: 'Accountant', doctor: 'Doctor',
};

const roleIcon = {
  nurse: Stethoscope, lab_technician: FlaskConical, pharmacist: Pill,
  receptionist: Users, accountant: Calculator, doctor: Stethoscope,
};

export default function StaffMgmt() {
  const { user } = useSelector((s) => s.auth);
  const [staff, setStaff] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [viewStaff, setViewStaff] = useState(null);

  const load = () => {
    setLoading(true);
    Promise.all([mockApi.listStaff({ limit: 100 }), mockApi.listDepartments()]).then(([s, d]) => {
      setStaff(s.items || []); setDepartments(Array.isArray(d) ? d : d?.items || []); setLoading(false);
    });
  };
  useEffect(load, []);

  const approve = async (st) => {
    await mockApi.approveStaff(st.id, { id: user?.id, name: user?.name, role: user?.role });
    toast.success(`${st.name} approved and activated`);
    load();
  };

  const reject = async (st) => {
    await mockApi.updateStaff(st.id, { status: 'rejected' }, { id: user?.id, name: user?.name, role: user?.role });
    toast.success(`${st.name} rejected`);
    load();
  };

  const depName = (id) => (Array.isArray(departments) ? departments : []).find((d) => d.id === id)?.name || '—';
  const counts = {
    all: staff.length,
    pending: staff.filter((s) => s.status === 'pending').length,
    active: staff.filter((s) => s.status === 'active').length,
    nurses: staff.filter((s) => s.role === 'nurse').length,
    lab: staff.filter((s) => s.role === 'lab_technician').length,
    pharma: staff.filter((s) => s.role === 'pharmacist').length,
  };

  const filtered = staff.filter((s) => {
    if (filter === 'all') return true;
    if (filter === 'pending') return s.status === 'pending';
    if (filter === 'active') return s.status === 'active';
    if (filter === 'nurse') return s.role === 'nurse';
    if (filter === 'lab') return s.role === 'lab_technician';
    if (filter === 'pharma') return s.role === 'pharmacist';
    return true;
  });

  return (
    <div>
      <PageHeader title="Staff Management" description="Approve and manage hospital staff across all departments." />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Users} label="Total Staff" value={counts.all} color="primary" delay={0} />
        <StatCard icon={Clock} label="Pending Approval" value={counts.pending} color="warning" delay={0.05} />
        <StatCard icon={UserCheck} label="Active Staff" value={counts.active} color="success" delay={0.1} />
        <StatCard icon={Stethoscope} label="Nurses" value={counts.nurses} color="accent" delay={0.15} />
      </div>

      <div className="mt-6 mb-4 flex flex-wrap gap-2">
        {[
          { key: 'all', label: 'All Staff' },
          { key: 'pending', label: 'Pending' },
          { key: 'active', label: 'Active' },
          { key: 'nurse', label: 'Nurses' },
          { key: 'lab', label: 'Lab Techs' },
          { key: 'pharma', label: 'Pharmacists' },
        ].map((f) => (
          <button key={f.key} onClick={() => setFilter(f.key)} className={`rounded-xl px-4 py-2 text-sm font-medium transition ${filter === f.key ? 'bg-primary-600 text-white shadow-sm' : 'bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50'}`}>
            {f.label}
          </button>
        ))}
      </div>

      <DataTable
        columns={[
          { key: 'name', label: 'Name', render: (r) => {
            const Icon = roleIcon[r.role] || Users;
            return <div className="flex items-center gap-3"><div className="grid h-9 w-9 place-items-center rounded-lg bg-primary-100 text-primary-600"><Icon className="h-4 w-4" /></div><div><p className="font-medium text-neutral-900">{r.name}</p><p className="text-xs text-neutral-500">{roleLabels[r.role] || r.role}</p></div></div>;
          }},
          { key: 'role', label: 'Role', render: (r) => <Badge variant="info">{roleLabels[r.role] || r.role}</Badge> },
          { key: 'department', label: 'Department', render: (r) => depName(r.department) },
          { key: 'shift', label: 'Shift', render: (r) => <span className="text-sm">{r.shift || '—'}</span> },
          { key: 'joinedAt', label: 'Joined', render: (r) => new Date(r.joinedAt).toLocaleDateString() },
          { key: 'status', label: 'Status', render: (r) => <Badge variant={r.status === 'active' ? 'success' : r.status === 'pending' ? 'warning' : 'error'}>{r.status}</Badge> },
          { key: 'actions', label: 'Actions', render: (r) => (
            <div className="flex gap-2">
              {r.status === 'pending' && <><Button size="sm" onClick={() => approve(r)}><UserCheck className="h-3.5 w-3.5" /> Approve</Button><Button size="sm" variant="outline" onClick={() => reject(r)}><UserX className="h-3.5 w-3.5" /> Reject</Button></>}
              {r.status === 'active' && <Button size="sm" variant="ghost" onClick={() => setViewStaff(r)}>View</Button>}
            </div>
          )},
        ]}
        rows={filtered} loading={loading} emptyMessage="No staff in this category."
      />

      <Modal open={!!viewStaff} onClose={() => setViewStaff(null)} title="Staff Details">
        {viewStaff && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="grid h-16 w-16 place-items-center rounded-2xl bg-primary-100 text-primary-600 text-xl font-semibold">{viewStaff.name?.split(' ').map((w) => w[0]).join('').slice(0, 2)}</div>
              <div><p className="font-display font-bold text-lg text-neutral-900">{viewStaff.name}</p><p className="text-sm text-neutral-500">{roleLabels[viewStaff.role]}</p></div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Info label="Department" value={depName(viewStaff.department)} />
              <Info label="Shift" value={viewStaff.shift || '—'} />
              <Info label="Joined" value={new Date(viewStaff.joinedAt).toLocaleDateString()} />
              <Info label="Status" value={<Badge variant={viewStaff.status === 'active' ? 'success' : 'warning'}>{viewStaff.status}</Badge>} />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

function Info({ label, value }) {
  return <div><p className="text-xs text-neutral-500">{label}</p><p className="text-sm font-medium text-neutral-900 mt-0.5">{value}</p></div>;
}
