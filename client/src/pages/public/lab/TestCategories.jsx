import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search, Clock, CheckCircle2, AlertCircle, FlaskConical, TestTube,
  Droplet, HeartPulse, Brain, Bone, Eye, Baby, Microscope, Beaker,
  Scan, Activity, FileText, ArrowRight,
} from 'lucide-react';
import PageHero from '../../../components/public/PageHero.jsx';
import { Badge } from '../../../components/ui/index.jsx';

const categories = [
  { icon: Droplet, name: 'Hematology', tests: 24, desc: 'Blood-related tests including CBC, blood grouping, coagulation studies', color: 'from-error-500 to-error-600' },
  { icon: Beaker, name: 'Biochemistry', tests: 32, desc: 'Liver, kidney, lipid, glucose, thyroid and hormone panels', color: 'from-primary-500 to-primary-600' },
  { icon: Microscope, name: 'Microbiology', tests: 18, desc: 'Cultures, sensitivity testing, gram stains, parasitology', color: 'from-secondary-500 to-secondary-600' },
  { icon: HeartPulse, name: 'Cardiology', tests: 12, desc: 'ECG, echo, troponin, cardiac biomarkers', color: 'from-error-600 to-error-700' },
  { icon: Brain, name: 'Neurology', tests: 8, desc: 'MRI, CT scan, EEG, nerve conduction studies', color: 'from-primary-600 to-primary-700' },
  { icon: Baby, name: 'Prenatal', tests: 15, desc: 'Triple marker, NT scan, pregnancy-related tests', color: 'from-secondary-600 to-secondary-700' },
  { icon: Bone, name: 'Orthopedics', tests: 6, desc: 'X-Ray, DEXA scan, calcium, vitamin D, arthritis panel', color: 'from-warning-500 to-warning-600' },
  { icon: Eye, name: 'Ophthalmology', tests: 5, desc: 'Fundus photography, OCT, vision tests', color: 'from-accent-500 to-accent-600' },
  { icon: Scan, name: 'Radiology', tests: 14, desc: 'X-Ray, CT, MRI, ultrasound, Doppler studies', color: 'from-primary-700 to-primary-800' },
  { icon: Activity, name: 'Pathology', tests: 20, desc: 'Biopsy, cytology, histopathology, tissue analysis', color: 'from-warning-600 to-warning-700' },
];

const allTests = [
  { name: 'Complete Blood Count (CBC)', price: 350, category: 'Hematology', time: 'Same day', prep: 'No fasting' },
  { name: 'Lipid Profile', price: 800, category: 'Biochemistry', time: 'Same day', prep: '12-hour fasting' },
  { name: 'Thyroid Profile (T3, T4, TSH)', price: 600, category: 'Biochemistry', time: '24 hours', prep: 'No fasting' },
  { name: 'HbA1c (Diabetes)', price: 550, category: 'Biochemistry', time: 'Same day', prep: 'No fasting' },
  { name: 'Vitamin D', price: 1200, category: 'Biochemistry', time: '48 hours', prep: 'No fasting' },
  { name: 'Liver Function Test (LFT)', price: 700, category: 'Biochemistry', time: 'Same day', prep: '8-hour fasting' },
  { name: 'Kidney Function Test (KFT)', price: 750, category: 'Biochemistry', time: 'Same day', prep: 'No fasting' },
  { name: 'Urine Culture', price: 400, category: 'Microbiology', time: '48 hours', prep: 'Clean catch' },
  { name: 'ECG (Electrocardiogram)', price: 500, category: 'Cardiology', time: 'Same day', prep: 'None' },
  { name: 'X-Ray Chest', price: 450, category: 'Radiology', time: 'Same day', prep: 'Loose clothing' },
  { name: 'CT Scan Head', price: 2500, category: 'Radiology', time: '24 hours', prep: 'Remove metal' },
  { name: 'MRI Brain', price: 4500, category: 'Radiology', time: '48 hours', prep: 'No metal items' },
  { name: 'Blood Group Typing', price: 200, category: 'Hematology', time: 'Same day', prep: 'None' },
  { name: 'Coagulation Profile', price: 900, category: 'Hematology', time: 'Same day', prep: 'Inform about blood thinners' },
  { name: 'Pregnancy Test (Beta hCG)', price: 600, category: 'Hormone', time: 'Same day', prep: 'Morning urine' },
  { name: 'Vitamin B12', price: 1000, category: 'Biochemistry', time: '24 hours', prep: 'No fasting' },
];

export default function TestCategories() {
  const [selectedCat, setSelectedCat] = useState(null);
  const [search, setSearch] = useState('');

  const filteredTests = allTests.filter((t) => {
    if (selectedCat && t.category !== selectedCat) return false;
    if (search && !t.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div>
      <PageHero
        title="Test Categories & Prices"
        subtitle="Browse 200+ diagnostic tests across 10 specialties. View prices, preparation instructions, and turnaround times."

      />

      {/* Category cards */}
      <section className="section py-10">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {categories.map((cat, i) => (
            <motion.button
              key={cat.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              onClick={() => setSelectedCat(selectedCat === cat.name ? null : cat.name)}
              className={`card group p-5 text-left card-hover cursor-pointer transition-all ${selectedCat === cat.name ? 'ring-2 ring-primary-500' : ''}`}
            >
              <div className={`mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br ${cat.color} text-white shadow-sm transition-transform group-hover:scale-110`}>
                <cat.icon className="h-6 w-6" />
              </div>
              <h3 className="font-display text-sm font-bold text-neutral-900">{cat.name}</h3>
              <p className="mt-0.5 text-xs text-neutral-500 leading-relaxed">{cat.desc}</p>
              <p className="mt-2 text-xs font-medium text-primary-600">{cat.tests} tests</p>
            </motion.button>
          ))}
        </div>
      </section>

      {/* Search + Test List */}
      <section className="section pb-16">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-display text-xl font-bold text-neutral-900">
            {selectedCat ? `${selectedCat} Tests` : 'All Tests'}
          </h2>
          <div className="relative max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search tests..." className="input pl-9" />
          </div>
        </div>

        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-neutral-100 bg-neutral-50/50">
                  <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-neutral-500">Test Name</th>
                  <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-neutral-500">Category</th>
                  <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-neutral-500">Turnaround</th>
                  <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-neutral-500">Preparation</th>
                  <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-neutral-500 text-right">Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredTests.map((test, i) => (
                  <motion.tr key={test.name} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }} className="table-row-hover">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary-100 text-primary-600 shrink-0"><TestTube className="h-4.5 w-4.5" /></div>
                        <span className="font-medium text-neutral-900">{test.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5"><Badge variant="neutral">{test.category}</Badge></td>
                    <td className="px-5 py-3.5 text-neutral-500"><span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {test.time}</span></td>
                    <td className="px-5 py-3.5 text-neutral-500">{test.prep}</td>
                    <td className="px-5 py-3.5 text-right"><span className="font-display text-base font-bold text-neutral-900">₹{test.price}</span></td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
