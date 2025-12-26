import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaBook, FaCalendarAlt, FaChartBar, FaChartLine, FaClock, FaCog, FaTimes, FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { useAcademic } from '../context/AcademicContext';
import logo from '../assets/logo.png';
import './Sidebar.css';

const Sidebar = ({ isOpen, onClose }) => {
    const { semesters, currentSemester, setCurrentSemester, addSemester, updateSemester, deleteSemester, deleteAllSemesters } = useAcademic();
    const location = useLocation();

    const [showSemesterModal, setShowSemesterModal] = React.useState(false);
    const [showSemesterManager, setShowSemesterManager] = React.useState(false);
    const [newSemesterName, setNewSemesterName] = React.useState('');
    const [editingSemester, setEditingSemester] = React.useState(null);
    const [tempSemesterName, setTempSemesterName] = React.useState('');

    const handleAddSemester = () => {
        if (newSemesterName.trim()) {
            addSemester(newSemesterName.trim());
            setCurrentSemester(newSemesterName.trim());
            setNewSemesterName('');
            setShowSemesterModal(false);
        }
    };

    const handleUpdateSemester = (oldName) => {
        if (tempSemesterName.trim() && tempSemesterName !== oldName) {
            updateSemester(oldName, tempSemesterName.trim());
            setEditingSemester(null);
            setTempSemesterName('');
        }
    };

    const handleDeleteSemester = (semesterName) => {
        if (window.confirm(`Delete ${semesterName} and all its courses?`)) {
            deleteSemester(semesterName);
        }
    };

    const isActive = (path) => location.pathname === path ? 'active' : '';

    return (
        <div className={`sidebar ${isOpen ? 'open' : ''}`}>
            <div className="sidebar-header">
                <div className="logo-container">
                    <img src={logo} alt="AcadBox Logo" className="sidebar-logo" />
                </div>
                <button className="sidebar-close" onClick={onClose}>
                    <FaTimes />
                </button>
            </div>

            <div className="semester-selector-container">
                <div className="semester-selector-header">
                    <label htmlFor="semester-select">Active Semester</label>
                    <button className="sidebar-manage-btn" onClick={() => setShowSemesterManager(true)}>
                        Manage
                    </button>
                </div>
                <select
                    id="semester-select"
                    className="sidebar-semester-select"
                    value={currentSemester}
                    onChange={(e) => setCurrentSemester(e.target.value)}
                >
                    {semesters.length > 0 ? (
                        semesters.map(sem => (
                            <option key={sem} value={sem}>{sem}</option>
                        ))
                    ) : (
                        <option value="">No Semesters</option>
                    )}
                </select>
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

            {showSemesterModal && (
                <div className="v5-modal-overlay" onClick={() => setShowSemesterModal(false)}>
                    <div className="v5-modal-content" onClick={(e) => e.stopPropagation()}>
                        <h3>Add New Semester</h3>
                        <div className="v5-form-group">
                            <label>Semester Name</label>
                            <input
                                type="text"
                                className="v5-input"
                                placeholder="e.g., Semester 3 2025"
                                value={newSemesterName}
                                onChange={(e) => setNewSemesterName(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleAddSemester()}
                                autoFocus
                            />
                        </div>
                        <div className="v5-modal-actions">
                            <button className="v5-btn-ghost" onClick={() => setShowSemesterModal(false)}>Cancel</button>
                            <button className="v5-btn-primary" onClick={handleAddSemester}>Add Semester</button>
                        </div>
                    </div>
                </div>
            )}

            {showSemesterManager && (
                <div className="v5-modal-overlay" onClick={() => setShowSemesterManager(false)}>
                    <div className="v5-modal-content v5-semester-manager" onClick={(e) => e.stopPropagation()}>
                        <div className="v5-modal-header">
                            <h3>Manage Semesters</h3>
                            <button className="v5-close-btn" onClick={() => setShowSemesterManager(false)}>&times;</button>
                        </div>
                        <div className="v5-semester-list">
                            {semesters.length > 0 ? (
                                semesters.map(sem => (
                                    <div key={sem} className="v5-semester-item">
                                        {editingSemester === sem ? (
                                            <div className="v5-edit-semester-row">
                                                <input
                                                    type="text"
                                                    className="v5-input"
                                                    value={tempSemesterName}
                                                    onChange={(e) => setTempSemesterName(e.target.value)}
                                                    autoFocus
                                                />
                                                <button className="v5-btn-primary v5-btn-sm" onClick={() => handleUpdateSemester(sem)}>Save</button>
                                                <button className="v5-btn-ghost v5-btn-sm" onClick={() => setEditingSemester(null)}>Cancel</button>
                                            </div>
                                        ) : (
                                            <>
                                                <span className="v5-semester-name">{sem}</span>
                                                <div className="v5-semester-actions">
                                                    <button className="v5-action-btn" onClick={() => {
                                                        setEditingSemester(sem);
                                                        setTempSemesterName(sem);
                                                    }} title="Rename">
                                                        <FaEdit />
                                                    </button>
                                                    <button className="v5-action-btn delete" onClick={() => handleDeleteSemester(sem)} title="Delete">
                                                        <FaTrash />
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <div className="v5-empty-modal-state">
                                    <p>Please add your first semester or session to get started.</p>
                                </div>
                            )}
                        </div>
                        <div className="v5-modal-footer">
                            <button className="v5-btn-secondary" onClick={() => {
                                setShowSemesterManager(false);
                                setShowSemesterModal(true);
                            }}>+ Add Semester</button>
                            <button className="v5-btn-primary" onClick={() => setShowSemesterManager(false)}>Done</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Sidebar;
