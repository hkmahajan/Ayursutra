import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, Button, Form, Toast } from 'react-bootstrap';
import { getSession, clearSession, getAppointments, getSessions } from '../utils/auth';
import './PatientDashboard.css';

const PatientDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('journey');
  const [appointments, setAppointments] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Feedback state
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  
  // Chat messages state
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      text: 'Hello! How are you feeling today?',
      sender: 'doctor',
      time: '10:30 AM'
    },
    {
      id: 2,
      text: "Hello Doctor! I'm feeling much better after yesterday's session.",
      sender: 'patient',
      time: '10:32 AM'
    },
    {
      id: 3,
      text: "That's great to hear! Make sure to follow the post-therapy instructions I gave you.",
      sender: 'doctor',
      time: '10:33 AM'
    },
    {
      id: 4,
      text: 'Also, remember to have a light dinner tonight and avoid cold drinks.',
      sender: 'doctor',
      time: '10:33 AM'
    },
    {
      id: 5,
      text: "Thank you Doctor! I'll follow all the instructions.",
      sender: 'patient',
      time: '10:35 AM'
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  
  // Sample initial appointments
  const initialAppointments = [
    {
      id: 1,
      date: '2025-11-04',
      time: '9:00 AM',
      type: 'Virechana Therapy',
      doctorName: 'Dr. Rajesh Kumar',
      doctorSpecialty: 'Panchakarma Specialist',
      status: 'Scheduled',
      location: 'Room A1',
      duration: '60 minutes',
      instructions: [
        'Light dinner yesterday evening',
        'Fast from 6 AM today',
        'Drink warm water when thirsty',
        'Wear comfortable, loose clothing'
      ]
    },
    {
      id: 2,
      date: '2025-11-08',
      time: '10:30 AM',
      type: 'Basti (Medicated Enema)',
      doctorName: 'Dr. Rajesh Kumar',
      doctorSpecialty: 'Panchakarma Specialist',
      status: 'Confirmed',
      location: 'Room B1',
      duration: '45 minutes',
      instructions: [
        'Light vegetarian diet the day before',
        'Avoid heavy foods after 6 PM',
        'Stay hydrated',
        'Empty bladder before therapy'
      ]
    }
  ];
  
  // Doctor detail modal
  const [showDoctorModal, setShowDoctorModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  
  // Filters
  const [distanceFilter, setDistanceFilter] = useState(10);
  const [specialtyFilters, setSpecialtyFilters] = useState({
    panchakarma: true,
    ayurveda: true,
    yoga: false,
    diet: false
  });
  const [availabilityFilters, setAvailabilityFilters] = useState({
    today: true,
    week: false
  });
  const [ratingFilter, setRatingFilter] = useState(4);
  
  // Toast notification
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  
  // Booking modal
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    date: '',
    time: '',
    type: 'Consultation',
    symptoms: ''
  });
  
  // Map and view controls
  const [viewMode, setViewMode] = useState('map'); // 'map' or 'list'
  const [showDoctorList, setShowDoctorList] = useState(true);
  const [showFilterPanel, setShowFilterPanel] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [userLocation, setUserLocation] = useState({ lat: 12.9716, lng: 77.5946 }); // Default Bangalore
  
  // Notifications
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'appointment',
      title: 'Upcoming Appointment',
      message: 'You have an appointment with Dr. Rajesh Sharma tomorrow at 10:00 AM',
      time: '2 hours ago',
      read: false
    },
    {
      id: 2,
      type: 'reminder',
      title: 'Medication Reminder',
      message: 'Time to take your evening herbal supplement',
      time: '5 hours ago',
      read: false
    },
    {
      id: 3,
      type: 'result',
      title: 'Test Results Available',
      message: 'Your recent blood test results are now available',
      time: '1 day ago',
      read: true
    }
  ]);

  // Mock doctors data with extended information
  const doctors = [
    {
      id: 'doc1',
      name: 'Dr. Rajesh Sharma',
      specialty: 'Panchakarma Specialist',
      experience: '15 years',
      rating: 4.8,
      reviews: 256,
      distance: 2.5,
      fees: '₹800',
      available: true,
      avatar: 'https://i.pravatar.cc/150?img=12',
      address: 'Ayur Wellness Center, MG Road, Bangalore',
      phone: '+91 98765 43210',
      email: 'dr.rajesh@ayurwellness.com',
      education: ['BAMS - Mumbai University', 'MD (Ayurveda) - Banaras Hindu University'],
      languages: ['English', 'Hindi', 'Kannada'],
      consultationFees: '₹800',
      nextAvailable: '2025-11-05 10:00 AM',
      about: 'Dr. Rajesh Sharma is a renowned Panchakarma specialist with over 15 years of experience. He specializes in detoxification therapies and chronic disease management through Ayurvedic principles.',
      specializations: ['Panchakarma', 'Chronic Disease Management', 'Detoxification'],
      timings: {
        Monday: '9:00 AM - 6:00 PM',
        Tuesday: '9:00 AM - 6:00 PM',
        Wednesday: '9:00 AM - 6:00 PM',
        Thursday: '9:00 AM - 6:00 PM',
        Friday: '9:00 AM - 6:00 PM',
        Saturday: '9:00 AM - 2:00 PM',
        Sunday: 'Closed'
      },
      services: ['Vamana', 'Virechana', 'Basti', 'Nasya', 'Raktamokshana']
    },
    {
      id: 'doc2',
      name: 'Dr. Priya Menon',
      specialty: 'Ayurvedic Physician',
      experience: '12 years',
      rating: 4.9,
      reviews: 312,
      distance: 3.2,
      fees: '₹1000',
      available: true,
      avatar: 'https://i.pravatar.cc/150?img=32',
      address: 'Natural Healing Clinic, Indiranagar, Bangalore',
      phone: '+91 98765 43211',
      email: 'dr.priya@naturalhealing.com',
      education: ['BAMS - Kerala Ayurveda University', 'PG Diploma in Ayurvedic Medicine'],
      languages: ['English', 'Malayalam', 'Tamil'],
      consultationFees: '₹1000',
      nextAvailable: '2025-11-05 11:30 AM',
      about: 'Dr. Priya Menon specializes in women\'s health and lifestyle disorders. She combines traditional Ayurvedic wisdom with modern diagnostic approaches.',
      specializations: ['Women\'s Health', 'PCOS/PCOD', 'Lifestyle Disorders', 'Skin Care'],
      timings: {
        Monday: '10:00 AM - 7:00 PM',
        Tuesday: '10:00 AM - 7:00 PM',
        Wednesday: '10:00 AM - 7:00 PM',
        Thursday: 'Closed',
        Friday: '10:00 AM - 7:00 PM',
        Saturday: '10:00 AM - 4:00 PM',
        Sunday: 'Closed'
      },
      services: ['General Consultation', 'Wellness Programs', 'Herbal Therapy']
    },
    {
      id: 'doc3',
      name: 'Dr. Arun Kumar',
      specialty: 'Vaidya & Herbalist',
      experience: '20 years',
      rating: 4.7,
      reviews: 189,
      distance: 4.1,
      fees: '₹900',
      available: false,
      avatar: 'https://i.pravatar.cc/150?img=51',
      address: 'Traditional Ayurveda Center, Koramangala, Bangalore',
      phone: '+91 98765 43212',
      email: 'dr.arun@traditional.com',
      education: ['BAMS - Rajiv Gandhi University', 'Certificate in Herbology'],
      languages: ['English', 'Hindi', 'Marathi'],
      consultationFees: '₹900',
      nextAvailable: '2025-11-06 9:00 AM',
      about: 'Dr. Arun Kumar is an expert in herbal medicine and traditional Ayurvedic practices. He has helped thousands of patients with his customized herbal formulations.',
      specializations: ['Herbal Medicine', 'Digestive Disorders', 'Joint Pain', 'Immunity'],
      timings: {
        Monday: '8:00 AM - 5:00 PM',
        Tuesday: '8:00 AM - 5:00 PM',
        Wednesday: '8:00 AM - 5:00 PM',
        Thursday: '8:00 AM - 5:00 PM',
        Friday: '8:00 AM - 5:00 PM',
        Saturday: 'Closed',
        Sunday: 'Closed'
      },
      services: ['Herbal Consultation', 'Custom Formulations', 'Diet Planning']
    },
    {
      id: 'doc4',
      name: 'Dr. Meera Nair',
      specialty: 'Yoga & Ayurveda Therapist',
      experience: '10 years',
      rating: 4.6,
      reviews: 145,
      distance: 5.8,
      fees: '₹700',
      available: true,
      avatar: 'https://i.pravatar.cc/150?img=45',
      address: 'Holistic Health Center, HSR Layout, Bangalore',
      phone: '+91 98765 43213',
      email: 'dr.meera@holistic.com',
      education: ['BAMS - Pune University', 'Yoga Teacher Training Certificate'],
      languages: ['English', 'Hindi'],
      consultationFees: '₹700',
      nextAvailable: '2025-11-05 2:00 PM',
      about: 'Dr. Meera Nair integrates Yoga therapy with Ayurvedic principles for holistic healing. She specializes in stress management and mental wellness.',
      specializations: ['Yoga Therapy', 'Stress Management', 'Mental Wellness', 'Meditation'],
      timings: {
        Monday: '7:00 AM - 12:00 PM, 4:00 PM - 8:00 PM',
        Tuesday: '7:00 AM - 12:00 PM, 4:00 PM - 8:00 PM',
        Wednesday: '7:00 AM - 12:00 PM, 4:00 PM - 8:00 PM',
        Thursday: '7:00 AM - 12:00 PM, 4:00 PM - 8:00 PM',
        Friday: '7:00 AM - 12:00 PM',
        Saturday: '7:00 AM - 1:00 PM',
        Sunday: 'Closed'
      },
      services: ['Yoga Sessions', 'Meditation', 'Pranayama', 'Stress Relief']
    }
  ];

  useEffect(() => {
    const session = getSession();
    if (!session || session.role !== 'patient') {
      navigate('/login');
      return;
    }
    setUser(session);
    const savedAppts = getAppointments().filter(a => a.patientId === session.id);
    // Merge with initial appointments if no saved appointments
    if (savedAppts.length === 0) {
      setAppointments(initialAppointments);
    } else {
      setAppointments(savedAppts);
    }
    setSessions(getSessions().filter(s => s.patientId === session.id));
  }, [navigate]);

  const handleLogout = () => {
    clearSession();
    navigate('/login');
  };

  // Send chat message
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const newMsg = {
        id: chatMessages.length + 1,
        text: newMessage,
        sender: 'patient',
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages([...chatMessages, newMsg]);
      setNewMessage('');
    }
  };

  // Get current location
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      showToastMessage('Getting your location...');
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          showToastMessage('Location updated successfully!');
        },
        (error) => {
          console.error('Error getting location:', error);
          showToastMessage('Could not get your location. Using default location.');
        }
      );
    } else {
      showToastMessage('Geolocation is not supported by your browser.');
    }
  };
  
  // Toggle doctor list panel
  const toggleDoctorList = () => {
    setShowDoctorList(!showDoctorList);
  };
  
  // Toggle filter panel
  const toggleFilterPanel = () => {
    setShowFilterPanel(!showFilterPanel);
  };
  
  // Mark notification as read
  const markNotificationAsRead = (id) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };
  
  // Clear all notifications
  const clearAllNotifications = () => {
    setNotifications([]);
    setShowNotifications(false);
  };

  // Show doctor details modal
  const handleViewDoctor = (doctor) => {
    setSelectedDoctor(doctor);
    setShowDoctorModal(true);
  };


  // Book appointment
  const handleBookAppointment = (doctor) => {
    setSelectedDoctor(doctor);
    setShowDoctorModal(false);
    setShowBookingModal(true);
  };

  // Submit booking
  const handleSubmitBooking = (e) => {
    e.preventDefault();
    // Add appointment logic here
    const newAppointment = {
      id: `apt${Date.now()}`,
      doctorName: selectedDoctor.name,
      doctorSpecialty: selectedDoctor.specialty,
      date: bookingForm.date,
      time: bookingForm.time,
      type: bookingForm.type,
      status: 'Scheduled',
      symptoms: bookingForm.symptoms
    };
    
    setAppointments([...appointments, newAppointment]);
    setShowBookingModal(false);
    setBookingForm({ date: '', time: '', type: 'Consultation', symptoms: '' });
    showToastMessage('Appointment booked successfully!');
  };

  // Get directions
  const handleGetDirections = (doctor) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(doctor.address)}`;
    window.open(url, '_blank');
  };

  // Cancel appointment
  const handleCancelAppointment = (appointmentId) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      setAppointments(appointments.filter(a => a.id !== appointmentId));
      showToastMessage('Appointment cancelled successfully');
    }
  };

  // Reschedule appointment
  const handleRescheduleAppointment = (appointmentId) => {
    showToastMessage('Rescheduling functionality coming soon!');
  };

  // Show toast
  const showToastMessage = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Generate star rating
  const generateStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={`full-${i}`} className="bi bi-star-fill text-warning"></i>);
    }
    if (hasHalfStar) {
      stars.push(<i key="half" className="bi bi-star-half text-warning"></i>);
    }
    const remaining = 5 - stars.length;
    for (let i = 0; i < remaining; i++) {
      stars.push(<i key={`empty-${i}`} className="bi bi-star text-warning"></i>);
    }
    return stars;
  };

  // Filter doctors based on all criteria
  const filteredDoctors = doctors.filter(doc => {
    // Search filter
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.specialty.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Distance filter
    const matchesDistance = doc.distance <= distanceFilter;
    
    // Specialty filter
    const matchesSpecialty = 
      (specialtyFilters.panchakarma && doc.specialty.toLowerCase().includes('panchakarma')) ||
      (specialtyFilters.ayurveda && doc.specialty.toLowerCase().includes('ayurvedic')) ||
      (specialtyFilters.yoga && doc.specialty.toLowerCase().includes('yoga')) ||
      (specialtyFilters.diet && doc.specialty.toLowerCase().includes('diet'));
    
    // Availability filter
    const matchesAvailability = 
      (availabilityFilters.today && doc.available) ||
      (availabilityFilters.week) ||
      (!availabilityFilters.today && !availabilityFilters.week);
    
    // Rating filter
    const matchesRating = doc.rating >= ratingFilter;
    
    return matchesSearch && matchesDistance && matchesSpecialty && matchesAvailability && matchesRating;
  });

  if (!user) return null;

  return (
    <div className="patient-dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="container-fluid">
          <div className="header-content">
            <div className="logo-section">
              <i className="bi bi-heart-pulse-fill"></i>
              <h3>AyurSutra</h3>
            </div>
            <div className="header-actions">
              <div className="notification-bell" onClick={() => setShowNotifications(!showNotifications)}>
                <i className="bi bi-bell"></i>
                {notifications.filter(n => !n.read).length > 0 && (
                  <span className="notification-badge">{notifications.filter(n => !n.read).length}</span>
                )}
                
                {/* Notification Dropdown */}
                {showNotifications && (
                  <div className="notification-dropdown">
                    <div className="notification-header">
                      <h6>Notifications</h6>
                      {notifications.length > 0 && (
                        <button 
                          className="btn btn-sm btn-link text-danger"
                          onClick={clearAllNotifications}
                        >
                          Clear All
                        </button>
                      )}
                    </div>
                    <div className="notification-list">
                      {notifications.length === 0 ? (
                        <div className="notification-empty">
                          <i className="bi bi-bell-slash"></i>
                          <p>No notifications</p>
                        </div>
                      ) : (
                        notifications.map(notif => (
                          <div 
                            key={notif.id} 
                            className={`notification-item ${notif.read ? 'read' : ''}`}
                            onClick={() => markNotificationAsRead(notif.id)}
                          >
                            <div className="notification-icon">
                              {notif.type === 'appointment' && <i className="bi bi-calendar-check text-primary"></i>}
                              {notif.type === 'reminder' && <i className="bi bi-clock text-warning"></i>}
                              {notif.type === 'result' && <i className="bi bi-file-medical text-success"></i>}
                            </div>
                            <div className="notification-content">
                              <div className="notification-title">{notif.title}</div>
                              <div className="notification-message">{notif.message}</div>
                              <div className="notification-time">{notif.time}</div>
                            </div>
                            {!notif.read && <div className="notification-dot"></div>}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
              <div className="user-profile">
                <span className="user-name">{user.name}</span>
                <button className="btn btn-sm btn-light ms-2" onClick={handleLogout}>
                  <i className="bi bi-box-arrow-right"></i> Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="main-container">
        {/* Sidebar */}
        <aside className="sidebar">
          <ul className="sidebar-menu">
            <li>
              <a
                href="#"
                className={activeTab === 'journey' ? 'active' : ''}
                onClick={(e) => { e.preventDefault(); setActiveTab('journey'); }}
              >
                <i className="bi bi-house-heart"></i> My Journey
              </a>
            </li>
            <li>
              <a
                href="#"
                className={activeTab === 'appointments' ? 'active' : ''}
                onClick={(e) => { e.preventDefault(); setActiveTab('appointments'); }}
              >
                <i className="bi bi-calendar-check"></i> Appointments
              </a>
            </li>
            <li>
              <a
                href="#"
                className={activeTab === 'progress' ? 'active' : ''}
                onClick={(e) => { e.preventDefault(); setActiveTab('progress'); }}
              >
                <i className="bi bi-graph-up-arrow"></i> My Progress
              </a>
            </li>
            <li>
              <a
                href="#"
                className={activeTab === 'health' ? 'active' : ''}
                onClick={(e) => { e.preventDefault(); setActiveTab('health'); }}
              >
                <i className="bi bi-heart-pulse"></i> Health Metrics
              </a>
            </li>
            <li>
              <a
                href="#"
                className={activeTab === 'prescriptions' ? 'active' : ''}
                onClick={(e) => { e.preventDefault(); setActiveTab('prescriptions'); }}
              >
                <i className="bi bi-capsule"></i> Prescriptions
              </a>
            </li>
            <li>
              <a
                href="#"
                className={activeTab === 'find-doctors' ? 'active' : ''}
                onClick={(e) => { e.preventDefault(); setActiveTab('find-doctors'); }}
              >
                <i className="bi bi-geo-alt"></i> Find Doctors
              </a>
            </li>
            <li>
              <a
                href="#"
                className={activeTab === 'learn' ? 'active' : ''}
                onClick={(e) => { e.preventDefault(); setActiveTab('learn'); }}
              >
                <i className="bi bi-book"></i> Learn
              </a>
            </li>
            <li>
              <a
                href="#"
                className={activeTab === 'feedback' ? 'active' : ''}
                onClick={(e) => { e.preventDefault(); setActiveTab('feedback'); }}
              >
                <i className="bi bi-star"></i> Feedback
              </a>
            </li>
            <li>
              <a
                href="#"
                className={activeTab === 'consult' ? 'active' : ''}
                onClick={(e) => { e.preventDefault(); setActiveTab('consult'); }}
              >
                <i className="bi bi-chat-dots"></i> Consult Doctor
              </a>
            </li>
          </ul>
        </aside>

        {/* Content Area */}
        <main className="content-area">
          {activeTab === 'find-doctors' && (
            <div className="find-doctors-section">
              <div className="page-header">
                <h2 className="page-title">Find Nearby Doctors</h2>
                <div className="d-flex align-items-center gap-3">
                  <p className="text-muted mb-0">Showing {filteredDoctors.length} doctors within {distanceFilter} km</p>
                  <div className="view-toggle btn-group" role="group">
                    <button
                      type="button"
                      className={`btn btn-sm ${viewMode === 'map' ? 'btn-primary' : 'btn-outline-primary'}`}
                      onClick={() => setViewMode('map')}
                    >
                      <i className="bi bi-map"></i> Map
                    </button>
                    <button
                      type="button"
                      className={`btn btn-sm ${viewMode === 'list' ? 'btn-primary' : 'btn-outline-primary'}`}
                      onClick={() => setViewMode('list')}
                    >
                      <i className="bi bi-list-ul"></i> List
                    </button>
                  </div>
                </div>
              </div>

              {/* Search and Filters Container */}
              <div className="search-filter-container mb-4">
                {/* Search Bar */}
                <div className="search-container mb-3">
                  <div className="search-input-wrapper">
                    <i className="bi bi-search search-icon"></i>
                    <input
                      type="text"
                      className="search-input"
                      placeholder="Search by name or specialty..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                {/* Advanced Filters */}
                <div className="filters-panel">
                  {/* Distance Filter */}
                  <div className="filter-group">
                    <label className="filter-label">
                      <i className="bi bi-geo-alt"></i> Distance: {distanceFilter} km
                    </label>
                    <input
                      type="range"
                      className="form-range"
                      min="1"
                      max="50"
                      value={distanceFilter}
                      onChange={(e) => setDistanceFilter(parseInt(e.target.value))}
                    />
                    <div className="d-flex justify-content-between text-muted small">
                      <span>1 km</span>
                      <span>50 km</span>
                    </div>
                  </div>

                  {/* Specialty Filter */}
                  <div className="filter-group">
                    <label className="filter-label">
                      <i className="bi bi-clipboard-pulse"></i> Specialization
                    </label>
                    <div className="filter-options">
                      <Form.Check
                        type="checkbox"
                        label="Panchakarma"
                        checked={specialtyFilters.panchakarma}
                        onChange={(e) => setSpecialtyFilters({...specialtyFilters, panchakarma: e.target.checked})}
                      />
                      <Form.Check
                        type="checkbox"
                        label="Ayurveda"
                        checked={specialtyFilters.ayurveda}
                        onChange={(e) => setSpecialtyFilters({...specialtyFilters, ayurveda: e.target.checked})}
                      />
                      <Form.Check
                        type="checkbox"
                        label="Yoga"
                        checked={specialtyFilters.yoga}
                        onChange={(e) => setSpecialtyFilters({...specialtyFilters, yoga: e.target.checked})}
                      />
                      <Form.Check
                        type="checkbox"
                        label="Diet & Nutrition"
                        checked={specialtyFilters.diet}
                        onChange={(e) => setSpecialtyFilters({...specialtyFilters, diet: e.target.checked})}
                      />
                    </div>
                  </div>

                  {/* Availability Filter */}
                  <div className="filter-group">
                    <label className="filter-label">
                      <i className="bi bi-calendar-check"></i> Availability
                    </label>
                    <div className="filter-options">
                      <Form.Check
                        type="checkbox"
                        label="Available Today"
                        checked={availabilityFilters.today}
                        onChange={(e) => setAvailabilityFilters({...availabilityFilters, today: e.target.checked})}
                      />
                      <Form.Check
                        type="checkbox"
                        label="Available This Week"
                        checked={availabilityFilters.week}
                        onChange={(e) => setAvailabilityFilters({...availabilityFilters, week: e.target.checked})}
                      />
                    </div>
                  </div>

                  {/* Rating Filter */}
                  <div className="filter-group">
                    <label className="filter-label">
                      <i className="bi bi-star-fill"></i> Minimum Rating
                    </label>
                    <Form.Select
                      value={ratingFilter}
                      onChange={(e) => setRatingFilter(parseFloat(e.target.value))}
                    >
                      <option value="3">3+ Stars</option>
                      <option value="4">4+ Stars</option>
                      <option value="4.5">4.5+ Stars</option>
                    </Form.Select>
                  </div>
                </div>
              </div>

              {/* Doctors List */}
              {viewMode === 'list' ? (
                <>
              {filteredDoctors.length === 0 ? (
                <div className="empty-state">
                  <i className="bi bi-search"></i>
                  <p>No doctors found matching your criteria</p>
                  <button 
                    className="btn btn-primary"
                    onClick={() => {
                      setSearchQuery('');
                      setDistanceFilter(10);
                      setSpecialtyFilters({ panchakarma: true, ayurveda: true, yoga: false, diet: false });
                    }}
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <div className="doctors-grid">
                  {filteredDoctors.map(doctor => (
                    <div key={doctor.id} className="doctor-card">
                      <div className="doctor-card-header">
                        <img src={doctor.avatar} alt={doctor.name} className="doctor-avatar" />
                        <div className="doctor-status">
                          {doctor.available ? (
                            <span className="badge bg-success">
                              <i className="bi bi-check-circle"></i> Available
                            </span>
                          ) : (
                            <span className="badge bg-secondary">
                              <i className="bi bi-x-circle"></i> Busy
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="doctor-card-body">
                        <h5 className="doctor-name">{doctor.name}</h5>
                        <p className="doctor-specialty">{doctor.specialty}</p>
                        <div className="doctor-rating mb-2">
                          {generateStars(doctor.rating)}
                          <span className="rating-text ms-2">{doctor.rating} ({doctor.reviews} reviews)</span>
                        </div>
                        <div className="doctor-details">
                          <span><i className="bi bi-briefcase"></i> {doctor.experience}</span>
                          <span><i className="bi bi-geo-alt"></i> {doctor.distance} km</span>
                          <span><i className="bi bi-currency-rupee"></i> {doctor.fees}</span>
                        </div>
                      </div>
                      <div className="doctor-card-footer">
                        <button 
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => handleViewDoctor(doctor)}
                        >
                          <i className="bi bi-eye"></i> View Profile
                        </button>
                        <button 
                          className="btn btn-sm btn-primary"
                          onClick={() => handleBookAppointment(doctor)}
                        >
                          <i className="bi bi-calendar-plus"></i> Book
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              </>
              ) : (
                /* Map View */
                <div className="map-view-container">
                  {/* Map Controls */}
                  <div className="map-controls">
                    <button 
                      className="btn btn-light location-btn" 
                      onClick={getCurrentLocation}
                      title="Get current location"
                    >
                      <i className="bi bi-geo-alt-fill text-danger"></i>
                    </button>
                  </div>
                  
                  {/* Map Placeholder */}
                  <div className="map-placeholder">
                    <div className="map-info">
                      <i className="bi bi-map text-primary" style={{fontSize: '4rem'}}></i>
                      <h4>Interactive Map View</h4>
                      <p className="text-muted">
                        Showing {filteredDoctors.length} doctors near your location
                      </p>
                      <p className="small text-muted">
                        <i className="bi bi-info-circle"></i> Google Maps integration requires API key
                      </p>
                    </div>
                    
                    {/* Doctor markers representation */}
                    <div className="map-markers-list">
                      {filteredDoctors.slice(0, 5).map((doctor, index) => (
                        <div key={doctor.id} className="map-marker-item" onClick={() => handleViewDoctor(doctor)}>
                          <div className="marker-pin">
                            <i className="bi bi-geo-alt-fill text-danger"></i>
                            <span className="marker-label">{index + 1}</span>
                          </div>
                          <div className="marker-info">
                            <strong>{doctor.name}</strong>
                            <small className="text-muted d-block">{doctor.distance} km away</small>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Doctor List Overlay */}
                  <div className={`doctor-list-overlay ${showDoctorList ? 'show' : ''}`}>
                    <div className="doctor-list-header">
                      <h5>Nearby Doctors ({filteredDoctors.length})</h5>
                      <button className="btn btn-sm btn-link" onClick={toggleDoctorList}>
                        <i className={`bi bi-chevron-${showDoctorList ? 'down' : 'up'}`}></i>
                      </button>
                    </div>
                    {showDoctorList && (
                      <div className="doctor-list-content">
                        {filteredDoctors.map((doctor, index) => (
                          <div key={doctor.id} className="doctor-list-card" onClick={() => handleViewDoctor(doctor)}>
                            <div className="doctor-list-number">{index + 1}</div>
                            <img src={doctor.avatar} alt={doctor.name} className="doctor-list-avatar" />
                            <div className="doctor-list-info">
                              <h6>{doctor.name}</h6>
                              <p className="text-muted mb-1">{doctor.specialty}</p>
                              <div className="d-flex align-items-center gap-2">
                                <span className="badge bg-warning text-dark">
                                  <i className="bi bi-star-fill"></i> {doctor.rating}
                                </span>
                                <span className="text-muted small">{doctor.distance} km</span>
                              </div>
                            </div>
                            <div className="doctor-list-actions">
                              <button 
                                className="btn btn-sm btn-success"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleBookAppointment(doctor);
                                }}
                              >
                                Book
                              </button>
                              <button 
                                className="btn btn-sm btn-outline-primary"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleGetDirections(doctor);
                                }}
                              >
                                <i className="bi bi-compass"></i>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'appointments' && (
            <div className="appointments-section">
              <div className="page-header">
                <h2 className="page-title">My Appointments</h2>
                <button className="btn btn-primary" onClick={() => setActiveTab('find-doctors')}>
                  <i className="bi bi-plus-lg"></i> New Appointment
                </button>
              </div>

              <div className="appointments-list">
                {appointments.length > 0 ? (
                  appointments.map(apt => (
                    <div key={apt.id} className="appointment-card">
                      <div className="appointment-date">
                        <div className="date-box">
                          <span className="date-day">{new Date(apt.date).getDate()}</span>
                          <span className="date-month">
                            {new Date(apt.date).toLocaleDateString('en', { month: 'short' })}
                          </span>
                        </div>
                      </div>
                      <div className="appointment-info">
                        <h5>{apt.doctorName || apt.type}</h5>
                        <p className="text-muted">{apt.doctorSpecialty || 'General Consultation'}</p>
                        <p><i className="bi bi-clock"></i> {apt.time}</p>
                        <p><i className="bi bi-calendar3"></i> {apt.date}</p>
                      </div>
                      <div className="appointment-status">
                        <span className={`badge ${
                          apt.status === 'Scheduled' ? 'bg-warning' : 
                          apt.status === 'Completed' ? 'bg-success' : 
                          apt.status === 'Confirmed' ? 'bg-info' : 'bg-secondary'
                        }`}>
                          {apt.status}
                        </span>
                      </div>
                      <div className="appointment-actions">
                        <button 
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => handleRescheduleAppointment(apt.id)}
                        >
                          <i className="bi bi-arrow-repeat"></i> Reschedule
                        </button>
                        <button 
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleCancelAppointment(apt.id)}
                        >
                          <i className="bi bi-x-lg"></i> Cancel
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="empty-state">
                    <i className="bi bi-calendar-x"></i>
                    <h4>No Appointments</h4>
                    <p>You don't have any appointments scheduled yet</p>
                    <button 
                      className="btn btn-primary"
                      onClick={() => setActiveTab('find-doctors')}
                    >
                      <i className="bi bi-calendar-plus"></i> Book Your First Appointment
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'sessions' && (
            <div className="sessions-section">
              <div className="page-header">
                <h2 className="page-title">Therapy Sessions</h2>
              </div>

              <div className="sessions-list">
                {sessions.length > 0 ? (
                  sessions.map(session => (
                    <div key={session.id} className="session-card">
                      <div className="session-header">
                        <h5>{session.therapy}</h5>
                        <span className="session-date">{session.date}</span>
                      </div>
                      <p className="session-notes">{session.notes}</p>
                      <div className="session-progress">
                        <div className="progress-header">
                          <span>Progress</span>
                          <span>{session.progress}%</span>
                        </div>
                        <div className="progress">
                          <div
                            className="progress-bar bg-success"
                            role="progressbar"
                            style={{ width: `${session.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="empty-state">
                    <i className="bi bi-heart-pulse"></i>
                    <h4>No Therapy Sessions</h4>
                    <p>You don't have any therapy sessions scheduled</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'health' && (
            <div className="health-section">
              <div className="page-header">
                <h2 className="page-title">Health Metrics</h2>
              </div>
              
              <div className="row">
                <div className="col-lg-3 col-md-6 mb-3">
                  <div className="metric-card">
                    <div className="metric-icon energy">
                      <i className="bi bi-battery-charging"></i>
                    </div>
                    <div className="metric-value">7.5/10</div>
                    <div className="metric-label">Energy Level</div>
                    <div className="metric-trend up">
                      <i className="bi bi-arrow-up"></i> Improved
                    </div>
                  </div>
                </div>
                <div className="col-lg-3 col-md-6 mb-3">
                  <div className="metric-card">
                    <div className="metric-icon sleep">
                      <i className="bi bi-moon-stars"></i>
                    </div>
                    <div className="metric-value">8 hrs</div>
                    <div className="metric-label">Sleep Quality</div>
                    <div className="metric-trend up">
                      <i className="bi bi-arrow-up"></i> Better
                    </div>
                  </div>
                </div>
                <div className="col-lg-3 col-md-6 mb-3">
                  <div className="metric-card">
                    <div className="metric-icon stress">
                      <i className="bi bi-emoji-smile"></i>
                    </div>
                    <div className="metric-value">Low</div>
                    <div className="metric-label">Stress Level</div>
                    <div className="metric-trend down">
                      <i className="bi bi-arrow-down"></i> Reduced
                    </div>
                  </div>
                </div>
                <div className="col-lg-3 col-md-6 mb-3">
                  <div className="metric-card">
                    <div className="metric-icon digestion">
                      <i className="bi bi-circle"></i>
                    </div>
                    <div className="metric-value">Good</div>
                    <div className="metric-label">Digestion</div>
                    <div className="metric-trend up">
                      <i className="bi bi-arrow-up"></i> Improved
                    </div>
                  </div>
                </div>
              </div>

              <div className="health-log-card mt-4">
                <h4>Daily Health Log</h4>
                <Form className="mt-3">
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <Form.Label>How are you feeling today?</Form.Label>
                      <Form.Select>
                        <option>Excellent</option>
                        <option>Good</option>
                        <option selected>Fair</option>
                        <option>Poor</option>
                      </Form.Select>
                    </div>
                    <div className="col-md-6 mb-3">
                      <Form.Label>Energy Level (1-10)</Form.Label>
                      <Form.Range min="1" max="10" defaultValue="7" />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <Form.Label>Sleep Hours</Form.Label>
                      <Form.Control type="number" defaultValue="8" />
                    </div>
                    <div className="col-md-6 mb-3">
                      <Form.Label>Stress Level</Form.Label>
                      <Form.Select>
                        <option>Very Low</option>
                        <option selected>Low</option>
                        <option>Moderate</option>
                        <option>High</option>
                      </Form.Select>
                    </div>
                  </div>
                  <Form.Group className="mb-3">
                    <Form.Label>Notes</Form.Label>
                    <Form.Control as="textarea" rows={3} placeholder="Any symptoms or observations..." />
                  </Form.Group>
                  <Button variant="primary" type="submit">Log Today's Health</Button>
                </Form>
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="profile-section">
              <div className="page-header">
                <h2 className="page-title">My Profile</h2>
                <button className="btn btn-primary">
                  <i className="bi bi-pencil"></i> Edit Profile
                </button>
              </div>

              <div className="profile-card">
                <div className="profile-header">
                  <img src="https://i.pravatar.cc/150?img=8" alt="Profile" className="profile-avatar" />
                  <div className="profile-info">
                    <h3>{user.name}</h3>
                    <p className="text-muted">{user.email}</p>
                  </div>
                </div>
                <div className="profile-details">
                  <div className="detail-row">
                    <span className="detail-label">Phone:</span>
                    <span className="detail-value">+91 98765 43210</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Age:</span>
                    <span className="detail-value">35 years</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Gender:</span>
                    <span className="detail-value">Male</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Blood Group:</span>
                    <span className="detail-value">O+</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Address:</span>
                    <span className="detail-value">123, MG Road, Bangalore</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'journey' && (
            <div className="journey-section">
              {/* Welcome Card */}
              <div className="welcome-card">
                <div className="welcome-content">
                  <h1 className="welcome-title">Welcome back, {user.name}! 🌿</h1>
                  <p className="welcome-subtitle">Your healing journey is progressing beautifully. Keep up the great work!</p>
                  <div className="day-counter">
                    <i className="bi bi-calendar-heart"></i>
                    Day 8 of 21 days Detoxification Program
                  </div>
                </div>
              </div>

              {/* Progress Cards */}
              <div className="row mb-4">
                <div className="col-lg-4 col-md-6 mb-3">
                  <div className="progress-card wellness">
                    <div className="progress-icon">
                      <i className="bi bi-heart-pulse-fill"></i>
                    </div>
                    <div className="progress-title">Overall Wellness</div>
                    <div className="progress-value">72%</div>
                    <div className="progress-bar-custom">
                      <div className="progress-fill" style={{width: '72%'}}></div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 col-md-6 mb-3">
                  <div className="progress-card healing">
                    <div className="progress-icon">
                      <i className="bi bi-lightning-charge-fill"></i>
                    </div>
                    <div className="progress-title">Energy Levels</div>
                    <div className="progress-value">65%</div>
                    <div className="progress-bar-custom">
                      <div className="progress-fill" style={{width: '65%'}}></div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 col-md-6 mb-3">
                  <div className="progress-card nature">
                    <div className="progress-icon">
                      <i className="bi bi-shield-check"></i>
                    </div>
                    <div className="progress-title">Detoxification</div>
                    <div className="progress-value">45%</div>
                    <div className="progress-bar-custom">
                      <div className="progress-fill" style={{width: '45%'}}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Next Appointment & Treatment Journey */}
              <div className="row">
                {appointments.length > 0 && (
                  <div className="col-lg-6 mb-4">
                    <div className="appointment-card">
                      <div className="appointment-header">
                        <div className="appointment-date">
                          <i className="bi bi-calendar-event"></i>
                          {appointments[0].date === '2025-11-04' ? 'Today' : appointments[0].date}, {appointments[0].time}
                        </div>
                        <span className={`appointment-status ${appointments[0].status === 'Scheduled' ? 'status-today' : 'status-upcoming'}`}>
                          {appointments[0].status === 'Scheduled' ? 'Today' : 'Upcoming'}
                        </span>
                      </div>
                      <div className="appointment-therapy">{appointments[0].type}</div>
                      <div className="appointment-details">
                        <span><i className="bi bi-geo-alt"></i> {appointments[0].location}</span>
                        <span><i className="bi bi-clock"></i> {appointments[0].duration}</span>
                        <span><i className="bi bi-person"></i> {appointments[0].doctorName}</span>
                      </div>
                      {appointments[0].instructions && (
                        <div className="preparation-list">
                          <div className="preparation-title">
                            <i className="bi bi-info-circle"></i>
                            Pre-therapy Instructions
                          </div>
                          <ul>
                            {appointments[0].instructions.map((instruction, idx) => (
                              <li key={idx}>{instruction}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                <div className={appointments.length > 0 ? 'col-lg-6 mb-4' : 'col-lg-12 mb-4'}>
                  <div className="journey-card">
                    <div className="journey-header">
                      <h3 className="journey-title">Treatment Journey</h3>
                      <div className="journey-progress">
                        <span style={{fontWeight: 600}}>38%</span>
                      </div>
                    </div>
                    <div className="journey-steps">
                      <div className="journey-step">
                        <div className="step-icon completed">
                          <i className="bi bi-check"></i>
                        </div>
                        <div className="step-label completed">Consultation</div>
                      </div>
                      <div className="journey-step">
                        <div className="step-icon completed">
                          <i className="bi bi-check"></i>
                        </div>
                        <div className="step-label completed">Preparation</div>
                      </div>
                      <div className="journey-step">
                        <div className="step-icon active">
                          <i className="bi bi-droplet"></i>
                        </div>
                        <div className="step-label active">Purification</div>
                      </div>
                      <div className="journey-step">
                        <div className="step-icon">
                          <i className="bi bi-sun"></i>
                        </div>
                        <div className="step-label">Rejuvenation</div>
                      </div>
                    </div>
                    <div className="text-center mt-3">
                      <small className="text-muted">Next: Rejuvenation phase starts on Day 15</small>
                    </div>
                  </div>
                </div>
              </div>

              {/* Health Metrics */}
              <div className="row mb-4">
                <div className="col-lg-3 col-md-6 mb-3">
                  <div className="metric-card">
                    <div className="metric-icon energy">
                      <i className="bi bi-battery-charging"></i>
                    </div>
                    <div className="metric-value">7.5/10</div>
                    <div className="metric-label">Energy Level</div>
                    <div className="metric-trend up">
                      <i className="bi bi-arrow-up"></i> Improved
                    </div>
                  </div>
                </div>
                <div className="col-lg-3 col-md-6 mb-3">
                  <div className="metric-card">
                    <div className="metric-icon sleep">
                      <i className="bi bi-moon-stars"></i>
                    </div>
                    <div className="metric-value">8 hrs</div>
                    <div className="metric-label">Sleep Quality</div>
                    <div className="metric-trend up">
                      <i className="bi bi-arrow-up"></i> Better
                    </div>
                  </div>
                </div>
                <div className="col-lg-3 col-md-6 mb-3">
                  <div className="metric-card">
                    <div className="metric-icon stress">
                      <i className="bi bi-emoji-smile"></i>
                    </div>
                    <div className="metric-value">Low</div>
                    <div className="metric-label">Stress Level</div>
                    <div className="metric-trend down">
                      <i className="bi bi-arrow-down"></i> Reduced
                    </div>
                  </div>
                </div>
                <div className="col-lg-3 col-md-6 mb-3">
                  <div className="metric-card">
                    <div className="metric-icon digestion">
                      <i className="bi bi-circle"></i>
                    </div>
                    <div className="metric-value">Good</div>
                    <div className="metric-label">Digestion</div>
                    <div className="metric-trend up">
                      <i className="bi bi-arrow-up"></i> Improved
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'progress' && (
            <div className="progress-section">
              <div className="page-header">
                <h2 className="page-title">My Progress</h2>
              </div>
              
              <div className="journey-card mb-4">
                <div className="journey-header">
                  <h3 className="journey-title">Treatment Journey</h3>
                  <div className="journey-progress">
                    <span style={{fontWeight: 600}}>38% Complete</span>
                  </div>
                </div>
                <div className="journey-steps">
                  <div className="journey-step">
                    <div className="step-icon completed">
                      <i className="bi bi-check"></i>
                    </div>
                    <div className="step-label completed">Consultation</div>
                  </div>
                  <div className="journey-step">
                    <div className="step-icon completed">
                      <i className="bi bi-check"></i>
                    </div>
                    <div className="step-label completed">Preparation</div>
                  </div>
                  <div className="journey-step">
                    <div className="step-icon active">
                      <i className="bi bi-droplet"></i>
                    </div>
                    <div className="step-label active">Purification</div>
                  </div>
                  <div className="journey-step">
                    <div className="step-icon">
                      <i className="bi bi-sun"></i>
                    </div>
                    <div className="step-label">Rejuvenation</div>
                  </div>
                </div>
              </div>

              <div className="row mt-4">
                <div className="col-md-6">
                  <div className="progress-tracking-card">
                    <h4>Detoxification Progress</h4>
                    <div className="mt-3">
                      <div className="d-flex justify-content-between mb-2">
                        <span>Toxin Elimination</span>
                        <span>45%</span>
                      </div>
                      <div className="progress" style={{height: '10px'}}>
                        <div className="progress-bar bg-success" style={{width: '45%'}}></div>
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="d-flex justify-content-between mb-2">
                        <span>Organ Cleansing</span>
                        <span>30%</span>
                      </div>
                      <div className="progress" style={{height: '10px'}}>
                        <div className="progress-bar bg-info" style={{width: '30%'}}></div>
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="d-flex justify-content-between mb-2">
                        <span>Metabolic Balance</span>
                        <span>60%</span>
                      </div>
                      <div className="progress" style={{height: '10px'}}>
                        <div className="progress-bar bg-warning" style={{width: '60%'}}></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="progress-tracking-card">
                    <h4>Wellness Score</h4>
                    <div className="circular-progress-large">
                      <div className="score-display-large">
                        <h2>85%</h2>
                        <p>Excellent</p>
                      </div>
                    </div>
                    <div className="text-center mt-3">
                      <p className="text-muted">Your wellness score has improved by 12% this month</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'prescriptions' && (
            <div className="prescriptions-section">
              <div className="page-header">
                <h2 className="page-title">My Prescriptions</h2>
              </div>
              
              <div className="prescription-card mb-4">
                <div className="prescription-header">
                  <div className="prescription-title">
                    <i className="bi bi-capsule"></i>
                    Current Medications
                  </div>
                  <small>Valid until: Nov 30, 2025</small>
                </div>
                <ul className="medicine-list">
                  <li className="medicine-item">
                    <div>
                      <div className="medicine-name">Triphala Churna</div>
                      <div className="medicine-dosage">1 tsp with warm water, bedtime</div>
                    </div>
                    <span className="badge bg-success">Active</span>
                  </li>
                  <li className="medicine-item">
                    <div>
                      <div className="medicine-name">Ashwagandha Tablets</div>
                      <div className="medicine-dosage">2 tablets after meals, twice daily</div>
                    </div>
                    <span className="badge bg-success">Active</span>
                  </li>
                  <li className="medicine-item">
                    <div>
                      <div className="medicine-name">Guduchi Kashayam</div>
                      <div className="medicine-dosage">15ml with equal water, before meals</div>
                    </div>
                    <span className="badge bg-success">Active</span>
                  </li>
                </ul>
              </div>

              <div className="prescription-card">
                <div className="prescription-header">
                  <div className="prescription-title">
                    <i className="bi bi-droplet"></i>
                    Therapeutic Oils
                  </div>
                  <small>For external use only</small>
                </div>
                <ul className="medicine-list">
                  <li className="medicine-item">
                    <div>
                      <div className="medicine-name">Dhanwantharam Tailam</div>
                      <div className="medicine-dosage">For Abhyanga massage, as directed</div>
                    </div>
                    <span className="badge bg-info">Therapy Use</span>
                  </li>
                  <li className="medicine-item">
                    <div>
                      <div className="medicine-name">Ksheerabala Tailam</div>
                      <div className="medicine-dosage">For Nasya therapy, as directed</div>
                    </div>
                    <span className="badge bg-info">Therapy Use</span>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'learn' && (
            <div className="learn-section">
              <div className="page-header mb-4">
                <h2 className="page-title">Five Basic Shodanas of Panchakarma: Cleansing Methods</h2>
                <p className="text-muted">It's important to understand that "pancha karma" actually means "five actions or five treatments." There are five primary treatments included in Panchakarma which we elaborate on below.</p>
              </div>

              {/* Therapy Navigation Tabs */}
              <div className="therapy-nav-tabs mb-4">
                <button className="therapy-tab-btn active">Vamana</button>
                <button className="therapy-tab-btn">Virechan</button>
                <button className="therapy-tab-btn">Basti</button>
                <button className="therapy-tab-btn">Nasya</button>
                <button className="therapy-tab-btn">Rakta Moksha</button>
              </div>

              {/* Vamana Section */}
              <div className="therapy-section-card mb-5">
                <div className="therapy-nav-header mb-4">
                  <button className="therapy-nav-btn">Vamana</button>
                  <button className="therapy-nav-btn">Virechan</button>
                  <button className="therapy-nav-btn">Basti</button>
                  <button className="therapy-nav-btn">Nasya</button>
                  <button className="therapy-nav-btn">Rakta Moksha</button>
                </div>

                <h3 className="therapy-main-title">Vamana: Emesis Therapy</h3>
                
                <div className="therapy-content">
                  <p>When there is congestion in the lungs causing repeated attacks of bronchitis, colds, cough, or asthma, the Ayurvedic treatment is therapeutic vomiting, vamana, to eliminate the kapha causing the excess mucus.</p>
                  
                  <p>Oftentimes this also releases repressed emotions that have been held in the kapha areas of the lungs and stomach along with the accumulated dosha. Once the mucus is released, the patient will feel instantly relieved. It is likely that congestion, wheezing, and breathlessness will disappear and that the sinuses will become clear.</p>
                  
                  <p>Therapeutic vomiting is also indicated in chronic asthma, diabetes, chronic cold, lymphatic congestion, chronic indigestion, and edema. After vamana, resting, fasting, smoking certain herbal cigarettes, and not suppressing natural urges (i.e., urination, defecation, gas, sneezing, coughing) is recommended.</p>
                  
                  <p>If vamana is administered properly, the person should feel relaxation in the lungs, will be able to breathe freely, will have lightness in the chest, clear thinking, a clear voice, and a good appetite, and all symptoms of congestion disappear.</p>
                  
                  <div className="therapy-image-container text-center mt-4">
                    <img src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=300&fit=crop" alt="Vamana Therapy" className="therapy-image" />
                  </div>
                </div>
              </div>

              {/* Virechan Section */}
              <div className="therapy-section-card mb-5">
                <div className="therapy-nav-header mb-4">
                  <button className="therapy-nav-btn">Vamana</button>
                  <button className="therapy-nav-btn active">Virechan</button>
                  <button className="therapy-nav-btn">Basti</button>
                  <button className="therapy-nav-btn">Nasya</button>
                  <button className="therapy-nav-btn">Rakta Moksha</button>
                </div>

                <h3 className="therapy-main-title">Virechan: Purgation Therapy</h3>
                
                <div className="therapy-content">
                  <p>When excess bile, pitta, is secreted and accumulated in the gallbladder, liver, and small intestine, it tends to result in rashes, skin inflammation, acne, chronic attacks of fever, biliary vomiting, nausea, and jaundice. Ayurvedic literature suggests in these conditions the administration of therapeutic purgation or a therapeutic laxative.</p>
                  
                  <p>Purgatives help relieve the excess pitta causing the bile disturbance in the body. In fact, purgatives can completely cure the problem of excess pitta. When purgatives are used, the patient should not eat foods that will aggravate the predominant humor or cause the three humors to become unbalanced.</p>
                  
                  <p className="mb-3"><strong>Read More</strong></p>
                  
                  <div className="therapy-image-container text-center mt-4">
                    <img src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop" alt="Virechan - Pitta" className="therapy-image" />
                    <p className="image-label mt-2">PITTA</p>
                  </div>
                </div>
              </div>

              {/* Basti Section */}
              <div className="therapy-section-card mb-5">
                <div className="therapy-nav-header mb-4">
                  <button className="therapy-nav-btn">Vamana</button>
                  <button className="therapy-nav-btn">Virechan</button>
                  <button className="therapy-nav-btn active">Basti</button>
                  <button className="therapy-nav-btn">Nasya</button>
                  <button className="therapy-nav-btn">Rakta Moksha</button>
                </div>

                <h3 className="therapy-main-title">Basti: Enema Therapy</h3>
                
                <div className="therapy-content">
                  <p>Vata is a very active principle in pathogenesis (disease). If we can control vata through the use of basti, we have gone a long way to going to the root cause of the vast majority of diseases. Vata is the main etiological (causal) factor in the manifestation of diseases. It is the motive force behind the elimination and retention of feces, urine, bile and other excreta.</p>
                  
                  <p>Vata is mainly located in the large intestine, but bone tissue (asthi dhatu) is also a site for vata. Hence the medication administered rectally affects asthi dhatu. The mucus membrane of the colon is related to the outer covering of the bones (periosteum), which nourishes the bones. Therefore, any medication given rectally goes into the deeper tissues, like bones, and corrects vata disorders.</p>
                  
                  <p className="mb-3"><strong>Read More</strong></p>
                  
                  <div className="therapy-image-container text-center mt-4">
                    <img src="https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=400&h=300&fit=crop" alt="Basti - Vata" className="therapy-image" />
                    <p className="image-label mt-2">VATA</p>
                  </div>
                </div>
              </div>

              {/* Nasya Section */}
              <div className="therapy-section-card mb-5">
                <div className="therapy-nav-header mb-4">
                  <button className="therapy-nav-btn">Vamana</button>
                  <button className="therapy-nav-btn">Virechan</button>
                  <button className="therapy-nav-btn">Basti</button>
                  <button className="therapy-nav-btn active">Nasya</button>
                  <button className="therapy-nav-btn">Rakta Moksha</button>
                </div>

                <h3 className="therapy-main-title">Nasya: Nasal Administration</h3>
                
                <div className="therapy-content">
                  <p>The nose is the doorway to the brain and it is also the doorway to consciousness. The nasal administration of medication is called nasya.</p>
                  
                  <p>An excess of bodily humors accumulated in the sinus, throat, nose, or head areas is eliminated by means of the nearest possible opening, the nose. Prana, the force nerve energy, enters the body through the breath taken in through the nose. Prana is in the brain and maintains sensory and motor functions.</p>
                  
                  <p>Prana also governs mental activities, memory, concentration, and intellectual activities. Deranged prana creates defective functioning of all these activities and produces headaches, convulsions, loss of memory, and reduced sensory perception.</p>
                  
                  <p>This nasal administration, nasya, is indicated for prana disorders, sinus congestion, migraine headaches, convulsions, and certain eye and ear problems. Breathing also can be improved through nasal massage.</p>
                  
                  <p>For this treatment, the little finger is dipped into ghee and inserted into the nose. The inner walls of the nose are slowly massaged, going as deeply as possible. This treatment will help to open the emotions. (Nose tissue is tender and for this application, the fingernail must be kept short to avoid injuring the delicate mucus membranes.)</p>
                  
                  <p>Since most people have a deviated nasal septum, one side of the nose will be easier to penetrate and massage than the other. The finger should be inserted forcibly.</p>
                  
                  <p>The massage should proceed by slow penetration, the finger moving first in a clockwise and then counter-clockwise direction. By this means, the emotions that are blocked in the respiratory tract will be released. One may use this treatment each morning and evening. In this way, breathing patterns will change as the emotions are released and the eyesight also will improve.</p>
                  
                  <div className="therapy-image-container text-center mt-4">
                    <img src="https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=400&h=300&fit=crop" alt="Nasya" className="therapy-image" />
                    <p className="image-label mt-2">Nasya</p>
                  </div>
                </div>
              </div>

              {/* Rakta Moksha Section */}
              <div className="therapy-section-card mb-5">
                <div className="therapy-nav-header mb-4">
                  <button className="therapy-nav-btn">Vamana</button>
                  <button className="therapy-nav-btn">Virechan</button>
                  <button className="therapy-nav-btn">Basti</button>
                  <button className="therapy-nav-btn">Nasya</button>
                  <button className="therapy-nav-btn active">Rakta Moksha</button>
                </div>

                <h3 className="therapy-main-title">Rakta Moksha: Traditional Ayurvedic Method for Purification and Cleansing of the Blood</h3>
                
                <div className="alert alert-warning mb-4">
                  <strong>Note:</strong> This treatment is NOT a part of treatments at The Ayurvedic Institute.
                </div>
                
                <div className="therapy-content">
                  <p>Toxins present in the gastrointestinal tract are absorbed into the blood and circulated throughout the body. This condition is called toxemia, which is the basic cause of repeated infections, hypertension, and certain other circulatory conditions.</p>
                  
                  <p>This includes repeated attacks of skin disorders such as urticaria, rashes, herpes, eczema, acne, scabies, leukoderma, chronic itching, or hives. In such conditions, along with internal medication, the elimination of the toxins and purification of the blood is necessary. Rakta moksha is also indicated for cases of enlarged liver, spleen, and gout. Pitta is produced from the disintegrated red blood cells in the liver.</p>
                  
                  <p>So pitta and blood have a very close relationship. An increase in pitta may go into the blood causing toxicity, and thus many pitta-genic disorders. Extracting a small amount of blood from a vein relieves the tension created by the pitta-genic toxins in the blood.</p>
                  
                  <p>Leeches have been used as an alternative to bloodletting. Bloodletting also stimulates the spleen to produce anti-toxic substances that help to stimulate the immune system.</p>
                  
                  <p>Toxins are neutralized, enabling radical cures in many blood-borne disorders. Certain substances such as sugar, salt, yogurt, sour-tasting foods, and alcohol are toxic to the blood. In certain blood disorders, these substances should be avoided to keep the blood pure.</p>
                  
                  <p>For rakta moksha treatment other than bloodletting, there are blood-purifying practices involving herbs, gem therapy, or color water therapy. For any rakta moksha treatment or related alternative treatment, it is beneficial to refrain from yogurt, salt, sugar, alcohol, marijuana, sour, and fermented foods.</p>
                </div>
              </div>

              {/* Purvakarma Section */}
              <div className="therapy-section-card mb-5">
                <h3 className="therapy-main-title">Purvakarma: Pre-purification Measures</h3>
                
                <div className="therapy-content">
                  <p className="mb-4">Before the actual purification begins, there is a need to prepare the body with prescribed methods to encourage it to let go of the toxins. These two procedures are snehan and svedana.</p>
                  
                  <div className="row">
                    <div className="col-md-6 mb-4">
                      <div className="pre-therapy-card">
                        <img src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=250&fit=crop" alt="Snehan Oil Massage" className="img-fluid rounded mb-3" />
                        <h5 className="text-success">Snehan</h5>
                        <p>Snehan is an oil massage. Oil is applied to the entire body with a particular type of massage that helps the toxins to move toward the gastrointestinal tract.</p>
                        <p>Oil massage also makes the superficial and deep tissues soft and supple, thus helping to remove stress and nourish the nervous system. Snehan is given daily for three to seven days, as indicated.</p>
                      </div>
                    </div>
                    
                    <div className="col-md-6 mb-4">
                      <div className="pre-therapy-card">
                        <img src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400&h=250&fit=crop" alt="Svedana Steam Therapy" className="img-fluid rounded mb-3" />
                        <h5 className="text-success">Svedana</h5>
                        <p>Svedana is sudation or sweating and is given every day immediately following the snehan. An herbal concoction may be added to the steam to further loosen the toxins from the individual. Svedana liquefies the toxins and increases the movement of toxins into the gastrointestinal tract.</p>
                        <p>After three to seven days of snehan and svedana, the doshas become well "ripened." A particular panchakarma method is then given according to the individual's constitution and disorder, prakriti and vikruti, respectively.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Doshas Section */}
              <div className="therapy-section-card mb-5">
                <h3 className="therapy-main-title text-center mb-4">Understanding the Three Doshas</h3>
                
                <div className="dosha-tabs-header mb-4">
                  <button className="dosha-tab-btn">Vata</button>
                  <button className="dosha-tab-btn">Pitta</button>
                  <button className="dosha-tab-btn">Kapha</button>
                </div>
                
                <div className="row">
                  {/* Vata Card */}
                  <div className="col-md-4 mb-4">
                    <div className="dosha-detail-card vata-border">
                      <div className="dosha-tabs-small mb-3">
                        <button className="dosha-small-btn active">Vata</button>
                        <button className="dosha-small-btn">Pitta</button>
                        <button className="dosha-small-btn">Kapha</button>
                      </div>
                      
                      <div className="text-center mb-4">
                        <img src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=300&h=200&fit=crop" alt="Vata Dosha" className="img-fluid rounded mb-3" />
                        <h4 className="dosha-title">DOSHA</h4>
                        <h3 className="dosha-name vata-color">VATA</h3>
                        <div className="dosha-elements">
                          <span className="element-badge">ETHER</span>
                          <span className="element-badge">AIR</span>
                        </div>
                      </div>
                      
                      <div className="dosha-lists">
                        <h6 className="list-title">Out of Balance:</h6>
                        <ul className="dosha-list">
                          <li>hypertension</li>
                          <li>constipation</li>
                          <li>weight loss</li>
                          <li>weakness</li>
                          <li>arthritis</li>
                          <li>prone to worry</li>
                          <li>insomnia</li>
                          <li>digestive challenges</li>
                        </ul>
                        
                        <h6 className="list-title">In Balance:</h6>
                        <ul className="dosha-list">
                          <li>excellent agility</li>
                          <li>dry skin and hair</li>
                          <li>thin frame</li>
                          <li>creative</li>
                          <li>energetic</li>
                          <li>flexible</li>
                          <li>love excitement and new experiences</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Pitta Card */}
                  <div className="col-md-4 mb-4">
                    <div className="dosha-detail-card pitta-border">
                      <div className="dosha-tabs-small mb-3">
                        <button className="dosha-small-btn">Vata</button>
                        <button className="dosha-small-btn active">Pitta</button>
                        <button className="dosha-small-btn">Kapha</button>
                      </div>
                      
                      <div className="text-center mb-4">
                        <img src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop" alt="Pitta Dosha" className="img-fluid rounded mb-3" />
                        <h4 className="dosha-title">DOSHA</h4>
                        <h3 className="dosha-name pitta-color">PITTA</h3>
                        <div className="dosha-elements">
                          <span className="element-badge">FIRE</span>
                          <span className="element-badge">WATER</span>
                        </div>
                      </div>
                      
                      <div className="dosha-lists">
                        <h6 className="list-title">Out of Balance:</h6>
                        <ul className="dosha-list">
                          <li>skin rashes</li>
                          <li>indigestion</li>
                          <li>excessive body heat</li>
                          <li>burning sensations</li>
                          <li>short-tempered</li>
                          <li>argumentative</li>
                        </ul>
                        
                        <h6 className="list-title">In Balance:</h6>
                        <ul className="dosha-list">
                          <li>perfect digestion</li>
                          <li>lustrous complexion</li>
                          <li>strong appetite</li>
                          <li>precise</li>
                          <li>sharp-witted</li>
                          <li>direct</li>
                          <li>outspoken</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Kapha Card */}
                  <div className="col-md-4 mb-4">
                    <div className="dosha-detail-card kapha-border">
                      <div className="dosha-tabs-small mb-3">
                        <button className="dosha-small-btn">Vata</button>
                        <button className="dosha-small-btn">Pitta</button>
                        <button className="dosha-small-btn active">Kapha</button>
                      </div>
                      
                      <div className="text-center mb-4">
                        <img src="https://images.unsplash.com/photo-1599447292120-2329ba2c0770?w=300&h=200&fit=crop" alt="Kapha Dosha" className="img-fluid rounded mb-3" />
                        <h4 className="dosha-title">DOSHA</h4>
                        <h3 className="dosha-name kapha-color">KAPHA</h3>
                        <div className="dosha-elements">
                          <span className="element-badge">WATER</span>
                          <span className="element-badge">EARTH</span>
                        </div>
                      </div>
                      
                      <div className="dosha-lists">
                        <h6 className="list-title">Out of Balance:</h6>
                        <ul className="dosha-list">
                          <li>sleep excessively</li>
                          <li>overweight</li>
                          <li>suffer from asthma</li>
                          <li>depression</li>
                          <li>diabetes</li>
                          <li>resistance to change</li>
                          <li>stubbornness</li>
                        </ul>
                        
                        <h6 className="list-title">In Balance:</h6>
                        <ul className="dosha-list">
                          <li>excellent stamina</li>
                          <li>large and soft eyes</li>
                          <li>strong build</li>
                          <li>thick hair</li>
                          <li>smooth skin</li>
                          <li>loyal</li>
                          <li>patient</li>
                          <li>steady</li>
                          <li>supportive</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Ayurvedic Elements Section */}
              <div className="therapy-section-card mb-5">
                <div className="text-center mb-4">
                  <img src="https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=1000&h=300&fit=crop" alt="Five Elements" className="img-fluid rounded" />
                </div>
                
                <h3 className="therapy-main-title text-center">Understanding the imbalance of your unique body is the basis for treatment.</h3>
                
                <div className="therapy-content">
                  <p>Every individual constitution has its own unique balance of vata, pitta, and kapha (VPK) according to its own nature. This balance of VPK is the natural order. When this doshic balance is disturbed, it creates imbalance, which is disorder.</p>
                  
                  <p>Health is order; disease is disorder. Within the body there is a constant interaction between order and disorder, thus once one understands the nature and structure of disorder, one can re-establish order. Ayurveda believes that order lies within disorder. Order is the state of health, as defined by Ayurveda Panchakarma.</p>
                  
                  <p>This exists when the digestive fire (agni) is in a balanced condition; the bodily humors (vata, pitta, and kapha) are in equilibrium, the three waste products (urine, feces, and sweat) are produced and eliminated normally, the seven bodily tissues (rasa, rakta, mamsa, meda, asthi, majja and shukra/artava) are functioning normally, and the mind, senses, and consciousness are working harmoniously together.</p>
                  
                  <p>When the balance of these systems is disturbed, the disease (disorder) process begins.</p>
                </div>
              </div>

              {/* What is Panchakarma Section */}
              <div className="therapy-section-card">
                <h3 className="therapy-main-title">What is Panchakarma Treatment?</h3>
                
                <div className="therapy-content">
                  <p>Panchakarma is a treatment program for the body, mind, and consciousness that cleanses and rejuvenates. It is based on Ayurvedic principles, every human is a unique phenomenon manifested through the five basic elements of Ether, Air, Fire, Water, and Earth.</p>
                  
                  <p>The combination of these elements are three doshas (tridosha): Vata, Pitta, and Kapha, and their balance is unique to each individual. When this doshic balance is disturbed it creates disorder resulting in disease.</p>
                  
                  <p>Panchakarma is done individually for each person with their specific constitution and specific disorder in mind, thus it requires close observation and supervision. Treatment starts with pre-purification Measures of Snehan and Svedana, and then cleansing methods – Shodanas, are applied.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'feedback' && (
            <div className="feedback-section">
              <div className="page-header">
                <h2 className="page-title">Share Your Feedback</h2>
              </div>
              <div className="feedback-card">
                <h4>Rate Your Recent Therapy</h4>
                <Form className="mt-4">
                  <Form.Group className="mb-3">
                    <Form.Label>Select Therapy Session</Form.Label>
                    <Form.Select>
                      <option>Abhyanga - Nov 1, 2025</option>
                      <option>Swedana - Nov 3, 2025</option>
                      <option>Virechana - Nov 4, 2025</option>
                    </Form.Select>
                  </Form.Group>
                  
                  <Form.Group className="mb-4">
                    <Form.Label>Overall Experience</Form.Label>
                    <div className="rating-container">
                      {[1, 2, 3, 4, 5].map(star => (
                        <i
                          key={star}
                          className={`bi ${
                            star <= (hoverRating || feedbackRating) ? 'bi-star-fill' : 'bi-star'
                          } rating-star ${star <= feedbackRating ? 'active' : ''}`}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          onClick={() => setFeedbackRating(star)}
                        ></i>
                      ))}
                    </div>
                  </Form.Group>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>How are you feeling after the therapy?</Form.Label>
                    <div className="form-check">
                      <input className="form-check-input" type="radio" name="feeling" id="feeling1" />
                      <label className="form-check-label" htmlFor="feeling1">
                        Much Better
                      </label>
                    </div>
                    <div className="form-check">
                      <input className="form-check-input" type="radio" name="feeling" id="feeling2" />
                      <label className="form-check-label" htmlFor="feeling2">
                        Better
                      </label>
                    </div>
                    <div className="form-check">
                      <input className="form-check-input" type="radio" name="feeling" id="feeling3" />
                      <label className="form-check-label" htmlFor="feeling3">
                        Same
                      </label>
                    </div>
                    <div className="form-check">
                      <input className="form-check-input" type="radio" name="feeling" id="feeling4" />
                      <label className="form-check-label" htmlFor="feeling4">
                        Worse
                      </label>
                    </div>
                  </Form.Group>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Any side effects or discomfort?</Form.Label>
                    <Form.Control as="textarea" rows={3} />
                  </Form.Group>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Additional Comments</Form.Label>
                    <Form.Control as="textarea" rows={3} />
                  </Form.Group>
                  
                  <Button variant="primary" type="submit">Submit Feedback</Button>
                </Form>
              </div>
            </div>
          )}

          {activeTab === 'consult' && (
            <div className="consult-section">
              <div className="page-header">
                <h2 className="page-title">Consult Your Doctor</h2>
              </div>
              
              <div className="chat-container">
                <div className="chat-header">
                  <img src="https://picsum.photos/seed/doctor/50/50" alt="Doctor" className="doctor-avatar" />
                  <div className="doctor-info">
                    <h5>Dr. Rajesh Kumar</h5>
                    <small><i className="bi bi-circle-fill text-success"></i> Online</small>
                  </div>
                </div>
                
                <div className="chat-messages">
                  {chatMessages.map(msg => (
                    <div key={msg.id} className={`message ${msg.sender === 'patient' ? 'sent' : ''}`}>
                      <div className="message-bubble">
                        {msg.text}
                        <div className="message-time">{msg.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="chat-input">
                  <Form onSubmit={handleSendMessage}>
                    <div className="input-group">
                      <Form.Control
                        type="text"
                        placeholder="Type your message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                      />
                      <Button type="submit">
                        <i className="bi bi-send"></i>
                      </Button>
                    </div>
                  </Form>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Doctor Details Modal */}
      <Modal show={showDoctorModal} onHide={() => setShowDoctorModal(false)} size="lg">
        <Modal.Header closeButton style={{background: 'linear-gradient(135deg, #2E7D32 0%, #1B5E20 100%)', color: 'white'}}>
          <Modal.Title>Doctor Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedDoctor && (
            <>
              <div className="doctor-profile-section">
                <div className="d-flex gap-4 mb-4">
                  <img 
                    src={selectedDoctor.avatar} 
                    alt={selectedDoctor.name}
                    className="doctor-modal-avatar"
                    style={{width: '150px', height: '150px', borderRadius: '50%', objectFit: 'cover'}}
                  />
                  <div className="flex-grow-1">
                    <h3>{selectedDoctor.name}</h3>
                    <p className="text-muted mb-2">{selectedDoctor.specialty}</p>
                    <div className="mb-3">
                      {generateStars(selectedDoctor.rating)}
                      <span className="ms-2">{selectedDoctor.rating} ({selectedDoctor.reviews} reviews)</span>
                    </div>
                    <div className="d-flex gap-2">
                      <Button 
                        variant="primary" 
                        onClick={() => handleBookAppointment(selectedDoctor)}
                      >
                        <i className="bi bi-calendar-plus"></i> Book Appointment
                      </Button>
                      <Button 
                        variant="outline-primary"
                        onClick={() => handleGetDirections(selectedDoctor)}
                      >
                        <i className="bi bi-geo-alt"></i> Get Directions
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Tabs for detailed info */}
                <ul className="nav nav-tabs mb-3" role="tablist">
                  <li className="nav-item">
                    <button className="nav-link active" data-bs-toggle="tab" data-bs-target="#overview">
                      Overview
                    </button>
                  </li>
                  <li className="nav-item">
                    <button className="nav-link" data-bs-toggle="tab" data-bs-target="#timings">
                      Timings
                    </button>
                  </li>
                  <li className="nav-item">
                    <button className="nav-link" data-bs-toggle="tab" data-bs-target="#services">
                      Services
                    </button>
                  </li>
                </ul>

                <div className="tab-content">
                  <div className="tab-pane fade show active" id="overview">
                    <div className="mb-3">
                      <h6><i className="bi bi-info-circle"></i> About</h6>
                      <p>{selectedDoctor.about}</p>
                    </div>
                    <div className="mb-3">
                      <h6><i className="bi bi-mortarboard"></i> Education</h6>
                      <ul>
                        {selectedDoctor.education.map((edu, idx) => (
                          <li key={idx}>{edu}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="mb-3">
                      <h6><i className="bi bi-star"></i> Specializations</h6>
                      <div className="d-flex flex-wrap gap-2">
                        {selectedDoctor.specializations.map((spec, idx) => (
                          <span key={idx} className="badge bg-primary">{spec}</span>
                        ))}
                      </div>
                    </div>
                    <div className="mb-3">
                      <h6><i className="bi bi-translate"></i> Languages</h6>
                      <p>{selectedDoctor.languages.join(', ')}</p>
                    </div>
                    <div className="mb-3">
                      <h6><i className="bi bi-geo-alt"></i> Address</h6>
                      <p>{selectedDoctor.address}</p>
                    </div>
                    <div className="mb-3">
                      <h6><i className="bi bi-telephone"></i> Contact</h6>
                      <p>{selectedDoctor.phone}</p>
                      <p>{selectedDoctor.email}</p>
                    </div>
                  </div>

                  <div className="tab-pane fade" id="timings">
                    <table className="table">
                      <tbody>
                        {Object.entries(selectedDoctor.timings).map(([day, time]) => (
                          <tr key={day}>
                            <td><strong>{day}</strong></td>
                            <td>{time}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="tab-pane fade" id="services">
                    <ul>
                      {selectedDoctor.services.map((service, idx) => (
                        <li key={idx}>{service}</li>
                      ))}
                    </ul>
                    <div className="mt-3">
                      <h6>Consultation Fee</h6>
                      <p className="h4 text-primary">{selectedDoctor.consultationFees}</p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </Modal.Body>
      </Modal>

      {/* Booking Appointment Modal */}
      <Modal show={showBookingModal} onHide={() => setShowBookingModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Book Appointment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedDoctor && (
            <>
              <div className="mb-3">
                <p><strong>Doctor:</strong> {selectedDoctor.name}</p>
                <p><strong>Specialty:</strong> {selectedDoctor.specialty}</p>
                <p><strong>Consultation Fee:</strong> {selectedDoctor.consultationFees}</p>
              </div>
              <Form onSubmit={handleSubmitBooking}>
                <Form.Group className="mb-3">
                  <Form.Label>Appointment Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={bookingForm.date}
                    onChange={(e) => setBookingForm({...bookingForm, date: e.target.value})}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Preferred Time</Form.Label>
                  <Form.Control
                    type="time"
                    value={bookingForm.time}
                    onChange={(e) => setBookingForm({...bookingForm, time: e.target.value})}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Appointment Type</Form.Label>
                  <Form.Select
                    value={bookingForm.type}
                    onChange={(e) => setBookingForm({...bookingForm, type: e.target.value})}
                  >
                    <option>Consultation</option>
                    <option>Follow-up</option>
                    <option>Therapy Session</option>
                    <option>Health Checkup</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Symptoms / Reason for Visit</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={bookingForm.symptoms}
                    onChange={(e) => setBookingForm({...bookingForm, symptoms: e.target.value})}
                    placeholder="Please describe your symptoms or reason for consultation..."
                  />
                </Form.Group>

                <div className="d-flex gap-2 justify-content-end">
                  <Button variant="secondary" onClick={() => setShowBookingModal(false)}>
                    Cancel
                  </Button>
                  <Button variant="primary" type="submit">
                    <i className="bi bi-check-lg"></i> Confirm Booking
                  </Button>
                </div>
              </Form>
            </>
          )}
        </Modal.Body>
      </Modal>

      {/* Toast Notification */}
      <div className="toast-notification">
        <Toast 
          show={showToast} 
          onClose={() => setShowToast(false)}
          delay={3000}
          autohide
          style={{position: 'fixed', top: '80px', right: '20px', zIndex: 9999}}
        >
          <Toast.Header>
            <i className="bi bi-check-circle-fill text-success me-2"></i>
            <strong className="me-auto">Success</strong>
          </Toast.Header>
          <Toast.Body>{toastMessage}</Toast.Body>
        </Toast>
      </div>
    </div>
  );
};

export default PatientDashboard;
