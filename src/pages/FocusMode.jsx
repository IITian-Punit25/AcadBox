
import React, { useState, useEffect } from 'react';
import { useAcademic } from '../context/AcademicContext';
import { FaPlay, FaLock, FaExclamationTriangle, FaRocket } from 'react-icons/fa';
import SessionAutopsy from '../components/SessionAutopsy';
import './FocusMode.css';

const FocusMode = () => {
    const { tasks, activeSession, startSession, breakSession } = useAcademic();
    const [selectedTask, setSelectedTask] = useState(null);
    const [duration, setDuration] = useState(25);
    const [timeLeft, setTimeLeft] = useState(0);
    const [showAutopsy, setShowAutopsy] = useState(false);
    const [showEmergencyExit, setShowEmergencyExit] = useState(false);
    const [showCommitment, setShowCommitment] = useState(false);
    const [sessionGoal, setSessionGoal] = useState('');

    // Sync with active session on load
    useEffect(() => {
        if (activeSession && activeSession.status === 'active') {
            const elapsed = Math.floor((Date.now() - activeSession.startTime) / 1000);
            const remaining = Math.max(0, activeSession.duration - elapsed);

            // eslint-disable-next-line react-hooks/set-state-in-effect
            setTimeLeft(prev => {
                if (Math.abs(prev - remaining) > 2) return remaining;
                return prev;
            });

            const task = tasks.find(t => t.id === activeSession.taskId);
            if (task) setSelectedTask(prev => prev?.id === task.id ? prev : task);
            if (activeSession.sessionGoal) setSessionGoal(activeSession.sessionGoal);
        }
    }, [activeSession, tasks]);

    // Timer Logic
    useEffect(() => {
        let interval = null;
        if (activeSession?.status === 'active' && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        setShowAutopsy(true);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [activeSession, timeLeft]);

    // Background Detection
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden && activeSession?.status === 'active') {
                // Wait 10s before breaking
                setTimeout(() => {
                    if (document.hidden) {
                        breakSession('App backgrounded');
                    }
                }, 10000);
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, [activeSession, breakSession]);

    // Block Navigation (Browser level)
    useEffect(() => {
        const handleBeforeUnload = (e) => {
            if (activeSession?.status === 'active') {
                e.preventDefault();
                e.returnValue = '';
            }
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [activeSession]);

    const handlePreStart = () => {
        if (selectedTask) {
            setSessionGoal(`Complete ${selectedTask.title}`);
            setShowCommitment(true);
        }
    };

    const handleCommitAndStart = () => {
        if (selectedTask) {
            startSession(selectedTask.id, duration, sessionGoal);
            setTimeLeft(duration * 60);
            setShowCommitment(false);
        }
    };

    const handleEmergencyExit = () => {
        breakSession('Emergency Exit');
        setShowEmergencyExit(false);
        setShowAutopsy(true);
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const pendingTasks = tasks.filter(t => t.status === 'pending');

    if (showAutopsy && activeSession) {
        return <SessionAutopsy session={activeSession} onComplete={() => setShowAutopsy(false)} />;
    }

    // Locked State UI
    if (activeSession?.status === 'active') {
        return (
            <div className="focus-locked-mode">
                <div className="locked-content">
                    <div className="locked-header">
                        <FaLock className="lock-icon" />
                        <h2>Focus Locked</h2>
                    </div>

                    <div className="locked-timer">
                        {formatTime(timeLeft)}
                    </div>

                    <div className="locked-task">
                        <label>Current Task</label>
                        <h3>{selectedTask?.title || 'Unknown Task'}</h3>
                        {activeSession.sessionGoal && (
                            <p className="session-goal-display">Goal: {activeSession.sessionGoal}</p>
                        )}
                    </div>

                    <div className="emergency-section">
                        {!showEmergencyExit ? (
                            <button className="emergency-btn" onClick={() => setShowEmergencyExit(true)}>
                                Emergency Exit
                            </button>
                        ) : (
                            <div className="emergency-confirm">
                                <p><FaExclamationTriangle /> Exiting will mark this session as <strong>BROKEN</strong>.</p>
                                <div className="confirm-actions">
                                    <button className="btn-danger" onClick={handleEmergencyExit}>Confirm Exit</button>
                                    <button className="btn-ghost" onClick={() => setShowEmergencyExit(false)}>Cancel</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // Commitment Screen
    if (showCommitment) {
        return (
            <div className="focus-setup-page">
                <div className="setup-card commitment-card">
                    <h2>Commit to Focus</h2>
                    <p className="setup-subtitle">State your intent. Make it real.</p>

                    <div className="commitment-details">
                        <div className="detail-item">
                            <label>Task</label>
                            <div className="detail-value">{selectedTask?.title}</div>
                        </div>
                        <div className="detail-item">
                            <label>Duration</label>
                            <div className="detail-value">{duration} minutes</div>
                        </div>
                    </div>

                    <div className="commitment-input-group">
                        <label>Expected Output (Session Goal)</label>
                        <input
                            type="text"
                            className="commitment-input"
                            value={sessionGoal}
                            onChange={(e) => setSessionGoal(e.target.value)}
                            placeholder="e.g., Write 3 paragraphs, Solve 5 problems..."
                            autoFocus
                        />
                    </div>

                    <button className="start-focus-btn commit-btn" onClick={handleCommitAndStart}>
                        <FaRocket /> I Commit
                    </button>

                    <button className="btn-ghost-dark" onClick={() => setShowCommitment(false)}>
                        Cancel
                    </button>
                </div>
            </div>
        );
    }

    // Setup State UI
    return (
        <div className="focus-setup-page">
            <div className="setup-card">
                <h2>Start Focus Session</h2>
                <p className="setup-subtitle">Commit to ONE task. No distractions.</p>

                <div className="setup-step">
                    <label>1. Select Task (Mandatory)</label>
                    <div className="task-selection-grid">
                        {pendingTasks.map(task => (
                            <div
                                key={task.id}
                                className={`task-option ${selectedTask?.id === task.id ? 'selected' : ''}`}
                                onClick={() => setSelectedTask(task)}
                            >
                                <span className="task-title">{task.title}</span>
                                <span className="task-meta">{task.effort}h • {task.type}</span>
                            </div>
                        ))}
                        {pendingTasks.length === 0 && <p className="no-tasks">No pending tasks!</p>}
                    </div>
                </div>

                <div className="setup-step">
                    <label>2. Select Duration</label>
                    <div className="duration-options">
                        {[25, 45, 90].map(m => (
                            <button
                                key={m}
                                className={`duration-btn ${duration === m ? 'active' : ''}`}
                                onClick={() => setDuration(m)}
                            >
                                {m} min
                            </button>
                        ))}
                    </div>
                </div>

                <button
                    className="start-focus-btn"
                    disabled={!selectedTask}
                    onClick={handlePreStart}
                >
                    <FaPlay /> Start Locked Session
                </button>
            </div>
        </div>
    );
};

export default FocusMode;
