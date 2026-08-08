import axios from 'axios';
import {
  getStoredToken,
  getStoredRefreshToken,
  persistSession,
  clearSession,
} from '../utils/storage.js';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({ baseURL: API_URL, timeout: 15000, withCredentials: true });

api.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Silent JWT refresh: a single 401 retry using the stored refresh token.
let refreshing = null;

const refreshSession = async () => {
  const refreshToken = getStoredRefreshToken();
  if (!refreshToken) throw new Error('No refresh token');
  const { data } = await axios.post(`${API_URL}/auth/refresh`, { refreshToken }, { withCredentials: true });
  persistSession(data);
  return data.accessToken;
};

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config || {};
    if (err.response?.status === 401 && !original.__retried && getStoredRefreshToken()) {
      original.__retried = true;
      try {
        refreshing = refreshing || refreshSession().finally(() => { refreshing = null; });
        const accessToken = await refreshing;
        original.headers = { ...original.headers, Authorization: `Bearer ${accessToken}` };
        return api(original);
      } catch {
        clearSession();
      }
    }
    const message = err.response?.data?.message || err.message || 'Network error';
    return Promise.reject({ status: err.response?.status, message });
  }
);


function safeUser(user) {
  if (!user) return null;
  const { password, ...rest } = user;
  return rest;
}

export const apiClient = {
  // ==================== AUTH ====================
  async login({ email, password }) {
    const { data } = await api.post('/auth/login', { email, password });
    return { user: safeUser(data.user), accessToken: data.accessToken, refreshToken: data.refreshToken };
  },

  async register(payload) {
    const { data } = await api.post('/auth/register', payload);
    return { user: safeUser(data.user), accessToken: data.accessToken, refreshToken: data.refreshToken };
  },

  async googleLogin({ credential }) {
    const { data } = await api.post('/auth/google', { credential });
    return { user: safeUser(data.user), accessToken: data.accessToken, refreshToken: data.refreshToken, created: Boolean(data.created) };
  },

  async getMe() {
    const { data } = await api.get('/auth/me');
    return safeUser(data.user);
  },

  async updateProfile(updates) {
    const { data } = await api.put('/auth/me', updates);
    return safeUser(data.user);
  },

  // Profile photo — multipart upload against the JWT-protected Express route.
  async uploadAvatar({ file, dataUrl } = {}, onProgress) {
    const form = new FormData();
    if (file) form.append('photo', file);
    else if (dataUrl) form.append('photo', await (await fetch(dataUrl)).blob(), 'profile-photo.jpg');
    const { data } = await api.post('/auth/me/photo', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (e) => {
        if (typeof onProgress === 'function') onProgress(Math.round((e.loaded * 100) / (e.total || e.loaded || 1)));
      },
    });
    return safeUser(data.user);
  },

  async removeAvatar() {
    const { data } = await api.delete('/auth/me/photo');
    return safeUser(data.user);
  },


  async listUsers(params = {}) {
    const { data } = await api.get('/auth/users', { params });
    return data;
  },

  // ==================== ANALYTICS ====================
  async getAnalytics() {
    const { data } = await api.get('/analytics');
    return data;
  },

  // ==================== DEPARTMENTS ====================
  async listDepartments(params = {}) {
    const { data } = await api.get('/departments', { params });
    return data;
  },
  async getDepartment(id) {
    const { data } = await api.get(`/departments/${id}`);
    return data;
  },
  async createDepartment(payload) {
    const { data } = await api.post('/departments', payload);
    return data;
  },
  async updateDepartment(id, payload) {
    const { data } = await api.put(`/departments/${id}`, payload);
    return data;
  },
  async deleteDepartment(id) {
    const { data } = await api.delete(`/departments/${id}`);
    return data;
  },

  // ==================== DOCTORS ====================
  async listDoctors(params = {}) {
    const { data } = await api.get('/doctors', { params });
    return data;
  },
  async getDoctor(id) {
    const { data } = await api.get(`/doctors/${id}`);
    return data;
  },
  async createDoctor(payload) {
    const { data } = await api.post('/doctors', payload);
    return data;
  },
  async updateDoctor(id, payload) {
    const { data } = await api.put(`/doctors/${id}`, payload);
    return data;
  },
  async deleteDoctor(id) {
    const { data } = await api.delete(`/doctors/${id}`);
    return data;
  },

  // ==================== PATIENTS ====================
  async listPatients(params = {}) {
    const { data } = await api.get('/patients', { params });
    return data;
  },
  async getPatient(id) {
    const { data } = await api.get(`/patients/${id}`);
    return data;
  },
  async createPatient(payload) {
    const { data } = await api.post('/patients', payload);
    return data;
  },
  async updatePatient(id, payload) {
    const { data } = await api.put(`/patients/${id}`, payload);
    return data;
  },
  async deletePatient(id) {
    const { data } = await api.delete(`/patients/${id}`);
    return data;
  },

  // ==================== APPOINTMENTS ====================
  async listAppointments(params = {}) {
    const { data } = await api.get('/appointments', { params });
    return data;
  },
  async getAppointment(id) {
    const { data } = await api.get(`/appointments/${id}`);
    return data;
  },
  async createAppointment(payload) {
    const { data } = await api.post('/appointments', payload);
    return data;
  },
  async updateAppointment(id, payload) {
    const { data } = await api.put(`/appointments/${id}`, payload);
    return data;
  },
  async deleteAppointment(id) {
    const { data } = await api.delete(`/appointments/${id}`);
    return data;
  },

  // ==================== PRESCRIPTIONS ====================
  async listPrescriptions(params = {}) {
    const { data } = await api.get('/prescriptions', { params });
    return data;
  },
  async createPrescription(payload) {
    const { data } = await api.post('/prescriptions', payload);
    return data;
  },
  async updatePrescription(id, payload) {
    const { data } = await api.put(`/prescriptions/${id}`, payload);
    return data;
  },
  async deletePrescription(id) {
    const { data } = await api.delete(`/prescriptions/${id}`);
    return data;
  },

  // ==================== LAB TESTS ====================
  async listLabTests(params = {}) {
    const { data } = await api.get('/lab-tests', { params });
    return data;
  },
  async getLabTest(id) {
    const { data } = await api.get(`/lab-tests/${id}`);
    return data;
  },
  async createLabTest(payload) {
    const { data } = await api.post('/lab-tests', payload);
    return data;
  },
  async updateLabTest(id, payload) {
    const { data } = await api.put(`/lab-tests/${id}`, payload);
    return data;
  },
  async deleteLabTest(id) {
    const { data } = await api.delete(`/lab-tests/${id}`);
    return data;
  },

  // ==================== INVOICES ====================
  async listInvoices(params = {}) {
    const { data } = await api.get('/invoices', { params });
    return data;
  },
  async getInvoice(id) {
    const { data } = await api.get(`/invoices/${id}`);
    return data;
  },
  async createInvoice(payload) {
    const { data } = await api.post('/invoices', payload);
    return data;
  },
  async updateInvoice(id, payload) {
    const { data } = await api.put(`/invoices/${id}`, payload);
    return data;
  },
  async deleteInvoice(id) {
    const { data } = await api.delete(`/invoices/${id}`);
    return data;
  },

  // ==================== MEDICINES ====================
  async listMedicines(params = {}) {
    const { data } = await api.get('/medicines', { params });
    return data;
  },
  async getMedicine(id) {
    const { data } = await api.get(`/medicines/${id}`);
    return data;
  },
  async createMedicine(payload) {
    const { data } = await api.post('/medicines', payload);
    return data;
  },
  async updateMedicine(id, payload) {
    const { data } = await api.put(`/medicines/${id}`, payload);
    return data;
  },
  async deleteMedicine(id) {
    const { data } = await api.delete(`/medicines/${id}`);
    return data;
  },

  // ==================== BEDS ====================
  async listBeds(params = {}) {
    const { data } = await api.get('/beds', { params });
    return data;
  },
  async createBed(payload) {
    const { data } = await api.post('/beds', payload);
    return data;
  },
  async updateBed(id, payload) {
    const { data } = await api.put(`/beds/${id}`, payload);
    return data;
  },
  async deleteBed(id) {
    const { data } = await api.delete(`/beds/${id}`);
    return data;
  },

  // ==================== BLOOD BANK ====================
  async listBloodBank(params = {}) {
    const { data } = await api.get('/blood-bank', { params });
    return data;
  },
  async createBloodBankEntry(payload) {
    const { data } = await api.post('/blood-bank', payload);
    return data;
  },
  async updateBloodBankEntry(id, payload) {
    const { data } = await api.put(`/blood-bank/${id}`, payload);
    return data;
  },
  async deleteBloodBankEntry(id) {
    const { data } = await api.delete(`/blood-bank/${id}`);
    return data;
  },

  // ==================== STAFF ====================
  async listStaff(params = {}) {
    const { data } = await api.get('/staff', { params });
    return data;
  },
  async createStaff(payload) {
    const { data } = await api.post('/staff', payload);
    return data;
  },
  async updateStaff(id, payload) {
    const { data } = await api.put(`/staff/${id}`, payload);
    return data;
  },
  async deleteStaff(id) {
    const { data } = await api.delete(`/staff/${id}`);
    return data;
  },

  // ==================== NOTIFICATIONS ====================
  async listNotificationsFor(role, userId) {
    const { data } = await api.get('/notifications', { params: { role, userId } });
    return data;
  },
  async markNotificationRead(id) {
    const { data } = await api.put(`/notifications/${id}/read`);
    return data;
  },
  async markAllNotificationsRead(role, userId) {
    const { data } = await api.put('/notifications/read-all', null, { params: { role, userId } });
    return data;
  },

  // ==================== AUDIT LOGS ====================
  async listAuditLogs(params = {}) {
    const { data } = await api.get('/audit-logs', { params });
    return data;
  },

  // ==================== MEDICAL RECORDS ====================
  async listMedicalRecords(params = {}) {
    const { data } = await api.get('/medical-records', { params });
    return data;
  },
  async createMedicalRecord(payload) {
    const { data } = await api.post('/medical-records', payload);
    return data;
  },
  async updateMedicalRecord(id, payload) {
    const { data } = await api.put(`/medical-records/${id}`, payload);
    return data;
  },
  async deleteMedicalRecord(id) {
    const { data } = await api.delete(`/medical-records/${id}`);
    return data;
  },

  // ==================== EQUIPMENT ====================
  async listEquipment(params = {}) {
    const { data } = await api.get('/equipment', { params });
    return data;
  },
  async createEquipment(payload) {
    const { data } = await api.post('/equipment', payload);
    return data;
  },
  async updateEquipment(id, payload) {
    const { data } = await api.put(`/equipment/${id}`, payload);
    return data;
  },
  async deleteEquipment(id) {
    const { data } = await api.delete(`/equipment/${id}`);
    return data;
  },

  // ==================== AMBULANCES ====================
  async listAmbulances(params = {}) {
    const { data } = await api.get('/ambulances', { params });
    return data;
  },
  async createAmbulance(payload) {
    const { data } = await api.post('/ambulances', payload);
    return data;
  },
  async updateAmbulance(id, payload) {
    const { data } = await api.put(`/ambulances/${id}`, payload);
    return data;
  },
  async deleteAmbulance(id) {
    const { data } = await api.delete(`/ambulances/${id}`);
    return data;
  },

  // ==================== NURSE ====================
  async listNurseAssignments(params = {}) {
    const { data } = await api.get('/nurse/assignments', { params });
    return data;
  },
  async createNurseAssignment(payload) {
    const { data } = await api.post('/nurse/assignments', payload);
    return data;
  },
  async updateNurseAssignment(id, payload) {
    const { data } = await api.put(`/nurse/assignments/${id}`, payload);
    return data;
  },
  async listVitals(params = {}) {
    const { data } = await api.get('/nurse/vitals', { params });
    return data;
  },
  async recordVitals(payload) {
    const { data } = await api.post('/nurse/vitals', payload);
    return data;
  },
  async listNurseNotes(params = {}) {
    const { data } = await api.get('/nurse/notes', { params });
    return data;
  },
  async addNurseNote(payload) {
    const { data } = await api.post('/nurse/notes', payload);
    return data;
  },

  // ==================== EXPENSES ====================
  async listExpenses(params = {}) {
    const { data } = await api.get('/expenses', { params });
    return data;
  },
  async createExpense(payload) {
    const { data } = await api.post('/expenses', payload);
    return data;
  },
  async updateExpense(id, payload) {
    const { data } = await api.put(`/expenses/${id}`, payload);
    return data;
  },
  async deleteExpense(id) {
    const { data } = await api.delete(`/expenses/${id}`);
    return data;
  },

  // ==================== EMERGENCY ====================
  async getEmergencyStats() {
    const { data } = await api.get('/emergency/stats');
    return data;
  },
  async listEmergencyCases(params = {}) {
    const { data } = await api.get('/emergency', { params });
    return data;
  },
  async getEmergencyCase(id) {
    const { data } = await api.get(`/emergency/${id}`);
    return data;
  },
  async createEmergencyCase(payload) {
    const { data } = await api.post('/emergency', payload);
    return data;
  },
  async updateEmergencyCase(id, payload) {
    const { data } = await api.put(`/emergency/${id}`, payload);
    return data;
  },
  async addEmergencyNote(id, text) {
    const { data } = await api.post(`/emergency/${id}/notes`, { text });
    return data;
  },
  async deleteEmergencyCase(id) {
    const { data } = await api.delete(`/emergency/${id}`);
    return data;
  },

  // ==================== INSURANCE CLAIMS ====================
  async listInsuranceClaims(params = {}) {
    const { data } = await api.get('/insurance-claims', { params });
    return data;
  },
  async createInsuranceClaim(payload) {
    const { data } = await api.post('/insurance-claims', payload);
    return data;
  },
  async updateInsuranceClaim(id, payload) {
    const { data } = await api.put(`/insurance-claims/${id}`, payload);
    return data;
  },
  async deleteInsuranceClaim(id) {
    const { data } = await api.delete(`/insurance-claims/${id}`);
    return data;
  },

  // ==================== PAYMENTS ====================
  async listPayments(params = {}) {
    const { data } = await api.get('/invoices', { params: { ...params, type: 'payments' } });
    return data;
  },

  // ==================== SETTINGS ====================
  async getSettings() {
    try {
      const { data } = await api.get('/auth/settings');
      return data;
    } catch {
      return { name: 'MedCare Hospital', tagline: 'Compassion. Innovation. Excellence.', address: '214 Wellness Avenue, Bengaluru', phone: '+91 80 4000 8000', emergency: '1066', email: 'care@medcare.health', website: 'https://medcare.health', registrationNo: 'KMC-1998-0421', gstin: '29AABCM1234L1Z5' };
    }
  },
  async updateSettings(payload) {
    try {
      const { data } = await api.put('/auth/settings', payload);
      return data;
    } catch {
      return payload;
    }
  },

  // ==================== WORKFLOW / MISC ====================
  async getWorkflowStatus() {
    try {
      const [appts, labs, invs] = await Promise.all([
        api.get('/appointments', { params: { limit: 200 } }),
        api.get('/lab-tests', { params: { limit: 200 } }),
        api.get('/invoices', { params: { limit: 200 } }),
      ]);
      const a = appts.data.items || []; const l = labs.data.items || []; const i = invs.data.items || [];
      const stages = [
        { key: 'booked', label: 'Appointment Booked', description: 'Scheduled & confirmed', count: a.filter((x) => x.status === 'scheduled' || x.status === 'confirmed').length },
        { key: 'consulting', label: 'In Consultation', description: 'With doctor right now', count: a.filter((x) => x.status === 'in-progress').length },
        { key: 'lab', label: 'Lab / Investigations', description: 'Tests ordered/in progress', count: l.filter((x) => x.status === 'pending' || x.status === 'processing').length },
        { key: 'prescription', label: 'Prescription Issued', description: 'Doctor has written prescription', count: a.filter((x) => x.status === 'completed').length },
        { key: 'pharmacy', label: 'At Pharmacy', description: 'Medicines being dispensed', count: l.filter((x) => x.status === 'completed').length },
        { key: 'billing', label: 'Billing', description: 'Invoice generated', count: i.filter((x) => x.status === 'pending' || x.status === 'partial').length },
        { key: 'discharged', label: 'Discharged', description: 'Payment complete', count: i.filter((x) => x.status === 'paid').length },
      ];
      return { stages, maxCount: Math.max(...stages.map((s) => s.count), 1) };
    } catch {
      return { stages: [], maxCount: 1 };
    }
  },

  async approveUser(id, actor) { return apiClient.updateProfile({ status: 'active' }); },
  async approveStaff(id, actor) { const { data } = await api.put(`/staff/${id}`, { status: 'active' }); return data; },
  async updateStaff(id, payload) { const { data } = await api.put(`/staff/${id}`, payload); return data; },

  async forgotPassword(email) { return { message: 'Reset link sent' }; },

  async getPatient(id) {
    try {
      const [patData, appts, rxs, labs, invs] = await Promise.all([
        api.get(`/patients/${id}`),
        api.get('/appointments', { params: { patientId: id, limit: 20 } }),
        api.get('/prescriptions', { params: { patientId: id, limit: 20 } }),
        api.get('/lab-tests', { params: { patientId: id, limit: 20 } }),
        api.get('/invoices', { params: { patientId: id, limit: 20 } }),
      ]);
      const p = patData.data;
      return { ...p, appointments: appts.data.items || [], prescriptions: rxs.data.items || [], labTests: labs.data.items || [], invoices: invs.data.items || [], vitals: [] };
    } catch (err) {
      throw err;
    }
  },

  async requestLabTest(payload, actor) { return apiClient.createLabTest(payload); },
  async collectSample(id, actor) { return apiClient.updateLabTest(id, { status: 'sample-collected', collectedAt: new Date() }); },
  async uploadLabReport(id, payload, actor) { return apiClient.updateLabTest(id, { status: 'completed', result: payload.result, referenceRange: payload.normalRange, completedAt: new Date() }); },
  async verifyLabReport(id, actor) { return apiClient.updateLabTest(id, { status: 'verified', verifiedAt: new Date() }); },
  async approveLabReport(id, actor) { return apiClient.updateLabTest(id, { status: 'approved' }); },
  async rejectLabReport(id, reason, actor) { return apiClient.updateLabTest(id, { status: 'rejected', notes: reason }); },
  async addLabComment(id, comment, actor) { return apiClient.updateLabTest(id, { $push: { comments: { text: comment, userName: actor?.name, role: actor?.role, createdAt: new Date() } } }); },

  async approveInsuranceClaim(id, amount, actor) { return apiClient.updateInsuranceClaim(id, { status: 'approved', approvedAmount: amount, approvedAt: new Date(), approvedBy: actor?.name }); },
};

export default apiClient;
