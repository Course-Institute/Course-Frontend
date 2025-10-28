import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import FooterSection from '../components/FooterSection';
import InquiryDialog from '../components/InquiryDialog';
import LayoutWrapper from '../components/LayoutWrapper';
import { programsData } from '../constants/programsData';

const ProgramsPage = () => {
  const [inquiryDialogOpen, setInquiryDialogOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      
      <LayoutWrapper backgroundColor="transparent">
        <div style={{ 
          flex: 1, 
          padding: '64px 0', 
          background: `
            linear-gradient(135deg, rgba(248, 250, 252, 0.5) 0%, rgba(241, 245, 249, 0.5) 100%),
            url('https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')
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
              <div style={{
                display: 'inline-block',
                background: 'linear-gradient(135deg, #2563eb 0%, #10b981 100%)',
                borderRadius: '50px',
                padding: '8px 32px',
                marginBottom: '24px',
                boxShadow: '0 8px 20px rgba(37, 99, 235, 0.3)'
              }}>
                <span style={{
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  textTransform: 'uppercase',
                  letterSpacing: '1px'
                }}>
                  🎓 Educational Excellence
                </span>
              </div>

              <h1 style={{
                fontWeight: 'bold',
                color: '#1e293b',
                marginBottom: '16px',
                fontSize: '3.5rem',
                lineHeight: 1.2
              }}>
                Explore Our Diverse Programs
              </h1>

              <p style={{
                color: '#475569',
                fontSize: '1.25rem',
                maxWidth: '800px',
                margin: '0 auto',
                lineHeight: 1.6
              }}>
                Discover a wide range of vocational and paramedical courses designed to equip you with in-demand skills and open doors to rewarding career opportunities.
              </p>
            </div>

            {/* Programs Grid */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
              gap: '32px',
              marginBottom: '80px',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              {programsData.map((program) => (
                <div
                  key={program.id}
                  onClick={() => navigate(`/programs/${program.id}`)}
                  style={{
                    backgroundColor: 'white',
                    borderRadius: '16px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                    transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                    cursor: 'pointer',
                    overflow: 'hidden',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px)';
                    e.currentTarget.style.boxShadow = '0 15px 40px rgba(0,0,0,0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
                  }}
                >
                  <div style={{
                    height: '200px',
                    backgroundImage: `url(${program.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    borderRadius: '16px 16px 0 0'
                  }} />
                  
                  <div style={{ padding: '32px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{
                      backgroundColor: program.color,
                      color: 'white',
                      fontWeight: 'bold',
                      padding: '8px 16px',
                      borderRadius: '20px',
                      fontSize: '0.85rem',
                      marginBottom: '16px',
                      display: 'inline-block',
                      width: 'fit-content'
                    }}>
                      {program.category}
                    </div>
                    
                    <h3 style={{
                      fontWeight: 'bold',
                      color: '#1e293b',
                      marginBottom: '12px',
                      fontSize: '1.5rem',
                      lineHeight: 1.3
                    }}>
                      {program.category} Programs
                    </h3>
                    
                    <p style={{
                      color: '#64748b',
                      lineHeight: 1.6,
                      marginBottom: '24px',
                      flex: 1,
                      fontSize: '1rem',
                      textAlign: 'center',
                      wordWrap: 'break-word',
                      overflowWrap: 'break-word',
                      hyphens: 'auto'
                    }}>
                      {program.description}
                    </p>
                    
                    <button
                      style={{
                        backgroundColor: program.color,
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '12px 24px',
                        fontSize: '0.9rem',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        marginTop: 'auto',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.opacity = '0.9';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.opacity = '1';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                    >
                      View Details →
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Call to Action */}
            <div style={{ textAlign: 'center' }}>
              <h2 style={{
                fontWeight: 'bold',
                color: '#1e293b',
                marginBottom: '24px',
                fontSize: '2.5rem'
              }}>
                Can't find what you're looking for?
              </h2>
              <p style={{
                color: '#475569',
                marginBottom: '32px',
                fontSize: '1.2rem',
                maxWidth: '600px',
                margin: '0 auto 32px'
              }}>
                Our team is ready to assist you in finding the perfect program to match your career aspirations.
              </p>
              <button
                onClick={() => setInquiryDialogOpen(true)}
                style={{
                  background: 'linear-gradient(135deg, #2563eb 0%, #10b981 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '16px 48px',
                  fontSize: '1.2rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  boxShadow: '0 10px 25px rgba(37, 99, 235, 0.3)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 15px 35px rgba(37, 99, 235, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 10px 25px rgba(37, 99, 235, 0.3)';
                }}
              >
                Learn More
              </button>
            </div>
          </div>
        </div>
      </LayoutWrapper>
      
      <FooterSection />

      {/* Inquiry Dialog */}
      <InquiryDialog
        open={inquiryDialogOpen}
        onClose={() => setInquiryDialogOpen(false)}
        title="Explore Our Programs"
        subtitle="Get detailed information about our programs and career opportunities. Our admissions team is here to help you choose the right path."
      />
    </div>
  );
};

export default ProgramsPage;