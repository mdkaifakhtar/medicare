import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;
  const pages = [];
  const start = Math.max(1, page - 2);
  const end = Math.min(totalPages, start + 4);
  for (let i = start; i <= end; i++) pages.push(i);
  return (
    <div className="flex items-center justify-center gap-1.5">
      <button disabled={page <= 1} onClick={() => onChange(page - 1)} className="grid h-8 w-8 place-items-center rounded-lg border border-neutral-200 text-neutral-600 disabled:opacity-40 hover:bg-neutral-50">
        <ChevronLeft className="h-4 w-4" />
      </button>
      {pages.map((p) => (
        <motion.button key={p} whileTap={{ scale: 0.9 }} onClick={() => onChange(p)} className={`h-8 min-w-8 rounded-lg px-2 text-sm font-medium transition ${p === page ? 'bg-primary-600 text-white shadow-sm' : 'border border-neutral-200 text-neutral-600 hover:bg-neutral-50'}`}>
          {p}
        </motion.button>
      ))}
      <button disabled={page >= totalPages} onClick={() => onChange(page + 1)} className="grid h-8 w-8 place-items-center rounded-lg border border-neutral-200 text-neutral-600 disabled:opacity-40 hover:bg-neutral-50">
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
