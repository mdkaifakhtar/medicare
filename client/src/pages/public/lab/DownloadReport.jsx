import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search, Download, FileText, FlaskConical, CheckCircle2,
  AlertCircle, Eye, Printer, Calendar,
} from 'lucide-react';
import PageHero from '../../../components/public/PageHero.jsx';
import { Badge, Button } from '../../../components/ui/index.jsx';
import toast from 'react-hot-toast';

// Generates and downloads the real A4 lab-report PDF (identical to the preview).
const saveReportPdf = async (row) => {
  const t = toast.loading('Generating PDF…');
  try {
    const { downloadLabReportPdf } = await import('../../../utils/labReportPdf.js');
    const file = await downloadLabReportPdf({ test: row, patient: { name: row?.patientName, id: row?.patientId } });
    toast.success(`Downloaded ${file}`, { id: t });
  } catch (err) {
    toast.error(err?.message || 'Could not generate the PDF', { id: t });
  }
};


const mockReports = [
  { id: 'RPT001', test: 'Complete Blood Count (CBC)', date: '2025-07-20', status: 'approved', patient: 'John Doe', doctor: 'Dr. Ananya Reddy', result: 'All parameters within normal range', file: 'cbc_report.pdf' },
  { id: 'RPT002', test: 'Lipid Profile', date: '2025-07-18', status: 'approved', patient: 'John Doe', doctor: 'Dr. Ananya Reddy', result: 'Cholesterol slightly elevated. LDL: 145 mg/dL (normal < 130)', file: 'lipid_report.pdf' },
  { id: 'RPT003', test: 'Thyroid Profile', date: '2025-07-15', status: 'approved', patient: 'John Doe', doctor: 'Dr. Rajesh Menon', result: 'TSH: 2.4 mIU/L (normal 0.4-4.0). Normal thyroid function.', file: 'thyroid_report.pdf' },
  { id: 'RPT004', test: 'Vitamin D', date: '2025-07-12', status: 'approved', patient: 'John Doe', doctor: 'Dr. Priya Iyer', result: 'Vitamin D: 18 ng/mL (deficient). Supplementation recommended.', file: 'vitd_report.pdf' },
  { id: 'RPT005', test: 'HbA1c (Diabetes)', date: '2025-07-22', status: 'processing', patient: 'John Doe', doctor: 'Dr. Ananya Reddy', result: 'Report being processed', file: null },
];

export default function DownloadReport() {
  const [search, setSearch] = useState('');
  const [viewReport, setViewReport] = useState(null);

  const filtered = mockReports.filter((r) =>
    !search || r.test.toLowerCase().includes(search.toLowerCase()) || r.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <PageHero
        title="Download Reports"
        subtitle="Access all your lab reports in one place. Download or print approved reports instantly."

      />

      {/* Search */}
      <section className="section py-8">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by test name or report ID..." className="input pl-9" />
        </div>
      </section>

      {/* Reports list */}
      <section className="section pb-16">
        <div className="grid gap-4">
          {filtered.map((report, i) => (
            <motion.div key={report.id} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.04 }} className="card p-5 card-hover">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className={`grid h-12 w-12 place-items-center rounded-2xl ${report.status === 'approved' ? 'bg-success-100 text-success-600' : 'bg-warning-100 text-warning-600'}`}>
                    <FileText className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-display text-base font-bold text-neutral-900">{report.test}</h3>
                      <Badge variant={report.status === 'approved' ? 'success' : 'warning'} dot>{report.status === 'approved' ? 'Available' : 'Processing'}</Badge>
                    </div>
                    <p className="mt-0.5 text-sm text-neutral-500">{report.id} · {report.date} · {report.doctor}</p>
                    {report.status === 'approved' && <p className="mt-1 text-xs text-neutral-400">{report.result}</p>}
                  </div>
                </div>

                <div className="flex gap-2 shrink-0">
                  {report.status === 'approved' ? (
                    <>
                      <Button size="sm" variant="outline" onClick={() => setViewReport(report)}><Eye className="h-4 w-4" /> View</Button>
                      <Button size="sm" onClick={() => saveReportPdf({ ...report, testName: report.test, patientName: report.patient, doctorName: report.doctor, reportNo: report.id, result: report.result })}><Download className="h-4 w-4" /> Download</Button>
                      <Button size="sm" variant="ghost" onClick={() => toast.success('Sending to printer...')}><Printer className="h-4 w-4" /></Button>
                    </>
                  ) : (
                    <div className="flex items-center gap-2 text-sm text-neutral-400">
                      <AlertCircle className="h-4 w-4" /> Report in progress
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="card p-10 text-center">
            <FileText className="mx-auto h-10 w-10 text-neutral-400" />
            <h3 className="mt-3 font-display text-lg font-bold text-neutral-900">No reports found</h3>
            <p className="mt-1 text-sm text-neutral-500">Try a different search term.</p>
          </div>
        )}
      </section>

      {/* Report Viewer Modal */}
      {viewReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-neutral-950/50 backdrop-blur-md" onClick={() => setViewReport(null)} />
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="relative w-full max-w-2xl card-elevated p-6 max-h-[90vh] overflow-y-auto">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="font-display text-lg font-bold text-neutral-900">Report Details</h3>
              <button onClick={() => setViewReport(null)} className="text-neutral-400 hover:text-neutral-600">Close</button>
            </div>
            <div className="space-y-4">
              <div className="rounded-xl bg-neutral-50 p-4 space-y-2">
                <div className="flex justify-between text-sm"><span className="text-neutral-500">Report ID</span><span className="font-mono font-medium text-neutral-900">{viewReport.id}</span></div>
                <div className="flex justify-between text-sm"><span className="text-neutral-500">Test</span><span className="font-medium text-neutral-900">{viewReport.test}</span></div>
                <div className="flex justify-between text-sm"><span className="text-neutral-500">Patient</span><span className="font-medium text-neutral-900">{viewReport.patient}</span></div>
                <div className="flex justify-between text-sm"><span className="text-neutral-500">Doctor</span><span className="font-medium text-neutral-900">{viewReport.doctor}</span></div>
                <div className="flex justify-between text-sm"><span className="text-neutral-500">Date</span><span className="font-medium text-neutral-900">{viewReport.date}</span></div>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2">Result Summary</p>
                <p className="text-sm text-neutral-900">{viewReport.result}</p>
              </div>
              <div className="flex gap-2 pt-2 border-t border-neutral-100">
                <Button onClick={() => saveReportPdf({ ...viewReport, testName: viewReport.test, patientName: viewReport.patient, doctorName: viewReport.doctor, reportNo: viewReport.id, result: viewReport.result })}><Download className="h-4 w-4" /> Download PDF</Button>
                <Button variant="outline" onClick={() => toast.success('Printing...')}><Printer className="h-4 w-4" /> Print</Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
