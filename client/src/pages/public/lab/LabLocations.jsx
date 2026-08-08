import { motion } from 'framer-motion';
import {
  MapPin, Clock, Phone, Navigation, Building2, Car, CheckCircle2,
  FlaskConical, Search,
} from 'lucide-react';
import PageHero from '../../../components/public/PageHero.jsx';
import { Badge } from '../../../components/ui/index.jsx';

const locations = [
  {
    name: 'MedCare Diagnostic Center — Central',
    address: '214 Wellness Avenue, MG Road, Bengaluru 560001',
    phone: '+91 80 4000 8001',
    hours: 'Mon-Sat: 6:00 AM - 10:00 PM · Sun: 7:00 AM - 2:00 PM',
    distance: '0.5 km',
    services: ['All lab tests', 'Home sample collection', 'ECG', 'X-Ray', 'Ultrasound'],
    isMain: true,
  },
  {
    name: 'MedCare Diagnostic Center — Whitefield',
    address: '78 Tech Park Road, Whitefield, Bengaluru 560066',
    phone: '+91 80 4000 8002',
    hours: 'Mon-Sat: 6:30 AM - 9:00 PM · Sun: 8:00 AM - 12:00 PM',
    distance: '12 km',
    services: ['All lab tests', 'Home sample collection', 'X-Ray'],
    isMain: false,
  },
  {
    name: 'MedCare Diagnostic Center — Indiranagar',
    address: '42 100 Feet Road, Indiranagar, Bengaluru 560038',
    phone: '+91 80 4000 8003',
    hours: 'Mon-Sat: 6:00 AM - 10:00 PM · Sun: 7:00 AM - 2:00 PM',
    distance: '6 km',
    services: ['All lab tests', 'Home sample collection', 'ECG', 'Ultrasound'],
    isMain: false,
  },
  {
    name: 'MedCare Diagnostic Center — Jayanagar',
    address: '11 South End Circle, Jayanagar, Bengaluru 560041',
    phone: '+91 80 4000 8004',
    hours: 'Mon-Sat: 6:30 AM - 9:00 PM · Sun: 8:00 AM - 12:00 PM',
    distance: '8 km',
    services: ['All lab tests', 'Home sample collection', 'CT Scan', 'MRI'],
    isMain: false,
  },
];

export default function LabLocations() {
  return (
    <div>
      <PageHero
        title="Find Laboratory Locations"
        subtitle="Visit any of our NABL-accredited diagnostic centers across the city. All centers offer home sample collection."

      />

      <section className="section py-10">
        <div className="grid gap-6 lg:grid-cols-2">
          {locations.map((loc, i) => (
            <motion.div key={loc.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }} whileHover={{ y: -4 }} className="card p-6 card-hover h-full">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`grid h-12 w-12 place-items-center rounded-2xl ${loc.isMain ? 'bg-primary-600 text-white' : 'bg-primary-100 text-primary-600'}`}>
                    <Building2 className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-display text-base font-bold text-neutral-900">{loc.name}</h3>
                    {loc.isMain && <Badge variant="info" className="mt-1">Main Center</Badge>}
                  </div>
                </div>
                <span className="flex items-center gap-1 text-xs text-neutral-400"><Navigation className="h-3.5 w-3.5" /> {loc.distance}</span>
              </div>

              <div className="space-y-2.5 text-sm">
                <p className="flex items-start gap-2 text-neutral-600"><MapPin className="h-4 w-4 text-neutral-400 shrink-0 mt-0.5" /> {loc.address}</p>
                <p className="flex items-center gap-2 text-neutral-600"><Phone className="h-4 w-4 text-neutral-400 shrink-0" /> {loc.phone}</p>
                <p className="flex items-start gap-2 text-neutral-600"><Clock className="h-4 w-4 text-neutral-400 shrink-0 mt-0.5" /> {loc.hours}</p>
              </div>

              <div className="mt-4 pt-4 border-t border-neutral-100">
                <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">Available Services</p>
                <div className="flex flex-wrap gap-1.5">
                  {loc.services.map((s) => (
                    <span key={s} className="flex items-center gap-1 rounded-lg bg-neutral-100 px-2 py-1 text-xs text-neutral-600">
                      <CheckCircle2 className="h-3 w-3 text-success-500" /> {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-5 flex gap-2">
                <a href="tel:1066" className="btn-outline text-sm flex-1 justify-center"><Phone className="h-4 w-4" /> Call</a>
                <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" className="btn-primary text-sm flex-1 justify-center"><Navigation className="h-4 w-4" /> Directions</a>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Info */}
      <section className="section pb-16">
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { icon: FlaskConical, title: 'NABL Accredited', desc: 'All centers meet national quality standards' },
            { icon: Car, title: 'Free Parking', desc: 'Ample parking available at all locations' },
            { icon: Clock, title: 'Early Morning', desc: 'Sample collection from 6:00 AM for fasting tests' },
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
