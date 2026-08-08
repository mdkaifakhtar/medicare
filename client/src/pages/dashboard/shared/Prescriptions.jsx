import { useEffect, useState } from 'react';
import { Plus, Pill, Download } from 'lucide-react';
import { PageHeader, Card, Badge, Button, Modal } from '../../../components/ui/index.jsx';
import DataTable from '../../../components/ui/DataTable.jsx';
import { mockApi } from '../../../services/mockApi.js';
import toast from 'react-hot-toast';
import { downloadDocumentPdf, documentFileName } from '../../../utils/docPdf.js';


const empty = { patientName: '', doctorName: '', diagnosis: '', medicines: '', notes: '' };

export default function Prescriptions() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(empty);

  const load = () => {
    setLoading(true);
    mockApi.listPrescriptions({ page, limit: 10, search }).then((r) => { setRows(r.items); setTotalPages(r.totalPages); setLoading(false); });
  };
  useEffect(load, [page, search]);

  const save = async (e) => {
    e.preventDefault();
    await mockApi.createPrescription({ ...form, medicines: form.medicines.split('\n').filter(Boolean).map((m) => ({ name: m, dosage: '1-0-1', duration: '5 days' })) });
    toast.success('Prescription created');
    setModalOpen(false); setForm(empty); load();
  };

  const downloadPdf = async (r) => {
    try {
      await downloadDocumentPdf({
        title: 'Medical Prescription',
        reference: r.prescriptionNo || r.id,
        meta: [
          ['Patient Name', r.patientName],
          ['Prescribed By', r.doctorName],
          ['Diagnosis', r.diagnosis],
          ['Date', r.createdAt ? new Date(r.createdAt).toLocaleString('en-IN') : new Date().toLocaleString('en-IN')],
        ],
        columns: ['Medicine', 'Dosage', 'Duration'],
        rows: (r.medicines || []).map((m) => [m.name, m.dosage || '1-0-1', m.duration || '5 days']),
        note: r.notes || 'Take medicines as advised. Contact the hospital immediately if any adverse reaction occurs.',
        signature: r.doctorName || 'Consultant Physician',
        fileName: documentFileName('Prescription', r.patientName, r.prescriptionNo || r.id),
      });
      toast.success('Prescription PDF downloaded');
    } catch (err) {
      toast.error(err?.message || 'Could not generate the prescription PDF');
    }
  };

  const columns = [

    { key: 'patientName', label: 'Patient', render: (r) => <span className="font-medium text-neutral-900">{r.patientName || '—'}</span> },
    { key: 'doctorName', label: 'Doctor', render: (r) => r.doctorName || '—' },
    { key: 'diagnosis', label: 'Diagnosis', render: (r) => r.diagnosis || '—' },
    { key: 'medicines', label: 'Medicines', render: (r) => <Badge variant="info">{r.medicines?.length || 0} items</Badge> },
    { key: 'createdAt', label: 'Date', render: (r) => r.createdAt ? new Date(r.createdAt).toLocaleDateString() : '—' },
    { key: 'actions', label: 'Actions', render: (r) => <button onClick={() => downloadPdf(r)} className="flex items-center gap-1 rounded-lg bg-neutral-100 px-3 py-1 text-xs font-medium hover:bg-neutral-200"><Download className="h-3.5 w-3.5" /> PDF</button> },
  ];

  return (
    <div>
      <PageHeader title="Prescriptions" description="Manage and generate patient prescriptions." action={<Button onClick={() => setModalOpen(true)}><Plus className="h-4 w-4" /> New Prescription</Button>} />
      <DataTable columns={columns} rows={rows} loading={loading} page={page} totalPages={totalPages} onPageChange={setPage} search={search} onSearch={(v) => { setSearch(v); setPage(1); }} searchPlaceholder="Search prescriptions..." />
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="New Prescription" size="lg">
        <form onSubmit={save} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div><label className="label">Patient Name</label><input required value={form.patientName} onChange={(e) => setForm({ ...form, patientName: e.target.value })} className="input" /></div>
            <div><label className="label">Doctor Name</label><input required value={form.doctorName} onChange={(e) => setForm({ ...form, doctorName: e.target.value })} className="input" /></div>
          </div>
          <div><label className="label">Diagnosis</label><input required value={form.diagnosis} onChange={(e) => setForm({ ...form, diagnosis: e.target.value })} className="input" /></div>
          <div><label className="label">Medicines (one per line)</label><textarea rows={4} required value={form.medicines} onChange={(e) => setForm({ ...form, medicines: e.target.value })} className="input" placeholder={'Paracetamol 500mg\nAmoxicillin 250mg'} /></div>
          <div><label className="label">Notes</label><textarea rows={2} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="input" /></div>
          <div className="flex justify-end gap-2"><Button variant="outline" type="button" onClick={() => setModalOpen(false)}>Cancel</Button><Button type="submit">Create</Button></div>
        </form>
      </Modal>
    </div>
  );
}
