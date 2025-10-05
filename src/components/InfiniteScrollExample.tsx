import { Box, Typography, Card, CardContent, Grid } from '@mui/material';
import InfiniteScrollContainer from './InfiniteScrollContainer';
import { useInfiniteStudents } from '../hooks/useInfiniteStudents';

/**
 * Example component demonstrating how to use the global infinite scroll system
 * This can be used as a reference for implementing infinite scroll anywhere
 */
const InfiniteScrollExample = () => {
  const {
    data: studentsData,
    isLoading,
    isError,
    error,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    refetch
  } = useInfiniteStudents({}, 5); // Load 5 students at a time for demo

  // The useInfiniteData hook already returns flattened data
  const students = studentsData || [];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, textAlign: 'center' }}>
        Global Infinite Scroll Example
      </Typography>
      
      <Typography variant="body1" sx={{ mb: 3, textAlign: 'center', color: 'text.secondary' }}>
        This demonstrates the global infinite scroll system. Scroll down to load more students.
      </Typography>

      <InfiniteScrollContainer
        onLoadMore={fetchNextPage}
        hasNextPage={hasNextPage}
        isLoading={isLoading}
        isFetchingNextPage={isFetchingNextPage}
        error={isError ? error?.message : null}
        onRetry={refetch}
        height="500px"
        maxHeight="600px"
        loadingText="Loading more students..."
        errorText="Failed to load students"
        noMoreDataText="No more students to load"
        showScrollToTop={true}
        sx={{
          border: '2px dashed #e0e0e0',
          borderRadius: 2,
          p: 2
        }}
      >
        <Grid container spacing={2}>
          {students?.map((student: any) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={student._id}>
              <Card
                sx={{
                  height: '100%',
                  transition: 'transform 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: 3
                  }
                }}
              >
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {student.candidateName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {student.registrationNo}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Course:</strong> {student.course}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Faculty:</strong> {student.faculty}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Stream:</strong> {student.stream}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Year:</strong> {student.year}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Session:</strong> {student.session}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Contact:</strong> {student.contactNumber}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </InfiniteScrollContainer>

      <Box sx={{ mt: 3, p: 2, backgroundColor: 'grey.50', borderRadius: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          How to Use This Global Infinite Scroll:
        </Typography>
        <Typography variant="body2" component="div" sx={{ mb: 1 }}>
          1. <strong>Import the components:</strong>
          <pre style={{ backgroundColor: '#f5f5f5', padding: '8px', borderRadius: '4px', margin: '4px 0' }}>
{`import InfiniteScrollContainer from './InfiniteScrollContainer';
import { useInfiniteStudents } from '../hooks/useInfiniteStudents';`}
          </pre>
        </Typography>
        <Typography variant="body2" component="div" sx={{ mb: 1 }}>
          2. <strong>Use the hook to get data:</strong>
          <pre style={{ backgroundColor: '#f5f5f5', padding: '8px', borderRadius: '4px', margin: '4px 0' }}>
{`const {
  data: students,
  isLoading,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  refetch
} = useInfiniteStudents(filters, limit);`}
          </pre>
        </Typography>
        <Typography variant="body2" component="div" sx={{ mb: 1 }}>
          3. <strong>Wrap your content with InfiniteScrollContainer:</strong>
          <pre style={{ backgroundColor: '#f5f5f5', padding: '8px', borderRadius: '4px', margin: '4px 0' }}>
{`<InfiniteScrollContainer
  onLoadMore={fetchNextPage}
  hasNextPage={hasNextPage}
  isLoading={isLoading}
  isFetchingNextPage={isFetchingNextPage}
  error={error}
  onRetry={refetch}
  height="500px"
  showScrollToTop={true}
>
  {students?.map(student => <YourComponent key={student._id} />)}
</InfiniteScrollContainer>`}
          </pre>
        </Typography>
      </Box>
    </Box>
  );
};

export default InfiniteScrollExample;
