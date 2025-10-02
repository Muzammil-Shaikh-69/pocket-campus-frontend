import { useEffect, useMemo, useState } from 'react';
import api from '../lib/api';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';
import Calendar from '../components/Calendar';

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [editing, setEditing] = useState(null);
  const [filters, setFilters] = useState({ subject: '', priority: '', status: '', sortBy: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState('list');

  const filtered = useMemo(() => {
    let t = [...tasks];
    if (filters.subject) {
      const q = filters.subject.toLowerCase();
      t = t.filter((x) => (x.subject || '').toLowerCase().includes(q));
    }
    if (filters.priority) t = t.filter((x) => x.priority === filters.priority);
    if (filters.status) t = t.filter((x) => x.status === filters.status);
    if (filters.sortBy) {
      const [field, order] = filters.sortBy.split(':');
      t.sort((a, b) => (a[field] > b[field] ? 1 : -1) * (order === 'desc' ? -1 : 1));
    }
    return t;
  }, [tasks, filters]);

  async function load() {
    setIsLoading(true);
    try {
      const params = {};
      if (filters.subject) params.subject = filters.subject;
      if (filters.priority) params.priority = filters.priority;
      if (filters.status) params.status = filters.status;
      if (filters.sortBy) params.sortBy = filters.sortBy;
      const { data } = await api.get('/tasks', { params });
      setTasks(data.tasks);
    } catch (error) {
      console.error('Failed to load tasks:', error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleCreate(payload) {
    try {
      await api.post('/tasks', payload);
      setEditing(null);
      await load();
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  }

  async function handleUpdate(payload) {
    try {
      await api.put(`/tasks/${editing._id}`, payload);
      setEditing(null);
      await load();
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  }

  async function handleDelete(task) {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await api.delete(`/tasks/${task._id}`);
        await load();
      } catch (error) {
        console.error('Failed to delete task:', error);
      }
    }
  }

  async function handleTaskUpdate(updatedTask) {
    try {
      setTasks(prevTasks => prevTasks.map(task => task._id === updatedTask._id ? updatedTask : task));
    } catch (error) {
      console.error('Failed to update task in local state:', error);
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-black rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Task Management</h1>
        <p className="text-gray-300 text-lg">Create, organize, and track your study tasks</p>
      </div>

      {/* Task Form */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-300">
        <h3 className="text-xl font-semibold text-black mb-6 flex items-center">
          <svg className="w-6 h-6 text-black mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          {editing ? 'Edit Task' : 'Add New Task'}
        </h3>
        <TaskForm 
          initial={editing} 
          onSubmit={editing ? handleUpdate : handleCreate} 
          onCancel={() => setEditing(null)} 
        />
      </div>

      {/* View Toggle and Filters */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-300">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <h3 className="text-xl font-semibold text-black flex items-center">
            <svg className="w-6 h-6 text-black mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            {viewMode === 'list' ? 'Task List' : 'Calendar View'}
          </h3>

          {/* View Toggle */}
          <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${viewMode === 'list' ? 'bg-white text-black shadow-sm' : 'text-gray-600 hover:text-black'}`}
            >
              <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
              List
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${viewMode === 'calendar' ? 'bg-white text-black shadow-sm' : 'text-gray-600 hover:text-black'}`}
            >
              <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Calendar
            </button>
          </div>
        </div>

        {/* Filters - Only show in list view */}
        {viewMode === 'list' && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <input
                placeholder="Filter by subject"
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-all duration-200"
                value={filters.subject}
                onChange={(e) => setFilters({ ...filters, subject: e.target.value })}
              />
              
              <select
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-all duration-200"
                value={filters.priority}
                onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
              >
                <option value="">All priorities</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
              
              <select
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-all duration-200"
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              >
                <option value="">All status</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </select>
              
              <select
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-all duration-200"
                value={filters.sortBy}
                onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
              >
                <option value="">Sort by</option>
                <option value="deadline:asc">Deadline ↑</option>
                <option value="deadline:desc">Deadline ↓</option>
                <option value="priority:asc">Priority ↑</option>
                <option value="priority:desc">Priority ↓</option>
                <option value="createdAt:desc">Newest</option>
                <option value="createdAt:asc">Oldest</option>
              </select>
              
              <button
                className="bg-black text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-800 transition-all duration-200 shadow-md hover:shadow-lg"
                onClick={load}
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}

        {/* Content */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
          </div>
        ) : viewMode === 'list' ? (
          <TaskList tasks={filtered} onEdit={setEditing} onDelete={handleDelete} />
        ) : (
          <Calendar tasks={filtered} onTaskUpdate={handleTaskUpdate} />
        )}
      </div>
    </div>
  );
}
