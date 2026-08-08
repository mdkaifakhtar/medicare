import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export function Card({ children, className = '', hover = false, ...props }) {
  return (
    <div className={`card ${hover ? 'card-hover' : ''} ${className}`} {...props}>
      {children}
    </div>
  );
}

export function StatCard({ icon: Icon, label, value, change, color = 'primary', delay = 0 }) {
  const colors = {
    primary: 'from-primary-400/15 to-primary-500/5 text-primary-600',
    secondary: 'from-secondary-400/15 to-secondary-500/5 text-secondary-600',
    accent: 'from-accent-400/15 to-accent-500/5 text-accent-600',
    success: 'from-success-400/15 to-success-500/5 text-success-600',
    warning: 'from-warning-400/15 to-warning-500/5 text-warning-600',
    error: 'from-error-400/15 to-error-500/5 text-error-600',
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay, ease: [0.16, 1, 0.3, 1] }}
      className="card p-5 card-hover group"
    >
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <p className="text-[13px] font-medium text-neutral-500">{label}</p>
          <p className="mt-2 font-display text-2xl font-bold tracking-tight text-neutral-900">{value}</p>
          {change !== undefined && (
            <p className={`mt-1.5 inline-flex items-center gap-1 text-xs font-medium ${change >= 0 ? 'text-success-600' : 'text-error-600'}`}>
              <span className="inline-block">{change >= 0 ? '↑' : '↓'}</span> {Math.abs(change)}%
              <span className="text-neutral-400 font-normal">vs last month</span>
            </p>
          )}
        </div>
        {Icon && (
          <div className={`grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br ${colors[color]} transition-transform group-hover:scale-110`}>
            <Icon className="h-5 w-5" strokeWidth={2} />
          </div>
        )}
      </div>
    </motion.div>
  );
}

export function Badge({ children, variant = 'neutral', className = '', dot = false }) {
  const map = { success: 'badge-success', warning: 'badge-warning', error: 'badge-error', info: 'badge-info', neutral: 'badge-neutral' };
  return (
    <span className={`${map[variant] || 'badge-neutral'} ${className}`}>
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />}
      {children}
    </span>
  );
}

export function Button({ children, variant = 'primary', size = 'md', className = '', ...props }) {
  const variants = { primary: 'btn-primary', secondary: 'btn-secondary', ghost: 'btn-ghost', outline: 'btn-outline', danger: 'btn-danger' };
  const sizes = { sm: 'px-3 py-1.5 text-sm', md: '', lg: 'px-6 py-3 text-base' };
  return <button className={`${variants[variant]} ${sizes[size]} ${className}`} {...props}>{children}</button>;
}

export function Modal({ open, onClose, title, children, size = 'md' }) {
  const sizes = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' };
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-neutral-950/40 backdrop-blur-md" />
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 8 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className={`relative w-full ${sizes[size]} card-elevated p-6 max-h-[90vh] overflow-y-auto`}
          >
            <div className="mb-5 flex items-center justify-between">
              <h3 className="font-display text-lg font-bold text-neutral-900">{title}</h3>
              <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-lg text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 transition">
                <X className="h-4.5 w-4.5" />
              </button>
            </div>
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export function Skeleton({ className = '' }) {
  return <div className={`skeleton h-4 ${className}`} />;
}

export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {Icon && (
        <div className="mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-neutral-100 text-neutral-400">
          <Icon className="h-7 w-7" strokeWidth={1.5} />
        </div>
      )}
      <h3 className="font-display text-base font-semibold text-neutral-700">{title}</h3>
      {description && <p className="mt-1 max-w-sm text-sm text-neutral-500">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function PageHeader({ title, description, action, breadcrumb }) {
  return (
    <div className="mb-8">
      {breadcrumb && <div className="mb-2 text-sm text-neutral-400">{breadcrumb}</div>}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-neutral-900 sm:text-[1.75rem]">{title}</h1>
          {description && <p className="mt-1.5 text-sm text-neutral-500 max-w-2xl">{description}</p>}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
    </div>
  );
}

export function Tooltip({ children, content, side = 'top' }) {
  const sideClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
  };
  return (
    <div className="group/tt relative inline-flex">
      {children}
      <div className={`pointer-events-none absolute z-50 whitespace-nowrap rounded-lg bg-neutral-900 px-2.5 py-1.5 text-xs font-medium text-white opacity-0 transition-opacity group-hover/tt:opacity-100 ${sideClasses[side]}`}>
        {content}
      </div>
    </div>
  );
}

export function SectionCard({ title, description, action, children, className = '' }) {
  return (
    <div className={`card p-6 ${className}`}>
      {(title || action) && (
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            {title && <h3 className="font-display text-base font-semibold text-neutral-900">{title}</h3>}
            {description && <p className="mt-0.5 text-sm text-neutral-500">{description}</p>}
          </div>
          {action}
        </div>
      )}
      {children}
    </div>
  );
}
