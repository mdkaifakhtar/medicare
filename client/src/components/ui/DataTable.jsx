import { motion } from 'framer-motion';
import { Search, Inbox } from 'lucide-react';
import Pagination from './Pagination.jsx';

export default function DataTable({ columns, rows, loading, page, totalPages, onPageChange, search, onSearch, searchPlaceholder = 'Search...', actions, emptyMessage = 'No records found', onRowClick }) {
  return (
    <div className="card overflow-hidden">
      {(search !== undefined || actions) && (
        <div className="flex flex-col gap-3 border-b border-neutral-100 p-4 sm:flex-row sm:items-center sm:justify-between">
          {search !== undefined ? (
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
              <input
                value={search}
                onChange={(e) => onSearch?.(e.target.value)}
                placeholder={searchPlaceholder}
                className="input pl-9"
              />
            </div>
          ) : <div />}
          {actions}
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-neutral-100 bg-neutral-50/50">
              {columns.map((c) => (
                <th key={c.key} className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-neutral-500 whitespace-nowrap">
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  {columns.map((c) => (
                    <td key={c.key} className="px-5 py-4">
                      <div className="skeleton h-4 w-full max-w-[120px]" />
                    </td>
                  ))}
                </tr>
              ))
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-5 py-16">
                  <div className="flex flex-col items-center justify-center text-center">
                    <div className="mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-neutral-100 text-neutral-400">
                      <Inbox className="h-6 w-6" strokeWidth={1.5} />
                    </div>
                    <p className="text-sm font-medium text-neutral-600">{emptyMessage}</p>
                  </div>
                </td>
              </tr>
            ) : (
              rows.map((row, i) => (
                <motion.tr
                  key={row.id || i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2, delay: Math.min(i * 0.02, 0.3) }}
                  onClick={() => onRowClick?.(row)}
                  className={`table-row-hover ${onRowClick ? 'cursor-pointer' : ''}`}
                >
                  {columns.map((c) => (
                    <td key={c.key} className="px-5 py-3.5 whitespace-nowrap text-neutral-700">
                      {c.render ? c.render(row) : row[c.key]}
                    </td>
                  ))}
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {onPageChange && (
        <div className="border-t border-neutral-100 px-5 py-3.5">
          <Pagination page={page} totalPages={totalPages} onChange={onPageChange} />
        </div>
      )}
    </div>
  );
}
