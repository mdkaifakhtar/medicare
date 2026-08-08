import { useEffect, useMemo, useRef, useState } from 'react';
import { PageHeader, Card, StatCard } from '../../../components/ui/index.jsx';
import {
  RevenueChart, AppointmentsChart, DepartmentChart, DemographicsChart,
  MedicineSalesChart, BloodInventoryChart,
} from '../../../components/charts/Charts.jsx';
import api from '../../../services/api.js';
import toast from 'react-hot-toast';
import {
  Users, Wallet, Calendar, TrendingUp, Stethoscope, Activity,
  Download, Printer, RefreshCw, FlaskConical, BedDouble, Receipt,
} from 'lucide-react';

const PERIODS = [
  { value: 3, label: 'Last 3 months' },
  { value: 6, label: 'Last 6 months' },
  { value: 12, label: 'Last 12 months' },
];

const inr = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;

function toCSV(rows) {
  if (!rows.length) return '';
  const headers = Object.keys(rows[0]);
  const escape = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  return [headers.join(','), ...rows.map((r) => headers.map((h) => escape(r[h])).join(','))].join('\n');
}

function downloadCSV(filename, rows) {
  const blob = new Blob([toCSV(rows)], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function Analytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState(6);
  const [department, setDepartment] = useState('all');
  const printRef = useRef(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.getAnalytics();
      setData(res);
    } catch (e) {
      toast.error(e?.message || 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const revenueTrend = useMemo(
    () => (data?.revenueData || []).slice(-period),
    [data, period],
  );
  const apptTrend = useMemo(
    () => (data?.appointmentTrend || []).slice(-period),
    [data, period],
  );
  const deptStats = useMemo(() => {
    const all = data?.departmentStats || [];
    return department === 'all' ? all : all.filter((d) => d.name === department);
  }, [data, department]);

  const demographics = useMemo(
    () => (data?.demographics || []).map((d) => ({ name: d.name, value: d.value ?? d.patients ?? 0 })),
    [data],
  );

  const totals = useMemo(() => {
    const revenue = revenueTrend.reduce((s, r) => s + (r.revenue || 0), 0);
    const expenses = revenueTrend.reduce((s, r) => s + (r.expenses || 0), 0);
    return { revenue, expenses, profit: revenue - expenses };
  }, [revenueTrend]);

  const exportCSV = () => {
    const rows = [
      ...revenueTrend.map((r) => ({ section: 'Revenue', label: r.month, value: r.revenue, secondary: r.expenses })),
      ...apptTrend.map((a) => ({ section: 'Appointments', label: a.month, value: a.count, secondary: '' })),
      ...deptStats.map((d) => ({ section: 'Department', label: d.name, value: d.patients, secondary: d.revenue })),
      ...demographics.map((d) => ({ section: 'Demographics', label: d.name, value: d.value, secondary: '' })),
      ...(data?.bloodInventory || []).map((b) => ({ section: 'Blood Bank', label: b.group, value: b.units, secondary: b.capacity })),
      ...(data?.medicineSales || []).map((m) => ({ section: 'Medicine Sales', label: m.name, value: m.sales, secondary: '' })),
    ];
    downloadCSV(`medcare-analytics-${new Date().toISOString().slice(0, 10)}.csv`, rows);
    toast.success('CSV exported');
  };

  const exportPDF = () => {
    toast.success('Opening print dialog — choose "Save as PDF"');
    setTimeout(() => window.print(), 300);
  };

  if (loading || !data) {
    return (
      <div className="space-y-4">
        <div className="skeleton h-24" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => <div key={i} className="skeleton h-28" />)}
        </div>
        <div className="skeleton h-96" />
      </div>
    );
  }

  const occupancy = data.totalBeds ? Math.round((data.occupiedBeds / data.totalBeds) * 100) : 0;

  return (
    <div ref={printRef}>
      <PageHeader
        title="Analytics & Reports"
        description="Live insights into patients, appointments, revenue and hospital operations."
      />

      {/* Filters & exports */}
      <div className="mb-6 flex flex-wrap items-end gap-3 print:hidden">
        <div>
          <label className="label" htmlFor="period">Period</label>
          <select id="period" className="input w-48" value={period} onChange={(e) => setPeriod(Number(e.target.value))}>
            {PERIODS.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="dept">Department</label>
          <select id="dept" className="input w-56" value={department} onChange={(e) => setDepartment(e.target.value)}>
            <option value="all">All departments</option>
            {(data.departmentStats || []).map((d) => <option key={d.name} value={d.name}>{d.name}</option>)}
          </select>
        </div>
        <div className="ml-auto flex flex-wrap gap-2">
          <button type="button" className="btn-white" onClick={load}>
            <RefreshCw className="h-4 w-4" /> Refresh
          </button>
          <button type="button" className="btn-outline" onClick={exportCSV}>
            <Download className="h-4 w-4" /> Export CSV
          </button>
          <button type="button" className="btn-primary" onClick={exportPDF}>
            <Printer className="h-4 w-4" /> Export PDF
          </button>
        </div>
      </div>

      {/* KPI row */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard icon={Users} label="Patients" value={(data.totalPatients || 0).toLocaleString()} color="primary" />
        <StatCard icon={Stethoscope} label="Doctors" value={data.totalDoctors || 0} color="secondary" />
        <StatCard icon={Calendar} label="Appointments" value={(data.totalAppointments || 0).toLocaleString()} color="accent" />
        <StatCard icon={Wallet} label="Revenue" value={inr(data.totalRevenue)} color="success" />
        <StatCard icon={BedDouble} label="Bed Occupancy" value={`${occupancy}%`} color="warning" />
        <StatCard icon={FlaskConical} label="Lab Tests" value={data.totalLabTests || 0} color="error" />
      </div>

      {/* Financial summary for the selected period */}
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <Card className="p-5">
          <p className="text-sm font-medium text-neutral-600">Revenue ({period}m)</p>
          <p className="mt-1 font-display text-2xl font-bold text-neutral-900">{inr(totals.revenue)}</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm font-medium text-neutral-600">Expenses ({period}m)</p>
          <p className="mt-1 font-display text-2xl font-bold text-neutral-900">{inr(totals.expenses)}</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm font-medium text-neutral-600">Net Profit ({period}m)</p>
          <p className={`mt-1 font-display text-2xl font-bold ${totals.profit >= 0 ? 'text-primary-700' : 'text-error-600'}`}>
            {inr(totals.profit)}
          </p>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-5">
          <h3 className="mb-4 font-display font-bold text-neutral-900">Revenue &amp; Expenses</h3>
          <RevenueChart data={revenueTrend} />
        </Card>
        <Card className="p-5">
          <h3 className="mb-4 font-display font-bold text-neutral-900">Appointments Trend</h3>
          <AppointmentsChart data={apptTrend} />
        </Card>
        <Card className="p-5">
          <h3 className="mb-4 font-display font-bold text-neutral-900">Department Performance</h3>
          <DepartmentChart data={deptStats} />
        </Card>
        <Card className="p-5">
          <h3 className="mb-4 font-display font-bold text-neutral-900">Patient Demographics</h3>
          <DemographicsChart data={demographics} />
        </Card>
        <Card className="p-5">
          <h3 className="mb-4 font-display font-bold text-neutral-900">Medicine Sales</h3>
          <MedicineSalesChart data={(data.medicineSales || []).map((m) => ({ month: m.name, sales: m.sales }))} />
        </Card>
        <Card className="p-5">
          <h3 className="mb-4 font-display font-bold text-neutral-900">Blood Inventory</h3>
          <BloodInventoryChart data={data.bloodInventory || []} />
        </Card>
      </div>

      {/* Operational snapshot */}
      <Card className="mt-6 p-5">
        <h3 className="mb-4 flex items-center gap-2 font-display font-bold text-neutral-900">
          <Activity className="h-4 w-4 text-primary-600" /> Operational Snapshot
        </h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: 'Pending Appointments', value: data.pendingAppointments },
            { label: 'Completed Appointments', value: data.completedAppointments },
            { label: 'Pending Lab Tests', value: data.pendingLabs },
            { label: 'Unpaid Invoices', value: data.unpaidInvoices },
            { label: 'Low Stock Medicines', value: data.lowStockMeds },
            { label: 'Available Beds', value: data.availableBeds },
            { label: 'Active Emergencies', value: data.activeEmergencies },
            { label: 'Available Ambulances', value: data.availableAmbulances },
          ].map((k) => (
            <div key={k.label} className="rounded-xl border border-neutral-200 p-4">
              <p className="text-sm text-neutral-600">{k.label}</p>
              <p className="mt-1 font-display text-xl font-bold text-neutral-900">{k.value ?? 0}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 flex items-center gap-2 text-xs text-neutral-600">
          <Receipt className="h-3.5 w-3.5" /> Figures update live from hospital records.
          <TrendingUp className="ml-2 h-3.5 w-3.5" /> Period filter applies to trend charts and financial totals.
        </p>
      </Card>
    </div>
  );
}
