import EmergencyCase from '../models/EmergencyCase.js';
import Bed from '../models/Bed.js';
import Notification from '../models/Notification.js';
import AuditLog from '../models/AuditLog.js';

let caseCounter = 1000;

async function generateCaseNumber() {
  const last = await EmergencyCase.findOne({}).sort({ createdAt: -1 });
  if (last && last.caseNumber) {
    const num = parseInt(last.caseNumber.replace('ER-', ''), 10);
    if (!isNaN(num)) return `ER-${num + 1}`;
  }
  return `ER-${++caseCounter}`;
}

export const list = async (req, res) => {
  const { search, status, traumaLevel, page = 1, limit = 50 } = req.query;
  const filter = {};
  if (status) filter.status = status;
  if (traumaLevel) filter.traumaLevel = traumaLevel;
  if (search) filter.patientName = { $regex: search, $options: 'i' };
  const skip = (Number(page) - 1) * Number(limit);
  const items = await EmergencyCase.find(filter).sort({ arrivedAt: -1 }).skip(skip).limit(Number(limit));
  const total = await EmergencyCase.countDocuments(filter);
  res.json({ items, total, page: Number(page), limit: Number(limit), totalPages: Math.max(1, Math.ceil(total / Number(limit))) });
};

export const getById = async (req, res) => {
  const ec = await EmergencyCase.findById(req.params.id);
  if (!ec) return res.status(404).json({ message: 'Emergency case not found' });
  res.json(ec);
};

export const create = async (req, res) => {
  const caseNumber = await generateCaseNumber();
  const ec = await EmergencyCase.create({ ...req.body, caseNumber });
  await Notification.create({
    recipientRole: 'doctor',
    type: 'emergency',
    title: `Emergency: ${ec.traumaLevel}`,
    message: `New emergency case ${caseNumber} — ${ec.patientName}: ${ec.chiefComplaint}`,
    priority: ec.traumaLevel.startsWith('Level 1') || ec.traumaLevel.startsWith('Level 2') ? 'critical' : 'high',
    link: '/dashboard/emergency',
  });
  await AuditLog.create({ userName: req.user?.name || 'Staff', role: req.user?.role || 'staff', action: 'CREATE_EMERGENCY_CASE', entity: 'emergency', entityId: String(ec._id), detail: `Emergency case ${caseNumber} created for ${ec.patientName}` });
  res.status(201).json(ec);
};

export const update = async (req, res) => {
  const ec = await EmergencyCase.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!ec) return res.status(404).json({ message: 'Emergency case not found' });
  res.json(ec);
};

export const addNote = async (req, res) => {
  const ec = await EmergencyCase.findById(req.params.id);
  if (!ec) return res.status(404).json({ message: 'Emergency case not found' });
  ec.notes.push({ text: req.body.text, by: req.user?.name || 'Staff', at: new Date() });
  await ec.save();
  res.json(ec);
};

export const stats = async (req, res) => {
  const [total, waiting, underTreatment, admitted, level1, level2] = await Promise.all([
    EmergencyCase.countDocuments({}),
    EmergencyCase.countDocuments({ status: 'waiting' }),
    EmergencyCase.countDocuments({ status: 'under-treatment' }),
    EmergencyCase.countDocuments({ status: 'admitted' }),
    EmergencyCase.countDocuments({ traumaLevel: 'Level 1 - Critical' }),
    EmergencyCase.countDocuments({ traumaLevel: 'Level 2 - Emergent' }),
  ]);
  const availableBeds = await Bed.countDocuments({ status: 'available', type: 'ICU' });
  res.json({ total, waiting, underTreatment, admitted, level1, level2, availableIcuBeds: availableBeds });
};

export const remove = async (req, res) => {
  const ec = await EmergencyCase.findByIdAndDelete(req.params.id);
  if (!ec) return res.status(404).json({ message: 'Emergency case not found' });
  res.json({ message: 'Emergency case deleted' });
};
