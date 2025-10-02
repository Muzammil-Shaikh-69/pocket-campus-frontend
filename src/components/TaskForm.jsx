import { useState, useEffect } from 'react';

const defaultTask = {
  title: '',
  subject: '',
  description: '',
  priority: 'medium',
  deadline: '',
  status: 'pending',
  subtasks: [],
};

export default function TaskForm({ initial = null, onSubmit, onCancel }) {
  const [task, setTask] = useState(initial || defaultTask);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');

  useEffect(() => {
    setTask(initial || defaultTask);
  }, [initial]);

  function handleChange(e) {
    const { name, value } = e.target;
    setTask((t) => ({ ...t, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit(task);
  }

  function addSubtask() {
    const title = newSubtaskTitle.trim();
    if (!title) return;
    setTask((t) => ({ ...t, subtasks: [...(t.subtasks || []), { title, done: false }] }));
    setNewSubtaskTitle('');
  }

  function toggleSubtask(idx) {
    setTask((t) => ({
      ...t,
      subtasks: t.subtasks.map((s, i) => (i === idx ? { ...s, done: !s.done } : s)),
    }));
  }

  function removeSubtask(idx) {
    setTask((t) => ({ ...t, subtasks: t.subtasks.filter((_, i) => i !== idx) }));
  }

  function changeSubtaskTitle(idx, value) {
    setTask((t) => ({
      ...t,
      subtasks: t.subtasks.map((s, i) => (i === idx ? { ...s, title: value } : s)),
    }));
  }

  const priorityColors = {
    low: 'bg-gray-200 text-black border-gray-300',
    medium: 'bg-gray-300 text-black border-gray-400',
    high: 'bg-gray-500 text-white border-gray-600',
  };

  const statusColors = {
    pending: 'bg-gray-300 text-black border-gray-400',
    completed: 'bg-gray-500 text-white border-gray-600',
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title and Subject Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-black mb-2">
            Task Title *
          </label>
          <input
            id="title"
            name="title"
            value={task.title}
            onChange={handleChange}
            placeholder="Enter task title"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-all duration-200"
            required
          />
        </div>
        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-black mb-2">
            Subject
          </label>
          <input
            id="subject"
            name="subject"
            value={task.subject}
            onChange={handleChange}
            placeholder="e.g., Mathematics, Physics"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-all duration-200"
          />
        </div>
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-black mb-2">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={task.description}
          onChange={handleChange}
          placeholder="Describe your task in detail..."
          rows="3"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-all duration-200 resize-none"
        />
      </div>

      {/* Priority, Deadline, Status Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="priority" className="block text-sm font-medium text-black mb-2">
            Priority
          </label>
          <select
            id="priority"
            name="priority"
            value={task.priority}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-all duration-200"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="deadline" className="block text-sm font-medium text-black mb-2">
            Deadline
          </label>
          <input
            type="date"
            id="deadline"
            name="deadline"
            value={task.deadline?.slice(0, 10) || ''}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-all duration-200"
          />
        </div>
        
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-black mb-2">
            Status
          </label>
          <select
            id="status"
            name="status"
            value={task.status}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-all duration-200"
          >
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Priority and Status Preview */}
      <div className="flex items-center space-x-4">
        <div className={`px-3 py-1 rounded-full text-sm font-medium border ${priorityColors[task.priority]}`}>
          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
        </div>
        <div className={`px-3 py-1 rounded-full text-sm font-medium border ${statusColors[task.status]}`}>
          {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
        </div>
      </div>

      {/* Subtasks */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-black">Subtasks</label>
        </div>
        <div className="flex items-center gap-2 mb-3">
          <input
            type="text"
            value={newSubtaskTitle}
            onChange={(e) => setNewSubtaskTitle(e.target.value)}
            placeholder="Add a subtask title"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
          />
          <button type="button" onClick={addSubtask} className="bg-black text-white px-3 py-2 rounded-lg hover:bg-gray-800">
            Add
          </button>
        </div>
        <div className="space-y-2">
          {(task.subtasks || []).map((s, idx) => (
            <div key={idx} className="flex items-center justify-between bg-white rounded-lg px-3 py-2 border border-gray-200">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <input type="checkbox" checked={s.done} onChange={() => toggleSubtask(idx)} />
                <input
                  type="text"
                  value={s.title}
                  onChange={(e) => changeSubtaskTitle(idx, e.target.value)}
                  className={`flex-1 min-w-0 bg-transparent outline-none ${s.done ? 'line-through text-gray-500' : 'text-black'}`}
                />
              </div>
              <button type="button" onClick={() => removeSubtask(idx)} className="text-red-600 text-sm">Remove</button>
            </div>
          ))}
          {(!task.subtasks || task.subtasks.length === 0) && (
            <div className="text-sm text-gray-500">No subtasks added.</div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          className="flex-1 bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50"
        >
          {initial ? 'Update Task' : 'Create Task'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 border border-gray-300 text-black rounded-lg font-medium hover:bg-gray-50 transition-all duration-200"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
