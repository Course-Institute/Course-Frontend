import React, { useCallback, useEffect, useRef } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  Chip,
  Avatar,
  Divider,
} from '@mui/material';
import {
  Business,
  LocationOn,
  Person,
  Email,
  Phone,
} from '@mui/icons-material';
import { useCenterAutoCompleteList, type CenterAutoCompleteItem } from '../hooks/useCenterAutoComplete';

interface CenterInfiniteListProps {
  filters?: {
    query?: string;
    status?: string;
    region?: string;
    limit?: number;
  };
  onCenterSelect?: (center: CenterAutoCompleteItem) => void;
  height?: string | number;
}

const CenterInfiniteList: React.FC<CenterInfiniteListProps> = ({
  filters = {},
  onCenterSelect,
  height = 400,
}) => {
  const {
    allCenters,
    totalCount,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
    fetchNextPage,
  } = useCenterAutoCompleteList(filters);

  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const handleCenterClick = useCallback((center: CenterAutoCompleteItem) => {
    if (onCenterSelect) {
      onCenterSelect(center);
    }
  }, [onCenterSelect]);

  const lastCenterElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (isLoading || isFetchingNextPage) return;
      if (observerRef.current) observerRef.current.disconnect();
      
      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      });
      
      if (node) observerRef.current.observe(node);
    },
    [isLoading, isFetchingNextPage, hasNextPage, fetchNextPage]
  );

  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return '#10b981';
      case 'pending':
        return '#f59e0b';
      case 'approved':
        return '#3b82f6';
      case 'deactivated':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  if (isError) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        Failed to load centers: {error?.message || 'Unknown error'}
      </Alert>
    );
  }

  return (
    <Box sx={{ height, overflow: 'auto' }}>
      {isLoading && allCenters.length === 0 ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {totalCount > 0 && (
            <Typography variant="body2" color="text.secondary" sx={{ p: 2, pb: 1 }}>
              Showing {allCenters.length} of {totalCount} centers
            </Typography>
          )}
          
          {allCenters.map((center, index) => (
            <Card
              key={`${center.id}-${index}`}
              ref={index === allCenters.length - 1 ? lastCenterElementRef : null}
              sx={{
                m: 1,
                cursor: onCenterSelect ? 'pointer' : 'default',
                transition: 'all 0.2s ease',
                '&:hover': onCenterSelect ? {
                  transform: 'translateY(-2px)',
                  boxShadow: 3,
                } : {},
              }}
              onClick={() => handleCenterClick(center)}
            >
              <CardContent sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <Avatar sx={{ bgcolor: '#3b82f6', mt: 0.5 }}>
                    <Business />
                  </Avatar>
                  
                  <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b' }}>
                        {center.centerName}
                      </Typography>
                      <Chip
                        label={center.status}
                        size="small"
                        sx={{
                          backgroundColor: getStatusColor(center.status),
                          color: 'white',
                          fontWeight: 500,
                          fontSize: '0.75rem',
                        }}
                      />
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      <Business sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        {center.centerId}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      <LocationOn sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        {center.location}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      <Person sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        {center.contactPerson}
                      </Typography>
                    </Box>
                    
                    {center.email && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <Email sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {center.email}
                        </Typography>
                      </Box>
                    )}
                    
                    {center.phone && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Phone sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {center.phone}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
          
          {isFetchingNextPage && (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
              <CircularProgress size={24} />
              <Typography variant="body2" sx={{ ml: 1 }}>
                Loading more centers...
              </Typography>
            </Box>
          )}
          
          {!hasNextPage && allCenters.length > 0 && (
            <Box sx={{ textAlign: 'center', p: 2 }}>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="body2" color="text.secondary">
                No more centers to load
              </Typography>
            </Box>
          )}
          
          {allCenters.length === 0 && !isLoading && (
            <Box sx={{ textAlign: 'center', p: 4 }}>
              <Typography variant="body1" color="text.secondary">
                No centers found
              </Typography>
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default CenterInfiniteList;
