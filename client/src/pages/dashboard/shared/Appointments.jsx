import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Calendar, ListFilter as Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageHeader, Card, Badge, Button, Modal, EmptyState } from '../../../components/ui/index.jsx';
import DataTable from '../../../components/ui/DataTable.jsx';
import { mockApi } from '../../../services/mockApi.js';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';

export default function Appointments() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [cancelTarget, setCancelTarget] = useState(null);
  const { user } = useSelector((s) => s.auth);

  const load = () => {
    setLoading(true);
    mockApi.listAppointments({ page, limit: 10, status: statusFilter }).then((r) => {
      setRows(r.items); setTotalPages(r.totalPages); setLoading(false);
    });
  };
  useEffect(load, [page, search, statusFilter]);

  const updateStatus = async (id, status) => {
    await mockApi.updateAppointment(id, { status });
    toast.success(`Appointment ${status}`);
    load();
  };

  const columns = [
    { key: 'token', label: 'Token', render: (r) => <span className="font-mono text-xs font-semibold text-primary-600">{r.token}</span> },
    { key: 'patientName', label: 'Patient', render: (r) => <div><p className="font-medium text-neutral-900">{r.patientName || '—'}</p><p className="text-xs text-neutral-500">{r.patientPhone || ''}</p></div> },
    { key: 'doctorName', label: 'Doctor', render: (r) => r.doctorName || '—' },
    { key: 'department', label: 'Department', render: (r) => r.department || '—' },
    { key: 'date', label: 'Date & Time', render: (r) => <span className="text-sm">{r.date || '—'} · {r.time || ''}</span> },
    { key: 'status', label: 'Status', render: (r) => <Badge variant={r.status === 'completed' ? 'success' : r.status === 'cancelled' ? 'error' : r.status === 'rescheduled' ? 'warning' : 'info'}>{r.status}</Badge> },
    {
      key: 'actions', label: 'Actions', render: (r) => (
        <div className="flex gap-1.5">
          {r.status === 'scheduled' && user?.role !== 'patient' && <button onClick={() => updateStatus(r.id, 'completed')} className="rounded-lg bg-success-100 px-2.5 py-1 text-xs font-medium text-success-700 hover:bg-success-200">Complete</button>}
          {r.status === 'scheduled' && <button onClick={() => updateStatus(r.id, 'rescheduled')} className="rounded-lg bg-warning-100 px-2.5 py-1 text-xs font-medium text-warning-700 hover:bg-warning-200">Reschedule</button>}
          {r.status !== 'cancelled' && r.status !== 'completed' && <button onClick={() => setCancelTarget(r)} className="rounded-lg bg-error-100 px-2.5 py-1 text-xs font-medium text-error-700 hover:bg-error-200">Cancel</button>}
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader title="Appointments" description="Manage and track all patient appointments." action={<Link to="/dashboard/book-appointment"><Button><Plus className="h-4 w-4" /> Book Appointment</Button></Link>} />
      <div className="mb-4 flex flex-wrap gap-2">
        {['', 'scheduled', 'completed', 'cancelled', 'rescheduled'].map((s) => (
          <button key={s} onClick={() => { setStatusFilter(s); setPage(1); }} className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${statusFilter === s ? 'bg-primary-600 text-white' : 'bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50'}`}>{s || 'All Status'}</button>
        ))}
      </div>
      <DataTable columns={columns} rows={rows} loading={loading} page={page} totalPages={totalPages} onPageChange={setPage} search={search} onSearch={(v) => { setSearch(v); setPage(1); }} searchPlaceholder="Search appointments..." />
      <Modal open={!!cancelTarget} onClose={() => setCancelTarget(null)} title="Cancel Appointment">
        <p className="text-sm text-neutral-600">Are you sure you want to cancel appointment <span className="font-semibold">{cancelTarget?.token}</span> for {cancelTarget?.patientName}?</p>
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="outline" onClick={() => setCancelTarget(null)}>Keep</Button>
          <Button variant="danger" onClick={() => { updateStatus(cancelTarget.id, 'cancelled'); setCancelTarget(null); }}>Cancel Appointment</Button>
        </div>
      </Modal>
    </div>
  );
}
