import { useEffect, useState } from 'react';
import { ScrollText, User, Shield, Settings, LogIn, CreditCard as Edit, Search } from 'lucide-react';
import { PageHeader, Card, Badge, EmptyState } from '../../../components/ui/index.jsx';
import { mockApi } from '../../../services/mockApi.js';

const iconMap = { auth: LogIn, settings: Settings, medical: Edit, patient: User, finance: Edit, lab: Edit, admin: Shield, pharmacy: Edit, appointment: Edit, emergency: Edit };
const typeColors = { auth: 'info', settings: 'warning', medical: 'success', patient: 'info', finance: 'success', lab: 'info', admin: 'error', pharmacy: 'warning', appointment: 'info', emergency: 'error' };

function classify(action) {
  const a = (action || '').toLowerCase();
  if (a.includes('login') || a.includes('register')) return 'auth';
  if (a.includes('settings')) return 'settings';
  if (a.includes('prescription') || a.includes('medicine')) return 'medical';
  if (a.includes('patient')) return 'patient';
  if (a.includes('invoice') || a.includes('payment') || a.includes('expense') || a.includes('insurance')) return 'finance';
  if (a.includes('lab') || a.includes('sample') || a.includes('report')) return 'lab';
  if (a.includes('approve') || a.includes('delete') || a.includes('user')) return 'admin';
  if (a.includes('pharmacy') || a.includes('dispense')) return 'pharmacy';
  if (a.includes('appointment')) return 'appointment';
  if (a.includes('emergency')) return 'emergency';
  return 'admin';
}

export default function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  useEffect(() => {
    mockApi.listAuditLogs({ limit: 200 }).then((res) => { setLogs(res.items || []); setLoading(false); });
  }, []);

  const filtered = logs.filter((log) => {
    const type = classify(log.action);
    if (typeFilter !== 'all' && type !== typeFilter) return false;
    if (search && !log.detail?.toLowerCase().includes(search.toLowerCase()) && !log.userName?.toLowerCase().includes(search.toLowerCase()) && !log.action?.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const types = ['all', 'auth', 'medical', 'patient', 'finance', 'lab', 'admin', 'emergency'];

  return (
    <div>
      <PageHeader title="Audit Logs" description="Track all system activities and user actions for security and compliance." />
      <Card className="overflow-hidden">
        <div className="flex flex-wrap items-center gap-3 border-b border-neutral-100 p-4">
          <div className="relative max-w-xs flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search logs..." className="input pl-9" />
          </div>
          <div className="flex flex-wrap gap-2">
            {types.map((t) => (
              <button key={t} onClick={() => setTypeFilter(t)} className={`rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition ${typeFilter === t ? 'bg-primary-500 text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'}`}>{t}</button>
            ))}
          </div>
        </div>
        <div className="max-h-[600px] overflow-y-auto">
          <div className="space-y-2 p-4">
            {loading ? (
              <p className="py-8 text-center text-neutral-400">Loading...</p>
            ) : filtered.length === 0 ? (
              <EmptyState icon={ScrollText} title="No logs found" />
            ) : filtered.map((log) => {
              const type = classify(log.action);
              const Icon = iconMap[type] || ScrollText;
              return (
                <div key={log.id} className="flex items-start gap-4 rounded-xl border border-neutral-100 p-3 hover:bg-neutral-50 transition">
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-neutral-100 text-neutral-600"><Icon className="h-4 w-4" /></div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-neutral-900"><span className="text-primary-600">{log.userName}</span> · {log.action.replace(/_/g, ' ').toLowerCase()}</p>
                      <span className="text-xs text-neutral-400">{new Date(log.timestamp).toLocaleString()}</span>
                    </div>
                    <p className="mt-0.5 text-sm text-neutral-500">{log.detail}</p>
                  </div>
                  <Badge variant={typeColors[type] || 'info'}>{type}</Badge>
                </div>
              );
            })}
          </div>
        </div>
      </Card>
    </div>
  );
}
