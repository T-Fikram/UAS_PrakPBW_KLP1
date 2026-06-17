import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Bell, Check, Trash2, X, Info, AlertTriangle, Calendar, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';

export default function Navbar({ onMenuClick }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      setNotifications(res.data.notifications || []);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotifications();
      // Poll notifications every 30 seconds
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  // Click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications(prev =>
        prev.map(n => (n.id === id ? { ...n, isRead: true } : n))
      );
    } catch (error) {
      console.error('Failed to mark read:', error);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.patch('/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (error) {
      console.error('Failed to mark all read:', error);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    try {
      await api.delete(`/notifications/${id}`);
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Selamat Pagi';
    if (hour < 15) return 'Selamat Siang';
    if (hour < 18) return 'Selamat Sore';
    return 'Selamat Malam';
  };

  const formatDate = () => {
    return new Date().toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getQuote = () => {
    const quotes = [
      "Setiap langkah kecil adalah investasi untuk dirimu di masa depan.",
      "Kesehatan bukanlah tentang ukuran, ini tentang bagaimana perasaanmu.",
      "Hidrasi yang cukup hari ini membuat pikiranmu jernih esok hari.",
      "Tidur yang berkualitas adalah fondasi dari produktivitas yang hebat.",
      "Satu menit olahraga lebih baik daripada nol menit olahraga.",
      "Tubuhmu adalah cermin dari kebiasaan-kebiasaan kecil harianmu.",
      "Sayangi dirimu sendiri dengan memberi istirahat yang cukup malam ini."
    ];
    const day = new Date().getDate();
    return quotes[day % quotes.length];
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Baru saja';
    if (diffMins < 60) return `${diffMins} menit lalu`;
    if (diffHours < 24) return `${diffHours} jam lalu`;
    return `${diffDays} hari lalu`;
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return (
          <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <Sparkles size={15} />
          </div>
        );
      case 'warning':
        return (
          <div className="w-8 h-8 rounded-lg bg-rose-100 dark:bg-rose-500/15 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
            <AlertTriangle size={15} />
          </div>
        );
      case 'reminder':
        return (
          <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
            <Calendar size={15} />
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 rounded-lg bg-sky-100 dark:bg-sky-500/15 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0">
            <Info size={15} />
          </div>
        );
    }
  };

  const unreadNotifications = notifications.filter(n => !n.isRead);
  const unreadCount = unreadNotifications.length;

  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg border-b border-slate-200/50 dark:border-slate-700/50 overflow-visible">
      {/* Subtle animated gradient line at the bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-emerald-500 via-teal-400 to-sky-500 bg-[length:200%_auto] animate-shimmer-btn" />

      <div className="flex items-center justify-between px-4 sm:px-6 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <Menu size={22} />
          </button>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              {getGreeting()}, <span className="gradient-text">{user?.name?.split(' ')[0]}</span>! 👋
            </h2>
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-xs text-slate-500 dark:text-slate-400">
              <span className="font-semibold">{formatDate()}</span>
              <span className="hidden sm:inline text-slate-300 dark:text-slate-600">•</span>
              <span className="italic text-emerald-600 dark:text-emerald-400 font-medium">"{getQuote()}"</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Notifications Dropdown Container */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`relative p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors ${isOpen ? 'bg-slate-100 dark:bg-slate-700' : ''}`}
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
                </span>
              )}
            </button>

            {/* Dropdown Popover */}
            {isOpen && (
              <div className="absolute right-0 mt-2.5 w-80 sm:w-96 rounded-2xl bg-white dark:bg-slate-900 border border-slate-250 dark:border-slate-800 shadow-2xl z-50 overflow-hidden animate-slide-down">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                  <span className="font-bold text-sm text-slate-800 dark:text-white flex items-center gap-2">
                    Notifikasi
                    {unreadCount > 0 && (
                      <span className="px-1.5 py-0.5 rounded-full bg-rose-100 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 text-[10px] font-bold">
                        {unreadCount} baru
                      </span>
                    )}
                  </span>
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllRead}
                      className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Check size={12} /> Tandai semua dibaca
                    </button>
                  )}
                </div>

                {/* Notifications List */}
                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                  {notifications.length === 0 ? (
                    <div className="px-4 py-8 text-center text-slate-400 dark:text-slate-500">
                      <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-850 flex items-center justify-center mx-auto mb-3">
                        <Bell size={20} className="text-slate-355" />
                      </div>
                      <p className="text-xs font-medium">Tidak ada notifikasi baru</p>
                    </div>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => !notif.isRead && handleMarkAsRead(notif.id)}
                        className={`flex gap-3 p-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group relative ${!notif.isRead ? 'bg-emerald-50/30 dark:bg-emerald-500/5' : ''}`}
                      >
                        {getNotificationIcon(notif.type)}
                        <div className="flex-1 min-w-0 pr-4">
                          <div className="flex items-start justify-between gap-1 mb-0.5">
                            <h4 className={`text-xs font-bold truncate ${!notif.isRead ? 'text-slate-900 dark:text-white' : 'text-slate-655 dark:text-slate-400'}`}>
                              {notif.title}
                            </h4>
                            <span className="text-[10px] text-slate-400 shrink-0">
                              {formatTimeAgo(notif.createdAt)}
                            </span>
                          </div>
                          <p className={`text-xs leading-relaxed ${!notif.isRead ? 'text-slate-700 dark:text-slate-300 font-medium' : 'text-slate-500 dark:text-slate-400'}`}>
                            {notif.message}
                          </p>
                        </div>

                        {/* Read dot or Delete action */}
                        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center gap-2">
                          {!notif.isRead && (
                            <span className="w-2 h-2 rounded-full bg-emerald-500 group-hover:scale-0 transition-transform duration-200" />
                          )}
                          <button
                            onClick={(e) => handleDelete(notif.id, e)}
                            className="p-1 rounded-md text-slate-350 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-rose-500 dark:hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Footer */}
                <div className="border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      navigate('/profile', { state: { activeTab: 'notifications' } });
                    }}
                    className="w-full text-center py-2.5 text-xs text-slate-600 dark:text-slate-450 hover:text-emerald-600 dark:hover:text-emerald-450 font-bold transition-colors block"
                  >
                    Lihat Semua & Pengaturan
                  </button>
                </div>
              </div>
            )}
          </div>

          <div
            onClick={() => navigate('/profile')}
            className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-sky-500 flex items-center justify-center text-white font-bold text-sm shadow-md cursor-pointer hover:scale-105 transition-transform"
          >
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
        </div>
      </div>
    </header>
  );
}

