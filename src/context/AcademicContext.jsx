import React, { createContext, useState, useEffect, useContext, useMemo } from 'react';

const AcademicContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useAcademic = () => useContext(AcademicContext);

export const AcademicProvider = ({ children }) => {
    // Initial Mock Data or Load from LocalStorage
    const [courses, setCourses] = useState(() => {
        const saved = localStorage.getItem('acadbox_courses');
        return saved ? JSON.parse(saved) : [
            { id: 1, name: 'Data Structures', credits: 4, color: '#3b82f6', semester: 'Semester 1 2024' },
            { id: 2, name: 'Operating Systems', credits: 3, color: '#8b5cf6', semester: 'Semester 1 2024' },
            { id: 3, name: 'Linear Algebra', credits: 3, color: '#10b981', semester: 'Semester 1 2024' },
        ];
    });

    const [semesters, setSemesters] = useState(() => {
        const saved = localStorage.getItem('acadbox_semesters');
        return saved ? JSON.parse(saved) : ['Semester 1 2024', 'Semester 2 2024'];
    });

    const [currentSemester, setCurrentSemester] = useState(() => {
        const saved = localStorage.getItem('acadbox_currentSemester');
        return saved ? JSON.parse(saved) : 'Semester 1 2024';
    });

    const [tasks, setTasks] = useState(() => {
        const saved = localStorage.getItem('acadbox_tasks');
        return saved ? JSON.parse(saved) : [
            { id: 1, title: 'BST Implementation', courseId: 1, type: 'Assignment', deadline: '2025-12-28', effort: 3, status: 'pending' },
            { id: 2, title: 'Process Scheduling Quiz', courseId: 2, type: 'Exam', deadline: '2025-12-29', effort: 2, status: 'pending' },
            { id: 3, title: 'Eigenvalues Problem Set', courseId: 3, type: 'Assignment', deadline: '2025-12-30', effort: 4, status: 'pending' },
        ];
    });


    const [settings, setSettings] = useState(() => {
        const saved = localStorage.getItem('acadbox_settings');
        return saved ? JSON.parse(saved) : {
            theme: 'light',
            dailyGoal: 4,
            notifications: true
        };
    });

    const [grades, setGrades] = useState(() => {
        const saved = localStorage.getItem('acadbox_grades');
        return saved ? JSON.parse(saved) : [
            { id: 1, courseId: 1, type: 'Quiz', title: 'Quiz 1', scored: 18, total: 20, date: '2025-12-20', weightage: 10 },
            { id: 2, courseId: 1, type: 'Assignment', title: 'Assignment 1', scored: 45, total: 50, date: '2025-12-22', weightage: 20 },
            { id: 3, courseId: 2, type: 'Mid-Sem', title: 'Mid-Sem Exam', scored: 38, total: 50, date: '2025-12-15', weightage: 30 },
        ];
    });

    const [attendance, setAttendance] = useState(() => {
        const saved = localStorage.getItem('acadbox_attendance');
        return saved ? JSON.parse(saved) : [
            { courseId: 1, attended: 18, total: 20 },
            { courseId: 2, attended: 14, total: 20 },
            { courseId: 3, attended: 19, total: 20 },
        ];
    });

    const [focusSessions, setFocusSessions] = useState(() => {
        const saved = localStorage.getItem('acadbox_focusSessions');
        return saved ? JSON.parse(saved) : [];
    });

    const [activeSession, setActiveSession] = useState(() => {
        const saved = localStorage.getItem('acadbox_activeSession');
        return saved ? JSON.parse(saved) : null;
    });

    const [streak, setStreak] = useState(() => {
        const saved = localStorage.getItem('acadbox_streak');
        return saved ? JSON.parse(saved) : { current: 0, history: [], status: 'solid', lastLogDate: null };
    });

    // Save to LocalStorage
    useEffect(() => {
        localStorage.setItem('acadbox_courses', JSON.stringify(courses));
    }, [courses]);

    useEffect(() => {
        localStorage.setItem('acadbox_semesters', JSON.stringify(semesters));
    }, [semesters]);

    useEffect(() => {
        localStorage.setItem('acadbox_currentSemester', JSON.stringify(currentSemester));
    }, [currentSemester]);

    useEffect(() => {
        localStorage.setItem('acadbox_tasks', JSON.stringify(tasks));
    }, [tasks]);

    useEffect(() => {
        localStorage.setItem('acadbox_grades', JSON.stringify(grades));
    }, [grades]);

    useEffect(() => {
        localStorage.setItem('acadbox_attendance', JSON.stringify(attendance));
    }, [attendance]);

    useEffect(() => {
        localStorage.setItem('acadbox_focusSessions', JSON.stringify(focusSessions));
    }, [focusSessions]);

    useEffect(() => {
        localStorage.setItem('acadbox_settings', JSON.stringify(settings));
    }, [settings]);

    useEffect(() => {
        if (activeSession) {
            localStorage.setItem('acadbox_activeSession', JSON.stringify(activeSession));
        } else {
            localStorage.removeItem('acadbox_activeSession');
        }
    }, [activeSession]);

    useEffect(() => {
        localStorage.setItem('acadbox_streak', JSON.stringify(streak));
    }, [streak]);

    const getPerformanceColor = (percentage) => {
        if (percentage >= 80) return 'var(--accent-green)';
        if (percentage >= 60) return '#f59e0b';
        return 'var(--accent-red)';
    };

    // "AI" Prioritization Logic
    const calculatePriority = (task) => {
        const today = new Date();
        const deadline = new Date(task.deadline);
        const daysUntil = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));

        const urgencyScore = Math.max(0, 10 - daysUntil);
        const typeWeight = task.type === 'Exam' ? 2 : 1;
        const effortPenalty = task.effort * 0.5;

        return urgencyScore * typeWeight + effortPenalty;
    };

    const schedule = useMemo(() => {
        const pendingTasks = tasks.filter(t => t.status === 'pending');
        const prioritized = pendingTasks
            .map(task => ({ ...task, priority: calculatePriority(task) }))
            .sort((a, b) => b.priority - a.priority);

        return prioritized.map(task => ({
            ...task,
            scheduledFor: task.priority > 5 ? 'Today' : 'Tomorrow',
            duration: task.effort // hours
        }));
    }, [tasks]);

    // Apply theme to document
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', settings.theme);
    }, [settings.theme]);

    const addTask = (newTask) => {
        setTasks([...tasks, { ...newTask, id: Date.now(), status: 'pending' }]);
    };

    const completeTask = (taskId) => {
        setTasks(tasks.map(t => t.id === taskId ? { ...t, status: 'completed' } : t));
    };

    const addCourse = (course) => {
        setCourses([...courses, { ...course, id: Date.now(), semester: currentSemester }]);
    };

    const deleteCourse = (courseId) => {
        setCourses(courses.filter(c => c.id !== courseId));
        // Cascading delete
        setTasks(prev => prev.filter(t => t.courseId !== courseId));
        setGrades(prev => prev.filter(g => g.courseId !== courseId));
        setAttendance(prev => prev.filter(a => a.courseId !== courseId));
        setFocusSessions(prev => prev.filter(s => s.courseId !== courseId));
    };

    const updateSettings = (newSettings) => {
        setSettings({ ...settings, ...newSettings });
    };

    const addGrade = (gradeData) => {
        setGrades([...grades, { ...gradeData, id: Date.now() }]);
    };

    const deleteGrade = (gradeId) => {
        setGrades(grades.filter(g => g.id !== gradeId));
    };

    const updateGrade = (gradeId, updatedData) => {
        setGrades(prev => prev.map(g => g.id === gradeId ? { ...g, ...updatedData } : g));
    };

    const getCourseGrades = (courseId) => {
        return grades.filter(g => g.courseId === courseId);
    };

    const addSemester = (semesterName) => {
        if (!semesters.includes(semesterName)) {
            setSemesters([...semesters, semesterName]);
        }
    };

    const getSemesterCourses = (semester) => {
        return courses.filter(c => c.semester === semester);
    };

    const updateSemester = (oldName, newName) => {
        if (newName.trim() && newName !== oldName) {
            setSemesters(prev => prev.map(s => s === oldName ? newName : s));
            setCourses(prev => prev.map(c => c.semester === oldName ? { ...c, semester: newName } : c));
            if (currentSemester === oldName) {
                setCurrentSemester(newName);
            }
        }
    };

    const deleteSemester = (semesterName) => {
        const updatedSemesters = semesters.filter(s => s !== semesterName);
        const coursesToDelete = courses.filter(c => c.semester === semesterName).map(c => c.id);

        setSemesters(updatedSemesters);
        setCourses(prev => prev.filter(c => c.semester !== semesterName));

        // Cascading delete for all courses in this semester
        setTasks(prev => prev.filter(t => !coursesToDelete.includes(t.courseId)));
        setGrades(prev => prev.filter(g => !coursesToDelete.includes(g.courseId)));
        setAttendance(prev => prev.filter(a => !coursesToDelete.includes(a.courseId)));
        setFocusSessions(prev => prev.filter(s => !coursesToDelete.includes(s.courseId)));

        if (currentSemester === semesterName) {
            setCurrentSemester(updatedSemesters.length > 0 ? updatedSemesters[0] : '');
        }
    };

    const deleteAllSemesters = () => {
        setSemesters(['Semester 1']);
        setCourses([]);
        setTasks([]);
        setGrades([]);
        setAttendance([]);
        setFocusSessions([]);
        setCurrentSemester('Semester 1');
    };

    const updateAttendance = (courseId, attended, total) => {
        setAttendance(prev => {
            const existing = prev.find(a => a.courseId === courseId);
            if (existing) {
                return prev.map(a => a.courseId === courseId ? { ...a, attended, total } : a);
            }
            return [...prev, { courseId, attended, total }];
        });
    };

    const getAttendanceStatus = (courseId) => {
        const record = attendance.find(a => a.courseId === courseId);
        if (!record || record.total === 0) return { percentage: 100, color: 'var(--accent-green)', label: 'Safe' };

        const percentage = (record.attended / record.total) * 100;
        if (percentage >= 80) return { percentage, color: 'var(--accent-green)', label: 'Safe' };
        if (percentage >= 75) return { percentage, color: '#f59e0b', label: 'At Risk' };
        return { percentage, color: 'var(--accent-red)', label: 'Critical' };
    };

    const getAttendanceInsights = (courseId) => {
        const record = attendance.find(a => a.courseId === courseId);
        if (!record || record.total === 0) return null;

        const currentPercentage = (record.attended / record.total) * 100;
        const insights = [];

        // Prediction: Missing next 2 classes
        const futurePercentage = (record.attended / (record.total + 2)) * 100;
        insights.push(`If you miss the next 2 classes, your attendance will drop to ${Math.round(futurePercentage)}%.`);

        // Prediction: How many more can miss
        const maxMisses = Math.floor((record.attended / 0.75) - record.total);
        if (maxMisses > 0) {
            insights.push(`You can miss ${maxMisses} more class${maxMisses > 1 ? 'es' : ''} to stay above 75%.`);
        } else if (currentPercentage < 75) {
            // How many to attend to get back to 75%
            // Formula: (attended + x) / (total + x) = 0.75
            // attended + x = 0.75 * total + 0.75 * x
            // 0.25 * x = 0.75 * total - attended
            // x = (0.75 * total - attended) / 0.25
            const needed = Math.ceil(Math.max(0, (0.75 * record.total - record.attended) / 0.25));
            if (needed > 0) {
                insights.push(`Attend the next ${needed} classes to return to the safe zone (75%+).`);
            }
        }

        return insights;
    };

    const addFocusSession = (session) => {
        setFocusSessions(prev => [...prev, { ...session, id: Date.now(), timestamp: new Date().toISOString() }]);
    };

    const startSession = (taskId, duration, sessionGoal = '') => {
        setActiveSession({
            taskId,
            startTime: Date.now(),
            duration: duration * 60, // seconds
            status: 'active',
            isLocked: true,
            sessionGoal
        });
    };

    const breakSession = (reason) => {
        if (activeSession) {
            setActiveSession(prev => ({ ...prev, status: 'broken', breakReason: reason, endTime: Date.now() }));
        }
    };

    const endSession = (actualDuration, taskStatus) => {
        if (!activeSession) return;

        const sessionData = {
            taskId: activeSession.taskId,
            duration: actualDuration, // minutes
            status: activeSession.status === 'broken' ? 'broken' : 'completed',
            timestamp: new Date().toISOString(),
            taskStatus
        };

        addFocusSession(sessionData);
        setActiveSession(null);
        updateStreak(sessionData);
    };

    const updateStreak = (lastSession) => {
        const today = new Date().toISOString().split('T')[0];

        // If already logged today, don't double count, but maybe repair crack?
        // For now, simple logic:
        if (streak.lastLogDate === today) return;

        // Check criteria: At least one session completed AND output threshold (simplified here as task completion)
        if (lastSession.status === 'completed' && lastSession.taskStatus === 'completed') {
            setStreak(prev => ({
                current: prev.current + 1,
                history: [...prev.history, { date: today, status: 'solid' }],
                status: 'solid',
                lastLogDate: today
            }));
        }
    };

    // Check for missed days on load
    useEffect(() => {
        const checkStreakDecay = () => {
            const today = new Date().toISOString().split('T')[0];
            const lastLog = streak.lastLogDate;

            if (lastLog && lastLog !== today) {
                const diffTime = Math.abs(new Date(today) - new Date(lastLog));
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                if (diffDays > 1) {
                    // Missed a day or more
                    setStreak(prev => ({
                        ...prev,
                        status: 'cracked'
                    }));
                }
            }
        };
        checkStreakDecay();
    }, [streak.lastLogDate]);

    const getPriorityExplanation = (taskId) => {
        const task = tasks.find(t => t.id === taskId);
        if (!task) return "";
        const course = courses.find(c => c.id === task.courseId);
        const today = new Date();
        const deadline = new Date(task.deadline);
        const daysUntil = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));

        let reasons = [];
        if (daysUntil <= 2) reasons.push(`it is due in ${daysUntil} days`);
        if (task.effort >= 3) reasons.push(`requires ${task.effort} hours of deep work`);
        if (course && course.credits >= 4) reasons.push(`belongs to a high-credit course (${course.credits} credits)`);
        if (task.type === 'Exam') reasons.push("it is an upcoming examination");

        if (reasons.length === 0) return "This task is scheduled for steady progress.";
        return `This task is prioritized because ${reasons.join(', ')}.`;
    };

    const getAcademicHealthBreakdown = () => {
        const semesterCourses = courses.filter(c => c.semester === currentSemester);
        const semesterCourseIds = semesterCourses.map(c => c.id);

        const semesterTasks = tasks.filter(t => semesterCourseIds.includes(t.courseId));
        const completedTasks = semesterTasks.filter(t => t.status === 'completed');
        const taskCompletion = semesterTasks.length > 0 ? (completedTasks.length / semesterTasks.length) * 100 : 100;

        // Mock focus consistency based on sessions for semester tasks
        const semesterSessions = focusSessions.filter(s => {
            const task = tasks.find(t => t.id === s.taskId);
            return task && semesterCourseIds.includes(task.courseId);
        });
        const focusConsistency = Math.min(100, semesterSessions.length * 20);

        // Grade performance based on grades for current semester
        const semesterGrades = grades.filter(g => semesterCourseIds.includes(g.courseId));
        const totalPossible = semesterGrades.reduce((sum, g) => sum + g.total, 0);
        const totalScored = semesterGrades.reduce((sum, g) => sum + g.scored, 0);
        const gradePerformance = totalPossible > 0 ? (totalScored / totalPossible) * 100 : 100;

        // Attendance performance for current semester
        const semesterAttendance = attendance.filter(a => semesterCourseIds.includes(a.courseId));
        const avgAttendance = semesterAttendance.length > 0
            ? semesterAttendance.reduce((sum, a) => sum + (a.attended / a.total), 0) / semesterAttendance.length * 100
            : 100;

        return {
            taskCompletion: Math.round(taskCompletion),
            focusConsistency: Math.round(focusConsistency),
            gradePerformance: Math.round(gradePerformance),
            attendancePerformance: Math.round(avgAttendance)
        };
    };


    const getWeakSubjectInsight = () => {
        const semesterCourses = courses.filter(c => c.semester === currentSemester);
        if (semesterCourses.length === 0) return null;

        const coursePerformance = semesterCourses.map(course => {
            const courseGrades = grades.filter(g => g.courseId === course.id);
            const totalPossible = courseGrades.reduce((sum, g) => sum + g.total, 0);
            const totalScored = courseGrades.reduce((sum, g) => sum + g.scored, 0);
            const percentage = totalPossible > 0 ? (totalScored / totalPossible) * 100 : 100;

            const pendingTasks = tasks.filter(t => t.courseId === course.id && t.status === 'pending').length;

            return { ...course, percentage, pendingTasks };
        });

        const weakSubject = [...coursePerformance].sort((a, b) => a.percentage - b.percentage)[0];

        if (weakSubject && weakSubject.percentage < 70) {
            return `${weakSubject.name} may need more attention this week due to lower performance.`;
        }
        return null;
    };

    const getEffortAccuracyInsight = () => {
        if (focusSessions.length < 2) return null;

        const courseEfforts = {};
        focusSessions.forEach(session => {
            const task = tasks.find(t => t.id === session.taskId);
            if (task) {
                if (!courseEfforts[task.courseId]) courseEfforts[task.courseId] = { estimated: 0, actual: 0 };
                courseEfforts[task.courseId].estimated += task.effort;
                courseEfforts[task.courseId].actual += session.duration / 60; // duration in minutes to hours
            }
        });

        for (const courseId in courseEfforts) {
            const { estimated, actual } = courseEfforts[courseId];
            const diff = ((actual - estimated) / estimated) * 100;
            if (Math.abs(diff) > 20) {
                const course = courses.find(c => c.id === parseInt(courseId));
                return `You usually ${diff > 0 ? 'underestimate' : 'overestimate'} ${course?.name} tasks by ~${Math.abs(Math.round(diff))}%`;
            }
        }
        return null;
    };

    const getWeeklyReflection = () => {
        const semesterCourses = courses.filter(c => c.semester === currentSemester);
        const semesterCourseIds = semesterCourses.map(c => c.id);

        const completedThisWeek = tasks.filter(t =>
            t.status === 'completed' &&
            semesterCourseIds.includes(t.courseId)
        ).length;

        const focusHours = focusSessions.reduce((sum, s) => {
            const task = tasks.find(t => t.id === s.taskId);
            if (task && semesterCourseIds.includes(task.courseId)) {
                return sum + s.duration;
            }
            return sum;
        }, 0) / 60;

        const weakSubject = getWeakSubjectInsight();

        return {
            tasksCompleted: completedThisWeek,
            focusHours: focusHours.toFixed(1),
            insight: weakSubject ? `Try increasing focus time for ${weakSubject.split(' ')[0]}.` : "You're doing great! Keep it up."
        };
    };

    const getConfidenceIndicator = (courseId) => {
        const courseGrades = grades.filter(g => g.courseId === courseId);
        if (courseGrades.length === 0) return { label: 'New', color: 'var(--text-secondary)' };

        const totalPossible = courseGrades.reduce((sum, g) => sum + g.total, 0);
        const totalScored = courseGrades.reduce((sum, g) => sum + g.scored, 0);
        const percentage = (totalScored / totalPossible) * 100;

        if (percentage >= 80) return { label: 'Strong', color: 'var(--accent-green)' };
        if (percentage >= 60) return { label: 'Improving', color: '#f59e0b' };
        return { label: 'Needs Attention', color: 'var(--accent-red)' };
    };

    useEffect(() => {
        const autoRescheduleTasks = () => {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            setTasks(prev => prev.map(task => {
                const deadline = new Date(task.deadline);
                if (task.status === 'pending' && deadline < today) {
                    const tomorrow = new Date(today);
                    tomorrow.setDate(tomorrow.getDate() + 1);
                    return {
                        ...task,
                        deadline: tomorrow.toISOString().split('T')[0],
                        rescheduled: true
                    };
                }
                return task;
            }));
        };
        autoRescheduleTasks();
    }, []);

    return (
        <AcademicContext.Provider value={{
            courses, tasks, schedule, settings, grades, semesters, currentSemester, focusSessions, attendance,
            addTask, completeTask, addCourse, deleteCourse, updateSettings,
            addGrade, deleteGrade, updateGrade, getCourseGrades, addSemester, getSemesterCourses, setCurrentSemester,
            setCourses, setSemesters, updateSemester, deleteSemester, deleteAllSemesters, addFocusSession,
            getPriorityExplanation, getAcademicHealthBreakdown, getWeakSubjectInsight,
            getEffortAccuracyInsight, getWeeklyReflection, getConfidenceIndicator,
            updateAttendance, getAttendanceStatus, getAttendanceInsights, getPerformanceColor,
            activeSession, startSession, breakSession, endSession, streak
        }}>
            {children}
        </AcademicContext.Provider>
    );
};
