import { useEffect, useState } from 'react';
import { Plus, User, Phone, Droplet, AlertCircle } from 'lucide-react';
import { PageHeader, Card, Badge, Button, Modal } from '../../../components/ui/index.jsx';
import DataTable from '../../../components/ui/DataTable.jsx';
import { mockApi } from '../../../services/mockApi.js';
import toast from 'react-hot-toast';

const empty = { name: '', gender: 'Male', age: '', bloodGroup: 'O+', phone: '', email: '', address: '', emergencyContact: '', allergies: '', chronicConditions: '' };

export default function Patients() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [view, setView] = useState(null);
  const [form, setForm] = useState(empty);

  const load = () => {
    setLoading(true);
    mockApi.listPatients({ page, limit: 10, search }).then((r) => { setRows(r.items); setTotalPages(r.totalPages); setLoading(false); });
  };
  useEffect(load, [page, search]);

  const save = async (e) => {
    e.preventDefault();
    await mockApi.createPatient({
      ...form, age: Number(form.age), allergies: form.allergies ? form.allergies.split(',').map((s) => s.trim()) : [],
      chronicConditions: form.chronicConditions ? form.chronicConditions.split(',').map((s) => s.trim()) : [],
    });
    toast.success('Patient registered successfully');
    setModalOpen(false); setForm(empty); load();
  };

  const columns = [
    { key: 'avatar', label: 'Patient', render: (r) => <div className="flex items-center gap-3"><div className="grid h-9 w-9 place-items-center rounded-full bg-primary-100 text-primary-600 text-xs font-semibold">{r.avatar || r.name[0]}</div><div><p className="font-medium text-neutral-900">{r.name}</p><p className="text-xs text-neutral-500">{r.email}</p></div></div> },
    { key: 'age', label: 'Age / Gender', render: (r) => <span>{r.age} · {r.gender}</span> },
    { key: 'bloodGroup', label: 'Blood', render: (r) => <Badge variant="error">{r.bloodGroup}</Badge> },
    { key: 'phone', label: 'Phone', render: (r) => r.phone },
    { key: 'chronicConditions', label: 'Conditions', render: (r) => r.chronicConditions?.length ? <Badge variant="warning">{r.chronicConditions.length}</Badge> : <span className="text-neutral-400">None</span> },
    { key: 'actions', label: 'Actions', render: (r) => <button onClick={() => setView(r)} className="rounded-lg bg-neutral-100 px-3 py-1 text-xs font-medium hover:bg-neutral-200">View</button> },
  ];

  return (
    <div>
      <PageHeader title="Patients" description="Manage patient records and registrations." action={<Button onClick={() => setModalOpen(true)}><Plus className="h-4 w-4" /> Register Patient</Button>} />
      <DataTable columns={columns} rows={rows} loading={loading} page={page} totalPages={totalPages} onPageChange={setPage} search={search} onSearch={(v) => { setSearch(v); setPage(1); }} searchPlaceholder="Search patients..." />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Register New Patient" size="lg">
        <form onSubmit={save} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div><label className="label">Full Name</label><input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input" /></div>
            <div><label className="label">Phone</label><input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input" /></div>
            <div><label className="label">Email</label><input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input" /></div>
            <div><label className="label">Emergency Contact</label><input value={form.emergencyContact} onChange={(e) => setForm({ ...form, emergencyContact: e.target.value })} className="input" /></div>
            <div><label className="label">Gender</label><select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })} className="input"><option>Male</option><option>Female</option><option>Other</option></select></div>
            <div><label className="label">Age</label><input type="number" min="1" max="120" required value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} className="input" /></div>
            <div><label className="label">Blood Group</label><select value={form.bloodGroup} onChange={(e) => setForm({ ...form, bloodGroup: e.target.value })} className="input">{['O+','O-','A+','A-','B+','B-','AB+','AB-'].map((b) => <option key={b}>{b}</option>)}</select></div>
            <div><label className="label">Address</label><input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="input" /></div>
            <div><label className="label">Allergies (comma separated)</label><input value={form.allergies} onChange={(e) => setForm({ ...form, allergies: e.target.value })} className="input" placeholder="Penicillin, Sulfa" /></div>
            <div><label className="label">Chronic Conditions</label><input value={form.chronicConditions} onChange={(e) => setForm({ ...form, chronicConditions: e.target.value })} className="input" placeholder="Diabetes, Hypertension" /></div>
          </div>
          <div className="flex justify-end gap-2"><Button variant="outline" type="button" onClick={() => setModalOpen(false)}>Cancel</Button><Button type="submit">Register</Button></div>
        </form>
      </Modal>

      <Modal open={!!view} onClose={() => setView(null)} title="Patient Details" size="lg">
        {view && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 text-xl font-bold text-white">{view.avatar || view.name[0]}</div>
              <div><h3 className="font-display text-xl font-bold text-neutral-900">{view.name}</h3><p className="text-sm text-neutral-500">{view.age} years · {view.gender} · {view.bloodGroup}</p></div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {[['Phone', view.phone], ['Email', view.email], ['Address', view.address], ['Emergency', view.emergencyContact], ['Insurance', view.insurance?.provider || 'None'], ['Policy No', view.insurance?.policyNo || '—']].map(([k, v]) => (
                <div key={k} className="rounded-xl border border-neutral-100 p-3"><p className="text-xs text-neutral-500">{k}</p><p className="text-sm font-medium text-neutral-900">{v || '—'}</p></div>
              ))}
            </div>
            {view.allergies?.length > 0 && <div className="rounded-xl bg-error-50 p-3"><p className="flex items-center gap-2 text-sm font-medium text-error-700"><AlertCircle className="h-4 w-4" /> Allergies: {view.allergies.join(', ')}</p></div>}
            {view.chronicConditions?.length > 0 && <div className="rounded-xl bg-warning-50 p-3"><p className="text-sm font-medium text-warning-700">Chronic: {view.chronicConditions.join(', ')}</p></div>}
          </div>
        )}
      </Modal>
    </div>
  );
}
