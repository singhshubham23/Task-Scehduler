import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import StatCard from '../components/StatCard';
import {
  HiOutlineClipboardList,
  HiOutlineCollection,
  HiOutlineClock,
  HiOutlineCheckCircle,
  HiOutlineExclamationCircle,
  HiOutlineLightningBolt,
  HiOutlineCalendar,
} from 'react-icons/hi';

const Dashboard = () => {
  const [data, setData] = useState({ stats: null, myTasks: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.get('/tasks/stats/dashboard');
        // Handle both old and new backend response gracefully during transition
        if (res.data.stats) {
          setData(res.data);
        } else {
          setData({ stats: res.data, myTasks: [] });
        }
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
      </div>
    );
  }

  const { stats, myTasks } = data;

  const statCards = [
    { icon: HiOutlineClipboardList, label: 'Total Tasks', value: stats?.totalTasks || 0, color: 'blue' },
    { icon: HiOutlineCollection, label: 'Projects', value: stats?.totalProjects || 0, color: 'purple' },
    { icon: HiOutlineClock, label: 'To Do', value: stats?.todo || 0, color: 'cyan' },
    { icon: HiOutlineLightningBolt, label: 'In Progress', value: stats?.inProgress || 0, color: 'amber' },
    { icon: HiOutlineCheckCircle, label: 'Completed', value: stats?.completed || 0, color: 'emerald' },
    { icon: HiOutlineExclamationCircle, label: 'Overdue', value: stats?.overdue || 0, color: 'rose' },
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Dashboard Overview</h1>
        <p className="text-gray-400 text-sm">Track your team's progress at a glance</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {statCards.map((card, i) => (
          <StatCard key={card.label} {...card} delay={i * 80} />
        ))}
      </div>

      {/* Quick summary bar */}
      {stats && stats.totalTasks > 0 && (
        <div className="glass-card animate-slide-up" style={{ animationDelay: '500ms' }}>
          <h3 className="text-sm font-semibold text-gray-300 mb-4">Overall Completion Progress</h3>
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

      {/* My Tasks Section */}
      <div className="animate-slide-up" style={{ animationDelay: '600ms' }}>
        <h2 className="text-xl font-bold text-white mb-4">My Assigned Tasks</h2>
        {myTasks.length === 0 ? (
          <div className="glass-card flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
              <HiOutlineCheckCircle className="w-8 h-8 text-gray-500" />
            </div>
            <h3 className="text-gray-300 font-medium">No assigned tasks</h3>
            <p className="text-sm text-gray-500 mt-1">You're all caught up!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {myTasks.map((task) => {
              const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'Completed';
              return (
                <Link
                  key={task._id}
                  to={`/projects/${task.project?._id || task.project}`}
                  className="glass-card group hover:border-primary-500/30 transition-all duration-300 cursor-pointer block"
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className={`badge ${
                      task.status === 'Completed' ? 'badge-completed' :
                      task.status === 'In Progress' ? 'badge-progress' : 'badge-todo'
                    }`}>
                      {task.status}
                    </span>
                    {isOverdue && (
                      <span className="badge bg-rose-500/30 text-rose-300 border border-rose-500/40">
                        Overdue
                      </span>
                    )}
                  </div>
                  <h4 className="text-white font-semibold mb-2 group-hover:text-primary-400 transition-colors">
                    {task.title}
                  </h4>
                  {task.project?.name && (
                    <p className="text-xs text-gray-500 mb-3 line-clamp-1">
                      Project: <span className="text-gray-400">{task.project.name}</span>
                    </p>
                  )}
                  {task.dueDate && (
                    <div className={`flex items-center gap-2 text-xs mt-4 pt-3 border-t border-white/5 ${isOverdue ? 'text-rose-400' : 'text-gray-400'}`}>
                      <HiOutlineCalendar className="w-4 h-4" />
                      <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
