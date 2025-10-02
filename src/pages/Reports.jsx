import { useEffect, useState } from 'react';
import api from '../lib/api';
import Charts from '../components/Charts';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export default function Reports() {
  const [stats, setStats] = useState({ completed: 0, pending: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({ subject: '', priority: '', status: '', from: '', to: '' });
  const [subjectOptions, setSubjectOptions] = useState([]);
  const [tasksForExport, setTasksForExport] = useState([]);
  const [exporters, setExporters] = useState(null);

  const total = stats.completed + stats.pending;
  const completionRate = total > 0 ? Math.round((stats.completed / total) * 100) : 0;

  async function load() {
    setIsLoading(true);
    try {
      const params = {};
      Object.entries(filters).forEach(([k, v]) => { if (v) params[k] = v; });
      const { data } = await api.get('/tasks/stats/dashboard', { params });
      setStats({ completed: data.completed, pending: data.pending });
      const listResp = await api.get('/tasks', { params });
      setTasksForExport(listResp.data.tasks || []);
    } catch (error) {
      console.error('Failed to load report stats:', error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    load();
    (async () => {
      try {
        const { data } = await api.get('/tasks/meta/subjects');
        setSubjectOptions(data.subjects || []);
      } catch (e) {}
    })();
  }, []);

  function downloadCSV(rows) {
    const header = ['Title','Subject','Priority','Status','Deadline'];
    const escape = (v='') => '"' + String(v).replace(/"/g,'""') + '"';
    const lines = [header.join(',')].concat(
      (rows||[]).map(t => [t.title, t.subject, t.priority, t.status, t.deadline ? new Date(t.deadline).toLocaleDateString() : ''].map(escape).join(','))
    );
    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'tasks.csv'; a.click(); URL.revokeObjectURL(url);
  }

  function downloadPDF(rows) {
    const doc = new jsPDF({ orientation: 'landscape' });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 14;
    const colXs = [margin, margin+90, margin+170, margin+230, margin+290];
    const colHeaders = ['Title','Subject','Priority','Status','Deadline'];
    let y = margin + 10;
    doc.setFontSize(14);
    doc.text('Tasks Report', margin, y);
    y += 10;
    doc.setFontSize(11);
    colHeaders.forEach((h, i) => doc.text(h, colXs[i], y));
    y += 8;
    doc.setDrawColor(200); doc.line(margin, y, pageWidth - margin, y); y += 6;
    const safeRows = Array.isArray(rows) ? rows : [];
    const drawRow = (cells) => {
      if (y > pageHeight - margin) {
        doc.addPage(); y = margin + 10; doc.setFontSize(11);
        colHeaders.forEach((h, i) => doc.text(h, colXs[i], y));
        y += 8; doc.setDrawColor(200); doc.line(margin, y, pageWidth - margin, y); y += 6;
      }
      cells.forEach((c, i) => doc.text(String(c), colXs[i], y));
      y += 8;
    };
    if (safeRows.length === 0) drawRow(['No data','-','-','-','-']);
    else safeRows.forEach((t) => drawRow([t.title||'-', t.subject||'-', t.priority||'-', t.status||'-', t.deadline?new Date(t.deadline).toLocaleDateString():'-']));
    doc.setFontSize(9);
    doc.text(`Generated: ${new Date().toLocaleString()}`, margin, pageHeight - 6);
    doc.save('tasks.pdf');
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gray-900 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Progress Reports</h1>
        <p className="text-gray-300 text-lg">Track your study progress and achievements</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[{label:'Total Tasks', value:total, icon:'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', color:'black'},
          {label:'Completed', value:stats.completed, icon:'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', color:'gray-700'},
          {label:'Completion Rate', value:completionRate+'%', icon:'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6', color:'gray-700'}].map((s,i)=>(
          <div key={i} className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 flex items-center gap-4">
            <div className={`p-3 rounded-lg bg-gray-100`}>
              <svg className={`w-6 h-6 text-${s.color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={s.icon}/>
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">{s.label}</p>
              <p className="text-2xl font-bold text-gray-900">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <div className="relative">
            <input
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="Subject"
              value={filters.subject}
              onChange={(e)=>setFilters({...filters, subject:e.target.value})}
              list="subjects-list"
            />
            <datalist id="subjects-list">{subjectOptions.map(s=><option key={s} value={s}/>)}</datalist>
          </div>
          <select className="px-4 py-2 border border-gray-300 rounded-lg" value={filters.priority} onChange={(e)=>setFilters({...filters, priority:e.target.value})}>
            <option value="">Any priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <select className="px-4 py-2 border border-gray-300 rounded-lg" value={filters.status} onChange={(e)=>setFilters({...filters, status:e.target.value})}>
            <option value="">Any status</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
          <input type="date" className="px-4 py-2 border border-gray-300 rounded-lg" value={filters.from} onChange={(e)=>setFilters({...filters, from:e.target.value})} />
          <input type="date" className="px-4 py-2 border border-gray-300 rounded-lg" value={filters.to} onChange={(e)=>setFilters({...filters, to:e.target.value})} />
        </div>
        <div className="mt-4 flex gap-3">
          <button onClick={load} className="bg-black text-white px-4 py-2 rounded-lg">Apply</button>
          <button onClick={()=>{setFilters({ subject:'', priority:'', status:'', from:'', to:'' }); setTimeout(load,0);}} className="px-4 py-2 border rounded-lg">Reset</button>
        </div>
      </div>

      {/* Progress + Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Progress Chart */}
        <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-200">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Progress Overview</h3>
            <p className="text-gray-600">Visual representation of your task completion status</p>
          </div>
          <div className="flex justify-center">
            <Charts completed={stats.completed} pending={stats.pending} setExporters={setExporters} bwTheme />
          </div>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="text-center p-4 bg-gray-100 rounded-lg border border-gray-200">
              <div className="text-2xl font-bold text-gray-900">{stats.completed}</div>
              <div className="text-sm text-gray-700">Tasks Completed</div>
            </div>
            <div className="text-center p-4 bg-gray-100 rounded-lg border border-gray-200">
              <div className="text-2xl font-bold text-gray-900">{stats.pending}</div>
              <div className="text-sm text-gray-700">Tasks Pending</div>
            </div>
          </div>
        </div>

        {/* Insights */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <svg className="w-6 h-6 text-gray-700 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
            </svg>
            Insights & Recommendations
          </h3>
          <div className="space-y-4">
            {completionRate >= 80 ? (
              <div className="p-4 bg-gray-100 border border-gray-300 rounded-lg">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-black mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-medium text-gray-900">Excellent Progress!</span>
                </div>
                <p className="text-gray-700 text-sm mt-1">You're maintaining a great completion rate. Keep up the excellent work!</p>
              </div>
            ) : completionRate >= 50 ? (
              <div className="p-4 bg-gray-100 border border-gray-300 rounded-lg">
                <div className="flex items-center">
                  <span className="font-medium text-gray-900">Good Progress</span>
                </div>
                <p className="text-gray-700 text-sm mt-1">You're making steady progress. Consider breaking down larger tasks into smaller ones.</p>
              </div>
            ) : (
              <div className="p-4 bg-gray-100 border border-gray-300 rounded-lg">
                <div className="flex items-center">
                  <span className="font-medium text-gray-900">Need Focus</span>
                </div>
                <p className="text-gray-700 text-sm mt-1">Focus on completing pending tasks. Start with high-priority items and set realistic deadlines.</p>
              </div>
            )}

            {stats.pending > 0 && (
              <div className="p-4 bg-gray-100 border border-gray-300 rounded-lg">
                <div className="flex items-center">
                  <span className="font-medium text-gray-900">Action Required</span>
                </div>
                <p className="text-gray-700 text-sm mt-1">You have {stats.pending} pending task{stats.pending !== 1 ? 's' : ''}. Review and prioritize them to stay on track.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Export */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Export</h3>
        <div className="flex flex-wrap gap-3">
          <button onClick={()=>downloadCSV(tasksForExport)} className="px-4 py-2 bg-black text-white rounded-lg">Export CSV (Tasks)</button>
          <button onClick={()=>downloadPDF(tasksForExport)} className="px-4 py-2 bg-black text-white rounded-lg">Export PDF (Tasks)</button>
        </div>
      </div>
    </div>
  );
}
