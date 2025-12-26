import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AcademicProvider } from './context/AcademicContext';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Courses from './pages/Courses';
import SmartSchedule from './pages/SmartSchedule';
import FocusMode from './pages/FocusMode';
import Grades from './pages/Grades';
import Settings from './pages/Settings';
import { FaBars } from 'react-icons/fa';
import './App.css';

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <AcademicProvider>
      <Router>
        <div className="app-container">
          <header className="mobile-header">
            <div className="mobile-logo">
              Acad<span className="text-blue">Box</span>
            </div>
            <button className="mobile-toggle" onClick={toggleMobileMenu}>
              <FaBars />
            </button>
          </header>

          <Sidebar isOpen={mobileMenuOpen} onClose={closeMobileMenu} />

          {mobileMenuOpen && <div className="sidebar-overlay" onClick={closeMobileMenu}></div>}

          <main className="main-content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/schedule" element={<SmartSchedule />} />
              <Route path="/grades" element={<Grades />} />
              <Route path="/focus" element={<FocusMode />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AcademicProvider>
  );
}

export default App;
