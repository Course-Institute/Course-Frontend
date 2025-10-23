import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CoursesPage from './pages/CoursesPage';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';
import AboutUsPage from './pages/AboutUsPage';
import ProgramsPage from './pages/ProgramsPage';
import AlumniPage from './pages/AlumniPage';
import AffiliationPage from './pages/AffiliationPage';
import ContactUsPage from './pages/ContactUsPage';
import AdminLayout from './components/admin/AdminLayout';
import CenterLayout from './components/center/CenterLayout';
import DashboardPage from './pages/admin/DashboardPage';
import AddStudentPage from './pages/admin/AddStudentPage';
import ManageStudentsPage from './pages/admin/ManageStudentsPage';
import IdCardManagementPage from './pages/admin/IdCardManagementPage';
import IdCardGenerationPage from './pages/admin/IdCardGenerationPage';
import PaymentTrackingPage from './pages/admin/PaymentTrackingPage';
import UploadResultsPage from './pages/admin/UploadResultsPage';
import CenterManagementPage from './pages/admin/CenterManagementPage';
import ReportsDashboardPage from './pages/admin/ReportsDashboardPage';
import StudentProfilePage from './pages/student/StudentProfilePage';
import AddCenterPage from './pages/admin/AddCenterPage';
import CenterDashboardPage from './pages/center/CenterDashboardPage';
import ErrorBoundary from './components/ErrorBoundary';
import { ToastProvider } from './contexts/ToastContext';

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <ToastProvider>
          <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/about-us" element={<AboutUsPage />} />
          <Route path="/programs" element={<ProgramsPage />} />
          <Route path="/alumni" element={<AlumniPage />} />
          <Route path="/affiliation" element={<AffiliationPage />} />
          <Route path="/contact-us" element={<ContactUsPage />} />
          <Route path="/login" element={<LoginPage />} />
          
          {/* Admin Routes with Layout */}
          <Route path="/admin-dashboard" element={
            <AdminLayout title="Admin Dashboard">
              <DashboardPage />
            </AdminLayout>
          } />
          <Route path="/admin/add-student" element={
            <AdminLayout title="ADD STUDENT">
              <AddStudentPage />
            </AdminLayout>
          } />
          <Route path="/admin/students" element={
            <AdminLayout title="MANAGE STUDENTS">
              <ManageStudentsPage />
            </AdminLayout>
          } />
          <Route path="/admin/id-cards" element={
            <AdminLayout title="ID CARD MANAGEMENT">
              <IdCardManagementPage />
            </AdminLayout>
          } />
          <Route path="/admin/generate-id-card" element={<IdCardGenerationPage />} />
          <Route path="/admin/payments" element={
            <AdminLayout title="PAYMENT TRACKING">
              <PaymentTrackingPage />
            </AdminLayout>
          } />
          <Route path="/admin/upload-results" element={
            <AdminLayout title="UPLOAD RESULTS">
              <UploadResultsPage />
            </AdminLayout>
          } />
          <Route path="/admin/centers" element={
            <AdminLayout title="CENTER MANAGEMENT">
              <CenterManagementPage />
            </AdminLayout>
          } />
          <Route path="/admin/add-center" element={
            <AdminLayout title="ADD CENTER">
              <AddCenterPage />
            </AdminLayout>
          } />
          <Route path="/admin/reports" element={
            <AdminLayout title="REPORTS DASHBOARD">
              <ReportsDashboardPage />
            </AdminLayout>
          } />

          {/* Student Routes */}
          <Route path="/student-dashboard" element={<StudentProfilePage />} />

          {/* Center Routes with Layout */}
          <Route path="/center-dashboard" element={
            <CenterLayout title="Center Dashboard">
              <CenterDashboardPage />
            </CenterLayout>
          } />
          
          {/* 404 Route - Must be last */}
          <Route path="*" element={<NotFoundPage />} />
          </Routes>
        
        </ToastProvider>
    </Router>
    </ErrorBoundary>
  );
}

export default App;
