import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import KanbanBoard from '../components/KanbanBoard';
import TaskModal from '../components/TaskModal';
import WorkLogModal from '../components/WorkLogModal';
import AdminLogsModal from '../components/AdminLogsModal';
import toast from 'react-hot-toast';
import {
  HiOutlinePlus,
  HiOutlineArrowLeft,
  HiOutlineUserAdd,
  HiOutlineTrash,
  HiOutlineUsers,
  HiOutlineDocumentText,
} from 'react-icons/hi';

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [showAddMember, setShowAddMember] = useState(false);
  const [memberEmail, setMemberEmail] = useState('');
  
  const [showWorkLogModal, setShowWorkLogModal] = useState(false);
  const [showAdminLogsModal, setShowAdminLogsModal] = useState(false);
  const [workLogs, setWorkLogs] = useState([]);
  const [loadingLogs, setLoadingLogs] = useState(false);

  const isAdmin = user?.role === 'admin' && project?.admin?._id === user?.id;
  const isMember = project?.members?.some((m) => m._id === user?.id) || isAdmin;

  const fetchProject = async () => {
    try {
      const res = await API.get(`/projects/${id}`);
      setProject(res.data);
    } catch (err) {
      toast.error('Failed to load project');
      navigate('/projects');
    }
  };

  const fetchTasks = async () => {
    try {
      const res = await API.get(`/tasks/${id}`);
      setTasks(res.data);
    } catch (err) {
      toast.error('Failed to load tasks');
    }
  };

  useEffect(() => {
    const load = async () => {
      await Promise.all([fetchProject(), fetchTasks()]);
      setLoading(false);
    };
    load();
  }, [id]);

  const handleStatusChange = async (taskId, status) => {
    try {
      await API.patch(`/tasks/${taskId}/status`, { status });
      setTasks((prev) =>
        prev.map((t) => (t._id === taskId ? { ...t, status } : t))
      );
      toast.success(`Status updated to ${status}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status');
    }
  };

  const handleTaskSubmit = async (data) => {
    try {
      if (editingTask) {
        const res = await API.put(`/tasks/${editingTask._id}`, data);
        setTasks((prev) =>
          prev.map((t) => (t._id === editingTask._id ? res.data : t))
        );
        toast.success('Task updated');
      } else {
        const res = await API.post(`/tasks/${id}`, data);
        setTasks((prev) => [res.data, ...prev]);
        toast.success('Task created');
      }
      setShowTaskModal(false);
      setEditingTask(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save task');
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setShowTaskModal(true);
  };

  const handleDelete = async (taskId) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await API.delete(`/tasks/${taskId}`);
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
      toast.success('Task deleted');
    } catch (err) {
      toast.error('Failed to delete task');
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!memberEmail) return;
    try {
      const res = await API.put(`/projects/${id}/members`, { email: memberEmail });
      setProject(res.data);
      setMemberEmail('');
      setShowAddMember(false);
      toast.success('Member added');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add member');
    }
  };

  const handleWorkLogSubmit = async (data) => {
    try {
      await API.post(`/worklogs/${id}`, data);
      toast.success('Work log submitted successfully');
      setShowWorkLogModal(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit work log');
    }
  };

  const handleSubmitForReview = async (task) => {
    const projectId = task.project?._id || task.project || id;
    try {
      await API.post(`/worklogs/${projectId}`, {
        description: `Submitted task "${task.title}" for admin review.`,
      });
      toast.success('Task submitted for admin review');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit for review');
    }
  };

  const fetchWorkLogs = async () => {
    setLoadingLogs(true);
    setShowAdminLogsModal(true);
    try {
      const res = await API.get(`/worklogs/${id}`);
      setWorkLogs(res.data);
    } catch (err) {
      toast.error('Failed to fetch team work logs');
    } finally {
      setLoadingLogs(false);
    }
  };

  const handleDeleteProject = async () => {
    if (!window.confirm('Delete this project and all its tasks?')) return;
    try {
      await API.delete(`/projects/${id}`);
      toast.success('Project deleted');
      navigate('/projects');
    } catch (err) {
      toast.error('Failed to delete project');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/projects')}
            className="p-2 rounded-xl hover:bg-white/10 transition-colors"
          >
            <HiOutlineArrowLeft className="w-5 h-5 text-gray-400" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white">{project?.name}</h1>
            <p className="text-gray-400 text-sm">{project?.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {isMember && (
            <button
              onClick={() => setShowWorkLogModal(true)}
              className="btn-secondary flex items-center gap-2 text-sm"
            >
              <HiOutlineDocumentText className="w-4 h-4" /> Log Work
            </button>
          )}
          {isAdmin && (
            <>
              <button
                onClick={fetchWorkLogs}
                className="btn-secondary flex items-center gap-2 text-sm"
              >
                <HiOutlineDocumentText className="w-4 h-4" /> Team Logs
              </button>
              <button
                onClick={() => { setEditingTask(null); setShowTaskModal(true); }}
                className="btn-primary flex items-center gap-2 text-sm"
              >
                <HiOutlinePlus className="w-4 h-4" /> Add Task
              </button>
              <button
                onClick={() => setShowAddMember(true)}
                className="btn-secondary flex items-center gap-2 text-sm"
              >
                <HiOutlineUserAdd className="w-4 h-4" /> Add Member
              </button>
              <button
                onClick={handleDeleteProject}
                className="btn-danger flex items-center gap-2 text-sm !px-3"
              >
                <HiOutlineTrash className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Members bar */}
      <div className="glass-card !p-4 flex items-center gap-3 flex-wrap">
        <HiOutlineUsers className="w-5 h-5 text-gray-400" />
        <span className="text-sm text-gray-400">Members:</span>
        {project?.members?.map((m) => (
          <span key={m._id} className="badge badge-member">{m.name}</span>
        ))}
      </div>

      {/* Kanban Board */}
      <KanbanBoard
        tasks={tasks}
        onStatusChange={handleStatusChange}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isAdmin={isAdmin}
        onSubmitForReview={handleSubmitForReview}
      />

      {/* Task Modal */}
      <TaskModal
        isOpen={showTaskModal}
        onClose={() => { setShowTaskModal(false); setEditingTask(null); }}
        onSubmit={handleTaskSubmit}
        task={editingTask}
        projectMembers={project?.members || []}
      />

      {/* Add Member Modal */}
      {showAddMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowAddMember(false)} />
          <div className="relative w-full max-w-sm glass border border-white/10 rounded-2xl shadow-2xl animate-scale-in p-6">
            <h3 className="text-lg font-bold text-white mb-4">Add Member</h3>
            <form onSubmit={handleAddMember} className="space-y-4">
              <input
                type="email"
                value={memberEmail}
                onChange={(e) => setMemberEmail(e.target.value)}
                className="input-field"
                placeholder="member@example.com"
                required
              />
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setShowAddMember(false)} className="btn-secondary text-sm">Cancel</button>
                <button type="submit" className="btn-primary text-sm">Add</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Work Log Modals */}
      <WorkLogModal
        isOpen={showWorkLogModal}
        onClose={() => setShowWorkLogModal(false)}
        onSubmit={handleWorkLogSubmit}
      />
      <AdminLogsModal
        isOpen={showAdminLogsModal}
        onClose={() => setShowAdminLogsModal(false)}
        logs={workLogs}
        loading={loadingLogs}
      />
    </div>
  );
};

export default ProjectDetail;
