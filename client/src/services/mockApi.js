// Fully functional localStorage-backed API.
// Replaces the Express+MongoDB client with an in-browser data store
// that persists to localStorage and seeds itself on first load.
import { loadDB, saveDB, resetDB, uid, logActivity, notify } from './db.js';

// ── helpers ──────────────────────────────────────────────
const ok = (items, extra = {}) => ({ items, ...extra });

function paginate(items, { page = 1, limit = 50, ...rest } = {}) {
  const filtered = filterBy(items, rest);
  const total = filtered.length;
  const start = (page - 1) * limit;
  return ok(filtered.slice(start, start + limit), { total, page, limit, totalPages: Math.max(1, Math.ceil(total / limit)) });
}

function filterBy(items, params) {
  let out = [...items];
  for (const [k, v] of Object.entries(params || {})) {
    if (v == null || v === '' || k === 'page' || k === 'limit') continue;
    out = out.filter((it) => String(it[k]) === String(v));
  }
  return out;
}

function delay(ms = 120) { return new Promise((r) => setTimeout(r, ms)); }

function todayISO() { return new Date().toISOString().slice(0, 10); }

function nowISO() { return new Date().toISOString(); }

// ── AUTH ──────────────────────────────────────────────────
async function login({ email, password }) {
  await delay();
  const db = loadDB();
  const user = db.users.find((u) => u.email === email && u.password === password);
  if (!user) throw { status: 401, message: 'Invalid email or password' };
  if (user.status === 'pending') throw { status: 403, message: 'Account pending approval' };
  const { password: _pw, ...safe } = user;
  user.lastLogin = nowISO();
  user.loginHistory = [{ timestamp: nowISO(), ip: '127.0.0.1' }, ...(user.loginHistory || [])].slice(0, 10);
  saveDB(db);
  return { user: safe, accessToken: `mock_${user.id}_${Date.now()}` };
}

async function register(payload) {
  await delay();
  const db = loadDB();
  if (db.users.some((u) => u.email === payload.email)) throw { status: 409, message: 'Email already registered' };
  const role = payload.role || 'patient';
  const id = uid('u');
  const patientId = role === 'patient' ? uid('p') : null;
  const user = {
    id,
    role,
    name: payload.name,
    email: payload.email,
    password: payload.password,
    phone: payload.phone || '',
    avatar: (payload.name || '?').split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase(),
    status: 'active',
    createdAt: nowISO(),
    lastLogin: null,
    loginHistory: [],
    patientId,
  };
  db.users.push(user);
  if (role === 'patient') {
    db.patients.unshift({
      id: patientId,
      userId: id,
      name: payload.name,
      gender: payload.gender || 'Male',
      age: payload.age || 0,
      bloodGroup: payload.bloodGroup || 'Unknown',
      phone: payload.phone || '',
      email: payload.email,
      address: payload.address || '',
      emergencyContact: payload.emergencyContact || '',
      allergies: [],
      chronicConditions: [],
      insurance: null,
      avatar: user.avatar,
      status: 'active',
      registeredAt: nowISO(),
    });
  }
  logActivity(db, { userId: id, userName: user.name, role, action: 'REGISTER', entity: 'user', entityId: id, detail: `${role} account registered` });
  saveDB(db);
  const { password: _pw, ...safe } = user;
  return { user: safe, accessToken: `mock_${id}_${Date.now()}` };
}

// Google OAuth (offline data layer) — mirrors the Express /api/auth/google
// contract: existing accounts sign in, unknown emails are auto-provisioned as
// patients with an access + refresh token pair.
function decodeCredential(credential) {
  try {
    const base64 = String(credential).split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(decodeURIComponent(atob(base64).split('').map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`).join('')));
  } catch { return null; }
}

async function googleLogin({ credential } = {}) {
  await delay();
  const profile = decodeCredential(credential);
  if (!profile?.email) throw { status: 401, message: 'Invalid Google credential' };
  const email = profile.email.toLowerCase();
  const name = profile.name || email.split('@')[0];
  const db = loadDB();
  let user = db.users.find((u) => u.email.toLowerCase() === email);
  let created = false;

  if (!user) {
    const res = await register({ name, email, password: `google_${profile.sub}`, phone: '', role: 'patient' });
    const fresh = loadDB();
    user = fresh.users.find((u) => u.id === res.user.id);
    user.authProvider = 'google';
    user.googleId = profile.sub;
    user.picture = profile.picture || '';
    created = true;
    saveDB(fresh);
  } else {
    if (user.status === 'pending') throw { status: 403, message: 'Account pending approval' };
    user.authProvider = user.authProvider || 'google';
    user.googleId = user.googleId || profile.sub;
    saveDB(db);
  }

  const latest = loadDB();
  const stored = latest.users.find((u) => u.email.toLowerCase() === email);
  stored.lastLogin = nowISO();
  stored.loginHistory = [{ timestamp: nowISO(), ip: '127.0.0.1', device: 'google' }, ...(stored.loginHistory || [])].slice(0, 10);
  saveDB(latest);
  const { password: _pw, ...safe } = stored;
  return { user: safe, accessToken: `mock_${stored.id}_${Date.now()}`, refreshToken: `mockr_${stored.id}_${Date.now()}`, created };
}

// Mock tokens look like `mock_{userId}_{timestamp}` and user ids themselves
// contain underscores (u_admin), so strip the prefix and the trailing stamp.
function userIdFromToken(token) {
  const raw = String(token || '');
  const body = raw.replace(/^mockr?_/, '');
  return body.slice(0, body.lastIndexOf('_')) || body;
}

async function getMe(token) {
  await delay(50);
  const id = userIdFromToken(token);
  const db = loadDB();
  const user = db.users.find((u) => u.id === id);
  if (!user) throw { status: 404, message: 'User not found' };
  const { password: _pw, ...safe } = user;
  return safe;
}

function currentUserRecord(db) {
  const id = userIdFromToken(localStorage.getItem('medcare_token'));
  const user = db.users.find((u) => u.id === id);
  if (!user) throw { status: 404, message: 'User not found' };
  return user;
}


async function updateProfile(updates) {
  await delay();
  const db = loadDB();
  const user = currentUserRecord(db);
  Object.assign(user, updates);
  saveDB(db);
  const { password: _pw, ...safe } = user;
  return safe;
}

// Profile photo (offline data layer) — mirrors POST/DELETE /api/auth/me/photo.
// The compressed data URL produced by the client is stored on the user record
// (and mirrored on the linked patient) so it survives logout/login.
async function uploadAvatar({ dataUrl } = {}, onProgress) {
  if (!dataUrl) throw { status: 400, message: 'A photo is required' };
  for (const pct of [25, 55, 85, 100]) {
    await delay(70);
    if (typeof onProgress === 'function') onProgress(pct);
  }
  const db = loadDB();
  const user = currentUserRecord(db);
  user.picture = dataUrl;
  const patient = db.patients?.find((p) => p.userId === user.id);
  if (patient) patient.picture = dataUrl;
  saveDB(db);
  const { password: _pw, ...safe } = user;
  return safe;
}

async function removeAvatar() {
  await delay();
  const db = loadDB();
  const user = currentUserRecord(db);
  user.picture = '';
  const patient = db.patients?.find((p) => p.userId === user.id);
  if (patient) patient.picture = '';
  saveDB(db);
  const { password: _pw, ...safe } = user;
  return safe;
}


async function listUsers(params = {}) {
  await delay();
  const db = loadDB();
  const users = db.users.map(({ password, ...rest }) => rest);
  return paginate(users, params);
}

async function updateUser(id, payload) {
  await delay();
  const db = loadDB();
  const user = db.users.find((u) => u.id === id);
  if (!user) throw { status: 404, message: 'User not found' };
  Object.assign(user, payload);
  saveDB(db);
  const { password: _pw, ...safe } = user;
  return safe;
}

async function approveUser(id, actor) {
  const db = loadDB();
  const user = db.users.find((u) => u.id === id);
  if (user) { user.status = 'active'; logActivity(db, { userId: actor?.id, userName: actor?.name, role: actor?.role, action: 'APPROVE_USER', entity: 'user', entityId: id, detail: `Approved ${user.name}` }); }
  saveDB(db);
  return user;
}

async function forgotPassword(email) {
  await delay();
  return { message: 'If that email exists, a reset link has been sent.' };
}

// ── ANALYTICS ─────────────────────────────────────────────
async function getAnalytics() {
  await delay(150);
  const db = loadDB();
  const totalPatients = db.patients.length;
  const totalDoctors = db.doctors.length;
  const totalAppointments = db.appointments.length;
  const totalRevenue = db.invoices.filter((i) => i.status === 'paid').reduce((s, i) => s + (i.total || 0), 0);
  const pendingAppointments = db.appointments.filter((a) => a.status === 'scheduled').length;
  const completedAppointments = db.appointments.filter((a) => a.status === 'completed').length;
  const totalDepartments = db.departments.length;
  const totalStaff = db.staff.length;
  const availableBeds = db.beds.filter((b) => b.status === 'available').length;
  const occupiedBeds = db.beds.filter((b) => b.status === 'occupied').length;
  const totalBeds = db.beds.length;
  const lowStockMeds = db.medicines.filter((m) => m.stock <= m.reorderLevel).length;
  const pendingLabs = db.labTests.filter((l) => l.status === 'pending' || l.status === 'sample_collected').length;
  const unpaidInvoices = db.invoices.filter((i) => i.status !== 'paid').length;
  const activeEmergencies = (db.emergencyCases || []).filter((e) => !['discharged', 'transferred', 'deceased'].includes(e.status)).length;
  const availableAmbulances = db.ambulances.filter((a) => a.status === 'available').length;

  // Monthly buckets for the last 12 months (day-1 anchored so month math never
  // rolls over on 29th–31st, and keys are local-time safe). The window ends at
  // the most recent record in the dataset so seeded history is never off-chart.
  const allDates = [
    ...db.invoices.map((i) => i.createdAt),
    ...db.expenses.map((e) => e.date),
    ...db.appointments.map((a) => a.date),
  ].filter(Boolean).sort();
  const latest = allDates.length ? new Date(allDates[allDates.length - 1]) : new Date();
  const anchor = latest > new Date() ? new Date() : latest;

  const monthKeys = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date(anchor.getFullYear(), anchor.getMonth() - i, 1);
    monthKeys.push({
      key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`,
      label: d.toLocaleString('en', { month: 'short' }),
    });
  }


  const months = monthKeys.map(({ key, label }) => {
    const monthInv = db.invoices.filter((inv) => (inv.createdAt || '').slice(0, 7) === key && inv.status === 'paid');
    const monthExp = db.expenses.filter((e) => (e.date || '').slice(0, 7) === key);
    return {
      month: label,
      revenue: monthInv.reduce((s, i) => s + (i.total || 0), 0),
      expenses: monthExp.reduce((s, e) => s + (e.amount || 0), 0),
    };
  });

  // Appointment trend
  const apptMonths = monthKeys.map(({ key, label }) => ({
    month: label,
    count: db.appointments.filter((a) => (a.date || '').slice(0, 7) === key).length,
  }));


  // Department distribution
  const deptStats = db.departments.map((dep) => ({
    name: dep.name,
    patients: dep.totalPatients || 0,
    revenue: db.invoices.filter((i) => db.appointments.some((a) => a.id === i.appointmentId && a.department === dep.id)).reduce((s, i) => s + (i.total || 0), 0),
  }));

  // Demographics
  const demographics = [
    { name: '0-18', patients: db.patients.filter((p) => p.age < 18).length },
    { name: '19-35', patients: db.patients.filter((p) => p.age >= 18 && p.age <= 35).length },
    { name: '36-50', patients: db.patients.filter((p) => p.age > 35 && p.age <= 50).length },
    { name: '51-65', patients: db.patients.filter((p) => p.age > 50 && p.age <= 65).length },
    { name: '65+', patients: db.patients.filter((p) => p.age > 65).length },
  ];

  // Blood inventory
  const bloodInventory = db.bloodBank.map((b) => ({ group: b.group, units: b.units, capacity: b.capacity }));

  // Medicine sales (mock from orders)
  const medicineSales = db.medicines.slice(0, 6).map((m) => ({
    name: m.name.split(' ')[0],
    sales: Math.floor(Math.random() * 200) + 50,
  }));

  return {
    totalPatients,
    totalDoctors,
    totalAppointments,
    totalRevenue,
    pendingAppointments,
    completedAppointments,
    totalDepartments,
    totalStaff,
    availableBeds,
    occupiedBeds,
    totalBeds,
    lowStockMeds,
    pendingLabs,
    unpaidInvoices,
    activeEmergencies,
    availableAmbulances,
    revenueData: months,
    appointmentTrend: apptMonths,
    departmentStats: deptStats,
    demographics,
    bloodInventory,
    medicineSales,
    // extra fields some dashboards expect
    totalInvoices: db.invoices.length,
    pendingInvoices: unpaidInvoices,
    paidInvoices: db.invoices.filter((i) => i.status === 'paid').length,
    totalExpenses: db.expenses.reduce((s, e) => s + (e.amount || 0), 0),
    pendingExpenses: db.expenses.filter((e) => e.status === 'pending').length,
    totalLabTests: db.labTests.length,
    completedLabTests: db.labTests.filter((l) => l.status === 'completed' || l.status === 'approved').length,
    totalMedicines: db.medicines.length,
    totalAmbulances: db.ambulances.length,
    onCallAmbulances: db.ambulances.filter((a) => a.status === 'on_call').length,
    pendingInsurance: (db.insuranceClaims || []).filter((c) => c.status === 'pending').length,
    approvedInsurance: (db.insuranceClaims || []).filter((c) => c.status === 'approved').length,
    insuranceClaimsAmount: (db.insuranceClaims || []).reduce((s, c) => s + (c.claimAmount || 0), 0),
    newPatientsThisMonth: db.patients.filter((p) => p.registeredAt && p.registeredAt.slice(0, 7) === todayISO().slice(0, 7)).length,
    appointmentsToday: db.appointments.filter((a) => a.date === todayISO()).length,
  };
}

// ── DEPARTMENTS ───────────────────────────────────────────
async function listDepartments(params = {}) {
  await delay();
  const db = loadDB();
  return paginate(db.departments, params);
}
async function getDepartment(id) {
  await delay();
  const db = loadDB();
  return db.departments.find((d) => d.id === id);
}
async function createDepartment(payload) {
  await delay();
  const db = loadDB();
  const dep = { id: uid('dep'), totalDoctors: 0, totalPatients: 0, ...payload };
  db.departments.push(dep);
  saveDB(db);
  return dep;
}
async function updateDepartment(id, payload) {
  await delay();
  const db = loadDB();
  const dep = db.departments.find((d) => d.id === id);
  if (!dep) throw { status: 404, message: 'Department not found' };
  Object.assign(dep, payload);
  saveDB(db);
  return dep;
}
async function deleteDepartment(id) {
  await delay();
  const db = loadDB();
  db.departments = db.departments.filter((d) => d.id !== id);
  saveDB(db);
  return { success: true };
}

// ── DOCTORS ───────────────────────────────────────────────
async function listDoctors(params = {}) {
  await delay();
  const db = loadDB();
  return paginate(db.doctors, params);
}
async function getDoctor(id) {
  await delay();
  const db = loadDB();
  return db.doctors.find((d) => d.id === id);
}
async function createDoctor(payload) {
  await delay();
  const db = loadDB();
  const doc = { id: uid('d'), rating: 0, reviews: 0, status: 'available', ...payload };
  db.doctors.push(doc);
  saveDB(db);
  return doc;
}
async function updateDoctor(id, payload) {
  await delay();
  const db = loadDB();
  const doc = db.doctors.find((d) => d.id === id);
  if (!doc) throw { status: 404, message: 'Doctor not found' };
  Object.assign(doc, payload);
  saveDB(db);
  return doc;
}
async function deleteDoctor(id) {
  await delay();
  const db = loadDB();
  db.doctors = db.doctors.filter((d) => d.id !== id);
  saveDB(db);
  return { success: true };
}

// ── PATIENTS ─────────────────────────────────────────────
async function listPatients(params = {}) {
  await delay();
  const db = loadDB();
  return paginate(db.patients, params);
}
async function getPatient(id) {
  await delay();
  const db = loadDB();
  const patient = db.patients.find((p) => p.id === id);
  if (!patient) throw { status: 404, message: 'Patient not found' };
  const appointments = db.appointments.filter((a) => a.patientId === id);
  const prescriptions = db.prescriptions.filter((p) => p.patientId === id);
  const labTests = db.labTests.filter((l) => l.patientId === id);
  const invoices = db.invoices.filter((i) => i.patientId === id);
  const vitals = db.vitals.filter((v) => v.patientId === id);
  return { ...patient, appointments, prescriptions, labTests, invoices, vitals };
}
async function createPatient(payload) {
  await delay();
  const db = loadDB();
  const patient = {
    id: uid('p'),
    userId: null,
    avatar: (payload.name || '?').split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase(),
    status: 'active',
    registeredAt: nowISO(),
    allergies: [],
    chronicConditions: [],
    ...payload,
  };
  db.patients.unshift(patient);
  saveDB(db);
  return patient;
}
async function updatePatient(id, payload) {
  await delay();
  const db = loadDB();
  const patient = db.patients.find((p) => p.id === id);
  if (!patient) throw { status: 404, message: 'Patient not found' };
  Object.assign(patient, payload);
  saveDB(db);
  return patient;
}
async function deletePatient(id) {
  await delay();
  const db = loadDB();
  db.patients = db.patients.filter((p) => p.id !== id);
  saveDB(db);
  return { success: true };
}

// ── APPOINTMENTS ─────────────────────────────────────────
async function listAppointments(params = {}) {
  await delay();
  const db = loadDB();
  return paginate(db.appointments, params);
}
async function getAppointment(id) {
  await delay();
  const db = loadDB();
  return db.appointments.find((a) => a.id === id);
}
async function createAppointment(payload) {
  await delay();
  const db = loadDB();
  const db2 = db;
  const tokenNo = String(db.appointments.length + 1).padStart(3, '0');
  const patient = db.patients.find((p) => p.id === payload.patientId);
  const doctor = db.doctors.find((d) => d.id === payload.doctorId);
  const dept = db.departments.find((d) => d.id === (payload.department || doctor?.department));
  const appt = {
    id: uid('appt'),
    token: `T-${tokenNo}`,
    patientId: payload.patientId,
    patientName: patient?.name || payload.patientName || '',
    patientPhone: patient?.phone || payload.patientPhone || '',
    doctorId: payload.doctorId,
    doctorName: doctor?.name || payload.doctorName || '',
    department: dept?.id || payload.department || '',
    departmentName: dept?.name || '',
    date: payload.date || todayISO(),
    time: payload.time || '10:00',
    reason: payload.reason || '',
    type: payload.type || 'Consultation',
    status: 'scheduled',
    fee: doctor?.consultationFee || payload.fee || 0,
    createdAt: nowISO(),
    confirmedAt: null,
    confirmedBy: null,
    completedAt: null,
  };
  db.appointments.unshift(appt);
  notify(db, { type: 'appointment', message: `New appointment ${appt.token} booked by ${appt.patientName} — awaiting confirmation`, recipientRole: 'receptionist', entityId: appt.id, entity: 'appointment' });
  logActivity(db, { userId: payload.actorId, userName: payload.actorName || patient?.name, role: payload.actorRole || 'patient', action: 'BOOK_APPOINTMENT', entity: 'appointment', entityId: appt.id, detail: `Booked ${appt.token} with ${appt.doctorName}` });
  saveDB(db);
  return appt;
}
async function updateAppointment(id, payload) {
  await delay();
  const db = loadDB();
  const appt = db.appointments.find((a) => a.id === id);
  if (!appt) throw { status: 404, message: 'Appointment not found' };
  const oldStatus = appt.status;
  Object.assign(appt, payload);
  if (payload.status === 'confirmed' && !appt.confirmedAt) { appt.confirmedAt = nowISO(); }
  if (payload.status === 'completed' && !appt.completedAt) { appt.completedAt = nowISO(); }
  if (oldStatus !== appt.status) {
    logActivity(db, { userId: payload.actorId, userName: payload.actorName, role: payload.actorRole, action: `APPOINTMENT_${appt.status.toUpperCase()}`, entity: 'appointment', entityId: id, detail: `${appt.status} ${appt.token} for ${appt.patientName}` });
  }
  saveDB(db);
  return appt;
}
async function deleteAppointment(id) {
  await delay();
  const db = loadDB();
  db.appointments = db.appointments.filter((a) => a.id !== id);
  saveDB(db);
  return { success: true };
}

// ── PRESCRIPTIONS ───────────────────────────────────────
async function listPrescriptions(params = {}) {
  await delay();
  const db = loadDB();
  return paginate(db.prescriptions, params);
}
async function createPrescription(payload) {
  await delay();
  const db = loadDB();
  const patient = db.patients.find((p) => p.id === payload.patientId);
  const doctor = db.doctors.find((d) => d.id === payload.doctorId);
  const rx = {
    id: uid('rx'),
    appointmentId: payload.appointmentId || null,
    patientId: payload.patientId,
    patientName: patient?.name || payload.patientName || '',
    doctorId: payload.doctorId,
    doctorName: doctor?.name || payload.doctorName || '',
    diagnosis: payload.diagnosis || '',
    medicines: payload.medicines || [],
    notes: payload.notes || '',
    status: 'pending',
    createdAt: nowISO(),
    dispensedAt: null,
    dispensedBy: null,
  };
  db.prescriptions.unshift(rx);
  notify(db, { type: 'prescription', message: `New prescription from ${rx.doctorName} for ${rx.patientName}`, recipientRole: 'pharmacist', entityId: rx.id, entity: 'prescription' });
  logActivity(db, { userId: payload.actorId, userName: payload.actorName, role: payload.actorRole || 'doctor', action: 'CREATE_PRESCRIPTION', entity: 'prescription', entityId: rx.id, detail: `Created prescription for ${rx.patientName}` });
  saveDB(db);
  return rx;
}
async function updatePrescription(id, payload) {
  await delay();
  const db = loadDB();
  const rx = db.prescriptions.find((p) => p.id === id);
  if (!rx) throw { status: 404, message: 'Prescription not found' };
  Object.assign(rx, payload);
  if (payload.status === 'dispensed' && !rx.dispensedAt) { rx.dispensedAt = nowISO(); }
  saveDB(db);
  return rx;
}
async function deletePrescription(id) {
  await delay();
  const db = loadDB();
  db.prescriptions = db.prescriptions.filter((p) => p.id !== id);
  saveDB(db);
  return { success: true };
}

// ── LAB TESTS ────────────────────────────────────────────
async function listLabTests(params = {}) {
  await delay();
  const db = loadDB();
  return paginate(db.labTests, params);
}
async function getLabTest(id) {
  await delay();
  const db = loadDB();
  return db.labTests.find((l) => l.id === id);
}
async function createLabTest(payload) {
  await delay();
  const db = loadDB();
  const patient = db.patients.find((p) => p.id === payload.patientId);
  const doctor = db.doctors.find((d) => d.id === payload.doctorId);
  const lab = {
    id: uid('lab'),
    patientId: payload.patientId,
    patientName: patient?.name || payload.patientName || '',
    doctorId: payload.doctorId,
    doctorName: doctor?.name || payload.doctorName || '',
    appointmentId: payload.appointmentId || null,
    testName: payload.testName || '',
    testType: payload.testType || 'Blood Test',
    category: payload.category || 'Pathology',
    priority: payload.priority || 'normal',
    status: 'pending',
    result: null,
    normalRange: null,
    reportUrl: null,
    sampleCollectedAt: null,
    reportUploadedAt: null,
    tatHours: null,
    createdAt: nowISO(),
    approvedBy: null,
    approvedAt: null,
    comments: [],
  };
  db.labTests.unshift(lab);
  notify(db, { type: 'lab', message: `${lab.testName} requested for ${lab.patientName} — priority: ${lab.priority.toUpperCase()}`, recipientRole: 'lab_technician', entityId: lab.id, entity: 'lab_test', priority: lab.priority });
  logActivity(db, { userId: payload.actorId, userName: payload.actorName, role: payload.actorRole || 'doctor', action: 'REQUEST_LAB_TEST', entity: 'lab_test', entityId: lab.id, detail: `Requested ${lab.testName} for ${lab.patientName}` });
  saveDB(db);
  return lab;
}
async function updateLabTest(id, payload) {
  await delay();
  const db = loadDB();
  const lab = db.labTests.find((l) => l.id === id);
  if (!lab) throw { status: 404, message: 'Lab test not found' };
  Object.assign(lab, payload);
  saveDB(db);
  return lab;
}
async function deleteLabTest(id) {
  await delay();
  const db = loadDB();
  db.labTests = db.labTests.filter((l) => l.id !== id);
  saveDB(db);
  return { success: true };
}
// convenience wrappers used by dashboards
async function requestLabTest(payload, actor) { return createLabTest({ ...payload, actorId: actor?.id, actorName: actor?.name, actorRole: actor?.role }); }
async function collectSample(id, actor) {
  const db = loadDB();
  const lab = db.labTests.find((l) => l.id === id);
  if (!lab) throw { status: 404, message: 'Lab test not found' };
  lab.status = 'sample_collected';
  lab.sampleCollectedAt = nowISO();
  logActivity(db, { userId: actor?.id, userName: actor?.name, role: actor?.role, action: 'COLLECT_SAMPLE', entity: 'lab_test', entityId: id, detail: `Sample collected for ${lab.testName}` });
  saveDB(db);
  return lab;
}
async function uploadLabReport(id, payload, actor) {
  const db = loadDB();
  const lab = db.labTests.find((l) => l.id === id);
  if (!lab) throw { status: 404, message: 'Lab test not found' };
  lab.status = 'completed';
  lab.result = payload.result || payload.report || '';
  lab.normalRange = payload.normalRange || payload.referenceRange || '';
  lab.reportUrl = payload.reportUrl || '#';
  lab.reportUploadedAt = nowISO();
  lab.tatHours = lab.sampleCollectedAt ? Math.round((Date.now() - new Date(lab.sampleCollectedAt).getTime()) / 36e5) : null;
  logActivity(db, { userId: actor?.id, userName: actor?.name, role: actor?.role, action: 'UPLOAD_LAB_REPORT', entity: 'lab_test', entityId: id, detail: `Uploaded ${lab.testName} report` });
  saveDB(db);
  return lab;
}
async function verifyLabReport(id, actor) {
  const db = loadDB();
  const lab = db.labTests.find((l) => l.id === id);
  if (!lab) throw { status: 404, message: 'Lab test not found' };
  lab.status = 'verified';
  lab.verifiedAt = nowISO();
  saveDB(db);
  return lab;
}
async function approveLabReport(id, actor) {
  const db = loadDB();
  const lab = db.labTests.find((l) => l.id === id);
  if (!lab) throw { status: 404, message: 'Lab test not found' };
  lab.status = 'approved';
  lab.approvedBy = actor?.id || 'u_lab';
  lab.approvedAt = nowISO();
  logActivity(db, { userId: actor?.id, userName: actor?.name, role: actor?.role, action: 'APPROVE_LAB_REPORT', entity: 'lab_test', entityId: id, detail: `Approved ${lab.testName}` });
  saveDB(db);
  return lab;
}
async function rejectLabReport(id, reason, actor) {
  const db = loadDB();
  const lab = db.labTests.find((l) => l.id === id);
  if (!lab) throw { status: 404, message: 'Lab test not found' };
  lab.status = 'rejected';
  lab.notes = reason;
  saveDB(db);
  return lab;
}
async function addLabComment(id, comment, actor) {
  const db = loadDB();
  const lab = db.labTests.find((l) => l.id === id);
  if (!lab) throw { status: 404, message: 'Lab test not found' };
  if (!lab.comments) lab.comments = [];
  lab.comments.push({ text: comment, userName: actor?.name || 'System', role: actor?.role || 'system', createdAt: nowISO() });
  saveDB(db);
  return lab;
}

// ── INVOICES ─────────────────────────────────────────────
async function listInvoices(params = {}) {
  await delay();
  const db = loadDB();
  return paginate(db.invoices, params);
}
async function getInvoice(id) {
  await delay();
  const db = loadDB();
  return db.invoices.find((i) => i.id === id);
}
async function createInvoice(payload) {
  await delay();
  const db = loadDB();
  const patient = db.patients.find((p) => p.id === payload.patientId);
  const items = payload.items || [{ description: payload.description || 'Consultation', amount: payload.amount || payload.total || 0 }];
  const subtotal = payload.subtotal || items.reduce((s, it) => s + (it.amount || 0), 0);
  const tax = payload.tax || Math.round(subtotal * 0.18);
  const total = payload.total || subtotal + tax;
  const invNo = `INV-${String(db.invoices.length + 1).padStart(4, '0')}`;
  const inv = {
    id: uid('inv'),
    invoiceNo: invNo,
    patientId: payload.patientId,
    patientName: patient?.name || payload.patientName || '',
    appointmentId: payload.appointmentId || null,
    items,
    subtotal,
    tax,
    total,
    status: payload.status || 'unpaid',
    method: payload.method || null,
    paidAt: null,
    createdAt: nowISO(),
  };
  db.invoices.unshift(inv);
  logActivity(db, { userId: payload.actorId, userName: payload.actorName, role: payload.actorRole, action: 'CREATE_INVOICE', entity: 'invoice', entityId: inv.id, detail: `Created ${invNo} for ${inv.patientName}` });
  saveDB(db);
  return inv;
}
async function updateInvoice(id, payload) {
  await delay();
  const db = loadDB();
  const inv = db.invoices.find((i) => i.id === id);
  if (!inv) throw { status: 404, message: 'Invoice not found' };
  Object.assign(inv, payload);
  if (payload.status === 'paid' && !inv.paidAt) { inv.paidAt = nowISO(); }
  saveDB(db);
  return inv;
}
async function deleteInvoice(id) {
  await delay();
  const db = loadDB();
  db.invoices = db.invoices.filter((i) => i.id !== id);
  saveDB(db);
  return { success: true };
}
async function listPayments(params = {}) {
  await delay();
  const db = loadDB();
  const payments = db.invoices.filter((i) => i.status === 'paid').map((i) => ({
    id: i.id,
    invoiceNo: i.invoiceNo,
    patientName: i.patientName,
    amount: i.total,
    method: i.method,
    date: i.paidAt,
  }));
  return paginate(payments, params);
}

// ── MEDICINES ────────────────────────────────────────────
async function listMedicines(params = {}) {
  await delay();
  const db = loadDB();
  return paginate(db.medicines, params);
}
async function getMedicine(id) {
  await delay();
  const db = loadDB();
  return db.medicines.find((m) => m.id === id);
}
async function createMedicine(payload) {
  await delay();
  const db = loadDB();
  const med = { id: uid('m'), reorderLevel: 50, ...payload };
  db.medicines.unshift(med);
  saveDB(db);
  return med;
}
async function updateMedicine(id, payload) {
  await delay();
  const db = loadDB();
  const med = db.medicines.find((m) => m.id === id);
  if (!med) throw { status: 404, message: 'Medicine not found' };
  Object.assign(med, payload);
  saveDB(db);
  return med;
}
async function deleteMedicine(id) {
  await delay();
  const db = loadDB();
  db.medicines = db.medicines.filter((m) => m.id !== id);
  saveDB(db);
  return { success: true };
}

// ── BEDS ─────────────────────────────────────────────────
async function listBeds(params = {}) {
  await delay();
  const db = loadDB();
  return paginate(db.beds, params);
}
async function createBed(payload) {
  await delay();
  const db = loadDB();
  const bed = { id: uid('b'), status: 'available', patientId: null, patientName: null, ...payload };
  db.beds.push(bed);
  saveDB(db);
  return bed;
}
async function updateBed(id, payload) {
  await delay();
  const db = loadDB();
  const bed = db.beds.find((b) => b.id === id);
  if (!bed) throw { status: 404, message: 'Bed not found' };
  Object.assign(bed, payload);
  saveDB(db);
  return bed;
}
async function deleteBed(id) {
  await delay();
  const db = loadDB();
  db.beds = db.beds.filter((b) => b.id !== id);
  saveDB(db);
  return { success: true };
}

// ── BLOOD BANK ───────────────────────────────────────────
async function listBloodBank(params = {}) {
  await delay();
  const db = loadDB();
  return paginate(db.bloodBank, params);
}
async function createBloodBankEntry(payload) {
  await delay();
  const db = loadDB();
  const entry = { id: uid('bb'), status: 'good', ...payload };
  db.bloodBank.push(entry);
  saveDB(db);
  return entry;
}
async function updateBloodBankEntry(id, payload) {
  await delay();
  const db = loadDB();
  const entry = db.bloodBank.find((b) => b.id === id);
  if (!entry) throw { status: 404, message: 'Blood bank entry not found' };
  Object.assign(entry, payload);
  saveDB(db);
  return entry;
}
async function deleteBloodBankEntry(id) {
  await delay();
  const db = loadDB();
  db.bloodBank = db.bloodBank.filter((b) => b.id !== id);
  saveDB(db);
  return { success: true };
}

// ── STAFF ────────────────────────────────────────────────
async function listStaff(params = {}) {
  await delay();
  const db = loadDB();
  return paginate(db.staff, params);
}
async function createStaff(payload) {
  await delay();
  const db = loadDB();
  const s = { id: uid('s'), status: 'active', joinedAt: nowISO(), ...payload };
  db.staff.push(s);
  saveDB(db);
  return s;
}
async function updateStaff(id, payload) {
  await delay();
  const db = loadDB();
  const s = db.staff.find((st) => st.id === id);
  if (!s) throw { status: 404, message: 'Staff not found' };
  Object.assign(s, payload);
  saveDB(db);
  return s;
}
async function approveStaff(id, actor) {
  const db = loadDB();
  const s = db.staff.find((st) => st.id === id);
  if (s) { s.status = 'active'; logActivity(db, { userId: actor?.id, userName: actor?.name, role: actor?.role, action: 'APPROVE_STAFF', entity: 'staff', entityId: id, detail: `Approved ${s.name}` }); }
  saveDB(db);
  return s;
}
async function deleteStaff(id) {
  await delay();
  const db = loadDB();
  db.staff = db.staff.filter((s) => s.id !== id);
  saveDB(db);
  return { success: true };
}

// ── NOTIFICATIONS ────────────────────────────────────────
async function listNotificationsFor(role, userId) {
  await delay(80);
  const db = loadDB();
  let notifs = db.notifications.filter((n) =>
    n.recipientRole === role || n.recipientRole === 'all' ||
    (userId && n.recipientId === userId)
  );
  return ok(notifs.slice(0, 30), { total: notifs.length });
}
async function markNotificationRead(id) {
  const db = loadDB();
  const n = db.notifications.find((nn) => nn.id === id);
  if (n) n.read = true;
  saveDB(db);
  return n;
}
async function markAllNotificationsRead(role, userId) {
  const db = loadDB();
  db.notifications.forEach((n) => {
    if (n.recipientRole === role || n.recipientRole === 'all' || (userId && n.recipientId === userId)) n.read = true;
  });
  saveDB(db);
  return { success: true };
}

// ── AUDIT LOGS ────────────────────────────────────────────
async function listAuditLogs(params = {}) {
  await delay();
  const db = loadDB();
  return paginate(db.auditLogs, params);
}

// ── MEDICAL RECORDS ──────────────────────────────────────
async function listMedicalRecords(params = {}) {
  await delay();
  const db = loadDB();
  return paginate(db.medicalRecords || [], params);
}
async function createMedicalRecord(payload) {
  await delay();
  const db = loadDB();
  if (!db.medicalRecords) db.medicalRecords = [];
  const rec = { id: uid('mr'), createdAt: nowISO(), ...payload };
  db.medicalRecords.unshift(rec);
  saveDB(db);
  return rec;
}
async function updateMedicalRecord(id, payload) {
  await delay();
  const db = loadDB();
  const rec = (db.medicalRecords || []).find((r) => r.id === id);
  if (!rec) throw { status: 404, message: 'Record not found' };
  Object.assign(rec, payload);
  saveDB(db);
  return rec;
}
async function deleteMedicalRecord(id) {
  await delay();
  const db = loadDB();
  db.medicalRecords = (db.medicalRecords || []).filter((r) => r.id !== id);
  saveDB(db);
  return { success: true };
}

// ── EQUIPMENT ────────────────────────────────────────────
async function listEquipment(params = {}) {
  await delay();
  const db = loadDB();
  return paginate(db.equipment, params);
}
async function createEquipment(payload) {
  await delay();
  const db = loadDB();
  const eq = { id: uid('eq'), status: 'operational', ...payload };
  db.equipment.push(eq);
  saveDB(db);
  return eq;
}
async function updateEquipment(id, payload) {
  await delay();
  const db = loadDB();
  const eq = db.equipment.find((e) => e.id === id);
  if (!eq) throw { status: 404, message: 'Equipment not found' };
  Object.assign(eq, payload);
  saveDB(db);
  return eq;
}
async function deleteEquipment(id) {
  await delay();
  const db = loadDB();
  db.equipment = db.equipment.filter((e) => e.id !== id);
  saveDB(db);
  return { success: true };
}

// ── AMBULANCES ───────────────────────────────────────────
async function listAmbulances(params = {}) {
  await delay();
  const db = loadDB();
  return paginate(db.ambulances, params);
}
async function createAmbulance(payload) {
  await delay();
  const db = loadDB();
  const amb = { id: uid('amb'), status: 'available', ...payload };
  db.ambulances.push(amb);
  saveDB(db);
  return amb;
}
async function updateAmbulance(id, payload) {
  await delay();
  const db = loadDB();
  const amb = db.ambulances.find((a) => a.id === id);
  if (!amb) throw { status: 404, message: 'Ambulance not found' };
  Object.assign(amb, payload);
  saveDB(db);
  return amb;
}
async function deleteAmbulance(id) {
  await delay();
  const db = loadDB();
  db.ambulances = db.ambulances.filter((a) => a.id !== id);
  saveDB(db);
  return { success: true };
}

// ── NURSE ────────────────────────────────────────────────
async function listNurseAssignments(params = {}) {
  await delay();
  const db = loadDB();
  return paginate(db.nurseAssignments, params);
}
async function createNurseAssignment(payload) {
  await delay();
  const db = loadDB();
  const na = { id: uid('na'), status: 'active', assignedAt: nowISO(), ...payload };
  db.nurseAssignments.push(na);
  saveDB(db);
  return na;
}
async function updateNurseAssignment(id, payload) {
  await delay();
  const db = loadDB();
  const na = db.nurseAssignments.find((n) => n.id === id);
  if (!na) throw { status: 404, message: 'Assignment not found' };
  Object.assign(na, payload);
  saveDB(db);
  return na;
}
async function listVitals(params = {}) {
  await delay();
  const db = loadDB();
  return paginate(db.vitals, params);
}
async function recordVitals(payload) {
  await delay();
  const db = loadDB();
  const patient = db.patients.find((p) => p.id === payload.patientId);
  const v = {
    id: uid('v'),
    patientId: payload.patientId,
    patientName: patient?.name || payload.patientName || '',
    nurseId: payload.nurseId || 'u_nurse',
    nurseName: payload.nurseName || 'Sister Grace Thomas',
    heartRate: payload.heartRate || 0,
    bloodPressure: payload.bloodPressure || '',
    temperature: payload.temperature || 0,
    oxygenSat: payload.oxygenSat || 0,
    respiratoryRate: payload.respiratoryRate || 0,
    recordedAt: nowISO(),
    notes: payload.notes || '',
  };
  db.vitals.unshift(v);
  saveDB(db);
  return v;
}
async function listNurseNotes(params = {}) {
  await delay();
  const db = loadDB();
  return paginate(db.nurseNotes, params);
}
async function addNurseNote(payload) {
  await delay();
  const db = loadDB();
  const patient = db.patients.find((p) => p.id === payload.patientId);
  const note = {
    id: uid('nn'),
    patientId: payload.patientId,
    patientName: patient?.name || payload.patientName || '',
    nurseId: payload.nurseId || 'u_nurse',
    nurseName: payload.nurseName || 'Sister Grace Thomas',
    note: payload.note || '',
    type: payload.type || 'observation',
    severity: payload.severity || 'normal',
    createdAt: nowISO(),
  };
  db.nurseNotes.unshift(note);
  saveDB(db);
  return note;
}

// ── EXPENSES ─────────────────────────────────────────────
async function listExpenses(params = {}) {
  await delay();
  const db = loadDB();
  return paginate(db.expenses, params);
}
async function createExpense(payload) {
  await delay();
  const db = loadDB();
  const exp = { id: uid('exp'), status: 'pending', date: todayISO(), ...payload };
  db.expenses.unshift(exp);
  saveDB(db);
  return exp;
}
async function updateExpense(id, payload) {
  await delay();
  const db = loadDB();
  const exp = db.expenses.find((e) => e.id === id);
  if (!exp) throw { status: 404, message: 'Expense not found' };
  Object.assign(exp, payload);
  saveDB(db);
  return exp;
}
async function deleteExpense(id) {
  await delay();
  const db = loadDB();
  db.expenses = db.expenses.filter((e) => e.id !== id);
  saveDB(db);
  return { success: true };
}

// ── EMERGENCY ─────────────────────────────────────────────
async function getEmergencyStats() {
  await delay();
  const db = loadDB();
  const cases = db.emergencyCases || [];
  return {
    total: cases.length,
    active: cases.filter((c) => !['discharged', 'transferred', 'deceased'].includes(c.status)).length,
    critical: cases.filter((c) => c.priority === 'critical' || c.traumaLevel === 'Level 1').length,
    admitted: cases.filter((c) => c.status === 'admitted').length,
    discharged: cases.filter((c) => c.status === 'discharged').length,
    availableBeds: db.beds.filter((b) => b.status === 'available').length,
    icuBeds: db.beds.filter((b) => b.type === 'ICU').length,
    icuAvailable: db.beds.filter((b) => b.type === 'ICU' && b.status === 'available').length,
    availableAmbulances: db.ambulances.filter((a) => a.status === 'available').length,
    onCallAmbulances: db.ambulances.filter((a) => a.status === 'on_call').length,
  avgWaitTime: '12 min',
  casesToday: cases.filter((c) => c.createdAt && c.createdAt.slice(0, 10) === todayISO()).length,
  byPriority: {
      critical: cases.filter((c) => c.priority === 'critical').length,
      urgent: cases.filter((c) => c.priority === 'urgent').length,
      moderate: cases.filter((c) => c.priority === 'moderate').length,
      minor: cases.filter((c) => c.priority === 'minor').length,
    },
  };
}
async function listEmergencyCases(params = {}) {
  await delay();
  const db = loadDB();
  if (!db.emergencyCases) db.emergencyCases = [];
  return paginate(db.emergencyCases, params);
}
async function getEmergencyCase(id) {
  await delay();
  const db = loadDB();
  return (db.emergencyCases || []).find((c) => c.id === id);
}
async function createEmergencyCase(payload) {
  await delay();
  const db = loadDB();
  if (!db.emergencyCases) db.emergencyCases = [];
  const patient = payload.patientId ? db.patients.find((p) => p.id === payload.patientId) : null;
  const caseNo = `ER-${String(db.emergencyCases.length + 1).padStart(4, '0')}`;
  const ec = {
    id: uid('er'),
    caseNo,
    patientId: payload.patientId || null,
    patientName: payload.patientName || patient?.name || 'Unknown',
    patientAge: payload.patientAge || patient?.age || null,
    patientGender: payload.patientGender || patient?.gender || 'Unknown',
    patientPhone: payload.patientPhone || patient?.phone || '',
    chiefComplaint: payload.chiefComplaint || '',
    traumaLevel: payload.traumaLevel || 'Level 3',
    priority: payload.priority || 'moderate',
    status: payload.status || 'waiting',
    bedId: payload.bedId || null,
    bedNumber: payload.bedNumber || null,
    ambulanceId: payload.ambulanceId || null,
    ambulanceNo: payload.ambulanceNo || null,
    doctorId: payload.doctorId || null,
    doctorName: payload.doctorName || '',
    department: payload.department || 'Emergency',
    vitals: payload.vitals || null,
    notes: payload.notes || [],
    history: payload.history || '',
    arrivalMode: payload.arrivalMode || 'Walk-in',
    arrivalTime: payload.arrivalTime || nowISO(),
    admittedAt: null,
    dischargedAt: null,
    createdAt: nowISO(),
  };
  db.emergencyCases.unshift(ec);
  notify(db, { type: 'emergency', message: `New emergency case ${caseNo} — ${ec.patientName} (${ec.priority.toUpperCase()})`, recipientRole: 'emergency', entityId: ec.id, entity: 'emergency_case', priority: ec.priority === 'critical' ? 'high' : 'normal' });
  logActivity(db, { userId: payload.actorId, userName: payload.actorName, role: payload.actorRole || 'receptionist', action: 'CREATE_EMERGENCY', entity: 'emergency_case', entityId: ec.id, detail: `Registered ${caseNo} for ${ec.patientName}` });
  if (ec.ambulanceId) {
    const amb = db.ambulances.find((a) => a.id === ec.ambulanceId);
    if (amb) amb.status = 'on_call';
  }
  saveDB(db);
  return ec;
}
async function updateEmergencyCase(id, payload) {
  await delay();
  const db = loadDB();
  const ec = (db.emergencyCases || []).find((c) => c.id === id);
  if (!ec) throw { status: 404, message: 'Emergency case not found' };
  Object.assign(ec, payload);
  if (payload.status === 'admitted' && !ec.admittedAt) ec.admittedAt = nowISO();
  if (payload.status === 'discharged' && !ec.dischargedAt) ec.dischargedAt = nowISO();
  if (payload.bedId) {
    const bed = db.beds.find((b) => b.id === payload.bedId);
    if (bed) { bed.status = 'occupied'; bed.patientId = ec.patientId; bed.patientName = ec.patientName; }
  }
  saveDB(db);
  return ec;
}
async function addEmergencyNote(id, text) {
  const db = loadDB();
  const ec = (db.emergencyCases || []).find((c) => c.id === id);
  if (!ec) throw { status: 404, message: 'Emergency case not found' };
  if (!ec.notes) ec.notes = [];
  ec.notes.push({ text, createdAt: nowISO(), author: 'System' });
  saveDB(db);
  return ec;
}
async function deleteEmergencyCase(id) {
  await delay();
  const db = loadDB();
  db.emergencyCases = (db.emergencyCases || []).filter((c) => c.id !== id);
  saveDB(db);
  return { success: true };
}

// ── INSURANCE CLAIMS ──────────────────────────────────────
async function listInsuranceClaims(params = {}) {
  await delay();
  const db = loadDB();
  return paginate(db.insuranceClaims || [], params);
}
async function createInsuranceClaim(payload) {
  await delay();
  const db = loadDB();
  if (!db.insuranceClaims) db.insuranceClaims = [];
  const claim = { id: uid('ic'), status: 'pending', submittedAt: nowISO(), approvedAt: null, approvedAmount: null, ...payload };
  db.insuranceClaims.unshift(claim);
  saveDB(db);
  return claim;
}
async function updateInsuranceClaim(id, payload) {
  await delay();
  const db = loadDB();
  const claim = (db.insuranceClaims || []).find((c) => c.id === id);
  if (!claim) throw { status: 404, message: 'Claim not found' };
  Object.assign(claim, payload);
  saveDB(db);
  return claim;
}
async function deleteInsuranceClaim(id) {
  await delay();
  const db = loadDB();
  db.insuranceClaims = (db.insuranceClaims || []).filter((c) => c.id !== id);
  saveDB(db);
  return { success: true };
}
async function approveInsuranceClaim(id, amount, actor) {
  const db = loadDB();
  const claim = (db.insuranceClaims || []).find((c) => c.id === id);
  if (!claim) throw { status: 404, message: 'Claim not found' };
  claim.status = 'approved';
  claim.approvedAmount = amount || claim.claimAmount;
  claim.approvedAt = nowISO();
  claim.approvedBy = actor?.name;
  saveDB(db);
  return claim;
}

// ── SETTINGS ──────────────────────────────────────────────
async function getSettings() {
  await delay(50);
  const db = loadDB();
  return db.hospitalSettings || {};
}
async function updateSettings(payload) {
  await delay();
  const db = loadDB();
  if (!db.hospitalSettings) db.hospitalSettings = {};
  Object.assign(db.hospitalSettings, payload);
  saveDB(db);
  return db.hospitalSettings;
}

// ── WORKFLOW ─────────────────────────────────────────────
async function getWorkflowStatus() {
  await delay();
  const db = loadDB();
  const a = db.appointments;
  const l = db.labTests;
  const i = db.invoices;
  const stages = [
    { key: 'booked', label: 'Appointment Booked', description: 'Scheduled & confirmed', count: a.filter((x) => x.status === 'scheduled' || x.status === 'confirmed').length },
    { key: 'consulting', label: 'In Consultation', description: 'With doctor right now', count: a.filter((x) => x.status === 'in-progress').length },
    { key: 'lab', label: 'Lab / Investigations', description: 'Tests ordered/in progress', count: l.filter((x) => x.status === 'pending' || x.status === 'sample_collected' || x.status === 'processing').length },
    { key: 'prescription', label: 'Prescription Issued', description: 'Doctor has written prescription', count: db.prescriptions.length },
    { key: 'pharmacy', label: 'At Pharmacy', description: 'Medicines being dispensed', count: db.prescriptions.filter((p) => p.status === 'dispensed').length },
    { key: 'billing', label: 'Billing', description: 'Invoice generated', count: i.filter((x) => x.status === 'unpaid' || x.status === 'partial').length },
    { key: 'discharged', label: 'Discharged', description: 'Payment complete', count: i.filter((x) => x.status === 'paid').length },
  ];
  return { stages, maxCount: Math.max(...stages.map((s) => s.count), 1) };
}

// ── EXPORT ───────────────────────────────────────────────
export const mockApi = {
  // auth
  login, register, googleLogin, getMe, updateProfile, uploadAvatar, removeAvatar, listUsers, updateUser, approveUser, forgotPassword,
  // analytics
  getAnalytics,
  // departments
  listDepartments, getDepartment, createDepartment, updateDepartment, deleteDepartment,
  // doctors
  listDoctors, getDoctor, createDoctor, updateDoctor, deleteDoctor,
  // patients
  listPatients, getPatient, createPatient, updatePatient, deletePatient,
  // appointments
  listAppointments, getAppointment, createAppointment, updateAppointment, deleteAppointment,
  // prescriptions
  listPrescriptions, createPrescription, updatePrescription, deletePrescription,
  // lab tests
  listLabTests, getLabTest, createLabTest, updateLabTest, deleteLabTest,
  requestLabTest, collectSample, uploadLabReport, verifyLabReport, approveLabReport, rejectLabReport, addLabComment,
  // invoices
  listInvoices, getInvoice, createInvoice, updateInvoice, deleteInvoice, listPayments,
  // medicines
  listMedicines, getMedicine, createMedicine, updateMedicine, deleteMedicine,
  // beds
  listBeds, createBed, updateBed, deleteBed,
  // blood bank
  listBloodBank, createBloodBankEntry, updateBloodBankEntry, deleteBloodBankEntry,
  // staff
  listStaff, createStaff, updateStaff, approveStaff, deleteStaff,
  // notifications
  listNotificationsFor, markNotificationRead, markAllNotificationsRead,
  // audit logs
  listAuditLogs,
  // medical records
  listMedicalRecords, createMedicalRecord, updateMedicalRecord, deleteMedicalRecord,
  // equipment
  listEquipment, createEquipment, updateEquipment, deleteEquipment,
  // ambulances
  listAmbulances, createAmbulance, updateAmbulance, deleteAmbulance,
  // nurse
  listNurseAssignments, createNurseAssignment, updateNurseAssignment,
  listVitals, recordVitals, listNurseNotes, addNurseNote,
  // expenses
  listExpenses, createExpense, updateExpense, deleteExpense,
  // emergency
  getEmergencyStats, listEmergencyCases, getEmergencyCase, createEmergencyCase, updateEmergencyCase, addEmergencyNote, deleteEmergencyCase,
  // insurance
  listInsuranceClaims, createInsuranceClaim, updateInsuranceClaim, deleteInsuranceClaim, approveInsuranceClaim,
  // settings
  getSettings, updateSettings,
  // workflow
  getWorkflowStatus,
  // utility
  resetDB,
};

export default mockApi;
