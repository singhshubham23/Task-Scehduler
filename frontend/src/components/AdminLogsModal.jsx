import { HiOutlineX, HiOutlineCalendar, HiOutlineUser } from 'react-icons/hi';

const AdminLogsModal = ({ isOpen, onClose, logs, loading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl max-h-[85vh] flex flex-col glass border border-white/10 rounded-2xl shadow-2xl animate-scale-in">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <div>
            <h3 className="text-xl font-bold text-white">Team Work Logs</h3>
            <p className="text-sm text-gray-400">Recent daily updates from your team</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
            <HiOutlineX className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
            </div>
          ) : logs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No work logs submitted yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {logs.map((log) => (
                <div key={log._id} className="glass-card !p-4 !bg-white/[0.02]">
                  <div className="flex flex-wrap gap-4 items-center justify-between mb-3 border-b border-white/5 pb-3">
                    <div className="flex items-center gap-2 text-primary-400 font-medium text-sm">
                      <HiOutlineUser className="w-4 h-4" />
                      <span>{log.user?.name || 'Unknown User'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400 text-xs">
                      <HiOutlineCalendar className="w-4 h-4" />
                      <span>{new Date(log.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-300 whitespace-pre-wrap">{log.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
};

export default AdminLogsModal;
