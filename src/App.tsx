import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CoursesPage from './pages/CoursesPage';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';
import AboutUsPage from './pages/AboutUsPage';
import ProgramsPage from './pages/ProgramsPage';
import ProgramDetailPage from './pages/ProgramDetailPage';
import AlumniPage from './pages/AlumniPage';
import AffiliationPage from './pages/AffiliationPage';
import ContactUsPage from './pages/ContactUsPage';
import VerificationPage from './pages/VerificationPage';
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
import CreateBillReceiptPage from './pages/admin/CreateBillReceiptPage';
import ManageBillsPage from './pages/admin/ManageBillsPage';
import CenterDashboardPage from './pages/center/CenterDashboardPage';
import CenterAddStudentPage from './pages/center/CenterAddStudentPage';
import CenterCreateBillPage from './pages/center/CenterCreateBillPage';
import CenterManageBillsPage from './pages/center/CenterManageBillsPage';
import CenterManageStudentsPage from './pages/center/CenterManageStudentsPage';
import ErrorBoundary from './components/ErrorBoundary';
import { ToastProvider } from './contexts/ToastContext';
import CenterUploadResultsPage from './pages/center/CenterUploadResultsPage';
import AddMarksheetPageAdmin from './pages/admin/AddMarksheetPage';
import AddMarksheetPageCenter from './pages/center/AddMarksheetPage';
import EnquiryListPage from './pages/admin/EnquiryListPage';
import StudentMarksheetPage from './pages/student/StudentMarksheetPage';
import ViewMarksheetPage from './pages/admin/ViewMarksheetPage';
import CenterViewMarksheetPage from './pages/center/ViewMarksheetPage';
import EditStudentPage from './pages/admin/EditStudentPage';

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
          <Route path="/programs/:programId" element={<ProgramDetailPage />} />
          <Route path="/alumni" element={<AlumniPage />} />
          <Route path="/affiliation" element={<AffiliationPage />} />
          <Route path="/verification" element={<VerificationPage />} />
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
          <Route path="/admin/create-bill" element={
            <AdminLayout title="CREATE BILL RECEIPT">
              <CreateBillReceiptPage />
            </AdminLayout>
          } />
          <Route path="/admin/bills" element={
            <AdminLayout title="MANAGE BILLS">
              <ManageBillsPage />
            </AdminLayout>
          } />
          <Route path="/admin/add-marksheet" element={
            <AdminLayout title="ADD MARKSHEET">
              <AddMarksheetPageAdmin />
            </AdminLayout>
          } />
          <Route path="/admin/enquiry-list" element={
            <AdminLayout title="ENQUIRY LIST">
              <EnquiryListPage />
            </AdminLayout>
          } />
          <Route path="/admin/view-marksheet/:marksheetId" element={
            <AdminLayout title="VIEW MARKSHEET">
              <ViewMarksheetPage />
            </AdminLayout>
          } />
          <Route path="/admin/edit-student/:id" element={
            <AdminLayout title="EDIT STUDENT">
              <EditStudentPage />
            </AdminLayout>
          } />

          {/* Student Routes */}
          <Route path="/student-dashboard" element={<StudentProfilePage />} />
          <Route path="/student/marksheet" element={<StudentMarksheetPage />} />

          {/* Center Routes with Layout */}
          <Route path="/center-dashboard" element={
            <CenterLayout title="Center Dashboard">
              <CenterDashboardPage />
            </CenterLayout>
          } />
          <Route path="/center/add-student" element={
            <CenterLayout title="ADD STUDENT">
              <CenterAddStudentPage />
            </CenterLayout>
          } />
          <Route path="/center/upload-results" element={
            <CenterLayout title="UPLOAD RESULTS">
              <CenterUploadResultsPage />
            </CenterLayout>
          } />
          <Route path="/center/create-bill" element={
            <CenterLayout title="CREATE BILL RECEIPT">
              <CenterCreateBillPage />
            </CenterLayout>
          } />
          <Route path="/center/bills" element={
            <CenterLayout title="MANAGE BILLS">
              <CenterManageBillsPage />
            </CenterLayout>
          } />
          <Route path="/center/students" element={
            <CenterLayout title="MANAGE STUDENTS">
              <CenterManageStudentsPage />
            </CenterLayout>
          } />
          <Route path="/center/add-marksheet" element={
            <CenterLayout title="ADD MARKSHEET">
              <AddMarksheetPageCenter />
            </CenterLayout>
          } />
          <Route path="/center/view-marksheet/:marksheetId" element={
            <CenterLayout title="VIEW MARKSHEET">
              <CenterViewMarksheetPage />
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
