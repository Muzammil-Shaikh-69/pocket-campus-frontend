import dayjs from 'dayjs';

export default function TaskList({ tasks, onEdit, onDelete }) {
  const priorityColors = {
    low: 'bg-gray-200 text-black',
    medium: 'bg-gray-300 text-black',
    high: 'bg-gray-500 text-white',
  };

  const statusColors = {
    pending: 'bg-gray-300 text-black',
    completed: 'bg-gray-500 text-white',
  };

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-black">No tasks found</h3>
        <p className="mt-1 text-sm text-gray-500">Get started by creating your first task.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Mobile: vertical card list */}
      <div className="md:hidden divide-y divide-gray-100">
        {tasks.map((task) => (
          <div key={task._id} className="p-4">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 shrink-0 rounded-full bg-black flex items-center justify-center">
                <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-base font-semibold text-black truncate">{task.title}</div>
                {task.description && (
                  <div className="text-sm text-gray-700 mt-0.5">{task.description}</div>
                )}
                <div className="flex flex-wrap items-center gap-2 mt-3 text-sm">
                  <span className="text-black">{task.subject || '-'}</span>
                  <span className={`px-2 py-0.5 rounded-full ${priorityColors[task.priority]}`}>{task.priority}</span>
                  {task.deadline ? (
                    <span className="text-gray-700">{dayjs(task.deadline).format('MMM DD, YYYY')}</span>
                  ) : (
                    <span className="text-gray-400">No deadline</span>
                  )}
                  <span className={`px-2 py-0.5 rounded-full ${statusColors[task.status]}`}>{task.status}</span>
                </div>
                {/* Collapsible subtasks */}
                {task.subtasks && task.subtasks.length > 0 && (
                  <details className="mt-3 group">
                    <summary className="cursor-pointer text-sm text-black flex items-center gap-2 select-none">
                      <span className="group-open:rotate-90 transition-transform">▶</span>
                      {task.subtasks.filter(s => s.done).length}/{task.subtasks.length} completed
                    </summary>
                    <ul className="mt-2 space-y-1">
                      {task.subtasks.map((s, i) => (
                        <li key={i} className="text-sm text-black flex items-center gap-2">
                          <input type="checkbox" readOnly checked={!!s.done} />
                          <span className={s.done ? 'line-through text-gray-500' : ''}>{s.title}</span>
                        </li>
                      ))}
                    </ul>
                  </details>
                )}
                <div className="flex gap-3 mt-3">
                  <button onClick={() => onEdit(task)} className="text-black text-sm flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit
                  </button>
                  <button onClick={() => onDelete(task)} className="text-red-600 text-sm flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop: table */}
      <div className="hidden md:block">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-white">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-black uppercase tracking-wider">Task</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-black uppercase tracking-wider">Subject</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-black uppercase tracking-wider">Priority</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-black uppercase tracking-wider">Deadline</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-black uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-black uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tasks.map((task) => (
                <tr key={task._id} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-black flex items-center justify-center">
                          <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-black">{task.title}</div>
                        {task.description && (
                          <div className="text-sm text-gray-700 truncate max-w-xs">{task.description}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm text-black">{task.subject || '-'}</div></td>
                  <td className="px-6 py-4 whitespace-nowrap"><span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${priorityColors[task.priority]}`}>{task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}</span></td>
                  <td className="px-6 py-4 whitespace-nowrap">{task.deadline ? (<div className="text-sm text-black"><div>{dayjs(task.deadline).format('MMM DD, YYYY')}</div><div className="text-xs text-gray-700">{dayjs(task.deadline).format('dddd')}</div></div>) : (<span className="text-sm text-gray-400">No deadline</span>)}</td>
                  <td className="px-6 py-4 whitespace-nowrap"><span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColors[task.status]}`}>{task.status.charAt(0).toUpperCase() + task.status.slice(1)}</span></td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-3">
                      <button onClick={() => onEdit(task)} className="text-black hover:text-black transition-colors duration-200 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                        Edit
                      </button>
                      <button onClick={() => onDelete(task)} className="text-red-600 hover:text-red-900 transition-colors duration-200 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
