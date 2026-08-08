import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import PageHero from '../../components/public/PageHero.jsx';

const faqs = [
  { q: 'How do I book an appointment?', a: 'You can book an appointment online by creating a patient account, or call our reception at +91 80 4000 8000. Same-day appointments are available for urgent cases.' },
  { q: 'What should I bring to my first appointment?', a: 'Please bring a government-issued photo ID, your insurance card if applicable, any previous medical records or test results, and a list of current medications.' },
  { q: 'Do you accept insurance?', a: 'Yes, we accept all major insurance providers including cashless hospitalization. Please verify your policy coverage with our insurance desk before admission.' },
  { q: 'What are your visiting hours?', a: 'General visiting hours are 11 AM to 1 PM and 4 PM to 7 PM. ICU visiting is restricted to 15 minutes, twice a day. Please check with the ward for specific timings.' },
  { q: 'How can I access my medical records?', a: 'Registered patients can access their medical records, prescriptions, and lab reports anytime through the patient dashboard portal.' },
  { q: 'Do you provide ambulance services?', a: 'Yes, we operate a fleet of 20+ ambulances including ALS and BLS vehicles. Call 1066 for emergency ambulance dispatch.' },
  { q: 'Can I get a second opinion?', a: 'Absolutely. We offer second opinion consultations across all specialties. Book a consultation and bring your existing reports for review.' },
  { q: 'How do I pay my bills?', a: 'Bills can be paid online through the patient dashboard, at our billing counter via card/UPI/cash, or through insurance cashless settlement.' },
];

export default function Faq() {
  const [open, setOpen] = useState(0);
  return (
    <div>
      <PageHero title="Frequently Asked Questions" subtitle="Answers to common questions about our services, appointments, and patient care." />
      <section className="section py-16">
        <div className="mx-auto max-w-3xl space-y-3">
          {faqs.map((f, i) => (
            <div key={i} className="card overflow-hidden">
              <button onClick={() => setOpen(open === i ? -1 : i)} className="flex w-full items-center justify-between gap-4 p-5 text-left">
                <span className="font-semibold text-neutral-900">{f.q}</span>
                <ChevronDown className={`h-5 w-5 shrink-0 text-neutral-400 transition-transform ${open === i ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {open === i && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                    <p className="px-5 pb-5 text-sm text-neutral-600">{f.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
