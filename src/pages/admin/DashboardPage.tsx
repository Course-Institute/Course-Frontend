import DashboardContent from '../../components/admin/DashboardContent';
import ErrorBoundary from '../../components/ErrorBoundary';

const DashboardPage = () => {
  return (
    <ErrorBoundary>
      <DashboardContent />
    </ErrorBoundary>
  );
};

export default DashboardPage;
