import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import StatCard from '../components/StatCard';
import toast from 'react-hot-toast';
import {
  HiOutlineClipboardList,
  HiOutlineCollection,
  HiOutlineClock,
  HiOutlineCheckCircle,
  HiOutlineExclamationCircle,
  HiOutlineLightningBolt,
  HiOutlineCalendar,
  HiOutlinePlay,
  HiOutlineCheck,
} from 'react-icons/hi';

const MemberDashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const res = await API.get('/tasks/stats/dashboard');
      setData(res.data);
    } catch (err) {
      console.error('Failed to fetch member dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStartTask = async (taskId) => {
    try {
      await API.patch(`/tasks/${taskId}/status`, { status: 'In Progress' });
      toast.success('Task started! It is now In Progress.');
      fetchData(); // Refresh
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to start task');
    }
  };

  const handleMoveToTodo = async (taskId) => {
    try {
      await API.patch(`/tasks/${taskId}/status`, { status: 'Todo' });
      toast.success('Task moved back to To Do.');
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update task');
    }
  };

  const handleSubmitForReview = async (task) => {
    const projectId = task.project?._id || task.project;
    if (!projectId) {
      toast.error('Project context is missing for this task');
      return;
    }

    try {
      await API.post(`/worklogs/${projectId}`, {
        description: `Submitted task "${task.title}" for admin review.`,
      });
      toast.success('Submitted for review. Admin can now approve completion.');
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit for review');
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
  const todoTasks = data?.todoTasks || [];
  const inProgressTasks = data?.inProgressTasks || [];
  const completedTasks = data?.completedTasks || [];

  const statCards = [
    { icon: HiOutlineClipboardList, label: 'Total Assigned', value: stats?.totalAssigned || 0, color: 'blue' },
    { icon: HiOutlineCollection, label: 'Projects', value: stats?.totalProjects || 0, color: 'purple' },
    { icon: HiOutlineClock, label: 'To Do', value: stats?.todo || 0, color: 'cyan' },
    { icon: HiOutlineLightningBolt, label: 'In Progress', value: stats?.inProgress || 0, color: 'amber' },
    { icon: HiOutlineCheckCircle, label: 'Completed', value: stats?.completed || 0, color: 'emerald' },
    { icon: HiOutlineExclamationCircle, label: 'Overdue', value: stats?.overdue || 0, color: 'rose' },
  ];

  const TaskColumn = ({ title, tasks, color, icon: Icon, columnKey, emptyMsg }) => (
    <div className="glass-card !p-0 overflow-hidden animate-slide-up">
      <div className={`p-4 border-b border-white/5 flex items-center gap-2`}>
        <Icon className={`w-5 h-5 text-${color}-400`} />
        <h3 className="text-base font-bold text-white">{title}</h3>
        <span className="ml-auto text-xs font-medium text-gray-500 bg-white/5 px-2.5 py-0.5 rounded-full">
          {tasks.length}
        </span>
      </div>
      <div className="divide-y divide-white/5 max-h-[350px] overflow-y-auto">
        {tasks.length === 0 ? (
          <div className="p-8 text-center text-gray-500 text-sm">{emptyMsg}</div>
        ) : (
          tasks.map((task) => {
            const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'Completed';
            return (
              <div key={task._id} className="px-4 py-3.5 hover:bg-white/[0.03] transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/projects/${task.project?._id || task.project}`}
                      className="text-sm font-medium text-white hover:text-primary-400 transition-colors truncate block"
                    >
                      {task.title}
                    </Link>
                    {task.project?.name && (
                      <p className="text-xs text-gray-500 mt-0.5">in {task.project.name}</p>
                    )}
                    {task.description && (
                      <p className="text-xs text-gray-400 mt-1 line-clamp-1">{task.description}</p>
                    )}
                    <div className="flex items-center gap-3 mt-2">
                      <span className={`badge ${
                        task.priority === 'High' ? 'badge-high' :
                        task.priority === 'Medium' ? 'badge-medium' : 'badge-low'
                      }`}>
                        {task.priority}
                      </span>
                      {task.dueDate && (
                        <div className={`flex items-center gap-1 text-xs ${isOverdue ? 'text-rose-400' : 'text-gray-500'}`}>
                          <HiOutlineCalendar className="w-3.5 h-3.5" />
                          <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                        </div>
                      )}
                      {isOverdue && (
                        <span className="badge bg-rose-500/30 text-rose-300 border border-rose-500/40">Overdue</span>
                      )}
                    </div>
                  </div>
                  <div className="shrink-0 flex flex-col gap-1.5">
                    {columnKey === 'todo' && (
                      <button
                        onClick={() => handleStartTask(task._id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold
                          bg-gradient-to-r from-primary-600 to-primary-500 text-white
                          hover:from-primary-500 hover:to-primary-400 shadow-lg shadow-primary-500/25
                          hover:shadow-primary-500/40 transition-all duration-300 hover:-translate-y-0.5"
                      >
                        <HiOutlinePlay className="w-3.5 h-3.5" />
                        Start
                      </button>
                    )}
                    {columnKey === 'inProgress' && (
                      <>
                        <button
                          onClick={() => handleSubmitForReview(task)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold
                            bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-all duration-200"
                        >
                          <HiOutlineCheck className="w-3.5 h-3.5" />
                          Submit
                        </button>
                        <button
                          onClick={() => handleMoveToTodo(task._id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
                            bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white transition-all duration-200"
                        >
                          Pause
                        </button>
                      </>
                    )}
                    {columnKey === 'completed' && (
                      <span className="text-xs text-emerald-400 font-medium px-2 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                        ✓ Approved
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">
          Hey, {user?.name} 👋
        </h1>
        <p className="text-gray-400 text-sm">Here's your personal task overview</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {statCards.map((card, i) => (
          <StatCard key={card.label} {...card} delay={i * 80} />
        ))}
      </div>

      {/* Task Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <TaskColumn
          title="To Do"
          tasks={todoTasks}
          color="blue"
          icon={HiOutlineClock}
          columnKey="todo"
          emptyMsg="No pending tasks! 🎉"
        />
        <TaskColumn
          title="In Progress"
          tasks={inProgressTasks}
          color="amber"
          icon={HiOutlineLightningBolt}
          columnKey="inProgress"
          emptyMsg="Nothing in progress."
        />
        <TaskColumn
          title="Completed"
          tasks={completedTasks}
          color="emerald"
          icon={HiOutlineCheckCircle}
          columnKey="completed"
          emptyMsg="No completed tasks yet."
        />
      </div>
    </div>
  );
};

export default MemberDashboard;
