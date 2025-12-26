import React, { useState } from 'react';
import { useAcademic } from '../context/AcademicContext';
import { FaPlus } from 'react-icons/fa';
import './TaskInput.css';

const TaskInput = () => {
    const { addTask, courses } = useAcademic();
    const [isOpen, setIsOpen] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        courseId: '',
        type: 'Assignment',
        deadline: '',
        effort: 1
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.title || !formData.courseId || !formData.deadline) return;

        addTask({
            ...formData,
            courseId: parseInt(formData.courseId),
            effort: parseInt(formData.effort)
        });

        setFormData({ title: '', courseId: '', type: 'Assignment', deadline: '', effort: 1 });
        setIsOpen(false);
    };

    if (!isOpen) {
        return (
            <button className="btn btn-primary task-fab" onClick={() => setIsOpen(true)}>
                <FaPlus /> Add Task
            </button>
        );
    }

    return (
        <div className="card task-input-card">
            <h3>New Academic Task</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <input
                        type="text"
                        className="input-field"
                        placeholder="What needs to be done?"
                        value={formData.title}
                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                        autoFocus
                    />
                </div>

                <div className="form-row">
                    <select
                        className="input-field"
                        value={formData.courseId}
                        onChange={e => setFormData({ ...formData, courseId: e.target.value })}
                    >
                        <option value="">Select Course</option>
                        {courses.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>

                    <select
                        className="input-field"
                        value={formData.type}
                        onChange={e => setFormData({ ...formData, type: e.target.value })}
                    >
                        <option value="Assignment">Assignment</option>
                        <option value="Exam">Exam</option>
                        <option value="Reading">Reading</option>
                        <option value="Project">Project</option>
                    </select>
                </div>

                <div className="form-row">
                    <div className="input-group">
                        <label>Deadline</label>
                        <input
                            type="date"
                            className="input-field"
                            value={formData.deadline}
                            onChange={e => setFormData({ ...formData, deadline: e.target.value })}
                        />
                    </div>

                    <div className="input-group">
                        <label>Effort (Hours)</label>
                        <input
                            type="number"
                            className="input-field"
                            min="1"
                            max="10"
                            value={formData.effort}
                            onChange={e => setFormData({ ...formData, effort: e.target.value === '' ? '' : e.target.value })}
                            onFocus={e => e.target.select()}
                        />
                    </div>
                </div>

                <div className="form-actions">
                    <button type="button" className="btn" onClick={() => setIsOpen(false)}>Cancel</button>
                    <button type="submit" className="btn btn-primary">Add to Workflow</button>
                </div>
            </form>
        </div>
    );
};

export default TaskInput;
