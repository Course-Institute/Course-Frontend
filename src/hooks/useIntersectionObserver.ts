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
  options: ObserverProps
) => {
  const latestProps = useRef(options);
  latestProps.current = options;

  useEffect(() => {
    const container = containerRef.current;
    const lastElement = lastElementRef.current;

    if (!container || !lastElement) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const { mode, hasNext, isLoading, onIntersection } = latestProps.current;
        const isIntersecting = entry.isIntersecting;
        const shouldTrigger = (mode === "entering" && isIntersecting) || (mode === "leaving" && !isIntersecting);

        if (shouldTrigger && hasNext && !isLoading) {
          onIntersection();
        }
      },
      {
        root: container,
        rootMargin: latestProps.current.rootMargin,
        threshold: latestProps.current.threshold,
      }
    );

    observer.observe(lastElement);

    return () => {
      observer.disconnect();
    };
  }, [containerRef.current, lastElementRef.current, latestProps.current]);
};

export const useIntersectionObserver = (
  containerRef: React.RefObject<HTMLElement>,
  lastElementRef: React.RefObject<HTMLElement>,
  onIntersection: () => void,
  hasNext: boolean,
  isLoading: boolean,
  mode: "entering" | "leaving" | string = "entering",
  rootMargin: string = '10px',
  threshold: number = 0.1
) => {
  useIntersectionObserverCore(containerRef, lastElementRef, {
    onIntersection,
    hasNext,
    isLoading,
    mode: mode === "leaving" ? "leaving" : "entering",
    rootMargin,
    threshold,
  });
};