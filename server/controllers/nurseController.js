import NurseAssignment from '../models/NurseAssignment.js';
import Vitals from '../models/Vitals.js';
import NurseNote from '../models/NurseNote.js';
import Notification from '../models/Notification.js';

export const listAssignments = async (req, res) => {
  const { nurseId, page = 1, limit = 50 } = req.query;
  const filter = {};
  if (nurseId) filter.nurseId = nurseId;
  const skip = (Number(page) - 1) * Number(limit);
  const items = await NurseAssignment.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit));
  const total = await NurseAssignment.countDocuments(filter);
  res.json({ items, total, page: Number(page), limit: Number(limit), totalPages: Math.max(1, Math.ceil(total / Number(limit))) });
};

export const createAssignment = async (req, res) => {
  const a = await NurseAssignment.create(req.body);
  res.status(201).json(a);
};

export const updateAssignment = async (req, res) => {
  const a = await NurseAssignment.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!a) return res.status(404).json({ message: 'Assignment not found' });
  res.json(a);
};

export const listVitals = async (req, res) => {
  const { patientId, page = 1, limit = 50 } = req.query;
  const filter = {};
  if (patientId) filter.patient = patientId;
  const skip = (Number(page) - 1) * Number(limit);
  const items = await Vitals.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit));
  const total = await Vitals.countDocuments(filter);
  res.json({ items, total, page: Number(page), limit: Number(limit), totalPages: Math.max(1, Math.ceil(total / Number(limit))) });
};

export const recordVitals = async (req, res) => {
  const v = await Vitals.create({ ...req.body, recordedBy: req.user._id, recordedByName: req.user.name });
  if (v.isAbnormal) {
    await Notification.create({ recipientRole: 'doctor', recipientId: req.body.doctorId || null, type: 'alert', title: 'Abnormal Vitals Alert', message: `Abnormal vitals recorded for ${v.patientName}`, priority: 'critical', link: '/dashboard/patients' });
  }
  res.status(201).json(v);
};

export const listNotes = async (req, res) => {
  const { patientId, page = 1, limit = 50 } = req.query;
  const filter = {};
  if (patientId) filter.patient = patientId;
  const skip = (Number(page) - 1) * Number(limit);
  const items = await NurseNote.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit));
  const total = await NurseNote.countDocuments(filter);
  res.json({ items, total, page: Number(page), limit: Number(limit), totalPages: Math.max(1, Math.ceil(total / Number(limit))) });
};

export const addNote = async (req, res) => {
  const n = await NurseNote.create({ ...req.body, nurseId: req.user._id, nurseName: req.user.name });
  res.status(201).json(n);
};
