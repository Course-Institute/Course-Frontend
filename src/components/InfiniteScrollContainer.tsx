import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import {
  Box,
  CircularProgress,
  Typography,
  Button,
  Fade,
  Alert
} from '@mui/material';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import { KeyboardArrowUp, Refresh } from '@mui/icons-material';

export interface InfiniteScrollContainerProps {
  children: React.ReactNode;
  onLoadMore: () => void;
  hasNextPage: boolean;
  isLoading: boolean;
  isFetchingNextPage: boolean;
  error?: string | null;
  onRetry?: () => void;
  threshold?: number;
  debounceMs?: number;
  enabled?: boolean;
  showScrollToTop?: boolean;
  showScrollToBottom?: boolean;
  loadingText?: string;
  errorText?: string;
  noMoreDataText?: string;
  scrollBehavior?: 'smooth' | 'auto';
  height?: string | number;
  maxHeight?: string | number;
  className?: string;
  sx?: any;
}

export interface InfiniteScrollContainerRef {
  scrollToTop: () => void;
  scrollToBottom: () => void;
  scrollToElement: (element: HTMLElement) => void;
}

/**
 * Global infinite scroll container component
 * Can be used anywhere in the application for infinite scroll functionality
 */
const InfiniteScrollContainer = forwardRef<InfiniteScrollContainerRef, InfiniteScrollContainerProps>(
  ({
    children,
    onLoadMore,
    hasNextPage,
    isLoading,
    isFetchingNextPage,
    error,
    onRetry,
    threshold = 100,
    debounceMs = 100,
    enabled = true,
    showScrollToTop = true,
    showScrollToBottom = false,
    loadingText = 'Loading more...',
    errorText = 'Failed to load more data',
    noMoreDataText = 'No more data to load',
    scrollBehavior = 'smooth',
    height = '100%',
    maxHeight = '600px',
    className,
    sx,
    ...props
  }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const sentinelRef = useRef<HTMLDivElement>(null);

    // Use intersection observer-based infinite scroll
    const { hasScrolled, scrollToTop, scrollToBottom } = useInfiniteScroll(
      onLoadMore,
      {
        threshold,
        debounceMs,
        enabled: enabled && hasNextPage && !isFetchingNextPage
      }
    );

    // Expose methods to parent components
    useImperativeHandle(ref, () => ({
      scrollToTop,
      scrollToBottom,
      scrollToElement: (element: HTMLElement) => {
        if (containerRef.current) {
          element.scrollIntoView({ behavior: scrollBehavior });
        }
      }
    }));

    const handleRetry = () => {
      if (onRetry) {
        onRetry();
      }
    };

    return (
      <Box
        ref={containerRef}
        className={className}
        sx={{
          position: 'relative',
          height,
          maxHeight,
          overflow: 'auto',
          display: 'flex',
          flexDirection: 'column',
          ...sx,
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#f1f1f1',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#c1c1c1',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: '#a8a8a8',
          },
        }}
        {...props}
      >
        {/* Content */}
        <Box sx={{ flex: 1 }}>
          {children}
        </Box>

        {/* Loading indicator */}
        {isFetchingNextPage && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              p: 2,
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(4px)',
              borderTop: '1px solid #e0e0e0',
            }}
          >
            <CircularProgress size={24} sx={{ mr: 1 }} />
            <Typography variant="body2" color="text.secondary">
              {loadingText}
            </Typography>
          </Box>
        )}

        {/* Error state */}
        {error && (
          <Alert
            severity="error"
            action={
              onRetry && (
                <Button
                  color="inherit"
                  size="small"
                  onClick={handleRetry}
                  startIcon={<Refresh />}
                >
                  Retry
                </Button>
              )
            }
            sx={{ m: 1 }}
          >
            {errorText}: {error}
          </Alert>
        )}

        {/* No more data indicator */}
        {!hasNextPage && !isLoading && !error && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              p: 2,
              color: 'text.secondary',
              borderTop: '1px solid #e0e0e0',
            }}
          >
            <Typography variant="body2">
              {noMoreDataText}
            </Typography>
          </Box>
        )}

        {/* Scroll to top button */}
        {showScrollToTop && hasScrolled && (
          <Fade in={hasScrolled}>
            <Button
              onClick={scrollToTop}
              sx={{
                position: 'absolute',
                bottom: 20,
                right: 20,
                minWidth: 'auto',
                width: 48,
                height: 48,
                borderRadius: '50%',
                backgroundColor: 'primary.main',
                color: 'white',
                boxShadow: 3,
                '&:hover': {
                  backgroundColor: 'primary.dark',
                  transform: 'scale(1.05)',
                },
                transition: 'all 0.2s ease-in-out',
                zIndex: 1000,
              }}
            >
              <KeyboardArrowUp />
            </Button>
          </Fade>
        )}

        {/* Scroll to bottom button */}
        {showScrollToBottom && hasScrolled && (
          <Fade in={hasScrolled}>
            <Button
              onClick={scrollToBottom}
              sx={{
                position: 'absolute',
                bottom: 80,
                right: 20,
                minWidth: 'auto',
                width: 48,
                height: 48,
                borderRadius: '50%',
                backgroundColor: 'secondary.main',
                color: 'white',
                boxShadow: 3,
                '&:hover': {
                  backgroundColor: 'secondary.dark',
                  transform: 'scale(1.05)',
                },
                transition: 'all 0.2s ease-in-out',
                zIndex: 1000,
              }}
            >
              <KeyboardArrowUp sx={{ transform: 'rotate(180deg)' }} />
            </Button>
          </Fade>
        )}

        {/* Intersection observer sentinel */}
        <div ref={sentinelRef} style={{ height: '1px' }} />
      </Box>
    );
  }
);

InfiniteScrollContainer.displayName = 'InfiniteScrollContainer';

export default InfiniteScrollContainer;
