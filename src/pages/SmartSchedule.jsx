import React from 'react';
import { useAcademic } from '../context/AcademicContext';
import { FaInfoCircle } from 'react-icons/fa';
import './SmartSchedule.css';

const SmartSchedule = () => {
    const { schedule, courses, getPriorityExplanation, getAttendanceStatus } = useAcademic();

    const getCourseColor = (id) => courses.find(c => c.id === id)?.color || '#555';

    const isOverdue = (deadline) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return new Date(deadline) < today;
    };

    return (
        <div className="schedule-page">
            <header className="page-header">
                <h1>Smart Schedule</h1>
                <p className="date-display">AI-Optimized Study Plan</p>
            </header>

            <div className="schedule-container">
                {['Today', 'Tomorrow'].map(day => (
                    <div key={day} className="day-column">
                        <h3 className="day-title">{day}</h3>
                        <div className="day-timeline">
                            {schedule.filter(t => t.scheduledFor === day).map(task => (
                                <div key={task.id} className="timeline-item" style={{ borderLeftColor: getCourseColor(task.courseId) }}>
                                    <div className="timeline-time">{task.effort}h</div>
                                    <div className="timeline-content">
                                        <div className="timeline-header">
                                            <h4>{task.title}</h4>
                                            <div className="ai-explanation-tooltip">
                                                <FaInfoCircle className="info-icon-small" />
                                                <div className="tooltip-content-wide">
                                                    {getPriorityExplanation(task.id)}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="timeline-meta">
                                            <span className="timeline-tag">{task.type}</span>
                                            {getAttendanceStatus(task.courseId).label === 'Critical' && (
                                                <span className="status-badge critical-attendance">🔴 Low Attendance</span>
                                            )}
                                            {task.rescheduled && <span className="status-badge rescheduled">🟡 Rescheduled</span>}
                                            {isOverdue(task.deadline) && task.status === 'pending' && !task.rescheduled && (
                                                <span className="status-badge overdue">🔴 Overdue</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {schedule.filter(t => t.scheduledFor === day).length === 0 && (
                                <p className="empty-slot">Free day! Relax or review.</p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SmartSchedule;
