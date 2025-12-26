import React, { useState } from 'react';
import { useAcademic } from '../context/AcademicContext';
import { FaTrash, FaPlus, FaTrophy, FaChevronDown, FaChevronUp, FaEdit, FaLightbulb } from 'react-icons/fa';
import './Grades.css';

const Grades = () => {
    const {
        courses, grades, addGrade, deleteGrade, getCourseGrades,
        semesters, currentSemester, setCurrentSemester, getSemesterCourses,
        addSemester, updateSemester, deleteSemester,
        getWeakSubjectInsight, getConfidenceIndicator
    } = useAcademic();
    const [isAdding, setIsAdding] = useState(false);
    const [editingGrade, setEditingGrade] = useState(null);
    const [selectedCourseForAdd, setSelectedCourseForAdd] = useState(getSemesterCourses(currentSemester)[0]?.id || null);
    const [expandedCourse, setExpandedCourse] = useState(null);
    const [showSemesterModal, setShowSemesterModal] = useState(false);
    const [showSemesterManager, setShowSemesterManager] = useState(false);
    const [newSemesterName, setNewSemesterName] = useState('');
    const [editingSemester, setEditingSemester] = useState(null);
    const [editSemesterName, setEditSemesterName] = useState('');
    const [newGrade, setNewGrade] = useState({
        title: '',
        type: 'Quiz',
        scored: 0,
        total: 100,
        weightage: 10,
        date: new Date().toISOString().split('T')[0]
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!newGrade.title || !selectedCourseForAdd) return;

        if (editingGrade) {
            // Update existing grade
            const updatedGrades = grades.map(g =>
                g.id === editingGrade.id
                    ? { ...g, ...newGrade, scored: parseFloat(newGrade.scored), total: parseFloat(newGrade.total) }
                    : g
            );
            // We need to update through context - for now, delete and re-add
            deleteGrade(editingGrade.id);
            addGrade({
                ...newGrade,
                courseId: selectedCourseForAdd,
                scored: parseFloat(newGrade.scored),
                total: parseFloat(newGrade.total),
                weightage: parseFloat(newGrade.weightage)
            });
            setEditingGrade(null);
        } else {
            addGrade({
                ...newGrade,
                courseId: selectedCourseForAdd,
                scored: parseFloat(newGrade.scored),
                total: parseFloat(newGrade.total)
            });
        }

        setNewGrade({ title: '', type: 'Quiz', scored: 0, total: 100, weightage: 10, date: new Date().toISOString().split('T')[0] });
        setIsAdding(false);
    };

    const handleEdit = (grade) => {
        setEditingGrade(grade);
        setSelectedCourseForAdd(grade.courseId);
        setNewGrade({
            title: grade.title,
            type: grade.type,
            scored: grade.scored,
            total: grade.total,
            weightage: grade.weightage || 10,
            date: grade.date
        });
        setIsAdding(true);
        setExpandedCourse(grade.courseId);
    };

    const canAddType = (courseId, type) => {
        if (type !== 'Mid-Sem' && type !== 'End-Sem') return true;
        const courseGrades = getCourseGrades(courseId);
        return !courseGrades.some(g => g.type === type);
    };

    const getAvailableTypes = () => {
        if (!selectedCourseForAdd) return ['Quiz', 'Assignment', 'Mid-Sem', 'End-Sem'];
        const available = ['Quiz', 'Assignment'];
        if (canAddType(selectedCourseForAdd, 'Mid-Sem')) available.push('Mid-Sem');
        if (canAddType(selectedCourseForAdd, 'End-Sem')) available.push('End-Sem');
        return available;
    };

    const calculateCourseStats = (courseId) => {
        const courseGrades = getCourseGrades(courseId);
        const totalScored = courseGrades.reduce((sum, g) => sum + g.scored, 0);
        const totalPossible = courseGrades.reduce((sum, g) => sum + g.total, 0);
        const percentage = totalPossible > 0 ? ((totalScored / totalPossible) * 100).toFixed(1) : 0;

        // Calculate weighted score out of 100
        const totalWeightage = courseGrades.reduce((sum, g) => sum + (g.weightage || 0), 0);
        const weightedScore = courseGrades.reduce((sum, g) => {
            const gradePercentage = g.total > 0 ? (g.scored / g.total) : 0;
            return sum + (gradePercentage * (g.weightage || 0));
        }, 0);
        const calibratedScore = totalWeightage > 0 ? weightedScore.toFixed(2) : 0;

        const byType = ['Quiz', 'Assignment', 'Mid-Sem', 'End-Sem'].map(type => {
            const typeGrades = courseGrades.filter(g => g.type === type);
            const scored = typeGrades.reduce((sum, g) => sum + g.scored, 0);
            const total = typeGrades.reduce((sum, g) => sum + g.total, 0);
            const weightage = typeGrades.reduce((sum, g) => sum + (g.weightage || 0), 0);
            return { type, scored, total, weightage, count: typeGrades.length };
        }).filter(stat => stat.count > 0);

        return { totalScored, totalPossible, percentage, calibratedScore, totalWeightage, byType, grades: courseGrades };
    };

    const getPerformanceColor = (percentage) => {
        if (percentage >= 80) return 'var(--accent-green)';
        if (percentage >= 60) return '#f59e0b';
        return 'var(--accent-red)';
    };

    const calculateSemesterSPI = (semester) => {
        let totalCredits = 0;
        let weightedSum = 0;

        const semesterCourses = getSemesterCourses(semester);
        semesterCourses.forEach(course => {
            const stats = calculateCourseStats(course.id);
            if (stats.calibratedScore > 0) {
                const gradeOutOf10 = (parseFloat(stats.calibratedScore) / 100) * 10;
                weightedSum += course.credits * gradeOutOf10;
                totalCredits += course.credits;
            }
        });

        return totalCredits > 0 ? (weightedSum / totalCredits).toFixed(2) : 0;
    };

    const calculateOverallCPI = () => {
        let totalCredits = 0;
        let weightedSum = 0;

        courses.forEach(course => {
            const stats = calculateCourseStats(course.id);
            if (stats.calibratedScore > 0) {
                const gradeOutOf10 = (parseFloat(stats.calibratedScore) / 100) * 10;
                weightedSum += course.credits * gradeOutOf10;
                totalCredits += course.credits;
            }
        });

        return totalCredits > 0 ? (weightedSum / totalCredits).toFixed(2) : 0;
    };

    const currentSemesterSPI = calculateSemesterSPI(currentSemester);
    const overallCPI = calculateOverallCPI();
    const weakSubjectInsight = getWeakSubjectInsight();

    const semesterCourses = getSemesterCourses(currentSemester);

    const handleAddSemester = () => {
        if (newSemesterName.trim()) {
            addSemester(newSemesterName.trim());
            setCurrentSemester(newSemesterName.trim());
            setNewSemesterName('');
            setShowSemesterModal(false);
        }
    };

    const handleEditSemester = (oldName, newName) => {
        updateSemester(oldName, newName);
        setEditingSemester(null);
    };

    const handleDeleteSemester = (semesterName) => {
        if (semesters.length > 1 && window.confirm(`Delete ${semesterName} and all its courses?`)) {
            deleteSemester(semesterName);
        }
    };

    return (
        <div className="grades-page-v5">
            <header className="v5-header">
                <div className="v5-header-content">
                    <h1>Academic Overview</h1>
                    <p className="v5-subtitle">Track your progress and semester performance</p>
                </div>
                <div className="v5-header-actions">
                    <div className="v5-select-wrapper">
                        <select
                            className="v5-select"
                            value={currentSemester}
                            onChange={(e) => setCurrentSemester(e.target.value)}
                        >
                            {semesters.map(sem => (
                                <option key={sem} value={sem}>{sem}</option>
                            ))}
                        </select>
                    </div>
                    <button className="v5-btn-secondary" onClick={() => setShowSemesterManager(true)}>
                        Manage
                    </button>
                    <button className="v5-btn-primary" onClick={() => setIsAdding(!isAdding)}>
                        {isAdding ? 'Cancel' : 'Add Grade'}
                    </button>
                </div>
            </header>

            <section className="v5-stats-section">
                <div className="v5-stat-card">
                    <span className="v5-stat-label">Cumulative CPI</span>
                    <div className="v5-stat-value-group">
                        <span className="v5-stat-value">{overallCPI}</span>
                        <span className="v5-stat-max">/ 10.0</span>
                    </div>
                </div>
                <div className="v5-stat-card">
                    <span className="v5-stat-label">{currentSemester} SPI</span>
                    <div className="v5-stat-value-group">
                        <span className="v5-stat-value">{currentSemesterSPI}</span>
                        <span className="v5-stat-max">/ 10.0</span>
                    </div>
                </div>
            </section>

            {weakSubjectInsight && (
                <div className="v5-insight-card">
                    <div className="v5-insight-icon-wrapper">
                        <FaLightbulb />
                    </div>
                    <div className="v5-insight-text">
                        <strong>AI Insight:</strong> {weakSubjectInsight}
                    </div>
                </div>
            )}

            {showSemesterModal && (
                <div className="modal-overlay" onClick={() => setShowSemesterModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h3>Add New Semester</h3>
                        <input
                            type="text"
                            className="input-field"
                            placeholder="e.g., Semester 3 2025"
                            value={newSemesterName}
                            onChange={(e) => setNewSemesterName(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleAddSemester()}
                            autoFocus
                        />
                        <div className="modal-actions">
                            <button className="btn" onClick={() => setShowSemesterModal(false)}>Cancel</button>
                            <button className="btn btn-primary" onClick={handleAddSemester}>Add</button>
                        </div>
                    </div>
                </div>
            )}

            {showSemesterManager && (
                <div className="modal-overlay" onClick={() => setShowSemesterManager(false)}>
                    <div className="modal-content semester-manager" onClick={(e) => e.stopPropagation()}>
                        <h3>Manage Semesters</h3>
                        <div className="semester-list">
                            {semesters.map(sem => (
                                <div key={sem} className="semester-item">
                                    {editingSemester === sem ? (
                                        <>
                                            <input
                                                type="text"
                                                className="input-field"
                                                value={editSemesterName}
                                                onChange={(e) => setEditSemesterName(e.target.value)}
                                                onKeyPress={(e) => e.key === 'Enter' && handleEditSemester(sem, editSemesterName)}
                                                autoFocus
                                            />
                                            <button className="btn btn-sm" onClick={() => handleEditSemester(sem, editSemesterName)}>
                                                Save
                                            </button>
                                            <button className="btn btn-sm" onClick={() => setEditingSemester(null)}>
                                                Cancel
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <span className="semester-name">{sem}</span>
                                            <div className="semester-actions">
                                                <button
                                                    className="btn-icon"
                                                    onClick={() => {
                                                        setEditingSemester(sem);
                                                        setEditSemesterName(sem);
                                                    }}
                                                    title="Edit"
                                                >
                                                    <FaEdit />
                                                </button>
                                                <button
                                                    className="btn-icon delete-btn-small"
                                                    onClick={() => handleDeleteSemester(sem)}
                                                    title="Delete"
                                                    disabled={semesters.length === 1}
                                                >
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                        <div className="modal-actions">
                            <button className="btn btn-primary" onClick={() => setShowSemesterManager(false)}>Close</button>
                        </div>
                    </div>
                </div>
            )}

            {isAdding && (
                <div className="v5-form-card">
                    <h3>{editingGrade ? 'Edit Grade' : 'Add New Grade'}</h3>
                    <form onSubmit={handleSubmit} className="v5-grade-form">
                        <div className="v5-form-grid">
                            <div className="v5-form-group">
                                <label>Course</label>
                                <select
                                    className="v5-input"
                                    value={selectedCourseForAdd || ''}
                                    onChange={(e) => setSelectedCourseForAdd(parseInt(e.target.value))}
                                    disabled={editingGrade !== null}
                                >
                                    {semesterCourses.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="v5-form-group">
                                <label>Title</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Mid-term Exam"
                                    className="v5-input"
                                    value={newGrade.title}
                                    onChange={e => setNewGrade({ ...newGrade, title: e.target.value })}
                                    autoFocus
                                />
                            </div>
                            <div className="v5-form-group">
                                <label>Type</label>
                                <select
                                    className="v5-input"
                                    value={newGrade.type}
                                    onChange={e => setNewGrade({ ...newGrade, type: e.target.value })}
                                    disabled={editingGrade !== null}
                                >
                                    {(editingGrade ? [editingGrade.type] : getAvailableTypes()).map(type => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="v5-form-group">
                                <label>Scored</label>
                                <input
                                    type="number"
                                    className="v5-input"
                                    value={newGrade.scored}
                                    onChange={e => setNewGrade({ ...newGrade, scored: e.target.value })}
                                />
                            </div>
                            <div className="v5-form-group">
                                <label>Total</label>
                                <input
                                    type="number"
                                    className="v5-input"
                                    value={newGrade.total}
                                    onChange={e => setNewGrade({ ...newGrade, total: e.target.value })}
                                />
                            </div>
                            <div className="v5-form-group">
                                <label>Weightage %</label>
                                <input
                                    type="number"
                                    className="v5-input"
                                    value={newGrade.weightage}
                                    onChange={e => setNewGrade({ ...newGrade, weightage: e.target.value })}
                                    min="0"
                                    max="100"
                                />
                            </div>
                            <div className="v5-form-group">
                                <label>Date</label>
                                <input
                                    type="date"
                                    className="v5-input"
                                    value={newGrade.date}
                                    onChange={e => setNewGrade({ ...newGrade, date: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="v5-form-actions">
                            <button type="submit" className="v5-btn-primary">
                                {editingGrade ? 'Update Grade' : 'Save Grade'}
                            </button>
                            {editingGrade && (
                                <button
                                    type="button"
                                    className="v5-btn-ghost"
                                    onClick={() => {
                                        setEditingGrade(null);
                                        setIsAdding(false);
                                        setNewGrade({ title: '', type: 'Quiz', scored: 0, total: 100, date: new Date().toISOString().split('T')[0] });
                                    }}
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            )}

            <div className="v5-courses-grid">
                {semesterCourses.map(course => {
                    const stats = calculateCourseStats(course.id);
                    const isExpanded = expandedCourse === course.id;
                    const confidence = getConfidenceIndicator(course.id);

                    return (
                        <div key={course.id} className="v5-course-card">
                            <div className="v5-course-header">
                                <div className="v5-course-info">
                                    <div className="v5-course-name-row">
                                        <h2>{course.name}</h2>
                                        <span className="v5-confidence-tag" style={{ color: confidence.color, backgroundColor: `${confidence.color}15` }}>
                                            {confidence.label}
                                        </span>
                                    </div>
                                    <span className="v5-course-meta">{course.credits} Credits • {stats.grades.length} Assessments</span>
                                </div>
                                <div className="v5-course-grade">
                                    <span className="v5-grade-label">Grade</span>
                                    <span className="v5-grade-value">{((parseFloat(stats.calibratedScore) / 100) * 10).toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="v5-course-stats-grid">
                                <div className="v5-course-stat-item">
                                    <span className="v5-course-stat-label">Percentage</span>
                                    <span className="v5-course-stat-value">{stats.percentage}%</span>
                                </div>
                                <div className="v5-course-stat-item">
                                    <span className="v5-course-stat-label">Weighted Score</span>
                                    <span className="v5-course-stat-value">{stats.calibratedScore}/100</span>
                                </div>
                            </div>

                            {stats.byType.length > 0 && (
                                <div className="v5-breakdown">
                                    {stats.byType.map(stat => (
                                        <div key={stat.type} className="v5-breakdown-item">
                                            <span className="v5-breakdown-type">{stat.type}</span>
                                            <span className="v5-breakdown-score">{stat.scored}/{stat.total}</span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {stats.grades.length > 0 && (
                                <div className="v5-card-footer">
                                    <button
                                        className="v5-expand-btn"
                                        onClick={() => setExpandedCourse(isExpanded ? null : course.id)}
                                    >
                                        {isExpanded ? 'Hide Details' : 'View All Grades'}
                                    </button>

                                    {isExpanded && (
                                        <div className="v5-grades-list">
                                            {stats.grades.map(grade => (
                                                <div key={grade.id} className="v5-grade-item">
                                                    <div className="v5-grade-info">
                                                        <span className="v5-grade-title">{grade.title}</span>
                                                        <span className="v5-grade-date">{grade.date}</span>
                                                    </div>
                                                    <div className="v5-grade-score-actions">
                                                        <span className="v5-grade-score">{grade.scored}/{grade.total}</span>
                                                        <div className="v5-grade-actions">
                                                            <button className="v5-action-btn" onClick={() => handleEdit(grade)} title="Edit">
                                                                <FaEdit />
                                                            </button>
                                                            <button className="v5-action-btn delete" onClick={() => deleteGrade(grade.id)} title="Delete">
                                                                <FaTrash />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {stats.grades.length === 0 && (
                                <div className="v5-empty-card-state">
                                    No grades recorded
                                </div>
                            )}
                        </div>
                    );
                })}
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
                            {semesters.map(sem => (
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
                            ))}
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

export default Grades;
