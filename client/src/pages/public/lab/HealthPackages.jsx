import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Search, Clock, Home, CheckCircle2, ArrowRight, Package,
  Droplet, Heart, Brain, Bone, Activity, ShieldCheck, Star,
} from 'lucide-react';
import PageHero from '../../../components/public/PageHero.jsx';
import { Badge, Button } from '../../../components/ui/index.jsx';

const packages = [
  {
    name: 'Basic Health Checkup', price: 1499, originalPrice: 2500, tests: 35,
    desc: 'Essential screening for overall health assessment',
    popular: false, color: 'primary',
    includes: ['CBC', 'Lipid Profile', 'Blood Glucose (Fasting)', 'Liver Function Test', 'Kidney Function Test', 'Thyroid Profile (TSH)', 'Urine Routine', 'Blood Group', 'Vitamin D'],
  },
  {
    name: 'Comprehensive Full Body', price: 3999, originalPrice: 6500, tests: 78,
    desc: 'Complete health assessment with 78+ parameters',
    popular: true, color: 'secondary',
    includes: ['All Basic Checkup tests', 'HbA1c (Diabetes)', 'Vitamin B12', 'Iron Studies', 'ECG', 'Chest X-Ray', 'USG Abdomen', 'TMT (Cardiac Stress Test)', 'Pulmonary Function Test', 'Bone Mineral Density'],
  },
  {
    name: 'Diabetes Care Package', price: 1999, originalPrice: 3200, tests: 22,
    desc: 'Specialized tests for diabetes management',
    popular: false, color: 'warning',
    includes: ['HbA1c', 'Fasting Blood Glucose', 'Post-Prandial Glucose', 'Urine for Microalbumin', 'Lipid Profile', 'Kidney Function Test', 'Eye Examination (Fundus)', 'Foot Examination'],
  },
  {
    name: 'Heart Care Package', price: 2499, originalPrice: 4000, tests: 28,
    desc: 'Cardiac risk assessment and lipid analysis',
    popular: false, color: 'error',
    includes: ['ECG', 'Echocardiography', 'TMT (Stress Test)', 'Troponin I', 'Lipid Profile', 'Homocysteine', 'Apolipoprotein A & B', 'CRP (High Sensitivity)'],
  },
  {
    name: 'Women Wellness Package', price: 2999, originalPrice: 4800, tests: 42,
    desc: 'Comprehensive health check designed for women',
    popular: false, color: 'accent',
    includes: ['CBC', 'Thyroid Profile', 'Pap Smear', 'Mammography', 'USG Pelvis', 'Bone Mineral Density', 'Vitamin D', 'Iron Studies', 'Hormone Profile'],
  },
  {
    name: 'Senior Citizen Package', price: 3499, originalPrice: 5500, tests: 55,
    desc: 'Complete health checkup for adults above 50',
    popular: false, color: 'primary',
    includes: ['All Comprehensive tests', 'CT Scan Screening', 'Cardiac Evaluation', 'Memory Assessment', 'Vision & Hearing Test', 'Prostate/Senior specific tests', 'Dietitian Consultation'],
  },
];

export default function HealthPackages() {
  const [search, setSearch] = useState('');
  const filtered = packages.filter((p) => !search || p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <PageHero
        title="Health Checkup Packages"
        subtitle="Comprehensive health packages at up to 60% off. All packages include free home sample collection and digital reports."

      />

      {/* Search */}
      <section className="section py-8">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search packages..." className="input pl-9" />
        </div>
      </section>

      {/* Packages */}
      <section className="section pb-16">
        <div className="grid gap-6 lg:grid-cols-2">
          {filtered.map((pkg, i) => (
            <motion.div key={pkg.name} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }} whileHover={{ y: -4 }} className={`card p-6 card-hover h-full flex flex-col ${pkg.popular ? 'ring-2 ring-secondary-500/20 border-secondary-500' : ''}`}>
              {pkg.popular && (
                <span className="absolute -top-3 right-6 rounded-full bg-secondary-600 px-3 py-1 text-xs font-semibold text-white shadow-sm">Most Popular</span>
              )}
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-display text-lg font-bold text-neutral-900">{pkg.name}</h3>
                  <p className="mt-0.5 text-sm text-neutral-500">{pkg.desc}</p>
                </div>
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary-100 text-primary-600">
                  <Package className="h-6 w-6" />
                </div>
              </div>

              <div className="flex items-center gap-3 mb-4">
                <Badge variant="info">{pkg.tests} tests</Badge>
                <Badge variant="success"><Home className="h-3 w-3" /> Free Home Collection</Badge>
              </div>

              <div className="mb-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">Includes</p>
                <div className="grid grid-cols-2 gap-1.5">
                  {pkg.includes.slice(0, 8).map((item) => (
                    <div key={item} className="flex items-center gap-1.5 text-xs text-neutral-600">
                      <CheckCircle2 className="h-3.5 w-3.5 text-success-500 shrink-0" /> {item}
                    </div>
                  ))}
                  {pkg.includes.length > 8 && <p className="text-xs text-primary-600">+ {pkg.includes.length - 8} more</p>}
                </div>
              </div>

              <div className="mt-auto flex items-end justify-between pt-4 border-t border-neutral-100">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-display text-2xl font-bold text-neutral-900">₹{pkg.price}</span>
                    <span className="text-sm text-neutral-400 line-through">₹{pkg.originalPrice}</span>
                  </div>
                  <p className="text-xs text-success-600 font-medium">Save ₹{pkg.originalPrice - pkg.price} ({Math.round((1 - pkg.price / pkg.originalPrice) * 100)}% off)</p>
                </div>
                <Link to="/lab/book-test" className="btn-primary text-sm">Book Now <ArrowRight className="h-4 w-4" /></Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Info banner */}
      <section className="section pb-16">
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { icon: ShieldCheck, title: 'NABL Certified', desc: 'All tests processed in accredited labs' },
            { icon: Clock, title: 'Fast Reports', desc: 'Most reports within 24 hours' },
            { icon: Home, title: 'Free Home Visit', desc: 'Trained phlebotomists at your doorstep' },
          ].map((f) => (
            <div key={f.title} className="card p-5 flex items-center gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary-100 text-primary-600"><f.icon className="h-5 w-5" /></div>
              <div><p className="text-sm font-semibold text-neutral-900">{f.title}</p><p className="text-xs text-neutral-500">{f.desc}</p></div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
