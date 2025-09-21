import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CoursesPage from './pages/CoursesPage';
import LoginPage from './pages/LoginPage';
import AdminLayout from './components/admin/AdminLayout';
import DashboardPage from './pages/admin/DashboardPage';
import ManageStudentsPage from './pages/admin/ManageStudentsPage';
import { SessionProvider } from './contexts/SessionContext';

function App() {
  return (
    <Router>
      <SessionProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/login" element={<LoginPage />} />
          
          {/* Admin Routes with Layout */}
          <Route path="/admin-dashboard" element={
            <AdminLayout title="Admin Dashboard">
              <DashboardPage />
            </AdminLayout>
          } />
          <Route path="/admin/students" element={
            <AdminLayout title="MANAGE STUDENTS">
              <ManageStudentsPage />
            </AdminLayout>
          } />
        </Routes>
      </SessionProvider>
    </Router>
  );
}

export default App;
