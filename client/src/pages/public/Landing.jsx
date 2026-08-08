import { Link } from 'react-router-dom';
import { useBookingLink } from '../../hooks/useAuth.js';
import { motion } from 'framer-motion';
import {
  Search, MapPin, Stethoscope, ArrowRight, ShieldCheck,
  Activity, Star, Users, Calendar, Clock, Award, Heart,
  Microscope, Brain, Bone, Baby, Eye, Syringe,
  Phone, Sparkles, TrendingUp, Stethoscope as Doctor,
} from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] } }),
};

const departments = [
  { icon: Heart, name: 'Cardiology', desc: 'Heart & vascular care' },
  { icon: Brain, name: 'Neurology', desc: 'Brain & nervous system' },
  { icon: Bone, name: 'Orthopedics', desc: 'Bones & joints' },
  { icon: Baby, name: 'Pediatrics', desc: 'Child healthcare' },
  { icon: Eye, name: 'Ophthalmology', desc: 'Eye care' },
  { icon: Microscope, name: 'Pathology', desc: 'Lab diagnostics' },
];

const stats = [
  { value: '25+', label: 'Years Experience' },
  { value: '200+', label: 'Expert Doctors' },
  { value: '50k+', label: 'Happy Patients' },
  { value: '30+', label: 'Departments' },
];

const steps = [
  { icon: Search, title: 'Find Your Doctor', desc: 'Search by specialty, location, or availability.' },
  { icon: Calendar, title: 'Book Appointment', desc: 'Pick a time slot that works for you.' },
  { icon: Stethoscope, title: 'Get Consultation', desc: 'Visit in-person or connect online.' },
  { icon: ShieldCheck, title: 'Secure Records', desc: 'Access your medical history anytime.' },
];

export default function Landing() {
  const bookLink = useBookingLink();
  return (
    <div className="page-bg min-h-screen">
      {/* ── HERO CARD ──────────────────────────────────────── */}
      <div className="section pt-4">
        <div className="card-lg overflow-hidden shadow-hero">
          {/* Hero grid */}
          <div className="grid lg:grid-cols-2">
            {/* LEFT — text + search */}
            <div className="px-6 py-12 lg:px-12 lg:py-16">
              <motion.div
                initial="hidden"
                animate="show"
                className="max-w-lg"
              >
                <motion.span variants={fadeUp} custom={0} className="inline-flex items-center gap-2 rounded-full bg-primary-100 px-3.5 py-1.5 text-xs font-semibold text-primary-700 mb-6">
                  <Sparkles className="h-3.5 w-3.5" /> NABH Accredited · 25+ Years of Trust
                </motion.span>

                <motion.h1 variants={fadeUp} custom={1} className="font-display text-4xl font-extrabold leading-[1.1] tracking-tight text-neutral-900 sm:text-5xl lg:text-[3.2rem] text-balance">
                  Best Health Care <br className="hidden sm:block" />
                  <span className="text-primary-500">Services</span> Available
                </motion.h1>

                <motion.p variants={fadeUp} custom={2} className="mt-5 text-base leading-relaxed text-neutral-500 text-pretty sm:text-lg">
                  From routine checkups to complex surgeries, MedCare brings together world-class doctors, smart diagnostics, and compassionate care — all under one roof.
                </motion.p>

                {/* Search bar */}
                <motion.div variants={fadeUp} custom={3} className="mt-8">
                  <div className="flex flex-col gap-2 rounded-2xl border border-neutral-200 bg-white p-2 sm:flex-row sm:items-center sm:rounded-full sm:border-2 sm:border-primary-500/20 sm:bg-white sm:p-2">
                    {/* Location */}
                    <div className="flex items-center gap-2 rounded-full px-3 py-2 sm:flex-1">
                      <MapPin className="h-4 w-4 text-primary-500 shrink-0" />
                      <select className="w-full bg-transparent text-sm font-medium text-neutral-700 focus:outline-none cursor-pointer">
                        <option>Location</option>
                        <option>New York</option>
                        <option>Boston</option>
                        <option>Chicago</option>
                        <option>Los Angeles</option>
                      </select>
                    </div>
                    <div className="hidden h-6 w-px bg-neutral-200 sm:block" />
                    {/* Doctor */}
                    <div className="flex items-center gap-2 rounded-full px-3 py-2 sm:flex-1">
                      <Stethoscope className="h-4 w-4 text-primary-500 shrink-0" />
                      <select className="w-full bg-transparent text-sm font-medium text-neutral-700 focus:outline-none cursor-pointer">
                        <option>Doctor</option>
                        <option>Cardiologist</option>
                        <option>Neurologist</option>
                        <option>Pediatrician</option>
                        <option>Orthopedist</option>
                      </select>
                    </div>
                    <Link to={bookLink.to} state={bookLink.state} className="btn-primary justify-center sm:px-5 sm:py-2.5">
                      <Search className="h-4 w-4" /> Book Appointment
                    </Link>
                  </div>
                </motion.div>

                {/* Trust indicators */}
                <motion.div variants={fadeUp} custom={4} className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-neutral-500">
                  <span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-primary-500" /> Secure Records</span>
                  <span className="flex items-center gap-2"><Clock className="h-4 w-4 text-primary-500" /> 24/7 Emergency</span>
                  <span className="flex items-center gap-2"><Award className="h-4 w-4 text-primary-500" /> Award-winning</span>
                </motion.div>
              </motion.div>
            </div>

            {/* RIGHT — mint green panel + doctor image */}
            <div className="relative min-h-[400px] overflow-hidden bg-hero-mint lg:min-h-full">
              {/* Soft decorative circles */}
              <div className="pointer-events-none absolute -right-10 top-10 h-40 w-40 rounded-full bg-white/30" />
              <div className="pointer-events-none absolute -left-8 bottom-10 h-32 w-32 rounded-full bg-white/20" />

              {/* Doctor image */}
              <motion.div
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0 grid place-items-end justify-center"
              >
                <img
                  src="https://images.pexels.com/photos/5407206/pexels-photo-5407206.jpeg?auto=compress&cs=tinysrgb&w=700"
                  alt="MedCare Doctor"
                  className="h-[88%] w-auto max-w-[90%] object-contain drop-shadow-2xl"
                />
              </motion.div>

              {/* Floating badge — 200+ Best Doctors */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute left-4 top-6 sm:left-6 sm:top-8"
              >
                <div className="flex items-center gap-2.5 rounded-2xl bg-white px-3.5 py-2.5 shadow-card-lg">
                  <div className="flex -space-x-2">
                    <div className="h-8 w-8 rounded-full bg-primary-200 ring-2 ring-white" />
                    <div className="h-8 w-8 rounded-full bg-primary-300 ring-2 ring-white" />
                    <div className="h-8 w-8 rounded-full bg-primary-400 ring-2 ring-white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-neutral-900">200+ Best Doctors</p>
                    <p className="text-[11px] text-neutral-500">Expert care team</p>
                  </div>
                </div>
              </motion.div>

              {/* Floating stat — bottom left */}
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6"
              >
                <div className="flex items-center gap-2.5 rounded-2xl bg-white px-3.5 py-2.5 shadow-card-lg">
                  <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary-100 text-primary-600">
                    <Activity className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-neutral-900">1,247+</p>
                    <p className="text-[11px] text-neutral-500">Active Patients</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* ── STATS BAR ──────────────────────────────────────── */}
      <div className="section py-12">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              className="card p-6 text-center card-hover"
            >
              <p className="font-display text-3xl font-extrabold text-primary-500">{s.value}</p>
              <p className="mt-1 text-sm text-neutral-500">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── DEPARTMENTS ────────────────────────────────────── */}
      <div className="section py-12">
        <div className="mb-10 text-center">
          <h2 className="font-display text-3xl font-extrabold tracking-tight text-neutral-900 sm:text-4xl">
            Our <span className="text-primary-500">Departments</span>
          </h2>
          <p className="mt-3 text-neutral-500 max-w-xl mx-auto">
            Specialized care across every medical discipline, delivered by experienced teams.
          </p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {departments.map((d, i) => (
            <motion.div
              key={d.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.4 }}
              className="card p-6 card-hover group"
            >
              <div className="mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-primary-100 text-primary-600 transition-colors group-hover:bg-primary-500 group-hover:text-white">
                <d.icon className="h-7 w-7" />
              </div>
              <h3 className="font-display text-lg font-bold text-neutral-900">{d.name}</h3>
              <p className="mt-1 text-sm text-neutral-500">{d.desc}</p>
              <Link to="/departments" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary-600 hover:gap-2 transition-all">
                Learn more <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── HOW IT WORKS ───────────────────────────────────── */}
      <div className="section py-12">
        <div className="mb-10 text-center">
          <h2 className="font-display text-3xl font-extrabold tracking-tight text-neutral-900 sm:text-4xl">
            How It <span className="text-primary-500">Works</span>
          </h2>
          <p className="mt-3 text-neutral-500 max-w-xl mx-auto">
            Getting quality healthcare has never been simpler.
          </p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              className="card p-6 text-center card-hover"
            >
              <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-primary-100 text-primary-600">
                <s.icon className="h-7 w-7" />
              </div>
              <div className="mx-auto mb-3 grid h-7 w-7 place-items-center rounded-full bg-primary-500 text-xs font-bold text-white">
                {i + 1}
              </div>
              <h3 className="font-display text-base font-bold text-neutral-900">{s.title}</h3>
              <p className="mt-1 text-sm text-neutral-500">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── LABORATORY / DIAGNOSTICS ───────────────────────── */}
      <div className="section py-12">
        <div className="mb-10 text-center">
          <span className="badge-success">NABL &amp; ISO Accredited Lab</span>
          <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-neutral-900 sm:text-4xl">
            MedCare <span className="text-primary-600">Laboratory</span>
          </h2>
          <p className="mt-3 text-neutral-600 max-w-xl mx-auto">
            Accurate diagnostics with free home sample collection and digital reports in 24 hours.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {/* Popular tests */}
          <div className="card p-6">
            <div className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-primary-100 text-primary-700">
              <Microscope className="h-6 w-6" />
            </div>
            <h3 className="font-display text-lg font-bold text-neutral-900">Popular Tests</h3>
            <ul className="mt-3 space-y-2 text-sm text-neutral-700">
              {[
                ['Complete Blood Count (CBC)', '₹299'],
                ['Lipid Profile', '₹549'],
                ['Thyroid Profile (T3 T4 TSH)', '₹499'],
                ['HbA1c — Diabetes', '₹399'],
                ['Vitamin D & B12', '₹899'],
              ].map(([t, p]) => (
                <li key={t} className="flex items-center justify-between gap-3 border-b border-neutral-200 pb-2 last:border-0">
                  <span>{t}</span>
                  <span className="font-semibold text-primary-700">{p}</span>
                </li>
              ))}
            </ul>
            <Link to="/lab/categories" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary-700 hover:gap-2 transition-all">
              View all tests <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Health packages */}
          <div className="card p-6">
            <div className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-primary-100 text-primary-700">
              <Syringe className="h-6 w-6" />
            </div>
            <h3 className="font-display text-lg font-bold text-neutral-900">Health Packages</h3>
            <ul className="mt-3 space-y-3 text-sm text-neutral-700">
              {[
                ['Basic Health Checkup', '32 tests', '₹999'],
                ['Full Body Advanced', '78 tests', '₹2,499'],
                ['Women’s Wellness', '55 tests', '₹1,899'],
                ['Senior Citizen Care', '85 tests', '₹2,999'],
              ].map(([name, count, price]) => (
                <li key={name} className="flex items-center justify-between gap-3 border-b border-neutral-200 pb-2 last:border-0">
                  <span>
                    <span className="font-medium text-neutral-900">{name}</span>
                    <span className="block text-xs text-neutral-600">{count}</span>
                  </span>
                  <span className="font-semibold text-primary-700">{price}</span>
                </li>
              ))}
            </ul>
            <Link to="/lab/packages" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary-700 hover:gap-2 transition-all">
              Compare packages <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Why us + CTAs */}
          <div className="card p-6">
            <div className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-primary-100 text-primary-700">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="font-display text-lg font-bold text-neutral-900">Why MedCare Lab</h3>
            <ul className="mt-3 space-y-2 text-sm text-neutral-700">
              <li className="flex items-start gap-2"><Award className="mt-0.5 h-4 w-4 text-primary-600" /> NABL &amp; ISO 15189 accredited</li>
              <li className="flex items-start gap-2"><Clock className="mt-0.5 h-4 w-4 text-primary-600" /> Reports within 24 hours</li>
              <li className="flex items-start gap-2"><Users className="mt-0.5 h-4 w-4 text-primary-600" /> Free home sample collection</li>
              <li className="flex items-start gap-2"><Activity className="mt-0.5 h-4 w-4 text-primary-600" /> Fully automated analysers</li>
              <li className="flex items-start gap-2"><Star className="mt-0.5 h-4 w-4 text-primary-600" /> 4.9/5 from 12,000+ patients</li>
            </ul>
            <div className="mt-5 flex flex-wrap gap-2">
              <Link to="/lab/book-test" className="btn-primary text-sm">Book a Test</Link>
              <Link to="/lab/download" className="btn-outline text-sm">Download Report</Link>
              <Link to="/lab/track" className="btn-white text-sm">Track Test</Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── CTA ────────────────────────────────────────────── */}
      <div className="section py-12 pb-20">
        <div className="card-lg overflow-hidden bg-gradient-to-br from-primary-500 to-primary-600 p-10 text-center sm:p-16">
          <h2 className="font-display text-3xl font-extrabold text-white sm:text-4xl">
            Your Health, Our Priority
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-white/90">
            Join thousands of patients who trust MedCare for their healthcare needs.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to={bookLink.to} state={bookLink.state} className="btn bg-white text-primary-600 hover:bg-neutral-50 px-6 py-3 font-semibold shadow-lg">
              Book Appointment <ArrowRight className="h-4 w-4" />
            </Link>
            <a href="tel:1066" className="btn border-2 border-white text-white hover:bg-white/10 px-6 py-3 font-semibold">
              <Phone className="h-4 w-4" /> Emergency: 1066
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
