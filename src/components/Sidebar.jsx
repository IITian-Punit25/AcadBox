import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaBook, FaCalendarAlt, FaChartBar, FaChartLine, FaClock, FaCog, FaTimes } from 'react-icons/fa';
import './Sidebar.css';

const Sidebar = ({ isOpen, onClose }) => {
    const location = useLocation();

    const isActive = (path) => location.pathname === path ? 'active' : '';

    return (
        <div className={`sidebar ${isOpen ? 'open' : ''}`}>
            <div className="sidebar-header">
                <div className="logo-container">
                    <h2>Acad<span className="text-blue">Box</span></h2>
                </div>
                <button className="sidebar-close" onClick={onClose}>
                    <FaTimes />
                </button>
            </div>

            <div className="nav-menu">
                <Link to="/" className={`nav-item ${isActive('/')}`} onClick={onClose}>
                    <FaHome /> <span>Dashboard</span>
                </Link>
                <Link to="/courses" className={`nav-item ${isActive('/courses')}`} onClick={onClose}>
                    <FaBook /> <span>Courses</span>
                </Link>
                <Link to="/schedule" className={`nav-item ${isActive('/schedule')}`} onClick={onClose}>
                    <FaCalendarAlt /> <span>Smart Schedule</span>
                </Link>
                <Link to="/attendance" className={`nav-item ${isActive('/attendance')}`} onClick={onClose}>
                    <FaChartLine /> <span>Attendance</span>
                </Link>
                <Link to="/grades" className={`nav-item ${isActive('/grades')}`} onClick={onClose}>
                    <FaChartBar /> <span>Grades</span>
                </Link>
                <Link to="/focus" className={`nav-item ${isActive('/focus')}`} onClick={onClose}>
                    <FaClock /> <span>Focus Mode</span>
                </Link>
            </div>

            <div className="nav-footer">
                <Link to="/settings" className="nav-item" onClick={onClose}>
                    <FaCog /> <span>Settings</span>
                </Link>
            </div>
        </div>
    );
};

export default Sidebar;
