import React, { useState } from 'react';
import { useAcademic } from '../context/AcademicContext';
import { FaCheckCircle, FaExclamationTriangle, FaTimesCircle } from 'react-icons/fa';

const SessionAutopsy = ({ session, onComplete }) => {
    const { endSession } = useAcademic();
    const [taskStatus, setTaskStatus] = useState('completed');
    const [actualDuration] = useState(Math.round(session.duration / 60));

    const handleFinish = () => {
        endSession(actualDuration, taskStatus);
        onComplete();
    };

    const focusScore = Math.min(100, Math.round((actualDuration / (session.duration / 60)) * 100));

    return (
        <div className="v5-modal-overlay">
            <div className="v5-modal-content" style={{ maxWidth: '600px' }}>
                <div className="v5-modal-header">
                    <h3>Session Autopsy</h3>
                </div>

                <div className="autopsy-body">
                    <div className="autopsy-stat-grid">
                        <div className="stat-card">
                            <label>Planned</label>
                            <span>{Math.round(session.duration / 60)}m</span>
                        </div>
                        <div className="stat-card">
                            <label>Actual Focus</label>
                            <span>{actualDuration}m</span>
                        </div>
                        <div className="stat-card">
                            <label>Focus Score</label>
                            <span style={{ color: focusScore >= 80 ? 'var(--accent-green)' : 'var(--accent-red)' }}>
                                {focusScore}
                            </span>
                        </div>
                    </div>

                    <div className="v5-form-group" style={{ marginTop: '20px' }}>
                        <label>Task Status</label>
                        <div className="status-options">
                            <button
                                className={`status-btn ${taskStatus === 'completed' ? 'active completed' : ''}`}
                                onClick={() => setTaskStatus('completed')}
                            >
                                <FaCheckCircle /> Completed
                            </button>
                            <button
                                className={`status-btn ${taskStatus === 'partial' ? 'active partial' : ''}`}
                                onClick={() => setTaskStatus('partial')}
                            >
                                <FaExclamationTriangle /> Partial
                            </button>
                            <button
                                className={`status-btn ${taskStatus === 'failed' ? 'active failed' : ''}`}
                                onClick={() => setTaskStatus('failed')}
                            >
                                <FaTimesCircle /> Failed
                            </button>
                        </div>
                    </div>

                    <div className="autopsy-feedback">
                        {focusScore < 50 && <p>Long time, low output → task might be too large.</p>}
                        {focusScore >= 90 && <p>High focus! Consider increasing duration next time.</p>}
                        {taskStatus === 'failed' && <p>Don't worry. Break the task down and try again.</p>}
                    </div>
                </div>

                <div className="v5-modal-actions">
                    <button className="v5-btn-primary" onClick={handleFinish}>
                        Log Session
                    </button>
                </div>
            </div>
            <style>{`
                .autopsy-stat-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 16px;
                    margin-bottom: 24px;
                }
                .stat-card {
                    background: var(--bg-tertiary);
                    padding: 16px;
                    border-radius: 12px;
                    text-align: center;
                }
                .stat-card label {
                    display: block;
                    font-size: 0.875rem;
                    color: var(--text-secondary);
                    margin-bottom: 8px;
                }
                .stat-card span {
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: var(--text-primary);
                }
                .status-options {
                    display: flex;
                    gap: 12px;
                }
                .status-btn {
                    flex: 1;
                    padding: 12px;
                    border: 1px solid var(--border-color);
                    border-radius: 12px;
                    background: var(--bg-tertiary);
                    color: var(--text-secondary);
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    transition: all 0.2s;
                }
                .status-btn.active {
                    border-color: transparent;
                    color: white;
                }
                .status-btn.active.completed { background: var(--accent-green); }
                .status-btn.active.partial { background: #f59e0b; }
                .status-btn.active.failed { background: var(--accent-red); }
                
                .autopsy-feedback {
                    margin-top: 24px;
                    padding: 16px;
                    background: rgba(59, 130, 246, 0.1);
                    border-radius: 12px;
                    color: var(--text-primary);
                    text-align: center;
                    font-style: italic;
                }
            `}</style>
        </div>
    );
};

export default SessionAutopsy;
