import { useNavigate } from 'react-router-dom';
import { HiOutlineUsers, HiOutlineArrowRight } from 'react-icons/hi';

const ProjectCard = ({ project, delay = 0 }) => {
  const navigate = useNavigate();

  return (
    <div
      className="glass-card cursor-pointer group animate-slide-up"
      style={{ animationDelay: `${delay}ms` }}
      onClick={() => navigate(`/projects/${project._id}`)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500/20 to-primary-600/10 border border-primary-500/30 flex items-center justify-center">
          <span className="text-lg font-bold text-primary-400">
            {project.name.charAt(0).toUpperCase()}
          </span>
        </div>
        <HiOutlineArrowRight className="w-5 h-5 text-gray-500 group-hover:text-primary-400 group-hover:translate-x-1 transition-all duration-300" />
      </div>

      <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-primary-300 transition-colors">
        {project.name}
      </h3>
      <p className="text-sm text-gray-400 mb-4 line-clamp-2">
        {project.description}
      </p>

      <div className="flex items-center justify-between pt-4 border-t border-white/5">
        <div className="flex items-center gap-2 text-gray-400">
          <HiOutlineUsers className="w-4 h-4" />
          <span className="text-xs">
            {project.members?.length || 0} member{project.members?.length !== 1 ? 's' : ''}
          </span>
        </div>
        <span className="text-xs text-gray-500">
          {new Date(project.createdAt).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
};

export default ProjectCard;
