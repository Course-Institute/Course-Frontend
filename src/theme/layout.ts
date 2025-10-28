// Centralized layout configuration
export const layoutConfig = {
  // Main content width for desktop
  contentWidth: {
    xs: '100%',      // Mobile: full width
    md: '75%',       // Desktop: 75% width
  },
  
  // Margin for centering content
  contentMargin: {
    xs: 0,           // Mobile: no margin
    md: '0 auto',    // Desktop: center horizontally
  },
  
  // Container padding
  containerPadding: {
    xs: 2,           // Mobile: 16px padding
    md: 4,           // Desktop: 32px padding
  },
  
  // Common styles object for easy reuse
  getContentStyles: () => ({
    width: layoutConfig.contentWidth,
    margin: layoutConfig.contentMargin,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'white'
  }),
  
  // Container styles for sections
  getContainerStyles: () => ({
    maxWidth: false,
    px: layoutConfig.containerPadding
  })
};

export default layoutConfig;
