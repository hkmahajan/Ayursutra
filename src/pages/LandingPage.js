import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Button, Row, Col, Card } from 'react-bootstrap';
import './LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      {/* Navigation Bar */}
      <nav className="landing-navbar">
        <Container>
          <div className="navbar-content">
            <div className="logo-section">
              <h3 className="logo-text">🕉 AyurSutra</h3>
            </div>
            <div className="nav-links">
              <a href="#features">Features</a>
              <a href="#therapies">Therapies</a>
              <a href="#benefits">Benefits</a>
              <a href="#testimonials">Testimonials</a>
              <Button 
                variant="outline-success" 
                size="sm"
                onClick={() => navigate('/login')}
              >
                Login
              </Button>
            </div>
          </div>
        </Container>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <Container>
          <Row className="align-items-center">
            <Col lg={6}>
              <h1 className="hero-title">AyurSutra</h1>
              <p className="hero-subtitle">Ancient Wisdom, Modern Wellness</p>
              <p className="hero-description">
                Experience the transformative power of Ayurveda with personalized Panchakarma therapies. 
                Discover balance, healing, and holistic wellness through time-tested Ayurvedic practices.
              </p>
              <div className="hero-buttons">
                <Button 
                  className="btn-primary-custom" 
                  size="lg"
                  onClick={() => navigate('/login')}
                >
                  <i className="bi bi-play-circle me-2"></i>Get Started
                </Button>
                <Button 
                  variant="outline-light" 
                  size="lg"
                  onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
                >
                  Learn More
                </Button>
              </div>
            </Col>
            <Col lg={6} className="d-none d-lg-block">
              <div className="hero-image">
                <img 
                  src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&h=600&fit=crop" 
                  alt="Ayurveda Therapy" 
                  className="img-fluid rounded-circle shadow-lg"
                />
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Features Section */}
      <section className="section-padding" id="features">
        <Container>
          <div className="section-title text-center mb-5">
            <h2>Why Choose AyurSutra?</h2>
            <p className="text-muted">Comprehensive Ayurvedic care tailored to your needs</p>
          </div>
          <Row className="g-4">
            <Col md={4}>
              <Card className="feature-card h-100 text-center border-0 shadow-sm">
                <Card.Body>
                  <div className="feature-icon mb-3">
                    <i className="bi bi-heart-pulse"></i>
                  </div>
                  <h4>Personalized Care</h4>
                  <p>Tailored Panchakarma treatments based on your unique dosha constitution and health goals</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="feature-card h-100 text-center border-0 shadow-sm">
                <Card.Body>
                  <div className="feature-icon mb-3">
                    <i className="bi bi-calendar-check"></i>
                  </div>
                  <h4>Easy Booking</h4>
                  <p>Schedule and manage your therapy sessions with just a few clicks through our intuitive platform</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="feature-card h-100 text-center border-0 shadow-sm">
                <Card.Body>
                  <div className="feature-icon mb-3">
                    <i className="bi bi-people"></i>
                  </div>
                  <h4>Expert Practitioners</h4>
                  <p>Connect with certified Ayurvedic doctors and experienced therapists with years of practice</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="feature-card h-100 text-center border-0 shadow-sm">
                <Card.Body>
                  <div className="feature-icon mb-3">
                    <i className="bi bi-clipboard-data"></i>
                  </div>
                  <h4>Health Tracking</h4>
                  <p>Monitor your progress with detailed health metrics and personalized wellness insights</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="feature-card h-100 text-center border-0 shadow-sm">
                <Card.Body>
                  <div className="feature-icon mb-3">
                    <i className="bi bi-book"></i>
                  </div>
                  <h4>Educational Resources</h4>
                  <p>Access comprehensive guides about Ayurveda, doshas, and traditional healing practices</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="feature-card h-100 text-center border-0 shadow-sm">
                <Card.Body>
                  <div className="feature-icon mb-3">
                    <i className="bi bi-chat-dots"></i>
                  </div>
                  <h4>24/7 Support</h4>
                  <p>Get instant consultation and support from our dedicated team of Ayurvedic experts</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Therapies Section */}
      <section className="section-padding bg-light" id="therapies">
        <Container>
          <div className="section-title text-center mb-5">
            <h2>Five Shodanas of Panchakarma</h2>
            <p className="text-muted">Discover the ancient cleansing therapies for complete body detoxification</p>
          </div>
          <Row className="g-4">
            <Col md={6} lg={4}>
              <Card className="therapy-card h-100 border-0 shadow">
                <Card.Body>
                  <div className="therapy-icon mb-3">
                    <i className="bi bi-droplet-fill"></i>
                  </div>
                  <h4>Vamana</h4>
                  <p className="text-muted mb-2">Emesis Therapy</p>
                  <p>Therapeutic vomiting to eliminate excess Kapha dosha from the respiratory system. Effective for asthma, bronchitis, and chronic cold.</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6} lg={4}>
              <Card className="therapy-card h-100 border-0 shadow">
                <Card.Body>
                  <div className="therapy-icon mb-3">
                    <i className="bi bi-wind"></i>
                  </div>
                  <h4>Virechana</h4>
                  <p className="text-muted mb-2">Purgation Therapy</p>
                  <p>Cleansing therapy to remove excess Pitta dosha from the body. Treats skin diseases, jaundice, and digestive disorders.</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6} lg={4}>
              <Card className="therapy-card h-100 border-0 shadow">
                <Card.Body>
                  <div className="therapy-icon mb-3">
                    <i className="bi bi-moisture"></i>
                  </div>
                  <h4>Basti</h4>
                  <p className="text-muted mb-2">Enema Therapy</p>
                  <p>Medicated enema therapy for Vata dosha balance. Controls diseases of the colon, joints, and nervous system.</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6} lg={4}>
              <Card className="therapy-card h-100 border-0 shadow">
                <Card.Body>
                  <div className="therapy-icon mb-3">
                    <i className="bi bi-flower3"></i>
                  </div>
                  <h4>Nasya</h4>
                  <p className="text-muted mb-2">Nasal Administration</p>
                  <p>Administration of herbal oils through nasal passages. Clears sinus congestion, migraines, and improves mental clarity.</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6} lg={4}>
              <Card className="therapy-card h-100 border-0 shadow">
                <Card.Body>
                  <div className="therapy-icon mb-3">
                    <i className="bi bi-heart"></i>
                  </div>
                  <h4>Rakta Moksha</h4>
                  <p className="text-muted mb-2">Blood Purification</p>
                  <p>Traditional blood purification therapy to eliminate toxins. Treats skin disorders, hypertension, and gout.</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6} lg={4}>
              <Card className="therapy-card h-100 border-0 shadow">
                <Card.Body>
                  <div className="therapy-icon mb-3">
                    <i className="bi bi-stars"></i>
                  </div>
                  <h4>Purvakarma</h4>
                  <p className="text-muted mb-2">Pre-purification</p>
                  <p>Preparatory procedures including Snehan (oil massage) and Svedana (steam therapy) before main treatments.</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Benefits Section */}
      <section className="section-padding" id="benefits">
        <Container>
          <Row className="align-items-center">
            <Col lg={6} className="mb-4 mb-lg-0">
              <div className="benefits-image">
                <img 
                  src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&h=400&fit=crop" 
                  alt="Ayurveda Benefits" 
                  className="img-fluid rounded shadow-lg"
                />
              </div>
            </Col>
            <Col lg={6}>
              <div className="section-title mb-4">
                <h2>Benefits of Panchakarma</h2>
                <p className="text-muted">Transform your health with holistic Ayurvedic healing</p>
              </div>
              <div className="benefits-list">
                <div className="benefit-item">
                  <i className="bi bi-check-circle-fill text-success"></i>
                  <div>
                    <h5>Complete Detoxification</h5>
                    <p>Eliminates deep-rooted toxins from body tissues and organs</p>
                  </div>
                </div>
                <div className="benefit-item">
                  <i className="bi bi-check-circle-fill text-success"></i>
                  <div>
                    <h5>Boosts Immunity</h5>
                    <p>Strengthens the immune system and enhances disease resistance</p>
                  </div>
                </div>
                <div className="benefit-item">
                  <i className="bi bi-check-circle-fill text-success"></i>
                  <div>
                    <h5>Stress Relief</h5>
                    <p>Reduces stress, anxiety, and promotes mental clarity</p>
                  </div>
                </div>
                <div className="benefit-item">
                  <i className="bi bi-check-circle-fill text-success"></i>
                  <div>
                    <h5>Improved Digestion</h5>
                    <p>Restores digestive fire (Agni) and enhances metabolism</p>
                  </div>
                </div>
                <div className="benefit-item">
                  <i className="bi bi-check-circle-fill text-success"></i>
                  <div>
                    <h5>Anti-Aging Effects</h5>
                    <p>Rejuvenates tissues, improves skin health and vitality</p>
                  </div>
                </div>
                <div className="benefit-item">
                  <i className="bi bi-check-circle-fill text-success"></i>
                  <div>
                    <h5>Weight Management</h5>
                    <p>Helps achieve and maintain optimal body weight naturally</p>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Doshas Section */}
      <section className="section-padding bg-light">
        <Container>
          <div className="section-title text-center mb-5">
            <h2>Understand Your Dosha</h2>
            <p className="text-muted">Discover your unique Ayurvedic body constitution</p>
          </div>
          <Row className="g-4">
            <Col md={4}>
              <Card className="dosha-card vata-card h-100 border-0 shadow">
                <Card.Body className="text-center">
                  <div className="dosha-icon mb-3">
                    <i className="bi bi-wind"></i>
                  </div>
                  <h3>Vata</h3>
                  <p className="dosha-elements mb-3">Air + Ether</p>
                  <p>Governs movement, breathing, and circulation. Vata types are creative, energetic, and quick-thinking.</p>
                  <div className="dosha-traits mt-3">
                    <span className="badge bg-light text-dark me-2">Creative</span>
                    <span className="badge bg-light text-dark me-2">Energetic</span>
                    <span className="badge bg-light text-dark">Flexible</span>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="dosha-card pitta-card h-100 border-0 shadow">
                <Card.Body className="text-center">
                  <div className="dosha-icon mb-3">
                    <i className="bi bi-fire"></i>
                  </div>
                  <h3>Pitta</h3>
                  <p className="dosha-elements mb-3">Fire + Water</p>
                  <p>Controls digestion, metabolism, and body temperature. Pitta types are intelligent, ambitious, and passionate.</p>
                  <div className="dosha-traits mt-3">
                    <span className="badge bg-light text-dark me-2">Intelligent</span>
                    <span className="badge bg-light text-dark me-2">Focused</span>
                    <span className="badge bg-light text-dark">Leader</span>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="dosha-card kapha-card h-100 border-0 shadow">
                <Card.Body className="text-center">
                  <div className="dosha-icon mb-3">
                    <i className="bi bi-droplet"></i>
                  </div>
                  <h3>Kapha</h3>
                  <p className="dosha-elements mb-3">Water + Earth</p>
                  <p>Provides structure, stability, and lubrication. Kapha types are calm, steady, and nurturing.</p>
                  <div className="dosha-traits mt-3">
                    <span className="badge bg-light text-dark me-2">Calm</span>
                    <span className="badge bg-light text-dark me-2">Stable</span>
                    <span className="badge bg-light text-dark">Caring</span>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Testimonials Section */}
      <section className="section-padding" id="testimonials">
        <Container>
          <div className="section-title text-center mb-5">
            <h2>What Our Patients Say</h2>
            <p className="text-muted">Real stories from people who transformed their health</p>
          </div>
          <Row className="g-4">
            <Col md={4}>
              <Card className="testimonial-card h-100 border-0 shadow-sm">
                <Card.Body>
                  <div className="rating mb-3">
                    <i className="bi bi-star-fill text-warning"></i>
                    <i className="bi bi-star-fill text-warning"></i>
                    <i className="bi bi-star-fill text-warning"></i>
                    <i className="bi bi-star-fill text-warning"></i>
                    <i className="bi bi-star-fill text-warning"></i>
                  </div>
                  <p className="mb-3">"The Panchakarma therapy was life-changing! After struggling with chronic stress and digestive issues, I feel completely rejuvenated. The doctors are incredibly knowledgeable."</p>
                  <div className="testimonial-author">
                    <h6 className="mb-0">Priya Sharma</h6>
                    <small className="text-muted">Mumbai, India</small>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="testimonial-card h-100 border-0 shadow-sm">
                <Card.Body>
                  <div className="rating mb-3">
                    <i className="bi bi-star-fill text-warning"></i>
                    <i className="bi bi-star-fill text-warning"></i>
                    <i className="bi bi-star-fill text-warning"></i>
                    <i className="bi bi-star-fill text-warning"></i>
                    <i className="bi bi-star-fill text-warning"></i>
                  </div>
                  <p className="mb-3">"I've tried many wellness programs, but AyurSutra's personalized approach is unmatched. The Nasya therapy cleared my chronic sinusitis completely!"</p>
                  <div className="testimonial-author">
                    <h6 className="mb-0">Rajesh Kumar</h6>
                    <small className="text-muted">Bangalore, India</small>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="testimonial-card h-100 border-0 shadow-sm">
                <Card.Body>
                  <div className="rating mb-3">
                    <i className="bi bi-star-fill text-warning"></i>
                    <i className="bi bi-star-fill text-warning"></i>
                    <i className="bi bi-star-fill text-warning"></i>
                    <i className="bi bi-star-fill text-warning"></i>
                    <i className="bi bi-star-fill text-warning"></i>
                  </div>
                  <p className="mb-3">"The platform is so easy to use! I can track my progress, book appointments, and learn about Ayurveda all in one place. Highly recommended!"</p>
                  <div className="testimonial-author">
                    <h6 className="mb-0">Anjali Reddy</h6>
                    <small className="text-muted">Hyderabad, India</small>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <Container className="text-center">
          <h2 className="mb-3">Ready to Begin Your Healing Journey?</h2>
          <p className="mb-4">Join thousands who have transformed their health with authentic Ayurvedic treatments</p>
          <div className="cta-buttons">
            <Button 
              className="btn-primary-custom me-3" 
              size="lg"
              onClick={() => navigate('/login')}
            >
              <i className="bi bi-person-plus me-2"></i>Start Your Journey
            </Button>
            <Button 
              variant="outline-light" 
              size="lg"
              onClick={() => navigate('/login')}
            >
              <i className="bi bi-telephone me-2"></i>Contact Us
            </Button>
          </div>
          <div className="cta-features mt-5">
            <Row>
              <Col md={3} sm={6} className="mb-3">
                <i className="bi bi-shield-check text-white mb-2" style={{fontSize: '2rem'}}></i>
                <p className="text-white mb-0">Certified Doctors</p>
              </Col>
              <Col md={3} sm={6} className="mb-3">
                <i className="bi bi-award text-white mb-2" style={{fontSize: '2rem'}}></i>
                <p className="text-white mb-0">Quality Treatments</p>
              </Col>
              <Col md={3} sm={6} className="mb-3">
                <i className="bi bi-clock-history text-white mb-2" style={{fontSize: '2rem'}}></i>
                <p className="text-white mb-0">Flexible Timings</p>
              </Col>
              <Col md={3} sm={6} className="mb-3">
                <i className="bi bi-heart-pulse text-white mb-2" style={{fontSize: '2rem'}}></i>
                <p className="text-white mb-0">Holistic Care</p>
              </Col>
            </Row>
          </div>
        </Container>
      </section>

      {/* Footer */}
      <footer className="site-footer">
        <Container>
          <Row className="py-5">
            <Col md={4} className="mb-4 mb-md-0">
              <h4 className="mb-3">🕉 AyurSutra</h4>
              <p className="text-muted">Your trusted partner in Ayurvedic wellness and holistic healing. Experience the ancient wisdom of Ayurveda with modern convenience.</p>
              <div className="social-links mt-3">
                <a href="#" className="me-3"><i className="bi bi-facebook"></i></a>
                <a href="#" className="me-3"><i className="bi bi-instagram"></i></a>
                <a href="#" className="me-3"><i className="bi bi-twitter"></i></a>
                <a href="#" className="me-3"><i className="bi bi-youtube"></i></a>
              </div>
            </Col>
            <Col md={2} className="mb-4 mb-md-0">
              <h5 className="mb-3">Quick Links</h5>
              <ul className="list-unstyled">
                <li><a href="#features" className="text-muted">Features</a></li>
                <li><a href="#therapies" className="text-muted">Therapies</a></li>
                <li><a href="#benefits" className="text-muted">Benefits</a></li>
                <li><a href="#testimonials" className="text-muted">Testimonials</a></li>
              </ul>
            </Col>
            <Col md={3} className="mb-4 mb-md-0">
              <h5 className="mb-3">Services</h5>
              <ul className="list-unstyled">
                <li><a href="#" className="text-muted">Panchakarma</a></li>
                <li><a href="#" className="text-muted">Dosha Analysis</a></li>
                <li><a href="#" className="text-muted">Consultation</a></li>
                <li><a href="#" className="text-muted">Wellness Plans</a></li>
              </ul>
            </Col>
            <Col md={3}>
              <h5 className="mb-3">Contact Us</h5>
              <ul className="list-unstyled text-muted">
                <li className="mb-2">
                  <i className="bi bi-geo-alt me-2"></i>
                  123 Wellness Street, Mumbai
                </li>
                <li className="mb-2">
                  <i className="bi bi-envelope me-2"></i>
                  info@ayursutra.com
                </li>
                <li className="mb-2">
                  <i className="bi bi-phone me-2"></i>
                  +91 98765 43210
                </li>
              </ul>
            </Col>
          </Row>
          <hr className="border-secondary" />
          <Row>
            <Col className="text-center py-3">
              <p className="mb-0 text-muted">&copy; 2024 AyurSutra. All rights reserved. | Privacy Policy | Terms of Service</p>
            </Col>
          </Row>
        </Container>
      </footer>
    </div>
  );
};

export default LandingPage;
