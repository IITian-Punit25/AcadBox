import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaBook, FaCalendarAlt, FaChartBar, FaClock, FaCog } from 'react-icons/fa';
import './Sidebar.css';

const Sidebar = () => {
    const location = useLocation();

    const isActive = (path) => location.pathname === path ? 'active' : '';

    return (
        <div className="sidebar">
            <div className="logo-container">
                <h2>Acad<span className="text-blue">Box</span></h2>
            </div>

            <div className="nav-menu">
                <Link to="/" className={`nav-item ${isActive('/')}`}>
                    <FaHome /> <span>Dashboard</span>
                </Link>
                <Link to="/courses" className={`nav-item ${isActive('/courses')}`}>
                    <FaBook /> <span>Courses</span>
                </Link>
                <Link to="/schedule" className={`nav-item ${isActive('/schedule')}`}>
                    <FaCalendarAlt /> <span>Smart Schedule</span>
                </Link>
                <Link to="/grades" className={`nav-item ${isActive('/grades')}`}>
                    <FaChartBar /> <span>Grades</span>
                </Link>
                <Link to="/focus" className={`nav-item ${isActive('/focus')}`}>
                    <FaClock /> <span>Focus Mode</span>
                </Link>
            </div>

            <div className="nav-footer">
                <Link to="/settings" className="nav-item">
                    <FaCog /> <span>Settings</span>
                </Link>
            </div>
        </div>
    );
};

export default Sidebar;
