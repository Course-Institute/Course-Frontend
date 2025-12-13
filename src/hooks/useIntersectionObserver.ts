import { useEffect, useRef } from "react";

type ObserverProps = {
  onIntersection: () => void;
  hasNext: boolean;
  isLoading: boolean;
  mode: "entering" | "leaving";
  rootMargin?: string;
  threshold?: number;
};

const useIntersectionObserverCore = (
  containerRef: React.RefObject<HTMLElement>,
  lastElementRef: React.RefObject<HTMLElement>,
  options: ObserverProps & { resetKey?: string }
) => {
  const latestProps = useRef(options);
  latestProps.current = options;
  const hasTriggeredRef = useRef(false); // Track if we've triggered for this reset
  const initialScrollTopRef = useRef<number | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    const lastElement = lastElementRef.current;

    if (!container || !lastElement) return;

    // Reset tracking when resetKey changes
    hasTriggeredRef.current = false;
    
    // Find the actual scrollable container (search from lastElement up the DOM tree)
    const findScrollableParent = (element: HTMLElement): HTMLElement => {
      let current: HTMLElement | null = element.parentElement;
      while (current && current !== document.body) {
        const style = window.getComputedStyle(current);
        if (style.overflow === 'auto' || style.overflow === 'scroll' || 
            style.overflowY === 'auto' || style.overflowY === 'scroll' ||
            style.overflowX === 'auto' || style.overflowX === 'scroll') {
          // Check if it actually scrolls
          if (current.scrollHeight > current.clientHeight) {
            return current;
          }
        }
        current = current.parentElement;
      }
      // Fallback: try container or window
      if (container && container.scrollHeight > container.clientHeight) {
        return container;
      }
      return document.documentElement; // Ultimate fallback
    };

    const scrollableContainer = findScrollableParent(lastElement);
    const getScrollTop = () => {
      if (scrollableContainer === document.documentElement) {
        return window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
      }
      return scrollableContainer.scrollTop;
    };
    
    initialScrollTopRef.current = getScrollTop();

    // Track scroll events
    const handleScroll = () => {
      // Mark that user has interacted with scroll
      if (initialScrollTopRef.current !== null && 
          getScrollTop() !== initialScrollTopRef.current) {
        // User has scrolled, allow triggering
      }
    };

    // Track scroll events - use window for document.documentElement
    const scrollTarget = scrollableContainer === document.documentElement 
      ? window 
      : scrollableContainer;
    scrollTarget.addEventListener('scroll', handleScroll, { passive: true });

    // Create observer with proper configuration
    const observer = new IntersectionObserver(
      ([entry]) => {
        const { mode, hasNext, isLoading, onIntersection } = latestProps.current;
        const isIntersecting = entry.isIntersecting;
        const shouldTrigger = (mode === "entering" && isIntersecting) || (mode === "leaving" && !isIntersecting);

        // Only trigger if:
        // 1. We have next page
        // 2. Not currently loading
        // 3. Element is intersecting
        if (shouldTrigger && hasNext && !isLoading) {
          // Prevent multiple rapid triggers (debounce)
          if (!hasTriggeredRef.current) {
            // If user hasn't scrolled and content currently fits, still allow a trigger so we can
            // load enough pages to fill the viewport (otherwise infinite scroll never starts).
            // Once more data is loaded, intersection observer will rely on actual scrolling.
            hasTriggeredRef.current = true;
            onIntersection();
            
            // Reset trigger flag after delay to allow re-triggering if needed
            setTimeout(() => {
              hasTriggeredRef.current = false;
            }, 1000);
          }
        }
      },
      {
        root: scrollableContainer === document.documentElement ? null : scrollableContainer,
        rootMargin: latestProps.current.rootMargin || '100px', // Trigger when 100px away
        threshold: latestProps.current.threshold || 0.1,
      }
    );

    observerRef.current = observer;

    // Small delay to ensure DOM is fully rendered
    const timeoutId = setTimeout(() => {
      if (scrollableContainer && lastElement && observerRef.current) {
        initialScrollTopRef.current = getScrollTop();
        observerRef.current.observe(lastElement);
      }
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      scrollTarget.removeEventListener('scroll', handleScroll);
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, [containerRef, lastElementRef, options.resetKey]); // Add resetKey to dependencies
};

export const useIntersectionObserver = (
  containerRef: React.RefObject<HTMLElement>,
  lastElementRef: React.RefObject<HTMLElement>,
  onIntersection: () => void,
  hasNext: boolean,
  isLoading: boolean,
  mode: "entering" | "leaving" | string = "entering",
  rootMargin: string = '10px',
  threshold: number = 0.1,
  resetKey?: string
) => {
  // Create a key that changes when hasNext or isLoading changes
  // This helps reset the observer when query state changes
  const observerResetKey = resetKey || `${hasNext}-${isLoading}`;
  
  useIntersectionObserverCore(containerRef, lastElementRef, {
    onIntersection,
    hasNext,
    isLoading,
    mode: mode === "leaving" ? "leaving" : "entering",
    rootMargin,
    threshold,
    resetKey: observerResetKey,
  });
};