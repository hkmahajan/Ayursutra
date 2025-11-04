# 🚀 Quick Start Guide - AyurSutra React

## Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)

## Installation & Setup

### 1. Navigate to Project Directory
```bash
cd "c:\Users\hkmah\OneDrive\Desktop\Major Project\MP3\ayursutra-react"
```

### 2. Install Dependencies (if not already done)
```bash
npm install
```

### 3. Start Development Server
```bash
npm start
```

The application will open automatically at **http://localhost:3000**

## 🎭 Test Accounts

### Patient Account
- **Email**: `pat@ayur.com`
- **Password**: `password`

### Doctor Account
- **Email**: `doc@ayur.com`
- **Password**: `password`

## 📋 Quick Test Checklist

### Landing Page (/)
- [✅] Hero section loads
- [✅] Features section displays 3 cards
- [✅] Therapies section shows 5 Panchakarma therapies
- [✅] "Login" button navigates to /login
- [✅] "Book Consultation" button navigates to /login

### Login Page (/login)
- [✅] Role slider works (Patient <-> Doctor)
- [✅] Login with patient credentials redirects to /patient
- [✅] Login with doctor credentials redirects to /doctor
- [✅] Invalid credentials show error
- [✅] Password visibility toggle works

### Patient Dashboard (/patient)
- [✅] **Find Doctors tab**: 
  - Search doctors works
  - Doctor cards display correctly
  - Book appointment button visible
- [✅] **My Appointments tab**:
  - Appointments list displays
  - Status badges show correctly
  - Reschedule/Cancel buttons work
- [✅] **Therapy Sessions tab**:
  - Sessions list displays
  - Progress bars show percentages
- [✅] **Health Records tab**:
  - Vitals display correctly
  - Medical history visible
- [✅] **Profile tab**:
  - Personal information displays
  - Edit button visible

### Doctor Dashboard (/doctor)
- [✅] **Overview tab**:
  - 4 stat cards display (Patients, Appointments, Sessions, Reviews)
  - Recent activity feed shows
  - Today's schedule displays
- [✅] **Patients tab**:
  - Patient cards display
  - Search functionality works
  - "View Details" button opens modal with patient info
  - "Prescribe" button opens prescription modal
- [✅] **Appointments tab**:
  - Filter by status works (All/Scheduled/Confirmed/Completed/Cancelled)
  - Search appointments works
  - "New Appointment" button opens modal
  - Appointment form saves successfully
  - Confirm/Complete/Delete buttons work
  - Toast notification appears on success
- [✅] **Therapy Sessions tab**:
  - Session cards display
  - Progress bars show correctly
  - "New Session" button opens modal
  - Session form saves successfully
  - "Update Progress" button works
  - Toast notification appears
- [✅] **Schedule tab**:
  - Weekly view displays 7 days
  - Appointments show on correct days
  - Time slots display correctly
  - Status badges color-coded
- [✅] **Profile tab**:
  - Doctor information displays
  - Specialization badge shows
  - Professional details visible

## 🧪 Testing Modal Functionality

### Test Patient Details Modal
1. Go to Doctor Dashboard -> Patients tab
2. Click "View Details" on any patient
3. Verify: Medical history, allergies, medications display
4. Click X or "Close" to dismiss

### Test Prescription Modal
1. Go to Doctor Dashboard -> Patients tab
2. Click "Prescribe" on any patient
3. Click "Add Medicine" button
4. Fill in medicine details
5. Add diet and lifestyle recommendations
6. Click "Save Prescription"
7. Verify: Toast notification appears
8. Check: Prescription saved to patient record

### Test Appointment Modal
1. Go to Doctor Dashboard -> Appointments tab
2. Click "New Appointment" button
3. Select a patient from dropdown
4. Choose date and time
5. Select appointment type
6. Add notes
7. Click "Create Appointment"
8. Verify: New appointment appears in list
9. Verify: Toast notification shows success

### Test Session Modal
1. Go to Doctor Dashboard -> Therapy Sessions tab
2. Click "New Session" button
3. Select a patient
4. Choose therapy type (Vamana, Virechana, etc.)
5. Set date and initial progress
6. Add session notes
7. Click "Create Session"
8. Verify: New session appears in list
9. Verify: Progress bar displays correctly

## 🔍 Testing Search & Filter

### Test Patient Search
1. Go to Doctor Dashboard -> Patients tab
2. Type patient name in search box
3. Verify: Cards filter in real-time

### Test Appointment Filter
1. Go to Doctor Dashboard -> Appointments tab
2. Select "Confirmed" from status dropdown
3. Verify: Only confirmed appointments show
4. Try other statuses

### Test Appointment Search
1. Type patient name in search box
2. Verify: Results filter correctly

## 📱 Testing Responsive Design

### Desktop (1200px+)
- All cards in grid layouts
- Sidebar fully visible
- Full menu navigation

### Tablet (768px-992px)
- Schedule shows 3 columns
- Cards adjust to 2 columns
- Navigation intact

### Mobile (< 768px)
- Schedule shows 2 columns
- Cards stack to 1 column
- Touch-friendly buttons
- Hamburger menu (if implemented)

### Small Mobile (< 576px)
- Schedule shows 1 column
- All content stacks vertically
- Forms adjust to full width

## ⚡ Performance Checks

### Load Time
- Initial page load: < 2 seconds
- Route changes: Instant
- Modal open/close: Smooth

### Memory
- No memory leaks
- LocalStorage updates properly
- State management efficient

## 🐛 Common Issues & Solutions

### Issue: Port 3000 already in use
**Solution**: 
```bash
# Kill process on port 3000
# Windows PowerShell:
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process
```

### Issue: Module not found
**Solution**:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue: Changes not reflecting
**Solution**:
```bash
# Clear cache and restart
Ctrl + C  # Stop server
npm start
```

### Issue: LocalStorage not persisting
**Solution**:
- Check browser settings
- Clear browser cache
- Try incognito mode
- Check browser console for errors

## 🎯 Feature Testing Scenarios

### Scenario 1: Book Appointment Flow
1. Login as doctor (doc@ayur.com)
2. Go to Appointments tab
3. Click "New Appointment"
4. Fill form completely
5. Submit
6. Verify appointment in list
7. Logout
8. Login as patient (pat@ayur.com)
9. Go to My Appointments
10. Verify new appointment shows

### Scenario 2: Therapy Session Management
1. Login as doctor
2. Go to Therapy Sessions
3. Create new session
4. Click "Update Progress"
5. Verify progress increments
6. Check visual progress bar updates

### Scenario 3: Prescription Creation
1. Login as doctor
2. Go to Patients tab
3. Click "Prescribe" on a patient
4. Add 3 medicines
5. Remove 1 medicine
6. Add diet and lifestyle notes
7. Save prescription
8. Click "View Details" on same patient
9. Verify prescription appears in history

## 📊 Data Verification

### Check LocalStorage Data
Open Browser Console (F12):
```javascript
// View all data
console.log(localStorage);

// View specific data
console.log(JSON.parse(localStorage.getItem('ayursutra_appointments')));
console.log(JSON.parse(localStorage.getItem('ayursutra_sessions')));
console.log(JSON.parse(localStorage.getItem('ayursutra_users')));

// Clear all data (if needed)
localStorage.clear();
```

## 🔒 Security Testing

### Test Session Management
1. Login successfully
2. Open new tab
3. Navigate to dashboard URL directly
4. Verify: Should be logged in
5. Logout in first tab
6. Refresh second tab
7. Verify: Should redirect to login

### Test Protected Routes
1. Without logging in, navigate to:
   - http://localhost:3000/patient
   - http://localhost:3000/doctor
2. Verify: Redirects to login page

## 📝 ESLint Warnings (Non-blocking)

The application compiles successfully with these warnings:
- `anchor-is-valid`: Cosmetic, doesn't affect functionality
- `react-hooks/exhaustive-deps`: Optimization opportunity
- `no-unused-vars`: Can be cleaned in production

To suppress warnings:
```bash
# Create .env.local file
ESLINT_NO_DEV_ERRORS=true
```

## 🎉 Success Criteria

Application is working correctly if:
- ✅ All 4 pages load without errors
- ✅ Login redirects to correct dashboard
- ✅ All tabs switch properly
- ✅ All 4 modals open and close
- ✅ Forms submit successfully
- ✅ Search and filters work
- ✅ Toast notifications appear
- ✅ Data persists in LocalStorage
- ✅ Responsive on mobile devices
- ✅ No console errors (only warnings)

## 🛠 Development Commands

```bash
# Start development server
npm start

# Build for production
npm run build

# Run tests (if configured)
npm test

# Eject configuration (not recommended)
npm run eject
```

## 📞 Support

If you encounter issues:
1. Check browser console for errors (F12)
2. Verify Node.js and npm versions
3. Clear browser cache and LocalStorage
4. Reinstall node_modules
5. Check FEATURES.md for detailed documentation

---

**Happy Testing! 🎊**

The application is fully functional and ready for demonstration.
