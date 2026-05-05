import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import StatCard from '../components/StatCard';
import toast from 'react-hot-toast';
import {
  HiOutlineClipboardList,
  HiOutlineCollection,
  HiOutlineCheckCircle,
  HiOutlineExclamationCircle,
  HiOutlineLightningBolt,
  HiOutlineUsers,
  HiOutlineCalendar,
  HiOutlineUser,
  HiOutlineDocumentText,
  HiOutlineCheck,
} from 'react-icons/hi';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const res = await API.get('/tasks/stats/dashboard');
      setData(res.data);
    } catch (err) {
      console.error('Failed to fetch admin dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await API.patch(`/tasks/${taskId}/status`, { status: newStatus });
      toast.success(`Task status updated to ${newStatus}`);
      fetchData(); // Refresh dashboard data
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update task status');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
      </div>
    );
  }

  const stats = data?.stats;
  const recentTasks = data?.recentTasks || [];
  const recentLogs = data?.recentLogs || [];

  const statCards = [
    { icon: HiOutlineClipboardList, label: 'Total Tasks', value: stats?.totalTasks || 0, color: 'blue' },
    { icon: HiOutlineCollection, label: 'Projects', value: stats?.totalProjects || 0, color: 'purple' },
    { icon: HiOutlineUsers, label: 'Team Members', value: stats?.totalMembers || 0, color: 'cyan' },
    { icon: HiOutlineLightningBolt, label: 'In Progress', value: stats?.inProgress || 0, color: 'amber' },
    { icon: HiOutlineCheckCircle, label: 'Completed', value: stats?.completed || 0, color: 'emerald' },
    { icon: HiOutlineExclamationCircle, label: 'Overdue', value: stats?.overdue || 0, color: 'rose' },
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">
          Welcome back, {user?.name} 👋
        </h1>
        <p className="text-gray-400 text-sm">Here's what's happening across your projects</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {statCards.map((card, i) => (
          <StatCard key={card.label} {...card} delay={i * 80} />
        ))}
      </div>

      {/* Completion Progress */}
      {stats && stats.totalTasks > 0 && (
        <div className="glass-card animate-slide-up" style={{ animationDelay: '500ms' }}>
          <h3 className="text-sm font-semibold text-gray-300 mb-4">Overall Completion</h3>
          <div className="w-full bg-white/5 rounded-full h-3 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary-500 to-emerald-500 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${Math.round((stats.completed / stats.totalTasks) * 100)}%` }}
            />
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-xs text-gray-500">
              {Math.round((stats.completed / stats.totalTasks) * 100)}% complete
            </span>
            <span className="text-xs text-gray-500">
              {stats.completed} of {stats.totalTasks} tasks
            </span>
          </div>
        </div>
      )}

      {/* Two Column Layout: Recent Tasks + Team Logs */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Recent Tasks Table */}
        <div className="glass-card animate-slide-up !p-0 overflow-hidden" style={{ animationDelay: '600ms' }}>
          <div className="p-5 border-b border-white/5">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <HiOutlineClipboardList className="w-5 h-5 text-primary-400" />
                Recent Tasks
              </h3>
              <Link to="/projects" className="text-xs text-primary-400 hover:text-primary-300 transition-colors">
                View All →
              </Link>
            </div>
          </div>
          <div className="divide-y divide-white/5 max-h-[420px] overflow-y-auto">
            {recentTasks.length === 0 ? (
              <div className="p-8 text-center text-gray-500 text-sm">No tasks yet. Create a project and add tasks!</div>
            ) : (
              recentTasks.map((task) => {
                const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'Completed';
                return (
                  <div
                    key={task._id}
                    className="flex items-center gap-3 px-5 py-3.5 hover:bg-white/[0.03] transition-colors"
                  >
                    <Link to={`/projects/${task.project?._id || task.project}`} className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate hover:text-primary-400 transition-colors">{task.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{task.project?.name}</p>
                    </Link>
                    {task.assignedTo && (
                      <div className="flex items-center gap-1.5 text-xs text-gray-400 shrink-0">
                        <HiOutlineUser className="w-3.5 h-3.5" />
                        <span className="truncate max-w-[80px]">{task.assignedTo.name}</span>
                      </div>
                    )}
                    <span className={`badge shrink-0 ${
                      task.status === 'Completed' ? 'badge-completed' :
                      task.status === 'In Progress' ? 'badge-progress' : 'badge-todo'
                    }`}>
                      {task.status}
                    </span>
                    {task.status === 'In Progress' && (
                      <button
                        onClick={() => handleStatusChange(task._id, 'Completed')}
                        className="shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold
                          bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-all duration-200"
                      >
                        <HiOutlineCheck className="w-3 h-3" />
                        Mark Completed
                      </button>
                    )}
                    {isOverdue && (
                      <span className="badge bg-rose-500/30 text-rose-300 border border-rose-500/40 shrink-0">
                        Overdue
                      </span>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Recent Team Logs */}
        <div className="glass-card animate-slide-up !p-0 overflow-hidden" style={{ animationDelay: '700ms' }}>
          <div className="p-5 border-b border-white/5">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <HiOutlineDocumentText className="w-5 h-5 text-emerald-400" />
              Recent Team Updates
            </h3>
          </div>
          <div className="divide-y divide-white/5 max-h-[420px] overflow-y-auto">
            {recentLogs.length === 0 ? (
              <div className="p-8 text-center text-gray-500 text-sm">No work logs submitted yet by team members.</div>
            ) : (
              recentLogs.map((log) => (
                <div key={log._id} className="px-5 py-4 hover:bg-white/[0.02] transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-[10px] font-bold text-white">
                        {log.user?.name?.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm font-medium text-primary-300">{log.user?.name}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <HiOutlineCalendar className="w-3.5 h-3.5" />
                      <span>{new Date(log.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 line-clamp-2 ml-9">{log.description}</p>
                  {log.project?.name && (
                    <p className="text-[10px] text-gray-600 ml-9 mt-1">in {log.project.name}</p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
