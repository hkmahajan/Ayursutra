// Authentication and data management utilities

// Initialize demo data
export const seedData = () => {
  if (!localStorage.getItem('ayursutra_users')) {
    const users = [
      { id: 'doc1', role: 'doctor', email: 'doc@ayur.com', password: 'doc123', name: 'Dr. Sharma' },
      { id: 'pat1', role: 'patient', email: 'pat@ayur.com', password: 'pat123', name: 'Ravi Kumar' }
    ];
    localStorage.setItem('ayursutra_users', JSON.stringify(users));
  }

  if (!localStorage.getItem('ayursutra_sessions')) {
    const sessions = [
      {
        id: 1,
        patientId: 'pat1',
        therapy: 'Vamana',
        date: futureDate(1),
        notes: 'Morning session - fasting',
        progress: 20
      }
    ];
    localStorage.setItem('ayursutra_sessions', JSON.stringify(sessions));
  }

  if (!localStorage.getItem('ayursutra_feedback')) {
    localStorage.setItem('ayursutra_feedback', JSON.stringify([]));
  }

  if (!localStorage.getItem('ayursutra_appointments')) {
    const appointments = [
      {
        id: 1,
        patientId: 'pat1',
        doctorId: 'doc1',
        date: futureDate(2),
        time: '10:00 AM',
        status: 'scheduled',
        type: 'Consultation'
      }
    ];
    localStorage.setItem('ayursutra_appointments', JSON.stringify(appointments));
  }
};

// Storage helpers
export const getUsers = () => JSON.parse(localStorage.getItem('ayursutra_users') || '[]');
export const getSessions = () => JSON.parse(localStorage.getItem('ayursutra_sessions') || '[]');
export const getFeedback = () => JSON.parse(localStorage.getItem('ayursutra_feedback') || '[]');
export const getAppointments = () => JSON.parse(localStorage.getItem('ayursutra_appointments') || '[]');

export const saveSessions = (sessions) => localStorage.setItem('ayursutra_sessions', JSON.stringify(sessions));
export const saveFeedback = (feedback) => localStorage.setItem('ayursutra_feedback', JSON.stringify(feedback));
export const saveAppointments = (appointments) => localStorage.setItem('ayursutra_appointments', JSON.stringify(appointments));

export const futureDate = (days) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
};

// Auth helpers
export const authUser = (email, password) => {
  const users = getUsers();
  const user = users.find(u => u.email === email && u.password === password);
  return user || null;
};

export const getSession = () => {
  return JSON.parse(localStorage.getItem('ayursutra_session') || 'null');
};

export const setSession = (user) => {
  localStorage.setItem('ayursutra_session', JSON.stringify(user));
};

export const clearSession = () => {
  localStorage.removeItem('ayursutra_session');
};

export const requireAuth = (roles = null) => {
  const session = getSession();
  if (!session) {
    return null;
  }
  if (roles && !roles.includes(session.role)) {
    return null;
  }
  return session;
};

// Initialize data on load
seedData();
