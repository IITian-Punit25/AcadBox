import React, { useState } from 'react';
import { useAcademic } from '../context/AcademicContext';
import { FaCheckCircle, FaExclamationTriangle, FaTimesCircle, FaChartLine, FaPlus, FaMinus, FaInfoCircle } from 'react-icons/fa';
import './Attendance.css';

const Attendance = () => {
    const { courses, semesters, currentSemester, setCurrentSemester, getSemesterCourses, attendance, updateAttendance, getAttendanceStatus, getAttendanceInsights } = useAcademic();
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [tempAttendance, setTempAttendance] = useState({ attended: 0, total: 0 });

    const semesterCourses = getSemesterCourses(currentSemester);

    const handleOpenUpdate = (course) => {
        const record = attendance.find(a => a.courseId === course.id) || { attended: 0, total: 0 };
        setSelectedCourse(course);
        setTempAttendance({ attended: record.attended, total: record.total });
        setShowUpdateModal(true);
    };

    const handleSaveAttendance = () => {
        updateAttendance(selectedCourse.id, tempAttendance.attended, tempAttendance.total);
        setShowUpdateModal(false);
    };

    return (
        <div className="attendance-page-v5">
            <header className="v5-header">
                <div className="v5-header-content">
                    <h1>Attendance Risk Monitor</h1>
                    <p className="v5-subtitle">Monitor class presence and predictive risk levels</p>
                </div>
                <div className="v5-header-actions">
                    <span className="v5-semester-badge">{currentSemester}</span>
                </div>
            </header>

            <div className="v5-attendance-grid">
                {semesterCourses.length === 0 ? (
                    <div className="v5-empty-state">
                        <FaChartLine className="v5-empty-icon" />
                        <p>No courses found for this semester.</p>
                    </div>
                ) : (
                    semesterCourses.map(course => {
                        const status = getAttendanceStatus(course.id);
                        const record = attendance.find(a => a.courseId === course.id) || { attended: 0, total: 0 };
                        const insights = getAttendanceInsights(course.id);

                        return (
                            <div key={course.id} className="v5-attendance-card" style={{ '--course-color': course.color }}>
                                <div className="v5-card-header">
                                    <div className="v5-course-info">
                                        <h3>{course.name}</h3>
                                        <span className="v5-status-tag" style={{ backgroundColor: `${status.color}20`, color: status.color }}>
                                            {status.label === 'Safe' && <FaCheckCircle />}
                                            {status.label === 'At Risk' && <FaExclamationTriangle />}
                                            {status.label === 'Critical' && <FaTimesCircle />}
                                            {status.label}
                                        </span>
                                    </div>
                                    <div className="v5-percentage-display">
                                        <span className="v5-percentage-value" style={{ color: status.color }}>
                                            {Math.round(status.percentage)}%
                                        </span>
                                    </div>
                                </div>

                                <div className="v5-stats-row">
                                    <div className="v5-stat-item">
                                        <span className="v5-stat-label">Attended</span>
                                        <span className="v5-stat-value">{record.attended}</span>
                                    </div>
                                    <div className="v5-stat-item">
                                        <span className="v5-stat-label">Total Classes</span>
                                        <span className="v5-stat-value">{record.total}</span>
                                    </div>
                                </div>

                                <div className="v5-progress-bar-bg">
                                    <div
                                        className="v5-progress-bar-fill"
                                        style={{ width: `${status.percentage}%`, backgroundColor: status.color }}
                                    ></div>
                                </div>

                                {insights && insights.length > 0 && (
                                    <div className="v5-insights-section">
                                        <div className="v5-insight-header">
                                            <FaInfoCircle /> <span>AI Insights</span>
                                        </div>
                                        <ul className="v5-insight-list">
                                            {insights.map((insight, idx) => (
                                                <li key={idx}>{insight}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                <button className="v5-update-btn" onClick={() => handleOpenUpdate(course)}>
                                    Update Attendance
                                </button>
                            </div>
                        );
                    })
                )}
            </div>

            {showUpdateModal && (
                <div className="v5-modal-overlay" onClick={() => setShowUpdateModal(false)}>
                    <div className="v5-modal-content" onClick={e => e.stopPropagation()}>
                        <div className="v5-modal-header">
                            <h3>Update Attendance</h3>
                            <p>{selectedCourse?.name}</p>
                        </div>
                        <div className="v5-modal-body">
                            <div className="v5-counter-group">
                                <label>Classes Attended</label>
                                <div className="v5-counter">
                                    <button onClick={() => setTempAttendance(prev => ({ ...prev, attended: Math.max(0, prev.attended - 1) }))}>
                                        <FaMinus />
                                    </button>
                                    <input
                                        type="number"
                                        value={tempAttendance.attended}
                                        onChange={e => setTempAttendance({ ...tempAttendance, attended: parseInt(e.target.value) || 0 })}
                                    />
                                    <button onClick={() => setTempAttendance(prev => ({ ...prev, attended: prev.attended + 1 }))}>
                                        <FaPlus />
                                    </button>
                                </div>
                            </div>
                            <div className="v5-counter-group">
                                <label>Total Classes</label>
                                <div className="v5-counter">
                                    <button onClick={() => setTempAttendance(prev => ({ ...prev, total: Math.max(prev.attended, prev.total - 1) }))}>
                                        <FaMinus />
                                    </button>
                                    <input
                                        type="number"
                                        value={tempAttendance.total}
                                        onChange={e => setTempAttendance({ ...tempAttendance, total: parseInt(e.target.value) || 0 })}
                                    />
                                    <button onClick={() => setTempAttendance(prev => ({ ...prev, total: prev.total + 1 }))}>
                                        <FaPlus />
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="v5-modal-footer">
                            <button className="v5-btn-secondary" onClick={() => setShowUpdateModal(false)}>Cancel</button>
                            <button className="v5-btn-primary" onClick={handleSaveAttendance}>Save Changes</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Attendance;
