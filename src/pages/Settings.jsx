import React from 'react';
import { useAcademic } from '../context/AcademicContext';
import './Settings.css';

const Settings = () => {
    const { settings, updateSettings } = useAcademic();

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
                                onChange={(e) => updateSettings({ dailyGoal: parseInt(e.target.value) })}
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
                        <button className="btn btn-primary">Export</button>
                    </div>
                    <div className="setting-item">
                        <div className="setting-info">
                            <label className="text-danger">Reset All Data</label>
                            <p>Clear all courses and tasks</p>
                        </div>
                        <button className="btn btn-danger">Reset</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
