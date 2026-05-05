import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  HiOutlineViewGrid,
  HiOutlineCollection,
  HiOutlineLogout,
  HiOutlineX,
  HiOutlineChip,
  HiOutlineUsers,
  HiOutlineClipboardList,
} from 'react-icons/hi';

const Sidebar = ({ isOpen, onClose }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const isAdmin = user?.role === 'admin';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const adminNav = [
    { to: '/dashboard', label: 'Dashboard', icon: HiOutlineViewGrid },
    { to: '/projects', label: 'Projects', icon: HiOutlineCollection },
    { to: '/team', label: 'Team Members', icon: HiOutlineUsers },
  ];

  const memberNav = [
    { to: '/dashboard', label: 'Dashboard', icon: HiOutlineViewGrid },
    { to: '/my-tasks', label: 'My Tasks', icon: HiOutlineClipboardList },
    { to: '/projects', label: 'Projects', icon: HiOutlineCollection },
  ];

  const navItems = isAdmin ? adminNav : memberNav;

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-72 glass border-r border-white/10
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static lg:z-auto`}
      >
        <div className="flex flex-col h-full">
          {/* Logo / Brand */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/25">
                <HiOutlineChip className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">TaskFlow</h1>
                <p className="text-xs text-gray-400">Team Manager</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <HiOutlineX className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* User Info */}
          <div className="px-6 py-4 border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-sm font-bold text-white">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
                <span className={`badge ${user?.role === 'admin' ? 'badge-admin' : 'badge-member'}`}>
                  {user?.role}
                </span>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                  ${
                    isActive
                      ? 'bg-primary-500/20 text-primary-300 border border-primary-500/30 shadow-lg shadow-primary-500/10'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`
                }
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-white/10">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium
                text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all duration-200"
            >
              <HiOutlineLogout className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
