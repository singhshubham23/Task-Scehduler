import { HiOutlineUser, HiOutlineCalendar, HiOutlinePlay, HiOutlineCheck } from 'react-icons/hi';

const TaskCard = ({ task, onStatusChange, onEdit, onDelete, isAdmin, onSubmitForReview }) => {
  const statusStyles = {
    Todo: 'badge-todo',
    'In Progress': 'badge-progress',
    Completed: 'badge-completed',
  };

  const priorityStyles = {
    Low: 'badge-low',
    Medium: 'badge-medium',
    High: 'badge-high',
  };

  const isOverdue =
    task.dueDate &&
    new Date(task.dueDate) < new Date() &&
    task.status !== 'Completed';

  return (
    <div className="glass-card !p-4 group">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`badge ${statusStyles[task.status]}`}>{task.status}</span>
          <span className={`badge ${priorityStyles[task.priority]}`}>{task.priority}</span>
          {isOverdue && (
            <span className="badge bg-rose-500/30 text-rose-300 border border-rose-500/40">
              Overdue
            </span>
          )}
        </div>
      </div>

      <h4 className="text-sm font-semibold text-white mb-2">{task.title}</h4>
      {task.description && (
        <p className="text-xs text-gray-400 mb-3 line-clamp-2">{task.description}</p>
      )}

      <div className="flex flex-col gap-2 mb-3">
        {task.assignedTo && (
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <HiOutlineUser className="w-3.5 h-3.5" />
            <span>{task.assignedTo.name}</span>
          </div>
        )}
        {task.dueDate && (
          <div className={`flex items-center gap-2 text-xs ${isOverdue ? 'text-rose-400' : 'text-gray-400'}`}>
            <HiOutlineCalendar className="w-3.5 h-3.5" />
            <span>{new Date(task.dueDate).toLocaleDateString()}</span>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-1.5 pt-3 border-t border-white/5">
        {isAdmin ? (
          <>
            {task.status === 'Todo' && (
              <button
                onClick={() => onStatusChange(task._id, 'In Progress')}
                className="text-[10px] px-2.5 py-1 rounded-lg font-medium bg-amber-500/10 text-amber-400
                  hover:bg-amber-500/20 transition-all duration-200 flex items-center gap-1"
              >
                <HiOutlinePlay className="w-3 h-3" /> Move to Progress
              </button>
            )}
            {task.status === 'In Progress' && (
              <>
                <button
                  onClick={() => onStatusChange(task._id, 'Completed')}
                  className="text-[10px] px-2.5 py-1 rounded-lg font-semibold bg-emerald-500/10 text-emerald-400
                    hover:bg-emerald-500/20 transition-all duration-200 flex items-center gap-1"
                >
                  <HiOutlineCheck className="w-3 h-3" /> Approve & Complete
                </button>
                <button
                  onClick={() => onStatusChange(task._id, 'Todo')}
                  className="text-[10px] px-2 py-1 rounded-lg font-medium bg-white/5 text-gray-400
                    hover:bg-white/10 hover:text-white transition-all duration-200"
                >
                  Back to Todo
                </button>
              </>
            )}
            {task.status === 'Completed' && (
              <button
                onClick={() => onStatusChange(task._id, 'Todo')}
                className="text-[10px] px-2 py-1 rounded-lg font-medium bg-white/5 text-gray-400
                  hover:bg-white/10 hover:text-white transition-all duration-200"
              >
                Reopen
              </button>
            )}
            <button
              onClick={() => onEdit(task)}
              className="text-[10px] px-2 py-1 rounded-lg font-medium bg-primary-500/10 text-primary-400
                hover:bg-primary-500/20 transition-all duration-200 ml-auto"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(task._id)}
              className="text-[10px] px-2 py-1 rounded-lg font-medium bg-rose-500/10 text-rose-400
                hover:bg-rose-500/20 transition-all duration-200"
            >
              Delete
            </button>
          </>
        ) : (
          <>
            {task.status === 'Todo' && (
              <button
                onClick={() => onStatusChange(task._id, 'In Progress')}
                className="text-[10px] px-3 py-1.5 rounded-lg font-semibold
                  bg-gradient-to-r from-primary-600 to-primary-500 text-white
                  hover:from-primary-500 hover:to-primary-400 shadow-md shadow-primary-500/20
                  transition-all duration-200 flex items-center gap-1"
              >
                <HiOutlinePlay className="w-3 h-3" /> Start Task
              </button>
            )}
            {task.status === 'In Progress' && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onSubmitForReview && onSubmitForReview(task)}
                  className="text-[10px] px-2.5 py-1 rounded-lg font-semibold bg-emerald-500/10 text-emerald-400
                    hover:bg-emerald-500/20 transition-all duration-200 flex items-center gap-1"
                >
                  <HiOutlineCheck className="w-3 h-3" /> Submit for Review
                </button>
                <button
                  onClick={() => onStatusChange(task._id, 'Todo')}
                  className="text-[10px] px-2 py-1 rounded-lg font-medium bg-white/5 text-gray-400
                    hover:bg-white/10 hover:text-white transition-all duration-200"
                >
                  Pause
                </button>
              </div>
            )}
            {task.status === 'Completed' && (
              <span className="text-[10px] text-emerald-400 font-medium px-2 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                Completed and Approved
              </span>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
