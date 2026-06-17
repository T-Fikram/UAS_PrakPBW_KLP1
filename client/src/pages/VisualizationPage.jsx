import { useEffect, useState } from 'react';
import api from '../api/axios';
import Card from '../components/ui/Card';
import LineChart from '../components/charts/LineChart';
import BarChart from '../components/charts/BarChart';
import { Sliders, Moon, Droplet, Flame, Monitor, Heart } from 'lucide-react';

export default function VisualizationPage() {
  const [days, setDays] = useState(7);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrendData();
  }, [days]);

  const fetchTrendData = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/health/trends?days=${days}`);
      // Sort ascending by date
      const sorted = [...(res.data.records || [])].sort((a, b) => new Date(a.date) - new Date(b.date));
      setRecords(sorted);
    } catch (error) {
      console.error('Error fetching trend data:', error);
    } finally {
      setLoading(false);
    }
  };

  const labels = records.map(r => {
    const d = new Date(r.date);
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
  });

  const sleepData = records.map(r => r.sleepHours);
  const waterData = records.map(r => r.waterGlasses);
  const exerciseData = records.map(r => r.exerciseMinutes);
  const screenData = records.map(r => r.screenTimeHours);
  const scoreData = records.map(r => r.healthScore);

  const getAverage = (arr) => arr.length ? (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(1) : 0;
  
  const avgScore = getAverage(scoreData);
  const avgSleep = getAverage(sleepData);
  const avgWater = getAverage(waterData);
  const avgExercise = getAverage(exerciseData);
  const avgScreen = getAverage(screenData);

  const ranges = [
    { label: '7 Hari Terakhir', value: 7 },
    { label: '30 Hari Terakhir', value: 30 },
    { label: '90 Hari Terakhir', value: 90 },
  ];

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white sm:text-3xl">Visualisasi Tren Kesehatan</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Analisis pola tidur, hidrasi, olahraga, screen time, dan skor kesehatan harian Anda.
          </p>
        </div>

        {/* Range Selector */}
        <div className="flex bg-white dark:bg-slate-800 p-1 rounded-xl border border-slate-200/50 dark:border-slate-700/50 shadow-sm shrink-0">
          {ranges.map((range) => (
            <button
              key={range.value}
              onClick={() => setDays(range.value)}
              className={`
                px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-200
                ${days === range.value
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
                  : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-700/50'
                }
              `}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <div className="w-10 h-10 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
          <p className="text-sm text-slate-500">Menganalisis data grafik...</p>
        </div>
      ) : records.length > 0 ? (
        <div className="space-y-6">
          {/* Summary Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            <div className="p-4 rounded-2xl border border-slate-200/60 dark:border-slate-700/80 bg-white dark:bg-slate-800/40 shadow-sm flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-450 shrink-0">
                <Heart size={20} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 truncate">Rata-rata Skor</p>
                <p className="text-lg font-black text-slate-850 dark:text-white">{avgScore}<span className="text-[10px] font-normal text-slate-450">/100</span></p>
              </div>
            </div>

            <div className="p-4 rounded-2xl border border-slate-200/60 dark:border-slate-700/80 bg-white dark:bg-slate-800/40 shadow-sm flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 shrink-0">
                <Moon size={20} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-550 dark:text-slate-400 truncate">Rata-rata Tidur</p>
                <p className="text-lg font-black text-slate-850 dark:text-white">{avgSleep}<span className="text-[10px] font-normal text-slate-450"> jam</span></p>
              </div>
            </div>

            <div className="p-4 rounded-2xl border border-slate-200/60 dark:border-slate-700/80 bg-white dark:bg-slate-800/40 shadow-sm flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 shrink-0">
                <Droplet size={20} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-550 dark:text-slate-400 truncate">Rata-rata Air</p>
                <p className="text-lg font-black text-slate-850 dark:text-white">{avgWater}<span className="text-[10px] font-normal text-slate-450"> gelas</span></p>
              </div>
            </div>

            <div className="p-4 rounded-2xl border border-slate-200/60 dark:border-slate-700/80 bg-white dark:bg-slate-800/40 shadow-sm flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 shrink-0">
                <Flame size={20} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-550 dark:text-slate-400 truncate">Rata-rata Olahraga</p>
                <p className="text-lg font-black text-slate-850 dark:text-white">{avgExercise}<span className="text-[10px] font-normal text-slate-450"> mnt</span></p>
              </div>
            </div>

            <div className="p-4 rounded-2xl border border-slate-200/60 dark:border-slate-700/80 bg-white dark:bg-slate-800/40 shadow-sm flex items-center gap-3 col-span-2 sm:col-span-1">
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-500 shrink-0">
                <Monitor size={20} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-555 dark:text-slate-400 truncate">Rata-rata Screen</p>
                <p className="text-lg font-black text-slate-850 dark:text-white">{avgScreen}<span className="text-[10px] font-normal text-slate-450"> jam</span></p>
              </div>
            </div>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Health Score Trend (Full Width) */}
            <div className="md:col-span-2">
              <Card className="shadow-lg border-slate-200/50 dark:border-slate-850">
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-200 mb-6 flex items-center gap-2">
                  <Heart size={18} className="text-emerald-500 animate-pulse" /> Tren Health Score
                </h3>
                <div className="h-[280px]">
                  <LineChart
                    data={scoreData}
                    labels={labels}
                    label="Health Score"
                    color="#059669"
                    fill={true}
                  />
                </div>
              </Card>
            </div>

            {/* Sleep Hours Trend */}
            <Card className="shadow-lg border-slate-200/50 dark:border-slate-850">
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-200 mb-6 flex items-center gap-2">
                <Moon size={18} className="text-indigo-500" /> Durasi Tidur (jam)
              </h3>
              <div className="h-[220px]">
                <LineChart
                  data={sleepData}
                  labels={labels}
                  label="Durasi Tidur"
                  color="#6366f1"
                />
              </div>
            </Card>

            {/* Water Consumption Trend */}
            <Card className="shadow-lg border-slate-200/50 dark:border-slate-850">
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-200 mb-6 flex items-center gap-2">
                <Droplet size={18} className="text-blue-500" /> Konsumsi Air Putih (gelas)
              </h3>
              <div className="h-[220px]">
                <BarChart
                  data={waterData}
                  labels={labels}
                  label="Gelas Air"
                  color="#0ea5e9"
                />
              </div>
            </Card>

            {/* Exercise Minutes Trend */}
            <Card className="shadow-lg border-slate-200/50 dark:border-slate-850">
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-200 mb-6 flex items-center gap-2">
                <Flame size={18} className="text-rose-500" /> Durasi Olahraga (menit)
              </h3>
              <div className="h-[220px]">
                <BarChart
                  data={exerciseData}
                  labels={labels}
                  label="Menit Olahraga"
                  color="#f43f5e"
                />
              </div>
            </Card>

            {/* Screen Time Trend */}
            <Card className="shadow-lg border-slate-200/50 dark:border-slate-850">
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-200 mb-6 flex items-center gap-2">
                <Monitor size={18} className="text-amber-500" /> Screen Time (jam)
              </h3>
              <div className="h-[220px]">
                <LineChart
                  data={screenData}
                  labels={labels}
                  label="Screen Time"
                  color="#f59e0b"
                />
              </div>
            </Card>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center gap-4 bg-white dark:bg-slate-800 border border-slate-200/50 dark:border-slate-700/50 rounded-2xl shadow-sm">
          <Sliders className="text-slate-300 dark:text-slate-600 animate-pulse" size={48} />
          <div className="space-y-1">
            <p className="font-semibold text-slate-700 dark:text-slate-300">Data visualisasi belum tersedia</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-[320px] mx-auto leading-relaxed">
              Anda perlu melakukan penginputan data harian di halaman Input Data terlebih dahulu untuk memunculkan tren kesehatan di atas.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
