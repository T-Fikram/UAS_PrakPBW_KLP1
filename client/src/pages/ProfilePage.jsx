import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import {
  User,
  Bell,
  Mail,
  Lock,
  Save,
  Check,
  Trash2,
  AlertCircle,
  Sparkles,
  AlertTriangle,
  Calendar,
  Info,
  Clock
} from 'lucide-react';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const location = useLocation();

  // Determine active tab (either 'profile' or 'notifications')
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }
  }, [location]);

  // Profile Form States
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Status States
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');

  // Notifications States
  const [notifications, setNotifications] = useState([]);
  const [notifLoading, setNotifLoading] = useState(false);

  // Fetch Notifications
  const fetchNotifications = async () => {
    try {
      setNotifLoading(true);
      const res = await api.get('/notifications');
      setNotifications(res.data.notifications || []);
    } catch (err) {
      console.error('Error fetching notifications:', err);
    } finally {
      setNotifLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'notifications') {
      fetchNotifications();
    }
  }, [activeTab]);

  // Handle Profile Submit
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileSuccess('');
    setProfileError('');

    if (newPassword && newPassword !== confirmPassword) {
      setProfileError('Konfirmasi password baru tidak cocok.');
      return;
    }

    try {
      setProfileLoading(true);
      const res = await api.put('/auth/profile', {
        name,
        email,
        currentPassword: newPassword ? currentPassword : undefined,
        newPassword: newPassword ? newPassword : undefined,
      });

      updateUser(res.data.user);
      setProfileSuccess(res.data.message || 'Profil berhasil diperbarui!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      console.error('Update profile error:', err);
      const errMsg = err.response?.data?.message || err.response?.data?.errors?.[0] || 'Gagal memperbarui profil.';
      setProfileError(errMsg);
    } finally {
      setProfileLoading(false);
    }
  };

  // Mark one notification as read
  const handleMarkRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications(prev =>
        prev.map(n => (n.id === id ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      console.error('Error marking notification read:', err);
    }
  };

  // Mark all notifications as read
  const handleMarkAllRead = async () => {
    try {
      await api.patch('/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (err) {
      console.error('Error marking all read:', err);
    }
  };

  // Delete individual notification
  const handleDeleteNotif = async (id) => {
    try {
      await api.delete(`/notifications/${id}`);
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (err) {
      console.error('Error deleting notification:', err);
    }
  };

  // Clear all notifications
  const handleClearAllNotif = async () => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus semua riwayat notifikasi?')) return;
    try {
      await api.delete('/notifications');
      setNotifications([]);
    } catch (err) {
      console.error('Error clearing notifications:', err);
    }
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return (
          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-450 flex items-center justify-center shrink-0 shadow-sm">
            <Sparkles size={18} />
          </div>
        );
      case 'warning':
        return (
          <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-500/15 text-rose-600 dark:text-rose-455 flex items-center justify-center shrink-0 shadow-sm">
            <AlertTriangle size={18} />
          </div>
        );
      case 'reminder':
        return (
          <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 shadow-sm">
            <Calendar size={18} />
          </div>
        );
      default:
        return (
          <div className="w-10 h-10 rounded-xl bg-sky-100 dark:bg-sky-500/15 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0 shadow-sm">
            <Info size={18} />
          </div>
        );
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8 animate-fade-in">
      {/* Title Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          Pengaturan <span className="gradient-text">Akun & Profil</span>
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Kelola informasi profil pribadi Anda dan tinjau riwayat notifikasi kesehatan Anda.
        </p>
      </div>

      {/* Tab Switcher */}
      <div className="flex border-b border-slate-200 dark:border-slate-700 overflow-x-auto no-scrollbar gap-2">
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-2 px-4 py-3 border-b-2 text-sm font-semibold transition-all whitespace-nowrap cursor-pointer
            ${activeTab === 'profile'
              ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400 font-bold'
              : 'border-transparent text-slate-550 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}
        >
          <User size={18} />
          Edit Profil
        </button>
        <button
          onClick={() => setActiveTab('notifications')}
          className={`flex items-center gap-2 px-4 py-3 border-b-2 text-sm font-semibold transition-all whitespace-nowrap cursor-pointer
            ${activeTab === 'notifications'
              ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400 font-bold'
              : 'border-transparent text-slate-550 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}
        >
          <Bell size={18} />
          Riwayat Notifikasi
        </button>
      </div>

      {/* Tab 1: Edit Profil */}
      {activeTab === 'profile' && (
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/50 dark:border-slate-700/50 p-6 sm:p-8 shadow-xl relative overflow-hidden transition-colors">
          <form onSubmit={handleProfileSubmit} className="space-y-6">
            {profileSuccess && (
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200/50 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400 animate-slide-down">
                <Check size={20} className="shrink-0" />
                <p className="text-sm font-medium">{profileSuccess}</p>
              </div>
            )}

            {profileError && (
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200/50 dark:border-rose-500/20 text-rose-700 dark:text-rose-400 animate-slide-down">
                <AlertCircle size={20} className="shrink-0" />
                <p className="text-sm font-medium">{profileError}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Profile Details */}
              <div className="space-y-4">
                <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2 mb-2">
                  <User size={16} className="text-emerald-500" /> Detail Personal
                </h3>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
                    Nama Lengkap
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={18} />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Masukkan nama lengkap"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
                    Alamat Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={18} />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Masukkan email"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Password Changes */}
              <div className="space-y-4">
                <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2 mb-2">
                  <Lock size={16} className="text-indigo-500" /> Ubah Password (Opsional)
                </h3>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
                    Password Saat Ini
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={18} />
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Wajib diisi jika ubah password"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
                    Password Baru
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={18} />
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Minimal 6 karakter"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
                    Konfirmasi Password Baru
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={18} />
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Konfirmasi password baru"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Form actions */}
            <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-700/50">
              <button
                type="submit"
                disabled={profileLoading}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer transition-all shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 disabled:opacity-50"
              >
                {profileLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Save size={16} /> Simpan Perubahan
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tab 2: Riwayat Notifikasi */}
      {activeTab === 'notifications' && (
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/50 dark:border-slate-700/50 p-6 sm:p-8 shadow-xl transition-colors space-y-6">
          {/* Action Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-100 dark:border-slate-750">
            <div>
              <h3 className="font-bold text-slate-800 dark:text-white">Semua Notifikasi</h3>
              <p className="text-xs text-slate-500">Melihat dan mengelola riwayat notifikasi Anda.</p>
            </div>
            {notifications.length > 0 && (
              <div className="flex gap-2">
                <button
                  onClick={handleMarkAllRead}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-655 text-xs text-slate-750 dark:text-slate-200 font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Check size={14} /> Tandai semua dibaca
                </button>
                <button
                  onClick={handleClearAllNotif}
                  className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-500/10 dark:hover:bg-rose-500/20 text-xs text-rose-600 dark:text-rose-400 font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Trash2 size={14} /> Hapus semua
                </button>
              </div>
            )}
          </div>

          {/* List content */}
          {notifLoading ? (
            <div className="py-12 flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-3 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
              <p className="text-xs text-slate-500">Mengambil notifikasi...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="py-16 text-center text-slate-400 dark:text-slate-500 max-w-sm mx-auto">
              <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center mx-auto mb-4 border border-slate-150 dark:border-slate-800">
                <Bell size={24} className="text-slate-350" />
              </div>
              <h4 className="font-bold text-slate-850 dark:text-white mb-1">Riwayat Bersih</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Anda tidak memiliki notifikasi saat ini. Kami akan memberi tahu Anda di sini saat ada pembaruan kesehatan.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => !notif.isRead && handleMarkRead(notif.id)}
                  className={`flex gap-4 p-4 rounded-2xl border transition-all duration-300 relative group cursor-pointer
                    ${!notif.isRead
                      ? 'bg-emerald-50/20 dark:bg-emerald-500/5 border-emerald-500/20 dark:border-emerald-500/10 shadow-sm shadow-emerald-500/[0.02]'
                      : 'bg-slate-50/30 dark:bg-slate-900/10 border-slate-150 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40'}`}
                >
                  {getNotificationIcon(notif.type)}

                  <div className="flex-1 min-w-0 pr-8">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1.5">
                      <h4 className={`text-sm font-bold truncate ${!notif.isRead ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'}`}>
                        {notif.title}
                      </h4>
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-400 dark:text-slate-500 shrink-0 font-medium">
                        <Clock size={11} />
                        {formatDateTime(notif.createdAt)}
                      </div>
                    </div>
                    <p className={`text-xs sm:text-sm leading-relaxed ${!notif.isRead ? 'text-slate-700 dark:text-slate-300 font-medium' : 'text-slate-500 dark:text-slate-400'}`}>
                      {notif.message}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-3">
                    {!notif.isRead && (
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 group-hover:scale-0 transition-transform duration-200" title="Belum dibaca" />
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteNotif(notif.id);
                      }}
                      className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-rose-500 dark:hover:text-rose-400 transition-all opacity-0 group-hover:opacity-100"
                      title="Hapus notifikasi"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
