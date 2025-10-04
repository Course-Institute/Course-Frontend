import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Container,
  Alert,
  AlertTitle,
} from '@mui/material';
import { Refresh, Home, BugReport } from '@mui/icons-material';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo,
    });

    // Call the onError callback if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // You can also log the error to an error reporting service here
    // Example: logErrorToService(error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      // Custom fallback UI if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <Container maxWidth="md" sx={{ py: 8 }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '60vh',
            }}
          >
            <Card
              sx={{
                width: '100%',
                maxWidth: 600,
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                borderRadius: 3,
              }}
            >
              <CardContent sx={{ p: 4, textAlign: 'center' }}>
                {/* Error Icon */}
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    mb: 3,
                  }}
                >
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      backgroundColor: 'error.light',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 2,
                    }}
                  >
                    <BugReport sx={{ fontSize: 40, color: 'error.main' }} />
                  </Box>
                </Box>

                {/* Error Title */}
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 'bold',
                    color: 'error.main',
                    mb: 2,
                  }}
                >
                  Oops! Something went wrong
                </Typography>

                {/* Error Message */}
                <Typography
                  variant="body1"
                  sx={{
                    color: 'text.secondary',
                    mb: 3,
                    lineHeight: 1.6,
                  }}
                >
                  We encountered an unexpected error. Don't worry, our team has been notified
                  and is working to fix this issue.
                </Typography>

                {/* Error Details (only in development) */}
                {process.env.NODE_ENV === 'development' && this.state.error && (
                  <Alert severity="error" sx={{ mb: 3, textAlign: 'left' }}>
                    <AlertTitle>Error Details (Development Only)</AlertTitle>
                    <Typography variant="body2" component="pre" sx={{ 
                      fontSize: '0.75rem',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                      maxHeight: 200,
                      overflow: 'auto',
                    }}>
                      {this.state.error.toString()}
                      {this.state.errorInfo?.componentStack}
                    </Typography>
                  </Alert>
                )}

                {/* Action Buttons */}
                <Box
                  sx={{
                    display: 'flex',
                    gap: 2,
                    justifyContent: 'center',
                    flexWrap: 'wrap',
                  }}
                >
                  <Button
                    variant="contained"
                    startIcon={<Refresh />}
                    onClick={this.handleRetry}
                    sx={{
                      textTransform: 'none',
                      px: 3,
                      py: 1.5,
                      borderRadius: 2,
                    }}
                  >
                    Try Again
                  </Button>
                  
                  <Button
                    variant="outlined"
                    startIcon={<Home />}
                    onClick={this.handleGoHome}
                    sx={{
                      textTransform: 'none',
                      px: 3,
                      py: 1.5,
                      borderRadius: 2,
                    }}
                  >
                    Go to Home
                  </Button>
                  
                  <Button
                    variant="text"
                    onClick={this.handleReload}
                    sx={{
                      textTransform: 'none',
                      px: 3,
                      py: 1.5,
                      borderRadius: 2,
                    }}
                  >
                    Reload Page
                  </Button>
                </Box>

                {/* Additional Help Text */}
                <Typography
                  variant="body2"
                  sx={{
                    color: 'text.secondary',
                    mt: 3,
                    fontSize: '0.875rem',
                  }}
                >
                  If this problem persists, please contact our support team.
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
