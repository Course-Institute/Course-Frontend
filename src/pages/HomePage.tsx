import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import FooterSection from '../components/FooterSection';
import InquiryDialog from '../components/InquiryDialog';
import LayoutWrapper from '../components/LayoutWrapper';
import { layoutConfig } from '../theme/layout';

const HomePage = () => {
  const [inquiryDialogOpen, setInquiryDialogOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigate = useNavigate();

  // Hero images array
  const heroImages = [
    '/images/hero/hero-image-1.png',
    '/images/hero/hero-image-2.png'
  ];

  // Auto-rotate carousel every 15 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === heroImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 15000);

    return () => clearInterval(interval);
  }, [heroImages.length]);

  // Navigation functions
  const goToPrevious = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? heroImages.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === heroImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  // Handle program highlight click
  const handleProgramClick = () => {
    navigate('/programs');
  };

  const programHighlights = [
    {
      title: "Paramedical Programs",
      description: "Step into the vital world of healthcare. Our paramedical courses train students in diagnostic, technical, and patient care skills through programs like DMLT, X-Ray Technician, ECG, and Operation Theatre Assistance.",
      icon: "🏥",
      color: "#2563eb"
    },
    {
      title: "Vocational Programs", 
      description: "Learn high-demand, industry-relevant trades. Designed for students who want to build stable, well-paying careers in the industrial and service sectors.",
      icon: "🎓",
      color: "#10b981"
    },
    {
      title: "IT Programs",
      description: "Stay future-ready in a digital world. Covering fundamental to advanced topics like Computer Applications, Web Designing, Tally, Digital Marketing, and Office Productivity Tools.",
      icon: "💻",
      color: "#0ea5e9"
    },
    {
      title: "Yoga & Naturopathy",
      description: "A perfect combination of traditional wisdom and modern wellness. Yoga programs focus on body, mind, and spirit. Preparing students to become certified Yoga Trainers, Naturopaths, and Wellness Therapists.",
      icon: "🧘",
      color: "#059669"
    }
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <LayoutWrapper>

      {/* Hero Banner with Carousel - Simple HTML approach */}
      <div style={{
        height: '60vh',
        minHeight: '400px',
        position: 'relative',
        overflow: 'hidden',
        width: '100%',
        background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.7) 0%, rgba(16, 185, 129, 0.7) 100%)'
      }}>
        {/* Carousel Images */}
        {heroImages.map((image, index) => (
          <div
            key={index}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundImage: `url(${image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              opacity: currentImageIndex === index ? 1 : 0,
              transition: 'opacity 1s ease-in-out',
              zIndex: 1
            }}
          />
        ))}

        {/* Navigation Buttons */}
        <button
          onClick={goToPrevious}
          style={{
            position: 'absolute',
            left: '20px',
            top: '50%',
            transform: 'translateY(-50%)',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '60px',
            height: '60px',
            cursor: 'pointer',
            zIndex: 3,
            fontSize: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          ‹
        </button>

        <button
          onClick={goToNext}
          style={{
            position: 'absolute',
            right: '20px',
            top: '50%',
            transform: 'translateY(-50%)',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '60px',
            height: '60px',
            cursor: 'pointer',
            zIndex: 3,
            fontSize: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          ›
        </button>

        {/* Carousel Indicators */}
        <div style={{
          position: 'absolute',
          bottom: '30px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '8px',
          zIndex: 3
        }}>
          {heroImages.map((_, index) => (
            <div
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                backgroundColor: currentImageIndex === index ? 'white' : 'rgba(255, 255, 255, 0.5)',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            />
          ))}
        </div>
      </div>

      {/* Main Content Container */}
      
      {/* Introduction Section */}
      <div style={{ 
        padding: '64px 0', 
        backgroundColor: '#f8fafc',
        width: '100%'
      }}>
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto', 
          padding: '0 32px' 
        }}>
          <h2 style={{ 
            fontWeight: 'bold', 
            color: '#1e293b', 
            marginBottom: '48px', 
            fontSize: '2.5rem',
            textAlign: 'center'
          }}>
            Introduction
          </h2>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '32px' 
          }}>
            <div style={{ padding: '24px' }}>
              <p style={{ 
                fontSize: '1.1rem', 
                lineHeight: 1.8, 
                color: '#475569', 
                marginBottom: '24px'
              }}>
                At Mahavir Institute of Vocational & Paramedical Association, we are committed to bridging the gap between education and employability. Our focus goes beyond classroom teaching — we emphasize hands-on practical training, modern learning techniques, and industry-relevant curriculum.
              </p>
              
              <p style={{ 
                fontSize: '1.1rem', 
                lineHeight: 1.8, 
                color: '#475569'
              }}>
                Our institute offers over 100 specialized programs across 9 major streams, including Paramedical Science, Vocational Trades, Information Technology, Yoga & Naturopathy, Fire Safety, Nursery Teacher Training (NTT), Beauty & Wellness, Apparel Design, and Agriculture.
              </p>
            </div>
            
            <div style={{ padding: '24px' }}>
              <p style={{ 
                fontSize: '1.1rem', 
                lineHeight: 1.8, 
                color: '#475569', 
                marginBottom: '24px'
              }}>
                We believe that skill-based education has the power to transform lives. That's why we provide an inclusive learning environment where students from different backgrounds can gain the knowledge, confidence, and technical expertise required to succeed in today's competitive job market.
              </p>
              
              <p style={{ 
                fontSize: '1.1rem', 
                lineHeight: 1.8, 
                color: '#475569', 
                fontWeight: 'bold'
              }}>
                Our goal is simple: to shape individuals into professionals who create impact.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Program Highlights */}
      <div style={{ 
        padding: '64px 0', 
        backgroundColor: 'white',
        width: '100%'
      }}>
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto', 
          padding: '0 32px' 
        }}>
          <h2 style={{ 
            fontWeight: 'bold', 
            color: '#1e293b', 
            fontSize: '2.5rem',
            textAlign: 'center',
            marginBottom: '48px'
          }}>
            Career Pathways for Every Ambition
          </h2>
          
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '24px',
            alignItems: 'center'
          }}>
            {programHighlights.map((program, index) => (
              <div
                key={index}
                onClick={handleProgramClick}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                  border: '1px solid #e2e8f0',
                  padding: '32px',
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease-in-out',
                  width: '100%'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 15px 40px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
                }}
              >
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  marginBottom: '24px',
                  flexWrap: 'wrap',
                  gap: '16px',
                  justifyContent: 'center'
                }}>
                  <div
                    style={{
                      backgroundColor: program.color,
                      color: 'white',
                      borderRadius: '8px',
                      padding: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minWidth: '60px',
                      minHeight: '60px',
                      fontSize: '24px'
                    }}
                  >
                    {program.icon}
                  </div>
                  <h3 style={{ 
                    fontWeight: 'bold', 
                    color: '#1e293b', 
                    fontSize: '1.5rem', 
                    margin: 0,
                    flex: 1,
                    minWidth: '200px'
                  }}>
                    {program.title}
                  </h3>
                </div>
                
                <p style={{ 
                  color: '#64748b', 
                  lineHeight: 1.6, 
                  fontSize: '1rem', 
                  margin: 0,
                  textAlign: 'center'
                }}>
                  {program.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Inquiry Section */}
      <div style={{ 
        background: 'linear-gradient(135deg, #2563eb 0%, #10b981 100%)', 
        color: 'white', 
        padding: '64px 0',
        width: '100%'
      }}>
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto', 
          padding: '0 32px',
          textAlign: 'center'
        }}>
          <h2 style={{ 
            fontWeight: 'bold', 
            marginBottom: '24px', 
            fontSize: '2.5rem', 
            color: 'white'
          }}>
            Ready to Start Your Journey?
          </h2>
          
          <p style={{ 
            marginBottom: '32px', 
            opacity: 0.9, 
            fontSize: '1.5rem', 
            color: 'white'
          }}>
            Take the first step toward a brighter future. Connect with our admissions team to explore your best-fit program and career opportunities.
          </p>
          
          <button
            onClick={() => setInquiryDialogOpen(true)}
            style={{
              backgroundColor: 'white',
              color: '#2563eb',
              border: 'none',
              borderRadius: '12px',
              padding: '16px 48px',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f8fafc';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'white';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            Submit Inquiry
          </button>
        </div>
      </div>

      
      {/* Inquiry Dialog */}
      <InquiryDialog
        open={inquiryDialogOpen}
        onClose={() => setInquiryDialogOpen(false)}
      />
      </LayoutWrapper>
      <FooterSection />
    </div>
  );
};

export default HomePage;