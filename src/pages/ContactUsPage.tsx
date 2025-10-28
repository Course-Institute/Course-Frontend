import { useState } from 'react';
import Navbar from '../components/Navbar';
import FooterSection from '../components/FooterSection';
import LayoutWrapper from '../components/LayoutWrapper';
import { programsData } from '../constants/programsData';
import { useSubmitInquiry } from '../hooks/useSubmitInquiry';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

const ContactUsPage = () => {
  const [inquiryForm, setInquiryForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    programOfInterest: '',
    message: '',
    inquiryType: 'student' as 'student' | 'center'
  });
  
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  
  const submitInquiryMutation = useSubmitInquiry();

  const handleInputChange = (field: string) => (event: any) => {
    setInquiryForm(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitInquiryMutation.mutate(inquiryForm, {
      onSuccess: () => {
        setShowSuccess(true);
        setInquiryForm({
          fullName: '',
          email: '',
          phone: '',
          programOfInterest: '',
          message: '',
          inquiryType: 'student'
        });
      },
      onError: () => {
        setShowError(true);
      },
    });
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      
      <LayoutWrapper backgroundColor="transparent">
        <div style={{ 
          flex: 1, 
          padding: '64px 0', 
          background: `
            linear-gradient(135deg, rgba(248, 250, 252, 0.5) 0%, rgba(241, 245, 249, 0.5) 100%),
            url('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')
          `,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
          width: '100%'
        }}>
          <div style={{ 
            maxWidth: '1200px', 
            margin: '0 auto', 
            padding: '0 32px' 
          }}>
            {/* Page Header */}
            <div style={{ textAlign: 'center', marginBottom: '64px' }}>
              <h1 style={{
                fontWeight: 'bold',
                color: '#1e293b',
                marginBottom: '16px',
                fontSize: '3rem'
              }}>
                Get in Touch
              </h1>
              <p style={{
                color: '#475569',
                fontSize: '1.25rem',
                maxWidth: '800px',
                margin: '0 auto',
                lineHeight: 1.6
              }}>
                We're here to answer your questions and help you start your journey. Reach out to us through any of the methods below.
              </p>
            </div>

            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
              gap: '32px',
              justifyContent: 'center',
              alignItems: 'start'
            }}>
              {/* Contact Form */}
              <div style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                padding: '32px'
              }}>
                <h2 style={{
                  fontWeight: 'bold',
                  marginBottom: '24px',
                  color: '#1e293b',
                  fontSize: '2rem',
                  textAlign: 'center'
                }}>
                  Send Us a Message
                </h2>
                <form onSubmit={handleSubmit}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                      <div>
                        <label style={{
                          display: 'block',
                          marginBottom: '8px',
                          fontWeight: '600',
                          color: '#374151'
                        }}>
                          Full Name *
                        </label>
                        <input
                          type="text"
                          value={inquiryForm.fullName}
                          onChange={handleInputChange('fullName')}
                          required
                          style={{
                            width: '100%',
                            padding: '12px 16px',
                            border: '2px solid #e5e7eb',
                            borderRadius: '8px',
                            fontSize: '1rem',
                            transition: 'border-color 0.3s ease',
                            boxSizing: 'border-box'
                          }}
                          onFocus={(e) => e.target.style.borderColor = '#2563eb'}
                          onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                        />
                      </div>
                      <div>
                        <label style={{
                          display: 'block',
                          marginBottom: '8px',
                          fontWeight: '600',
                          color: '#374151'
                        }}>
                          Email Address *
                        </label>
                        <input
                          type="email"
                          value={inquiryForm.email}
                          onChange={handleInputChange('email')}
                          required
                          style={{
                            width: '100%',
                            padding: '12px 16px',
                            border: '2px solid #e5e7eb',
                            borderRadius: '8px',
                            fontSize: '1rem',
                            transition: 'border-color 0.3s ease',
                            boxSizing: 'border-box'
                          }}
                          onFocus={(e) => e.target.style.borderColor = '#2563eb'}
                          onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                        />
                      </div>
                    </div>

                    {/* Inquiry Type */}
                    <div>
                      <label style={{
                        display: 'block',
                        marginBottom: '8px',
                        fontWeight: '600',
                        color: '#374151'
                      }}>
                        Inquiry Type *
                      </label>
                      <select
                        value={inquiryForm.inquiryType}
                        onChange={handleInputChange('inquiryType')}
                        required
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          border: '2px solid #e5e7eb',
                          borderRadius: '8px',
                          fontSize: '1rem',
                          transition: 'border-color 0.3s ease',
                          boxSizing: 'border-box',
                          backgroundColor: 'white'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#2563eb'}
                        onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                      >
                        <option value="student">Student</option>
                        <option value="center">Center</option>
                      </select>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                      <div>
                        <label style={{
                          display: 'block',
                          marginBottom: '8px',
                          fontWeight: '600',
                          color: '#374151'
                        }}>
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          value={inquiryForm.phone}
                          onChange={handleInputChange('phone')}
                          style={{
                            width: '100%',
                            padding: '12px 16px',
                            border: '2px solid #e5e7eb',
                            borderRadius: '8px',
                            fontSize: '1rem',
                            transition: 'border-color 0.3s ease',
                            boxSizing: 'border-box'
                          }}
                          onFocus={(e) => e.target.style.borderColor = '#2563eb'}
                          onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                        />
                      </div>
                      <div>
                        <label style={{
                          display: 'block',
                          marginBottom: '8px',
                          fontWeight: '600',
                          color: '#374151'
                        }}>
                          Program of Interest
                        </label>
                        <select
                          value={inquiryForm.programOfInterest}
                          onChange={handleInputChange('programOfInterest')}
                          style={{
                            width: '100%',
                            padding: '12px 16px',
                            border: '2px solid #e5e7eb',
                            borderRadius: '8px',
                            fontSize: '1rem',
                            transition: 'border-color 0.3s ease',
                            boxSizing: 'border-box',
                            backgroundColor: 'white'
                          }}
                          onFocus={(e) => e.target.style.borderColor = '#2563eb'}
                          onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                        >
                          <option value="">Select a program</option>
                          {programsData.map((program) => (
                            <option key={program.id} value={program.category}>
                              {program.category}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label style={{
                        display: 'block',
                        marginBottom: '8px',
                        fontWeight: '600',
                        color: '#374151'
                      }}>
                        Your Message *
                      </label>
                      <textarea
                        value={inquiryForm.message}
                        onChange={handleInputChange('message')}
                        required
                        rows={5}
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          border: '2px solid #e5e7eb',
                          borderRadius: '8px',
                          fontSize: '1rem',
                          transition: 'border-color 0.3s ease',
                          boxSizing: 'border-box',
                          resize: 'vertical',
                          fontFamily: 'inherit'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#2563eb'}
                        onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submitInquiryMutation.isPending}
                      style={{
                        background: submitInquiryMutation.isPending 
                          ? 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)'
                          : 'linear-gradient(135deg, #2563eb 0%, #10b981 100%)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '16px 32px',
                        fontSize: '1.1rem',
                        fontWeight: 'bold',
                        cursor: submitInquiryMutation.isPending ? 'not-allowed' : 'pointer',
                        boxShadow: '0 8px 20px rgba(37, 99, 235, 0.3)',
                        transition: 'all 0.3s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        opacity: submitInquiryMutation.isPending ? 0.7 : 1
                      }}
                      onMouseEnter={(e) => {
                        if (!submitInquiryMutation.isPending) {
                          e.currentTarget.style.opacity = '0.9';
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = '0 12px 25px rgba(37, 99, 235, 0.4)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!submitInquiryMutation.isPending) {
                          e.currentTarget.style.opacity = '1';
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = '0 8px 20px rgba(37, 99, 235, 0.3)';
                        }
                      }}
                    >
                      {submitInquiryMutation.isPending ? '⏳ Submitting...' : '📧 Send Message'}
                    </button>
                  </div>
                </form>
              </div>

              {/* Contact Info */}
              <div style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                padding: '32px',
                height: 'fit-content'
              }}>
                <h2 style={{
                  fontWeight: 'bold',
                  marginBottom: '24px',
                  color: '#1e293b',
                  fontSize: '2rem',
                  textAlign: 'center'
                }}>
                  Our Details
                </h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{
                      backgroundColor: '#2563eb',
                      color: 'white',
                      borderRadius: '50%',
                      width: '48px',
                      height: '48px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: '16px',
                      fontSize: '20px'
                    }}>
                      📍
                    </div>
                    <div>
                      <h3 style={{
                        fontWeight: 'bold',
                        color: '#1e293b',
                        margin: '0 0 4px 0',
                        fontSize: '1.1rem'
                      }}>
                        Address
                      </h3>
                      <p style={{
                        color: '#64748b',
                        margin: 0,
                        fontSize: '1rem',
                        lineHeight: 1.5,
                        wordWrap: 'break-word',
                        overflowWrap: 'break-word',
                        hyphens: 'auto'
                      }}>
                       Mahavir Institute of Vocational & Paramedical Science
Near Railway Station, Main Road
Delhi, India - 110001
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{
                      backgroundColor: '#10b981',
                      color: 'white',
                      borderRadius: '50%',
                      width: '48px',
                      height: '48px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: '16px',
                      fontSize: '20px'
                    }}>
                      ✉️
                    </div>
                    <div>
                      <h3 style={{
                        fontWeight: 'bold',
                        color: '#1e293b',
                        margin: '0 0 4px 0',
                        fontSize: '1.1rem'
                      }}>
                        Email
                      </h3>
                      <p style={{
                        color: '#64748b',
                        margin: 0,
                        fontSize: '1rem',
                        wordWrap: 'break-word',
                        overflowWrap: 'break-word'
                      }}>
                        info@mahavirinstitute.com
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{
                      backgroundColor: '#f59e0b',
                      color: 'white',
                      borderRadius: '50%',
                      width: '48px',
                      height: '48px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: '16px',
                      fontSize: '20px'
                    }}>
                      🕒
                    </div>
                    <div>
                      <h3 style={{
                        fontWeight: 'bold',
                        color: '#1e293b',
                        margin: '0 0 4px 0',
                        fontSize: '1.1rem'
                      }}>
                        Hours
                      </h3>
                      <p style={{
                        color: '#64748b',
                        margin: 0,
                        fontSize: '1rem',
                        wordWrap: 'break-word',
                        overflowWrap: 'break-word'
                      }}>
                        Mon - Sat: 9:00 AM - 7:00 PM
                      </p>
                    </div>
                  </div>

                  <div style={{ 
                    height: '1px', 
                    backgroundColor: '#e5e7eb', 
                    margin: '16px 0' 
                  }} />

                  <div>
                    <h3 style={{
                      fontWeight: 'bold',
                      color: '#1e293b',
                      marginBottom: '16px',
                      fontSize: '1.25rem',
                      textAlign: 'center'
                    }}>
                      Follow Us
                    </h3>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'center', 
                      gap: '12px' 
                    }}>
                      <button style={{
                        backgroundColor: '#1877F2',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50%',
                        width: '48px',
                        height: '48px',
                        cursor: 'pointer',
                        fontSize: '20px',
                        transition: 'all 0.3s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#145CB3';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#1877F2';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                      >
                        📘
                      </button>
                      <button style={{
                        backgroundColor: '#1DA1F2',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50%',
                        width: '48px',
                        height: '48px',
                        cursor: 'pointer',
                        fontSize: '20px',
                        transition: 'all 0.3s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#0C85D0';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#1DA1F2';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                      >
                        🐦
                      </button>
                      <button style={{
                        backgroundColor: '#0077B5',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50%',
                        width: '48px',
                        height: '48px',
                        cursor: 'pointer',
                        fontSize: '20px',
                        transition: 'all 0.3s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#005582';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#0077B5';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                      >
                        💼
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </LayoutWrapper>
      
      <FooterSection />
      
      {/* Success Snackbar */}
      <Snackbar
        open={showSuccess}
        autoHideDuration={4000}
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="success" onClose={() => setShowSuccess(false)}>
          🎉 Your inquiry has been submitted successfully!
        </Alert>
      </Snackbar>

      {/* Error Snackbar */}
      <Snackbar
        open={showError}
        autoHideDuration={4000}
        onClose={() => setShowError(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="error" onClose={() => setShowError(false)}>
          ❌ Failed to submit inquiry. Please try again.
        </Alert>
      </Snackbar>
    </div>
  );
};

export default ContactUsPage;