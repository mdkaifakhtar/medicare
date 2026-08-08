import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Phone, Mail, MapPin, Clock, Send, MessageSquare,
  FlaskConical, CheckCircle2,
} from 'lucide-react';
import PageHero from '../../../components/public/PageHero.jsx';
import { Button } from '../../../components/ui/index.jsx';
import toast from 'react-hot-toast';

export default function LabContact() {
  const [form, setForm] = useState({ name: '', phone: '', email: '', subject: '', message: '' });

  const handleSubmit = () => {
    if (!form.name || !form.phone || !form.message) {
      toast.error('Please fill all required fields');
      return;
    }
    toast.success('Message sent! Our lab team will get back to you within 24 hours.');
    setForm({ name: '', phone: '', email: '', subject: '', message: '' });
  };

  return (
    <div>
      <PageHero
        title="Contact Laboratory"
        subtitle="Have questions about a test, report, or booking? Our lab team is here to help."

      />

      <section className="section py-10">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Contact info */}
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="space-y-4">
            <h2 className="font-display text-xl font-bold text-neutral-900">Get in Touch</h2>
            <p className="text-sm text-neutral-500">Reach out to our laboratory team for any queries related to test booking, sample collection, reports, or packages.</p>

            <div className="space-y-3">
              {[
                { icon: Phone, label: 'Lab Helpline', value: '+91 80 4000 8001', sub: 'Mon-Sat: 6 AM - 10 PM' },
                { icon: Mail, label: 'Email', value: 'lab@medcare.health', sub: 'Response within 24 hours' },
                { icon: MapPin, label: 'Main Lab', value: '214 Wellness Avenue, MG Road', sub: 'Bengaluru 560001' },
                { icon: Clock, label: 'Working Hours', value: 'Mon-Sat: 6:00 AM - 10:00 PM', sub: 'Sun: 7:00 AM - 2:00 PM' },
              ].map((item) => (
                <div key={item.label} className="card p-4 flex items-center gap-3">
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary-100 text-primary-600"><item.icon className="h-5 w-5" /></div>
                  <div>
                    <p className="text-xs text-neutral-400">{item.label}</p>
                    <p className="text-sm font-semibold text-neutral-900">{item.value}</p>
                    <p className="text-xs text-neutral-500">{item.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="card p-5 bg-gradient-to-br from-primary-500/10 to-secondary-500/10 border-primary-200/50">
              <div className="flex items-center gap-2 mb-2">
                <FlaskConical className="h-5 w-5 text-primary-500" />
                <p className="text-sm font-semibold text-neutral-900">Home Sample Collection</p>
              </div>
              <p className="text-xs text-neutral-500">Book a home visit and our trained phlebotomist will collect samples at your doorstep. Free within city limits.</p>
              <a href="tel:1066" className="mt-3 btn-primary text-sm w-full justify-center"><Phone className="h-4 w-4" /> Book Home Collection</a>
            </div>
          </motion.div>

          {/* Contact form */}
          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <div className="card p-6">
              <h2 className="font-display text-xl font-bold text-neutral-900 mb-5">Send a Message</h2>
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div><label className="label">Full Name *</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input" placeholder="John Doe" /></div>
                  <div><label className="label">Phone *</label><input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input" placeholder="+91 98765 43210" /></div>
                </div>
                <div><label className="label">Email</label><input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input" placeholder="john@example.com" /></div>
                <div><label className="label">Subject</label><input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="input" placeholder="Regarding a test booking" /></div>
                <div><label className="label">Message *</label><textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="input" rows={5} placeholder="Type your message here..." /></div>
                <Button onClick={handleSubmit} className="w-full justify-center"><Send className="h-4 w-4" /> Send Message</Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
