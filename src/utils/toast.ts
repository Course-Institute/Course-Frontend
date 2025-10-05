/**
 * Toast utility functions for easy access throughout the application
 * 
 * Usage examples:
 * 
 * // In any React component:
 * import { useToast } from '../contexts/ToastContext';
 * 
 * const MyComponent = () => {
 *   const { showSuccess, showError, showWarning, showInfo } = useToast();
 *   
 *   const handleSuccess = () => {
 *     showSuccess('Operation completed successfully!');
 *   };
 *   
 *   const handleError = () => {
 *     showError('Something went wrong!');
 *   };
 * };
 * 
 * // Or use the direct methods:
 * import { useToast } from '../contexts/ToastContext';
 * 
 * const { showToast } = useToast();
 * showToast('Custom message', 'info');
 */

export { useToast } from '../contexts/ToastContext';

// Re-export for convenience
export type { AlertColor } from '@mui/material';
