import React from 'react';
import { useAcademic } from '../context/AcademicContext';
import TaskInput from '../components/TaskInput';
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaLightbulb, FaHistory, FaFire } from 'react-icons/fa';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import './Dashboard.css';

ChartJS.register(ArcElement, Tooltip, Legend);

const StreakWidget = ({ streak }) => {
    const isCracked = streak.status === 'cracked';

    return (
        <div className={`card streak-card ${isCracked ? 'cracked' : ''}`}>
            <div className="streak-header">
                <div className="streak-icon-wrapper">
                    <FaFire className={`streak-icon ${isCracked ? 'cracked-icon' : ''}`} />
                </div>
                <div className="streak-info">
                    <h3>{streak.current} Day Streak</h3>
                    <p>{isCracked ? "Momentum broken. Resume today to prevent decay." : "Consistency is key. Keep it up."}</p>
                </div>
            </div>
            {isCracked && <div className="crack-overlay"></div>}
        </div>
    );
};

const Dashboard = () => {
    const {
        tasks, courses, completeTask,
        getAcademicHealthBreakdown, getPriorityExplanation, getWeeklyReflection,
        streak
    } = useAcademic();

    const pendingTasks = tasks.filter(t => t.status === 'pending');
    const completedTasks = tasks.filter(t => t.status === 'completed');

    const healthBreakdown = getAcademicHealthBreakdown();
    const weeklyReflection = getWeeklyReflection();

    // Calculate "Academic Health"
    const healthScore = Math.round(
        (healthBreakdown.taskCompletion * 0.3) +
        (healthBreakdown.focusConsistency * 0.2) +
        (healthBreakdown.gradePerformance * 0.2) +
        (healthBreakdown.attendancePerformance * 0.3)
    );

    const chartData = {
        labels: ['Completed', 'Pending'],
        datasets: [
            {
                data: [completedTasks.length, pendingTasks.length],
                backgroundColor: ['#10b981', '#3b82f6'],
                borderWidth: 0,
            },
        ],
    };

    const getCourseName = (id) => courses.find(c => c.id === id)?.name || 'Unknown';

    return (
        <div className="dashboard">
            <header className="page-header">
                <h1>Academic Dashboard</h1>
                <p className="date-display">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
            </header>

            <div className="dashboard-grid">
                {/* Streak Widget */}
                <StreakWidget streak={streak} />

                {/* Health Card */}
                <div className="card health-card">
                    <div className="card-header-with-info">
                        <h3>Academic Health</h3>
                        <div className="health-breakdown-tooltip">
                            <FaInfoCircle className="info-icon" />
                            <div className="tooltip-content">
                                <div className="tooltip-item">
                                    <span>Task Completion</span>
                                    <span>{healthBreakdown.taskCompletion}%</span>
                                </div>
                                <div className="tooltip-item">
                                    <span>Focus Consistency</span>
                                    <span>{healthBreakdown.focusConsistency}%</span>
                                </div>
                                <div className="tooltip-item">
                                    <span>Grade Performance</span>
                                    <span>{healthBreakdown.gradePerformance}%</span>
                                </div>
                                <div className="tooltip-item">
                                    <span>Attendance</span>
                                    <span>{healthBreakdown.attendancePerformance}%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="chart-container">
                        <div className="health-score">
                            <span>{healthScore}%</span>
                        </div>
                        <Doughnut data={chartData} options={{ cutout: '70%', plugins: { legend: { display: false } } }} />
                    </div>
                    <p className="health-status">
                        {healthScore > 80 ? "Excellent! You're on track." : "Keep pushing! You have deadlines coming up."}
                    </p>
                </div>

                {/* Priority Tasks */}
                <div className="card priority-card">
                    <h3>Top Priorities (AI Recommended)</h3>
                    <div className="task-list">
                        {pendingTasks.slice(0, 3).map(task => (
                            <div key={task.id} className="task-item">
                                <div className="task-info">
                                    <div className="task-header">
                                        <span className="task-course" style={{ color: courses.find(c => c.id === task.courseId)?.color }}>
                                            {getCourseName(task.courseId)}
                                        </span>
                                        <div className="ai-explanation-tooltip">
                                            <FaInfoCircle className="info-icon-small" />
                                            <div className="tooltip-content-wide">
                                                {getPriorityExplanation(task.id)}
                                            </div>
                                        </div>
                                    </div>
                                    <h4>{task.title}</h4>
                                    <span className="task-meta">Due: {task.deadline} • Effort: {task.effort}h</span>
                                </div>
                                <button className="btn-check" onClick={() => completeTask(task.id)}>
                                    <FaCheckCircle />
                                </button>
                            </div>
                        ))}
                        {pendingTasks.length === 0 && <p className="empty-state">No pending tasks. Great job!</p>}
                    </div>
                </div>

                {/* Weekly Reflection Card */}
                <div className="card reflection-card">
                    <div className="card-header">
                        <FaHistory className="header-icon" />
                        <h3>Weekly Reflection</h3>
                    </div>
                    <div className="reflection-content">
                        <div className="reflection-stats">
                            <div className="stat-item">
                                <span className="stat-value">{weeklyReflection.tasksCompleted}</span>
                                <span className="stat-label">Tasks Done</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-value">{weeklyReflection.focusHours}h</span>
                                <span className="stat-label">Focus Time</span>
                            </div>
                        </div>
                        <div className="reflection-insight">
                            <FaLightbulb className="insight-icon" />
                            <p>{weeklyReflection.insight}</p>
                        </div>
                    </div>
                </div>
            </div>

            <TaskInput />
        </div>
    );
};

export default Dashboard;
