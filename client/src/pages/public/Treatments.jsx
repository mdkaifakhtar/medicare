import { motion } from 'framer-motion';
import { Heart, Brain, Bone, Baby, Eye, Activity, Scissors, Syringe } from 'lucide-react';
import PageHero from '../../components/public/PageHero.jsx';

const treatments = [
  { icon: Heart, name: 'Angioplasty & Stenting', desc: 'Minimally invasive procedures to open blocked arteries and restore blood flow.', dept: 'Cardiology' },
  { icon: Brain, name: 'Stroke Thrombolysis', desc: 'Time-critical clot-busting therapy for acute ischemic stroke patients.', dept: 'Neurology' },
  { icon: Bone, name: 'Total Knee Replacement', desc: 'Advanced joint replacement surgery using robotic-assisted precision.', dept: 'Orthopedics' },
  { icon: Baby, name: 'Neonatal Intensive Care', desc: 'Level-III NICU for premature and critically ill newborns.', dept: 'Pediatrics' },
  { icon: Eye, name: 'LASIK & Cataract Surgery', desc: 'Bladeless laser vision correction and advanced cataract removal.', dept: 'Ophthalmology' },
  { icon: Scissors, name: 'Bariatric Surgery', desc: 'Weight-loss surgery for obesity and related metabolic conditions.', dept: 'Surgery' },
  { icon: Syringe, name: 'Dialysis', desc: 'State-of-the-art hemodialysis and peritoneal dialysis units.', dept: 'Nephrology' },
  { icon: Activity, name: 'Cardiac Bypass Surgery', desc: 'Coronary artery bypass grafting with beating-heart techniques.', dept: 'Cardiothoracic' },
];

export default function Treatments() {
  return (
    <div>
      <PageHero title="Treatments & Procedures" subtitle="From routine procedures to complex surgeries — advanced treatments delivered with precision and care." />
      <section className="section py-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {treatments.map((t, i) => (
            <motion.div key={t.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }} className="card p-6 card-hover">
              <div className="mb-4 grid h-12 w-12 place-items-center rounded-xl bg-primary-100 text-primary-600"><t.icon className="h-6 w-6" /></div>
              <span className="badge-info mb-2">{t.dept}</span>
              <h3 className="font-display text-lg font-bold text-neutral-900">{t.name}</h3>
              <p className="mt-2 text-sm text-neutral-500">{t.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
