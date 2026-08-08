import { motion } from 'framer-motion';

export default function PageHero({ title, subtitle, image }) {
  return (
    <section className="page-hero relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-20 top-0 h-72 w-72 rounded-full bg-primary-300/20 blur-[100px]" />
        <div className="absolute right-0 top-10 h-72 w-72 rounded-full bg-secondary-300/15 blur-[100px]" />
        <div className="absolute bottom-0 left-1/3 h-48 w-48 rounded-full bg-accent-300/10 blur-[80px]" />
      </div>
      <div className="section pb-16 pt-14 text-center sm:pb-20 sm:pt-20">
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} className="font-display text-4xl font-extrabold tracking-tight text-neutral-900 sm:text-5xl text-balance">
          {title}
        </motion.h1>
        {subtitle && <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }} className="mx-auto mt-4 max-w-2xl text-lg text-neutral-600 text-balance">{subtitle}</motion.p>}
      </div>
    </section>
  );
}
