import { useCallback, useEffect, useRef, useState } from 'react';

export interface InfiniteScrollOptions {
  threshold?: number; // Distance from bottom to trigger load (in pixels)
  debounceMs?: number; // Debounce delay for scroll events
  rootMargin?: string; // Intersection observer root margin
  enabled?: boolean; // Whether infinite scroll is enabled
}

export interface InfiniteScrollReturn {
  isNearBottom: boolean;
  hasScrolled: boolean;
  scrollToTop: () => void;
  scrollToBottom: () => void;
  sentinelRef: React.RefObject<HTMLDivElement>;
}

/**
 * Global infinite scroll hook that can be used anywhere
 * Provides scroll detection with debouncing and intersection observer
 */
export const useInfiniteScroll = (
  onLoadMore: () => void,
  options: InfiniteScrollOptions = {}
): InfiniteScrollReturn => {
  const {
    rootMargin = '0px',
    enabled = true
  } = options;

  const [isNearBottom] = useState(false);
  const [hasScrolled] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // Debounced scroll handler (not used in intersection observer mode)
  // const handleScroll = useCallback(
  //   (event: React.UIEvent<HTMLDivElement>) => {
  //     if (!enabled) return;

  //     // Clear existing timeout
  //     if (debounceTimeoutRef.current) {
  //       clearTimeout(debounceTimeoutRef.current);
  //     }

  //     // Set new timeout
  //     debounceTimeoutRef.current = setTimeout(() => {
  //       const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
  //       const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
        
  //       setHasScrolled(scrollTop > 0);
  //       setIsNearBottom(distanceFromBottom <= threshold);

  //       if (distanceFromBottom <= threshold) {
  //         onLoadMore();
  //       }
  //     }, debounceMs);
  //   },
  //   [onLoadMore, threshold, debounceMs, enabled]
  // );

  // Intersection observer for more precise detection
  const setupIntersectionObserver = useCallback(() => {
    if (!enabled || !sentinelRef.current) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          onLoadMore();
        }
      },
      {
        rootMargin,
        threshold: 0.1
      }
    );

    observerRef.current.observe(sentinelRef.current);
  }, [onLoadMore, rootMargin, enabled]);

  // Cleanup function
  const cleanup = useCallback(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }
  }, []);

  // Scroll utility functions
  const scrollToTop = useCallback(() => {
    if (sentinelRef.current?.parentElement) {
      sentinelRef.current.parentElement.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }, []);

  const scrollToBottom = useCallback(() => {
    if (sentinelRef.current?.parentElement) {
      const container = sentinelRef.current.parentElement;
      container.scrollTo({
        top: container.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, []);

  // Setup intersection observer when enabled
  useEffect(() => {
    if (enabled) {
      setupIntersectionObserver();
    }
    return cleanup;
  }, [enabled, setupIntersectionObserver, cleanup]);

  return {
    isNearBottom,
    hasScrolled,
    scrollToTop,
    scrollToBottom,
    sentinelRef: sentinelRef as React.RefObject<HTMLDivElement>
  };
};

/**
 * Hook for scroll-based infinite scroll (alternative to intersection observer)
 */
export const useScrollInfiniteScroll = (
  onLoadMore: () => void,
  options: InfiniteScrollOptions = {}
) => {
  const { threshold = 100, debounceMs = 100, enabled = true } = options;
  const [isNearBottom, setIsNearBottom] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleScroll = useCallback(
    (event: React.UIEvent<HTMLDivElement>) => {
      if (!enabled) return;

      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }

      debounceTimeoutRef.current = setTimeout(() => {
        const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
        const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
        
        setHasScrolled(scrollTop > 0);
        setIsNearBottom(distanceFromBottom <= threshold);

        if (distanceFromBottom <= threshold) {
          onLoadMore();
        }
      }, debounceMs);
    },
    [onLoadMore, threshold, debounceMs, enabled]
  );

  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  return {
    handleScroll,
    isNearBottom,
    hasScrolled
  };
};
