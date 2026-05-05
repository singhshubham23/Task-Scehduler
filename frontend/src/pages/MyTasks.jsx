import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import toast from 'react-hot-toast';
import {
  HiOutlineClock,
  HiOutlineLightningBolt,
  HiOutlineCheckCircle,
  HiOutlineCalendar,
  HiOutlinePlay,
  HiOutlineCheck,
} from 'react-icons/hi';

const MyTasks = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const res = await API.get('/tasks/stats/dashboard');
      setData(res.data);
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
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
      toast.success('Task moved to In Progress!');
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update task');
    }
  };

  const handleMoveToTodo = async (taskId) => {
    try {
      await API.patch(`/tasks/${taskId}/status`, { status: 'Todo' });
      toast.success('Task moved back to Todo');
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
      toast.success('Submitted for admin review');
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

  const todoTasks = data?.todoTasks || [];
  const inProgressTasks = data?.inProgressTasks || [];
  const completedTasks = data?.completedTasks || [];

  const columns = [
    {
      key: 'todo',
      title: 'To Do',
      tasks: todoTasks,
      color: 'blue',
      dot: 'bg-blue-400',
      border: 'border-blue-500/20',
      icon: HiOutlineClock,
    },
    {
      key: 'progress',
      title: 'In Progress',
      tasks: inProgressTasks,
      color: 'amber',
      dot: 'bg-amber-400',
      border: 'border-amber-500/20',
      icon: HiOutlineLightningBolt,
    },
    {
      key: 'completed',
      title: 'Completed',
      tasks: completedTasks,
      color: 'emerald',
      dot: 'bg-emerald-400',
      border: 'border-emerald-500/20',
      icon: HiOutlineCheckCircle,
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">My Tasks</h1>
        <p className="text-gray-400 text-sm">
          All tasks assigned to you across all projects
        </p>
      </div>

      {/* Kanban Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map((col) => (
          <div key={col.key} className={`rounded-2xl border ${col.border} bg-white/[0.02] p-4`}>
            <div className="flex items-center gap-2 mb-4 px-1">
              <span className={`w-2.5 h-2.5 rounded-full ${col.dot}`} />
              <h3 className="text-sm font-semibold text-gray-300">{col.title}</h3>
              <span className="ml-auto text-xs font-medium text-gray-500 bg-white/5 px-2 py-0.5 rounded-full">
                {col.tasks.length}
              </span>
            </div>
            <div className="space-y-3 min-h-[200px]">
              {col.tasks.length === 0 ? (
                <p className="text-xs text-gray-600 text-center py-8">No tasks</p>
              ) : (
                col.tasks.map((task) => {
                  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'Completed';
                  return (
                    <div key={task._id} className="glass-card !p-4 group">
                      {/* Badges */}
                      <div className="flex items-center gap-2 flex-wrap mb-3">
                        <span className={`badge ${
                          task.priority === 'High' ? 'badge-high' :
                          task.priority === 'Medium' ? 'badge-medium' : 'badge-low'
                        }`}>
                          {task.priority}
                        </span>
                        {isOverdue && (
                          <span className="badge bg-rose-500/30 text-rose-300 border border-rose-500/40">
                            Overdue
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <Link
                        to={`/projects/${task.project?._id || task.project}`}
                        className="text-sm font-semibold text-white hover:text-primary-400 transition-colors block mb-1"
                      >
                        {task.title}
                      </Link>
                      {task.description && (
                        <p className="text-xs text-gray-400 mb-3 line-clamp-2">{task.description}</p>
                      )}

                      {/* Meta */}
                      <div className="flex flex-col gap-1.5 mb-3">
                        {task.project?.name && (
                          <div className="text-xs text-gray-500">
                            📂 {task.project.name}
                          </div>
                        )}
                        {task.dueDate && (
                          <div className={`flex items-center gap-1.5 text-xs ${isOverdue ? 'text-rose-400' : 'text-gray-400'}`}>
                            <HiOutlineCalendar className="w-3.5 h-3.5" />
                            <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="pt-3 border-t border-white/5">
                        {col.key === 'todo' && (
                          <button
                            onClick={() => handleStartTask(task._id)}
                            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold
                              bg-gradient-to-r from-primary-600 to-primary-500 text-white
                              hover:from-primary-500 hover:to-primary-400 shadow-lg shadow-primary-500/25
                              hover:shadow-primary-500/40 transition-all duration-300"
                          >
                            <HiOutlinePlay className="w-3.5 h-3.5" />
                            Start Task
                          </button>
                        )}
                        {col.key === 'progress' && (
                          <div className="flex flex-col gap-2">
                            <button
                              onClick={() => handleSubmitForReview(task)}
                              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold
                                bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-all duration-200"
                            >
                              <HiOutlineCheck className="w-3.5 h-3.5" />
                              Submit for Review
                            </button>
                            <button
                              onClick={() => handleMoveToTodo(task._id)}
                              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium
                                bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white transition-all duration-200"
                            >
                              Move back to Todo
                            </button>
                          </div>
                        )}
                        {col.key === 'completed' && (
                          <div className="text-center text-xs text-emerald-400 py-1.5 font-medium">
                            ✓ Approved by Admin
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyTasks;
