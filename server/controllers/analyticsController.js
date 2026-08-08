import User from '../models/User.js';
import Patient from '../models/Patient.js';
import Doctor from '../models/Doctor.js';
import Appointment from '../models/Appointment.js';
import LabTest from '../models/LabTest.js';
import Invoice from '../models/Invoice.js';
import Medicine from '../models/Medicine.js';
import Bed from '../models/Bed.js';
import Staff from '../models/Staff.js';
import Prescription from '../models/Prescription.js';
import Expense from '../models/Expense.js';
import AuditLog from '../models/AuditLog.js';

export const getAnalytics = async (req, res) => {
  const [
    totalPatients, totalDoctors, totalAppointments, pendingAppointments,
    totalLabTests, pendingLabTests, totalInvoices, pendingInvoices,
    totalMedicines, lowStockMeds, totalBeds, occupiedBeds,
    totalStaff, pendingStaff, activePrescriptions, totalExpenses,
    totalRevenue, recentLogs,
  ] = await Promise.all([
    Patient.countDocuments({}),
    Doctor.countDocuments({}),
    Appointment.countDocuments({}),
    Appointment.countDocuments({ status: { $in: ['scheduled', 'confirmed'] } }),
    LabTest.countDocuments({}),
    LabTest.countDocuments({ status: { $in: ['pending', 'sample-collected', 'processing'] } }),
    Invoice.countDocuments({}),
    Invoice.countDocuments({ status: { $in: ['pending', 'partial', 'overdue'] } }),
    Medicine.countDocuments({}),
    Medicine.countDocuments({ stock: { $lt: 20 } }),
    Bed.countDocuments({}),
    Bed.countDocuments({ status: 'occupied' }),
    Staff.countDocuments({}),
    Staff.countDocuments({ status: 'pending' }),
    Prescription.countDocuments({ status: 'active' }),
    Expense.aggregate([{ $group: { _id: null, total: { $sum: '$amount' } } }]),
    Invoice.aggregate([{ $match: { status: 'paid' }, $group: { _id: null, total: { $sum: 'paidAmount' } } }]),
    AuditLog.find({}).sort({ createdAt: -1 }).limit(10),
  ]);

  res.json({
    stats: {
      totalPatients, totalDoctors, totalAppointments, pendingAppointments,
      totalLabTests, pendingLabTests, totalInvoices, pendingInvoices,
      totalMedicines, lowStockMeds, totalBeds, occupiedBeds,
      totalStaff, pendingStaff, activePrescriptions,
      totalExpenses: totalExpenses[0]?.total || 0,
      totalRevenue: totalRevenue[0]?.total || 0,
    },
    recentLogs,
  });
};
