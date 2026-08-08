import { useRef, useState } from 'react';
import { PageHeader, Card, Button, Badge } from '../../../components/ui/index.jsx';
import { useSelector, useDispatch } from 'react-redux';
import { updateUser } from '../../../redux/store.js';
import api from '../../../services/api.js';
import toast from 'react-hot-toast';
import { User, Mail, Phone, Shield, Clock, Smartphone, LogOut, Camera, Trash2, Check, X } from 'lucide-react';
import { roleLabels } from '../../../config/navigation.js';

const PHOTO_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_PHOTO_BYTES = 5 * 1024 * 1024;

// Downscales/compresses the chosen image in the browser so stored avatars stay
// small (max 512px, ~0.85 quality) regardless of the original file size.
function compressImage(file, max = 512) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Could not read the selected image'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('That file is not a valid image'));
      img.onload = () => {
        const scale = Math.min(1, max / Math.max(img.width, img.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, Math.round(img.width * scale));
        canvas.height = Math.max(1, Math.round(img.height * scale));
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const type = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
        resolve(canvas.toDataURL(type, 0.85));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

export default function Profile() {
  const { user } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: user?.name, phone: user?.phone, email: user?.email });

  // ---- Profile photo state ----
  const fileRef = useRef(null);
  const [pending, setPending] = useState(null); // { file, dataUrl }
  const [progress, setProgress] = useState(0);
  const [busy, setBusy] = useState(false);

  const pickPhoto = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (!PHOTO_TYPES.includes(file.type)) return toast.error('Only JPG, JPEG, PNG, and WEBP images are supported');
    if (file.size > MAX_PHOTO_BYTES) return toast.error('Profile photo must be 5 MB or smaller');
    try {
      const dataUrl = await compressImage(file);
      setPending({ file, dataUrl });
      setProgress(0);
    } catch (err) {
      toast.error(err.message || 'Could not read that image');
    }
  };

  const savePhoto = async () => {
    if (!pending) return;
    setBusy(true);
    setProgress(5);
    try {
      const updated = await api.uploadAvatar({ file: pending.file, dataUrl: pending.dataUrl }, setProgress);
      dispatch(updateUser({ picture: updated?.picture || pending.dataUrl }));
      setPending(null);
      toast.success('Profile photo updated');
    } catch (err) {
      toast.error(err?.message || 'Photo upload failed');
    } finally {
      setBusy(false);
      setProgress(0);
    }
  };

  const deletePhoto = async () => {
    setBusy(true);
    try {
      await api.removeAvatar();
      dispatch(updateUser({ picture: '' }));
      setPending(null);
      toast.success('Profile photo removed');
    } catch (err) {
      toast.error(err?.message || 'Could not remove the photo');
    } finally {
      setBusy(false);
    }
  };

  const shownPhoto = pending?.dataUrl || user?.picture || '';

  const save = (e) => {
    e.preventDefault();
    dispatch(updateUser(form));
    setEditing(false);
    toast.success('Profile updated');
  };

  return (
    <div>
      <PageHeader title="My Profile" description="Manage your personal information and account settings." />
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="p-6 text-center">
          <div className="relative mx-auto h-24 w-24">
            {shownPhoto ? (
              <img src={shownPhoto} alt={`${user?.name || 'User'} profile photo`} className="h-24 w-24 rounded-3xl object-cover ring-2 ring-primary-200" />
            ) : (
              <div className="grid h-24 w-24 place-items-center rounded-3xl bg-gradient-to-br from-primary-500 to-secondary-500 text-3xl font-bold text-white">{user?.avatar || user?.name?.[0]}</div>
            )}
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={busy}
              title="Change profile photo"
              aria-label="Change profile photo"
              className="absolute -bottom-1 -right-1 grid h-9 w-9 place-items-center rounded-full border-2 border-white bg-primary-600 text-white shadow-card transition hover:bg-primary-700 disabled:opacity-60"
            >
              <Camera className="h-4 w-4" />
            </button>
            <input ref={fileRef} type="file" accept="image/jpeg,image/jpg,image/png,image/webp" onChange={pickPhoto} className="hidden" />
          </div>

          {busy && progress > 0 && (
            <div className="mx-auto mt-3 h-1.5 w-40 overflow-hidden rounded-full bg-neutral-200">
              <div className="h-full rounded-full bg-primary-600 transition-all" style={{ width: `${progress}%` }} />
            </div>
          )}

          {pending ? (
            <div className="mt-3 flex items-center justify-center gap-2">
              <Button size="sm" onClick={savePhoto} disabled={busy}><Check className="mr-1 h-4 w-4" />{busy ? 'Uploading…' : 'Save photo'}</Button>
              <Button size="sm" variant="outline" onClick={() => setPending(null)} disabled={busy}><X className="mr-1 h-4 w-4" />Cancel</Button>
            </div>
          ) : (
            <div className="mt-3 flex items-center justify-center gap-2">
              <Button size="sm" variant="outline" onClick={() => fileRef.current?.click()} disabled={busy}>
                <Camera className="mr-1 h-4 w-4" />{user?.picture ? 'Change photo' : 'Upload photo'}
              </Button>
              {user?.picture ? (
                <Button size="sm" variant="outline" onClick={deletePhoto} disabled={busy}><Trash2 className="mr-1 h-4 w-4" />Remove</Button>
              ) : null}
            </div>
          )}
          <p className="mt-2 text-[11px] text-neutral-500">JPG, JPEG, PNG or WEBP · max 5 MB</p>

          <h3 className="mt-4 font-display text-xl font-bold text-neutral-900">{user?.name}</h3>
          <p className="text-sm text-primary-600">{roleLabels[user?.role]}</p>
          <Badge variant="success" className="mt-3">Active</Badge>
          <div className="mt-6 space-y-2 text-left">
            <div className="flex items-center gap-2 text-sm text-neutral-500"><Mail className="h-4 w-4" /> {user?.email}</div>
            <div className="flex items-center gap-2 text-sm text-neutral-500"><Phone className="h-4 w-4" /> {user?.phone}</div>
            <div className="flex items-center gap-2 text-sm text-neutral-500"><Clock className="h-4 w-4" /> Joined {new Date(user?.createdAt).toLocaleDateString()}</div>
          </div>
        </Card>


        <Card className="p-6 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-display font-bold text-neutral-900">Personal Information</h3>
            {!editing ? <Button variant="outline" size="sm" onClick={() => setEditing(true)}>Edit</Button> : null}
          </div>
          {!editing ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {[['Full Name', user?.name], ['Email', user?.email], ['Phone', user?.phone], ['Role', roleLabels[user?.role]]].map(([k, v]) => (
                <div key={k}><p className="text-xs text-neutral-500">{k}</p><p className="mt-1 font-medium text-neutral-900">{v}</p></div>
              ))}
            </div>
          ) : (
            <form onSubmit={save} className="space-y-4">
              <div><label className="label">Full Name</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input" /></div>
              <div><label className="label">Email</label><input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input" /></div>
              <div><label className="label">Phone</label><input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input" /></div>
              <div className="flex gap-2"><Button type="submit">Save</Button><Button type="button" variant="outline" onClick={() => setEditing(false)}>Cancel</Button></div>
            </form>
          )}
        </Card>

        <Card className="p-6 lg:col-span-3">
          <h3 className="mb-4 font-display font-bold text-neutral-900">Login History & Sessions</h3>
          <div className="space-y-2">
            {(user?.loginHistory?.length ? user.loginHistory : [{ at: new Date().toISOString(), ip: '192.168.1.10', device: 'Chrome on Windows' }]).map((h, i) => (
              <div key={i} className="flex items-center justify-between rounded-xl border border-neutral-100 p-3">
                <div className="flex items-center gap-3"><div className="grid h-9 w-9 place-items-center rounded-lg bg-neutral-100 text-neutral-500"><Smartphone className="h-4.5 w-4.5" /></div><div><p className="text-sm font-medium text-neutral-900">{h.device || 'Web Browser'}</p><p className="text-xs text-neutral-500">{new Date(h.at).toLocaleString()} · {h.ip}</p></div></div>
                {i === 0 ? <Badge variant="success">Current</Badge> : <Badge variant="neutral">Active</Badge>}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
