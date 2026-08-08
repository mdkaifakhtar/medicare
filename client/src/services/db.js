// Mock backend data store simulating MongoDB Atlas collections.
// In production this would be replaced by axios calls to the Express API.
import { seedUsers, seedDepartments, seedDoctors, seedPatients, seedAppointments, seedPrescriptions, seedLabTests, seedInvoices, seedMedicines, seedMedicineOrders, seedBeds, seedBloodBank, seedNotifications, seedAuditLogs, seedNurseAssignments, seedVitals, seedNurseNotes, seedEquipment, seedAmbulances, seedExpenses, seedInsuranceClaims, seedStaff } from './seed.js';

// Bump version to reset localStorage when schema changes
const LS_KEY = 'medcare_db_v2';

const initialData = {
  users: seedUsers,
  staff: seedStaff,
  departments: seedDepartments,
  doctors: seedDoctors,
  patients: seedPatients,
  appointments: seedAppointments,
  prescriptions: seedPrescriptions,
  labTests: seedLabTests,
  invoices: seedInvoices,
  payments: [],
  medicines: seedMedicines,
  medicineCategories: [
    { id: 'cat_1', name: 'Analgesic' }, { id: 'cat_2', name: 'Antibiotic' },
    { id: 'cat_3', name: 'Antacid' }, { id: 'cat_4', name: 'Statin' },
    { id: 'cat_5', name: 'Antidiabetic' }, { id: 'cat_6', name: 'Antihypertensive' },
    { id: 'cat_7', name: 'Antihistamine' }, { id: 'cat_8', name: 'Vitamin' },
  ],
  medicineOrders: seedMedicineOrders,
  admissions: [],
  rooms: [
    { id: 'r_1', number: '101', type: 'General', floor: 1, status: 'available', dailyRate: 2000 },
    { id: 'r_2', number: '201', type: 'Private', floor: 2, status: 'occupied', dailyRate: 5000 },
    { id: 'r_3', number: '301', type: 'Deluxe', floor: 3, status: 'available', dailyRate: 8000 },
    { id: 'r_4', number: 'ICU-1', type: 'ICU', floor: 4, status: 'occupied', dailyRate: 12000 },
  ],
  beds: seedBeds,
  wards: [
    { id: 'w_1', name: 'General Ward A', floor: 2, beds: 20, occupied: 16, type: 'General' },
    { id: 'w_2', name: 'General Ward B', floor: 2, beds: 20, occupied: 18, type: 'General' },
    { id: 'w_3', name: 'Private Ward', floor: 3, beds: 15, occupied: 11, type: 'Private' },
    { id: 'w_4', name: 'ICU', floor: 4, beds: 12, occupied: 10, type: 'ICU' },
    { id: 'w_5', name: 'NICU', floor: 5, beds: 8, occupied: 5, type: 'NICU' },
    { id: 'w_6', name: 'Post-Op Ward', floor: 3, beds: 10, occupied: 7, type: 'Surgical' },
  ],
  bloodBank: seedBloodBank,
  bloodDonations: [],
  medicalRecords: [],
  notifications: seedNotifications,
  auditLogs: seedAuditLogs,
  attendance: [],
  leaves: [],
  nurseAssignments: seedNurseAssignments,
  vitals: seedVitals,
  nurseNotes: seedNurseNotes,
  equipment: seedEquipment,
  ambulances: seedAmbulances,
  expenses: seedExpenses,
  insuranceClaims: seedInsuranceClaims,
  emergencyCases: [
    { id: 'er_1', caseNo: 'ER-0001', patientId: 'p_5', patientName: 'Mohammed Ali', patientAge: 67, patientGender: 'Male', patientPhone: '+91 90000 10014', chiefComplaint: 'Severe chest pain, radiating to left arm', traumaLevel: 'Level 1', priority: 'critical', status: 'admitted', bedId: 'b_3', bedNumber: 'ICU-01', ambulanceId: 'amb_1', ambulanceNo: 'KA-01-A-1001', doctorId: 'd_1', doctorName: 'Dr. Ananya Rao', department: 'dep_1', vitals: { heartRate: 95, bloodPressure: '160/100', temperature: 98.4, oxygenSat: 94 }, notes: [{ text: 'Patient brought in via ambulance. STEMI suspected.', createdAt: '2024-06-19T08:30:00Z', author: 'Dr. Ananya Rao' }, { text: 'Cath lab activated. PCI scheduled.', createdAt: '2024-06-19T09:00:00Z', author: 'Dr. Ananya Rao' }], history: 'Known CAD, Hypertension. On Aspirin, Telmisartan.', arrivalMode: 'Ambulance', arrivalTime: '2024-06-19T08:15:00Z', admittedAt: '2024-06-19T08:45:00Z', dischargedAt: null, createdAt: '2024-06-19T08:15:00Z' },
    { id: 'er_2', caseNo: 'ER-0002', patientId: null, patientName: 'Unknown Male (approx 40)', patientAge: 40, patientGender: 'Male', patientPhone: '', chiefComplaint: 'MVA - multiple injuries, unconscious', traumaLevel: 'Level 2', priority: 'critical', status: 'admitted', bedId: 'b_4', bedNumber: 'ICU-02', ambulanceId: 'amb_2', ambulanceNo: 'KA-01-A-1002', doctorId: 'd_2', doctorName: 'Dr. Vikram Singh', department: 'dep_8', vitals: { heartRate: 110, bloodPressure: '90/60', temperature: 96.8, oxygenSat: 88 }, notes: [{ text: 'RTA victim, GCS 8. Intubated on scene.', createdAt: '2024-06-19T10:00:00Z', author: 'Dr. Vikram Singh' }], history: 'Unknown - no ID found.', arrivalMode: 'Ambulance', arrivalTime: '2024-06-19T09:45:00Z', admittedAt: '2024-06-19T10:15:00Z', dischargedAt: null, createdAt: '2024-06-19T09:45:00Z' },
    { id: 'er_3', caseNo: 'ER-0003', patientId: 'p_4', patientName: 'Kavya Reddy', patientAge: 41, patientGender: 'Female', patientPhone: '+91 90000 10013', chiefComplaint: 'Acute asthma attack, not responding to inhaler', traumaLevel: 'Level 3', priority: 'urgent', status: 'in_progress', bedId: null, bedNumber: null, ambulanceId: null, ambulanceNo: null, doctorId: 'd_4', doctorName: 'Dr. Lakshmi Iyer', department: 'dep_4', vitals: { heartRate: 102, bloodPressure: '130/85', temperature: 98.6, oxygenSat: 91 }, notes: [{ text: 'Nebulization started. IV steroids given.', createdAt: '2024-06-19T11:00:00Z', author: 'Dr. Lakshmi Iyer' }], history: 'Chronic asthma. Uses Foracort inhaler.', arrivalMode: 'Walk-in', arrivalTime: '2024-06-19T10:50:00Z', admittedAt: null, dischargedAt: null, createdAt: '2024-06-19T10:50:00Z' },
    { id: 'er_4', caseNo: 'ER-0004', patientId: null, patientName: 'Sunil Kumar', patientAge: 35, patientGender: 'Male', patientPhone: '+91 90000 50001', chiefComplaint: 'Severe abdominal pain, vomiting', traumaLevel: 'Level 4', priority: 'moderate', status: 'waiting', bedId: null, bedNumber: null, ambulanceId: null, ambulanceNo: null, doctorId: null, doctorName: '', department: 'dep_8', vitals: { heartRate: 88, bloodPressure: '120/80', temperature: 100.2, oxygenSat: 98 }, notes: [], history: 'No known chronic conditions.', arrivalMode: 'Walk-in', arrivalTime: '2024-06-19T11:20:00Z', admittedAt: null, dischargedAt: null, createdAt: '2024-06-19T11:20:00Z' },
    { id: 'er_5', caseNo: 'ER-0005', patientId: 'p_2', patientName: 'Fatima Sheikh', patientAge: 28, patientGender: 'Female', patientPhone: '+91 90000 10011', chiefComplaint: 'Minor laceration on hand from kitchen accident', traumaLevel: 'Level 5', priority: 'minor', status: 'discharged', bedId: null, bedNumber: null, ambulanceId: null, ambulanceNo: null, doctorId: 'd_5', doctorName: 'Dr. Deepa Menon', department: 'dep_5', vitals: { heartRate: 75, bloodPressure: '110/70', temperature: 98.4, oxygenSat: 99 }, notes: [{ text: 'Wound cleaned and sutured. TT given.', createdAt: '2024-06-18T14:00:00Z', author: 'Dr. Deepa Menon' }], history: '28 weeks pregnant. Otherwise healthy.', arrivalMode: 'Walk-in', arrivalTime: '2024-06-18T13:30:00Z', admittedAt: null, dischargedAt: '2024-06-18T15:00:00Z', createdAt: '2024-06-18T13:30:00Z' },
  ],
  hospitalSettings: {
    name: 'MedCare Multispecialty Hospital',
    tagline: 'Compassion. Innovation. Excellence.',
    address: '214 Wellness Avenue, Medical District, Bengaluru 560001',
    phone: '+91 80 4000 8000',
    emergency: '1066',
    email: 'care@medcare.health',
    website: 'https://medcare.health',
    established: 1998,
    registrationNo: 'KMC-1998-0421',
    gstin: '29AABCM1234L1Z5',
    taxRate: 18,
    currency: 'INR',
  },
};

export function loadDB() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) {
      localStorage.setItem(LS_KEY, JSON.stringify(initialData));
      return structuredClone(initialData);
    }
    return JSON.parse(raw);
  } catch {
    return structuredClone(initialData);
  }
}

export function saveDB(db) {
  localStorage.setItem(LS_KEY, JSON.stringify(db));
}

export function resetDB() {
  localStorage.removeItem(LS_KEY);
  return loadDB();
}

export function uid(prefix = 'id') {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36).slice(-4)}`;
}

// Helper: create notification + audit log atomically
export function logActivity(db, { userId, userName, role, action, entity, entityId, detail, visibility = 'all' }) {
  const ts = new Date().toISOString();
  const log = { id: uid('log'), userId, userName, role, action, entity, entityId, detail, timestamp: ts, visibility };
  db.auditLogs.unshift(log);
  return log;
}

export function notify(db, { type, message, recipientRole, recipientId, entityId, entity, priority = 'normal' }) {
  const n = { id: uid('n'), type, message, recipientRole, recipientId, entityId, entity, priority, read: false, createdAt: new Date().toISOString() };
  db.notifications.unshift(n);
  return n;
}
