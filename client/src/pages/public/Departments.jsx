import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Heart, Brain, Bone, Baby, Flower2, Sparkles, Eye, Siren, ArrowRight } from 'lucide-react';
import PageHero from '../../components/public/PageHero.jsx';
import { mockApi } from '../../services/mockApi.js';
import { useEffect, useState } from 'react';

const iconMap = { Heart, Brain, Bone, Baby, Flower2, Sparkles, Eye, Siren };

export default function Departments() {
  const [departments, setDepartments] = useState([]);
  useEffect(() => { mockApi.listDepartments({ limit: 50 }).then((r) => setDepartments(r.items)); }, []);

  return (
    <div>
      <PageHero title="Our Departments" subtitle="40+ super-specialty departments delivering expert care with the latest medical technology." />
      <section className="section py-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {departments.map((d, i) => {
            const Icon = iconMap[d.icon] || Heart;
            return (
              <motion.div key={d.id} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}>
                <Link to={`/departments/${d.id}`}>
                  <div className="card group p-6 card-hover cursor-pointer h-full">
                    <div className="flex items-start justify-between">
                      <div className={`mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-${d.color}-500 to-${d.color}-600 text-white shadow-sm transition-transform group-hover:scale-110`}>
                        <Icon className="h-7 w-7" />
                      </div>
                      {d.emergency && <span className="badge-error">24/7</span>}
                    </div>
                    <div className="flex items-center justify-between">
                      <h3 className="font-display text-lg font-bold text-neutral-900">{d.name}</h3>
                      <span className="badge-neutral">{d.floor}</span>
                    </div>
                    <p className="mt-2 text-sm text-neutral-500 line-clamp-2">{d.description}</p>
                    <div className="mt-4 flex items-center justify-between border-t border-neutral-100 pt-3">
                      <span className="text-xs text-neutral-500">{d.totalDoctors || 0} doctors · {d.totalPatients || 0}+ patients</span>
                      <span className="flex items-center text-sm font-medium text-primary-600 group-hover:gap-2 gap-1 transition-all">Explore <ArrowRight className="h-4 w-4" /></span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
