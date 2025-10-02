import { useState, useCallback, useMemo } from 'react';
import { Calendar as BigCalendar, dateFnsLocalizer } from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import enUS from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import api from '../lib/api';

const DnDCalendar = withDragAndDrop(BigCalendar);

const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export default function Calendar({ tasks, onTaskUpdate }) {
  const [view, setView] = useState('month');
  const [date, setDate] = useState(new Date());

  // Get CSS class for event styling based on priority and status
  const getEventClassName = (priority, status) => {
    if (status === 'completed') return 'bg-green-500 border-green-600';
    
    switch (priority) {
      case 'high': return 'bg-red-500 border-red-600';
      case 'medium': return 'bg-yellow-500 border-yellow-600';
      case 'low': return 'bg-green-500 border-green-600';
      default: return 'bg-blue-500 border-blue-600';
    }
  };

  // Convert tasks to calendar events
  const events = useMemo(() => {
    return tasks
      .filter(task => task.deadline) // Only show tasks with deadlines
      .map(task => {
        const start = new Date(task.deadline);
        const end = new Date(task.deadline);
        // ensure at least 30 minutes duration for better DnD UX in week/day views
        end.setMinutes(end.getMinutes() + 30);
        return {
          id: task._id,
          title: task.title,
          start,
          end,
          allDay: view === 'month',
          resource: task,
          className: getEventClassName(task.priority, task.status),
        };
      });
  }, [tasks, view]);

  // Handle event drop (drag and drop to change date)
  const handleEventDrop = useCallback(async ({ event, start, end, isAllDay }) => {
    try {
      const newDeadline = start.toISOString();
      await api.put(`/tasks/${event.id}`, { deadline: newDeadline });
      if (onTaskUpdate) {
        onTaskUpdate({ ...event.resource, deadline: newDeadline });
      }
    } catch (error) {
      console.error('Failed to update task deadline:', error);
    }
  }, [onTaskUpdate]);

  // Handle event resize (week/day views)
  const handleEventResize = useCallback(async ({ event, start, end }) => {
    try {
      const newDeadline = start.toISOString();
      await api.put(`/tasks/${event.id}`, { deadline: newDeadline });
      if (onTaskUpdate) {
        onTaskUpdate({ ...event.resource, deadline: newDeadline });
      }
    } catch (error) {
      console.error('Failed to update task deadline:', error);
    }
  }, [onTaskUpdate]);

  // Custom event component to show priority and status
  const EventComponent = ({ event }) => (
    <div className="p-1 text-xs">
      <div className="font-medium text-white truncate">{event.title}</div>
      <div className="flex items-center gap-1 mt-1">
        <span className={`px-1 py-0.5 rounded text-xs ${
          event.resource.status === 'completed' 
            ? 'bg-green-600 text-white' 
            : 'bg-white/20 text-white'
        }`}>
          {event.resource.status}
        </span>
        <span className={`px-1 py-0.5 rounded text-xs ${
          event.resource.priority === 'high' ? 'bg-red-600' :
          event.resource.priority === 'medium' ? 'bg-yellow-600' :
          'bg-green-600'
        } text-white`}>
          {event.resource.priority}
        </span>
      </div>
    </div>
  );

  // Custom toolbar with view switcher
  const CustomToolbar = (toolbar) => (
    <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
      <div className="flex items-center space-x-2">
        <button
          onClick={() => toolbar.onNavigate('PREV')}
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <button
          onClick={() => toolbar.onNavigate('TODAY')}
          className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        >
          Today
        </button>
        
        <button
          onClick={() => toolbar.onNavigate('NEXT')}
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
        
        <h2 className="text-lg font-semibold text-gray-900 ml-4">
          {toolbar.label}
        </h2>
      </div>
      
      <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => toolbar.onView('month')}
          className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
            toolbar.view === 'month'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Month
        </button>
        <button
          onClick={() => toolbar.onView('week')}
          className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
            toolbar.view === 'week'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Week
        </button>
        <button
          onClick={() => toolbar.onView('day')}
          className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
            toolbar.view === 'day'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Day
        </button>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-xl font-semibold text-gray-900 flex items-center">
          <svg className="w-6 h-6 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Calendar View
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          Drag and drop tasks to change their due dates
        </p>
      </div>
      
      <div className="h-96 md:h-[600px] lg:h-[700px]">
        <DnDCalendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '100%' }}
          view={view}
          onView={setView}
          date={date}
          onNavigate={setDate}
          onEventDrop={handleEventDrop}
          onEventResize={handleEventResize}
          resizable
          popup
          components={{
            toolbar: CustomToolbar,
            event: EventComponent,
          }}
          eventPropGetter={(event) => ({
            className: event.className,
          })}
          messages={{
            noEventsInRange: 'No tasks due in this time range',
            showMore: (total) => `+${total} more tasks`,
          }}
          longPressThreshold={50}
        />
      </div>
      
      {/* Legend */}
      <div className="p-4 bg-gray-50 border-t border-gray-200">
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <span className="font-medium text-gray-700">Legend:</span>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <span>High Priority</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500 rounded"></div>
            <span>Medium Priority</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span>Low Priority / Completed</span>
          </div>
        </div>
      </div>
    </div>
  );
}
