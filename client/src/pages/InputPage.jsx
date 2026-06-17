import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import CircularProgress from '../components/ui/CircularProgress';
import Badge from '../components/ui/Badge';
import { Moon, Droplet, Flame, Monitor, Calendar } from 'lucide-react';

export default function InputPage() {
  const navigate = useNavigate();
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [sleepHours, setSleepHours] = useState(8);
  const [waterGlasses, setWaterGlasses] = useState(8);
  const [exerciseMinutes, setExerciseMinutes] = useState(30);
  const [screenTimeHours, setScreenTimeHours] = useState(4);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [previewScore, setPreviewScore] = useState(100);
  const [previewCategory, setPreviewCategory] = useState('Excellent');

  // Recalculate preview health score in real-time
  useEffect(() => {
    const sleepScore = getSleepScore(sleepHours);
    const waterScore = getWaterScore(waterGlasses);
    const exerciseScore = getExerciseScore(exerciseMinutes);
    const screenScore = getScreenScore(screenTimeHours);

    const total = sleepScore + waterScore + exerciseScore + screenScore;
    setPreviewScore(total);

    if (total >= 80) setPreviewCategory('Excellent');
    else if (total >= 60) setPreviewCategory('Good');
    else if (total >= 40) setPreviewCategory('Fair');
    else setPreviewCategory('Needs Improvement');
  }, [sleepHours, waterGlasses, exerciseMinutes, screenTimeHours]);

  const getSleepScore = (hours) => {
    if (hours >= 7 && hours <= 9) return 25;
    if ((hours >= 6 && hours < 7) || (hours > 9 && hours <= 10)) return 15;
    return 5;
  };

  const getWaterScore = (glasses) => {
    if (glasses >= 8) return 25;
    if (glasses >= 5 && glasses <= 7) return 15;
    return 5;
  };

  const getExerciseScore = (minutes) => {
    if (minutes >= 30) return 25;
    if (minutes >= 10 && minutes <= 29) return 15;
    return 5;
  };

  const getScreenScore = (hours) => {
    if (hours <= 4) return 25;
    if (hours >= 5 && hours <= 7) return 15;
    return 5;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await api.post('/health/records', {
        date,
        sleepHours: parseFloat(sleepHours),
        waterGlasses: parseInt(waterGlasses),
        exerciseMinutes: parseInt(exerciseMinutes),
        screenTimeHours: parseFloat(screenTimeHours),
      });

      setSuccess('Data kesehatan hari ini berhasil disimpan!');
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Gagal menyimpan data kesehatan. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8 animate-fade-in">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-black text-slate-900 dark:text-white sm:text-3xl">Input Data Harian</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Catat pola aktivitas dan kebiasaan harian Anda untuk melihat cerminan kesehatan.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Input Form */}
        <div className="lg:col-span-2">
          <Card>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-semibold">
                  ⚠️ {error}
                </div>
              )}
              {success && (
                <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-xs font-semibold">
                  ✅ {success}
                </div>
              )}

              {/* Date Input */}
              <Input
                label="Tanggal Pencatatan"
                type="date"
                icon={Calendar}
                value={date}
                max={new Date().toISOString().split('T')[0]}
                onChange={(e) => setDate(e.target.value)}
                required
              />

              {/* Sleep Hours Slider */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    <Moon className="text-indigo-500 animate-bounce-subtle" size={18} /> Durasi Tidur
                  </label>
                  <span className="text-sm font-bold text-slate-900 dark:text-white bg-indigo-500/10 px-2 py-0.5 rounded-lg text-indigo-600 dark:text-indigo-400">
                    {sleepHours} <span className="text-xs font-normal">jam</span>
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="24"
                  step="0.5"
                  value={sleepHours}
                  onChange={(e) => setSleepHours(parseFloat(e.target.value))}
                  className="w-full custom-slider cursor-pointer"
                  style={{ background: 'linear-gradient(to right, rgba(244,63,94,0.25) 0%, rgba(244,63,94,0.25) 25%, rgba(34,197,94,0.25) 29%, rgba(34,197,94,0.25) 37.5%, rgba(244,63,94,0.25) 42%, rgba(244,63,94,0.25) 100%)' }}
                />
                <div className="flex justify-between text-[10px] text-slate-400 dark:text-slate-500 font-semibold">
                  <span>0 jam</span>
                  <span className="text-emerald-500 dark:text-emerald-400 font-bold">Rekomendasi: 7-9 jam</span>
                  <span>24 jam</span>
                </div>
              </div>

              {/* Water Cups Slider */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    <Droplet className="text-blue-500 animate-bounce-subtle" size={18} /> Konsumsi Air Putih
                  </label>
                  <span className="text-sm font-bold text-slate-900 dark:text-white bg-blue-500/10 px-2 py-0.5 rounded-lg text-blue-600 dark:text-blue-400">
                    {waterGlasses} <span className="text-xs font-normal">gelas</span>
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="30"
                  step="1"
                  value={waterGlasses}
                  onChange={(e) => setWaterGlasses(parseInt(e.target.value))}
                  className="w-full custom-slider cursor-pointer"
                  style={{ background: 'linear-gradient(to right, rgba(244,63,94,0.25) 0%, rgba(244,63,94,0.25) 25%, rgba(34,197,94,0.25) 27%, rgba(34,197,94,0.25) 100%)' }}
                />
                <div className="flex justify-between text-[10px] text-slate-400 dark:text-slate-500 font-semibold">
                  <span>0 gelas</span>
                  <span className="text-emerald-500 dark:text-emerald-400 font-bold">Rekomendasi: ≥ 8 gelas</span>
                  <span>30 gelas</span>
                </div>
              </div>

              {/* Exercise Minutes Slider */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    <Flame className="text-rose-500 animate-bounce-subtle" size={18} /> Durasi Olahraga
                  </label>
                  <span className="text-sm font-bold text-slate-900 dark:text-white bg-rose-500/10 px-2 py-0.5 rounded-lg text-rose-600 dark:text-rose-450">
                    {exerciseMinutes} <span className="text-xs font-normal">menit</span>
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="300"
                  step="5"
                  value={exerciseMinutes}
                  onChange={(e) => setExerciseMinutes(parseInt(e.target.value))}
                  className="w-full custom-slider cursor-pointer"
                  style={{ background: 'linear-gradient(to right, rgba(244,63,94,0.25) 0%, rgba(244,63,94,0.25) 10%, rgba(34,197,94,0.25) 10%, rgba(34,197,94,0.25) 100%)' }}
                />
                <div className="flex justify-between text-[10px] text-slate-400 dark:text-slate-500 font-semibold">
                  <span>0 mnt</span>
                  <span className="text-emerald-500 dark:text-emerald-400 font-bold">Rekomendasi: ≥ 30 mnt</span>
                  <span>300 mnt</span>
                </div>
              </div>

              {/* Screen Time Slider */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    <Monitor className="text-amber-500 animate-bounce-subtle" size={18} /> Screen Time
                  </label>
                  <span className="text-sm font-bold text-slate-900 dark:text-white bg-amber-500/10 px-2 py-0.5 rounded-lg text-amber-600 dark:text-amber-500">
                    {screenTimeHours} <span className="text-xs font-normal">jam</span>
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="24"
                  step="0.5"
                  value={screenTimeHours}
                  onChange={(e) => setScreenTimeHours(parseFloat(e.target.value))}
                  className="w-full custom-slider cursor-pointer"
                  style={{ background: 'linear-gradient(to right, rgba(34,197,94,0.25) 0%, rgba(34,197,94,0.25) 16.6%, rgba(245,158,11,0.25) 16.6%, rgba(245,158,11,0.25) 29%, rgba(244,63,94,0.25) 29%, rgba(244,63,94,0.25) 100%)' }}
                />
                <div className="flex justify-between text-[10px] text-slate-400 dark:text-slate-500 font-semibold">
                  <span>0 jam</span>
                  <span className="text-emerald-500 dark:text-emerald-400 font-bold">Rekomendasi: ≤ 4 jam</span>
                  <span>24 jam</span>
                </div>
              </div>

              <div className="pt-2">
                <Button type="submit" className="w-full shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 transition-all duration-300" loading={loading}>
                  Simpan Catatan Harian
                </Button>
              </div>
            </form>
          </Card>
        </div>

        {/* Live Preview Score */}
        <div className="lg:col-span-1">
          <Card className="flex flex-col items-center justify-center text-center p-6 sticky top-24 border-2 border-emerald-500/30 bg-white dark:bg-slate-850/80 shadow-xl relative overflow-hidden">
            {/* Sparkles on premium score */}
            {previewScore >= 80 && (
              <>
                <div className="absolute top-10 left-6 text-yellow-400 text-lg animate-bounce-subtle" style={{ animationDelay: '0.2s' }}>✨</div>
                <div className="absolute top-28 right-6 text-yellow-400 text-lg animate-bounce-subtle" style={{ animationDelay: '0.9s' }}>✨</div>
              </>
            )}
            
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200 mb-4">Real-Time Health Score</h3>
            
            {/* Emoji feedback */}
            <div className="text-4xl mb-4 animate-bounce-subtle">
              {previewScore >= 80 ? '🏆' : previewScore >= 60 ? '😊' : previewScore >= 40 ? '😐' : '😴'}
            </div>

            <div className="relative p-2 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-emerald-500/5 dark:bg-emerald-500/5 animate-ping" style={{ animationDuration: '4s' }} />
              <CircularProgress value={previewScore} label="Preview" />
            </div>

            <div className="space-y-2 mt-6 z-10">
              <Badge category={previewCategory} size="md" className="shadow-sm" />
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-[180px] mx-auto leading-relaxed">
                Skor ini didasarkan pada perhitungan langsung variabel di samping.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
