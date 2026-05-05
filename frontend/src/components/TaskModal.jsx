import { useState, useEffect } from 'react';

const TaskModal = ({ isOpen, onClose, onSubmit, task, projectMembers }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'Todo',
    priority: 'Medium',
    dueDate: '',
    assignedTo: ''
  });

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        status: task.status || 'Todo',
        priority: task.priority || 'Medium',
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
        assignedTo: task.assignedTo?._id || task.assignedTo || ''
      });
    } else {
      setFormData({
        title: '',
        description: '',
        status: 'Todo',
        priority: 'Medium',
        dueDate: '',
        assignedTo: ''
      });
    }
  }, [task, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg glass border border-white/10 rounded-2xl shadow-2xl animate-scale-in p-6">
        <h3 className="text-xl font-bold text-white mb-6">
          {task ? 'Edit Task' : 'Create New Task'}
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="input-field"
              placeholder="e.g., Update Database Schema"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="input-field min-h-[100px] resize-none"
              placeholder="Task details..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Status</label>
              <select name="status" value={formData.status} onChange={handleChange} className="input-field bg-surface-950 text-white">
                <option value="Todo" className="bg-surface-900 text-white">Todo</option>
                <option value="In Progress" className="bg-surface-900 text-white">In Progress</option>
                <option value="Completed" className="bg-surface-900 text-white">Completed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Priority</label>
              <select name="priority" value={formData.priority} onChange={handleChange} className="input-field bg-surface-950 text-white">
                <option value="Low" className="bg-surface-900 text-white">Low</option>
                <option value="Medium" className="bg-surface-900 text-white">Medium</option>
                <option value="High" className="bg-surface-900 text-white">High</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Due Date</label>
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Assign To</label>
              <select name="assignedTo" value={formData.assignedTo} onChange={handleChange} className="input-field bg-surface-950 text-white">
                <option value="" className="bg-surface-900 text-white">Unassigned</option>
                {projectMembers?.map((member) => (
                  <option key={member._id} value={member._id} className="bg-surface-900 text-white">
                    {member.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-8">
            <button type="button" onClick={onClose} className="btn-secondary text-sm px-6">
              Cancel
            </button>
            <button type="submit" className="btn-primary text-sm px-6">
              {task ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
