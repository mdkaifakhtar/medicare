import { motion } from 'framer-motion';
import { Ambulance, FlaskConical, Pill, BedDouble, HeartPulse, Microscope, Scan, Car } from 'lucide-react';
import PageHero from '../../components/public/PageHero.jsx';

const facilities = [
  { icon: HeartPulse, name: '24/7 Trauma Center', desc: 'Level-1 trauma center with rapid-response team and dedicated ambulance bay.' },
  { icon: BedDouble, name: '650 Beds & ICU', desc: 'General, semi-private, deluxe rooms and 80 ICU beds with modern monitoring.' },
  { icon: FlaskConical, name: 'NABL Labs', desc: 'Fully automated diagnostic labs with 1,200+ test capabilities.' },
  { icon: Scan, name: 'Radiology & Imaging', desc: '3T MRI, 128-slice CT, digital mammography, and advanced ultrasound.' },
  { icon: Pill, name: '24/7 Pharmacy', desc: 'In-house pharmacy with home delivery and cold-chain management.' },
  { icon: Ambulance, name: 'Ambulance Fleet', desc: '20+ ambulances including ALS, BLS, and neonatal transport vehicles.' },
  { icon: Microscope, name: 'Operation Theatres', desc: '18 modular OTs with laminar airflow and robotic surgery capability.' },
  { icon: Car, name: 'Patient Transport', desc: 'Wheelchair and stretcher services across the campus for patients.' },
];

export default function Facilities() {
  return (
    <div>
      <PageHero title="World-class Facilities" subtitle="State-of-the-art infrastructure designed for patient comfort, safety, and clinical excellence." />
      <section className="section py-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {facilities.map((f, i) => (
            <motion.div key={f.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }} className="card p-6 card-hover text-center">
              <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 text-white"><f.icon className="h-7 w-7" /></div>
              <h3 className="font-display font-bold text-neutral-900">{f.name}</h3>
              <p className="mt-2 text-sm text-neutral-500">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
