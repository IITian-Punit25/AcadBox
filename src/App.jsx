import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import { useAcademic } from './context/AcademicContext';
import { FaBars } from 'react-icons/fa';
import logo from './assets/logo.png';
import './App.css';

// Lazy load pages
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Courses = React.lazy(() => import('./pages/Courses'));
const SmartSchedule = React.lazy(() => import('./pages/SmartSchedule'));
const FocusMode = React.lazy(() => import('./pages/FocusMode'));
const Grades = React.lazy(() => import('./pages/Grades'));
const Attendance = React.lazy(() => import('./pages/Attendance'));
const Settings = React.lazy(() => import('./pages/Settings'));

// Loading Component
const PageLoader = () => (
  <div className="page-loader">
    <div className="loader-spinner"></div>
    <p>Loading...</p>
  </div>
);

function App() {
  const { semesters } = useAcademic();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <Router>
      <div className="app-container">
        <header className="mobile-header">
          <div className="mobile-logo">
            <img src={logo} alt="AcadBox Logo" className="header-logo" />
          </div>
          <button className="mobile-toggle" onClick={toggleMobileMenu}>
            <FaBars />
          </button>
        </header>

        <Sidebar isOpen={mobileMenuOpen} onClose={closeMobileMenu} />

        {mobileMenuOpen && <div className="sidebar-overlay" onClick={closeMobileMenu}></div>}

        <main className="main-content">
          {semesters.length > 0 ? (
            <React.Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/courses" element={<Courses />} />
                <Route path="/schedule" element={<SmartSchedule />} />
                <Route path="/attendance" element={<Attendance />} />
                <Route path="/grades" element={<Grades />} />
                <Route path="/focus" element={<FocusMode />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </React.Suspense>
          ) : (
            <div className="empty-state-container">
              <div className="empty-state-card">
                <h2>Welcome to AcadBox!</h2>
                <p>To get started, please add your first semester or session from the sidebar.</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </Router>
  );
}

export default App;
