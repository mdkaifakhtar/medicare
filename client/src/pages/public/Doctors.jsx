import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Search, Stethoscope } from 'lucide-react';
import PageHero from '../../components/public/PageHero.jsx';
import { mockApi } from '../../services/mockApi.js';
import { Badge } from '../../components/ui/index.jsx';

export default function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [dept, setDept] = useState('');
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    mockApi.listDoctors({ limit: 50 }).then((r) => { setDoctors(r.items); setLoading(false); });
    mockApi.listDepartments({ limit: 50 }).then((r) => setDepartments(r.items));
  }, []);

  const filtered = doctors.filter((d) => {
    const ms = !search || d.name.toLowerCase().includes(search.toLowerCase()) || d.specialization.toLowerCase().includes(search.toLowerCase());
    const md = !dept || d.department === dept;
    return ms && md;
  });

  return (
    <div>
      <PageHero title="Meet Our Doctors" subtitle="180+ specialists trained at the world's leading medical institutions, ready to care for you." />
      <section className="section py-16">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search doctors or specializations..." className="input pl-9" />
          </div>
          <select value={dept} onChange={(e) => setDept(e.target.value)} className="input sm:max-w-xs">
            <option value="">All Departments</option>
            {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
        </div>

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="card h-80 skeleton" />)}</div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((d, i) => {
              const dep = departments.find((x) => x.id === d.department);
              return (
                <motion.div key={d.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="card overflow-hidden card-hover">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img src={d.image} alt={d.name} className="h-full w-full object-cover transition-transform duration-500 hover:scale-105" />
                    <div className="absolute right-3 top-3"><Badge variant={d.status === 'available' ? 'success' : 'warning'}>{d.status === 'available' ? 'Available' : 'On Leave'}</Badge></div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-display text-lg font-bold text-neutral-900">{d.name}</h3>
                    <p className="text-sm text-primary-600">{d.specialization}</p>
                    <p className="mt-1 text-xs text-neutral-500">{d.qualification}</p>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="flex items-center gap-1 text-sm font-medium text-neutral-700"><Star className="h-4 w-4 fill-accent-500 text-accent-500" /> {d.rating} <span className="text-neutral-400">({d.reviews})</span></span>
                      <span className="text-sm font-semibold text-neutral-900">₹{d.consultationFee}</span>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {dep && <Badge variant="info">{dep.name}</Badge>}
                      <Badge variant="neutral">{d.experience} yrs exp</Badge>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
        {!loading && filtered.length === 0 && (
          <div className="py-16 text-center text-neutral-400"><Stethoscope className="mx-auto mb-3 h-10 w-10" /><p>No doctors found matching your search.</p></div>
        )}
      </section>
    </div>
  );
}
