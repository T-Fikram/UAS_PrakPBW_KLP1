import { useState, useEffect } from 'react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import { Sparkles, Activity, Award } from 'lucide-react';

export default function WeeklyStats({ stats }) {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    if (!stats) return;
    let start = 0;
    const end = stats.avgScore || 0;
    const duration = 1200;
    let startTime = null;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const easeProgress = progress * (2 - progress); // easeOutQuad
      setAnimatedScore(Math.floor(start + easeProgress * (end - start)));
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [stats]);

  if (!stats) {
    return (
      <Card className="h-full flex flex-col justify-center items-center py-8">
        <Activity className="text-slate-300 dark:text-slate-600 mb-2" size={32} />
        <p className="text-sm font-semibold text-slate-500">Statistik belum tersedia</p>
        <p className="text-xs text-slate-400 mt-1 max-w-[200px] text-center">
          Dibutuhkan minimal satu data rekaman untuk kalkulasi statistik.
        </p>
      </Card>
    );
  }

  const statItems = [
    { label: 'Rata-rata Tidur', value: `${stats.avgSleep} jam`, raw: stats.avgSleep, type: 'sleep' },
    { label: 'Rata-rata Air Putih', value: `${stats.avgWater} gelas`, raw: stats.avgWater, type: 'water' },
    { label: 'Rata-rata Olahraga', value: `${stats.avgExercise} menit`, raw: stats.avgExercise, type: 'exercise' },
    { label: 'Rata-rata Screen Time', value: `${stats.avgScreenTime} jam`, raw: stats.avgScreenTime, type: 'screentime' },
  ];

  const getTrend = (type, val) => {
    const floatVal = parseFloat(val);
    let isPositive = false;
    if (type === 'sleep') isPositive = floatVal >= 7;
    else if (type === 'water') isPositive = floatVal >= 8;
    else if (type === 'exercise') isPositive = floatVal >= 30;
    else if (type === 'screentime') isPositive = floatVal <= 6;

    return isPositive ? (
      <span className="inline-flex items-center text-emerald-500 dark:text-emerald-400 font-bold text-[10px] bg-emerald-500/10 px-1.5 py-0.5 rounded ml-2">
        ↑ Sehat
      </span>
    ) : (
      <span className="inline-flex items-center text-rose-500 dark:text-rose-450 font-bold text-[10px] bg-rose-500/10 px-1.5 py-0.5 rounded ml-2">
        ↓ Kurang
      </span>
    );
  };

  return (
    <Card className="h-full flex flex-col justify-between shadow-lg border-slate-200/50 dark:border-slate-850">
      <div>
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
          <Sparkles size={18} className="text-emerald-500 animate-pulse" /> Statistik Mingguan
        </h3>

        {/* Big Health Score Avg */}
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-sky-500/10 border border-emerald-500/10 dark:border-emerald-400/10 mb-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/5 rounded-bl-full" />
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-white shrink-0 group-hover:scale-110 transition-transform duration-300">
            <Award size={24} />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Rata-rata Health Score</p>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-black text-slate-800 dark:text-white text-glow-primary">{animatedScore}</span>
              <span className="text-xs text-slate-400">/100</span>
              <Badge category={stats.category} size="sm" className="ml-1 shadow-sm" />
            </div>
          </div>
        </div>

        {/* Detailed averages */}
        <div className="grid grid-cols-2 gap-4">
          {statItems.map((item, idx) => (
            <div key={idx} className="p-3.5 rounded-xl border border-slate-200/60 dark:border-slate-700/50 bg-white dark:bg-slate-800/40 hover:border-slate-350 transition-all duration-300 shadow-sm">
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold truncate">{item.label}</p>
              <div className="flex items-center justify-between mt-1 flex-wrap gap-1">
                <p className="text-base font-extrabold text-slate-800 dark:text-slate-200">{item.value}</p>
                {getTrend(item.type, item.raw)}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-slate-200/60 dark:border-slate-700/50 pt-4 mt-6 flex justify-between text-xs text-slate-450 dark:text-slate-500 font-medium">
        <span>Skor Tertinggi: <strong className="text-slate-700 dark:text-slate-300 font-bold">{stats.bestScore}</strong></span>
        <span>Skor Terendah: <strong className="text-slate-700 dark:text-slate-300 font-bold">{stats.worstScore}</strong></span>
      </div>
    </Card>
  );
}
