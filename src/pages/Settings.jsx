import React from 'react';
import { useAcademic } from '../context/AcademicContext';
import { FaDownload, FaTrashAlt } from 'react-icons/fa';
import './Settings.css';

const Settings = () => {
    const { settings, updateSettings, deleteAllSemesters, courses, tasks, grades, attendance, semesters, focusSessions } = useAcademic();

    const handleExport = () => {
        const data = {
            courses,
            tasks,
            grades,
            attendance,
            semesters,
            focusSessions,
            settings
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `acadbox_data_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleReset = () => {
        if (window.confirm('Are you sure you want to reset all data? This action cannot be undone.')) {
            deleteAllSemesters();
            alert('All data has been reset.');
        }
    };

    return (
        <div className="settings-page">
            <header className="page-header">
                <h1>Settings</h1>
            </header>

            <div className="settings-container">
                <div className="card settings-card">
                    <h3>Preferences</h3>

                    <div className="setting-item">
                        <div className="setting-info">
                            <label>Daily Study Goal</label>
                            <p>Target hours per day</p>
                        </div>
                        <div className="setting-control">
                            <input
                                type="number"
                                className="input-field"
                                value={settings.dailyGoal}
                                onChange={(e) => updateSettings({ dailyGoal: e.target.value === '' ? '' : parseInt(e.target.value) })}
                                onFocus={e => e.target.select()}
                                min="1"
                                max="12"
                            />
                            <span>hours</span>
                        </div>
                    </div>

                    <div className="setting-item">
                        <div className="setting-info">
                            <label>Notifications</label>
                            <p>Get reminders for upcoming deadlines</p>
                        </div>
                        <div className="setting-control">
                            <label className="switch">
                                <input
                                    type="checkbox"
                                    checked={settings.notifications}
                                    onChange={(e) => updateSettings({ notifications: e.target.checked })}
                                />
                                <span className="slider round"></span>
                            </label>
                        </div>
                    </div>

                    <div className="setting-item">
                        <div className="setting-info">
                            <label>Theme</label>
                            <p>Select application appearance</p>
                        </div>
                        <div className="setting-control">
                            <select
                                className="input-field"
                                value={settings.theme}
                                onChange={(e) => updateSettings({ theme: e.target.value })}
                            >
                                <option value="dark">Dark Mode</option>
                                <option value="light">Light Mode</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="card settings-card">
                    <h3>Data Management</h3>
                    <div className="setting-item">
                        <div className="setting-info">
                            <label>Export Data</label>
                            <p>Download your academic data as JSON</p>
                        </div>
                        <button className="btn btn-primary" onClick={handleExport}>
                            <FaDownload /> Export
                        </button>
                    </div>
                    <div className="setting-item">
                        <div className="setting-info">
                            <label className="text-danger">Reset All Data</label>
                            <p>Clear all courses and tasks</p>
                        </div>
                        <button className="btn btn-danger" onClick={handleReset}>
                            <FaTrashAlt /> Reset
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
