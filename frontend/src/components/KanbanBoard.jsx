import TaskCard from './TaskCard';

const columns = [
  { key: 'Todo', label: 'To Do', color: 'blue' },
  { key: 'In Progress', label: 'In Progress', color: 'amber' },
  { key: 'Completed', label: 'Completed', color: 'emerald' },
];

const colDot = { blue: 'bg-blue-400', amber: 'bg-amber-400', emerald: 'bg-emerald-400' };
const colBorder = { blue: 'border-blue-500/20', amber: 'border-amber-500/20', emerald: 'border-emerald-500/20' };

const KanbanBoard = ({ tasks, onStatusChange, onEdit, onDelete, isAdmin, onSubmitForReview }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {columns.map((col) => {
        const colTasks = tasks.filter((t) => t.status === col.key);
        return (
          <div key={col.key} className={`rounded-2xl border ${colBorder[col.color]} bg-white/[0.02] p-4`}>
            <div className="flex items-center gap-2 mb-4 px-1">
              <span className={`w-2.5 h-2.5 rounded-full ${colDot[col.color]}`} />
              <h3 className="text-sm font-semibold text-gray-300">{col.label}</h3>
              <span className="ml-auto text-xs font-medium text-gray-500 bg-white/5 px-2 py-0.5 rounded-full">
                {colTasks.length}
              </span>
            </div>
            <div className="space-y-3 min-h-[120px]">
              {colTasks.length === 0 ? (
                <p className="text-xs text-gray-600 text-center py-8">No tasks</p>
              ) : (
                colTasks.map((task) => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    onStatusChange={onStatusChange}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    isAdmin={isAdmin}
                    onSubmitForReview={onSubmitForReview}
                  />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default KanbanBoard;
