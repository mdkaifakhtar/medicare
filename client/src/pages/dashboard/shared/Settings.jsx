import { useEffect, useState } from 'react';
import { PageHeader, Card, Button, Badge } from '../../../components/ui/index.jsx';
import { mockApi } from '../../../services/mockApi.js';
import toast from 'react-hot-toast';
import { Building2, Phone, Mail, MapPin, Save, Database, Shield, Bell, Globe, FileText } from 'lucide-react';

export default function Settings() {
  const [form, setForm] = useState(null);
  const [security, setSecurity] = useState({ twoFactor: true, sessionTimeout: true, loginLimit: true, auditLog: true });
  const [notifs, setNotifs] = useState({ email: true, sms: true, browser: true, emergency: true });
  const [saving, setSaving] = useState(false);

  useEffect(() => { mockApi.getSettings().then(setForm); }, []);
  if (!form) return <div className="skeleton h-96" />;

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    await mockApi.updateSettings({ ...form, security, notifications: notifs });
    toast.success('Settings saved successfully');
    setSaving(false);
  };

  const Toggle = ({ on, onClick }) => (
    <button onClick={onClick} className={`relative h-6 w-11 rounded-full transition-colors ${on ? 'bg-primary-500' : 'bg-neutral-300'}`}>
      <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${on ? 'translate-x-[22px]' : 'translate-x-0.5'}`} />
    </button>
  );

  return (
    <div>
      <PageHeader title="Hospital Settings" description="Configure hospital information and system preferences." />
      <form onSubmit={save} className="grid gap-6 lg:grid-cols-3">
        <Card className="p-6 lg:col-span-2">
          <h3 className="mb-4 flex items-center gap-2 font-display font-bold text-neutral-900"><Building2 className="h-5 w-5 text-primary-500" /> Hospital Information</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div><label className="label">Hospital Name</label><input value={form.name || ''} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input" /></div>
            <div><label className="label">Tagline</label><input value={form.tagline || ''} onChange={(e) => setForm({ ...form, tagline: e.target.value })} className="input" /></div>
            <div><label className="label"><Phone className="mr-1 inline h-3 w-3" />Phone</label><input value={form.phone || ''} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input" /></div>
            <div><label className="label">Emergency Number</label><input value={form.emergency || ''} onChange={(e) => setForm({ ...form, emergency: e.target.value })} className="input" /></div>
            <div><label className="label"><Mail className="mr-1 inline h-3 w-3" />Email</label><input value={form.email || ''} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input" /></div>
            <div><label className="label"><Globe className="mr-1 inline h-3 w-3" />Website</label><input value={form.website || ''} onChange={(e) => setForm({ ...form, website: e.target.value })} className="input" /></div>
            <div className="sm:col-span-2"><label className="label"><MapPin className="mr-1 inline h-3 w-3" />Address</label><input value={form.address || ''} onChange={(e) => setForm({ ...form, address: e.target.value })} className="input" /></div>
            <div><label className="label"><FileText className="mr-1 inline h-3 w-3" />Registration No</label><input value={form.registrationNo || ''} onChange={(e) => setForm({ ...form, registrationNo: e.target.value })} className="input" /></div>
            <div><label className="label">GSTIN</label><input value={form.gstin || ''} onChange={(e) => setForm({ ...form, gstin: e.target.value })} className="input" /></div>
          </div>
          <div className="mt-6 flex justify-end"><Button type="submit" disabled={saving}><Save className="h-4 w-4" /> {saving ? 'Saving...' : 'Save Changes'}</Button></div>
        </Card>

        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="mb-4 flex items-center gap-2 font-display font-bold text-neutral-900"><Shield className="h-5 w-5 text-secondary-500" /> Security</h3>
            <div className="space-y-3">
              {[['twoFactor', 'Two-Factor Authentication'], ['sessionTimeout', 'Session Timeout (30min)'], ['loginLimit', 'Login Attempt Limit'], ['auditLog', 'Audit Logging']].map(([key, label]) => (
                <div key={key} className="flex items-center justify-between"><span className="text-sm text-neutral-600">{label}</span><Toggle on={security[key]} onClick={() => setSecurity({ ...security, [key]: !security[key] })} /></div>
              ))}
            </div>
          </Card>
          <Card className="p-6">
            <h3 className="mb-4 flex items-center gap-2 font-display font-bold text-neutral-900"><Bell className="h-5 w-5 text-accent-500" /> Notifications</h3>
            <div className="space-y-3">
              {[['email', 'Email Notifications'], ['sms', 'SMS Alerts'], ['browser', 'Browser Notifications'], ['emergency', 'Emergency Alerts']].map(([key, label]) => (
                <div key={key} className="flex items-center justify-between"><span className="text-sm text-neutral-600">{label}</span><Toggle on={notifs[key]} onClick={() => setNotifs({ ...notifs, [key]: !notifs[key] })} /></div>
              ))}
            </div>
          </Card>
          <Card className="p-6">
            <h3 className="mb-4 flex items-center gap-2 font-display font-bold text-neutral-900"><Database className="h-5 w-5 text-primary-500" /> Backup</h3>
            <p className="text-sm text-neutral-500">Last backup: Today, 03:00 AM</p>
            <Button variant="outline" className="mt-3 w-full justify-center" onClick={() => toast.success('Backup initiated — estimated 2 minutes')}><Database className="h-4 w-4" /> Backup Now</Button>
          </Card>
        </div>
      </form>
    </div>
  );
}
