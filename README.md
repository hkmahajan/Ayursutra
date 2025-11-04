# 🌿 AyurSutra - Ayurvedic Healthcare Management System

A modern, comprehensive React application for Ayurvedic healthcare management featuring separate patient and doctor portals with full CRUD operations, interactive modals, and responsive design.

## ✨ Key Highlights

- 🏥 **Complete Healthcare Management**: End-to-end patient care workflow
- 📱 **Fully Responsive**: Works seamlessly on all devices
- 🔐 **Secure Authentication**: Role-based access control
- 💾 **Persistent Data**: LocalStorage-based data management
- 🎨 **Modern UI**: Beautiful gradients and smooth animations
- ⚡ **Fast Performance**: Optimized React components

## 🎯 Features

### Landing Page
- Hero section with call-to-action buttons
- Feature highlights with gradient cards
- 5 Panchakarma therapies overview
- Statistics section
- Fully responsive design

### Authentication
- **Role-based login** (Patient/Doctor)
- Interactive role slider with smooth animations
- Password visibility toggle
- Secure session management
- Remember me functionality
- Auto-redirect to appropriate dashboard

### Patient Dashboard (5 Tabs)
- **Find Doctors**: 
  - Search and filter functionality
  - Doctor cards with specialization, experience, ratings
  - Book appointment button
- **My Appointments**: 
  - View all appointments with status badges
  - Reschedule and cancel functionality
  - Video call integration
- **Therapy Sessions**: 
  - Track Panchakarma treatments
  - Visual progress bars
  - Session details and notes
- **Health Records**: 
  - Vital signs display (BP, HR, Weight)
  - Medical history
  - Current medications
  - Upload records functionality
- **My Profile**: 
  - Personal information management
  - Profile picture upload
  - Edit functionality

### Doctor Dashboard (6 Tabs with Full CRUD)
- **Dashboard Overview**: 
  - Statistics cards (Patients, Appointments, Sessions, Reviews)
  - Recent activity feed
  - Today's schedule
  
- **Patients Management**: 
  - Patient cards with search functionality
  - **View Details**: Modal with medical history, allergies, medications
  - **Prescribe**: Create prescriptions with dynamic medicine rows
  - Full patient information display
  
- **Appointments**: 
  - **Create**: Modal form for new appointments
  - **Read**: Display all appointments with filters
  - **Update**: Confirm/Complete appointment status
  - **Delete**: Remove appointments
  - Filter by status (All/Scheduled/Confirmed/Completed/Cancelled)
  - Search by patient name or type
  - Toast notifications on success
  
- **Therapy Sessions**: 
  - **Create**: New session modal with therapy type selection
  - **Read**: Display all sessions with progress
  - **Update**: Progress increment functionality
  - Session notes and tracking
  - 5 Panchakarma therapy options
  - Toast notifications
  
- **My Schedule**: 
  - Weekly calendar view (7 days)
  - Day-wise appointment display
  - Color-coded status badges
  - Empty state handling
  - Responsive grid layout
  
- **Profile**: 
  - Professional information
  - Specialization badge
  - License number
  - Clinic details
  - Edit functionality

### Interactive Modals (4 Complete Forms)
1. **Patient Details Modal**: View medical history, allergies, medications
2. **Prescription Modal**: Dynamic medicine rows, diet, lifestyle recommendations
3. **Appointment Modal**: Patient selection, date/time, type, notes
4. **Session Modal**: Therapy selection, progress tracking, notes

### Advanced Features
- **Real-time Search**: Patient and appointment filtering
- **Status Filters**: Dropdown filters for appointments
- **Toast Notifications**: Success/error feedback
- **Progress Tracking**: Visual bars for therapy progress
- **Data Persistence**: LocalStorage integration
- **Responsive Design**: Mobile-first approach
- **Empty States**: Helpful messages when no data
- **Loading States**: Smooth transitions

## 🛠 Technology Stack

- **React** 18.x with Hooks (useState, useEffect)
- **React Router DOM** 6.x for navigation
- **Bootstrap** 5.x for UI framework
- **React-Bootstrap** for React components
- **Bootstrap Icons** for iconography
- **Google Fonts** (Inter) for typography
- **LocalStorage API** for data persistence
- **CSS3** with CSS Variables for theming

## 🔑 Demo Credentials

### Patient Login
- **Email**: `pat@ayur.com`
- **Password**: `password`

### Doctor Login
- **Email**: `doc@ayur.com`
- **Password**: `password`

## Installation

1. Navigate to the project directory:
```bash
cd ayursutra-react
```

2. Install dependencies (if not already done):
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
ayursutra-react/
├── public/
│   └── index.html
├── src/
│   ├── pages/
│   │   ├── LandingPage.js
│   │   ├── LandingPage.css
│   │   ├── LoginPage.js
│   │   ├── LoginPage.css
│   │   ├── PatientDashboard.js
│   │   ├── PatientDashboard.css
│   │   ├── DoctorDashboard.js
│   │   └── DoctorDashboard.css
│   ├── utils/
│   │   └── auth.js
│   ├── App.js
│   ├── App.css
│   └── index.js
└── package.json
```

## Key Features Implemented

✅ Responsive design for all screen sizes
✅ Role-based authentication and routing
✅ Protected routes with session management
✅ Interactive UI with smooth transitions
✅ Search and filter functionality
✅ Mock data for demonstration
✅ LocalStorage data persistence
✅ Clean and modern UI/UX
✅ All navigation working properly
✅ Dynamic content rendering
✅ Progress tracking for therapies
✅ Appointment management
✅ Patient records management

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
