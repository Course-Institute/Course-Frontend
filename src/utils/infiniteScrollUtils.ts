/**
 * Utility functions for infinite scroll functionality
 * Provides helper functions for data manipulation, deduplication, and scroll management
 */

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  limit: number;
}

export interface ApiResponse<T> {
  data: T[];
  pagination: PaginationInfo;
}

/**
 * Deduplicates an array of items based on a key field
 */
export const deduplicateItems = <T>(
  items: T[],
  keyField: keyof T = 'id' as keyof T
): T[] => {
  const seen = new Set();
  return items.filter(item => {
    const key = item[keyField];
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
};

/**
 * Merges multiple pages of data into a single array
 */
export const mergePages = <T>(pages: T[][]): T[] => {
  return pages.flat();
};

/**
 * Extracts pagination info from the last page of data
 */
export const extractPaginationInfo = <T>(
  pages: T[],
  paginationField: keyof T = 'pagination' as keyof T
): PaginationInfo | null => {
  if (!pages || pages.length === 0) return null;

  const lastPage = pages[pages.length - 1];
  
  if (lastPage && typeof lastPage === 'object') {
    const pageObj = lastPage as any;
    
    // Check for pagination object
    if (pageObj[paginationField]) {
      return pageObj[paginationField];
    }
    
    // Check for direct pagination properties
    if (pageObj.totalCount !== undefined) {
      return {
        currentPage: pageObj.currentPage || 1,
        totalPages: pageObj.totalPages || 1,
        totalCount: pageObj.totalCount,
        hasNextPage: pageObj.hasNextPage || false,
        hasPrevPage: pageObj.hasPrevPage || false,
        limit: pageObj.limit || 10
      };
    }
  }

  return null;
};

/**
 * Creates a debounced function
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Creates a throttled function
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

/**
 * Calculates scroll position relative to bottom
 */
export const getScrollPosition = (element: HTMLElement) => {
  const { scrollTop, scrollHeight, clientHeight } = element;
  const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
  const scrollPercentage = (scrollTop / (scrollHeight - clientHeight)) * 100;
  
  return {
    scrollTop,
    scrollHeight,
    clientHeight,
    distanceFromBottom,
    scrollPercentage,
    isNearBottom: distanceFromBottom <= 100,
    isAtTop: scrollTop === 0,
    isAtBottom: distanceFromBottom <= 1
  };
};

/**
 * Smooth scroll to a specific position
 */
export const smoothScrollTo = (
  element: HTMLElement,
  position: 'top' | 'bottom' | number,
  behavior: ScrollBehavior = 'smooth'
) => {
  const scrollOptions: ScrollToOptions = {
    behavior,
    top: position === 'top' ? 0 : position === 'bottom' ? element.scrollHeight : position
  };
  
  element.scrollTo(scrollOptions);
};

/**
 * Scrolls to a specific element within a container
 */
export const scrollToElement = (
  container: HTMLElement,
  targetElement: HTMLElement,
  behavior: ScrollBehavior = 'smooth',
  offset: number = 0
) => {
  const containerRect = container.getBoundingClientRect();
  const targetRect = targetElement.getBoundingClientRect();
  const relativeTop = targetRect.top - containerRect.top + container.scrollTop;
  
  container.scrollTo({
    top: relativeTop - offset,
    behavior
  });
};

/**
 * Creates a scroll event handler with debouncing
 */
export const createScrollHandler = (
  callback: (event: React.UIEvent<HTMLDivElement>) => void,
  debounceMs: number = 100
) => {
  const debouncedCallback = debounce(callback, debounceMs);
  
  return (event: React.UIEvent<HTMLDivElement>) => {
    debouncedCallback(event);
  };
};

/**
 * Validates if infinite scroll should trigger
 */
export const shouldTriggerInfiniteScroll = (
  scrollPosition: ReturnType<typeof getScrollPosition>,
  threshold: number = 100,
  hasNextPage: boolean = true,
  isLoading: boolean = false
): boolean => {
  return (
    scrollPosition.isNearBottom &&
    hasNextPage &&
    !isLoading &&
    scrollPosition.distanceFromBottom <= threshold
  );
};

/**
 * Creates a query key for infinite queries
 */
export const createInfiniteQueryKey = (
  baseKey: string,
  filters?: Record<string, any>
): (string | number | boolean | object)[] => {
  const key: (string | number | boolean | object)[] = [baseKey, 'infinite'];
  
  if (filters) {
    key.push(filters);
  }
  
  return key;
};

/**
 * Extracts data from different API response formats
 */
export const extractDataFromResponse = <T>(
  response: any,
  dataPath?: string
): T[] => {
  if (!response) return [];
  
  // If dataPath is provided, use it
  if (dataPath) {
    const pathParts = dataPath.split('.');
    let data = response;
    
    for (const part of pathParts) {
      if (data && typeof data === 'object' && part in data) {
        data = data[part];
      } else {
        return [];
      }
    }
    
    return Array.isArray(data) ? data : [];
  }
  
  // Try common data field names
  const commonDataFields = ['data', 'items', 'results', 'students', 'users', 'posts'];
  
  for (const field of commonDataFields) {
    if (response[field] && Array.isArray(response[field])) {
      return response[field];
    }
  }
  
  // If response is already an array
  if (Array.isArray(response)) {
    return response;
  }
  
  return [];
};

/**
 * Creates a next page parameter function for common pagination patterns
 */
export const createNextPageParam = (
  paginationField: string = 'pagination'
) => {
  return (lastPage: any) => {
    const pagination = lastPage[paginationField];
    return pagination?.hasNextPage ? pagination.currentPage + 1 : undefined;
  };
};

/**
 * Formats pagination info for display
 */
export const formatPaginationInfo = (pagination: PaginationInfo): string => {
  const { currentPage, totalPages, totalCount } = pagination;
  return `Page ${currentPage} of ${totalPages} (${totalCount} total items)`;
};

/**
 * Creates a loading state object
 */
export const createLoadingState = (isLoading: boolean, isFetchingNextPage: boolean) => ({
  isLoading,
  isFetchingNextPage,
  isInitialLoading: isLoading && !isFetchingNextPage,
  isRefreshing: isLoading && isFetchingNextPage
});
