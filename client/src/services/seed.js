// Seed data for the MedCare mock backend — fully interconnected.
// Default admin credentials: admin@medcare.health / Admin@123

export const seedUsers = [
  { id: 'u_admin', role: 'super_admin', name: 'Arjun Mehta', email: 'admin@medcare.health', password: 'Admin@123', phone: '+91 90000 10001', avatar: 'AM', status: 'active', createdAt: '2024-01-01T08:00:00Z', lastLogin: null, loginHistory: [] },
  { id: 'u_hadmin', role: 'hospital_admin', name: 'Priya Nair', email: 'hadmin@medcare.health', password: 'Hospital@123', phone: '+91 90000 10002', avatar: 'PN', status: 'active', createdAt: '2024-01-02T08:00:00Z', lastLogin: null, loginHistory: [] },
  { id: 'u_doc1', role: 'doctor', name: 'Dr. Ananya Rao', email: 'ananya@medcare.health', password: 'Doctor@123', phone: '+91 90000 10003', avatar: 'AR', status: 'active', createdAt: '2024-01-03T08:00:00Z', lastLogin: null, loginHistory: [], doctorId: 'd_1' },
  { id: 'u_doc2', role: 'doctor', name: 'Dr. Vikram Singh', email: 'vikram@medcare.health', password: 'Doctor@123', phone: '+91 90000 10004', avatar: 'VS', status: 'active', createdAt: '2024-01-04T08:00:00Z', lastLogin: null, loginHistory: [], doctorId: 'd_2' },
  { id: 'u_doc3', role: 'doctor', name: 'Dr. Sanjay Gupta', email: 'sanjay@medcare.health', password: 'Doctor@123', phone: '+91 90000 10020', avatar: 'SG', status: 'pending', createdAt: '2024-06-01T08:00:00Z', lastLogin: null, loginHistory: [], doctorId: 'd_3' },
  { id: 'u_rec', role: 'receptionist', name: 'Meena Kumari', email: 'reception@medcare.health', password: 'Reception@123', phone: '+91 90000 10005', avatar: 'MK', status: 'active', createdAt: '2024-01-05T08:00:00Z', lastLogin: null, loginHistory: [] },
  { id: 'u_nurse', role: 'nurse', name: 'Sister Grace Thomas', email: 'nurse@medcare.health', password: 'Nurse@123', phone: '+91 90000 10006', avatar: 'GT', status: 'active', createdAt: '2024-01-06T08:00:00Z', lastLogin: null, loginHistory: [] },
  { id: 'u_lab', role: 'lab_technician', name: 'Rohit Desai', email: 'lab@medcare.health', password: 'Lab@123', phone: '+91 90000 10007', avatar: 'RD', status: 'active', createdAt: '2024-01-07T08:00:00Z', lastLogin: null, loginHistory: [] },
  { id: 'u_pharma', role: 'pharmacist', name: 'Sneha Patil', email: 'pharmacy@medcare.health', password: 'Pharmacy@123', phone: '+91 90000 10008', avatar: 'SP', status: 'active', createdAt: '2024-01-08T08:00:00Z', lastLogin: null, loginHistory: [] },
  { id: 'u_acc', role: 'accountant', name: 'Karthik Iyer', email: 'accounts@medcare.health', password: 'Accounts@123', phone: '+91 90000 10009', avatar: 'KI', status: 'active', createdAt: '2024-01-09T08:00:00Z', lastLogin: null, loginHistory: [] },
  { id: 'u_pat1', role: 'patient', name: 'Rahul Sharma', email: 'rahul@example.com', password: 'Patient@123', phone: '+91 90000 10010', avatar: 'RS', status: 'active', createdAt: '2024-01-10T08:00:00Z', lastLogin: null, loginHistory: [], patientId: 'p_1' },
  { id: 'u_pat2', role: 'patient', name: 'Fatima Sheikh', email: 'fatima@example.com', password: 'Patient@123', phone: '+91 90000 10011', avatar: 'FS', status: 'active', createdAt: '2024-01-11T08:00:00Z', lastLogin: null, loginHistory: [], patientId: 'p_2' },
];

export const seedStaff = [
  { id: 's_1', userId: 'u_nurse', name: 'Sister Grace Thomas', role: 'nurse', department: 'dep_1', shift: 'Morning', status: 'active', joinedAt: '2024-01-06T08:00:00Z' },
  { id: 's_2', userId: 'u_lab', name: 'Rohit Desai', role: 'lab_technician', department: 'dep_8', shift: 'Morning', status: 'active', joinedAt: '2024-01-07T08:00:00Z' },
  { id: 's_3', userId: 'u_pharma', name: 'Sneha Patil', role: 'pharmacist', department: null, shift: 'Morning', status: 'active', joinedAt: '2024-01-08T08:00:00Z' },
  { id: 's_4', userId: 'u_rec', name: 'Meena Kumari', role: 'receptionist', department: null, shift: 'Morning', status: 'active', joinedAt: '2024-01-05T08:00:00Z' },
  { id: 's_5', userId: 'u_acc', name: 'Karthik Iyer', role: 'accountant', department: null, shift: 'Morning', status: 'active', joinedAt: '2024-01-09T08:00:00Z' },
  { id: 's_6', userId: null, name: 'Nurse Anjali Verma', role: 'nurse', department: 'dep_2', shift: 'Evening', status: 'pending', joinedAt: '2024-06-10T08:00:00Z' },
  { id: 's_7', userId: null, name: 'Lab Tech Imran Khan', role: 'lab_technician', department: 'dep_8', shift: 'Night', status: 'pending', joinedAt: '2024-06-12T08:00:00Z' },
];

export const seedDepartments = [
  { id: 'dep_1', name: 'Cardiology', icon: 'Heart', description: 'Comprehensive cardiac care including interventional cardiology, electrophysiology, and heart failure management.', floor: 3, head: 'Dr. Ananya Rao', phone: '801', color: 'error', established: 1998, totalDoctors: 2, totalPatients: 320, emergency: false },
  { id: 'dep_2', name: 'Neurology', icon: 'Brain', description: 'Advanced diagnosis and treatment of disorders of the nervous system, brain, and spinal cord.', floor: 4, head: 'Dr. Vikram Singh', phone: '802', color: 'primary', established: 2001, totalDoctors: 1, totalPatients: 180, emergency: false },
  { id: 'dep_3', name: 'Orthopedics', icon: 'Bone', description: 'Bone, joint, ligament and tendon care with modern arthroscopy and joint replacement.', floor: 2, head: 'Dr. Sanjay Gupta', phone: '803', color: 'warning', established: 2002, totalDoctors: 1, totalPatients: 240, emergency: false },
  { id: 'dep_4', name: 'Pediatrics', icon: 'Baby', description: 'Dedicated child-health services from neonatal intensive care to adolescent medicine.', floor: 5, head: 'Dr. Lakshmi Iyer', phone: '804', color: 'secondary', established: 2004, totalDoctors: 1, totalPatients: 410, emergency: false },
  { id: 'dep_5', name: 'Gynecology', icon: 'Flower2', description: 'Women-centric healthcare spanning obstetrics, fertility, and gynecological oncology.', floor: 6, head: 'Dr. Deepa Menon', phone: '805', color: 'accent', established: 2005, totalDoctors: 1, totalPatients: 290, emergency: false },
  { id: 'dep_6', name: 'Dermatology', icon: 'Sparkles', description: 'Medical and cosmetic dermatology, laser therapy, and skin cancer screening.', floor: 1, head: 'Dr. Aisha Khan', phone: '806', color: 'primary', established: 2008, totalDoctors: 1, totalPatients: 156, emergency: false },
  { id: 'dep_7', name: 'Ophthalmology', icon: 'Eye', description: 'Complete eye care including cataract surgery, LASIK, and retinal services.', floor: 1, head: 'Dr. Rajesh Khanna', phone: '807', color: 'success', established: 2010, totalDoctors: 1, totalPatients: 198, emergency: false },
  { id: 'dep_8', name: 'Emergency', icon: 'Siren', description: '24/7 emergency and trauma care with rapid response ambulance network.', floor: 'G', head: 'Dr. Vikram Singh', phone: '1066', color: 'error', established: 1998, totalDoctors: 2, totalPatients: 520, emergency: true },
];

export const seedDoctors = [
  { id: 'd_1', userId: 'u_doc1', name: 'Dr. Ananya Rao', department: 'dep_1', specialization: 'Interventional Cardiologist', qualification: 'MD, DM (Cardiology)', experience: 14, consultationFee: 1200, rating: 4.9, reviews: 312, availability: ['Mon','Tue','Wed','Thu','Fri'], timeSlots: ['09:00','10:00','11:00','14:00','15:00','16:00'], languages: ['English','Hindi','Kannada'], about: 'Dr. Ananya Rao is a senior interventional cardiologist with over a decade of experience in complex angioplasties and structural heart interventions.', image: 'https://images.pexels.com/photos/5407206/pexels-photo-5407206.jpeg?auto=compress&cs=tinysrgb&w=400', status: 'available' },
  { id: 'd_2', userId: 'u_doc2', name: 'Dr. Vikram Singh', department: 'dep_2', specialization: 'Neurologist & Stroke Specialist', qualification: 'MD, DM (Neurology)', experience: 18, consultationFee: 1500, rating: 4.8, reviews: 268, availability: ['Mon','Wed','Fri','Sat'], timeSlots: ['10:00','11:00','12:00','14:00','15:00'], languages: ['English','Hindi','Punjabi'], about: 'Dr. Vikram Singh leads the stroke unit and specializes in neurocritical care and movement disorders.', image: 'https://images.pexels.com/photos/6234600/pexels-photo-6234600.jpeg?auto=compress&cs=tinysrgb&w=400', status: 'available' },
  { id: 'd_3', userId: 'u_doc3', name: 'Dr. Sanjay Gupta', department: 'dep_3', specialization: 'Joint Replacement Surgeon', qualification: 'MS (Ortho), Fellowship (UK)', experience: 20, consultationFee: 1000, rating: 4.7, reviews: 198, availability: ['Tue','Wed','Thu','Sat'], timeSlots: ['09:00','10:00','11:00','15:00','16:00'], languages: ['English','Hindi'], about: 'Dr. Sanjay Gupta has performed over 5,000 joint replacement surgeries with excellent outcomes.', image: 'https://images.pexels.com/photos/5214958/pexels-photo-5214958.jpeg?auto=compress&cs=tinysrgb&w=400', status: 'pending' },
  { id: 'd_4', userId: 'u_doc4', name: 'Dr. Lakshmi Iyer', department: 'dep_4', specialization: 'Pediatrician & Neonatologist', qualification: 'MD (Pediatrics), Fellowship (Neonatology)', experience: 12, consultationFee: 800, rating: 4.9, reviews: 421, availability: ['Mon','Tue','Wed','Thu','Fri'], timeSlots: ['09:00','10:00','11:00','13:00','14:00','15:00'], languages: ['English','Tamil','Kannada'], about: 'Dr. Lakshmi Iyer heads the neonatal intensive care unit and is passionate about early childhood wellness.', image: 'https://images.pexels.com/photos/5327580/pexels-photo-5327580.jpeg?auto=compress&cs=tinysrgb&w=400', status: 'available' },
  { id: 'd_5', userId: 'u_doc5', name: 'Dr. Deepa Menon', department: 'dep_5', specialization: 'Obstetrician & Gynecologist', qualification: 'MS (OBG), MRCOG (UK)', experience: 16, consultationFee: 1100, rating: 4.8, reviews: 356, availability: ['Mon','Wed','Fri','Sat'], timeSlots: ['10:00','11:00','12:00','14:00','15:00','16:00'], languages: ['English','Malayalam','Hindi'], about: 'Dr. Deepa Menon specializes in high-risk pregnancies and minimally invasive gynecological surgery.', image: 'https://images.pexels.com/photos/5215028/pexels-photo-5215028.jpeg?auto=compress&cs=tinysrgb&w=400', status: 'available' },
  { id: 'd_6', userId: 'u_doc6', name: 'Dr. Aisha Khan', department: 'dep_6', specialization: 'Dermatologist', qualification: 'MD (Dermatology)', experience: 9, consultationFee: 700, rating: 4.7, reviews: 187, availability: ['Tue','Wed','Thu','Fri','Sat'], timeSlots: ['11:00','12:00','13:00','14:00','15:00'], languages: ['English','Hindi','Urdu'], about: 'Dr. Aisha Khan offers medical and cosmetic dermatology with a focus on holistic skin health.', image: 'https://images.pexels.com/photos/4989171/pexels-photo-4989171.jpeg?auto=compress&cs=tinysrgb&w=400', status: 'available' },
];

export const seedPatients = [
  { id: 'p_1', userId: 'u_pat1', name: 'Rahul Sharma', gender: 'Male', age: 34, bloodGroup: 'O+', phone: '+91 90000 10010', email: 'rahul@example.com', address: '12 MG Road, Bengaluru', emergencyContact: '+91 90000 20001', allergies: ['Penicillin'], chronicConditions: ['Hypertension'], insurance: { provider: 'Star Health', policyNo: 'SH-2024-881234', validTill: '2025-12-31', coverage: 500000 }, avatar: 'RS', status: 'active', registeredAt: '2024-01-10T08:00:00Z' },
  { id: 'p_2', userId: 'u_pat2', name: 'Fatima Sheikh', gender: 'Female', age: 28, bloodGroup: 'A+', phone: '+91 90000 10011', email: 'fatima@example.com', address: '45 Indiranagar, Bengaluru', emergencyContact: '+91 90000 20002', allergies: [], chronicConditions: [], insurance: { provider: 'HDFC Ergo', policyNo: 'HE-2024-995678', validTill: '2026-06-30', coverage: 300000 }, avatar: 'FS', status: 'active', registeredAt: '2024-01-11T08:00:00Z' },
  { id: 'p_3', userId: null, name: 'Joseph Mathew', gender: 'Male', age: 52, bloodGroup: 'B+', phone: '+91 90000 10012', email: 'joseph@example.com', address: '8 Koramangala, Bengaluru', emergencyContact: '+91 90000 20003', allergies: ['Sulfa drugs'], chronicConditions: ['Type 2 Diabetes'], insurance: { provider: 'ICICI Lombard', policyNo: 'IL-2024-445566', validTill: '2025-09-15', coverage: 750000 }, avatar: 'JM', status: 'active', registeredAt: '2024-02-01T08:00:00Z' },
  { id: 'p_4', userId: null, name: 'Kavya Reddy', gender: 'Female', age: 41, bloodGroup: 'AB+', phone: '+91 90000 10013', email: 'kavya@example.com', address: '22 Jayanagar, Bengaluru', emergencyContact: '+91 90000 20004', allergies: [], chronicConditions: ['Asthma'], insurance: { provider: 'Bajaj Allianz', policyNo: 'BA-2024-778899', validTill: '2026-01-20', coverage: 400000 }, avatar: 'KR', status: 'active', registeredAt: '2024-02-15T08:00:00Z' },
  { id: 'p_5', userId: null, name: 'Mohammed Ali', gender: 'Male', age: 67, bloodGroup: 'O-', phone: '+91 90000 10014', email: 'ali@example.com', address: '3 Whitefield, Bengaluru', emergencyContact: '+91 90000 20005', allergies: ['Aspirin'], chronicConditions: ['Coronary Artery Disease','Hypertension'], insurance: { provider: 'Star Health', policyNo: 'SH-2024-223344', validTill: '2025-11-11', coverage: 1000000 }, avatar: 'MA', status: 'active', registeredAt: '2024-03-02T08:00:00Z' },
];

// Interconnected appointment chain: patient books → reception confirms → doctor examines
export const seedAppointments = [
  { id: 'appt_1', token: 'T-001', patientId: 'p_1', patientName: 'Rahul Sharma', patientPhone: '+91 90000 10010', doctorId: 'd_1', doctorName: 'Dr. Ananya Rao', department: 'dep_1', departmentName: 'Cardiology', date: '2024-06-20', time: '10:00', reason: 'Chest pain and shortness of breath', type: 'Consultation', status: 'completed', fee: 1200, createdAt: '2024-06-15T08:00:00Z', confirmedAt: '2024-06-15T10:00:00Z', confirmedBy: 'u_rec', completedAt: '2024-06-20T10:30:00Z' },
  { id: 'appt_2', token: 'T-002', patientId: 'p_2', patientName: 'Fatima Sheikh', patientPhone: '+91 90000 10011', doctorId: 'd_5', doctorName: 'Dr. Deepa Menon', department: 'dep_5', departmentName: 'Gynecology', date: '2024-06-22', time: '11:00', reason: 'Routine prenatal checkup', type: 'Follow-up', status: 'confirmed', fee: 1100, createdAt: '2024-06-16T08:00:00Z', confirmedAt: '2024-06-16T09:00:00Z', confirmedBy: 'u_rec', completedAt: null },
  { id: 'appt_3', token: 'T-003', patientId: 'p_3', patientName: 'Joseph Mathew', patientPhone: '+91 90000 10012', doctorId: 'd_2', doctorName: 'Dr. Vikram Singh', department: 'dep_2', departmentName: 'Neurology', date: '2024-06-25', time: '14:00', reason: 'Frequent headaches and dizziness', type: 'Consultation', status: 'scheduled', fee: 1500, createdAt: '2024-06-18T08:00:00Z', confirmedAt: null, confirmedBy: null, completedAt: null },
  { id: 'appt_4', token: 'T-004', patientId: 'p_4', patientName: 'Kavya Reddy', patientPhone: '+91 90000 10013', doctorId: 'd_4', doctorName: 'Dr. Lakshmi Iyer', department: 'dep_4', departmentName: 'Pediatrics', date: '2024-06-26', time: '09:00', reason: 'Child fever and cough', type: 'Consultation', status: 'scheduled', fee: 800, createdAt: '2024-06-19T08:00:00Z', confirmedAt: null, confirmedBy: null, completedAt: null },
];

// Prescription chain: doctor writes → pharmacy receives → medicine issued → stock updates
export const seedPrescriptions = [
  { id: 'rx_1', appointmentId: 'appt_1', patientId: 'p_1', patientName: 'Rahul Sharma', doctorId: 'd_1', doctorName: 'Dr. Ananya Rao', diagnosis: 'Hypertension with mild angina', medicines: [{ name: 'Telmisartan 40mg', dosage: '1-0-1', duration: '30 days', quantity: 60, medicineId: 'm_6' }, { name: 'Aspirin 75mg', dosage: '0-0-1', duration: '30 days', quantity: 30, medicineId: 'm_9' }], notes: 'Monitor blood pressure daily. Reduce salt intake. Follow up in 2 weeks.', status: 'dispensed', createdAt: '2024-06-20T10:45:00Z', dispensedAt: '2024-06-20T14:00:00Z', dispensedBy: 'u_pharma' },
];

// Lab test chain: doctor requests → lab receives → lab uploads → patient+doctor notified
export const seedLabTests = [
  { id: 'lab_1', patientId: 'p_1', patientName: 'Rahul Sharma', doctorId: 'd_1', doctorName: 'Dr. Ananya Rao', appointmentId: 'appt_1', testName: 'Complete Blood Count', testType: 'Blood Test', category: 'Hematology', priority: 'normal', status: 'completed', result: 'All parameters within normal range. Slightly elevated WBC count.', normalRange: 'WBC: 4000-11000 cells/μL', reportUrl: '#', sampleCollectedAt: '2024-06-20T11:00:00Z', reportUploadedAt: '2024-06-20T15:00:00Z', tatHours: 4, createdAt: '2024-06-20T10:50:00Z', approvedBy: 'u_lab', approvedAt: '2024-06-20T15:30:00Z' },
  { id: 'lab_2', patientId: 'p_3', patientName: 'Joseph Mathew', doctorId: 'd_2', doctorName: 'Dr. Vikram Singh', appointmentId: null, testName: 'MRI Brain', testType: 'MRI', category: 'Radiology', priority: 'high', status: 'sample_collected', result: null, normalRange: null, reportUrl: null, sampleCollectedAt: '2024-06-19T09:00:00Z', reportUploadedAt: null, tatHours: null, createdAt: '2024-06-18T14:30:00Z', approvedBy: null, approvedAt: null },
  { id: 'lab_3', patientId: 'p_2', patientName: 'Fatima Sheikh', doctorId: 'd_5', doctorName: 'Dr. Deepa Menon', appointmentId: 'appt_2', testName: 'Blood Glucose', testType: 'Blood Test', category: 'Biochemistry', priority: 'normal', status: 'pending', result: null, normalRange: null, reportUrl: null, sampleCollectedAt: null, reportUploadedAt: null, tatHours: null, createdAt: '2024-06-16T11:30:00Z', approvedBy: null, approvedAt: null },
];

// Invoice chain: appointment completes → invoice generated → payment → accountant notified
export const seedInvoices = [
  { id: 'inv_1', invoiceNo: 'INV-0001', patientId: 'p_1', patientName: 'Rahul Sharma', appointmentId: 'appt_1', items: [{ description: 'Cardiology Consultation', amount: 1200 }, { description: 'ECG', amount: 500 }, { description: 'Laboratory Tests', amount: 800 }], subtotal: 2500, tax: 450, total: 2950, status: 'paid', method: 'UPI', paidAt: '2024-06-20T16:00:00Z', createdAt: '2024-06-20T11:00:00Z' },
  { id: 'inv_2', invoiceNo: 'INV-0002', patientId: 'p_3', patientName: 'Joseph Mathew', appointmentId: null, items: [{ description: 'MRI Brain', amount: 4500 }], subtotal: 4500, tax: 810, total: 5310, status: 'unpaid', method: null, paidAt: null, createdAt: '2024-06-18T14:35:00Z' },
];

export const seedMedicines = [
  { id: 'm_1', name: 'Paracetamol 500mg', category: 'Analgesic', stock: 480, price: 5, expiry: '2025-12-31', supplier: 'Cipla Pharma', reorderLevel: 50 },
  { id: 'm_2', name: 'Amoxicillin 250mg', category: 'Antibiotic', stock: 32, price: 22, expiry: '2025-06-30', supplier: 'Sun Pharma', reorderLevel: 40 },
  { id: 'm_3', name: 'Omeprazole 20mg', category: 'Antacid', stock: 156, price: 18, expiry: '2025-09-15', supplier: 'Dr. Reddy', reorderLevel: 30 },
  { id: 'm_4', name: 'Atorvastatin 10mg', category: 'Statin', stock: 8, price: 35, expiry: '2025-04-20', supplier: 'Pfizer', reorderLevel: 20 },
  { id: 'm_5', name: 'Metformin 500mg', category: 'Antidiabetic', stock: 240, price: 12, expiry: '2026-01-10', supplier: 'USV', reorderLevel: 50 },
  { id: 'm_6', name: 'Telmisartan 40mg', category: 'Antihypertensive', stock: 95, price: 28, expiry: '2025-11-05', supplier: 'Glenmark', reorderLevel: 30 },
  { id: 'm_7', name: 'Cetirizine 10mg', category: 'Antihistamine', stock: 4, price: 8, expiry: '2025-03-30', supplier: 'Cipla Pharma', reorderLevel: 40 },
  { id: 'm_8', name: 'Azithromycin 500mg', category: 'Antibiotic', stock: 68, price: 45, expiry: '2025-08-22', supplier: 'Sun Pharma', reorderLevel: 25 },
  { id: 'm_9', name: 'Aspirin 75mg', category: 'Antihypertensive', stock: 120, price: 3, expiry: '2026-02-15', supplier: 'USV', reorderLevel: 50 },
];

export const seedMedicineOrders = [
  { id: 'mo_1', prescriptionId: 'rx_1', patientId: 'p_1', patientName: 'Rahul Sharma', doctorName: 'Dr. Ananya Rao', medicines: [{ name: 'Telmisartan 40mg', quantity: 60, medicineId: 'm_6' }, { name: 'Aspirin 75mg', quantity: 30, medicineId: 'm_9' }], total: 2010, status: 'dispensed', createdAt: '2024-06-20T10:50:00Z', dispensedAt: '2024-06-20T14:00:00Z', dispensedBy: 'Sneha Patil' },
];

export const seedBeds = [
  { id: 'b_1', number: 'G-01', ward: 'General Ward A', type: 'General', status: 'occupied', patientId: 'p_5', patientName: 'Mohammed Ali', dailyRate: 2000 },
  { id: 'b_2', number: 'G-02', ward: 'General Ward A', type: 'General', status: 'available', patientId: null, patientName: null, dailyRate: 2000 },
  { id: 'b_3', number: 'ICU-01', ward: 'ICU', type: 'ICU', status: 'occupied', patientId: 'p_3', patientName: 'Joseph Mathew', dailyRate: 12000 },
  { id: 'b_4', number: 'ICU-02', ward: 'ICU', type: 'ICU', status: 'available', patientId: null, patientName: null, dailyRate: 12000 },
  { id: 'b_5', number: 'P-01', ward: 'Private Ward', type: 'Private', status: 'available', patientId: null, patientName: null, dailyRate: 5000 },
];

export const seedBloodBank = [
  { id: 'bb_1', group: 'O+', units: 42, capacity: 80, status: 'good' },
  { id: 'bb_2', group: 'O-', units: 8, capacity: 40, status: 'low' },
  { id: 'bb_3', group: 'A+', units: 36, capacity: 70, status: 'good' },
  { id: 'bb_4', group: 'A-', units: 12, capacity: 40, status: 'medium' },
  { id: 'bb_5', group: 'B+', units: 28, capacity: 60, status: 'good' },
  { id: 'bb_6', group: 'B-', units: 9, capacity: 40, status: 'low' },
  { id: 'bb_7', group: 'AB+', units: 14, capacity: 30, status: 'good' },
  { id: 'bb_8', group: 'AB-', units: 6, capacity: 30, status: 'low' },
];

export const seedNotifications = [
  { id: 'n_1', type: 'appointment', message: 'New appointment T-003 booked by Joseph Mathew — awaiting confirmation', recipientRole: 'receptionist', recipientId: null, entityId: 'appt_3', entity: 'appointment', priority: 'normal', read: false, createdAt: '2024-06-18T08:00:00Z' },
  { id: 'n_2', type: 'lab', message: 'MRI Brain requested for Joseph Mathew — priority: HIGH', recipientRole: 'lab_technician', recipientId: null, entityId: 'lab_2', entity: 'lab_test', priority: 'high', read: false, createdAt: '2024-06-18T14:30:00Z' },
  { id: 'n_3', type: 'prescription', message: 'New prescription from Dr. Ananya Rao for Rahul Sharma', recipientRole: 'pharmacist', recipientId: null, entityId: 'rx_1', entity: 'prescription', priority: 'normal', read: true, createdAt: '2024-06-20T10:50:00Z' },
  { id: 'n_4', type: 'payment', message: 'Payment of ₹2,950 received from Rahul Sharma (INV-0001)', recipientRole: 'accountant', recipientId: null, entityId: 'inv_1', entity: 'invoice', priority: 'normal', read: true, createdAt: '2024-06-20T16:00:00Z' },
];

export const seedAuditLogs = [
  { id: 'log_1', userId: 'u_pat1', userName: 'Rahul Sharma', role: 'patient', action: 'BOOK_APPOINTMENT', entity: 'appointment', entityId: 'appt_1', detail: 'Booked appointment T-001 with Dr. Ananya Rao (Cardiology)', timestamp: '2024-06-15T08:00:00Z', visibility: 'all' },
  { id: 'log_2', userId: 'u_rec', userName: 'Meena Kumari', role: 'receptionist', action: 'CONFIRM_APPOINTMENT', entity: 'appointment', entityId: 'appt_1', detail: 'Confirmed appointment T-001 for Rahul Sharma', timestamp: '2024-06-15T10:00:00Z', visibility: 'all' },
  { id: 'log_3', userId: 'u_doc1', userName: 'Dr. Ananya Rao', role: 'doctor', action: 'COMPLETE_APPOINTMENT', entity: 'appointment', entityId: 'appt_1', detail: 'Completed consultation for Rahul Sharma', timestamp: '2024-06-20T10:30:00Z', visibility: 'all' },
  { id: 'log_4', userId: 'u_doc1', userName: 'Dr. Ananya Rao', role: 'doctor', action: 'CREATE_PRESCRIPTION', entity: 'prescription', entityId: 'rx_1', detail: 'Created prescription for Rahul Sharma — Telmisartan, Aspirin', timestamp: '2024-06-20T10:45:00Z', visibility: 'all' },
  { id: 'log_5', userId: 'u_doc1', userName: 'Dr. Ananya Rao', role: 'doctor', action: 'REQUEST_LAB_TEST', entity: 'lab_test', entityId: 'lab_1', detail: 'Requested Complete Blood Count for Rahul Sharma', timestamp: '2024-06-20T10:50:00Z', visibility: 'all' },
  { id: 'log_6', userId: 'u_lab', userName: 'Rohit Desai', role: 'lab_technician', action: 'UPLOAD_LAB_REPORT', entity: 'lab_test', entityId: 'lab_1', detail: 'Uploaded CBC report for Rahul Sharma', timestamp: '2024-06-20T15:00:00Z', visibility: 'all' },
  { id: 'log_7', userId: 'u_pharma', userName: 'Sneha Patil', role: 'pharmacist', action: 'DISPENSE_MEDICINE', entity: 'medicine_order', entityId: 'mo_1', detail: 'Dispensed medicines for Rahul Sharma — Telmisartan 60, Aspirin 30', timestamp: '2024-06-20T14:00:00Z', visibility: 'all' },
  { id: 'log_8', userId: 'u_pat1', userName: 'Rahul Sharma', role: 'patient', action: 'PAYMENT', entity: 'invoice', entityId: 'inv_1', detail: 'Paid ₹2,950 for INV-0001 via UPI', timestamp: '2024-06-20T16:00:00Z', visibility: 'all' },
];

// Nurse module seed data
export const seedNurseAssignments = [
  { id: 'na_1', nurseId: 'u_nurse', nurseName: 'Sister Grace Thomas', patientId: 'p_5', patientName: 'Mohammed Ali', ward: 'ICU', bedNumber: 'ICU-01', shift: 'Morning', status: 'active', assignedAt: '2024-06-19T08:00:00Z', doctorId: 'd_1', doctorName: 'Dr. Ananya Rao', instructions: 'Monitor vitals every 2 hours. Administer Aspirin 75mg at 9 PM. Call doctor if BP exceeds 160/100.' },
  { id: 'na_2', nurseId: 'u_nurse', nurseName: 'Sister Grace Thomas', patientId: 'p_3', patientName: 'Joseph Mathew', ward: 'ICU', bedNumber: 'ICU-01', shift: 'Morning', status: 'active', assignedAt: '2024-06-18T14:00:00Z', doctorId: 'd_2', doctorName: 'Dr. Vikram Singh', instructions: 'Monitor for seizure activity. Keep patient NPO after midnight for MRI.' },
];

export const seedVitals = [
  { id: 'v_1', patientId: 'p_5', patientName: 'Mohammed Ali', nurseId: 'u_nurse', nurseName: 'Sister Grace Thomas', heartRate: 78, bloodPressure: '140/90', temperature: 98.4, oxygenSat: 97, respiratoryRate: 18, recordedAt: '2024-06-19T10:00:00Z', notes: 'Patient stable. Slightly elevated BP.' },
  { id: 'v_2', patientId: 'p_5', patientName: 'Mohammed Ali', nurseId: 'u_nurse', nurseName: 'Sister Grace Thomas', heartRate: 82, bloodPressure: '145/92', temperature: 98.6, oxygenSat: 96, respiratoryRate: 20, recordedAt: '2024-06-19T12:00:00Z', notes: 'BP still elevated. Notified Dr. Ananya.' },
  { id: 'v_3', patientId: 'p_3', patientName: 'Joseph Mathew', nurseId: 'u_nurse', nurseName: 'Sister Grace Thomas', heartRate: 88, bloodPressure: '130/85', temperature: 99.1, oxygenSat: 98, respiratoryRate: 16, recordedAt: '2024-06-19T10:00:00Z', notes: 'Patient resting. No seizure activity observed.' },
];

export const seedNurseNotes = [
  { id: 'nn_1', patientId: 'p_5', patientName: 'Mohammed Ali', nurseId: 'u_nurse', nurseName: 'Sister Grace Thomas', note: 'Patient complains of mild chest discomfort. Given sublingual nitroglycerin as per standing orders. Pain subsided in 5 minutes.', type: 'observation', severity: 'warning', createdAt: '2024-06-19T11:30:00Z' },
  { id: 'nn_2', patientId: 'p_3', patientName: 'Joseph Mathew', nurseId: 'u_nurse', nurseName: 'Sister Grace Thomas', note: 'Patient prepared for MRI. NPO confirmed. IV line secured in left arm.', type: 'procedure', severity: 'normal', createdAt: '2024-06-19T09:30:00Z' },
];

// Lab equipment
export const seedEquipment = [
  { id: 'eq_1', name: 'MRI Scanner 3T', status: 'operational', lastService: '2024-05-15', nextService: '2024-08-15', location: 'Radiology Dept', utilization: 78 },
  { id: 'eq_2', name: 'CT Scanner 128-slice', status: 'operational', lastService: '2024-04-20', nextService: '2024-07-20', location: 'Radiology Dept', utilization: 85 },
  { id: 'eq_3', name: 'Digital X-Ray', status: 'operational', lastService: '2024-06-01', nextService: '2024-09-01', location: 'Radiology Dept', utilization: 62 },
  { id: 'eq_4', name: 'Ultrasound Machine', status: 'maintenance', lastService: '2024-06-18', nextService: '2024-06-25', location: 'Radiology Dept', utilization: 0 },
  { id: 'eq_5', name: 'ECG Machine', status: 'operational', lastService: '2024-05-10', nextService: '2024-08-10', location: 'Cardiology Dept', utilization: 91 },
  { id: 'eq_6', name: 'Auto Analyzer (Blood)', status: 'operational', lastService: '2024-06-05', nextService: '2024-09-05', location: 'Lab Dept', utilization: 88 },
];

// Ambulance fleet
export const seedAmbulances = [
  { id: 'amb_1', vehicleNo: 'KA-01-A-1001', type: 'ALS', status: 'available', driver: 'Ramesh Kumar', driverPhone: '+91 90000 30001', location: 'Main Gate', lastService: '2024-06-01' },
  { id: 'amb_2', vehicleNo: 'KA-01-A-1002', type: 'BLS', status: 'on_call', driver: 'Suresh Patel', driverPhone: '+91 90000 30002', location: 'Indiranagar', lastService: '2024-05-20' },
  { id: 'amb_3', vehicleNo: 'KA-01-A-1003', type: 'Neonatal', status: 'available', driver: 'Mohan Das', driverPhone: '+91 90000 30003', location: 'Pediatric Block', lastService: '2024-06-10' },
  { id: 'amb_4', vehicleNo: 'KA-01-A-1004', type: 'ALS', status: 'maintenance', driver: null, driverPhone: null, location: 'Garage', lastService: '2024-06-19' },
];

// Accounting
export const seedExpenses = [
  { id: 'exp_1', category: 'Salaries', description: 'Monthly staff salaries', amount: 1850000, date: '2024-06-01', status: 'paid', method: 'Bank Transfer' },
  { id: 'exp_2', category: 'Equipment', description: 'MRI scanner maintenance', amount: 45000, date: '2024-06-15', status: 'paid', method: 'Bank Transfer' },
  { id: 'exp_3', category: 'Supplies', description: 'Pharmacy stock purchase', amount: 128000, date: '2024-06-10', status: 'paid', method: 'UPI' },
  { id: 'exp_4', category: 'Utilities', description: 'Electricity bill', amount: 85000, date: '2024-06-05', status: 'paid', method: 'Bank Transfer' },
  { id: 'exp_5', category: 'Supplies', description: 'Lab reagents and consumables', amount: 62000, date: '2024-06-12', status: 'pending', method: null },
];

export const seedInsuranceClaims = [
  { id: 'ic_1', patientId: 'p_1', patientName: 'Rahul Sharma', provider: 'Star Health', policyNo: 'SH-2024-881234', claimAmount: 2950, approvedAmount: 2950, status: 'approved', invoiceId: 'inv_1', submittedAt: '2024-06-20T16:30:00Z', approvedAt: '2024-06-21T10:00:00Z' },
  { id: 'ic_2', patientId: 'p_3', patientName: 'Joseph Mathew', provider: 'ICICI Lombard', policyNo: 'IL-2024-445566', claimAmount: 5310, approvedAmount: null, status: 'pending', invoiceId: 'inv_2', submittedAt: '2024-06-18T15:00:00Z', approvedAt: null },
];
