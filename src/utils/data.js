// Mock data for doctors
export const mockDoctors = [
  {
    id: 'doc1',
    name: 'Dr. Rajesh Sharma',
    specialty: 'Panchakarma Specialist',
    experience: '15 years',
    rating: 4.8,
    distance: '2.5 km',
    fees: '₹800',
    available: true,
    avatar: 'https://i.pravatar.cc/150?img=12',
    address: 'Ayur Wellness Center, MG Road',
    phone: '+91 98765 43210',
    education: 'BAMS, MD (Ayurveda)',
    languages: ['English', 'Hindi', 'Kannada'],
    about: 'Experienced Panchakarma specialist with focus on traditional Ayurvedic treatments.'
  },
  {
    id: 'doc2',
    name: 'Dr. Priya Menon',
    specialty: 'Ayurvedic Physician',
    experience: '12 years',
    rating: 4.9,
    distance: '3.2 km',
    fees: '₹1000',
    available: true,
    avatar: 'https://i.pravatar.cc/150?img=32',
    address: 'Natural Healing Clinic, Indiranagar',
    phone: '+91 98765 43211',
    education: 'BAMS, MD (Ayurveda)',
    languages: ['English', 'Hindi', 'Malayalam'],
    about: 'Specialist in holistic wellness and herbal medicine.'
  },
  {
    id: 'doc3',
    name: 'Dr. Arun Kumar',
    specialty: 'Vaidya & Herbalist',
    experience: '20 years',
    rating: 4.7,
    distance: '4.1 km',
    fees: '₹900',
    available: false,
    avatar: 'https://i.pravatar.cc/150?img=51',
    address: 'Traditional Ayurveda Center, Koramangala',
    phone: '+91 98765 43212',
    education: 'BAMS, MD (Ayurveda)',
    languages: ['English', 'Hindi', 'Tamil'],
    about: 'Expert in traditional Ayurvedic treatments and herbal formulations.'
  }
];

// Mock data for patients
export const mockPatients = [
  {
    id: 'pat1',
    name: 'Ravi Kumar',
    age: 35,
    gender: 'Male',
    condition: 'Digestive Issues',
    lastVisit: '2024-01-15',
    avatar: 'https://i.pravatar.cc/150?img=8',
    bloodGroup: 'O+',
    phone: '+91 98765 43210',
    email: 'ravi@example.com',
    address: '123, MG Road, Bangalore'
  },
  {
    id: 'pat2',
    name: 'Priya Sharma',
    age: 28,
    gender: 'Female',
    condition: 'Stress & Anxiety',
    lastVisit: '2024-01-18',
    avatar: 'https://i.pravatar.cc/150?img=45',
    bloodGroup: 'A+',
    phone: '+91 98765 43211',
    email: 'priya@example.com',
    address: '456, Indiranagar, Bangalore'
  },
  {
    id: 'pat3',
    name: 'Amit Patel',
    age: 42,
    gender: 'Male',
    condition: 'Joint Pain',
    lastVisit: '2024-01-20',
    avatar: 'https://i.pravatar.cc/150?img=33',
    bloodGroup: 'B+',
    phone: '+91 98765 43212',
    email: 'amit@example.com',
    address: '789, Koramangala, Bangalore'
  }
];

// Therapy types
export const therapyTypes = [
  {
    id: 'vamana',
    name: 'Vamana',
    description: 'Therapeutic vomiting to eliminate excess Kapha dosha',
    icon: 'bi-droplet',
    duration: '7-14 days'
  },
  {
    id: 'virechana',
    name: 'Virechana',
    description: 'Cleansing therapy to remove excess Pitta dosha',
    icon: 'bi-wind',
    duration: '5-10 days'
  },
  {
    id: 'basti',
    name: 'Basti',
    description: 'Medicated enema therapy for Vata dosha balance',
    icon: 'bi-moisture',
    duration: '8-16 days'
  },
  {
    id: 'nasya',
    name: 'Nasya',
    description: 'Administration of herbal oils through nasal passages',
    icon: 'bi-flower3',
    duration: '3-7 days'
  },
  {
    id: 'raktamokshana',
    name: 'Raktamokshana',
    description: 'Blood purification therapy',
    icon: 'bi-heart-pulse',
    duration: '1-3 days'
  }
];

// Sample health tips
export const healthTips = [
  'Drink warm water throughout the day to aid digestion',
  'Practice yoga and meditation daily for 20 minutes',
  'Follow a regular sleep schedule - sleep by 10 PM',
  'Eat according to your dosha type',
  'Include seasonal fruits and vegetables in your diet',
  'Practice mindful eating - avoid distractions during meals',
  'Walk for at least 30 minutes daily after meals'
];

// Appointment status types
export const appointmentStatuses = {
  SCHEDULED: 'scheduled',
  CONFIRMED: 'confirmed',
  IN_PROGRESS: 'in-progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  RESCHEDULED: 'rescheduled'
};

// Format date helper
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

// Format time helper
export const formatTime = (timeString) => {
  return timeString; // Can be enhanced with time parsing
};

// Get status badge class
export const getStatusClass = (status) => {
  const statusClasses = {
    scheduled: 'bg-info',
    confirmed: 'bg-primary',
    'in-progress': 'bg-warning',
    completed: 'bg-success',
    cancelled: 'bg-danger',
    rescheduled: 'bg-secondary'
  };
  return statusClasses[status] || 'bg-secondary';
};
