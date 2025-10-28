import Navbar from '../components/Navbar';
import FooterSection from '../components/FooterSection';
import LayoutWrapper from '../components/LayoutWrapper';

const AboutUsPage = () => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      
      <LayoutWrapper backgroundColor="transparent">
        <div style={{ 
          flex: 1, 
          padding: '64px 0', 
          background: `
            linear-gradient(135deg, rgba(248, 250, 252, 0.9) 0%, rgba(241, 245, 249, 0.9) 100%),
            url('https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2022&q=80')
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
                marginBottom: '24px',
                fontSize: '3rem'
              }}>
                About Us
              </h1>
              <h2 style={{
                color: '#475569',
                fontSize: '1.5rem',
                fontWeight: 'normal',
                maxWidth: '800px',
                margin: '0 auto',
                lineHeight: 1.6
              }}>
                Empowering futures through vocational and paramedical excellence
              </h2>
            </div>

            {/* Mission Section */}
            <div style={{ 
              backgroundColor: 'white',
              borderRadius: '16px',
              padding: '48px',
              marginBottom: '48px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
            }}>
              <h2 style={{
                fontWeight: 'bold',
                color: '#1e293b',
                marginBottom: '24px',
                fontSize: '2rem',
                textAlign: 'center'
              }}>
                Our Mission
              </h2>
              <p style={{
                fontSize: '1.1rem',
                lineHeight: 1.8,
                color: '#475569',
                textAlign: 'center',
                maxWidth: '800px',
                margin: '0 auto'
              }}>
                To bridge the gap between education and employability by providing industry-relevant vocational and paramedical training that empowers students to build successful careers and contribute meaningfully to society.
              </p>
            </div>

            {/* Values Section */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
              gap: '32px',
              marginBottom: '48px',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <div style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                padding: '32px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                textAlign: 'center'
              }}>
                <div style={{
                  backgroundColor: '#2563eb',
                  color: 'white',
                  borderRadius: '50%',
                  width: '80px',
                  height: '80px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 24px',
                  fontSize: '32px'
                }}>
                  🎯
                </div>
                <h3 style={{
                  fontWeight: 'bold',
                  color: '#1e293b',
                  marginBottom: '16px',
                  fontSize: '1.5rem'
                }}>
                  Excellence
                </h3>
                <p style={{
                  fontSize: '1rem',
                  lineHeight: 1.6,
                  color: '#475569',
                  textAlign: 'center',
                  wordWrap: 'break-word',
                  overflowWrap: 'break-word',
                  hyphens: 'auto'
                }}>
                  We maintain the highest standards in education and training, ensuring our students receive world-class instruction.
                </p>
              </div>

              <div style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                padding: '32px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                textAlign: 'center'
              }}>
                <div style={{
                  backgroundColor: '#10b981',
                  color: 'white',
                  borderRadius: '50%',
                  width: '80px',
                  height: '80px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 24px',
                  fontSize: '32px'
                }}>
                  🤝
                </div>
                <h3 style={{
                  fontWeight: 'bold',
                  color: '#1e293b',
                  marginBottom: '16px',
                  fontSize: '1.5rem'
                }}>
                  Integrity
                </h3>
                <p style={{
                  fontSize: '1rem',
                  lineHeight: 1.6,
                  color: '#475569',
                  textAlign: 'center',
                  wordWrap: 'break-word',
                  overflowWrap: 'break-word',
                  hyphens: 'auto'
                }}>
                  We conduct all our activities with honesty, transparency, and ethical practices.
                </p>
              </div>

              <div style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                padding: '32px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                textAlign: 'center'
              }}>
                <div style={{
                  backgroundColor: '#f59e0b',
                  color: 'white',
                  borderRadius: '50%',
                  width: '80px',
                  height: '80px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 24px',
                  fontSize: '32px'
                }}>
                  🌟
                </div>
                <h3 style={{
                  fontWeight: 'bold',
                  color: '#1e293b',
                  marginBottom: '16px',
                  fontSize: '1.5rem'
                }}>
                  Innovation
                </h3>
                <p style={{
                  fontSize: '1rem',
                  lineHeight: 1.6,
                  color: '#475569',
                  textAlign: 'center',
                  wordWrap: 'break-word',
                  overflowWrap: 'break-word',
                  hyphens: 'auto'
                }}>
                  We continuously evolve our curriculum and teaching methods to stay ahead of industry trends.
                </p>
              </div>
            </div>

            {/* Statistics Section */}
            <div style={{ 
              backgroundColor: 'white',
              borderRadius: '16px',
              padding: '48px',
              marginBottom: '48px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
            }}>
              <h2 style={{
                fontWeight: 'bold',
                color: '#1e293b',
                marginBottom: '32px',
                fontSize: '2rem',
                textAlign: 'center'
              }}>
                Our Impact
              </h2>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                gap: '32px' 
              }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    fontSize: '3rem',
                    fontWeight: 'bold',
                    color: '#2563eb',
                    marginBottom: '8px'
                  }}>
                    10,000+
                  </div>
                  <div style={{
                    fontSize: '1.1rem',
                    color: '#475569',
                    fontWeight: '600'
                  }}>
                    Students Trained
                  </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    fontSize: '3rem',
                    fontWeight: 'bold',
                    color: '#10b981',
                    marginBottom: '8px'
                  }}>
                    95%
                  </div>
                  <div style={{
                    fontSize: '1.1rem',
                    color: '#475569',
                    fontWeight: '600'
                  }}>
                    Placement Rate
                  </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    fontSize: '3rem',
                    fontWeight: 'bold',
                    color: '#f59e0b',
                    marginBottom: '8px'
                  }}>
                    100+
                  </div>
                  <div style={{
                    fontSize: '1.1rem',
                    color: '#475569',
                    fontWeight: '600'
                  }}>
                    Programs Offered
                  </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    fontSize: '3rem',
                    fontWeight: 'bold',
                    color: '#8b5cf6',
                    marginBottom: '8px'
                  }}>
                    15+
                  </div>
                  <div style={{
                    fontSize: '1.1rem',
                    color: '#475569',
                    fontWeight: '600'
                  }}>
                    Years Experience
                  </div>
                </div>
              </div>
            </div>

            {/* Team Section */}
            <div style={{ 
              backgroundColor: 'white',
              borderRadius: '16px',
              padding: '48px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
            }}>
              <h2 style={{
                fontWeight: 'bold',
                color: '#1e293b',
                marginBottom: '32px',
                fontSize: '2rem',
                textAlign: 'center'
              }}>
                Our Team
              </h2>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
                gap: '32px',
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    backgroundColor: '#e2e8f0',
                    borderRadius: '50%',
                    width: '120px',
                    height: '120px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px',
                    fontSize: '48px'
                  }}>
                    👨‍🏫
                  </div>
                  <h3 style={{
                    fontWeight: 'bold',
                    color: '#1e293b',
                    marginBottom: '8px',
                    fontSize: '1.25rem'
                  }}>
                    Expert Faculty
                  </h3>
                  <p style={{
                    fontSize: '1rem',
                    color: '#475569',
                    lineHeight: 1.6,
                    textAlign: 'center',
                    wordWrap: 'break-word',
                    overflowWrap: 'break-word',
                    hyphens: 'auto'
                  }}>
                    Industry professionals with years of experience in their respective fields.
                  </p>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    backgroundColor: '#e2e8f0',
                    borderRadius: '50%',
                    width: '120px',
                    height: '120px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px',
                    fontSize: '48px'
                  }}>
                    🎓
                  </div>
                  <h3 style={{
                    fontWeight: 'bold',
                    color: '#1e293b',
                    marginBottom: '8px',
                    fontSize: '1.25rem'
                  }}>
                    Academic Excellence
                  </h3>
                  <p style={{
                    fontSize: '1rem',
                    color: '#475569',
                    lineHeight: 1.6,
                    textAlign: 'center',
                    wordWrap: 'break-word',
                    overflowWrap: 'break-word',
                    hyphens: 'auto'
                  }}>
                    Qualified educators committed to student success and learning outcomes.
                  </p>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    backgroundColor: '#e2e8f0',
                    borderRadius: '50%',
                    width: '120px',
                    height: '120px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px',
                    fontSize: '48px'
                  }}>
                    🏥
                  </div>
                  <h3 style={{
                    fontWeight: 'bold',
                    color: '#1e293b',
                    marginBottom: '8px',
                    fontSize: '1.25rem'
                  }}>
                    Industry Partners
                  </h3>
                  <p style={{
                    fontSize: '1rem',
                    color: '#475569',
                    lineHeight: 1.6,
                    textAlign: 'center',
                    wordWrap: 'break-word',
                    overflowWrap: 'break-word',
                    hyphens: 'auto'
                  }}>
                    Collaborations with leading hospitals and healthcare institutions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </LayoutWrapper>
      
      <FooterSection />
    </div>
  );
};

export default AboutUsPage;