// Role-based navigation config for the dashboard sidebar.
import {
  LayoutDashboard, Calendar, CalendarPlus, FileText, Pill, FlaskConical,
  Receipt, Users, Stethoscope, Building2, Droplet, BedDouble, Package,
  BarChart3, ScrollText, Settings, User, Activity, ClipboardList,
  HeartPulse, Syringe, Wallet, ShieldCheck, Ambulance, Microscope, UserCog,
  TestTube, Scan, Radiation, Brain, Baby, Beaker, Eye, CheckCircle, Clock,
  Siren, AlertTriangle, Bed, Radio, Zap,
} from 'lucide-react';

const labNav = [
  { to: '/dashboard/lab', label: 'Lab Dashboard', icon: FlaskConical },
  { to: '/dashboard/lab/sample-collection', label: 'Sample Collection', icon: TestTube },
  { to: '/dashboard/lab/pending', label: 'Pending Tests', icon: Clock },
  { to: '/dashboard/lab/processing', label: 'Processing', icon: Activity },
  { to: '/dashboard/lab/completed', label: 'Completed Tests', icon: CheckCircle },
  { to: '/dashboard/lab/verification', label: 'Report Verification', icon: Eye },
  { to: '/dashboard/lab/approved', label: 'Approved Reports', icon: ShieldCheck },
  { to: '/dashboard/lab/equipment', label: 'Equipment Status', icon: Microscope },
  { to: '/dashboard/lab/blood-collection', label: 'Blood Collection', icon: Droplet },
  { to: '/dashboard/lab/ecg', label: 'ECG Room', icon: HeartPulse },
  { to: '/dashboard/lab/xray', label: 'X-Ray Room', icon: Radiation },
  { to: '/dashboard/lab/ct-scan', label: 'CT Scan Room', icon: Scan },
  { to: '/dashboard/lab/mri', label: 'MRI Room', icon: Brain },
  { to: '/dashboard/lab/ultrasound', label: 'Ultrasound Room', icon: Baby },
  { to: '/dashboard/lab/pathology', label: 'Pathology Lab', icon: Beaker },
  { to: '/dashboard/lab/microbiology', label: 'Microbiology Lab', icon: Microscope },
  { to: '/dashboard/lab/biochemistry', label: 'Biochemistry Lab', icon: FlaskConical },
  { to: '/dashboard/lab/hematology', label: 'Hematology Lab', icon: Droplet },
];

const emergencyNav = [
  { to: '/dashboard/emergency', label: 'Emergency Dashboard', icon: Siren },
  { to: '/dashboard/emergency/register', label: 'Register Case', icon: AlertTriangle },
  { to: '/dashboard/emergency/queue', label: 'Live Queue', icon: Radio },
  { to: '/dashboard/emergency/ambulances', label: 'Ambulance Tracking', icon: Ambulance },
  { to: '/dashboard/emergency/beds', label: 'ICU / Bed Status', icon: Bed },
];

export const navByRole = {
  super_admin: [
    { group: 'Overview', items: [{ to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard }, { to: '/dashboard/analytics', label: 'Analytics', icon: BarChart3 }] },
    { group: 'Emergency', items: emergencyNav },
    { group: 'Laboratory', items: labNav },
    { group: 'Management', items: [{ to: '/dashboard/patients', label: 'Patients', icon: Users }, { to: '/dashboard/doctors', label: 'Doctors', icon: Stethoscope }, { to: '/dashboard/departments', label: 'Departments', icon: Building2 }] },
    { group: 'Operations', items: [{ to: '/dashboard/appointments', label: 'Appointments', icon: Calendar }, { to: '/dashboard/beds', label: 'Beds & Rooms', icon: BedDouble }, { to: '/dashboard/blood-bank', label: 'Blood Bank', icon: Droplet }, { to: '/dashboard/pharmacy', label: 'Pharmacy', icon: Package }, { to: '/dashboard/ambulances', label: 'Ambulances', icon: Ambulance }] },
    { group: 'Staff', items: [{ to: '/dashboard/staff', label: 'Staff', icon: UserCog }] },
    { group: 'Finance', items: [{ to: '/dashboard/invoices', label: 'Invoices', icon: Receipt }] },
    { group: 'System', items: [{ to: '/dashboard/audit-logs', label: 'Audit Logs', icon: ScrollText }, { to: '/dashboard/settings', label: 'Settings', icon: Settings }] },
    { group: 'Account', items: [{ to: '/dashboard/profile', label: 'Profile', icon: User }] },
  ],
  hospital_admin: [
    { group: 'Overview', items: [{ to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard }, { to: '/dashboard/analytics', label: 'Analytics', icon: BarChart3 }] },
    { group: 'Emergency', items: emergencyNav },
    { group: 'Laboratory', items: labNav },
    { group: 'Management', items: [{ to: '/dashboard/patients', label: 'Patients', icon: Users }, { to: '/dashboard/doctors', label: 'Doctors', icon: Stethoscope }, { to: '/dashboard/departments', label: 'Departments', icon: Building2 }] },
    { group: 'Operations', items: [{ to: '/dashboard/appointments', label: 'Appointments', icon: Calendar }, { to: '/dashboard/book-appointment', label: 'Book Appointment', icon: CalendarPlus }, { to: '/dashboard/beds', label: 'Beds & Rooms', icon: BedDouble }, { to: '/dashboard/blood-bank', label: 'Blood Bank', icon: Droplet }, { to: '/dashboard/pharmacy', label: 'Pharmacy', icon: Package }, { to: '/dashboard/ambulances', label: 'Ambulances', icon: Ambulance }] },
    { group: 'Staff', items: [{ to: '/dashboard/staff', label: 'Staff', icon: UserCog }] },
    { group: 'Finance', items: [{ to: '/dashboard/invoices', label: 'Invoices', icon: Receipt }] },
    { group: 'System', items: [{ to: '/dashboard/audit-logs', label: 'Audit Logs', icon: ScrollText }, { to: '/dashboard/settings', label: 'Settings', icon: Settings }] },
    { group: 'Account', items: [{ to: '/dashboard/profile', label: 'Profile', icon: User }] },
  ],
  doctor: [
    { group: 'Overview', items: [{ to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard }] },
    { group: 'Emergency', items: [
      { to: '/dashboard/emergency', label: 'Emergency Dashboard', icon: Siren },
      { to: '/dashboard/emergency/queue', label: 'Live Queue', icon: Radio },
    ] },
    { group: 'Laboratory', items: [
      { to: '/dashboard/lab', label: 'Lab Dashboard', icon: FlaskConical },
      { to: '/dashboard/lab/pending', label: 'Pending Tests', icon: Clock },
      { to: '/dashboard/lab/completed', label: 'Completed Tests', icon: CheckCircle },
      { to: '/dashboard/lab/approved', label: 'Approved Reports', icon: ShieldCheck },
      { to: '/dashboard/lab/verification', label: 'Report Verification', icon: Eye },
    ] },
    { group: 'Practice', items: [{ to: '/dashboard/appointments', label: 'Appointments', icon: Calendar }, { to: '/dashboard/patients', label: 'Patients', icon: Users }, { to: '/dashboard/prescriptions', label: 'Prescriptions', icon: Pill }] },
    { group: 'Records', items: [{ to: '/dashboard/medical-records', label: 'Medical Records', icon: FileText }] },
    { group: 'Account', items: [{ to: '/dashboard/profile', label: 'Profile', icon: User }] },
  ],
  receptionist: [
    { group: 'Overview', items: [{ to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard }] },
    { group: 'Emergency', items: [
      { to: '/dashboard/emergency', label: 'Emergency Dashboard', icon: Siren },
      { to: '/dashboard/emergency/register', label: 'Register Case', icon: AlertTriangle },
      { to: '/dashboard/emergency/queue', label: 'Live Queue', icon: Radio },
      { to: '/dashboard/emergency/ambulances', label: 'Ambulance Tracking', icon: Ambulance },
    ] },
    { group: 'Front Desk', items: [{ to: '/dashboard/patients', label: 'Patients', icon: Users }, { to: '/dashboard/appointments', label: 'Appointments', icon: Calendar }, { to: '/dashboard/book-appointment', label: 'Book Appointment', icon: CalendarPlus }, { to: '/dashboard/doctors', label: 'Doctors', icon: Stethoscope }] },
    { group: 'Operations', items: [{ to: '/dashboard/beds', label: 'Beds & Rooms', icon: BedDouble }, { to: '/dashboard/blood-bank', label: 'Blood Bank', icon: Droplet }, { to: '/dashboard/invoices', label: 'Invoices', icon: Receipt }] },
    { group: 'Account', items: [{ to: '/dashboard/profile', label: 'Profile', icon: User }] },
  ],
  nurse: [
    { group: 'Overview', items: [{ to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard }] },
    { group: 'Emergency', items: [
      { to: '/dashboard/emergency', label: 'Emergency Dashboard', icon: Siren },
      { to: '/dashboard/emergency/queue', label: 'Live Queue', icon: Radio },
      { to: '/dashboard/emergency/beds', label: 'ICU / Bed Status', icon: Bed },
    ] },
    { group: 'Care', items: [{ to: '/dashboard/patients', label: 'Patients', icon: Users }, { to: '/dashboard/beds', label: 'Beds & Rooms', icon: BedDouble }, { to: '/dashboard/medical-records', label: 'Vitals & Notes', icon: Activity }] },
    { group: 'Account', items: [{ to: '/dashboard/profile', label: 'Profile', icon: User }] },
  ],
  lab_technician: [
    { group: 'Overview', items: [{ to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard }] },
    { group: 'Laboratory', items: labNav },
    { group: 'Account', items: [{ to: '/dashboard/profile', label: 'Profile', icon: User }] },
  ],
  pharmacist: [
    { group: 'Overview', items: [{ to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard }] },
    { group: 'Pharmacy', items: [{ to: '/dashboard/pharmacy', label: 'Inventory', icon: Package }, { to: '/dashboard/prescriptions', label: 'Prescriptions', icon: Pill }, { to: '/dashboard/invoices', label: 'Invoices', icon: Receipt }] },
    { group: 'Account', items: [{ to: '/dashboard/profile', label: 'Profile', icon: User }] },
  ],
  accountant: [
    { group: 'Overview', items: [{ to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard }, { to: '/dashboard/analytics', label: 'Analytics', icon: BarChart3 }] },
    { group: 'Finance', items: [{ to: '/dashboard/invoices', label: 'Invoices', icon: Receipt }, { to: '/dashboard/patients', label: 'Patients', icon: Users }] },
    { group: 'Account', items: [{ to: '/dashboard/profile', label: 'Profile', icon: User }] },
  ],
  patient: [
    { group: 'Overview', items: [{ to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard }] },
    { group: 'Appointments', items: [{ to: '/dashboard/book-appointment', label: 'Book Appointment', icon: CalendarPlus }, { to: '/dashboard/appointments', label: 'My Appointments', icon: Calendar }] },
    { group: 'Health', items: [{ to: '/dashboard/medical-records', label: 'Medical Records', icon: FileText }, { to: '/dashboard/prescriptions', label: 'Prescriptions', icon: Pill }] },
    { group: 'Laboratory', items: [{ to: '/dashboard/lab-reports', label: 'My Reports', icon: FlaskConical }] },
    { group: 'Billing', items: [{ to: '/dashboard/invoices', label: 'Invoices', icon: Receipt }] },
    { group: 'Account', items: [{ to: '/dashboard/profile', label: 'Profile', icon: User }] },
  ],
  emergency: [
    { group: 'Overview', items: [{ to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard }] },
    { group: 'Emergency', items: emergencyNav },
    { group: 'Account', items: [{ to: '/dashboard/profile', label: 'Profile', icon: User }] },
  ],
};

export const roleLabels = {
  super_admin: 'Super Admin', hospital_admin: 'Hospital Admin', doctor: 'Doctor',
  receptionist: 'Receptionist', nurse: 'Nurse', lab_technician: 'Lab Technician',
  pharmacist: 'Pharmacist', accountant: 'Accountant', patient: 'Patient',
  emergency: 'Emergency Staff',
};
