import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import PageHero from '../../components/public/PageHero.jsx';

const testimonials = [
  { name: 'Rahul Sharma', role: 'Cardiology Patient', rating: 5, text: 'The care I received after my angioplasty was exceptional. The doctors explained everything clearly and the nursing staff was incredibly attentive.' },
  { name: 'Fatima Sheikh', role: 'Maternity Patient', rating: 5, text: 'From prenatal care to delivery, Dr. Deepa and her team made me feel safe and supported throughout. The maternity ward is world-class.' },
  { name: 'Joseph Mathew', role: 'Orthopedic Patient', rating: 5, text: 'My knee replacement surgery went flawlessly. I was walking within a day. MedCare truly has the best orthopedic team in the city.' },
  { name: 'Kavya Reddy', role: 'Pediatrics Parent', rating: 5, text: 'My son was in the NICU for two weeks. The level of care and the regular updates from the doctors gave us immense peace of mind.' },
  { name: 'Mohammed Ali', role: 'Neurology Patient', rating: 5, text: 'The stroke unit saved my life. The rapid response and rehabilitation program helped me recover faster than I imagined possible.' },
  { name: 'Anita Verma', role: 'Dermatology Patient', rating: 4, text: 'Dr. Aisha is wonderful — she treated my chronic skin condition with a holistic approach. The clinic is clean and modern.' },
];

export default function Testimonials() {
  return (
    <div>
      <PageHero title="Patient Stories" subtitle="Real experiences from the people who matter most — our patients and their families." />
      <section className="section py-16">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.div key={t.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="card p-6 card-hover">
              <Quote className="h-8 w-8 text-primary-200" />
              <p className="mt-3 text-sm leading-relaxed text-neutral-600">{t.text}</p>
              <div className="mt-4 flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, s) => <Star key={s} className={`h-4 w-4 ${s < t.rating ? 'fill-accent-500 text-accent-500' : 'text-neutral-300'}`} />)}
              </div>
              <div className="mt-4 flex items-center gap-3 border-t border-neutral-100 pt-4">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-primary-100 text-primary-700 font-semibold">{t.name[0]}</div>
                <div><p className="font-semibold text-neutral-900">{t.name}</p><p className="text-xs text-neutral-500">{t.role}</p></div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
