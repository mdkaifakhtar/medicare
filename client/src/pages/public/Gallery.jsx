import { motion } from 'framer-motion';
import PageHero from '../../components/public/PageHero.jsx';

const images = [
  'https://images.pexels.com/photos/263402/pexels-photo-263402.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/247786/pexels-photo-247786.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/4173251/pexels-photo-4173251.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/40568/paris-eiffel-tower-france-landmark-40568.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/5407206/pexels-photo-5407206.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/6234600/pexels-photo-6234600.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/5214958/pexels-photo-5214958.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/4225920/pexels-photo-4225920.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/4226140/pexels-photo-4226140.jpeg?auto=compress&cs=tinysrgb&w=600',
];

export default function Gallery() {
  return (
    <div>
      <PageHero title="Gallery" subtitle="A glimpse into life at MedCare — our facilities, our people, and the moments of care." />
      <section className="section py-16">
        <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4">
          {images.map((src, i) => (
            <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="overflow-hidden rounded-2xl">
              <img src={src} alt={`Gallery ${i + 1}`} className="w-full object-cover transition-transform duration-500 hover:scale-105" />
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
