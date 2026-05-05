import { useState, useEffect } from 'react';
import API from '../api/axios';
import {
  HiOutlineUsers,
  HiOutlineMail,
  HiOutlineClipboardList,
  HiOutlineClock,
  HiOutlineLightningBolt,
  HiOutlineCheckCircle,
  HiOutlineCollection,
} from 'react-icons/hi';

const TeamMembers = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await API.get('/tasks/stats/team');
        setMembers(res.data);
      } catch (err) {
        console.error('Failed to fetch team members:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMembers();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Team Members</h1>
        <p className="text-gray-400 text-sm">
          {members.length} member{members.length !== 1 ? 's' : ''} across your projects
        </p>
      </div>

      {members.length === 0 ? (
        <div className="glass-card text-center py-16">
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
            <HiOutlineUsers className="w-8 h-8 text-gray-500" />
          </div>
          <h3 className="text-gray-300 font-medium">No team members yet</h3>
          <p className="text-sm text-gray-500 mt-1">Add members to your projects to see them here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {members.map((member, i) => {
            const total = member.taskCounts.todo + member.taskCounts.inProgress + member.taskCounts.completed;
            const completionPercent = total > 0
              ? Math.round((member.taskCounts.completed / total) * 100)
              : 0;

            return (
              <div
                key={member._id}
                className="glass-card animate-slide-up"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                {/* Header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-lg font-bold text-white shadow-lg">
                    {member.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-semibold truncate">{member.name}</h3>
                    <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-0.5">
                      <HiOutlineMail className="w-3.5 h-3.5" />
                      <span className="truncate">{member.email}</span>
                    </div>
                  </div>
                </div>

                {/* Task Stats */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="text-center p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20">
                    <HiOutlineClock className="w-4 h-4 text-blue-400 mx-auto mb-1" />
                    <p className="text-lg font-bold text-white">{member.taskCounts.todo}</p>
                    <p className="text-[10px] text-gray-400">To Do</p>
                  </div>
                  <div className="text-center p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
                    <HiOutlineLightningBolt className="w-4 h-4 text-amber-400 mx-auto mb-1" />
                    <p className="text-lg font-bold text-white">{member.taskCounts.inProgress}</p>
                    <p className="text-[10px] text-gray-400">In Progress</p>
                  </div>
                  <div className="text-center p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                    <HiOutlineCheckCircle className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
                    <p className="text-lg font-bold text-white">{member.taskCounts.completed}</p>
                    <p className="text-[10px] text-gray-400">Done</p>
                  </div>
                </div>

                {/* Progress Bar */}
                {total > 0 && (
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Completion</span>
                      <span>{completionPercent}%</span>
                    </div>
                    <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary-500 to-emerald-500 rounded-full transition-all duration-700"
                        style={{ width: `${completionPercent}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Projects */}
                <div className="pt-3 border-t border-white/5">
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-2">
                    <HiOutlineCollection className="w-3.5 h-3.5" />
                    <span>Projects ({member.projects.length})</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {member.projects.map((p) => (
                      <span key={p._id} className="badge badge-member text-[10px]">
                        {p.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TeamMembers;
