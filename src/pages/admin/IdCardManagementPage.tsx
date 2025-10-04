import IdCardManagement from '../../components/IdCardManagement';
import ErrorBoundary from '../../components/ErrorBoundary';

const IdCardManagementPage = () => {
  // The sidebar state is managed by AdminLayout, so we don't need to pass it here
  // The IdCardManagement component will use CSS to detect the sidebar state
  return (
    <ErrorBoundary>
      <IdCardManagement />
    </ErrorBoundary>
  );
};

export default IdCardManagementPage;
