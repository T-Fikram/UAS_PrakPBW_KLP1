import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import {
  LayoutDashboard,
  PlusCircle,
  History,
  BarChart3,
  LogOut,
  Sun,
  Moon,
  Heart,
  X,
  ChevronLeft,
  User,
} from 'lucide-react';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/input', icon: PlusCircle, label: 'Input Data' },
  { to: '/history', icon: History, label: 'Riwayat' },
  { to: '/visualization', icon: BarChart3, label: 'Visualisasi' },
  { to: '/profile', icon: User, label: 'Edit Profil' },
];

export default function Sidebar({ isOpen, onClose, collapsed, onToggleCollapse }) {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full z-50 flex flex-col
          bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700
          shadow-xl lg:shadow-none transition-all duration-300
          ${collapsed ? 'lg:w-20' : 'lg:w-64'}
          ${isOpen ? 'w-64 translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-slate-200 dark:border-slate-700">
          <div className="w-10 h-10 shrink-0">
            <img
              src="./icon.png"
              alt="HealthMirror Logo"
              className="w-full h-full object-contain"
            />
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <h1 className="text-lg font-bold gradient-text">HealthMirror</h1>
              <p className="text-[10px] text-slate-400">Digital Health Tracker</p>
            </div>
          )}

          {/* Mobile close */}
          <button onClick={onClose} className="ml-auto lg:hidden p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700">
            <X size={20} className="text-slate-500" />
          </button>

          {/* Desktop collapse */}
          <button
            onClick={onToggleCollapse}
            className="ml-auto hidden lg:flex p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            <ChevronLeft size={18} className={`text-slate-500 transition-transform ${collapsed ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* User info */}
        {!collapsed && (
          <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 flex items-center justify-center shrink-0">
                {/* Pulsing gradient ring */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-emerald-400 via-teal-550 to-sky-400 animate-pulse opacity-75" />
                <div className="w-[34px] h-[34px] rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-sm relative z-10 shadow-inner">
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{user?.name}</p>
                <p className="text-xs text-slate-400 truncate">{user?.email}</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) =>
                `sidebar-link group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium relative transition-all duration-300
                ${isActive ? 'active font-bold text-emerald-600 dark:text-emerald-450' : 'text-slate-600 dark:text-slate-400'}
                ${collapsed ? 'justify-center' : ''}`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon
                    size={20}
                    className={`shrink-0 transition-transform group-hover:scale-110 duration-300 
                      ${isActive ? 'text-emerald-500 dark:text-emerald-400 [filter:drop-shadow(0_0_3px_rgba(16,185,129,0.5))]' : 'group-hover:text-slate-800 dark:group-hover:text-slate-200'}`}
                  />
                  {!collapsed && <span>{item.label}</span>}
                  {collapsed && (
                    <span className="absolute left-full ml-4 px-2.5 py-1.5 bg-slate-950 text-white text-xs font-semibold rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap shadow-xl z-50 transform translate-x-[-6px] group-hover:translate-x-0 border border-slate-800">
                      {item.label}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Bottom actions */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-700 space-y-1">
          {/* Dark mode toggle */}
          <button
            onClick={toggleTheme}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors ${collapsed ? 'justify-center' : ''}`}
          >
            {isDark ? <Sun size={20} className="shrink-0" /> : <Moon size={20} className="shrink-0" />}
            {!collapsed && <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>}
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors ${collapsed ? 'justify-center' : ''}`}
          >
            <LogOut size={20} className="shrink-0" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
