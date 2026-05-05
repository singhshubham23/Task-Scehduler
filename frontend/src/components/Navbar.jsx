import { HiOutlineMenuAlt2, HiOutlineBell } from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ onMenuToggle, title }) => {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-30 glass border-b border-white/10">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <HiOutlineMenuAlt2 className="w-6 h-6 text-gray-300" />
          </button>
          <div>
            <h2 className="text-xl font-bold text-white">{title}</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="p-2 rounded-xl hover:bg-white/10 transition-colors relative">
            <HiOutlineBell className="w-5 h-5 text-gray-300" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-primary-500 rounded-full" />
          </button>
          <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-white/10">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-xs font-bold text-white">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm font-medium text-gray-300">{user?.name}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
