import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle2, Clock, MapPin, Package, Car, Download, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DriverCalendar = ({ rides = [], deliveries = [] }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [filterMode, setFilterMode] = useState('All');

  const handleDownload = () => {
    let csv = 'Date,Time,Task Type,Status,Location,Earnings (INR)\\n';
    Object.keys(taskMap).sort().forEach(date => {
      taskMap[date].tasks.forEach(task => {
        csv += `${date},${task.dateObj.toLocaleTimeString()},${task.taskType},${task.status},"${(task.pickupLocation?.address || task.location?.address || '').replace(/"/g, '""')}",${task.finalFare || task.price || 0}\\n`;
      });
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `revenue_report_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Aggregate tasks by date string (YYYY-MM-DD)
  const taskMap = useMemo(() => {
    const map = {};
    const processTask = (task, type) => {
      const dateObj = new Date(task.completedAt || task.updatedAt || task.createdAt);
      const dateKey = dateObj.toISOString().split('T')[0];
      if (!map[dateKey]) map[dateKey] = { tasks: [], totalEarnings: 0, completed: 0 };
      
      map[dateKey].tasks.push({ ...task, taskType: type, dateObj });
      if (task.status === 'Completed' || task.status === 'Delivered') {
        map[dateKey].completed++;
        map[dateKey].totalEarnings += (task.finalFare || task.price || 0);
      }
    };
    if (filterMode === 'All' || filterMode === 'Rides') rides.forEach(r => processTask(r, 'Ride'));
    if (filterMode === 'All' || filterMode === 'Deliveries') deliveries.forEach(d => processTask(d, 'Delivery'));
    
    // Sort tasks within each day
    Object.values(map).forEach(day => {
      day.tasks.sort((a, b) => b.dateObj - a.dateObj);
    });
    return map;
  }, [rides, deliveries, filterMode]);

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const getDayColor = (dateKey) => {
    const data = taskMap[dateKey];
    if (!data || data.completed === 0) return 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700';
    if (data.totalEarnings > 1000) return 'bg-emerald-100 dark:bg-emerald-900/40 border-emerald-300 dark:border-emerald-500/30';
    if (data.completed > 0) return 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-500/30';
    return 'bg-white dark:bg-gray-800';
  };

  const selectedDateKey = selectedDate.toISOString().split('T')[0];
  const selectedData = taskMap[selectedDateKey] || { tasks: [], totalEarnings: 0, completed: 0 };

  return (
    <div className="bg-white dark:bg-[#0F1117] rounded-[2rem] border border-gray-100 dark:border-white/5 shadow-xl overflow-hidden flex flex-col md:flex-row min-h-[600px]">
      {/* Calendar Section */}
      <div className="flex-1 p-6 border-b md:border-b-0 md:border-r border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-black/20">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">
            {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </h3>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
              {['All', 'Rides', 'Deliveries'].map(mode => (
                <button key={mode} onClick={() => setFilterMode(mode)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${filterMode === mode ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500 hover:text-gray-700'}`}>
                  {mode}
                </button>
              ))}
            </div>
            <button onClick={handleDownload} className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors">
              <Download size={14} /> Report
            </button>
            <div className="flex gap-1 ml-2 border-l border-gray-200 dark:border-gray-700 pl-3">
              <button onClick={prevMonth} className="p-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <ChevronLeft size={20} className="text-gray-600 dark:text-gray-300" />
              </button>
              <button onClick={nextMonth} className="p-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <ChevronRight size={20} className="text-gray-600 dark:text-gray-300" />
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
            <div key={d} className="text-center text-[10px] font-black text-gray-400 uppercase tracking-widest">{d}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: firstDayOfMonth }).map((_, i) => <div key={`empty-${i}`} />)}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const dateStr = new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toISOString().split('T')[0];
            const isSelected = selectedDateKey === dateStr;
            const data = taskMap[dateStr];

            return (
              <button
                key={day}
                onClick={() => setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day))}
                className={`relative aspect-square rounded-2xl border transition-all flex flex-col items-center justify-center p-1
                  ${getDayColor(dateStr)}
                  ${isSelected ? 'ring-2 ring-blue-500 shadow-lg scale-105 z-10' : 'border-transparent'}
                `}
              >
                <span className={`text-sm font-bold ${isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'}`}>{day}</span>
                {data && data.completed > 0 && (
                  <div className="absolute bottom-2 flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_5px_rgba(59,130,246,0.8)]" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Details Section */}
      <div className="w-full md:w-96 p-6 flex flex-col bg-white dark:bg-[#0A0B0F]">
        <h4 className="text-sm font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1">
          {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </h4>
        <div className="flex gap-4 mb-6">
          <div>
            <p className="text-2xl font-black text-gray-900 dark:text-white">{selectedData.completed}</p>
            <p className="text-[10px] font-bold text-gray-400 uppercase">Tasks</p>
          </div>
          <div className="w-px bg-gray-200 dark:bg-gray-800" />
          <div>
            <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">₹{selectedData.totalEarnings}</p>
            <p className="text-[10px] font-bold text-gray-400 uppercase">Earnings</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 space-y-3">
          <AnimatePresence mode="popLayout">
            {selectedData.tasks.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-10">
                <Clock size={40} className="mx-auto text-gray-300 dark:text-gray-700 mb-3" />
                <p className="text-sm font-bold text-gray-400">No tasks on this day</p>
              </motion.div>
            ) : (
              selectedData.tasks.map((task, i) => (
                <motion.div key={task._id || i} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                  className="bg-gray-50 dark:bg-[#11131A] p-4 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded-lg ${task.taskType === 'Ride' ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'}`}>
                        {task.taskType === 'Ride' ? <Car size={16} /> : <Package size={16} />}
                      </div>
                      <p className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-wider">{task.taskType}</p>
                    </div>
                    <span className="text-xs font-bold text-gray-500">{task.dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 font-medium mb-2">
                    <MapPin size={14} className="text-gray-400" />
                    <span className="truncate">{task.pickupLocation?.address || task.location?.address || 'Location Hidden'}</span>
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200 dark:border-white/5">
                    <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-full ${(task.status === 'Completed' || task.status === 'Delivered') ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                      {task.status}
                    </span>
                    <span className="font-black text-gray-900 dark:text-white">₹{task.finalFare || task.price || 0}</span>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default DriverCalendar;
