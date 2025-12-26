import React, { useState, useEffect } from 'react';
import { useAcademic } from '../context/AcademicContext';
import { FaPlay, FaPause, FaStop, FaCheck } from 'react-icons/fa';
import './FocusMode.css';

const FocusMode = () => {
    const { tasks, completeTask, addFocusSession, getAttendanceStatus } = useAcademic();
    const [selectedTask, setSelectedTask] = useState(null);
    const [isActive, setIsActive] = useState(false);
    const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes
    const [mode, setMode] = useState('pomodoro'); // pomodoro, short, long, custom
    const [customTime, setCustomTime] = useState(25);
    const [showCompletionPrompt, setShowCompletionPrompt] = useState(false);
    const [sessionDuration, setSessionDuration] = useState(0);

    useEffect(() => {
        let interval = null;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(timeLeft - 1);
                setSessionDuration(prev => prev + 1);
            }, 1000);
        } else if (timeLeft === 0 && isActive) {
            setIsActive(false);
            if ((mode === 'pomodoro' || mode === 'custom') && selectedTask) {
                setShowCompletionPrompt(true);
            }
        }
        return () => clearInterval(interval);
    }, [isActive, timeLeft, mode, selectedTask]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const toggleTimer = () => setIsActive(!isActive);

    const resetTimer = () => {
        setIsActive(false);
        setSessionDuration(0);
        if (mode === 'pomodoro') setTimeLeft(25 * 60);
        if (mode === 'short') setTimeLeft(5 * 60);
        if (mode === 'long') setTimeLeft(15 * 60);
        if (mode === 'custom') setTimeLeft(customTime * 60);
    };

    const handleModeChange = (newMode) => {
        setMode(newMode);
        setIsActive(false);
        setSessionDuration(0);
        if (newMode === 'pomodoro') setTimeLeft(25 * 60);
        if (newMode === 'short') setTimeLeft(5 * 60);
        if (newMode === 'long') setTimeLeft(15 * 60);
        if (newMode === 'custom') setTimeLeft(customTime * 60);
    };

    const handleCustomTimeChange = (e) => {
        const val = parseInt(e.target.value) || 0;
        setCustomTime(val);
        if (mode === 'custom') {
            setTimeLeft(val * 60);
            setIsActive(false);
            setSessionDuration(0);
        }
    };

    const handleComplete = () => {
        if (selectedTask) {
            completeTask(selectedTask.id);
            addFocusSession({
                taskId: selectedTask.id,
                duration: Math.round(sessionDuration / 60), // minutes
                mode: mode
            });
            setSelectedTask(null);
            setShowCompletionPrompt(false);
            resetTimer();
        }
    };

    const handleRecordOnly = () => {
        if (selectedTask) {
            addFocusSession({
                taskId: selectedTask.id,
                duration: Math.round(sessionDuration / 60), // minutes
                mode: mode
            });
            setShowCompletionPrompt(false);
            resetTimer();
        }
    };

    const pendingTasks = tasks.filter(t => t.status === 'pending');

    return (
        <div className="focus-page">
            <div className="timer-container">
                <div className="timer-modes">
                    <button className={`mode-btn ${mode === 'pomodoro' ? 'active' : ''}`} onClick={() => handleModeChange('pomodoro')}>Pomodoro</button>
                    <button className={`mode-btn ${mode === 'short' ? 'active' : ''}`} onClick={() => handleModeChange('short')}>Short Break</button>
                    <button className={`mode-btn ${mode === 'long' ? 'active' : ''}`} onClick={() => handleModeChange('long')}>Long Break</button>
                    <button className={`mode-btn ${mode === 'custom' ? 'active' : ''}`} onClick={() => handleModeChange('custom')}>Custom</button>
                </div>

                {mode === 'custom' && (
                    <div className="custom-time-input">
                        <label>Set Duration (min):</label>
                        <input
                            type="number"
                            min="1"
                            max="120"
                            value={customTime}
                            onChange={handleCustomTimeChange}
                            className="v5-input"
                        />
                    </div>
                )}

                <div className="timer-display">
                    {formatTime(timeLeft)}
                </div>

                <div className="timer-controls">
                    <button className="control-btn main" onClick={toggleTimer}>
                        {isActive ? <FaPause /> : <FaPlay />}
                    </button>
                    <button className="control-btn" onClick={resetTimer}>
                        <FaStop />
                    </button>
                </div>

                {selectedTask && !showCompletionPrompt && (
                    <div className="active-task-display">
                        <p>Focusing on:</p>
                        <h3>{selectedTask.title}</h3>
                        {getAttendanceStatus(selectedTask.courseId).label !== 'Safe' && (
                            <div className="attendance-warning-focus">
                                <FaExclamationCircle /> <span>Low attendance in this course. Prioritize attending classes!</span>
                            </div>
                        )}
                        <button className="btn btn-primary complete-btn" onClick={handleComplete}>
                            <FaCheck /> Mark Complete
                        </button>
                    </div>
                )}

                {showCompletionPrompt && (
                    <div className="completion-prompt card">
                        <h3>Session Complete!</h3>
                        <p>You worked on <strong>{selectedTask.title}</strong> for {Math.round(sessionDuration / 60)} minutes.</p>
                        <div className="prompt-actions">
                            <button className="btn btn-primary" onClick={handleComplete}>
                                Mark Task Complete
                            </button>
                            <button className="btn btn-secondary" onClick={handleRecordOnly}>
                                Just Record Session
                            </button>
                            <button className="btn" onClick={() => setShowCompletionPrompt(false)}>
                                Dismiss
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <div className="task-selector">
                <h3>Select Task to Focus On</h3>
                <div className="focus-task-list">
                    {pendingTasks.map(task => (
                        <div
                            key={task.id}
                            className={`focus-task-item ${selectedTask?.id === task.id ? 'selected' : ''}`}
                            onClick={() => {
                                if (!isActive) setSelectedTask(task);
                            }}
                        >
                            <span>{task.title}</span>
                            <span className="task-effort">{task.effort}h</span>
                        </div>
                    ))}
                    {pendingTasks.length === 0 && <p className="empty-msg">No pending tasks. You're free!</p>}
                </div>
            </div>
        </div>
    );
};

export default FocusMode;
