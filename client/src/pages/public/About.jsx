import { motion } from 'framer-motion';
import { Award, Heart, Users, Building2, Target, Eye, HandHeart } from 'lucide-react';
import PageHero from '../../components/public/PageHero.jsx';

export default function About() {
  return (
    <div>
      <PageHero title="About MedCare" subtitle="A legacy of compassionate care, clinical excellence, and continuous innovation since 1998." />
      <section className="section py-16">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="overflow-hidden rounded-[2rem] shadow-xl">
            <img src="https://images.pexels.com/photos/247786/pexels-photo-247786.jpeg?auto=compress&cs=tinysrgb&w=800" alt="Hospital" className="h-full w-full object-cover" />
          </div>
          <div>
            <h2 className="font-display text-3xl font-bold text-neutral-900">Our Story</h2>
            <p className="mt-4 text-neutral-600">Founded in 1998 by Dr. Ramesh Mehta with a vision to bring world-class healthcare to every family, MedCare has grown from a 50-bed clinic to a 650-bed multispecialty institution serving over 1.2 million patients.</p>
            <p className="mt-3 text-neutral-600">Today, we are a NABH-accredited, NABL-certified hospital with 180+ specialists, 40+ departments, and a 24/7 trauma center — yet our promise remains unchanged: to treat every patient like family.</p>
            <div className="mt-8 grid grid-cols-3 gap-4">
              {[['1998','Founded'],['650','Beds'],['1.2M+','Patients']].map(([v, l]) => (
                <div key={l} className="card p-4 text-center"><p className="font-display text-2xl font-bold text-primary-600">{v}</p><p className="text-xs text-neutral-500">{l}</p></div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-neutral-50 py-16">
        <div className="section">
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { icon: Target, title: 'Our Mission', desc: 'To deliver accessible, affordable, and compassionate healthcare of the highest standard to every patient who walks through our doors.' },
              { icon: Eye, title: 'Our Vision', desc: 'To be the most trusted healthcare institution in the region, recognized for clinical excellence, innovation, and ethical practice.' },
              { icon: HandHeart, title: 'Our Values', desc: 'Compassion, integrity, excellence, innovation, and respect for every individual guide everything we do.' },
            ].map((v, i) => (
              <motion.div key={v.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="card p-6">
                <div className="mb-4 grid h-12 w-12 place-items-center rounded-xl bg-primary-100 text-primary-600"><v.icon className="h-6 w-6" /></div>
                <h3 className="font-display text-lg font-bold text-neutral-900">{v.title}</h3>
                <p className="mt-2 text-sm text-neutral-500">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section py-16">
        <h2 className="font-display text-3xl font-bold text-center text-neutral-900">Leadership</h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { name: 'Dr. Ramesh Mehta', role: 'Founder & Chairman', img: 'https://images.pexels.com/photos/5214958/pexels-photo-5214958.jpeg?auto=compress&cs=tinysrgb&w=400' },
            { name: 'Dr. Ananya Rao', role: 'Director, Cardiology', img: 'https://images.pexels.com/photos/5407206/pexels-photo-5407206.jpeg?auto=compress&cs=tinysrgb&w=400' },
            { name: 'Dr. Vikram Singh', role: 'Director, Neurology', img: 'https://images.pexels.com/photos/6234600/pexels-photo-6234600.jpeg?auto=compress&cs=tinysrgb&w=400' },
            { name: 'Priya Nair', role: 'Chief Administrator', img: 'https://images.pexels.com/photos/5215028/pexels-photo-5215028.jpeg?auto=compress&cs=tinysrgb&w=400' },
          ].map((p) => (
            <div key={p.name} className="card overflow-hidden card-hover">
              <div className="aspect-square overflow-hidden"><img src={p.img} alt={p.name} className="h-full w-full object-cover" /></div>
              <div className="p-4 text-center"><h3 className="font-semibold text-neutral-900">{p.name}</h3><p className="text-sm text-primary-600">{p.role}</p></div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
