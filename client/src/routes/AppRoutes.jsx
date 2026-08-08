import { Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { ProtectedRoute } from '../components/auth/ProtectedRoute.jsx';
import DashboardLayout from '../layouts/DashboardLayout.jsx';
import PublicLayout from '../layouts/PublicLayout.jsx';
import ScrollToTop from '../components/ScrollToTop.jsx';
import Logo from '../components/ui/Logo.jsx';

const Landing = lazy(() => import('../pages/public/Landing.jsx'));
const About = lazy(() => import('../pages/public/About.jsx'));
const Departments = lazy(() => import('../pages/public/Departments.jsx'));
const DepartmentDetail = lazy(() => import('../pages/public/DepartmentDetail.jsx'));
const Doctors = lazy(() => import('../pages/public/Doctors.jsx'));
const DoctorProfile = lazy(() => import('../pages/public/DoctorProfile.jsx'));
const Treatments = lazy(() => import('../pages/public/Treatments.jsx'));
const Facilities = lazy(() => import('../pages/public/Facilities.jsx'));
const Emergency = lazy(() => import('../pages/public/Emergency.jsx'));
const Gallery = lazy(() => import('../pages/public/Gallery.jsx'));
const Testimonials = lazy(() => import('../pages/public/Testimonials.jsx'));
const Blogs = lazy(() => import('../pages/public/Blogs.jsx'));
const Careers = lazy(() => import('../pages/public/Careers.jsx'));
const Contact = lazy(() => import('../pages/public/Contact.jsx'));
const Faq = lazy(() => import('../pages/public/Faq.jsx'));
const Privacy = lazy(() => import('../pages/public/Privacy.jsx'));
const Terms = lazy(() => import('../pages/public/Terms.jsx'));

const Login = lazy(() => import('../pages/auth/Login.jsx'));
const Register = lazy(() => import('../pages/auth/Register.jsx'));
const ForgotPassword = lazy(() => import('../pages/auth/ForgotPassword.jsx'));

const AdminDashboard = lazy(() => import('../pages/dashboard/AdminDashboard.jsx'));
const DoctorDashboard = lazy(() => import('../pages/dashboard/DoctorDashboard.jsx'));
const PatientDashboard = lazy(() => import('../pages/dashboard/PatientDashboard.jsx'));
const ReceptionDashboard = lazy(() => import('../pages/dashboard/ReceptionDashboard.jsx'));
const NurseDashboard = lazy(() => import('../pages/dashboard/NurseDashboard.jsx'));
const LabDashboard = lazy(() => import('../pages/dashboard/LabDashboard.jsx'));
const PharmacyDashboard = lazy(() => import('../pages/dashboard/PharmacyDashboard.jsx'));
const AccountingDashboard = lazy(() => import('../pages/dashboard/AccountingDashboard.jsx'));
const EmergencyDashboard = lazy(() => import('../pages/dashboard/emergency/EmergencyDashboard.jsx'));
const EmergencyRegister = lazy(() => import('../pages/dashboard/emergency/EmergencyRegister.jsx'));
const EmergencyQueue = lazy(() => import('../pages/dashboard/emergency/EmergencyQueue.jsx'));
const EmergencyAmbulances = lazy(() => import('../pages/dashboard/emergency/EmergencyAmbulances.jsx'));
const EmergencyBeds = lazy(() => import('../pages/dashboard/emergency/EmergencyBeds.jsx'));

const Appointments = lazy(() => import('../pages/dashboard/shared/Appointments.jsx'));
const BookAppointment = lazy(() => import('../pages/dashboard/shared/BookAppointment.jsx'));
const MedicalRecords = lazy(() => import('../pages/dashboard/shared/MedicalRecords.jsx'));
const Prescriptions = lazy(() => import('../pages/dashboard/shared/Prescriptions.jsx'));
const LabReports = lazy(() => import('../pages/dashboard/shared/LabReports.jsx'));
const Invoices = lazy(() => import('../pages/dashboard/shared/Invoices.jsx'));
const Patients = lazy(() => import('../pages/dashboard/shared/Patients.jsx'));
const PatientDetail = lazy(() => import('../pages/dashboard/shared/PatientDetail.jsx'));
const DoctorsMgmt = lazy(() => import('../pages/dashboard/shared/DoctorsMgmt.jsx'));
const DepartmentsMgmt = lazy(() => import('../pages/dashboard/shared/DepartmentsMgmt.jsx'));
const BloodBank = lazy(() => import('../pages/dashboard/shared/BloodBank.jsx'));
const BedManagement = lazy(() => import('../pages/dashboard/shared/BedManagement.jsx'));
const PharmacyMgmt = lazy(() => import('../pages/dashboard/shared/PharmacyMgmt.jsx'));
const Settings = lazy(() => import('../pages/dashboard/shared/Settings.jsx'));
const Profile = lazy(() => import('../pages/dashboard/shared/Profile.jsx'));
const AuditLogs = lazy(() => import('../pages/dashboard/shared/AuditLogs.jsx'));
const Analytics = lazy(() => import('../pages/dashboard/shared/Analytics.jsx'));
const StaffMgmt = lazy(() => import('../pages/dashboard/shared/StaffMgmt.jsx'));
const AmbulanceMgmt = lazy(() => import('../pages/dashboard/shared/AmbulanceMgmt.jsx'));
const EquipmentMgmt = lazy(() => import('../pages/dashboard/shared/EquipmentMgmt.jsx'));

const LabSampleCollection = lazy(() => import('../pages/dashboard/lab/SampleCollection.jsx'));
const LabPendingTests = lazy(() => import('../pages/dashboard/lab/PendingTests.jsx'));
const LabProcessingTests = lazy(() => import('../pages/dashboard/lab/ProcessingTests.jsx'));
const LabCompletedTests = lazy(() => import('../pages/dashboard/lab/CompletedTests.jsx'));
const LabReportVerification = lazy(() => import('../pages/dashboard/lab/ReportVerification.jsx'));
const LabApprovedReports = lazy(() => import('../pages/dashboard/lab/ApprovedReports.jsx'));
const LabEquipmentPage = lazy(() => import('../pages/dashboard/lab/LabEquipment.jsx'));
const LabBloodCollection = lazy(() => import('../pages/dashboard/lab/BloodCollection.jsx'));
const LabECG = lazy(() => import('../pages/dashboard/lab/ECGRoom.jsx'));
const LabXRay = lazy(() => import('../pages/dashboard/lab/XRayRoom.jsx'));
const LabCTScan = lazy(() => import('../pages/dashboard/lab/CTScanRoom.jsx'));
const LabMRI = lazy(() => import('../pages/dashboard/lab/MRIRoom.jsx'));
const LabUltrasound = lazy(() => import('../pages/dashboard/lab/UltrasoundRoom.jsx'));
const LabPathology = lazy(() => import('../pages/dashboard/lab/PathologyLab.jsx'));
const LabMicrobiology = lazy(() => import('../pages/dashboard/lab/MicrobiologyLab.jsx'));
const LabBiochemistry = lazy(() => import('../pages/dashboard/lab/BiochemistryLab.jsx'));
const LabHematology = lazy(() => import('../pages/dashboard/lab/HematologyLab.jsx'));

const LabHome = lazy(() => import('../pages/public/lab/LabHome.jsx'));
const BookLabTest = lazy(() => import('../pages/public/lab/BookLabTest.jsx'));
const HealthPackages = lazy(() => import('../pages/public/lab/HealthPackages.jsx'));
const TestCategories = lazy(() => import('../pages/public/lab/TestCategories.jsx'));
const TrackTest = lazy(() => import('../pages/public/lab/TrackTest.jsx'));
const DownloadReport = lazy(() => import('../pages/public/lab/DownloadReport.jsx'));
const LabLocations = lazy(() => import('../pages/public/lab/LabLocations.jsx'));
const LabContact = lazy(() => import('../pages/public/lab/LabContact.jsx'));

const Fallback = () => (
  <div className="grid min-h-[60vh] place-items-center">
    <div className="flex flex-col items-center gap-4">
      <Logo />
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
    </div>
  </div>
);


export default function AppRoutes() {
  return (
    <>
      <ScrollToTop />
      <Suspense fallback={<Fallback />}>
        <Routes>
          {/* Public */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Landing />} />
            <Route path="/about" element={<About />} />
            <Route path="/departments" element={<Departments />} />
            <Route path="/departments/:id" element={<DepartmentDetail />} />
            <Route path="/doctors" element={<Doctors />} />
            <Route path="/doctors/:id" element={<DoctorProfile />} />
            <Route path="/treatments" element={<Treatments />} />
            <Route path="/facilities" element={<Facilities />} />
            <Route path="/emergency" element={<Emergency />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/testimonials" element={<Testimonials />} />
            <Route path="/blogs" element={<Blogs />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/contact" element={<Contact />} />

            {/* Public Laboratory routes */}
            <Route path="/lab" element={<LabHome />} />
            <Route path="/lab/book-test" element={<BookLabTest />} />
            <Route path="/lab/packages" element={<HealthPackages />} />
            <Route path="/lab/categories" element={<TestCategories />} />
            <Route path="/lab/track" element={<TrackTest />} />
            <Route path="/lab/download" element={<DownloadReport />} />
            <Route path="/lab/locations" element={<LabLocations />} />
            <Route path="/lab/contact" element={<LabContact />} />
            <Route path="/faq" element={<Faq />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
          </Route>

          {/* Auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Dashboard */}
          <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
            <Route path="/dashboard" element={<RoleHome />} />
            <Route path="/dashboard/appointments" element={<ProtectedRoute><Appointments /></ProtectedRoute>} />
            <Route path="/dashboard/book-appointment" element={<ProtectedRoute roles={['patient','receptionist','hospital_admin']}><BookAppointment /></ProtectedRoute>} />
            <Route path="/dashboard/medical-records" element={<ProtectedRoute><MedicalRecords /></ProtectedRoute>} />
            <Route path="/dashboard/prescriptions" element={<ProtectedRoute><Prescriptions /></ProtectedRoute>} />
            <Route path="/dashboard/lab-reports" element={<ProtectedRoute><LabReports /></ProtectedRoute>} />
            <Route path="/dashboard/lab" element={<ProtectedRoute><LabDashboard /></ProtectedRoute>} />
            <Route path="/dashboard/lab/sample-collection" element={<ProtectedRoute><LabSampleCollection /></ProtectedRoute>} />
            <Route path="/dashboard/lab/pending" element={<ProtectedRoute><LabPendingTests /></ProtectedRoute>} />
            <Route path="/dashboard/lab/processing" element={<ProtectedRoute><LabProcessingTests /></ProtectedRoute>} />
            <Route path="/dashboard/lab/completed" element={<ProtectedRoute><LabCompletedTests /></ProtectedRoute>} />
            <Route path="/dashboard/lab/verification" element={<ProtectedRoute><LabReportVerification /></ProtectedRoute>} />
            <Route path="/dashboard/lab/approved" element={<ProtectedRoute><LabApprovedReports /></ProtectedRoute>} />
            <Route path="/dashboard/lab/equipment" element={<ProtectedRoute><LabEquipmentPage /></ProtectedRoute>} />
            <Route path="/dashboard/lab/blood-collection" element={<ProtectedRoute><LabBloodCollection /></ProtectedRoute>} />
            <Route path="/dashboard/lab/ecg" element={<ProtectedRoute><LabECG /></ProtectedRoute>} />
            <Route path="/dashboard/lab/xray" element={<ProtectedRoute><LabXRay /></ProtectedRoute>} />
            <Route path="/dashboard/lab/ct-scan" element={<ProtectedRoute><LabCTScan /></ProtectedRoute>} />
            <Route path="/dashboard/lab/mri" element={<ProtectedRoute><LabMRI /></ProtectedRoute>} />
            <Route path="/dashboard/lab/ultrasound" element={<ProtectedRoute><LabUltrasound /></ProtectedRoute>} />
            <Route path="/dashboard/lab/pathology" element={<ProtectedRoute><LabPathology /></ProtectedRoute>} />
            <Route path="/dashboard/lab/microbiology" element={<ProtectedRoute><LabMicrobiology /></ProtectedRoute>} />
            <Route path="/dashboard/lab/biochemistry" element={<ProtectedRoute><LabBiochemistry /></ProtectedRoute>} />
            <Route path="/dashboard/lab/hematology" element={<ProtectedRoute><LabHematology /></ProtectedRoute>} />
            <Route path="/dashboard/invoices" element={<ProtectedRoute><Invoices /></ProtectedRoute>} />
            <Route path="/dashboard/patients" element={<ProtectedRoute roles={['super_admin','hospital_admin','doctor','receptionist','nurse']}><Patients /></ProtectedRoute>} />
            <Route path="/dashboard/patients/:id" element={<ProtectedRoute roles={['super_admin','hospital_admin','doctor','receptionist','nurse']}><PatientDetail /></ProtectedRoute>} />
            <Route path="/dashboard/doctors" element={<ProtectedRoute roles={['super_admin','hospital_admin','receptionist']}><DoctorsMgmt /></ProtectedRoute>} />
            <Route path="/dashboard/departments" element={<ProtectedRoute roles={['super_admin','hospital_admin']}><DepartmentsMgmt /></ProtectedRoute>} />
            <Route path="/dashboard/blood-bank" element={<ProtectedRoute roles={['super_admin','hospital_admin','receptionist']}><BloodBank /></ProtectedRoute>} />
            <Route path="/dashboard/beds" element={<ProtectedRoute roles={['super_admin','hospital_admin','receptionist','nurse']}><BedManagement /></ProtectedRoute>} />
            <Route path="/dashboard/pharmacy" element={<ProtectedRoute roles={['super_admin','hospital_admin','pharmacist']}><PharmacyMgmt /></ProtectedRoute>} />
            <Route path="/dashboard/staff" element={<ProtectedRoute roles={['super_admin','hospital_admin']}><StaffMgmt /></ProtectedRoute>} />
            <Route path="/dashboard/ambulances" element={<ProtectedRoute roles={['super_admin','hospital_admin','receptionist']}><AmbulanceMgmt /></ProtectedRoute>} />
            <Route path="/dashboard/equipment" element={<ProtectedRoute roles={['super_admin','hospital_admin','lab_technician']}><EquipmentMgmt /></ProtectedRoute>} />
            <Route path="/dashboard/analytics" element={<ProtectedRoute roles={['super_admin','hospital_admin','accountant']}><Analytics /></ProtectedRoute>} />
            <Route path="/dashboard/audit-logs" element={<ProtectedRoute roles={['super_admin','hospital_admin']}><AuditLogs /></ProtectedRoute>} />
            <Route path="/dashboard/settings" element={<ProtectedRoute roles={['super_admin','hospital_admin']}><Settings /></ProtectedRoute>} />
            <Route path="/dashboard/profile" element={<Profile />} />
            <Route path="/dashboard/emergency" element={<ProtectedRoute><EmergencyDashboard /></ProtectedRoute>} />
            <Route path="/dashboard/emergency/register" element={<ProtectedRoute><EmergencyRegister /></ProtectedRoute>} />
            <Route path="/dashboard/emergency/queue" element={<ProtectedRoute><EmergencyQueue /></ProtectedRoute>} />
            <Route path="/dashboard/emergency/ambulances" element={<ProtectedRoute><EmergencyAmbulances /></ProtectedRoute>} />
            <Route path="/dashboard/emergency/beds" element={<ProtectedRoute><EmergencyBeds /></ProtectedRoute>} />
          </Route>
        </Routes>
      </Suspense>
    </>
  );
}

import { useSelector } from 'react-redux';
function RoleHome() {
  const { user } = useSelector((s) => s.auth);
  const map = {
    super_admin: <AdminDashboard />, hospital_admin: <AdminDashboard />,
    doctor: <DoctorDashboard />, receptionist: <ReceptionDashboard />,
    nurse: <NurseDashboard />, lab_technician: <LabDashboard />,
    pharmacist: <PharmacyDashboard />, accountant: <AccountingDashboard />,
    patient: <PatientDashboard />,
    emergency: <EmergencyDashboard />,
  };
  return map[user?.role] || <AdminDashboard />;
}
