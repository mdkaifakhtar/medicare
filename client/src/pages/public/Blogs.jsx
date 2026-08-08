import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowRight, User } from 'lucide-react';
import PageHero from '../../components/public/PageHero.jsx';
import { Badge } from '../../components/ui/index.jsx';

const posts = [
  { id: 1, title: 'Understanding Heart Disease: Prevention & Early Signs', excerpt: 'Cardiovascular disease remains the leading cause of death globally. Learn the warning signs and how to protect your heart.', author: 'Dr. Ananya Rao', date: '2024-06-12', category: 'Cardiology', img: 'https://images.pexels.com/photos/4386466/pexels-photo-4386466.jpeg?auto=compress&cs=tinysrgb&w=600', readTime: '6 min' },
  { id: 2, title: 'Stroke Awareness: Every Second Counts', excerpt: 'Recognizing stroke symptoms early can save lives. The FAST method and what to do in an emergency.', author: 'Dr. Vikram Singh', date: '2024-05-28', category: 'Neurology', img: 'https://images.pexels.com/photos/4386468/pexels-photo-4386468.jpeg?auto=compress&cs=tinysrgb&w=600', readTime: '5 min' },
  { id: 3, title: 'Joint Health: Tips for Healthy Aging', excerpt: 'Simple lifestyle changes and exercises that can keep your joints healthy well into your senior years.', author: 'Dr. Sanjay Gupta', date: '2024-05-10', category: 'Orthopedics', img: 'https://images.pexels.com/photos/4386470/pexels-photo-4386470.jpeg?auto=compress&cs=tinysrgb&w=600', readTime: '4 min' },
  { id: 4, title: 'Childhood Vaccination: A Parent\'s Guide', excerpt: 'Everything parents need to know about the vaccination schedule and why it matters for community health.', author: 'Dr. Lakshmi Iyer', date: '2024-04-22', category: 'Pediatrics', img: 'https://images.pexels.com/photos/4386472/pexels-photo-4386472.jpeg?auto=compress&cs=tinysrgb&w=600', readTime: '7 min' },
  { id: 5, title: 'Skin Cancer Screening: What to Watch For', excerpt: 'The ABCDE rule for identifying suspicious moles and when to see a dermatologist.', author: 'Dr. Aisha Khan', date: '2024-04-05', category: 'Dermatology', img: 'https://images.pexels.com/photos/4386474/pexels-photo-4386474.jpeg?auto=compress&cs=tinysrgb&w=600', readTime: '5 min' },
  { id: 6, title: 'Diabetes Management: Beyond Medication', excerpt: 'Diet, exercise, and monitoring — the three pillars of effective diabetes management.', author: 'Dr. Ramesh Mehta', date: '2024-03-18', category: 'General', img: 'https://images.pexels.com/photos/4386476/pexels-photo-4386476.jpeg?auto=compress&cs=tinysrgb&w=600', readTime: '6 min' },
];

export default function Blogs() {
  const [cat, setCat] = useState('All');
  const cats = ['All', ...new Set(posts.map((p) => p.category))];
  const filtered = cat === 'All' ? posts : posts.filter((p) => p.category === cat);

  return (
    <div>
      <PageHero title="Health & Wellness Blog" subtitle="Expert insights, health tips, and the latest medical news from our team of specialists." />
      <section className="section py-16">
        <div className="mb-8 flex flex-wrap gap-2">
          {cats.map((c) => (
            <button key={c} onClick={() => setCat(c)} className={`rounded-full px-4 py-2 text-sm font-medium transition ${cat === c ? 'bg-primary-600 text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'}`}>{c}</button>
          ))}
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p, i) => (
            <motion.article key={p.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }} className="card overflow-hidden card-hover cursor-pointer">
              <div className="aspect-video overflow-hidden"><img src={p.img} alt={p.title} className="h-full w-full object-cover transition-transform duration-500 hover:scale-105" /></div>
              <div className="p-5">
                <Badge variant="info">{p.category}</Badge>
                <h3 className="mt-3 font-display text-lg font-bold leading-snug text-neutral-900">{p.title}</h3>
                <p className="mt-2 text-sm text-neutral-500">{p.excerpt}</p>
                <div className="mt-4 flex items-center justify-between border-t border-neutral-100 pt-4 text-xs text-neutral-500">
                  <span className="flex items-center gap-1.5"><User className="h-3.5 w-3.5" /> {p.author}</span>
                  <span className="flex items-center gap-3"><span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {new Date(p.date).toLocaleDateString('en', { month: 'short', day: 'numeric' })}</span><span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {p.readTime}</span></span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </section>
    </div>
  );
}
