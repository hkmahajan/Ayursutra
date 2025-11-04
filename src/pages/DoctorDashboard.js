import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSession, clearSession, getAppointments, getSessions, saveAppointments, saveSessions } from '../utils/auth';
import { Modal, Button, Form } from 'react-bootstrap';
import './DoctorDashboard.css';

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [appointments, setAppointments] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  
  // Additional data states
  const [inventory, setInventory] = useState([
    { id: 1, name: 'Triphala Churna', category: 'Churna', stock: 50, unit: 'kg', reorderLevel: 10, price: 250 },
    { id: 2, name: 'Ashwagandha Capsules', category: 'Capsules', stock: 200, unit: 'bottles', reorderLevel: 50, price: 350 },
    { id: 3, name: 'Brahmi Oil', category: 'Oils', stock: 30, unit: 'liters', reorderLevel: 5, price: 450 },
    { id: 4, name: 'Chyawanprash', category: 'Avaleha', stock: 45, unit: 'kg', reorderLevel: 15, price: 800 }
  ]);
  
  const [treatments, setTreatments] = useState([
    { id: 1, patientName: 'Ravi Kumar', planName: 'Panchakarma Detox', startDate: '2024-01-15', duration: '21 days', status: 'active', progress: 45 },
    { id: 2, patientName: 'Priya Sharma', planName: 'Stress Management', startDate: '2024-01-10', duration: '30 days', status: 'active', progress: 60 },
    { id: 3, patientName: 'Amit Patel', planName: 'Joint Pain Relief', startDate: '2024-01-20', duration: '14 days', status: 'active', progress: 30 }
  ]);
  
  const [prescriptionsData, setPrescriptionsData] = useState([
    { id: 1, patientName: 'Ravi Kumar', date: '2024-01-15', medicines: 3, status: 'active' },
    { id: 2, patientName: 'Priya Sharma', date: '2024-01-18', medicines: 2, status: 'completed' },
    { id: 3, patientName: 'Amit Patel', date: '2024-01-20', medicines: 4, status: 'active' }
  ]);
  
  const [billingData, setBillingData] = useState([
    { id: 1, patientName: 'Ravi Kumar', service: 'Consultation', amount: 800, date: '2024-01-15', status: 'paid' },
    { id: 2, patientName: 'Priya Sharma', service: 'Panchakarma Therapy', amount: 5000, date: '2024-01-18', status: 'pending' },
    { id: 3, patientName: 'Amit Patel', service: 'Follow-up', amount: 500, date: '2024-01-20', status: 'paid' }
  ]);
  
  const [staffData, setStaffData] = useState([
    { id: 1, name: 'Dr. Suresh Kumar', role: 'Assistant Doctor', phone: '+91 98765 11111', email: 'suresh@ayur.com', status: 'active' },
    { id: 2, name: 'Nurse Lakshmi', role: 'Therapist', phone: '+91 98765 22222', email: 'lakshmi@ayur.com', status: 'active' },
    { id: 3, name: 'Rajesh Rao', role: 'Receptionist', phone: '+91 98765 33333', email: 'rajesh@ayur.com', status: 'active' }
  ]);
  
  // Form states
  const [appointmentForm, setAppointmentForm] = useState({
    patientName: '',
    date: '',
    time: '',
    type: 'Consultation',
    notes: ''
  });

  const [sessionForm, setSessionForm] = useState({
    patientId: '',
    therapy: 'Vamana',
    date: '',
    notes: '',
    progress: 0
  });

  const [prescriptionForm, setPrescriptionForm] = useState({
    medicines: [{ name: '', dosage: '', duration: '', instructions: '' }],
    diet: '',
    lifestyle: '',
    followUp: ''
  });

  // Initial patients data
  const initialPatients = [
    {
      id: 'pat1',
      name: 'Ravi Kumar',
      age: 35,
      gender: 'Male',
      condition: 'Digestive Issues',
      lastVisit: '2024-01-15',
      avatar: 'https://i.pravatar.cc/150?img=8',
      phone: '+91 98765 43210',
      email: 'ravi@example.com',
      bloodGroup: 'O+',
      address: '123, MG Road, Bangalore',
      medicalHistory: ['Gastritis', 'IBS'],
      allergies: ['Peanuts'],
      currentMedications: ['Antacid tablets']
    },
    {
      id: 'pat2',
      name: 'Priya Sharma',
      age: 28,
      gender: 'Female',
      condition: 'Stress & Anxiety',
      lastVisit: '2024-01-18',
      avatar: 'https://i.pravatar.cc/150?img=45',
      phone: '+91 98765 43211',
      email: 'priya@example.com',
      bloodGroup: 'A+',
      address: '456, Indiranagar, Bangalore',
      medicalHistory: ['Anxiety disorder'],
      allergies: ['None'],
      currentMedications: ['Ashwagandha tablets']
    },
    {
      id: 'pat3',
      name: 'Amit Patel',
      age: 42,
      gender: 'Male',
      condition: 'Joint Pain',
      lastVisit: '2024-01-20',
      avatar: 'https://i.pravatar.cc/150?img=33',
      phone: '+91 98765 43212',
      email: 'amit@example.com',
      bloodGroup: 'B+',
      address: '789, Koramangala, Bangalore',
      medicalHistory: ['Arthritis', 'Osteoporosis'],
      allergies: ['Shellfish'],
      currentMedications: ['Pain relievers', 'Calcium supplements']
    }
  ];

  useEffect(() => {
    const session = getSession();
    if (!session || session.role !== 'doctor') {
      navigate('/login');
      return;
    }
    setUser(session);
    setPatients(initialPatients);
    setAppointments(getAppointments());
    setSessions(getSessions());
  }, [navigate, initialPatients]);

  // Toast notification
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

  // Appointment functions
  const handleCreateAppointment = (e) => {
    e.preventDefault();
    const newAppointment = {
      id: Date.now(),
      ...appointmentForm,
      status: 'scheduled',
      doctorId: user.id
    };
    const updatedAppointments = [...appointments, newAppointment];
    setAppointments(updatedAppointments);
    saveAppointments(updatedAppointments);
    setShowAppointmentModal(false);
    setAppointmentForm({ patientName: '', date: '', time: '', type: 'Consultation', notes: '' });
    showToast('Appointment scheduled successfully!');
  };

  const handleUpdateAppointmentStatus = (appointmentId, newStatus) => {
    const updatedAppointments = appointments.map(apt =>
      apt.id === appointmentId ? { ...apt, status: newStatus } : apt
    );
    setAppointments(updatedAppointments);
    saveAppointments(updatedAppointments);
    showToast(`Appointment ${newStatus}!`);
  };

  const handleDeleteAppointment = (appointmentId) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      const updatedAppointments = appointments.filter(apt => apt.id !== appointmentId);
      setAppointments(updatedAppointments);
      saveAppointments(updatedAppointments);
      showToast('Appointment deleted!', 'info');
    }
  };

  // Session functions
  const handleCreateSession = (e) => {
    e.preventDefault();
    const patient = patients.find(p => p.id === sessionForm.patientId);
    const newSession = {
      id: Date.now(),
      ...sessionForm,
      patientName: patient?.name || 'Unknown',
      doctorId: user.id,
      createdAt: new Date().toISOString()
    };
    const updatedSessions = [...sessions, newSession];
    setSessions(updatedSessions);
    saveSessions(updatedSessions);
    setShowSessionModal(false);
    setSessionForm({ patientId: '', therapy: 'Vamana', date: '', notes: '', progress: 0 });
    showToast('Therapy session created successfully!');
  };

  const handleUpdateProgress = (sessionId, newProgress) => {
    const updatedSessions = sessions.map(session =>
      session.id === sessionId ? { ...session, progress: parseInt(newProgress) } : session
    );
    setSessions(updatedSessions);
    saveSessions(updatedSessions);
    showToast('Progress updated!');
  };

  // Patient functions
  const handleViewPatient = (patient) => {
    setSelectedPatient(patient);
    setShowPatientModal(true);
  };

  const handlePrescribe = (patient) => {
    setSelectedPatient(patient);
    setShowPrescriptionModal(true);
  };

  const handleSavePrescription = (e) => {
    e.preventDefault();
    showToast(`Prescription created for ${selectedPatient.name}!`);
    setShowPrescriptionModal(false);
    setPrescriptionForm({
      medicines: [{ name: '', dosage: '', duration: '', instructions: '' }],
      diet: '',
      lifestyle: '',
      followUp: ''
    });
  };

  const addMedicineRow = () => {
    setPrescriptionForm({
      ...prescriptionForm,
      medicines: [...prescriptionForm.medicines, { name: '', dosage: '', duration: '', instructions: '' }]
    });
  };

  const removeMedicineRow = (index) => {
    const newMedicines = prescriptionForm.medicines.filter((_, i) => i !== index);
    setPrescriptionForm({ ...prescriptionForm, medicines: newMedicines });
  };

  const updateMedicine = (index, field, value) => {
    const newMedicines = [...prescriptionForm.medicines];
    newMedicines[index][field] = value;
    setPrescriptionForm({ ...prescriptionForm, medicines: newMedicines });
  };

  // Filter and search
  const filteredAppointments = appointments.filter(apt => {
    const matchesStatus = filterStatus === 'all' || apt.status === filterStatus;
    const matchesSearch = apt.patientName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         apt.type?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.condition.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLogout = () => {
    clearSession();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div className="doctor-dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="container-fluid">
          <div className="header-content">
            <div className="logo-section">
              <i className="bi bi-heart-pulse-fill"></i>
              <h3>AyurSutra - Doctor Portal</h3>
            </div>
            <div className="header-actions">
              <div className="notification-bell">
                <i className="bi bi-bell"></i>
                <span className="notification-badge">5</span>
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
                className={activeTab === 'overview' ? 'active' : ''}
                onClick={(e) => { e.preventDefault(); setActiveTab('overview'); }}
              >
                <i className="bi bi-grid"></i> Dashboard
              </a>
            </li>
            <li>
              <a
                href="#"
                className={activeTab === 'patients' ? 'active' : ''}
                onClick={(e) => { e.preventDefault(); setActiveTab('patients'); }}
              >
                <i className="bi bi-people"></i> Patients
                <span className="menu-badge">{patients.length}</span>
              </a>
            </li>
            <li>
              <a
                href="#"
                className={activeTab === 'appointments' ? 'active' : ''}
                onClick={(e) => { e.preventDefault(); setActiveTab('appointments'); }}
              >
                <i className="bi bi-calendar-check"></i> Appointments
                <span className="menu-badge">{appointments.length}</span>
              </a>
            </li>
            <li>
              <a
                href="#"
                className={activeTab === 'sessions' ? 'active' : ''}
                onClick={(e) => { e.preventDefault(); setActiveTab('sessions'); }}
              >
                <i className="bi bi-heart-pulse"></i> Therapy Sessions
              </a>
            </li>
            <li>
              <a
                href="#"
                className={activeTab === 'treatments' ? 'active' : ''}
                onClick={(e) => { e.preventDefault(); setActiveTab('treatments'); }}
              >
                <i className="bi bi-clipboard2-pulse"></i> Treatment Plans
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
                className={activeTab === 'inventory' ? 'active' : ''}
                onClick={(e) => { e.preventDefault(); setActiveTab('inventory'); }}
              >
                <i className="bi bi-box-seam"></i> Inventory
              </a>
            </li>
            <li>
              <a
                href="#"
                className={activeTab === 'reports' ? 'active' : ''}
                onClick={(e) => { e.preventDefault(); setActiveTab('reports'); }}
              >
                <i className="bi bi-graph-up"></i> Reports
              </a>
            </li>
            <li>
              <a
                href="#"
                className={activeTab === 'billing' ? 'active' : ''}
                onClick={(e) => { e.preventDefault(); setActiveTab('billing'); }}
              >
                <i className="bi bi-receipt"></i> Billing
              </a>
            </li>
            <li>
              <a
                href="#"
                className={activeTab === 'staff' ? 'active' : ''}
                onClick={(e) => { e.preventDefault(); setActiveTab('staff'); }}
              >
                <i className="bi bi-people-fill"></i> Staff
              </a>
            </li>
            <li>
              <a
                href="#"
                className={activeTab === 'schedule' ? 'active' : ''}
                onClick={(e) => { e.preventDefault(); setActiveTab('schedule'); }}
              >
                <i className="bi bi-clock"></i> My Schedule
              </a>
            </li>
            <li>
              <a
                href="#"
                className={activeTab === 'profile' ? 'active' : ''}
                onClick={(e) => { e.preventDefault(); setActiveTab('profile'); }}
              >
                <i className="bi bi-person-circle"></i> My Profile
              </a>
            </li>
          </ul>
        </aside>

        {/* Content Area */}
        <main className="content-area">
          {activeTab === 'overview' && (
            <div className="overview-section">
              <div className="page-header">
                <h2 className="page-title">Dashboard Overview</h2>
              </div>

              {/* Stats Cards */}
              <div className="row g-4 mb-4">
                <div className="col-md-3">
                  <div className="stat-card primary">
                    <div className="stat-card-header">
                      <div className="stat-icon primary">
                        <i className="bi bi-people-fill"></i>
                      </div>
                      <div className="stat-change positive">
                        <i className="bi bi-arrow-up"></i> 12%
                      </div>
                    </div>
                    <div className="stat-value">24</div>
                    <div className="stat-label">Total Patients</div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="stat-card success">
                    <div className="stat-card-header">
                      <div className="stat-icon success">
                        <i className="bi bi-calendar-check-fill"></i>
                      </div>
                      <div className="stat-change positive">
                        <i className="bi bi-arrow-up"></i> 8%
                      </div>
                    </div>
                    <div className="stat-value">18</div>
                    <div className="stat-label">Appointments Today</div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="stat-card warning">
                    <div className="stat-card-header">
                      <div className="stat-icon warning">
                        <i className="bi bi-heart-pulse-fill"></i>
                      </div>
                      <div className="stat-change positive">
                        <i className="bi bi-arrow-up"></i> 15%
                      </div>
                    </div>
                    <div className="stat-value">12</div>
                    <div className="stat-label">Active Therapies</div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="stat-card info">
                    <div className="stat-card-header">
                      <div className="stat-icon info">
                        <i className="bi bi-star-fill"></i>
                      </div>
                    </div>
                    <div className="stat-value">4.8</div>
                    <div className="stat-label">Average Rating</div>
                  </div>
                </div>
              </div>

              {/* Today's Schedule */}
              <div className="card mb-4">
                <div className="card-header">
                  <h5><i className="bi bi-calendar-day"></i> Today's Schedule</h5>
                </div>
                <div className="card-body">
                  <div className="schedule-list">
                    <div className="schedule-card">
                      <div className="schedule-time">
                        <i className="bi bi-clock"></i> 09:00 AM
                      </div>
                      <div className="schedule-content">
                        <div className="schedule-info">
                          <h5>Consultation - Ravi Kumar</h5>
                          <p>Initial consultation for Vamana therapy</p>
                        </div>
                        <span className="schedule-status status-in-progress">In Progress</span>
                      </div>
                    </div>
                    <div className="schedule-card">
                      <div className="schedule-time">
                        <i className="bi bi-clock"></i> 11:00 AM
                      </div>
                      <div className="schedule-content">
                        <div className="schedule-info">
                          <h5>Follow-up - Priya Sharma</h5>
                          <p>Progress review for Panchakarma treatment</p>
                        </div>
                        <span className="schedule-status status-scheduled">Scheduled</span>
                      </div>
                    </div>
                    <div className="schedule-card">
                      <div className="schedule-time">
                        <i className="bi bi-clock"></i> 02:00 PM
                      </div>
                      <div className="schedule-content">
                        <div className="schedule-info">
                          <h5>Therapy Session - Amit Patel</h5>
                          <p>Basti therapy administration</p>
                        </div>
                        <span className="schedule-status status-scheduled">Scheduled</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Patients */}
              <div className="card">
                <div className="card-header">
                  <h5><i className="bi bi-people"></i> Recent Patients</h5>
                </div>
                <div className="card-body">
                  <div className="patients-list">
                    {patients.map(patient => (
                      <div key={patient.id} className="patient-card-mini">
                        <img src={patient.avatar} alt={patient.name} className="patient-avatar-mini" />
                        <div className="patient-info-mini">
                          <h6>{patient.name}</h6>
                          <p>{patient.age}y, {patient.gender} • {patient.condition}</p>
                        </div>
                        <button className="btn btn-sm btn-outline-primary">View</button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'patients' && (
            <div className="patients-section">
              <div className="page-header">
                <h2 className="page-title">My Patients</h2>
                <button className="btn btn-primary" onClick={() => showToast('Add patient feature coming soon!', 'info')}>
                  <i className="bi bi-plus-lg"></i> Add Patient
                </button>
              </div>

              <div className="search-filter-bar mb-4">
                <div className="search-input-wrapper">
                  <i className="bi bi-search search-icon"></i>
                  <input
                    type="text"
                    className="search-input"
                    placeholder="Search patients by name or condition..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <div className="patients-grid">
                {filteredPatients.map(patient => (
                  <div key={patient.id} className="patient-card">
                    <div className="patient-header">
                      <img src={patient.avatar} alt={patient.name} className="patient-avatar" />
                      <div className="patient-info">
                        <h5>{patient.name}</h5>
                        <p>{patient.age} years • {patient.gender}</p>
                      </div>
                    </div>
                    <div className="patient-details">
                      <div className="detail-item">
                        <span className="detail-label">Condition</span>
                        <span className="detail-value">{patient.condition}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Last Visit</span>
                        <span className="detail-value">{patient.lastVisit}</span>
                      </div>
                    </div>
                    <div className="patient-actions">
                      <button className="btn btn-sm btn-primary" onClick={() => handleViewPatient(patient)}>
                        <i className="bi bi-eye"></i> View Details
                      </button>
                      <button className="btn btn-sm btn-outline-primary" onClick={() => handlePrescribe(patient)}>
                        <i className="bi bi-prescription2"></i> Prescribe
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'appointments' && (
            <div className="appointments-section">
              <div className="page-header">
                <h2 className="page-title">Appointments</h2>
                <button className="btn btn-primary" onClick={() => setShowAppointmentModal(true)}>
                  <i className="bi bi-plus-lg"></i> Schedule Appointment
                </button>
              </div>

              <div className="filter-bar mb-4">
                <div className="d-flex gap-3 align-items-center">
                  <Form.Select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    style={{width: '200px'}}
                  >
                    <option value="all">All Status</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </Form.Select>

                  <div className="search-input-wrapper flex-grow-1">
                    <i className="bi bi-search search-icon"></i>
                    <input
                      type="text"
                      className="search-input"
                      placeholder="Search by patient name or type..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="appointments-list">
                {filteredAppointments.length > 0 ? (
                  filteredAppointments.map(apt => (
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
                        <h5>{apt.type}</h5>
                        <p><i className="bi bi-clock"></i> {apt.time}</p>
                        <p><i className="bi bi-person"></i> {apt.patientName || 'Patient'}</p>
                        {apt.notes && <p className="text-muted small">{apt.notes}</p>}
                      </div>
                      <div className="appointment-status">
                        <span className={`badge ${
                          apt.status === 'scheduled' ? 'bg-info' : 
                          apt.status === 'confirmed' ? 'bg-primary' :
                          apt.status === 'completed' ? 'bg-success' : 'bg-secondary'
                        }`}>
                          {apt.status}
                        </span>
                      </div>
                      <div className="appointment-actions">
                        {apt.status === 'scheduled' && (
                          <>
                            <button 
                              className="btn btn-sm btn-success"
                              onClick={() => handleUpdateAppointmentStatus(apt.id, 'confirmed')}
                            >
                              <i className="bi bi-check-lg"></i> Confirm
                            </button>
                            <button 
                              className="btn btn-sm btn-primary"
                              onClick={() => handleUpdateAppointmentStatus(apt.id, 'completed')}
                            >
                              <i className="bi bi-check-circle"></i> Complete
                            </button>
                          </>
                        )}
                        {apt.status === 'confirmed' && (
                          <button 
                            className="btn btn-sm btn-primary"
                            onClick={() => handleUpdateAppointmentStatus(apt.id, 'completed')}
                          >
                            <i className="bi bi-check-circle"></i> Complete
                          </button>
                        )}
                        <button 
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDeleteAppointment(apt.id)}
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="empty-state">
                    <i className="bi bi-calendar-x"></i>
                    <h4>No Appointments Found</h4>
                    <p>No appointments match your search criteria</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'sessions' && (
            <div className="sessions-section">
              <div className="page-header">
                <h2 className="page-title">Therapy Sessions</h2>
                <button className="btn btn-primary" onClick={() => setShowSessionModal(true)}>
                  <i className="bi bi-plus-lg"></i> New Session
                </button>
              </div>

              <div className="sessions-list">
                {sessions.map(session => (
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
                    <div className="session-actions mt-3">
                      <button 
                        className="btn btn-sm btn-primary"
                        onClick={() => handleUpdateProgress(session.id)}
                      >
                        <i className="bi bi-arrow-up-circle"></i> Update Progress
                      </button>
                      <button className="btn btn-sm btn-outline-primary">
                        <i className="bi bi-eye"></i> View Details
                      </button>
                    </div>
                  </div>
                ))}
                {sessions.length === 0 && (
                  <div className="empty-state">
                    <i className="bi bi-calendar-x"></i>
                    <p>No therapy sessions scheduled yet</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'schedule' && (
            <div className="schedule-section">
              <div className="page-header">
                <h2 className="page-title">My Schedule</h2>
                <button className="btn btn-primary">
                  <i className="bi bi-calendar-plus"></i> Block Time
                </button>
              </div>

              <div className="weekly-schedule">
                <div className="schedule-header">
                  <h4>This Week's Schedule</h4>
                </div>
                
                <div className="schedule-grid">
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day, index) => (
                    <div key={day} className="schedule-day">
                      <div className="day-header">
                        <h5>{day}</h5>
                        <span className="day-date">{new Date(Date.now() + index * 24 * 60 * 60 * 1000).getDate()}</span>
                      </div>
                      <div className="day-slots">
                        {appointments
                          .filter(apt => new Date(apt.date).getDay() === (index + 1) % 7)
                          .map(apt => (
                            <div key={apt.id} className="schedule-slot">
                              <span className="slot-time">{apt.time}</span>
                              <span className="slot-patient">{apt.patient}</span>
                              <span className={`slot-status badge bg-${
                                apt.status === 'confirmed' ? 'success' : 
                                apt.status === 'scheduled' ? 'warning' : 'secondary'
                              }`}>
                                {apt.status}
                              </span>
                            </div>
                          ))}
                        {appointments.filter(apt => new Date(apt.date).getDay() === (index + 1) % 7).length === 0 && (
                          <p className="text-muted small">No appointments</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
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
                  <img src="https://i.pravatar.cc/150?img=12" alt="Profile" className="profile-avatar" />
                  <div className="profile-info">
                    <h3>{user.name}</h3>
                    <p className="text-muted">{user.email}</p>
                    <p className="badge bg-success">Panchakarma Specialist</p>
                  </div>
                </div>
                <div className="profile-details">
                  <div className="detail-row">
                    <span className="detail-label">Specialization:</span>
                    <span className="detail-value">Panchakarma Therapy</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Experience:</span>
                    <span className="detail-value">15 years</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">License No:</span>
                    <span className="detail-value">AY12345678</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Phone:</span>
                    <span className="detail-value">+91 98765 43210</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Clinic Address:</span>
                    <span className="detail-value">Ayur Wellness Center, MG Road, Bangalore</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'treatments' && (
            <div className="treatments-section">
              <div className="page-header">
                <h2 className="page-title">Treatment Plans</h2>
                <button className="btn btn-primary" onClick={() => showToast('Create treatment plan feature coming soon!', 'info')}>
                  <i className="bi bi-plus-lg"></i> New Treatment Plan
                </button>
              </div>

              <div className="treatments-grid">
                {treatments.map(treatment => (
                  <div key={treatment.id} className="treatment-card">
                    <div className="treatment-header">
                      <div>
                        <h5>{treatment.planName}</h5>
                        <p className="text-muted">{treatment.patientName}</p>
                      </div>
                      <span className={`badge ${treatment.status === 'active' ? 'bg-success' : 'bg-secondary'}`}>
                        {treatment.status}
                      </span>
                    </div>
                    <div className="treatment-details">
                      <div className="detail-item">
                        <i className="bi bi-calendar-event"></i>
                        <span>Start: {treatment.startDate}</span>
                      </div>
                      <div className="detail-item">
                        <i className="bi bi-clock-history"></i>
                        <span>Duration: {treatment.duration}</span>
                      </div>
                    </div>
                    <div className="treatment-progress">
                      <div className="progress-header">
                        <span>Progress</span>
                        <span>{treatment.progress}%</span>
                      </div>
                      <div className="progress">
                        <div
                          className="progress-bar bg-primary"
                          style={{ width: `${treatment.progress}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="treatment-actions mt-3">
                      <button className="btn btn-sm btn-primary">
                        <i className="bi bi-eye"></i> View Details
                      </button>
                      <button className="btn btn-sm btn-outline-primary">
                        <i className="bi bi-pencil"></i> Edit Plan
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'prescriptions' && (
            <div className="prescriptions-section">
              <div className="page-header">
                <h2 className="page-title">All Prescriptions</h2>
                <button className="btn btn-primary" onClick={() => setShowPrescriptionModal(true)}>
                  <i className="bi bi-plus-lg"></i> New Prescription
                </button>
              </div>

              <div className="prescriptions-list">
                {prescriptionsData.map(prescription => (
                  <div key={prescription.id} className="prescription-card">
                    <div className="prescription-info">
                      <div className="d-flex align-items-center gap-3">
                        <i className="bi bi-file-medical text-primary" style={{fontSize: '2rem'}}></i>
                        <div>
                          <h5>{prescription.patientName}</h5>
                          <p className="text-muted mb-0">
                            <i className="bi bi-calendar"></i> {prescription.date} • 
                            <i className="bi bi-capsule ms-2"></i> {prescription.medicines} medicines
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="prescription-status">
                      <span className={`badge ${prescription.status === 'active' ? 'bg-success' : 'bg-secondary'}`}>
                        {prescription.status}
                      </span>
                    </div>
                    <div className="prescription-actions">
                      <button className="btn btn-sm btn-primary">
                        <i className="bi bi-eye"></i> View
                      </button>
                      <button className="btn btn-sm btn-outline-primary">
                        <i className="bi bi-printer"></i> Print
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'inventory' && (
            <div className="inventory-section">
              <div className="page-header">
                <h2 className="page-title">Medicine Inventory</h2>
                <button className="btn btn-primary" onClick={() => showToast('Add medicine feature coming soon!', 'info')}>
                  <i className="bi bi-plus-lg"></i> Add Medicine
                </button>
              </div>

              <div className="inventory-stats row g-3 mb-4">
                <div className="col-md-3">
                  <div className="stat-card">
                    <i className="bi bi-box-seam text-primary"></i>
                    <h3>{inventory.length}</h3>
                    <p>Total Items</p>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="stat-card">
                    <i className="bi bi-exclamation-triangle text-warning"></i>
                    <h3>{inventory.filter(item => item.stock <= item.reorderLevel).length}</h3>
                    <p>Low Stock</p>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="stat-card">
                    <i className="bi bi-currency-rupee text-success"></i>
                    <h3>₹{inventory.reduce((sum, item) => sum + (item.price * item.stock), 0).toLocaleString()}</h3>
                    <p>Total Value</p>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="stat-card">
                    <i className="bi bi-tags text-info"></i>
                    <h3>{new Set(inventory.map(item => item.category)).size}</h3>
                    <p>Categories</p>
                  </div>
                </div>
              </div>

              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Medicine Name</th>
                      <th>Category</th>
                      <th>Stock</th>
                      <th>Unit</th>
                      <th>Reorder Level</th>
                      <th>Price/Unit</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inventory.map(item => (
                      <tr key={item.id}>
                        <td><strong>{item.name}</strong></td>
                        <td><span className="badge bg-light text-dark">{item.category}</span></td>
                        <td>{item.stock}</td>
                        <td>{item.unit}</td>
                        <td>{item.reorderLevel}</td>
                        <td>₹{item.price}</td>
                        <td>
                          {item.stock <= item.reorderLevel ? (
                            <span className="badge bg-warning">Low Stock</span>
                          ) : (
                            <span className="badge bg-success">In Stock</span>
                          )}
                        </td>
                        <td>
                          <button className="btn btn-sm btn-outline-primary me-1">
                            <i className="bi bi-pencil"></i>
                          </button>
                          <button className="btn btn-sm btn-outline-danger">
                            <i className="bi bi-trash"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="reports-section">
              <div className="page-header">
                <h2 className="page-title">Reports & Analytics</h2>
                <button className="btn btn-primary">
                  <i className="bi bi-download"></i> Export Report
                </button>
              </div>

              <div className="reports-grid row g-4">
                <div className="col-md-6">
                  <div className="report-card">
                    <h5><i className="bi bi-graph-up text-primary"></i> Patient Growth</h5>
                    <div className="chart-placeholder">
                      <div className="text-center py-5">
                        <i className="bi bi-bar-chart text-muted" style={{fontSize: '4rem'}}></i>
                        <p className="text-muted mt-3">Chart visualization coming soon</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="report-card">
                    <h5><i className="bi bi-currency-rupee text-success"></i> Revenue Overview</h5>
                    <div className="chart-placeholder">
                      <div className="text-center py-5">
                        <i className="bi bi-pie-chart text-muted" style={{fontSize: '4rem'}}></i>
                        <p className="text-muted mt-3">Chart visualization coming soon</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="report-card">
                    <h5><i className="bi bi-calendar-check text-info"></i> Appointment Statistics</h5>
                    <div className="stats-list">
                      <div className="stat-item">
                        <span>Total Appointments</span>
                        <strong>245</strong>
                      </div>
                      <div className="stat-item">
                        <span>Completed</span>
                        <strong className="text-success">198</strong>
                      </div>
                      <div className="stat-item">
                        <span>Cancelled</span>
                        <strong className="text-danger">12</strong>
                      </div>
                      <div className="stat-item">
                        <span>Upcoming</span>
                        <strong className="text-primary">35</strong>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="report-card">
                    <h5><i className="bi bi-heart-pulse text-danger"></i> Treatment Success Rate</h5>
                    <div className="text-center py-4">
                      <div className="success-rate">
                        <div className="rate-circle">
                          <h2>92%</h2>
                        </div>
                        <p className="text-muted mt-3">Excellent success rate</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'billing' && (
            <div className="billing-section">
              <div className="page-header">
                <h2 className="page-title">Billing & Payments</h2>
                <button className="btn btn-primary" onClick={() => showToast('Create invoice feature coming soon!', 'info')}>
                  <i className="bi bi-plus-lg"></i> New Invoice
                </button>
              </div>

              <div className="billing-stats row g-3 mb-4">
                <div className="col-md-3">
                  <div className="stat-card">
                    <i className="bi bi-currency-rupee text-success"></i>
                    <h3>₹{billingData.filter(b => b.status === 'paid').reduce((sum, b) => sum + b.amount, 0).toLocaleString()}</h3>
                    <p>Total Received</p>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="stat-card">
                    <i className="bi bi-clock-history text-warning"></i>
                    <h3>₹{billingData.filter(b => b.status === 'pending').reduce((sum, b) => sum + b.amount, 0).toLocaleString()}</h3>
                    <p>Pending</p>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="stat-card">
                    <i className="bi bi-receipt text-primary"></i>
                    <h3>{billingData.length}</h3>
                    <p>Total Invoices</p>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="stat-card">
                    <i className="bi bi-calendar-month text-info"></i>
                    <h3>₹12,500</h3>
                    <p>This Month</p>
                  </div>
                </div>
              </div>

              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Invoice #</th>
                      <th>Patient</th>
                      <th>Service</th>
                      <th>Amount</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {billingData.map(bill => (
                      <tr key={bill.id}>
                        <td><strong>INV-{bill.id.toString().padStart(4, '0')}</strong></td>
                        <td>{bill.patientName}</td>
                        <td>{bill.service}</td>
                        <td><strong>₹{bill.amount}</strong></td>
                        <td>{bill.date}</td>
                        <td>
                          <span className={`badge ${bill.status === 'paid' ? 'bg-success' : 'bg-warning'}`}>
                            {bill.status}
                          </span>
                        </td>
                        <td>
                          <button className="btn btn-sm btn-outline-primary me-1">
                            <i className="bi bi-eye"></i>
                          </button>
                          <button className="btn btn-sm btn-outline-secondary">
                            <i className="bi bi-printer"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'staff' && (
            <div className="staff-section">
              <div className="page-header">
                <h2 className="page-title">Staff Management</h2>
                <button className="btn btn-primary" onClick={() => showToast('Add staff member feature coming soon!', 'info')}>
                  <i className="bi bi-plus-lg"></i> Add Staff Member
                </button>
              </div>

              <div className="staff-grid">
                {staffData.map(staff => (
                  <div key={staff.id} className="staff-card">
                    <div className="staff-header">
                      <img 
                        src={`https://i.pravatar.cc/150?img=${staff.id + 20}`} 
                        alt={staff.name} 
                        className="staff-avatar" 
                      />
                      <div className="staff-info">
                        <h5>{staff.name}</h5>
                        <p className="text-muted">{staff.role}</p>
                        <span className={`badge ${staff.status === 'active' ? 'bg-success' : 'bg-secondary'}`}>
                          {staff.status}
                        </span>
                      </div>
                    </div>
                    <div className="staff-details">
                      <div className="detail-item">
                        <i className="bi bi-telephone"></i>
                        <span>{staff.phone}</span>
                      </div>
                      <div className="detail-item">
                        <i className="bi bi-envelope"></i>
                        <span>{staff.email}</span>
                      </div>
                    </div>
                    <div className="staff-actions">
                      <button className="btn btn-sm btn-primary">
                        <i className="bi bi-eye"></i> View Profile
                      </button>
                      <button className="btn btn-sm btn-outline-primary">
                        <i className="bi bi-pencil"></i> Edit
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'schedule' && (
            <div className="schedule-section">
              <div className="page-header">
                <h2 className="page-title">My Schedule</h2>
                <button className="btn btn-primary">
                  <i className="bi bi-calendar-plus"></i> Block Time
                </button>
              </div>

              <div className="weekly-schedule">
                <div className="schedule-header">
                  <h4>This Week's Schedule</h4>
                </div>
                
                <div className="schedule-grid">
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day, index) => (
                    <div key={day} className="schedule-day">
                      <div className="day-header">
                        <h5>{day}</h5>
                        <span className="day-date">{new Date(Date.now() + index * 24 * 60 * 60 * 1000).getDate()}</span>
                      </div>
                      <div className="day-slots">
                        {appointments
                          .filter(apt => new Date(apt.date).getDay() === (index + 1) % 7)
                          .map(apt => (
                            <div key={apt.id} className="schedule-slot">
                              <span className="slot-time">{apt.time}</span>
                              <span className="slot-patient">{apt.patient}</span>
                              <span className={`slot-status badge bg-${
                                apt.status === 'confirmed' ? 'success' : 
                                apt.status === 'scheduled' ? 'warning' : 'secondary'
                              }`}>
                                {apt.status}
                              </span>
                            </div>
                          ))}
                        {appointments.filter(apt => new Date(apt.date).getDay() === (index + 1) % 7).length === 0 && (
                          <p className="text-muted small">No appointments</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
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
                  <img src="https://i.pravatar.cc/150?img=12" alt="Profile" className="profile-avatar" />
                  <div className="profile-info">
                    <h3>{user.name}</h3>
                    <p className="text-muted">{user.email}</p>
                    <p className="badge bg-success">Panchakarma Specialist</p>
                  </div>
                </div>
                <div className="profile-details">
                  <div className="detail-row">
                    <span className="detail-label">Specialization:</span>
                    <span className="detail-value">Panchakarma Therapy</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Experience:</span>
                    <span className="detail-value">15 years</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">License No:</span>
                    <span className="detail-value">AY12345678</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Phone:</span>
                    <span className="detail-value">+91 98765 43210</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Clinic Address:</span>
                    <span className="detail-value">Ayur Wellness Center, MG Road, Bangalore</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Toast Notification */}
      {toast.show && (
        <div className={`toast-notification ${toast.type}`}>
          <i className={`bi ${toast.type === 'success' ? 'bi-check-circle' : 'bi-info-circle'}`}></i>
          {toast.message}
        </div>
      )}

      {/* Patient Details Modal */}
      <Modal show={showPatientModal} onHide={() => setShowPatientModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Patient Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedPatient && (
            <div className="patient-details-modal">
              <div className="patient-profile-section">
                <img src={selectedPatient.avatar} alt={selectedPatient.name} className="patient-modal-avatar" />
                <div>
                  <h4>{selectedPatient.name}</h4>
                  <p className="text-muted">{selectedPatient.age} years • {selectedPatient.gender}</p>
                </div>
              </div>
              
              <div className="details-grid">
                <div className="detail-item">
                  <strong>Condition:</strong> {selectedPatient.condition}
                </div>
                <div className="detail-item">
                  <strong>Blood Group:</strong> {selectedPatient.bloodGroup}
                </div>
                <div className="detail-item">
                  <strong>Phone:</strong> {selectedPatient.phone}
                </div>
                <div className="detail-item">
                  <strong>Email:</strong> {selectedPatient.email}
                </div>
                <div className="detail-item">
                  <strong>Last Visit:</strong> {selectedPatient.lastVisit}
                </div>
                <div className="detail-item">
                  <strong>Address:</strong> {selectedPatient.address}
                </div>
              </div>

              <div className="medical-info mt-3">
                <h5>Medical History</h5>
                <p>{selectedPatient.medicalHistory?.join(', ') || 'None'}</p>
                
                <h5 className="mt-3">Allergies</h5>
                <p>{selectedPatient.allergies?.join(', ') || 'None'}</p>
                
                <h5 className="mt-3">Current Medications</h5>
                <p>{selectedPatient.currentMedications?.join(', ') || 'None'}</p>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPatientModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={() => {
            setShowPatientModal(false);
            handlePrescribe(selectedPatient);
          }}>
            Create Prescription
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Prescription Modal */}
      <Modal show={showPrescriptionModal} onHide={() => setShowPrescriptionModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Create Prescription - {selectedPatient?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSavePrescription}>
            <h5 className="mb-3">Medicines</h5>
            {prescriptionForm.medicines.map((medicine, index) => (
              <div key={index} className="medicine-row mb-3 p-3 border rounded">
                <div className="row g-2">
                  <div className="col-md-6">
                    <Form.Group>
                      <Form.Label>Medicine Name</Form.Label>
                      <Form.Control
                        type="text"
                        value={medicine.name}
                        onChange={(e) => updateMedicine(index, 'name', e.target.value)}
                        placeholder="e.g., Triphala Churna"
                        required
                      />
                    </Form.Group>
                  </div>
                  <div className="col-md-6">
                    <Form.Group>
                      <Form.Label>Dosage</Form.Label>
                      <Form.Control
                        type="text"
                        value={medicine.dosage}
                        onChange={(e) => updateMedicine(index, 'dosage', e.target.value)}
                        placeholder="e.g., 1 teaspoon"
                        required
                      />
                    </Form.Group>
                  </div>
                  <div className="col-md-6">
                    <Form.Group>
                      <Form.Label>Duration</Form.Label>
                      <Form.Control
                        type="text"
                        value={medicine.duration}
                        onChange={(e) => updateMedicine(index, 'duration', e.target.value)}
                        placeholder="e.g., 15 days"
                        required
                      />
                    </Form.Group>
                  </div>
                  <div className="col-md-6">
                    <Form.Group>
                      <Form.Label>Instructions</Form.Label>
                      <Form.Control
                        type="text"
                        value={medicine.instructions}
                        onChange={(e) => updateMedicine(index, 'instructions', e.target.value)}
                        placeholder="e.g., After meals"
                      />
                    </Form.Group>
                  </div>
                </div>
                {prescriptionForm.medicines.length > 1 && (
                  <Button 
                    variant="danger" 
                    size="sm" 
                    className="mt-2"
                    onClick={() => removeMedicineRow(index)}
                  >
                    <i className="bi bi-trash"></i> Remove
                  </Button>
                )}
              </div>
            ))}
            <Button variant="outline-primary" size="sm" className="mb-3" onClick={addMedicineRow}>
              <i className="bi bi-plus-lg"></i> Add Medicine
            </Button>

            <Form.Group className="mb-3">
              <Form.Label>Dietary Recommendations</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={prescriptionForm.diet}
                onChange={(e) => setPrescriptionForm({...prescriptionForm, diet: e.target.value})}
                placeholder="Diet recommendations..."
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Lifestyle Modifications</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={prescriptionForm.lifestyle}
                onChange={(e) => setPrescriptionForm({...prescriptionForm, lifestyle: e.target.value})}
                placeholder="Lifestyle advice..."
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Follow-up Date</Form.Label>
              <Form.Control
                type="date"
                value={prescriptionForm.followUp}
                onChange={(e) => setPrescriptionForm({...prescriptionForm, followUp: e.target.value})}
              />
            </Form.Group>

            <div className="d-flex gap-2 justify-content-end">
              <Button variant="secondary" onClick={() => setShowPrescriptionModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                <i className="bi bi-check-lg"></i> Save Prescription
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Appointment Modal */}
      <Modal show={showAppointmentModal} onHide={() => setShowAppointmentModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Schedule Appointment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleCreateAppointment}>
            <Form.Group className="mb-3">
              <Form.Label>Patient Name</Form.Label>
              <Form.Control
                type="text"
                value={appointmentForm.patientName}
                onChange={(e) => setAppointmentForm({...appointmentForm, patientName: e.target.value})}
                placeholder="Enter patient name"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                value={appointmentForm.date}
                onChange={(e) => setAppointmentForm({...appointmentForm, date: e.target.value})}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Time</Form.Label>
              <Form.Control
                type="time"
                value={appointmentForm.time}
                onChange={(e) => setAppointmentForm({...appointmentForm, time: e.target.value})}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Type</Form.Label>
              <Form.Select
                value={appointmentForm.type}
                onChange={(e) => setAppointmentForm({...appointmentForm, type: e.target.value})}
              >
                <option value="Consultation">Consultation</option>
                <option value="Follow-up">Follow-up</option>
                <option value="Therapy Session">Therapy Session</option>
                <option value="Check-up">Check-up</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Notes</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={appointmentForm.notes}
                onChange={(e) => setAppointmentForm({...appointmentForm, notes: e.target.value})}
                placeholder="Any additional notes..."
              />
            </Form.Group>

            <div className="d-flex gap-2 justify-content-end">
              <Button variant="secondary" onClick={() => setShowAppointmentModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                <i className="bi bi-calendar-plus"></i> Schedule
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Session Modal */}
      <Modal show={showSessionModal} onHide={() => setShowSessionModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create Therapy Session</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleCreateSession}>
            <Form.Group className="mb-3">
              <Form.Label>Patient</Form.Label>
              <Form.Select
                value={sessionForm.patientId}
                onChange={(e) => setSessionForm({...sessionForm, patientId: e.target.value})}
                required
              >
                <option value="">Select Patient</option>
                {patients.map(patient => (
                  <option key={patient.id} value={patient.id}>{patient.name}</option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Therapy Type</Form.Label>
              <Form.Select
                value={sessionForm.therapy}
                onChange={(e) => setSessionForm({...sessionForm, therapy: e.target.value})}
              >
                <option value="Vamana">Vamana (Emesis)</option>
                <option value="Virechana">Virechana (Purgation)</option>
                <option value="Basti">Basti (Enema)</option>
                <option value="Nasya">Nasya (Nasal)</option>
                <option value="Raktamokshana">Raktamokshana (Bloodletting)</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                value={sessionForm.date}
                onChange={(e) => setSessionForm({...sessionForm, date: e.target.value})}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Notes</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={sessionForm.notes}
                onChange={(e) => setSessionForm({...sessionForm, notes: e.target.value})}
                placeholder="Session notes and observations..."
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Initial Progress (%)</Form.Label>
              <Form.Control
                type="number"
                min="0"
                max="100"
                value={sessionForm.progress}
                onChange={(e) => setSessionForm({...sessionForm, progress: e.target.value})}
              />
            </Form.Group>

            <div className="d-flex gap-2 justify-content-end">
              <Button variant="secondary" onClick={() => setShowSessionModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                <i className="bi bi-plus-lg"></i> Create Session
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default DoctorDashboard;
