StudentFlow | AI Academic Optimizer
====================================

StudentFlow is a comprehensive academic management web application designed to help students track their courses, grades, tasks, and focus time efficiently.

Features
--------

1. Dashboard
   - Visual overview of "Academic Health" (progress percentage).
   - Quick view of upcoming deadlines.
   - AI-recommended tasks based on priority and effort.
   - Quick task addition.

2. Course Manager
   - Add and delete courses for the current semester.
   - Assign credit values and custom colors to each course.
   - Filter courses by semester.

3. Smart Schedule
   - AI-prioritized task list.
   - Automatically categorizes tasks into "Today" and "Tomorrow" based on urgency and effort.
   - Track task status (pending/completed).

4. Grade Tracker
   - Log grades for various assessment types (Quizzes, Assignments, Mid-Sem, End-Sem).
   - Automatic calculation of Semester Performance Index (SPI).
   - Automatic calculation of Cumulative Performance Index (CPI).
   - Calibrated scoring (weighted scores out of 100).
   - Semester management (add, rename, delete semesters).

5. Focus Mode
   - Dedicated interface for deep work.
   - Integrated timer (Pomodoro style) to manage study sessions.

6. Settings
   - Theme customization (Light/Dark modes).
   - Daily study goal setting.
   - Notification toggles.

Components
----------

1. Sidebar
   - Persistent navigation menu for quick access to all pages.
   - Active state highlighting.

2. TaskInput
   - Reusable component for adding tasks with title, course, type, deadline, and effort.

3. AcademicContext
   - Centralized state management using React Context API.
   - Handles all data persistence and logic for courses, tasks, grades, and semesters.

Tech Stack
----------
- React.js
- React Router (Navigation)
- React Icons
- Vanilla CSS (Custom Design System)
- Context API (State Management)
