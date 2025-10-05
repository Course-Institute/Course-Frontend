# Global Infinite Scroll Usage Guide

This guide explains how to use the global infinite scroll system that can be implemented anywhere in your application.

## Overview

The infinite scroll system consists of:
- **`useInfiniteScroll`** - Core scroll detection hook
- **`useInfiniteData`** - Data fetching with React Query
- **`InfiniteScrollContainer`** - Reusable container component
- **Utility functions** - Helper functions for data manipulation

## Basic Usage

### 1. Simple Infinite Scroll with Container

```tsx
import InfiniteScrollContainer from '../components/InfiniteScrollContainer';
import { useInfiniteStudents } from '../hooks/useInfiniteStudents';

const MyComponent = () => {
  const {
    data: students,
    isLoading,
    isError,
    error,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    refetch
  } = useInfiniteStudents({}, 10);

  return (
    <InfiniteScrollContainer
      onLoadMore={fetchNextPage}
      hasNextPage={hasNextPage}
      isLoading={isLoading}
      isFetchingNextPage={isFetchingNextPage}
      error={isError ? error?.message : null}
      onRetry={refetch}
      height="100%"
      maxHeight="600px"
      loadingText="Loading more students..."
      errorText="Failed to load students"
      noMoreDataText="No more students to load"
      showScrollToTop={true}
    >
      {/* Your content here */}
      {students?.map(student => (
        <div key={student._id}>{student.candidateName}</div>
      ))}
    </InfiniteScrollContainer>
  );
};
```

### 2. Custom Infinite Scroll Hook

```tsx
import { useInfiniteData } from '../hooks/useInfiniteData';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';

const MyComponent = () => {
  const {
    data,
    isLoading,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage
  } = useInfiniteData({
    queryKey: ['myData', 'infinite'],
    queryFn: ({ pageParam }) => fetchMyData(pageParam),
    getNextPageParam: (lastPage) => lastPage.hasNextPage ? lastPage.page + 1 : undefined,
    initialPageParam: 1
  });

  const { handleScroll } = useInfiniteScroll(fetchNextPage, {
    threshold: 100,
    debounceMs: 100,
    enabled: hasNextPage && !isFetchingNextPage
  });

  return (
    <div onScroll={handleScroll} style={{ height: '400px', overflow: 'auto' }}>
      {data?.map(item => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  );
};
```

## Advanced Usage

### 1. Custom Data Hook

```tsx
// src/hooks/useInfiniteMyData.ts
import { useInfinitePaginatedData } from './useInfiniteData';
import { createInfiniteQueryKey } from '../utils/infiniteScrollUtils';

export const useInfiniteMyData = (filters: MyFilters = {}) => {
  const queryKey = createInfiniteQueryKey('myData', filters);
  
  return useInfinitePaginatedData(
    queryKey,
    async (page: number) => {
      const response = await fetchMyDataAPI(page, 10, filters);
      return {
        data: response.items,
        pagination: response.pagination
      };
    },
    {
      enabled: true,
      staleTime: 5 * 60 * 1000
    }
  );
};
```

### 2. Deduplicated Data

```tsx
import { useInfiniteDeduplicatedData } from '../hooks/useInfiniteData';

const MyComponent = () => {
  const { data, isLoading, fetchNextPage } = useInfiniteDeduplicatedData(
    ['posts', 'infinite'],
    fetchPosts,
    (lastPage) => lastPage.hasNextPage ? lastPage.page + 1 : undefined,
    1,
    'id' // dedupe key
  );

  return (
    <div>
      {data?.map(post => (
        <div key={post.id}>{post.title}</div>
      ))}
    </div>
  );
};
```

### 3. Custom Scroll Container

```tsx
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import { Box, CircularProgress } from '@mui/material';

const CustomScrollContainer = ({ children, onLoadMore, hasNextPage, isLoading }) => {
  const { handleScroll, isNearBottom } = useInfiniteScroll(onLoadMore, {
    threshold: 50,
    debounceMs: 200
  });

  return (
    <Box
      onScroll={handleScroll}
      sx={{
        height: '400px',
        overflow: 'auto',
        border: '1px solid #ccc',
        borderRadius: 2
      }}
    >
      {children}
      {isNearBottom && hasNextPage && !isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
          <CircularProgress size={24} />
        </Box>
      )}
    </Box>
  );
};
```

## API Reference

### useInfiniteScroll

```tsx
const {
  isNearBottom,
  hasScrolled,
  scrollToTop,
  scrollToBottom,
  sentinelRef
} = useInfiniteScroll(onLoadMore, options);
```

**Options:**
- `threshold: number` - Distance from bottom to trigger load (default: 100)
- `debounceMs: number` - Debounce delay for scroll events (default: 100)
- `rootMargin: string` - Intersection observer root margin (default: '0px')
- `enabled: boolean` - Whether infinite scroll is enabled (default: true)

### useInfiniteData

```tsx
const {
  data,
  isLoading,
  isError,
  error,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  refetch,
  totalCount,
  currentPage,
  totalPages
} = useInfiniteData(options);
```

**Options:**
- `queryKey: array` - React Query key
- `queryFn: function` - Function to fetch data
- `getNextPageParam: function` - Function to get next page parameter
- `initialPageParam: any` - Initial page parameter
- `enabled: boolean` - Whether query is enabled
- `staleTime: number` - Data stale time in ms
- `refetchOnWindowFocus: boolean` - Refetch on window focus
- `retry: number | boolean` - Retry configuration

### InfiniteScrollContainer

```tsx
<InfiniteScrollContainer
  onLoadMore={fetchNextPage}
  hasNextPage={hasNextPage}
  isLoading={isLoading}
  isFetchingNextPage={isFetchingNextPage}
  error={error}
  onRetry={refetch}
  threshold={100}
  debounceMs={100}
  enabled={true}
  showScrollToTop={true}
  showScrollToBottom={false}
  loadingText="Loading more..."
  errorText="Failed to load data"
  noMoreDataText="No more data to load"
  scrollBehavior="smooth"
  height="100%"
  maxHeight="600px"
>
  {children}
</InfiniteScrollContainer>
```

## Utility Functions

### Data Manipulation

```tsx
import { 
  deduplicateItems, 
  mergePages, 
  extractPaginationInfo 
} from '../utils/infiniteScrollUtils';

// Deduplicate items
const uniqueItems = deduplicateItems(items, 'id');

// Merge pages
const allData = mergePages(pages);

// Extract pagination info
const pagination = extractPaginationInfo(pages);
```

### Scroll Management

```tsx
import { 
  getScrollPosition, 
  smoothScrollTo, 
  scrollToElement 
} from '../utils/infiniteScrollUtils';

// Get scroll position
const position = getScrollPosition(element);

// Smooth scroll
smoothScrollTo(element, 'top', 'smooth');

// Scroll to element
scrollToElement(container, targetElement, 'smooth', 50);
```

## Best Practices

1. **Use the container component** for most cases - it handles all the complexity
2. **Implement proper error handling** with retry functionality
3. **Use debouncing** to prevent excessive API calls
4. **Deduplicate data** when necessary to avoid duplicates
5. **Provide loading states** for better UX
6. **Use appropriate thresholds** based on your content size
7. **Test with different screen sizes** and content lengths

## Examples for Different Use Cases

### 1. Student List (Current Implementation)
```tsx
const StudentTable = () => {
  const { data: students, ... } = useInfiniteStudents(filters, 10);
  
  return (
    <InfiniteScrollContainer {...props}>
      <Table>
        {students?.map(student => <TableRow key={student._id} />)}
      </Table>
    </InfiniteScrollContainer>
  );
};
```

### 2. Post Feed
```tsx
const PostFeed = () => {
  const { data: posts, ... } = useInfinitePosts(filters);
  
  return (
    <InfiniteScrollContainer {...props}>
      {posts?.map(post => <PostCard key={post.id} post={post} />)}
    </InfiniteScrollContainer>
  );
};
```

### 3. Product Grid
```tsx
const ProductGrid = () => {
  const { data: products, ... } = useInfiniteProducts(filters);
  
  return (
    <InfiniteScrollContainer {...props}>
      <Grid container>
        {products?.map(product => (
          <Grid item key={product.id}>
            <ProductCard product={product} />
          </Grid>
        ))}
      </Grid>
    </InfiniteScrollContainer>
  );
};
```

This global infinite scroll system provides a robust, reusable solution that can be implemented anywhere in your application with minimal configuration.
