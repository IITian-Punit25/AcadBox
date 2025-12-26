import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import { useAcademic } from './context/AcademicContext';
import Dashboard from './pages/Dashboard';
import Courses from './pages/Courses';
import SmartSchedule from './pages/SmartSchedule';
import FocusMode from './pages/FocusMode';
import Grades from './pages/Grades';
import Attendance from './pages/Attendance';
import Settings from './pages/Settings';
import { FaBars } from 'react-icons/fa';
import logo from './assets/logo.png';
import './App.css';

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
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/schedule" element={<SmartSchedule />} />
              <Route path="/attendance" element={<Attendance />} />
              <Route path="/grades" element={<Grades />} />
              <Route path="/focus" element={<FocusMode />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
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
