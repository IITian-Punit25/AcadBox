import React, { useState } from 'react';
import { useAcademic } from '../context/AcademicContext';
import { FaTrash, FaPlus, FaGraduationCap } from 'react-icons/fa';
import './Courses.css';

const Courses = () => {
    const { courses, addCourse, deleteCourse, semesters, currentSemester, setCurrentSemester, getSemesterCourses } = useAcademic();
    const [isAdding, setIsAdding] = useState(false);
    const [newCourse, setNewCourse] = useState({ name: '', credits: 3, color: '#3b82f6' });

    const semesterCourses = getSemesterCourses(currentSemester);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!newCourse.name) return;
        addCourse(newCourse);
        setNewCourse({ name: '', credits: 3, color: '#3b82f6' });
        setIsAdding(false);
    };

    return (
        <div className="courses-page">
            <header className="page-header">
                <div className="header-left">
                    <h1>Course Manager</h1>
                    <span className="semester-badge">{currentSemester}</span>
                </div>
                <div className="header-right">
                    <select
                        className="input-field semester-select-small"
                        value={currentSemester}
                        onChange={(e) => setCurrentSemester(e.target.value)}
                    >
                        {semesters.map(sem => (
                            <option key={sem} value={sem}>{sem}</option>
                        ))}
                    </select>
                    <button className="btn btn-primary" onClick={() => setIsAdding(!isAdding)}>
                        <FaPlus /> {isAdding ? 'Cancel' : 'Add Course'}
                    </button>
                </div>
            </header>

            {isAdding && (
                <div className="card add-course-card">
                    <form onSubmit={handleSubmit} className="course-form">
                        <input
                            type="text"
                            placeholder="Course Name"
                            className="input-field"
                            value={newCourse.name}
                            onChange={e => setNewCourse({ ...newCourse, name: e.target.value })}
                            autoFocus
                        />
                        <input
                            type="number"
                            placeholder="Credits"
                            className="input-field"
                            value={newCourse.credits}
                            onChange={e => setNewCourse({ ...newCourse, credits: parseInt(e.target.value) })}
                        />
                        <input
                            type="color"
                            className="input-field color-picker"
                            value={newCourse.color}
                            onChange={e => setNewCourse({ ...newCourse, color: e.target.value })}
                        />
                        <button type="submit" className="btn btn-primary">Save</button>
                    </form>
                </div>
            )}

            <div className="courses-grid">
                {semesterCourses.length === 0 ? (
                    <div className="empty-state">
                        <FaGraduationCap className="empty-icon" />
                        <h2 className="empty-title">No Courses in {currentSemester}</h2>
                        <p className="empty-message">Add your first course to start tracking your academic progress!</p>
                    </div>
                ) : (
                    semesterCourses.map(course => (
                        <div key={course.id} className="card course-card" style={{ borderTop: `4px solid ${course.color}` }}>
                            <div className="course-info">
                                <h3>{course.name}</h3>
                                <p>{course.credits} Credits</p>
                            </div>
                            <button className="btn-icon delete-btn" onClick={() => deleteCourse(course.id)}>
                                <FaTrash />
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Courses;
