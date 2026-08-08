import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  FlaskConical, TestTube, Home, MapPin, Search, Clock, ShieldCheck,
  ArrowRight, CheckCircle2, Droplet, HeartPulse, Brain, Bone, Eye,
  Baby, Microscope, Beaker, Scan, Activity, Stethoscope, Star,
  Phone, Calendar, FileText, Package,
} from 'lucide-react';
import PageHero from '../../../components/public/PageHero.jsx';

const testCategories = [
  { icon: Droplet, name: 'Hematology', tests: 24, desc: 'CBC, blood group, coagulation', color: 'from-error-500 to-error-600' },
  { icon: Beaker, name: 'Biochemistry', tests: 32, desc: 'LFT, KFT, lipid profile, glucose', color: 'from-primary-500 to-primary-600' },
  { icon: Microscope, name: 'Microbiology', tests: 18, desc: 'Culture, gram stain, sensitivity', color: 'from-secondary-500 to-secondary-600' },
  { icon: HeartPulse, name: 'Cardiology', tests: 12, desc: 'ECG, echo, troponin, lipid', color: 'from-error-600 to-error-700' },
  { icon: Brain, name: 'Neurology', tests: 8, desc: 'MRI, CT scan, EEG', color: 'from-primary-600 to-primary-700' },
  { icon: Baby, name: 'Prenatal', tests: 15, desc: 'Triple marker, NT scan, CBC', color: 'from-secondary-600 to-secondary-700' },
  { icon: Bone, name: 'Orthopedics', tests: 6, desc: 'X-Ray, DEXA, calcium', color: 'from-warning-500 to-warning-600' },
  { icon: Eye, name: 'Ophthalmology', tests: 5, desc: 'Fundus, OCT, vision tests', color: 'from-accent-500 to-accent-600' },
];

const popularTests = [
  { name: 'Complete Blood Count (CBC)', price: 350, category: 'Hematology', time: 'Same day', homeCollection: true },
  { name: 'Lipid Profile', price: 800, category: 'Biochemistry', time: 'Same day', homeCollection: true },
  { name: 'Thyroid Profile (T3, T4, TSH)', price: 600, category: 'Biochemistry', time: '24 hours', homeCollection: true },
  { name: 'HbA1c (Diabetes)', price: 550, category: 'Biochemistry', time: 'Same day', homeCollection: true },
  { name: 'Vitamin D', price: 1200, category: 'Biochemistry', time: '48 hours', homeCollection: true },
  { name: 'Liver Function Test (LFT)', price: 700, category: 'Biochemistry', time: 'Same day', homeCollection: true },
  { name: 'Kidney Function Test (KFT)', price: 750, category: 'Biochemistry', time: 'Same day', homeCollection: true },
  { name: 'Urine Culture', price: 400, category: 'Microbiology', time: '48 hours', homeCollection: true },
];

const packages = [
  { name: 'Basic Health Checkup', price: 1499, originalPrice: 2500, tests: 35, desc: 'Essential screening for overall health', popular: false, color: 'border-primary-200' },
  { name: 'Comprehensive Full Body', price: 3999, originalPrice: 6500, tests: 78, desc: 'Complete health assessment with 78 parameters', popular: true, color: 'border-secondary-500 ring-2 ring-secondary-500/20' },
  { name: 'Diabetes Care Package', price: 1999, originalPrice: 3200, tests: 22, desc: 'Specialized tests for diabetes management', popular: false, color: 'border-warning-200' },
  { name: 'Heart Care Package', price: 2499, originalPrice: 4000, tests: 28, desc: 'Cardiac risk assessment and lipid analysis', popular: false, color: 'border-error-200' },
];

const features = [
  { icon: Home, title: 'Home Sample Collection', desc: 'Free home collection within city limits. Trained phlebotomists arrive at your doorstep.' },
  { icon: Clock, title: 'Same-Day Reports', desc: 'Most reports delivered within 24 hours. Get SMS and email notifications.' },
  { icon: ShieldCheck, title: 'NABL Certified Labs', desc: 'All tests processed in NABL-accredited laboratories with strict quality control.' },
  { icon: FileText, title: 'Digital Reports', desc: 'Download reports instantly from our portal. Access anytime, anywhere.' },
];

export default function LabHome() {
  return (
    <div>
      <PageHero
        title="Diagnostic Center & Laboratory"
        subtitle="NABL-accredited labs with 200+ tests. Book online, get home sample collection, and download reports — all in one place."

      />

      {/* Quick Actions */}
      <section className="section py-10">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { to: '/lab/book-test', icon: Calendar, label: 'Book a Lab Test', desc: 'Schedule a test online', color: 'from-primary-500 to-primary-600' },
            { to: '/lab/packages', icon: Package, label: 'Health Packages', desc: 'Save up to 60%', color: 'from-secondary-500 to-secondary-600' },
            { to: '/lab/track', icon: Search, label: 'Track Test Status', desc: 'Check your report status', color: 'from-accent-500 to-accent-600' },
            { to: '/lab/download', icon: FileText, label: 'Download Report', desc: 'Get your test reports', color: 'from-error-500 to-error-600' },
          ].map((a, i) => (
            <Link to={a.to} key={a.label}>
              <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }} whileHover={{ y: -4 }} className="card group p-5 card-hover cursor-pointer h-full">
                <div className={`mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br ${a.color} text-white shadow-sm transition-transform group-hover:scale-110`}>
                  <a.icon className="h-6 w-6" />
                </div>
                <h3 className="font-display text-base font-bold text-neutral-900">{a.label}</h3>
                <p className="mt-0.5 text-sm text-neutral-500">{a.desc}</p>
                <div className="mt-3 flex items-center text-sm font-medium text-primary-600 opacity-0 transition-opacity group-hover:opacity-100">
                  Get started <ArrowRight className="ml-1 h-4 w-4" />
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="section py-10">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <motion.div key={f.title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }} className="flex gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary-100 text-primary-600">
                <f.icon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-neutral-900">{f.title}</h3>
                <p className="mt-0.5 text-xs text-neutral-500 leading-relaxed">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Test Categories */}
      <section className="section py-12">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="font-display text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">Test Categories</h2>
            <p className="mt-1.5 text-neutral-500">Browse 200+ tests across 8 specialties</p>
          </div>
          <Link to="/lab/categories" className="btn-outline shrink-0">View all <ArrowRight className="h-4 w-4" /></Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {testCategories.map((cat, i) => (
            <Link to="/lab/categories" key={cat.name}>
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} whileHover={{ y: -4 }} className="card group p-5 card-hover cursor-pointer h-full">
                <div className={`mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br ${cat.color} text-white shadow-sm transition-transform group-hover:scale-110`}>
                  <cat.icon className="h-6 w-6" />
                </div>
                <h3 className="font-display text-base font-bold text-neutral-900">{cat.name}</h3>
                <p className="mt-0.5 text-sm text-neutral-500">{cat.desc}</p>
                <p className="mt-2 text-xs font-medium text-primary-600">{cat.tests} tests available</p>
              </motion.div>
            </Link>
          ))}
        </div>
      </section>

      {/* Popular Tests */}
      <section className="relative bg-neutral-50 py-12">
        <div className="section">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="font-display text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">Popular Tests</h2>
              <p className="mt-1.5 text-neutral-500">Most booked tests with home sample collection</p>
            </div>
            <Link to="/lab/book-test" className="btn-primary shrink-0"><Calendar className="h-4 w-4" /> Book Now</Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {popularTests.map((test, i) => (
              <motion.div key={test.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.04 }} whileHover={{ y: -4 }} className="card group p-5 card-hover h-full flex flex-col">
                <div className="flex items-start justify-between mb-3">
                  <span className="badge-neutral">{test.category}</span>
                  {test.homeCollection && <span className="badge-success"><Home className="h-3 w-3" /> Home</span>}
                </div>
                <h3 className="font-display text-sm font-bold text-neutral-900 leading-snug">{test.name}</h3>
                <p className="mt-1 text-xs text-neutral-500 flex items-center gap-1"><Clock className="h-3 w-3" /> {test.time}</p>
                <div className="mt-auto pt-4 flex items-center justify-between">
                  <div>
                    <p className="font-display text-xl font-bold text-neutral-900">₹{test.price}</p>
                  </div>
                  <Link to="/lab/book-test" className="btn-primary text-xs px-3 py-1.5">Book</Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Health Packages */}
      <section className="section py-12">
        <div className="text-center mb-10">
          <h2 className="font-display text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">Health Checkup Packages</h2>
          <p className="mt-1.5 text-neutral-500">Comprehensive packages at up to 60% off. Includes free home collection.</p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {packages.map((pkg, i) => (
            <motion.div key={pkg.name} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }} whileHover={{ y: -6 }} className={`card p-6 card-hover h-full flex flex-col ${pkg.color} ${pkg.popular ? 'relative' : ''}`}>
              {pkg.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-secondary-600 px-3 py-1 text-xs font-semibold text-white shadow-sm">Most Popular</span>
              )}
              <h3 className="font-display text-base font-bold text-neutral-900">{pkg.name}</h3>
              <p className="mt-1 text-sm text-neutral-500">{pkg.desc}</p>
              <p className="mt-3 text-xs font-medium text-primary-600">{pkg.tests} tests included</p>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="font-display text-2xl font-bold text-neutral-900">₹{pkg.price}</span>
                <span className="text-sm text-neutral-400 line-through">₹{pkg.originalPrice}</span>
              </div>
              <Link to="/lab/book-test" className="mt-4 btn-primary w-full justify-center text-sm">Book Package</Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="section py-12">
        <motion.div initial={{ opacity: 0, scale: 0.97 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="relative overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-700 px-8 py-12 text-center text-white shadow-2xl">
          <div className="absolute inset-0 bg-grid-dark opacity-20" />
          <div className="relative">
            <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl text-balance">Book your lab test in 3 easy steps</h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-3 max-w-3xl mx-auto">
              {[
                { step: '1', title: 'Select Test', desc: 'Choose from 200+ tests or packages' },
                { step: '2', title: 'Pick Time & Mode', desc: 'Home collection or visit lab' },
                { step: '3', title: 'Get Reports', desc: 'Download from portal or email' },
              ].map((s) => (
                <div key={s.step} className="text-center">
                  <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-white/15 backdrop-blur text-white font-display text-lg font-bold">{s.step}</div>
                  <h3 className="font-semibold">{s.title}</h3>
                  <p className="mt-1 text-sm text-primary-100">{s.desc}</p>
                </div>
              ))}
            </div>
            <Link to="/lab/book-test" className="mt-8 btn bg-white text-primary-700 hover:bg-primary-50 px-6 py-3 text-base active:scale-[0.97]">Book a Test Now <ArrowRight className="h-5 w-5" /></Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
