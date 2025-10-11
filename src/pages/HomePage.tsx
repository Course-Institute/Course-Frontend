import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import theme from '../theme';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import AboutSection from '../components/AboutSection';
import StatisticsSection from '../components/StatisticsSection';
import TestimonialsSection from '../components/TestimonialsSection';
import FooterSection from '../components/FooterSection';
import ErrorBoundary from '../components/ErrorBoundary';

const HomePage = () => {
  return (
    <ErrorBoundary>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Navbar />
        <HeroSection />
        <AboutSection />
        <StatisticsSection />
        <TestimonialsSection />
        <FooterSection />
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default HomePage;
