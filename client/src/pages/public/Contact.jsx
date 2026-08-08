import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import PageHero from '../../components/public/PageHero.jsx';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); setForm({ name: '', email: '', phone: '', subject: '', message: '' }); toast.success('Message sent! We will get back to you shortly.'); }, 800);
  };

  return (
    <div>
      <PageHero title="Contact Us" subtitle="We're here to help. Reach out with any questions, feedback, or appointment requests." />
      <section className="section py-16">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-2xl font-bold text-neutral-900">Get in touch</h2>
            <p className="mt-2 text-neutral-500">Our team typically responds within one business day.</p>
            <div className="mt-8 space-y-5">
              {[
                { icon: MapPin, label: 'Address', value: '214 Wellness Avenue, Medical District, Bengaluru 560001' },
                { icon: Phone, label: 'Phone', value: '+91 80 4000 8000 · Emergency 1066' },
                { icon: Mail, label: 'Email', value: 'care@medcare.health' },
                { icon: Clock, label: 'Hours', value: 'OPD: Mon-Sat 8AM-8PM · Emergency: 24/7' },
              ].map((c) => (
                <div key={c.label} className="flex gap-4">
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-primary-100 text-primary-600"><c.icon className="h-6 w-6" /></div>
                  <div><p className="text-sm font-medium text-neutral-500">{c.label}</p><p className="text-neutral-900">{c.value}</p></div>
                </div>
              ))}
            </div>
          </div>
          <motion.form initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} onSubmit={submit} className="card p-6 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div><label className="label">Name</label><input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input" /></div>
              <div><label className="label">Phone</label><input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input" /></div>
            </div>
            <div><label className="label">Email</label><input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input" /></div>
            <div><label className="label">Subject</label><input required value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="input" /></div>
            <div><label className="label">Message</label><textarea required rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="input" /></div>
            <button type="submit" disabled={loading} className="btn-primary w-full justify-center">{loading ? 'Sending...' : <>Send Message <Send className="h-4 w-4" /></>}</button>
          </motion.form>
        </div>
      </section>
    </div>
  );
}
