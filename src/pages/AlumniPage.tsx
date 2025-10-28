import { useState } from 'react';
import Navbar from '../components/Navbar';
import FooterSection from '../components/FooterSection';
import LayoutWrapper from '../components/LayoutWrapper';

const AlumniPage = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % Math.ceil(testimonials.length / 2));
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + Math.ceil(testimonials.length / 2)) % Math.ceil(testimonials.length / 2));
  };

  const testimonials = [
    {
      quote: "The practical training in DMLT helped me secure a hospital job within a month of completing the course. The hands-on experience was invaluable.",
      author: "Priya Sharma",
      program: "DMLT",
      role: "Lab Technician at Apollo Hospital",
      year: "2022",
      initials: "PS",
      rating: 5,
      company: "Apollo Hospital, Delhi"
    },
    {
      quote: "With the skills I gained in Yoga & Naturopathy, I started my own wellness center. The business knowledge was crucial for my success.",
      author: "Rajesh Kumar",
      program: "Yoga & Naturopathy",
      role: "Wellness Center Owner",
      year: "2021",
      initials: "RK",
      rating: 5,
      company: "Rajesh Wellness Center, Mumbai"
    },
    {
      quote: "My IT diploma gave me the foundation to become a web developer. The institute's support was excellent throughout my journey.",
      author: "Anita Singh",
      program: "IT Diploma",
      role: "Web Developer at TechCorp",
      year: "2023",
      initials: "AS",
      rating: 5,
      company: "TechCorp Solutions, Bangalore"
    },
    {
      quote: "The Fire Safety program prepared me for real-world emergencies. I now work as a Safety Officer in a major manufacturing company.",
      author: "Vikram Patel",
      program: "Fire Safety",
      role: "Safety Officer",
      year: "2022",
      initials: "VP",
      rating: 5,
      company: "Reliance Industries, Gujarat"
    },
    {
      quote: "The NTT course was comprehensive and fun. I'm now a confident nursery teacher, shaping young minds every day.",
      author: "Deepa Mehta",
      program: "NTT",
      role: "Nursery Teacher at Kidzee",
      year: "2023",
      initials: "DM",
      rating: 5,
      company: "Kidzee Preschool, Pune"
    },
    {
      quote: "The vocational training in Electrician trade opened doors to immediate employment. The practical sessions were top-notch.",
      author: "Suresh Yadav",
      program: "Electrician Trade",
      role: "Electrician at L&T",
      year: "2022",
      initials: "SY",
      rating: 4,
      company: "Larsen & Toubro, Chennai"
    },
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      
      <LayoutWrapper backgroundColor="transparent">
        {/* Hero Section */}
        <div style={{ 
          flex: 1, 
          padding: '96px 0', 
          background: `
            linear-gradient(135deg, rgba(37, 99, 235, 0.6) 0%, rgba(16, 185, 129, 0.6) 100%),
            url('https://images.unsplash.com/photo-1523240798034-6c2165d3b3b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')
          `,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          color: 'white',
          textAlign: 'center',
          position: 'relative',
          width: '100%'
        }}>
          <div style={{ 
            maxWidth: '1200px', 
            margin: '0 auto', 
            padding: '0 32px',
            position: 'relative',
            zIndex: 2
          }}>
            <div style={{
              display: 'inline-block',
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '50px',
              padding: '8px 32px',
              marginBottom: '24px',
              backdropFilter: 'blur(10px)'
            }}>
              <span style={{
                color: 'white',
                fontWeight: 'bold',
                fontSize: '1rem',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>
                🌟 Our Success Stories
              </span>
            </div>

            <h1 style={{
              fontWeight: 'bold',
              marginBottom: '16px',
              fontSize: '4rem',
              lineHeight: 1.2,
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
            }}>
              Join Our Thriving Alumni Network
            </h1>

            <p style={{
              marginBottom: '32px',
              opacity: 0.9,
              fontSize: '1.5rem',
              maxWidth: '800px',
              margin: '0 auto 32px',
              textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
            }}>
              Our graduates are making a real impact across various industries. Discover their journeys and how Mahavir Institute shaped their careers.
            </p>

            <button style={{
              backgroundColor: 'white',
              color: '#2563eb',
              border: 'none',
              borderRadius: '12px',
              padding: '16px 48px',
              fontSize: '1.2rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              boxShadow: '0 10px 25px rgba(255,255,255,0.2)',
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
              Explore Alumni Stories →
            </button>
          </div>
        </div>

        {/* Alumni Testimonials Section */}
        <div style={{ padding: '64px 0', backgroundColor: '#f8fafc' }}>
          <div style={{ 
            maxWidth: '1200px', 
            margin: '0 auto', 
            padding: '0 32px' 
          }}>
            <h2 style={{
              fontWeight: 'bold',
              color: '#1e293b',
              marginBottom: '48px',
              fontSize: '3rem',
              textAlign: 'center'
            }}>
              What Our Alumni Say
            </h2>

            <div style={{ position: 'relative', padding: '0 16px' }}>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
                gap: '32px',
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                {testimonials.slice(currentTestimonial * 2, (currentTestimonial + 1) * 2).map((testimonial, index) => (
                  <div
                    key={index}
                    style={{
                      backgroundColor: 'white',
                      borderRadius: '16px',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                      padding: '32px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      border: '1px solid #e2e8f0',
                      height: '100%'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', marginBottom: '24px', justifyContent: 'center' }}>
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <span key={i} style={{ color: '#f59e0b', fontSize: '24px' }}>⭐</span>
                        ))}
                      </div>
                      <p style={{
                        fontSize: '1.1rem',
                        lineHeight: 1.8,
                        color: '#475569',
                        fontStyle: 'italic',
                        marginBottom: '24px',
                        textAlign: 'center',
                        wordWrap: 'break-word',
                        overflowWrap: 'break-word',
                        hyphens: 'auto'
                      }}>
                        "{testimonial.quote}"
                      </p>
                      <div style={{ 
                        height: '1px', 
                        backgroundColor: '#e2e8f0', 
                        margin: '16px 0' 
                      }} />
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
                          fontWeight: 'bold',
                          fontSize: '1.1rem'
                        }}>
                          {testimonial.initials}
                        </div>
                        <div>
                          <h3 style={{ 
                            fontWeight: 'bold', 
                            color: '#1e293b',
                            margin: '0 0 4px 0',
                            fontSize: '1.1rem'
                          }}>
                            {testimonial.author}
                          </h3>
                          <p style={{ 
                            color: '#64748b', 
                            margin: '0 0 2px 0',
                            fontSize: '0.9rem'
                          }}>
                            {testimonial.role} ({testimonial.year})
                          </p>
                          <p style={{ 
                            color: '#64748b', 
                            margin: 0,
                            fontSize: '0.9rem'
                          }}>
                            {testimonial.company}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Carousel Navigation */}
              <button
                onClick={prevTestimonial}
                style={{
                  position: 'absolute',
                  left: '-40px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  backgroundColor: 'rgba(0,0,0,0.05)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '48px',
                  height: '48px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.05)';
                }}
              >
                ←
              </button>
              <button
                onClick={nextTestimonial}
                style={{
                  position: 'absolute',
                  right: '-40px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  backgroundColor: 'rgba(0,0,0,0.05)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '48px',
                  height: '48px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.05)';
                }}
              >
                →
              </button>
            </div>
          </div>
        </div>

        {/* Industry Placement Stats */}
        <div style={{ padding: '64px 0', backgroundColor: 'white' }}>
          <div style={{ 
            maxWidth: '1200px', 
            margin: '0 auto', 
            padding: '0 32px' 
          }}>
            <h2 style={{
              fontWeight: 'bold',
              color: '#1e293b',
              marginBottom: '48px',
              fontSize: '3rem',
              textAlign: 'center'
            }}>
              Our Alumni Across Industries
            </h2>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
              gap: '32px',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                borderRadius: '16px',
                padding: '32px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                textAlign: 'center',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
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
                  margin: '0 auto 16px',
                  fontSize: '32px'
                }}>
                  🏥
                </div>
                <h3 style={{
                  fontWeight: 'bold',
                  color: '#1e293b',
                  marginBottom: '8px',
                  fontSize: '1.5rem'
                }}>
                  Hospitals
                </h3>
                <div style={{
                  fontSize: '3rem',
                  fontWeight: 'bold',
                  color: '#2563eb',
                  marginBottom: '8px'
                }}>
                  150+
                </div>
                <p style={{
                  fontSize: '1rem',
                  color: '#64748b',
                  margin: 0
                }}>
                  Healthcare professionals
                </p>
              </div>

              <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                borderRadius: '16px',
                padding: '32px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                textAlign: 'center',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}>
                <div style={{
                  backgroundColor: '#0ea5e9',
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
                  💻
                </div>
                <h3 style={{
                  fontWeight: 'bold',
                  color: '#1e293b',
                  marginBottom: '8px',
                  fontSize: '1.5rem'
                }}>
                  IT Companies
                </h3>
                <div style={{
                  fontSize: '3rem',
                  fontWeight: 'bold',
                  color: '#0ea5e9',
                  marginBottom: '8px'
                }}>
                  200+
                </div>
                <p style={{
                  fontSize: '1rem',
                  color: '#64748b',
                  margin: 0
                }}>
                  Tech professionals
                </p>
              </div>

              <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                borderRadius: '16px',
                padding: '32px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                textAlign: 'center',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
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
                  margin: '0 auto 16px',
                  fontSize: '32px'
                }}>
                  🎓
                </div>
                <h3 style={{
                  fontWeight: 'bold',
                  color: '#1e293b',
                  marginBottom: '8px',
                  fontSize: '1.5rem'
                }}>
                  Educational Institutions
                </h3>
                <div style={{
                  fontSize: '3rem',
                  fontWeight: 'bold',
                  color: '#10b981',
                  marginBottom: '8px'
                }}>
                  80+
                </div>
                <p style={{
                  fontSize: '1rem',
                  color: '#64748b',
                  margin: 0
                }}>
                  Teachers & trainers
                </p>
              </div>

              <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                borderRadius: '16px',
                padding: '32px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                textAlign: 'center',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
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
                  margin: '0 auto 16px',
                  fontSize: '32px'
                }}>
                  🌿
                </div>
                <h3 style={{
                  fontWeight: 'bold',
                  color: '#1e293b',
                  marginBottom: '8px',
                  fontSize: '1.5rem'
                }}>
                  Wellness Centers
                </h3>
                <div style={{
                  fontSize: '3rem',
                  fontWeight: 'bold',
                  color: '#2563eb',
                  marginBottom: '8px'
                }}>
                  120+
                </div>
                <p style={{
                  fontSize: '1rem',
                  color: '#64748b',
                  margin: 0
                }}>
                  Wellness professionals
                </p>
              </div>

              <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                borderRadius: '16px',
                padding: '32px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                textAlign: 'center',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}>
                <div style={{
                  backgroundColor: '#06b6d4',
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
                  marginBottom: '8px',
                  fontSize: '1.5rem'
                }}>
                  Manufacturing
                </h3>
                <div style={{
                  fontSize: '3rem',
                  fontWeight: 'bold',
                  color: '#06b6d4',
                  marginBottom: '8px'
                }}>
                  90+
                </div>
                <p style={{
                  fontSize: '1rem',
                  color: '#64748b',
                  margin: 0
                }}>
                  Industrial workers
                </p>
              </div>

              <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                borderRadius: '16px',
                padding: '32px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                textAlign: 'center',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
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
                  margin: '0 auto 16px',
                  fontSize: '32px'
                }}>
                  🚜
                </div>
                <h3 style={{
                  fontWeight: 'bold',
                  color: '#1e293b',
                  marginBottom: '8px',
                  fontSize: '1.5rem'
                }}>
                  Agriculture
                </h3>
                <div style={{
                  fontSize: '3rem',
                  fontWeight: 'bold',
                  color: '#2563eb',
                  marginBottom: '8px'
                }}>
                  60+
                </div>
                <p style={{
                  fontSize: '1rem',
                  color: '#64748b',
                  margin: 0
                }}>
                  Farmers & agripreneurs
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div style={{ 
          padding: '64px 0', 
          background: 'linear-gradient(135deg, #2563eb 0%, #10b981 100%)', 
          color: 'white' 
        }}>
          <div style={{ 
            maxWidth: '1200px', 
            margin: '0 auto', 
            padding: '0 32px' 
          }}>
            <h2 style={{
              fontWeight: 'bold',
              marginBottom: '48px',
              fontSize: '3rem',
              textAlign: 'center'
            }}>
              Our Impact in Numbers
            </h2>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
              gap: '32px',
              justifyContent: 'center',
              alignItems: 'center'
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
                  Alumni
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: '3rem',
                  fontWeight: 'bold',
                  color: '#10b981',
                  marginBottom: '8px'
                }}>
                  500+
                </div>
                <div style={{
                  fontSize: '1.1rem',
                  color: '#475569',
                  fontWeight: '600'
                }}>
                  Hiring Partners
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
                  Programs
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: '3rem',
                  fontWeight: 'bold',
                  color: '#8b5cf6',
                  marginBottom: '8px'
                }}>
                  25+
                </div>
                <div style={{
                  fontSize: '1.1rem',
                  color: '#475569',
                  fontWeight: '600'
                }}>
                  Indian States
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div style={{ padding: '64px 0', backgroundColor: 'white' }}>
          <div style={{ 
            maxWidth: '1200px', 
            margin: '0 auto', 
            padding: '0 32px' 
          }}>
            <div style={{ 
              backgroundColor: 'white',
              borderRadius: '16px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
              padding: '48px',
              textAlign: 'center'
            }}>
              <h2 style={{
                fontWeight: 'bold',
                color: '#1e293b',
                marginBottom: '24px',
                fontSize: '2.5rem'
              }}>
                Ready to Share Your Success Story?
              </h2>
              <p style={{
                color: '#475569',
                marginBottom: '32px',
                fontSize: '1.2rem',
                maxWidth: '600px',
                margin: '0 auto 32px',
                textAlign: 'center',
                wordWrap: 'break-word',
                overflowWrap: 'break-word',
                hyphens: 'auto'
              }}>
                We love hearing from our alumni! Connect with us and inspire future generations.
              </p>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                gap: '16px', 
                flexWrap: 'wrap' 
              }}>
                <button style={{
                  backgroundColor: '#0077B5',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '12px 24px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#005582';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,119,181,0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#0077B5';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
                >
                  💼 LinkedIn
                </button>
                <button style={{
                  backgroundColor: '#1DA1F2',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '12px 24px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#0C85D0';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(29,161,242,0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#1DA1F2';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
                >
                  🐦 Twitter
                </button>
                <button style={{
                  backgroundColor: '#1877F2',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '12px 24px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#145CB3';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(24,119,242,0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#1877F2';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
                >
                  📘 Facebook
                </button>
              </div>
            </div>
          </div>
        </div>
      </LayoutWrapper>
      
      <FooterSection />
    </div>
  );
};

export default AlumniPage;