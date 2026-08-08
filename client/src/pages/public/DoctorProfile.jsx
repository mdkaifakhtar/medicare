import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Star, Clock, Award, Calendar, Phone, GraduationCap, Languages, Stethoscope, CheckCircle, Heart } from 'lucide-react';
import { Card, Badge, Button } from '../../components/ui/index.jsx';
import { mockApi } from '../../services/mockApi.js';
import { useBookingLink } from '../../hooks/useAuth.js';

export default function DoctorProfile() {
  const { id } = useParams();
  const bookLink = useBookingLink();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState(null);

  useEffect(() => {
    mockApi.getDoctor(id).then((d) => { setDoctor(d); setLoading(false); }).catch(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="section py-20"><div className="skeleton h-96" /></div>;
  if (!doctor) return <div className="section py-20 text-center text-neutral-400">Doctor not found</div>;

  const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  const availableDays = doctor.availability || [];

  return (
    <div>
      <section className="relative overflow-hidden bg-grid">
        <div className="absolute inset-0 -z-10">
          <div className="absolute -left-20 top-0 h-72 w-72 rounded-full bg-primary-400/20 blur-3xl" />
          <div className="absolute right-0 top-10 h-72 w-72 rounded-full bg-secondary-400/20 blur-3xl" />
        </div>
        <div className="section py-10">
          <Link to="/doctors" className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-primary-600 transition-colors mb-6">
            <ArrowLeft className="h-4 w-4" /> All Doctors
          </Link>
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-1">
              <Card className="overflow-hidden">
                <div className="aspect-square overflow-hidden">
                  <img src={doctor.image} alt={doctor.name} className="h-full w-full object-cover" />
                </div>
                <div className="p-5 text-center">
                  <h1 className="font-display text-2xl font-bold text-neutral-900">{doctor.name}</h1>
                  <p className="text-sm text-primary-600">{doctor.specialization}</p>
                  <div className="mt-2 flex items-center justify-center gap-1">
                    <Star className="h-4 w-4 fill-accent-500 text-accent-500" />
                    <span className="font-medium text-neutral-900">{doctor.rating}</span>
                    <span className="text-sm text-neutral-400">({doctor.reviews} reviews)</span>
                  </div>
                  <Badge variant={doctor.status === 'available' ? 'success' : 'warning'} className="mt-3">{doctor.status === 'available' ? 'Available' : doctor.status === 'pending' ? 'Pending Approval' : 'On Leave'}</Badge>
                  {doctor.status === 'available' && (
                    <Link to={bookLink.to} state={bookLink.state} className="btn-primary mt-4 w-full justify-center"><Calendar className="h-4 w-4" /> Book Appointment</Link>
                  )}
                </div>
              </Card>
            </div>

            <div className="lg:col-span-2 space-y-6">
              <Card className="p-6">
                <h2 className="font-display text-xl font-bold text-neutral-900">About</h2>
                <p className="mt-3 text-neutral-600">{doctor.about}</p>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {[
                    { icon: GraduationCap, label: 'Qualification', value: doctor.qualification },
                    { icon: Award, label: 'Experience', value: `${doctor.experience} years` },
                    { icon: Stethoscope, label: 'Department', value: doctor.department?.name || '—' },
                    { icon: Phone, label: 'Consultation Fee', value: `₹${doctor.consultationFee}` },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-3 rounded-xl border border-neutral-100 p-3">
                      <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary-100 text-primary-600"><item.icon className="h-5 w-5" /></div>
                      <div><p className="text-xs text-neutral-500">{item.label}</p><p className="text-sm font-medium text-neutral-900">{item.value}</p></div>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <p className="text-xs text-neutral-500 mb-2">Languages Spoken</p>
                  <div className="flex flex-wrap gap-2">
                    {doctor.languages?.map((l) => <Badge key={l} variant="info"><Languages className="h-3 w-3" /> {l}</Badge>)}
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h2 className="font-display text-xl font-bold text-neutral-900">Availability & Time Slots</h2>
                <div className="mt-4 flex flex-wrap gap-2">
                  {days.map((d) => (
                    <button key={d} onClick={() => availableDays.includes(d) && setSelectedDay(d)} disabled={!availableDays.includes(d)}
                      className={`rounded-xl px-4 py-2 text-sm font-medium transition ${selectedDay === d ? 'bg-primary-600 text-white' : availableDays.includes(d) ? 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200' : 'bg-neutral-50 text-neutral-300 cursor-not-allowed'}`}>
                      {d}
                    </button>
                  ))}
                </div>
                {selectedDay && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4">
                    <p className="text-sm text-neutral-500 mb-3">Available slots for {selectedDay}:</p>
                    <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
                      {doctor.timeSlots?.map((slot) => (
                        <button key={slot} className="rounded-xl border border-neutral-200 px-3 py-2 text-sm font-medium text-neutral-700 hover:border-primary-500 hover:bg-primary-50 transition">
                          {slot}
                        </button>
                      ))}
                    </div>
                    {doctor.status === 'available' && <Link to={bookLink.to} state={bookLink.state} className="btn-primary mt-4 justify-center w-full"><Calendar className="h-4 w-4" /> Book Appointment for {selectedDay}</Link>}
                  </motion.div>
                )}
              </Card>

              <Card className="p-6">
                <h2 className="font-display text-xl font-bold text-neutral-900">Reviews</h2>
                <div className="mt-4 space-y-3">
                  {[
                    { name: 'Rahul S.', rating: 5, text: 'Excellent doctor. Explained everything clearly and made me feel comfortable.' },
                    { name: 'Priya M.', rating: 5, text: 'Very thorough and caring. Highly recommend Dr. ' + doctor.name.split(' ').slice(-1)[0] + '.' },
                    { name: 'Amit K.', rating: 4, text: 'Good experience overall. Slightly long wait but worth it.' },
                  ].map((r, i) => (
                    <div key={i} className="rounded-xl border border-neutral-100 p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2"><div className="grid h-8 w-8 place-items-center rounded-full bg-primary-100 text-primary-600 text-xs font-semibold">{r.name[0]}</div><span className="text-sm font-medium text-neutral-900">{r.name}</span></div>
                        <div className="flex">{Array.from({ length: 5 }).map((_, s) => <Star key={s} className={`h-3.5 w-3.5 ${s < r.rating ? 'fill-accent-500 text-accent-500' : 'text-neutral-300'}`} />)}</div>
                      </div>
                      <p className="mt-2 text-sm text-neutral-500">{r.text}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
