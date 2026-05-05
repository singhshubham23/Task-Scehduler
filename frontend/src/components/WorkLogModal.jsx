import { useState } from 'react';

const WorkLogModal = ({ isOpen, onClose, onSubmit }) => {
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!description.trim()) return;
    onSubmit({ description, date });
    setDescription('');
    setDate(new Date().toISOString().split('T')[0]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md glass border border-white/10 rounded-2xl shadow-2xl animate-scale-in p-6">
        <h3 className="text-xl font-bold text-white mb-4">Log Daily Work</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">What did you work on today?</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input-field min-h-[120px] resize-none"
              placeholder="E.g., Completed API integration for authentication and started working on the dashboard UI..."
              required
            />
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button type="button" onClick={onClose} className="btn-secondary text-sm px-6">
              Cancel
            </button>
            <button type="submit" className="btn-primary text-sm px-6">
              Submit Log
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WorkLogModal;
