import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Youtube, ArrowRight } from 'lucide-react';
import Logo from '../ui/Logo.jsx';
import { useBookingLink } from '../../hooks/useAuth.js';

const cols = [
  { title: 'Hospital', links: [['About Us','/about'],['Departments','/departments'],['Doctors','/doctors'],['Facilities','/facilities'],['Emergency','/emergency']] },
  { title: 'Patients', links: [['Book Appointment','/register'],['Treatments','/treatments'],['Insurance','/contact'],['Medical Records','/login'],['FAQ','/faq']] },
  { title: 'Resources', links: [['Blogs','/blogs'],['Gallery','/gallery'],['Testimonials','/testimonials'],['Careers','/careers'],['Contact','/contact']] },
  { title: 'Legal', links: [['Privacy Policy','/privacy'],['Terms of Service','/terms'],['Accessibility','/contact'],['Grievance','/contact'],['Cookies','/privacy']] },
];

const socials = [
  { Icon: Facebook, label: 'Facebook' },
  { Icon: Twitter, label: 'Twitter' },
  { Icon: Instagram, label: 'Instagram' },
  { Icon: Linkedin, label: 'LinkedIn' },
  { Icon: Youtube, label: 'YouTube' },
];

export default function PublicFooter() {
  const bookLink = useBookingLink();
  return (
    <footer className="relative mt-20 overflow-hidden bg-neutral-50 border-t border-neutral-200">
      {/* Decorative gradient orbs */}
      <div className="pointer-events-none absolute -top-20 left-1/4 h-40 w-40 rounded-full bg-primary-300/20 blur-3xl" />
      <div className="pointer-events-none absolute -top-10 right-1/4 h-32 w-32 rounded-full bg-accent-300/15 blur-3xl" />

      {/* CTA banner */}
      <div className="section relative -mt-12 mb-16">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-primary-500 to-primary-600 p-8 shadow-glow-lg sm:p-12">
          <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-10 left-10 h-32 w-32 rounded-full bg-accent-400/20 blur-2xl" />
          <div className="relative flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
            <div>
              <h3 className="font-display text-2xl font-bold text-white sm:text-3xl">Ready to experience better healthcare?</h3>
              <p className="mt-2 max-w-lg text-primary-50/90">Book your appointment today or call our 24/7 helpline. Our team is ready to help you.</p>
            </div>
            <div className="flex shrink-0 gap-3">
              <Link to={bookLink.to} state={bookLink.state} className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-primary-700 shadow-lg transition hover:scale-105 active:scale-95">
                Book Appointment <ArrowRight className="h-4 w-4" />
              </Link>
              <a href="tel:1066" className="inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
                Emergency: 1066
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="section relative pb-10">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Logo />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-neutral-500">
              MedCare Multispecialty Hospital — delivering compassionate, world-class healthcare since 1998. NABH accredited, NABL certified.
            </p>
            <div className="mt-5 space-y-2.5 text-sm text-neutral-600">
              <p className="flex items-center gap-2.5"><MapPin className="h-4 w-4 text-primary-500 shrink-0" /> 214 Wellness Avenue, Bengaluru 560001</p>
              <p className="flex items-center gap-2.5"><Phone className="h-4 w-4 text-primary-500 shrink-0" /> +91 80 4000 8000 · Emergency 1066</p>
              <p className="flex items-center gap-2.5"><Mail className="h-4 w-4 text-primary-500 shrink-0" /> care@medcare.health</p>
            </div>
            <div className="mt-6 flex gap-2">
              {socials.map(({ Icon, label }, i) => (
                <motion.a key={label} href="#" whileHover={{ y: -3 }} aria-label={label} className="grid h-10 w-10 place-items-center rounded-2xl border border-neutral-200 text-neutral-500 hover:text-primary-600 hover:border-primary-300 hover:bg-primary-50 transition-all">
                  <Icon className="h-4 w-4" />
                </motion.a>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:col-span-8">
            {cols.map((col) => (
              <div key={col.title}>
                <h4 className="mb-4 text-sm font-semibold text-neutral-900">{col.title}</h4>
                <ul className="space-y-2.5">
                  {col.links.map(([label, to]) => (
                    <li key={label}>
                      <Link to={label === 'Book Appointment' ? bookLink.to : to} state={label === 'Book Appointment' ? bookLink.state : undefined} className="text-sm text-neutral-500 hover:text-primary-600 transition-colors">
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-neutral-200">
        <div className="section flex flex-col items-center justify-between gap-3 py-5 sm:flex-row">
          <p className="flex items-center gap-1.5 text-xs text-neutral-500">
            © {new Date().getFullYear()} MedCare Hospital. Made with <Heart className="h-3.5 w-3.5 fill-error-500 text-error-500" /> for better healthcare.
          </p>
          <p className="text-xs text-neutral-400">NABH Accredited · ISO 9001:2015 · NABL Certified</p>
        </div>
      </div>
    </footer>
  );
}
