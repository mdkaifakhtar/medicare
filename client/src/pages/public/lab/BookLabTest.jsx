import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Calendar, Clock, Home, Building2, User, Phone, Mail, Search,
  CheckCircle2, ArrowRight, FlaskConical, TestTube, Droplet,
  HeartPulse, Brain, Bone, Eye, Baby, Microscope, Beaker, Activity,
} from 'lucide-react';
import PageHero from '../../../components/public/PageHero.jsx';
import { Badge, Button } from '../../../components/ui/index.jsx';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { mockApi } from '../../../services/mockApi.js';

const allTests = [
  { id: 1, name: 'Complete Blood Count (CBC)', price: 350, category: 'Hematology', time: 'Same day', homeCollection: true, prep: 'No fasting required' },
  { id: 2, name: 'Lipid Profile', price: 800, category: 'Biochemistry', time: 'Same day', homeCollection: true, prep: '12-hour fasting required' },
  { id: 3, name: 'Thyroid Profile (T3, T4, TSH)', price: 600, category: 'Biochemistry', time: '24 hours', homeCollection: true, prep: 'No fasting required' },
  { id: 4, name: 'HbA1c (Diabetes)', price: 550, category: 'Biochemistry', time: 'Same day', homeCollection: true, prep: 'No fasting required' },
  { id: 5, name: 'Vitamin D', price: 1200, category: 'Biochemistry', time: '48 hours', homeCollection: true, prep: 'No fasting required' },
  { id: 6, name: 'Liver Function Test (LFT)', price: 700, category: 'Biochemistry', time: 'Same day', homeCollection: true, prep: '8-hour fasting recommended' },
  { id: 7, name: 'Kidney Function Test (KFT)', price: 750, category: 'Biochemistry', time: 'Same day', homeCollection: true, prep: 'No fasting required' },
  { id: 8, name: 'Urine Culture', price: 400, category: 'Microbiology', time: '48 hours', homeCollection: true, prep: 'Clean catch midstream sample' },
  { id: 9, name: 'ECG (Electrocardiogram)', price: 500, category: 'Cardiology', time: 'Same day', homeCollection: false, prep: 'No preparation needed' },
  { id: 10, name: 'X-Ray Chest', price: 450, category: 'Radiology', time: 'Same day', homeCollection: false, prep: 'Wear loose clothing' },
  { id: 11, name: 'CT Scan Head', price: 2500, category: 'Radiology', time: '24 hours', homeCollection: false, prep: 'Remove metal objects' },
  { id: 12, name: 'MRI Brain', price: 4500, category: 'Radiology', time: '48 hours', homeCollection: false, prep: 'Remove all metal items' },
  { id: 13, name: 'Blood Group Typing', price: 200, category: 'Hematology', time: 'Same day', homeCollection: true, prep: 'No preparation needed' },
  { id: 14, name: 'Coagulation Profile', price: 900, category: 'Hematology', time: 'Same day', homeCollection: true, prep: 'Inform about blood thinners' },
  { id: 15, name: 'Pregnancy Test (Beta hCG)', price: 600, category: 'Hormone', time: 'Same day', homeCollection: true, prep: 'First morning urine preferred' },
  { id: 16, name: 'Vitamin B12', price: 1000, category: 'Biochemistry', time: '24 hours', homeCollection: true, prep: 'No fasting required' },
];

const categories = ['All', 'Hematology', 'Biochemistry', 'Microbiology', 'Cardiology', 'Radiology', 'Hormone'];

export default function BookLabTest() {
  const [step, setStep] = useState(1);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [selectedTests, setSelectedTests] = useState([]);
  const [mode, setMode] = useState('home');
  const [submitting, setSubmitting] = useState(false);
  const { user } = useSelector((s) => s.auth);
  const [formData, setFormData] = useState({
    name: user?.name || '', phone: user?.phone || '', email: user?.email || '', date: '', time: '', address: '',
  });

  const filtered = allTests.filter((t) => {
    if (category !== 'All' && t.category !== category) return false;
    if (search && !t.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const toggleTest = (test) => {
    setSelectedTests((prev) => {
      const exists = prev.find((t) => t.id === test.id);
      if (exists) return prev.filter((t) => t.id !== test.id);
      return [...prev, test];
    });
  };

  const totalPrice = selectedTests.reduce((s, t) => s + t.price, 0);

  // Booking pushes every selected test into the lab queue as "pending".
  // Lab staff then collect the sample and complete the report — the finished
  // report shows up automatically under the patient's My Reports.
  const handleSubmit = async () => {
    if (!formData.name || !formData.phone || !formData.date) {
      toast.error('Please fill all required fields');
      return;
    }
    if (selectedTests.length === 0) {
      toast.error('Please select at least one test');
      return;
    }
    setSubmitting(true);
    try {
      for (const t of selectedTests) {
        await mockApi.requestLabTest({
          patientId: user?.patientId || user?.id || null,
          patientName: formData.name,
          testName: t.name,
          testType: t.category,
          category: t.category,
          doctorName: 'Self-requested',
          priority: 'normal',
        }, { id: user?.id, name: formData.name, role: user?.role || 'patient' });
      }
      setStep(4);
      toast.success('Lab test booked — our laboratory team has received your request.');
    } catch {
      toast.error('Could not book the test. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <PageHero
        title="Book a Lab Test"
        subtitle="Choose from 200+ tests. Select home sample collection or visit our lab. Get reports online."

      />

      {/* Steps indicator */}
      <section className="section py-8">
        <div className="flex items-center justify-center gap-2 sm:gap-4">
          {['Select Tests', 'Collection Mode', 'Your Details', 'Confirmation'].map((label, i) => (
            <div key={label} className="flex items-center">
              <div className={`flex items-center gap-2 ${step > i + 1 ? 'text-secondary-600' : step === i + 1 ? 'text-primary-600' : 'text-neutral-400'}`}>
                <div className={`grid h-8 w-8 place-items-center rounded-full text-sm font-semibold transition ${step > i + 1 ? 'bg-secondary-600 text-white' : step === i + 1 ? 'bg-primary-600 text-white' : 'bg-neutral-200'}`}>
                  {step > i + 1 ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
                </div>
                <span className="hidden text-sm font-medium sm:block">{label}</span>
              </div>
              {i < 3 && <div className={`mx-2 h-0.5 w-8 sm:w-16 ${step > i + 1 ? 'bg-secondary-500' : 'bg-neutral-200'}`} />}
            </div>
          ))}
        </div>
      </section>

      {/* Step 1: Select Tests */}
      {step === 1 && (
        <section className="section pb-16">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search tests..." className="input pl-9" />
            </div>
            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              {categories.map((cat) => (
                <button key={cat} onClick={() => setCategory(cat)} className={`shrink-0 rounded-xl px-3 py-2 text-sm font-medium transition ${category === cat ? 'bg-primary-600 text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'}`}>
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((test, i) => {
              const selected = selectedTests.find((t) => t.id === test.id);
              return (
                <motion.div key={test.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} onClick={() => toggleTest(test)} className={`card p-5 cursor-pointer transition-all ${selected ? 'ring-2 ring-primary-500 border-primary-300' : 'card-hover'}`}>
                  <div className="flex items-start justify-between mb-2">
                    <Badge variant="neutral">{test.category}</Badge>
                    {selected && <CheckCircle2 className="h-5 w-5 text-primary-500" />}
                  </div>
                  <h3 className="font-display text-sm font-bold text-neutral-900 leading-snug">{test.name}</h3>
                  <div className="mt-2 flex items-center gap-3 text-xs text-neutral-500">
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {test.time}</span>
                    {test.homeCollection && <span className="flex items-center gap-1 text-success-600"><Home className="h-3 w-3" /> Home</span>}
                  </div>
                  <p className="mt-1.5 text-xs text-neutral-400">{test.prep}</p>
                  <p className="mt-3 font-display text-lg font-bold text-neutral-900">₹{test.price}</p>
                </motion.div>
              );
            })}
          </div>

          {/* Sticky bottom bar */}
          {selectedTests.length > 0 && (
            <motion.div initial={{ y: 80 }} animate={{ y: 0 }} className="fixed bottom-4 left-4 right-4 z-30 mx-auto max-w-3xl">
              <div className="glass-strong flex items-center justify-between rounded-2xl px-5 py-4 shadow-elevated">
                <div>
                  <p className="text-sm font-medium text-neutral-900">{selectedTests.length} test{selectedTests.length > 1 ? 's' : ''} selected</p>
                  <p className="font-display text-xl font-bold text-primary-600">₹{totalPrice}</p>
                </div>
                <Button onClick={() => setStep(2)}>Continue <ArrowRight className="h-4 w-4" /></Button>
              </div>
            </motion.div>
          )}
        </section>
      )}

      {/* Step 2: Collection Mode */}
      {step === 2 && (
        <section className="section pb-16">
          <div className="mx-auto max-w-2xl">
            <h2 className="font-display text-xl font-bold text-neutral-900 mb-6">Choose Collection Mode</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} onClick={() => setMode('home')} className={`card p-6 cursor-pointer transition-all ${mode === 'home' ? 'ring-2 ring-primary-500 border-primary-300' : 'card-hover'}`}>
                <div className="mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-primary-100 text-primary-600"><Home className="h-7 w-7" /></div>
                <h3 className="font-display text-lg font-bold text-neutral-900">Home Sample Collection</h3>
                <p className="mt-1 text-sm text-neutral-500">Trained phlebotomist visits your home. Free within city limits.</p>
                <ul className="mt-4 space-y-1.5 text-sm text-neutral-600">
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-success-500" /> Free home visit</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-success-500" /> Trained phlebotomists</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-success-500" /> Safe & hygienic</li>
                </ul>
              </motion.div>
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} onClick={() => setMode('lab')} className={`card p-6 cursor-pointer transition-all ${mode === 'lab' ? 'ring-2 ring-primary-500 border-primary-300' : 'card-hover'}`}>
                <div className="mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-secondary-100 text-secondary-600"><Building2 className="h-7 w-7" /></div>
                <h3 className="font-display text-lg font-bold text-neutral-900">Visit Laboratory</h3>
                <p className="mt-1 text-sm text-neutral-500">Come to our diagnostic center. Get tested on the spot.</p>
                <ul className="mt-4 space-y-1.5 text-sm text-neutral-600">
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-success-500" /> No appointment needed</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-success-500" /> Walk-in available</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-success-500" /> All tests available</li>
                </ul>
              </motion.div>
            </div>
            <div className="mt-8 flex justify-between">
              <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
              <Button onClick={() => setStep(3)}>Continue <ArrowRight className="h-4 w-4" /></Button>
            </div>
          </div>
        </section>
      )}

      {/* Step 3: Details */}
      {step === 3 && (
        <section className="section pb-16">
          <div className="mx-auto max-w-2xl">
            <h2 className="font-display text-xl font-bold text-neutral-900 mb-6">Enter Your Details</h2>
            <div className="card p-6 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div><label className="label">Full Name *</label><div className="relative"><User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" /><input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="input pl-9" placeholder="John Doe" /></div></div>
                <div><label className="label">Phone Number *</label><div className="relative"><Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" /><input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="input pl-9" placeholder="+91 98765 43210" /></div></div>
              </div>
              <div><label className="label">Email</label><div className="relative"><Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" /><input value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="input pl-9" placeholder="john@example.com" /></div></div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div><label className="label">Preferred Date *</label><div className="relative"><Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" /><input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} className="input pl-9" /></div></div>
                <div><label className="label">Preferred Time</label><div className="relative"><Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" /><input type="time" value={formData.time} onChange={(e) => setFormData({ ...formData, time: e.target.value })} className="input pl-9" /></div></div>
              </div>
              {mode === 'home' && (
                <div><label className="label">Collection Address *</label><textarea value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className="input" rows={3} placeholder="Enter your full address for sample collection" /></div>
              )}
            </div>

            {/* Summary */}
            <div className="mt-6 card p-5">
              <h3 className="text-sm font-semibold text-neutral-900 mb-3">Order Summary</h3>
              <div className="space-y-2">
                {selectedTests.map((t) => (
                  <div key={t.id} className="flex justify-between text-sm">
                    <span className="text-neutral-600">{t.name}</span>
                    <span className="font-medium text-neutral-900">₹{t.price}</span>
                  </div>
                ))}
                <div className="divider my-2" />
                <div className="flex justify-between">
                  <span className="font-semibold text-neutral-900">Total</span>
                  <span className="font-display text-lg font-bold text-primary-600">₹{totalPrice}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-between">
              <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
              <Button disabled={submitting} onClick={handleSubmit}>{submitting ? "Booking..." : "Confirm Booking"} <CheckCircle2 className="h-4 w-4" /></Button>
            </div>
          </div>
        </section>
      )}

      {/* Step 4: Confirmation */}
      {step === 4 && (
        <section className="section pb-16">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mx-auto max-w-lg text-center">
            <div className="mx-auto mb-6 grid h-20 w-20 place-items-center rounded-full bg-success-100">
              <CheckCircle2 className="h-10 w-10 text-success-600" />
            </div>
            <h2 className="font-display text-2xl font-bold text-neutral-900">Booking Confirmed!</h2>
            <p className="mt-2 text-neutral-500">Your lab test has been booked successfully. You will receive an SMS and email confirmation shortly.</p>
            <div className="mt-6 card p-6 text-left">
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-neutral-500">Booking ID</span><span className="font-mono font-medium text-neutral-900">LAB{Date.now().toString().slice(-8)}</span></div>
                <div className="flex justify-between"><span className="text-neutral-500">Patient</span><span className="font-medium text-neutral-900">{formData.name}</span></div>
                <div className="flex justify-between"><span className="text-neutral-500">Date & Time</span><span className="font-medium text-neutral-900">{formData.date} {formData.time}</span></div>
                <div className="flex justify-between"><span className="text-neutral-500">Mode</span><span className="font-medium text-neutral-900">{mode === 'home' ? 'Home Collection' : 'Visit Lab'}</span></div>
                <div className="flex justify-between"><span className="text-neutral-500">Tests</span><span className="font-medium text-neutral-900">{selectedTests.length} test(s)</span></div>
                <div className="divider my-2" />
                <div className="flex justify-between"><span className="font-semibold text-neutral-900">Total Amount</span><span className="font-display text-lg font-bold text-primary-600">₹{totalPrice}</span></div>
              </div>
            </div>
            <div className="mt-6 flex justify-center gap-3">
              <Link to="/lab/track" className="btn-primary">Track Status <ArrowRight className="h-4 w-4" /></Link>
              <Link to="/lab" className="btn-outline">Back to Lab</Link>
            </div>
          </motion.div>
        </section>
      )}
    </div>
  );
}
