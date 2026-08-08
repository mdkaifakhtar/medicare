import { motion } from 'framer-motion';
import { Phone, Ambulance, Siren, Clock, HeartPulse, AlertTriangle } from 'lucide-react';
import PageHero from '../../components/public/PageHero.jsx';

export default function Emergency() {
  return (
    <div>
      <PageHero title="Emergency & Trauma" subtitle="24/7 emergency care with rapid response. When seconds count, we're ready." />
      <section className="section py-16">
        <motion.div initial={{ opacity: 0, scale: 0.97 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-error-600 to-error-800 p-10 text-white shadow-xl">
          <div className="absolute inset-0 bg-grid-dark opacity-20" />
          <div className="relative flex flex-col items-center text-center">
            <Siren className="h-12 w-12 animate-pulse" />
            <p className="mt-4 text-sm uppercase tracking-widest text-error-100">24/7 Emergency Helpline</p>
            <a href="tel:1066" className="mt-2 font-display text-6xl font-extrabold tracking-tight">1066</a>
            <p className="mt-3 max-w-md text-error-100">Call our emergency number for ambulance dispatch, trauma care, and critical care support.</p>
          </div>
        </motion.div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            { icon: Clock, title: 'Golden Hour Care', desc: 'Our trauma team is trained to stabilize patients within the critical first hour.' },
            { icon: Ambulance, title: 'Ambulance Network', desc: '20+ ALS/BLS ambulances stationed across the city for rapid pickup.' },
            { icon: HeartPulse, title: 'Code Blue Team', desc: 'Dedicated cardiac arrest response team available round the clock.' },
          ].map((f, i) => (
            <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="card p-6">
              <div className="mb-4 grid h-12 w-12 place-items-center rounded-xl bg-error-100 text-error-600"><f.icon className="h-6 w-6" /></div>
              <h3 className="font-display text-lg font-bold text-neutral-900">{f.title}</h3>
              <p className="mt-2 text-sm text-neutral-500">{f.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 card border-error-200 p-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-6 w-6 text-error-500 shrink-0" />
            <div>
              <h3 className="font-semibold text-neutral-900">When to call 1066</h3>
              <p className="mt-1 text-sm text-neutral-500">Chest pain, difficulty breathing, sudden weakness, severe bleeding, loss of consciousness, stroke symptoms (FAST), major injuries, or any life-threatening condition.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
