# Global Toast Notification System

The application includes a global toast notification system that can be used anywhere in the application to provide user feedback.

## Setup

The toast system is already set up globally in `App.tsx` with the `ToastProvider` wrapping all routes, making it available throughout the entire application.

## Usage

### Basic Usage in React Components

```tsx
import React from 'react';
import { useToast } from '../contexts/ToastContext';

const MyComponent = () => {
  const { showSuccess, showError, showWarning, showInfo } = useToast();

  const handleSubmit = async () => {
    try {
      // Your API call
      await someApiCall();
      showSuccess('Data saved successfully!');
    } catch (error) {
      showError('Failed to save data. Please try again.');
    }
  };

  return (
    <button onClick={handleSubmit}>
      Submit
    </button>
  );
};
```

### Available Methods

| Method | Description | Example |
|--------|-------------|---------|
| `showSuccess(message)` | Shows a success toast (green) | `showSuccess('User created successfully!')` |
| `showError(message)` | Shows an error toast (red) | `showError('Failed to delete user')` |
| `showWarning(message)` | Shows a warning toast (orange) | `showWarning('Please fill all required fields')` |
| `showInfo(message)` | Shows an info toast (blue) | `showInfo('Data has been updated')` |
| `showToast(message, severity)` | Shows a custom toast | `showToast('Custom message', 'info')` |

### Severity Types

- `'success'` - Green toast for successful operations
- `'error'` - Red toast for errors
- `'warning'` - Orange toast for warnings
- `'info'` - Blue toast for informational messages

## Examples

### Form Submission

```tsx
const handleFormSubmit = async (formData) => {
  try {
    await submitForm(formData);
    showSuccess('Form submitted successfully!');
    // Reset form or redirect
  } catch (error) {
    showError('Failed to submit form. Please try again.');
  }
};
```

### API Error Handling

```tsx
const fetchData = async () => {
  try {
    const data = await api.getData();
    showSuccess('Data loaded successfully!');
    return data;
  } catch (error) {
    if (error.status === 401) {
      showError('Session expired. Please login again.');
    } else {
      showError('Failed to load data. Please try again.');
    }
  }
};
```

### Validation Feedback

```tsx
const validateForm = (data) => {
  if (!data.email) {
    showWarning('Email address is required');
    return false;
  }
  
  if (!isValidEmail(data.email)) {
    showError('Please enter a valid email address');
    return false;
  }
  
  showSuccess('Form validation passed!');
  return true;
};
```

### File Upload

```tsx
const handleFileUpload = async (file) => {
  if (file.size > MAX_FILE_SIZE) {
    showError('File size must be less than 5MB');
    return;
  }
  
  try {
    await uploadFile(file);
    showSuccess('File uploaded successfully!');
  } catch (error) {
    showError('Failed to upload file. Please try again.');
  }
};
```

## Toast Configuration

The toast system is configured with:
- **Position**: Top-right corner
- **Auto-hide**: 6 seconds
- **Dismissible**: Users can close manually
- **Stacking**: Multiple toasts can be shown (newest on top)

## Best Practices

1. **Use appropriate severity levels**:
   - Success for completed operations
   - Error for failures that need attention
   - Warning for potential issues
   - Info for general information

2. **Keep messages concise**:
   - Good: "User created successfully!"
   - Bad: "The user has been successfully created and added to the database with all the provided information."

3. **Provide actionable feedback**:
   - Good: "Failed to save. Please check your connection and try again."
   - Bad: "Error occurred."

4. **Use consistent messaging**:
   - Success: "Operation completed successfully!"
   - Error: "Failed to complete operation. Please try again."

## Integration with Existing Components

The toast system is already integrated with:
- ✅ `AddStudentForm` - Shows success/error on form submission
- ✅ Global error handling in API calls
- ✅ Form validation feedback

## Adding Toast to New Components

1. Import the hook:
```tsx
import { useToast } from '../contexts/ToastContext';
```

2. Use in your component:
```tsx
const MyComponent = () => {
  const { showSuccess, showError } = useToast();
  
  // Use the methods as needed
};
```

That's it! The toast system is now available globally throughout your application.
