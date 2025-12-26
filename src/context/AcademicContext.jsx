import React, { createContext, useState, useEffect, useContext } from 'react';

const AcademicContext = createContext();

export const useAcademic = () => useContext(AcademicContext);

export const AcademicProvider = ({ children }) => {
    // Initial Mock Data
    const [courses, setCourses] = useState([
        { id: 1, name: 'Data Structures', credits: 4, color: '#3b82f6', semester: 'Semester 1 2024' },
        { id: 2, name: 'Operating Systems', credits: 3, color: '#8b5cf6', semester: 'Semester 1 2024' },
        { id: 3, name: 'Linear Algebra', credits: 3, color: '#10b981', semester: 'Semester 1 2024' },
    ]);

    const [semesters, setSemesters] = useState(['Semester 1 2024', 'Semester 2 2024']);
    const [currentSemester, setCurrentSemester] = useState('Semester 1 2024');

    const [tasks, setTasks] = useState([
        { id: 1, title: 'BST Implementation', courseId: 1, type: 'Assignment', deadline: '2025-12-28', effort: 3, status: 'pending' },
        { id: 2, title: 'Process Scheduling Quiz', courseId: 2, type: 'Exam', deadline: '2025-12-29', effort: 2, status: 'pending' },
        { id: 3, title: 'Eigenvalues Problem Set', courseId: 3, type: 'Assignment', deadline: '2025-12-30', effort: 4, status: 'pending' },
    ]);

    const [schedule, setSchedule] = useState([]);

    const [settings, setSettings] = useState({
        theme: 'light',
        dailyGoal: 4,
        notifications: true
    });

    const [grades, setGrades] = useState([
        { id: 1, courseId: 1, type: 'Quiz', title: 'Quiz 1', scored: 18, total: 20, date: '2025-12-20', weightage: 10 },
        { id: 2, courseId: 1, type: 'Assignment', title: 'Assignment 1', scored: 45, total: 50, date: '2025-12-22', weightage: 20 },
        { id: 3, courseId: 2, type: 'Mid-Sem', title: 'Mid-Sem Exam', scored: 38, total: 50, date: '2025-12-15', weightage: 30 },
    ]);

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

    const generateSchedule = () => {
        const pendingTasks = tasks.filter(t => t.status === 'pending');
        const prioritized = pendingTasks
            .map(task => ({ ...task, priority: calculatePriority(task) }))
            .sort((a, b) => b.priority - a.priority);

        const newSchedule = prioritized.map(task => ({
            ...task,
            scheduledFor: task.priority > 5 ? 'Today' : 'Tomorrow',
            duration: task.effort // hours
        }));

        setSchedule(newSchedule);
    };

    useEffect(() => {
        generateSchedule();
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
        if (semesters.length > 1) {
            setSemesters(prev => prev.filter(s => s !== semesterName));
            setCourses(prev => prev.filter(c => c.semester !== semesterName));
            if (currentSemester === semesterName) {
                setCurrentSemester(semesters.find(s => s !== semesterName));
            }
        }
    };

    const [focusSessions, setFocusSessions] = useState([]);

    const addFocusSession = (session) => {
        setFocusSessions(prev => [...prev, { ...session, id: Date.now(), timestamp: new Date().toISOString() }]);
    };

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
        const completedTasks = tasks.filter(t => t.status === 'completed');
        const taskCompletion = tasks.length > 0 ? (completedTasks.length / tasks.length) * 100 : 0;

        // Mock focus consistency based on sessions
        const focusConsistency = Math.min(100, focusSessions.length * 20);

        // Grade performance based on grades
        const totalPossible = grades.reduce((sum, g) => sum + g.total, 0);
        const totalScored = grades.reduce((sum, g) => sum + g.scored, 0);
        const gradePerformance = totalPossible > 0 ? (totalScored / totalPossible) * 100 : 0;

        return {
            taskCompletion: Math.round(taskCompletion),
            focusConsistency: Math.round(focusConsistency),
            gradePerformance: Math.round(gradePerformance)
        };
    };

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

    const getWeakSubjectInsight = () => {
        if (courses.length === 0) return null;

        const coursePerformance = courses.map(course => {
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
        const completedThisWeek = tasks.filter(t => t.status === 'completed').length;
        const focusHours = focusSessions.reduce((sum, s) => sum + s.duration, 0) / 60;
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
        autoRescheduleTasks();
    }, []);

    return (
        <AcademicContext.Provider value={{
            courses, tasks, schedule, settings, grades, semesters, currentSemester, focusSessions,
            addTask, completeTask, addCourse, deleteCourse, updateSettings,
            addGrade, deleteGrade, updateGrade, getCourseGrades, addSemester, getSemesterCourses, setCurrentSemester,
            setCourses, setSemesters, updateSemester, deleteSemester, addFocusSession,
            getPriorityExplanation, getAcademicHealthBreakdown, getWeakSubjectInsight,
            getEffortAccuracyInsight, getWeeklyReflection, getConfidenceIndicator
        }}>
            {children}
        </AcademicContext.Provider>
    );
};
