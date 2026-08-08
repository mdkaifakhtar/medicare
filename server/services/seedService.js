import User from '../models/User.js';
import Patient from '../models/Patient.js';
import Doctor from '../models/Doctor.js';
import Department from '../models/Department.js';
import Staff from '../models/Staff.js';
import Appointment from '../models/Appointment.js';
import Prescription from '../models/Prescription.js';
import LabTest from '../models/LabTest.js';
import Invoice from '../models/Invoice.js';
import Medicine from '../models/Medicine.js';
import Bed from '../models/Bed.js';
import BloodBank from '../models/BloodBank.js';
import Equipment from '../models/Equipment.js';
import Ambulance from '../models/Ambulance.js';
import Notification from '../models/Notification.js';
import AuditLog from '../models/AuditLog.js';
import NurseAssignment from '../models/NurseAssignment.js';
import Vitals from '../models/Vitals.js';
import NurseNote from '../models/NurseNote.js';
import Expense from '../models/Expense.js';

export const seedDatabase = async () => {
  const counts = await Promise.all([
    User.countDocuments(), Patient.countDocuments(), Doctor.countDocuments(),
  ]);
  if (counts[0] > 0) {
    console.log('  → Database already seeded, skipping.');
    return;
  }
  console.log('  → Seeding initial data...');

  const departments = await Department.insertMany([
    { name: 'Cardiology', icon: 'Heart', description: 'Comprehensive cardiac care including interventional cardiology, electrophysiology, and heart failure management.', floor: '3', head: 'Dr. Ananya Rao', phone: '801', color: 'error', established: 1998, emergency: false },
    { name: 'Neurology', icon: 'Brain', description: 'Advanced diagnosis and treatment of disorders of the nervous system, brain, and spinal cord.', floor: '4', head: 'Dr. Vikram Singh', phone: '802', color: 'primary', established: 2001, emergency: false },
    { name: 'Orthopedics', icon: 'Bone', description: 'Bone, joint, ligament and tendon care with modern arthroscopy and joint replacement.', floor: '2', head: 'Dr. Sanjay Gupta', phone: '803', color: 'warning', established: 2002, emergency: false },
    { name: 'Pediatrics', icon: 'Baby', description: 'Dedicated child-health services from neonatal intensive care to adolescent medicine.', floor: '5', head: 'Dr. Lakshmi Iyer', phone: '804', color: 'secondary', established: 2004, emergency: false },
    { name: 'Gynecology', icon: 'Flower2', description: 'Women-centric healthcare spanning obstetrics, fertility, and gynecological oncology.', floor: '6', head: 'Dr. Deepa Menon', phone: '805', color: 'accent', established: 2005, emergency: false },
    { name: 'Dermatology', icon: 'Sparkles', description: 'Medical and cosmetic dermatology, laser therapy, and skin cancer screening.', floor: '1', head: 'Dr. Aisha Khan', phone: '806', color: 'primary', established: 2008, emergency: false },
    { name: 'Ophthalmology', icon: 'Eye', description: 'Complete eye care including cataract surgery, LASIK, and retinal services.', floor: '1', head: 'Dr. Rajesh Khanna', phone: '807', color: 'success', established: 2010, emergency: false },
    { name: 'Emergency', icon: 'Siren', description: '24/7 emergency and trauma care with rapid response ambulance network.', floor: 'G', head: 'Dr. Vikram Singh', phone: '1066', color: 'error', established: 1998, emergency: true },
  ]);

  const doctors = await Doctor.insertMany([
    { name: 'Dr. Ananya Rao', email: 'ananya@medcare.health', phone: '+91 90000 10003', specialization: 'Interventional Cardiology', department: departments[0]._id, departmentName: 'Cardiology', experience: 15, qualifications: 'MD, DM Cardiology', rating: 4.9, reviewCount: 320, consultationFee: 800, avatar: 'AR', available: true, status: 'active', bio: 'Senior interventional cardiologist with 15+ years of experience in complex angioplasty and structural heart interventions.' },
    { name: 'Dr. Vikram Singh', email: 'vikram@medcare.health', phone: '+91 90000 10004', specialization: 'Neurology', department: departments[1]._id, departmentName: 'Neurology', experience: 12, qualifications: 'MD, DM Neurology', rating: 4.8, reviewCount: 210, consultationFee: 700, avatar: 'VS', available: true, status: 'active', bio: 'Expert neurologist specializing in stroke management and epilepsy.' },
    { name: 'Dr. Sanjay Gupta', email: 'sanjay@medcare.health', phone: '+91 90000 10020', specialization: 'Orthopedic Surgery', department: departments[2]._id, departmentName: 'Orthopedics', experience: 10, qualifications: 'MS Ortho', rating: 4.7, reviewCount: 180, consultationFee: 600, avatar: 'SG', available: true, status: 'active', bio: 'Joint replacement and sports injury specialist.' },
    { name: 'Dr. Lakshmi Iyer', email: 'lakshmi@medcare.health', phone: '+91 90000 10030', specialization: 'Pediatrics', department: departments[3]._id, departmentName: 'Pediatrics', experience: 8, qualifications: 'MD Pediatrics', rating: 4.9, reviewCount: 410, consultationFee: 500, avatar: 'LI', available: true, status: 'active', bio: 'Compassionate pediatrician with expertise in neonatal care.' },
    { name: 'Dr. Deepa Menon', email: 'deepa@medcare.health', phone: '+91 90000 10040', specialization: 'Gynecology', department: departments[4]._id, departmentName: 'Gynecology', experience: 14, qualifications: 'MS OBG', rating: 4.8, reviewCount: 290, consultationFee: 700, avatar: 'DM', available: true, status: 'active', bio: 'Obstetrician and gynecologist with special interest in high-risk pregnancies.' },
    { name: 'Dr. Aisha Khan', email: 'aisha@medcare.health', phone: '+91 90000 10050', specialization: 'Dermatology', department: departments[5]._id, departmentName: 'Dermatology', experience: 9, qualifications: 'MD Dermatology', rating: 4.7, reviewCount: 156, consultationFee: 600, avatar: 'AK', available: true, status: 'active', bio: 'Dermatologist specializing in cosmetic and laser procedures.' },
    { name: 'Dr. Rajesh Khanna', email: 'rajesh@medcare.health', phone: '+91 90000 10060', specialization: 'Ophthalmology', department: departments[6]._id, departmentName: 'Ophthalmology', experience: 11, qualifications: 'MS Ophthalmology', rating: 4.6, reviewCount: 198, consultationFee: 500, avatar: 'RK', available: true, status: 'active', bio: 'Eye surgeon with expertise in LASIK and cataract surgery.' },
  ]);

  const users = await User.insertMany([
    { name: 'Arjun Mehta', email: 'admin@medcare.health', password: 'Admin@123', role: 'super_admin', phone: '+91 90000 10001', avatar: 'AM', status: 'active' },
    { name: 'Priya Nair', email: 'hadmin@medcare.health', password: 'Hospital@123', role: 'hospital_admin', phone: '+91 90000 10002', avatar: 'PN', status: 'active' },
    { name: 'Dr. Ananya Rao', email: 'ananya@medcare.health', password: 'Doctor@123', role: 'doctor', phone: '+91 90000 10003', avatar: 'AR', status: 'active', doctorId: doctors[0]._id },
    { name: 'Dr. Vikram Singh', email: 'vikram@medcare.health', password: 'Doctor@123', role: 'doctor', phone: '+91 90000 10004', avatar: 'VS', status: 'active', doctorId: doctors[1]._id },
    { name: 'Meena Kumari', email: 'reception@medcare.health', password: 'Reception@123', role: 'receptionist', phone: '+91 90000 10005', avatar: 'MK', status: 'active' },
    { name: 'Sister Grace Thomas', email: 'nurse@medcare.health', password: 'Nurse@123', role: 'nurse', phone: '+91 90000 10006', avatar: 'GT', status: 'active' },
    { name: 'Rohit Desai', email: 'lab@medcare.health', password: 'Lab@123', role: 'lab_technician', phone: '+91 90000 10007', avatar: 'RD', status: 'active' },
    { name: 'Sneha Patil', email: 'pharmacy@medcare.health', password: 'Pharmacy@123', role: 'pharmacist', phone: '+91 90000 10008', avatar: 'SP', status: 'active' },
    { name: 'Karthik Iyer', email: 'accounts@medcare.health', password: 'Accounts@123', role: 'accountant', phone: '+91 90000 10009', avatar: 'KI', status: 'active' },
  ]);

  const patients = await Patient.insertMany([
    { name: 'Rahul Sharma', gender: 'Male', age: 34, bloodGroup: 'O+', phone: '+91 90000 10010', email: 'rahul@example.com', address: 'MG Road, Bengaluru', emergencyContact: '+91 90000 20010', avatar: 'RS', status: 'active', allergies: ['Penicillin'], chronicConditions: ['Hypertension'] },
    { name: 'Fatima Sheikh', gender: 'Female', age: 28, bloodGroup: 'A+', phone: '+91 90000 10011', email: 'fatima@example.com', address: 'Koramangala, Bengaluru', emergencyContact: '+91 90000 20011', avatar: 'FS', status: 'active', allergies: [], chronicConditions: [] },
    { name: 'John Dsouza', gender: 'Male', age: 45, bloodGroup: 'B+', phone: '+91 90000 10012', email: 'john@example.com', address: 'Indiranagar, Bengaluru', emergencyContact: '+91 90000 20012', avatar: 'JD', status: 'admitted', allergies: ['Aspirin'], chronicConditions: ['Diabetes Type 2'] },
    { name: 'Kavya Reddy', gender: 'Female', age: 32, bloodGroup: 'AB+', phone: '+91 90000 10013', email: 'kavya@example.com', address: 'Jayanagar, Bengaluru', emergencyContact: '+91 90000 20013', avatar: 'KR', status: 'active', allergies: [], chronicConditions: [] },
    { name: 'Mohammed Ali', gender: 'Male', age: 60, bloodGroup: 'O-', phone: '+91 90000 10014', email: 'ali@example.com', address: 'Whitefield, Bengaluru', emergencyContact: '+91 90000 20014', avatar: 'MA', status: 'admitted', allergies: [], chronicConditions: ['Coronary Artery Disease'] },
  ]);

  const patientUser = await User.create({ name: 'Rahul Sharma', email: 'rahul@example.com', password: 'Patient@123', role: 'patient', phone: '+91 90000 10010', avatar: 'RS', status: 'active', patientId: patients[0]._id });

  await Staff.insertMany([
    { userId: users[5]._id, name: 'Sister Grace Thomas', role: 'nurse', department: departments[0]._id, shift: 'Morning', phone: '+91 90000 10006', status: 'active', salary: 45000 },
    { userId: users[6]._id, name: 'Rohit Desai', role: 'lab_technician', department: departments[7]._id, shift: 'Morning', phone: '+91 90000 10007', status: 'active', salary: 40000 },
    { userId: users[7]._id, name: 'Sneha Patil', role: 'pharmacist', shift: 'Morning', phone: '+91 90000 10008', status: 'active', salary: 42000 },
    { userId: users[4]._id, name: 'Meena Kumari', role: 'receptionist', shift: 'Morning', phone: '+91 90000 10005', status: 'active', salary: 30000 },
    { userId: users[8]._id, name: 'Karthik Iyer', role: 'accountant', shift: 'Morning', phone: '+91 90000 10009', status: 'active', salary: 50000 },
  ]);

  const today = new Date();
  await Appointment.insertMany([
    { patient: patients[0]._id, patientName: 'Rahul Sharma', doctor: doctors[0]._id, doctorName: 'Dr. Ananya Rao', department: departments[0]._id, departmentName: 'Cardiology', date: today, time: '10:00', type: 'Consultation', status: 'confirmed', reason: 'Chest pain follow-up', token: 'T01' },
    { patient: patients[1]._id, patientName: 'Fatima Sheikh', doctor: doctors[1]._id, doctorName: 'Dr. Vikram Singh', department: departments[1]._id, departmentName: 'Neurology', date: today, time: '11:00', type: 'Consultation', status: 'scheduled', reason: 'Migraine', token: 'T02' },
    { patient: patients[2]._id, patientName: 'John Dsouza', doctor: doctors[2]._id, doctorName: 'Dr. Sanjay Gupta', department: departments[2]._id, departmentName: 'Orthopedics', date: today, time: '12:00', type: 'Follow-up', status: 'scheduled', reason: 'Post-surgery review', token: 'T03' },
    { patient: patients[3]._id, patientName: 'Kavya Reddy', doctor: doctors[3]._id, doctorName: 'Dr. Lakshmi Iyer', department: departments[3]._id, departmentName: 'Pediatrics', date: today, time: '14:00', type: 'Consultation', status: 'completed', reason: 'Child vaccination', token: 'T04' },
  ]);

  await Prescription.insertMany([
    { patient: patients[0]._id, patientName: 'Rahul Sharma', doctor: doctors[0]._id, doctorName: 'Dr. Ananya Rao', medicines: [{ name: 'Amlodipine 5mg', dosage: '1 tablet', frequency: 'Once daily', duration: '30 days', instructions: 'Take in morning' }, { name: 'Aspirin 75mg', dosage: '1 tablet', frequency: 'Once daily', duration: '30 days', instructions: 'After food' }], diagnosis: 'Hypertension', status: 'active' },
    { patient: patients[1]._id, patientName: 'Fatima Sheikh', doctor: doctors[1]._id, doctorName: 'Dr. Vikram Singh', medicines: [{ name: 'Sumatriptan 50mg', dosage: '1 tablet', frequency: 'As needed', duration: '10 days', instructions: 'At onset of migraine' }], diagnosis: 'Migraine', status: 'dispensed' },
  ]);

  await LabTest.insertMany([
    { patient: patients[0]._id, patientName: 'Rahul Sharma', doctor: doctors[0]._id, doctorName: 'Dr. Ananya Rao', testName: 'Complete Blood Count', category: 'Hematology', sampleType: 'Blood', priority: 'routine', status: 'pending' },
    { patient: patients[2]._id, patientName: 'John Dsouza', doctor: doctors[2]._id, doctorName: 'Dr. Sanjay Gupta', testName: 'X-Ray Knee', category: 'Radiology', sampleType: 'N/A', priority: 'routine', status: 'processing' },
    { patient: patients[4]._id, patientName: 'Mohammed Ali', doctor: doctors[0]._id, doctorName: 'Dr. Ananya Rao', testName: 'Lipid Profile', category: 'Biochemistry', sampleType: 'Blood', priority: 'urgent', status: 'completed', result: 'Elevated LDL', referenceRange: 'LDL < 100 mg/dL' },
  ]);

  await Invoice.insertMany([
    { patient: patients[0]._id, patientName: 'Rahul Sharma', items: [{ description: 'Consultation - Cardiology', quantity: 1, unitPrice: 800, total: 800, category: 'Consultation' }, { description: 'ECG', quantity: 1, unitPrice: 500, total: 500, category: 'Lab' }], subtotal: 1300, tax: 65, total: 1365, paidAmount: 1365, status: 'paid', paymentMethod: 'Card' },
    { patient: patients[2]._id, patientName: 'John Dsouza', items: [{ description: 'Room Charges (2 days)', quantity: 2, unitPrice: 5000, total: 10000, category: 'Room' }, { description: 'Surgery - Knee Arthroscopy', quantity: 1, unitPrice: 50000, total: 50000, category: 'Procedure' }], subtotal: 60000, tax: 3000, total: 63000, paidAmount: 30000, status: 'partial', paymentMethod: 'Insurance' },
  ]);

  await Medicine.insertMany([
    { name: 'Amlodipine 5mg', category: 'Antihypertensive', manufacturer: 'Pfizer', stock: 120, unit: 'strip', price: 45, costPrice: 30, reorderLevel: 20 },
    { name: 'Aspirin 75mg', category: 'Analgesic', manufacturer: 'Bayer', stock: 15, unit: 'strip', price: 12, costPrice: 8, reorderLevel: 20 },
    { name: 'Sumatriptan 50mg', category: 'Analgesic', manufacturer: 'Sun Pharma', stock: 8, unit: 'strip', price: 85, costPrice: 60, reorderLevel: 10 },
    { name: 'Metformin 500mg', category: 'Antidiabetic', manufacturer: 'Cipla', stock: 200, unit: 'strip', price: 25, costPrice: 15, reorderLevel: 30 },
    { name: 'Atorvastatin 10mg', category: 'Statin', manufacturer: 'Dr. Reddy', stock: 0, unit: 'strip', price: 55, costPrice: 40, reorderLevel: 15 },
    { name: 'Cetirizine 10mg', category: 'Antihistamine', manufacturer: 'Hetero', stock: 80, unit: 'strip', price: 8, costPrice: 5, reorderLevel: 20 },
    { name: 'Pantoprazole 40mg', category: 'Antacid', manufacturer: 'Alkem', stock: 65, unit: 'strip', price: 35, costPrice: 22, reorderLevel: 20 },
    { name: 'Amoxicillin 500mg', category: 'Antibiotic', manufacturer: 'Cipla', stock: 45, unit: 'strip', price: 28, costPrice: 18, reorderLevel: 25 },
  ]);

  await Bed.insertMany([
    { bedNumber: '101', ward: 'General Ward A', type: 'General', floor: 2, status: 'available', dailyRate: 2000 },
    { bedNumber: '102', ward: 'General Ward A', type: 'General', floor: 2, status: 'occupied', patient: patients[2]._id, patientName: 'John Dsouza', dailyRate: 2000, assignedAt: new Date() },
    { bedNumber: '201', ward: 'Private Ward', type: 'Private', floor: 3, status: 'occupied', patient: patients[4]._id, patientName: 'Mohammed Ali', dailyRate: 5000, assignedAt: new Date() },
    { bedNumber: 'ICU-1', ward: 'ICU', type: 'ICU', floor: 4, status: 'available', dailyRate: 12000 },
    { bedNumber: 'ICU-2', ward: 'ICU', type: 'ICU', floor: 4, status: 'maintenance', dailyRate: 12000 },
  ]);

  await BloodBank.insertMany([
    { bloodGroup: 'O+', component: 'Whole Blood', units: 45, status: 'available' },
    { bloodGroup: 'A+', component: 'Whole Blood', units: 30, status: 'available' },
    { bloodGroup: 'B+', component: 'Whole Blood', units: 25, status: 'available' },
    { bloodGroup: 'AB+', component: 'Whole Blood', units: 8, status: 'low' },
    { bloodGroup: 'O-', component: 'Whole Blood', units: 3, status: 'critical' },
    { bloodGroup: 'A-', component: 'Plasma', units: 12, status: 'available' },
  ]);

  await Equipment.insertMany([
    { name: 'X-Ray Machine', category: 'Radiology', department: 'Radiology', serialNumber: 'XR-001', manufacturer: 'Siemens', status: 'operational', location: 'X-Ray Room 1' },
    { name: 'CT Scanner', category: 'Radiology', department: 'Radiology', serialNumber: 'CT-001', manufacturer: 'GE Healthcare', status: 'operational', location: 'CT Room' },
    { name: 'MRI Scanner', category: 'Radiology', department: 'Radiology', serialNumber: 'MR-001', manufacturer: 'Philips', status: 'maintenance', location: 'MRI Room', nextServiceDate: new Date(Date.now() + 7 * 86400000) },
    { name: 'ECG Machine', category: 'Cardiology', department: 'Cardiology', serialNumber: 'EC-001', manufacturer: 'Schiller', status: 'operational', location: 'ECG Room' },
    { name: 'Ultrasound Scanner', category: 'Radiology', department: 'Radiology', serialNumber: 'US-001', manufacturer: 'Samsung', status: 'operational', location: 'Ultrasound Room' },
  ]);

  await Ambulance.insertMany([
    { vehicleNumber: 'KA-01-AB-1234', type: 'Advanced', driver: 'Suresh Kumar', driverPhone: '+91 90000 30001', status: 'available', currentLocation: 'Main Entrance' },
    { vehicleNumber: 'KA-01-CD-5678', type: 'Basic', driver: 'Mahesh Rao', driverPhone: '+91 90000 30002', status: 'on-call', currentLocation: 'Returning from call' },
    { vehicleNumber: 'KA-01-EF-9012', type: 'Cardiac', driver: 'Vinod Pillai', driverPhone: '+91 90000 30003', status: 'available', currentLocation: 'Ambulance Bay 2' },
  ]);

  await NurseAssignment.insertMany([
    { nurseId: users[5]._id, nurseName: 'Sister Grace Thomas', patientId: patients[2]._id, patientName: 'John Dsouza', ward: 'General Ward A', bedNumber: '102', shift: 'Morning', doctorName: 'Dr. Sanjay Gupta', instructions: 'Monitor vitals every 2 hours. Administer IV antibiotics at 10am and 6pm.', status: 'active' },
    { nurseId: users[5]._id, nurseName: 'Sister Grace Thomas', patientId: patients[4]._id, patientName: 'Mohammed Ali', ward: 'Private Ward', bedNumber: '201', shift: 'Morning', doctorName: 'Dr. Ananya Rao', instructions: 'Strict cardiac monitoring. Keep O2 saturation above 95%.', status: 'active' },
  ]);

  await Vitals.insertMany([
    { patient: patients[2]._id, patientName: 'John Dsouza', heartRate: 88, bloodPressure: '130/85', temperature: 98.4, oxygenSat: 97, respiratoryRate: 18, recordedByName: 'Sister Grace Thomas', notes: 'Patient comfortable, no complaints' },
    { patient: patients[4]._id, patientName: 'Mohammed Ali', heartRate: 105, bloodPressure: '150/95', temperature: 99.2, oxygenSat: 91, respiratoryRate: 22, recordedByName: 'Sister Grace Thomas', notes: 'Patient reports mild chest discomfort', isAbnormal: true },
  ]);

  await NurseNote.insertMany([
    { patient: patients[2]._id, patientName: 'John Dsouza', nurseName: 'Sister Grace Thomas', note: 'Patient ambulated with assistance. Wound site clean and dry.', type: 'observation', severity: 'normal' },
    { patient: patients[4]._id, patientName: 'Mohammed Ali', nurseName: 'Sister Grace Thomas', note: 'Patient reports chest discomfort. Doctor notified. ECG ordered.', type: 'incident', severity: 'critical' },
  ]);

  await Expense.insertMany([
    { category: 'Equipment', description: 'MRI maintenance contract', amount: 75000, vendor: 'Philips India', status: 'approved', paymentMethod: 'Bank Transfer' },
    { category: 'Supplies', description: 'Surgical gloves and masks', amount: 15000, vendor: 'MediSupply', status: 'pending', paymentMethod: 'UPI' },
    { category: 'Utilities', description: 'Electricity bill - June', amount: 45000, vendor: 'BESCOM', status: 'paid', paymentMethod: 'Bank Transfer' },
  ]);

  await Notification.insertMany([
    { recipientRole: 'all', type: 'system', title: 'Welcome to MedCare HMS', message: 'System initialized successfully. All modules are operational.', priority: 'normal' },
    { recipientRole: 'nurse', type: 'alert', title: 'Abnormal Vitals', message: 'Mohammed Ali (Bed 201) has abnormal vitals — doctor notified.', priority: 'critical', link: '/dashboard/patients' },
    { recipientRole: 'pharmacist', type: 'prescription', title: 'New Prescription', message: 'Prescription for Rahul Sharma awaiting dispense.', priority: 'normal', link: '/dashboard/prescriptions' },
  ]);

  await AuditLog.insertMany([
    { userName: 'System', role: 'system', action: 'SEED', entity: 'system', detail: 'Database seeded with initial data' },
  ]);

  console.log('  ✓ Seed complete!');
};
