import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Star, Clock, Award, Languages, Calendar, Phone, MapPin, User, ArrowRight } from 'lucide-react';
import PageHero from '../../components/public/PageHero.jsx';
import { Card, Badge, Button } from '../../components/ui/index.jsx';
import { mockApi } from '../../services/mockApi.js';
import { useBookingLink } from '../../hooks/useAuth.js';

export default function DepartmentDetail() {
  const { id } = useParams();
  const bookLink = useBookingLink();
  const [dept, setDept] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    mockApi.getDepartment(id).then((d) => { setDept(d); setLoading(false); }).catch(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="section py-20"><div className="skeleton h-96" /></div>;
  if (!dept) return <div className="section py-20 text-center text-neutral-400">Department not found</div>;

  return (
    <div>
      <section className="relative overflow-hidden bg-grid">
        <div className="absolute inset-0 -z-10">
          <div className="absolute -left-20 top-0 h-72 w-72 rounded-full bg-primary-400/20 blur-3xl" />
          <div className="absolute right-0 top-10 h-72 w-72 rounded-full bg-secondary-400/20 blur-3xl" />
        </div>
        <div className="section py-10">
          <Link to="/departments" className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-primary-600 transition-colors mb-6">
            <ArrowLeft className="h-4 w-4" /> All Departments
          </Link>
          <div className="grid items-start gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="font-display text-4xl font-bold tracking-tight text-neutral-900 sm:text-5xl">
                {dept.name}
              </motion.h1>
              <p className="mt-4 max-w-2xl text-lg text-neutral-600">{dept.description}</p>
              <div className="mt-6 flex flex-wrap gap-4 text-sm text-neutral-500">
                <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4 text-primary-500" /> Floor {dept.floor}</span>
                <span className="flex items-center gap-1.5"><Phone className="h-4 w-4 text-primary-500" /> Ext {dept.phone}</span>
                <span className="flex items-center gap-1.5"><Award className="h-4 w-4 text-primary-500" /> Since {dept.established}</span>
                {dept.emergency && <Badge variant="error">24/7 Emergency</Badge>}
              </div>
            </div>
            <Card className="p-5">
              <p className="text-xs uppercase tracking-wide text-neutral-400">Department Head</p>
              <div className="mt-3 flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 text-white font-semibold">{dept.head?.split(' ').slice(-2).map((s) => s[0]).join('')}</div>
                <div><p className="font-display font-bold text-neutral-900">{dept.head}</p><p className="text-sm text-primary-600">Head of {dept.name}</p></div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-neutral-50 p-3 text-center"><p className="font-display text-2xl font-bold text-primary-600">{dept.totalDoctors || dept.doctors?.length || 0}</p><p className="text-xs text-neutral-500">Doctors</p></div>
                <div className="rounded-xl bg-neutral-50 p-3 text-center"><p className="font-display text-2xl font-bold text-secondary-600">{dept.totalPatients || 0}+</p><p className="text-xs text-neutral-500">Patients</p></div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      <section className="section py-12">
        <h2 className="font-display text-2xl font-bold text-neutral-900 mb-6">Our Specialists</h2>
        {dept.doctors?.length === 0 ? (
          <Card className="p-10 text-center text-neutral-400">No doctors currently assigned to this department.</Card>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {(dept.doctors || []).map((doc, i) => (
              <motion.div key={doc.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                <Card className="overflow-hidden card-hover">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img src={doc.image} alt={doc.name} className="h-full w-full object-cover transition-transform duration-500 hover:scale-105" />
                    <div className="absolute right-3 top-3"><Badge variant={doc.status === 'available' ? 'success' : 'warning'}>{doc.status === 'available' ? 'Available' : doc.status === 'pending' ? 'Pending' : 'On Leave'}</Badge></div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-display text-lg font-bold text-neutral-900">{doc.name}</h3>
                    <p className="text-sm text-primary-600">{doc.specialization}</p>
                    <p className="mt-1 text-xs text-neutral-500">{doc.qualification}</p>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="flex items-center gap-1 text-sm font-medium"><Star className="h-4 w-4 fill-accent-500 text-accent-500" /> {doc.rating} <span className="text-neutral-400">({doc.reviews})</span></span>
                      <span className="text-sm font-semibold text-neutral-900">₹{doc.consultationFee}</span>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      <Badge variant="neutral">{doc.experience} yrs</Badge>
                      {doc.languages?.slice(0, 2).map((l) => <Badge key={l} variant="info">{l}</Badge>)}
                    </div>
                    <div className="mt-3 flex items-center gap-2 text-xs text-neutral-500">
                      <Clock className="h-3.5 w-3.5" /> {doc.availability?.join(', ')}
                    </div>
                    <div className="mt-4 flex gap-2">
                      <Link to={`/doctors/${doc.id}`} className="btn-outline flex-1 justify-center text-sm">View Profile</Link>
                      {doc.status === 'available' && <Link to={bookLink.to} state={bookLink.state} className="btn-primary flex-1 justify-center text-sm"><Calendar className="h-4 w-4" /> Book</Link>}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
