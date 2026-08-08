import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search, Clock, CheckCircle2, FlaskConical, TestTube, AlertCircle,
  FileText, Download, ArrowRight, XCircle,
} from 'lucide-react';
import PageHero from '../../../components/public/PageHero.jsx';
import { Badge, Button } from '../../../components/ui/index.jsx';
import toast from 'react-hot-toast';

const mockBookings = [
  { id: 'LAB84729103', test: 'Complete Blood Count (CBC)', date: '2025-07-20', status: 'approved', mode: 'home', patient: 'John Doe' },
  { id: 'LAB84729104', test: 'Lipid Profile', date: '2025-07-21', status: 'processing', mode: 'home', patient: 'John Doe' },
  { id: 'LAB84729105', test: 'Thyroid Profile (T3, T4, TSH)', date: '2025-07-22', status: 'pending', mode: 'lab', patient: 'John Doe' },
];

// Generates and downloads the real A4 lab-report PDF for a tracked booking.
const saveReportPdf = async (booking) => {
  const t = toast.loading('Generating PDF…');
  try {
    const { downloadLabReportPdf } = await import('../../../utils/labReportPdf.js');
    const test = {
      id: booking.id,
      reportNo: booking.id,
      testName: booking.test,
      patientName: booking.patient,
      status: booking.status,
      createdAt: booking.date,
    };
    const file = await downloadLabReportPdf({ test, patient: { name: booking.patient } });
    toast.success(`Downloaded ${file}`, { id: t });
  } catch (err) {
    toast.error(err?.message || 'Could not generate the PDF', { id: t });
  }
};

const statusConfig = {
  pending: { label: 'Sample Pending', variant: 'warning', step: 1 },
  collected: { label: 'Sample Collected', variant: 'info', step: 2 },
  processing: { label: 'Processing in Lab', variant: 'info', step: 3 },
  completed: { label: 'Report Ready', variant: 'accent', step: 4 },
  approved: { label: 'Approved & Available', variant: 'success', step: 5 },
};

const stages = ['Booked', 'Sample Collected', 'Processing', 'Report Ready', 'Approved'];

export default function TrackTest() {
  const [bookingId, setBookingId] = useState('');
  const [results, setResults] = useState(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = () => {
    if (!bookingId.trim()) {
      toast.error('Please enter a booking ID');
      return;
    }
    setSearched(true);
    const found = mockBookings.filter((b) => b.id.toLowerCase().includes(bookingId.toLowerCase()));
    setResults(found.length > 0 ? found : mockBookings);
  };

  return (
    <div>
      <PageHero
        title="Track Test Status"
        subtitle="Enter your booking ID to check the real-time status of your lab tests and download reports."

      />

      {/* Search */}
      <section className="section py-10">
        <div className="mx-auto max-w-xl">
          <div className="card p-6">
            <label className="label">Booking ID</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                <input value={bookingId} onChange={(e) => setBookingId(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSearch()} placeholder="e.g. LAB84729103" className="input pl-9" />
              </div>
              <Button onClick={handleSearch}>Track</Button>
            </div>
            <p className="mt-3 text-xs text-neutral-400">Tip: Try LAB84729103 to see a sample result. Your booking ID was sent via SMS and email.</p>
          </div>
        </div>
      </section>

      {/* Results */}
      {searched && (
        <section className="section pb-16">
          <div className="mx-auto max-w-3xl space-y-4">
            {results.length === 0 ? (
              <div className="card p-10 text-center">
                <AlertCircle className="mx-auto h-10 w-10 text-neutral-400" />
                <h3 className="mt-3 font-display text-lg font-bold text-neutral-900">No bookings found</h3>
                <p className="mt-1 text-sm text-neutral-500">Check your booking ID and try again.</p>
              </div>
            ) : (
              results.map((booking, i) => {
                const cfg = statusConfig[booking.status] || statusConfig.pending;
                return (
                  <motion.div key={booking.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="card p-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-xs text-neutral-400">{booking.id}</span>
                          <Badge variant={cfg.variant} dot>{cfg.label}</Badge>
                        </div>
                        <h3 className="font-display text-base font-bold text-neutral-900">{booking.test}</h3>
                        <p className="mt-1 text-sm text-neutral-500">Booked on {booking.date} · {booking.mode === 'home' ? 'Home Collection' : 'Visit Lab'}</p>
                      </div>
                      {booking.status === 'approved' && (
                        <Button variant="outline" size="sm" onClick={() => saveReportPdf(booking)}><Download className="h-4 w-4" /> Download Report</Button>
                      )}
                    </div>

                    {/* Progress tracker */}
                    <div className="mt-6 flex items-center justify-between">
                      {stages.map((stage, idx) => {
                        const isActive = idx < cfg.step;
                        const isCurrent = idx === cfg.step - 1;
                        return (
                          <div key={stage} className="flex flex-1 flex-col items-center">
                            <div className="flex w-full items-center">
                              {idx > 0 && <div className={`h-0.5 flex-1 ${idx < cfg.step ? 'bg-primary-500' : 'bg-neutral-200'}`} />}
                              <div className={`grid h-9 w-9 place-items-center rounded-full text-xs font-semibold transition ${isActive ? 'bg-primary-600 text-white' : 'bg-neutral-100 text-neutral-400'} ${isCurrent ? 'ring-4 ring-primary-500/20' : ''}`}>
                                {isActive ? <CheckCircle2 className="h-4 w-4" /> : idx + 1}
                              </div>
                              {idx < stages.length - 1 && <div className={`h-0.5 flex-1 ${idx < cfg.step - 1 ? 'bg-primary-500' : 'bg-neutral-200'}`} />}
                            </div>
                            <span className={`mt-1.5 text-[10px] text-center ${isActive ? 'text-primary-600 font-medium' : 'text-neutral-400'}`}>{stage}</span>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </section>
      )}

      {/* Demo bookings */}
      {!searched && (
        <section className="section pb-16">
          <div className="mx-auto max-w-3xl">
            <h2 className="font-display text-xl font-bold text-neutral-900 mb-4">Recent Bookings</h2>
            <div className="space-y-3">
              {mockBookings.map((booking, i) => {
                const cfg = statusConfig[booking.status] || statusConfig.pending;
                return (
                  <motion.div key={booking.id} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }} className="card p-5 flex items-center justify-between card-hover cursor-pointer" onClick={() => { setBookingId(booking.id); setSearched(true); setResults([booking]); }}>
                    <div className="flex items-center gap-3">
                      <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary-100 text-primary-600"><FlaskConical className="h-5 w-5" /></div>
                      <div>
                        <p className="font-medium text-sm text-neutral-900">{booking.test}</p>
                        <p className="text-xs text-neutral-500">{booking.id} · {booking.date}</p>
                      </div>
                    </div>
                    <Badge variant={cfg.variant} dot>{cfg.label}</Badge>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
