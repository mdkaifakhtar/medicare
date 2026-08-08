import { useEffect, useState } from 'react';
import { Plus, Building2, Phone } from 'lucide-react';
import { PageHeader, Card, Badge, Button, Modal } from '../../../components/ui/index.jsx';
import DataTable from '../../../components/ui/DataTable.jsx';
import { mockApi } from '../../../services/mockApi.js';
import toast from 'react-hot-toast';

const empty = { name: '', description: '', floor: '', head: '', phone: '', color: 'primary' };

export default function DepartmentsMgmt() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(empty);

  const load = () => {
    setLoading(true);
    mockApi.listDepartments({ page, limit: 10, search }).then((r) => { setRows(r.items); setTotalPages(r.totalPages); setLoading(false); });
  };
  useEffect(load, [page, search]);

  const save = async (e) => {
    e.preventDefault();
    await mockApi.createDepartment(form);
    toast.success('Department created');
    setModalOpen(false); setForm(empty); load();
  };

  const remove = async (id) => { await mockApi.deleteDepartment(id); toast.success('Department deleted'); load(); };

  const columns = [
    { key: 'name', label: 'Department', render: (r) => <div className="flex items-center gap-3"><div className="grid h-9 w-9 place-items-center rounded-lg bg-primary-100 text-primary-600"><Building2 className="h-4.5 w-4.5" /></div><span className="font-medium text-neutral-900">{r.name}</span></div> },
    { key: 'head', label: 'Head' },
    { key: 'floor', label: 'Floor', render: (r) => r.floor },
    { key: 'phone', label: 'Ext', render: (r) => r.phone },
    { key: 'established', label: 'Since' },
    { key: 'actions', label: 'Actions', render: (r) => <button onClick={() => remove(r.id)} className="rounded-lg bg-error-100 px-3 py-1 text-xs font-medium text-error-700 hover:bg-error-200">Delete</button> },
  ];

  return (
    <div>
      <PageHeader title="Departments" description="Manage hospital departments and their heads." action={<Button onClick={() => setModalOpen(true)}><Plus className="h-4 w-4" /> Add Department</Button>} />
      <DataTable columns={columns} rows={rows} loading={loading} page={page} totalPages={totalPages} onPageChange={setPage} search={search} onSearch={(v) => { setSearch(v); setPage(1); }} searchPlaceholder="Search departments..." />
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add Department">
        <form onSubmit={save} className="space-y-4">
          <div><label className="label">Department Name</label><input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input" /></div>
          <div><label className="label">Description</label><textarea rows={2} required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input" /></div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div><label className="label">Floor</label><input required value={form.floor} onChange={(e) => setForm({ ...form, floor: e.target.value })} className="input" /></div>
            <div><label className="label">Extension</label><input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input" /></div>
            <div><label className="label">Department Head</label><input required value={form.head} onChange={(e) => setForm({ ...form, head: e.target.value })} className="input" /></div>
          </div>
          <div className="flex justify-end gap-2"><Button variant="outline" type="button" onClick={() => setModalOpen(false)}>Cancel</Button><Button type="submit">Create</Button></div>
        </form>
      </Modal>
    </div>
  );
}
