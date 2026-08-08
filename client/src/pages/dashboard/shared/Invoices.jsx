import { useEffect, useState } from 'react';
import { Plus, Download, Receipt, Wallet, TrendingUp, FileText } from 'lucide-react';
import { PageHeader, Card, Badge, Button, Modal, StatCard } from '../../../components/ui/index.jsx';
import DataTable from '../../../components/ui/DataTable.jsx';
import { mockApi } from '../../../services/mockApi.js';
import toast from 'react-hot-toast';
import { downloadDocumentPdf, documentFileName } from '../../../utils/docPdf.js';

const empty = { patientName: '', amount: '', description: '', status: 'unpaid', method: 'Cash' };

export default function Invoices() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(empty);

  const load = () => {
    setLoading(true);
    mockApi.listInvoices({ page, limit: 10, search }).then((r) => { setRows(r.items); setTotalPages(r.totalPages); setLoading(false); });
  };
  useEffect(load, [page, search]);

  const save = async (e) => {
    e.preventDefault();
    await mockApi.createInvoice({ ...form, amount: Number(form.amount) });
    toast.success('Invoice created');
    setModalOpen(false); setForm(empty); load();
  };

  const markPaid = async (inv) => { await mockApi.updateInvoice(inv.id, { status: 'paid' }); toast.success('Invoice marked paid'); load(); };

  const downloadPdf = async (r) => {
    try {
      const items = r.items?.length ? r.items : [{ description: r.description || 'Hospital services', amount: Number(r.amount || r.total || 0) }];
      const subtotal = Number(r.subtotal ?? items.reduce((s, i) => s + Number(i.amount || 0), 0));
      const tax = Number(r.tax ?? Math.round(subtotal * 0.18));
      const total = Number(r.total ?? subtotal + tax);
      await downloadDocumentPdf({
        title: 'Tax Invoice / Bill of Supply',
        reference: r.invoiceNo || r.id,
        meta: [
          ['Patient Name', r.patientName],
          ['Invoice Number', r.invoiceNo || r.id],
          ['Invoice Date', r.createdAt ? new Date(r.createdAt).toLocaleString('en-IN') : new Date().toLocaleString('en-IN')],
          ['Payment Status', `${String(r.status || 'pending').toUpperCase()}${r.method ? ` · ${r.method}` : ''}`],
        ],
        columns: ['Description', 'Qty', 'Amount (INR)'],
        rows: items.map((i) => [i.description || 'Hospital services', String(i.qty || 1), Number(i.amount || 0).toLocaleString('en-IN')]),
        totals: [
          ['Subtotal', `₹${subtotal.toLocaleString('en-IN')}`],
          ['Tax / GST', `₹${tax.toLocaleString('en-IN')}`],
          ['Total Payable', `₹${total.toLocaleString('en-IN')}`],
        ],

        note: 'This invoice is issued by MedCare Multispecialty Hospital. Please retain it for insurance and reimbursement purposes.',
        signature: 'Billing Officer',
        fileName: documentFileName('Invoice', r.patientName, r.invoiceNo || r.id),
      });
      toast.success('Invoice PDF downloaded');
    } catch (err) {
      toast.error(err?.message || 'Could not generate the invoice PDF');
    }
  };

  const columns = [

    { key: 'invoiceNo', label: 'Invoice #', render: (r) => <span className="font-mono text-xs font-semibold text-primary-600">{r.invoiceNo || '—'}</span> },
    { key: 'patientName', label: 'Patient', render: (r) => <span className="font-medium text-neutral-900">{r.patientName || '—'}</span> },
    { key: 'description', label: 'Description', render: (r) => r.description || '—' },
    { key: 'amount', label: 'Amount', render: (r) => `₹${(r.amount || 0).toLocaleString()}` },
    { key: 'status', label: 'Status', render: (r) => <Badge variant={r.status === 'paid' ? 'success' : 'warning'}>{r.status}</Badge> },
    { key: 'actions', label: 'Actions', render: (r) => (
      <div className="flex gap-1.5">
        {r.status !== 'paid' && <button onClick={() => markPaid(r)} className="rounded-lg bg-success-100 px-2.5 py-1 text-xs font-medium text-success-700">Mark Paid</button>}
        <button onClick={() => downloadPdf(r)} className="flex items-center gap-1 rounded-lg bg-neutral-100 px-2.5 py-1 text-xs font-medium"><Download className="h-3.5 w-3.5" /> PDF</button>
      </div>
    ) },
  ];

  return (
    <div>
      <PageHeader title="Invoices & Billing" description="Manage patient invoices and payments." action={<Button onClick={() => setModalOpen(true)}><Plus className="h-4 w-4" /> Create Invoice</Button>} />
      <DataTable columns={columns} rows={rows} loading={loading} page={page} totalPages={totalPages} onPageChange={setPage} search={search} onSearch={(v) => { setSearch(v); setPage(1); }} searchPlaceholder="Search invoices..." />
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Create Invoice">
        <form onSubmit={save} className="space-y-4">
          <div><label className="label">Patient Name</label><input required value={form.patientName} onChange={(e) => setForm({ ...form, patientName: e.target.value })} className="input" /></div>
          <div><label className="label">Description</label><input required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input" placeholder="Consultation + Lab Tests" /></div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div><label className="label">Amount (₹)</label><input type="number" min="0" required value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} className="input" /></div>
            <div><label className="label">Payment Method</label><select value={form.method} onChange={(e) => setForm({ ...form, method: e.target.value })} className="input">{['Cash','Card','UPI','Insurance','Razorpay','Stripe'].map((m) => <option key={m}>{m}</option>)}</select></div>
          </div>
          <div className="flex justify-end gap-2"><Button variant="outline" type="button" onClick={() => setModalOpen(false)}>Cancel</Button><Button type="submit">Create</Button></div>
        </form>
      </Modal>
    </div>
  );
}
