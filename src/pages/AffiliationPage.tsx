import Navbar from '../components/Navbar';
import FooterSection from '../components/FooterSection';
import LayoutWrapper from '../components/LayoutWrapper';

const AffiliationPage = () => {
  const affiliations = [
    {
      name: "National Council for Vocational Training (NCVT)",
      logo: "https://upload.wikimedia.org/wikipedia/en/thumb/4/47/NCVT_Logo.png/220px-NCVT_Logo.png",
      description: "NCVT is an advisory body set up by the Government of India. It provides accreditation to various vocational training institutes and ensures quality standards.",
      type: "Government Body",
      status: "Approved",
      color: "#2563eb"
    },
    {
      name: "Skill India (National Skill Development Corporation)",
      logo: "https://upload.wikimedia.org/wikipedia/en/thumb/b/b1/Skill_India_logo.png/220px-Skill_India_logo.png",
      description: "Skill India is a government initiative to empower the youth of the country with skill sets which make them more employable and more productive in their work environment.",
      type: "Government Initiative",
      status: "Partner",
      color: "#10b981"
    },
    {
      name: "University Grants Commission (UGC)",
      logo: "https://upload.wikimedia.org/wikipedia/en/thumb/a/a3/University_Grants_Commission_logo.svg/1200px-University_Grants_Commission_logo.svg.png",
      description: "The UGC is a statutory body set up by the Indian Union government in accordance to the UGC Act 1956 under Ministry of Education, and is charged with coordination, determination and maintenance of standards of higher education.",
      type: "Regulatory Body",
      status: "Recognized",
      color: "#f59e0b"
    },
    {
      name: "All India Council for Technical Education (AICTE)",
      logo: "https://upload.wikimedia.org/wikipedia/en/thumb/e/e6/All_India_Council_for_Technical_Education_logo.png/220px-All_India_Council_for_Technical_Education_logo.png",
      description: "AICTE is the statutory body and a national-level council for technical education, under Department of Higher Education, Ministry of Education. It is responsible for proper planning and coordinated development of the technical education and management education system in India.",
      type: "Regulatory Body",
      status: "Approved",
      color: "#ef4444"
    },
    {
      name: "Ministry of Health & Family Welfare",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Ministry_of_Health_and_Family_Welfare_logo.svg/1200px-Ministry_of_Health_and_Family_Welfare_logo.svg.png",
      description: "The Ministry of Health and Family Welfare is responsible for formulation and implementation of various health programmes in India. Our paramedical programs are recognized by this ministry.",
      type: "Government Ministry",
      status: "Recognized",
      color: "#8b5cf6"
    },
    {
      name: "Indian Nursing Council (INC)",
      logo: "https://upload.wikimedia.org/wikipedia/en/thumb/8/8a/Indian_Nursing_Council_logo.png/220px-Indian_Nursing_Council_logo.png",
      description: "The Indian Nursing Council is a statutory body that regulates nursing education in India. Our nursing and paramedical programs follow INC guidelines and standards.",
      type: "Professional Council",
      status: "Approved",
      color: "#06b6d4"
    }
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      
      <LayoutWrapper backgroundColor="transparent">
        <div style={{ 
          flex: 1, 
          padding: '64px 0px', 
          background: `
          linear-gradient(135deg, rgba(248, 250, 252, 0.9) 0%, rgba(241, 245, 249, 0.9) 100%)

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
                Affiliation & Recognition
              </h1>
              <p style={{
                color: '#475569',
                fontSize: '1.25rem',
                maxWidth: '800px',
                margin: '0 auto',
                lineHeight: 1.6
              }}>
                We are proud to be affiliated with leading government bodies and professional organizations that recognize our commitment to quality education and training.
              </p>
            </div>

            {/* Introduction Section */}
            <div style={{ 
              backgroundColor: 'white',
              borderRadius: '16px',
              padding: '48px',
              marginBottom: '48px',
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
                ✅
              </div>
              <h2 style={{
                fontWeight: 'bold',
                color: '#1e293b',
                marginBottom: '16px',
                fontSize: '2rem'
              }}>
                Trusted & Recognized
              </h2>
              <p style={{
                fontSize: '1.1rem',
                lineHeight: 1.8,
                color: '#475569',
                maxWidth: '600px',
                margin: '0 auto',
                textAlign: 'center',
                wordWrap: 'break-word',
                overflowWrap: 'break-word',
                hyphens: 'auto'
              }}>
                Our affiliations with government bodies and professional councils ensure that our programs meet the highest standards and provide students with recognized qualifications.
              </p>
            </div>

            {/* Affiliations Grid */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
              gap: '72px',
              marginBottom: '48px',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              {affiliations.map((affiliation, index) => (
                <div
                  key={index}
                  style={{
                    backgroundColor: 'white',
                    borderRadius: '16px',
                    padding: '32px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                    border: '1px solid #e2e8f0',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out'
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
                  <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                    <div style={{
                      backgroundColor: '#f8fafc',
                      borderRadius: '12px',
                      padding: '16px',
                      marginBottom: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minHeight: '80px'
                    }}>
                      <div style={{
                        backgroundColor: affiliation.color,
                        color: 'white',
                        borderRadius: '8px',
                        padding: '8px 16px',
                        fontSize: '0.85rem',
                        fontWeight: 'bold',
                        marginBottom: '12px',
                        display: 'inline-block'
                      }}>
                        {affiliation.status}
                      </div>
                    </div>
                    <h3 style={{
                      fontWeight: 'bold',
                      color: '#1e293b',
                      marginBottom: '8px',
                      fontSize: '1.25rem',
                      lineHeight: 1.3,
                      textAlign: 'center',
                      wordWrap: 'break-word',
                      overflowWrap: 'break-word',
                      hyphens: 'auto'
                    }}>
                      {affiliation.name}
                    </h3>
                    <div style={{
                      backgroundColor: affiliation.color,
                      color: 'white',
                      borderRadius: '20px',
                      padding: '4px 12px',
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      display: 'inline-block',
                      marginBottom: '16px'
                    }}>
                      {affiliation.type}
                    </div>
                  </div>
                  
                  <p style={{
                    color: '#64748b',
                    lineHeight: 1.6,
                    fontSize: '1rem',
                    flex: 1,
                    textAlign: 'center',
                    wordWrap: 'break-word',
                    overflowWrap: 'break-word',
                    hyphens: 'auto'
                  }}>
                    {affiliation.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Benefits Section */}
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
                Why Our Affiliations Matter
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
                    backgroundColor: '#2563eb',
                    color: 'white',
                    borderRadius: '50%',
                    width: '80px',
                    height: '80px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px',
                    fontSize: '32px'
                  }}>
                    🎓
                  </div>
                  <h3 style={{
                    fontWeight: 'bold',
                    color: '#1e293b',
                    marginBottom: '12px',
                    fontSize: '1.25rem'
                  }}>
                    Recognized Certificates
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
                    All our certificates are recognized by government bodies and professional councils.
                  </p>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    backgroundColor: '#10b981',
                    color: 'white',
                    borderRadius: '50%',
                    width: '80px',
                    height: '80px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px',
                    fontSize: '32px'
                  }}>
                    🏆
                  </div>
                  <h3 style={{
                    fontWeight: 'bold',
                    color: '#1e293b',
                    marginBottom: '12px',
                    fontSize: '1.25rem'
                  }}>
                    Quality Assurance
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
                    Our programs meet the highest standards set by regulatory authorities.
                  </p>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    backgroundColor: '#f59e0b',
                    color: 'white',
                    borderRadius: '50%',
                    width: '80px',
                    height: '80px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px',
                    fontSize: '32px'
                  }}>
                    💼
                  </div>
                  <h3 style={{
                    fontWeight: 'bold',
                    color: '#1e293b',
                    marginBottom: '12px',
                    fontSize: '1.25rem'
                  }}>
                    Career Opportunities
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
                    Recognized qualifications open doors to better job opportunities and career growth.
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

export default AffiliationPage;