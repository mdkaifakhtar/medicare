import { motion } from 'framer-motion';
import { Briefcase, MapPin, Clock, ArrowRight } from 'lucide-react';
import PageHero from '../../components/public/PageHero.jsx';
import { Badge } from '../../components/ui/index.jsx';

const jobs = [
  { title: 'Senior Cardiologist', dept: 'Cardiology', type: 'Full-time', location: 'Bengaluru', exp: '10+ years' },
  { title: 'ICU Staff Nurse', dept: 'Critical Care', type: 'Full-time', location: 'Bengaluru', exp: '3+ years' },
  { title: 'Radiology Technician', dept: 'Radiology', type: 'Full-time', location: 'Bengaluru', exp: '2+ years' },
  { title: 'Medical Officer (Emergency)', dept: 'Emergency', type: 'Rotational', location: 'Bengaluru', exp: '5+ years' },
  { title: 'Pharmacist', dept: 'Pharmacy', type: 'Full-time', location: 'Bengaluru', exp: '3+ years' },
  { title: 'Hospital Administrator', dept: 'Operations', type: 'Full-time', location: 'Bengaluru', exp: '8+ years' },
];

export default function Careers() {
  return (
    <div>
      <PageHero title="Careers at MedCare" subtitle="Join a team that's redefining healthcare. Grow your career while making a real difference." />
      <section className="section py-16">
        <div className="grid gap-6 md:grid-cols-2">
          {jobs.map((j, i) => (
            <motion.div key={j.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }} className="card p-6 card-hover">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-display text-lg font-bold text-neutral-900">{j.title}</h3>
                  <p className="text-sm text-primary-600">{j.dept}</p>
                </div>
                <Badge variant="success">{j.type}</Badge>
              </div>
              <div className="mt-4 flex flex-wrap gap-4 text-sm text-neutral-500">
                <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" /> {j.location}</span>
                <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> {j.exp}</span>
              </div>
              <button className="btn-outline mt-5 w-full sm:w-auto">Apply Now <ArrowRight className="h-4 w-4" /></button>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
