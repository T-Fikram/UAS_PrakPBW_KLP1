import { useEffect, useState } from 'react';
import api from '../api/axios';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import Pagination from '../components/ui/Pagination';
import Badge from '../components/ui/Badge';
import { Edit2, Trash2, Calendar, Search, SlidersHorizontal, Moon, Droplet, Flame, Monitor } from 'lucide-react';

export default function HistoryPage() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // Editing state
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [editSleep, setEditSleep] = useState(8);
  const [editWater, setEditWater] = useState(8);
  const [editExercise, setEditExercise] = useState(30);
  const [editScreen, setEditScreen] = useState(4);
  const [editError, setEditError] = useState('');
  const [editLoading, setEditLoading] = useState(false);

  useEffect(() => {
    fetchRecords();
  }, [page, startDate, endDate]);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: 10,
        sortBy: 'date',
        order: 'desc',
      };
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const res = await api.get('/health/records', { params });
      setRecords(res.data.records);
      setTotalPages(res.data.pagination.totalPages);
    } catch (error) {
      console.error('Error fetching records:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (record) => {
    setEditingRecord(record);
    setEditSleep(record.sleepHours);
    setEditWater(record.waterGlasses);
    setEditExercise(record.exerciseMinutes);
    setEditScreen(record.screenTimeHours);
    setEditError('');
    setIsEditOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditError('');
    setEditLoading(true);

    try {
      await api.put(`/health/records/${editingRecord.id}`, {
        sleepHours: parseFloat(editSleep),
        waterGlasses: parseInt(editWater),
        exerciseMinutes: parseInt(editExercise),
        screenTimeHours: parseFloat(editScreen),
      });

      setIsEditOpen(false);
      fetchRecords();
    } catch (err) {
      console.error(err);
      setEditError(err.response?.data?.message || 'Gagal memperbarui catatan.');
    } finally {
      setEditLoading(false);
    }
  };

  const handleDeleteClick = (id) => {
    setDeletingId(id);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await api.delete(`/health/records/${deletingId}`);
      setIsDeleteOpen(false);
      fetchRecords();
    } catch (error) {
      console.error('Error deleting record:', error);
      alert('Gagal menghapus catatan.');
    }
  };

  const handleResetFilters = () => {
    setStartDate('');
    setEndDate('');
    setPage(1);
  };

  const formatDate = (dateString) => {
    const d = new Date(dateString);
    return d.toLocaleDateString('id-ID', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white sm:text-3xl">Riwayat Data Kesehatan</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Kelola dan evaluasi rekam jejak pola hidup harian Anda.
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4 sm:p-5">
        <div className="flex flex-col md:flex-row md:items-end gap-4">
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Tanggal Mulai"
              type="date"
              icon={Calendar}
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setPage(1);
              }}
            />
            <Input
              label="Tanggal Selesai"
              type="date"
              icon={Calendar}
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              size="md"
              onClick={handleResetFilters}
              disabled={!startDate && !endDate}
            >
              Reset Filter
            </Button>
          </div>
        </div>
      </Card>

      {/* History Table */}
      <Card className="overflow-hidden p-0 border border-slate-200/50 dark:border-slate-800 shadow-lg">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-8 h-8 border-3 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
            <p className="text-xs text-slate-500">Memuat catatan...</p>
          </div>
        ) : records.length > 0 ? (
          <div>
            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    <th className="px-6 py-4">Tanggal</th>
                    <th className="px-6 py-4">Tidur</th>
                    <th className="px-6 py-4">Air Putih</th>
                    <th className="px-6 py-4">Olahraga</th>
                    <th className="px-6 py-4">Screen Time</th>
                    <th className="px-6 py-4">Health Score</th>
                    <th className="px-6 py-4 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                  {records.map((record) => (
                    <tr key={record.id} className="table-row-hover text-slate-700 dark:text-slate-300">
                      <td className="px-6 py-4 font-semibold whitespace-nowrap">{formatDate(record.date)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{record.sleepHours} jam</td>
                      <td className="px-6 py-4 whitespace-nowrap">{record.waterGlasses} gelas</td>
                      <td className="px-6 py-4 whitespace-nowrap">{record.exerciseMinutes} mnt</td>
                      <td className="px-6 py-4 whitespace-nowrap">{record.screenTimeHours} jam</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div 
                          className="flex items-center gap-2.5 tooltip cursor-help"
                          data-tooltip={`Tidur: ${record.sleepHours}j, Air: ${record.waterGlasses}g, Olahraga: ${record.exerciseMinutes}m, Screen: ${record.screenTimeHours}j`}
                        >
                          <span className="font-extrabold text-slate-900 dark:text-white w-6">{record.healthScore}</span>
                          <div className="w-16 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden hidden sm:block">
                            <div 
                              className="h-full rounded-full" 
                              style={{ 
                                width: `${record.healthScore}%`,
                                backgroundColor: record.healthScore >= 80 ? '#059669' : record.healthScore >= 60 ? '#3b82f6' : record.healthScore >= 40 ? '#f59e0b' : '#ef4444' 
                              }} 
                            />
                          </div>
                          <Badge category={record.category} size="sm" className="shadow-sm" />
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleEditClick(record)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(record.id)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="block lg:hidden divide-y divide-slate-100 dark:divide-slate-800">
              {records.map((record) => (
                <div key={record.id} className="p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-900 dark:text-white text-sm">{formatDate(record.date)}</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleEditClick(record)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(record.id)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2.5 text-xs text-slate-650 dark:text-slate-400 font-semibold">
                    <div className="flex items-center gap-1.5"><Moon size={13} className="text-indigo-400" /> Tidur: <strong className="text-slate-800 dark:text-slate-200">{record.sleepHours} jam</strong></div>
                    <div className="flex items-center gap-1.5"><Droplet size={13} className="text-sky-400" /> Air: <strong className="text-slate-800 dark:text-slate-200">{record.waterGlasses} gelas</strong></div>
                    <div className="flex items-center gap-1.5"><Flame size={13} className="text-rose-500" /> Olahraga: <strong className="text-slate-800 dark:text-slate-200">{record.exerciseMinutes} mnt</strong></div>
                    <div className="flex items-center gap-1.5"><Monitor size={13} className="text-amber-500" /> Screen: <strong className="text-slate-800 dark:text-slate-200">{record.screenTimeHours} jam</strong></div>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/40">
                    <span className="text-xs font-semibold text-slate-500">Health Score:</span>
                    <span className="font-extrabold text-slate-900 dark:text-white text-sm">{record.healthScore}</span>
                    <Badge category={record.category} size="sm" className="shadow-sm" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
            <span className="text-4xl">📂</span>
            <div className="space-y-1">
              <p className="font-semibold text-slate-700 dark:text-slate-300">Tidak ada catatan ditemukan</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-[280px]">
                Coba sesuaikan filter pencarian atau mulailah membuat rekaman baru.
              </p>
            </div>
          </div>
        )}

        <div className="p-4 border-t border-slate-200/50 dark:border-slate-800">
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      </Card>

      {/* Edit Record Modal */}
      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Edit Data Kesehatan">
        <form onSubmit={handleEditSubmit} className="space-y-5">
          {editError && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-semibold">
              ⚠️ {editError}
            </div>
          )}

          {/* Sleep Hours Slider */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Moon className="text-indigo-500 animate-bounce-subtle" size={14} /> Durasi Tidur (jam)
              </label>
              <span className="text-xs font-bold text-slate-900 dark:text-white bg-indigo-500/10 px-2 py-0.5 rounded">{editSleep} jam</span>
            </div>
            <input
              type="range"
              min="0"
              max="24"
              step="0.5"
              value={editSleep}
              onChange={(e) => setEditSleep(parseFloat(e.target.value))}
              className="w-full custom-slider cursor-pointer"
              style={{ background: 'linear-gradient(to right, rgba(244,63,94,0.25) 0%, rgba(244,63,94,0.25) 25%, rgba(34,197,94,0.25) 29%, rgba(34,197,94,0.25) 37.5%, rgba(244,63,94,0.25) 42%, rgba(244,63,94,0.25) 100%)' }}
            />
          </div>

          {/* Water Glasses Slider */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Droplet className="text-blue-500 animate-bounce-subtle" size={14} /> Konsumsi Air Putih (gelas)
              </label>
              <span className="text-xs font-bold text-slate-900 dark:text-white bg-blue-500/10 px-2 py-0.5 rounded">{editWater} gelas</span>
            </div>
            <input
              type="range"
              min="0"
              max="30"
              step="1"
              value={editWater}
              onChange={(e) => setEditWater(parseInt(e.target.value))}
              className="w-full custom-slider cursor-pointer"
              style={{ background: 'linear-gradient(to right, rgba(244,63,94,0.25) 0%, rgba(244,63,94,0.25) 25%, rgba(34,197,94,0.25) 27%, rgba(34,197,94,0.25) 100%)' }}
            />
          </div>

          {/* Exercise Minutes Slider */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Flame className="text-rose-500 animate-bounce-subtle" size={14} /> Durasi Olahraga (menit)
              </label>
              <span className="text-xs font-bold text-slate-900 dark:text-white bg-rose-500/10 px-2 py-0.5 rounded">{editExercise} mnt</span>
            </div>
            <input
              type="range"
              min="0"
              max="300"
              step="5"
              value={editExercise}
              onChange={(e) => setEditExercise(parseInt(e.target.value))}
              className="w-full custom-slider cursor-pointer"
              style={{ background: 'linear-gradient(to right, rgba(244,63,94,0.25) 0%, rgba(244,63,94,0.25) 10%, rgba(34,197,94,0.25) 10%, rgba(34,197,94,0.25) 100%)' }}
            />
          </div>

          {/* Screen Time Slider */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Monitor className="text-amber-500 animate-bounce-subtle" size={14} /> Screen Time (jam)
              </label>
              <span className="text-xs font-bold text-slate-900 dark:text-white bg-amber-500/10 px-2 py-0.5 rounded">{editScreen} jam</span>
            </div>
            <input
              type="range"
              min="0"
              max="24"
              step="0.5"
              value={editScreen}
              onChange={(e) => setEditScreen(parseFloat(e.target.value))}
              className="w-full custom-slider cursor-pointer"
              style={{ background: 'linear-gradient(to right, rgba(34,197,94,0.25) 0%, rgba(34,197,94,0.25) 16.6%, rgba(245,158,11,0.25) 16.6%, rgba(245,158,11,0.25) 29%, rgba(244,63,94,0.25) 29%, rgba(244,63,94,0.25) 100%)' }}
            />
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <Button variant="ghost" size="sm" type="button" onClick={() => setIsEditOpen(false)}>
              Batal
            </Button>
            <Button variant="primary" size="sm" type="submit" loading={editLoading} className="shadow-md">
              Perbarui Data
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} title="Hapus Data Kesehatan">
        <div className="space-y-4">
          <p className="text-sm text-slate-600 dark:text-slate-350 leading-relaxed">
            Apakah Anda yakin ingin menghapus data kesehatan untuk tanggal ini? Tindakan ini tidak dapat dibatalkan.
          </p>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" size="sm" onClick={() => setIsDeleteOpen(false)}>
              Batal
            </Button>
            <Button variant="danger" size="sm" onClick={handleConfirmDelete} className="shadow-md bg-rose-600 hover:bg-rose-700">
              Ya, Hapus Data
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
