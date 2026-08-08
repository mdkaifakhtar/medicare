import { useEffect, useState } from 'react';
import { Plus, Star, Stethoscope } from 'lucide-react';
import { PageHeader, Card, Badge, Button, Modal } from '../../../components/ui/index.jsx';
import DataTable from '../../../components/ui/DataTable.jsx';
import { mockApi } from '../../../services/mockApi.js';
import toast from 'react-hot-toast';

const empty = { name: '', department: '', specialization: '', qualification: '', experience: '', consultationFee: '', image: 'https://images.pexels.com/photos/5407206/pexels-photo-5407206.jpeg?auto=compress&cs=tinysrgb&w=400' };

export default function DoctorsMgmt() {
  const [rows, setRows] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(empty);

  const load = () => {
    setLoading(true);
    mockApi.listDoctors({ page, limit: 10, search }).then((r) => { setRows(r.items); setTotalPages(r.totalPages); setLoading(false); });
  };
  useEffect(() => { load(); mockApi.listDepartments({ limit: 50 }).then((r) => setDepartments(r.items)); }, [page, search]);

  const save = async (e) => {
    e.preventDefault();
    await mockApi.createDoctor({ ...form, experience: Number(form.experience), consultationFee: Number(form.consultationFee) });
    toast.success('Doctor added successfully');
    setModalOpen(false); setForm(empty); load();
  };

  const toggleStatus = async (d) => {
    await mockApi.updateDoctor(d.id, { status: d.status === 'available' ? 'on_leave' : 'available' });
    toast.success(`Doctor marked ${d.status === 'available' ? 'on leave' : 'available'}`);
    load();
  };

  const columns = [
    { key: 'name', label: 'Doctor', render: (r) => <div className="flex items-center gap-3"><img src={r.image} alt={r.name} className="h-10 w-10 rounded-full object-cover" /><div><p className="font-medium text-neutral-900">{r.name}</p><p className="text-xs text-neutral-500">{r.specialization}</p></div></div> },
    { key: 'department', label: 'Department', render: (r) => departments.find((d) => d.id === r.department)?.name || '—' },
    { key: 'experience', label: 'Experience', render: (r) => `${r.experience} yrs` },
    { key: 'rating', label: 'Rating', render: (r) => <span className="flex items-center gap-1"><Star className="h-3.5 w-3.5 fill-accent-500 text-accent-500" /> {r.rating} ({r.reviews})</span> },
    { key: 'consultationFee', label: 'Fee', render: (r) => `₹${r.consultationFee}` },
    { key: 'status', label: 'Status', render: (r) => <Badge variant={r.status === 'available' ? 'success' : 'warning'}>{r.status === 'available' ? 'Available' : 'On Leave'}</Badge> },
    { key: 'actions', label: 'Actions', render: (r) => <button onClick={() => toggleStatus(r)} className="rounded-lg bg-neutral-100 px-3 py-1 text-xs font-medium hover:bg-neutral-200">Toggle Status</button> },
  ];

  return (
    <div>
      <PageHeader title="Doctors" description="Manage doctor profiles and availability." action={<Button onClick={() => setModalOpen(true)}><Plus className="h-4 w-4" /> Add Doctor</Button>} />
      <DataTable columns={columns} rows={rows} loading={loading} page={page} totalPages={totalPages} onPageChange={setPage} search={search} onSearch={(v) => { setSearch(v); setPage(1); }} searchPlaceholder="Search doctors..." />
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add New Doctor" size="lg">
        <form onSubmit={save} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div><label className="label">Full Name</label><input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input" placeholder="Dr. John Doe" /></div>
            <div><label className="label">Department</label><select required value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} className="input"><option value="">Select department</option>{departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}</select></div>
            <div><label className="label">Specialization</label><input required value={form.specialization} onChange={(e) => setForm({ ...form, specialization: e.target.value })} className="input" /></div>
            <div><label className="label">Qualification</label><input required value={form.qualification} onChange={(e) => setForm({ ...form, qualification: e.target.value })} className="input" /></div>
            <div><label className="label">Experience (years)</label><input type="number" min="0" required value={form.experience} onChange={(e) => setForm({ ...form, experience: e.target.value })} className="input" /></div>
            <div><label className="label">Consultation Fee (₹)</label><input type="number" min="0" required value={form.consultationFee} onChange={(e) => setForm({ ...form, consultationFee: e.target.value })} className="input" /></div>
          </div>
          <div className="flex justify-end gap-2"><Button variant="outline" type="button" onClick={() => setModalOpen(false)}>Cancel</Button><Button type="submit">Add Doctor</Button></div>
        </form>
      </Modal>
    </div>
  );
}
