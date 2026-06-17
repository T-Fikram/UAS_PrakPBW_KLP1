import Card from '../ui/Card';
import ProgressBar from '../ui/ProgressBar';
import { Moon, Droplet, Flame, Monitor } from 'lucide-react';

export default function DailySummary({ record }) {
  const metrics = [
    {
      title: 'Durasi Tidur',
      value: record?.sleepHours || 0,
      max: 24,
      unit: 'jam',
      icon: Moon,
      color: 'from-purple-500 to-indigo-500',
      textColor: 'text-indigo-500',
      bgColor: 'bg-indigo-500/10',
    },
    {
      title: 'Konsumsi Air Putih',
      value: record?.waterGlasses || 0,
      max: 30,
      unit: 'gelas',
      icon: Droplet,
      color: 'from-sky-500 to-blue-500',
      textColor: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: 'Durasi Olahraga',
      value: record?.exerciseMinutes || 0,
      max: 300,
      unit: 'menit',
      icon: Flame,
      color: 'from-orange-500 to-rose-500',
      textColor: 'text-rose-500',
      bgColor: 'bg-rose-500/10',
    },
    {
      title: 'Screen Time',
      value: record?.screenTimeHours || 0,
      max: 24,
      unit: 'jam',
      icon: Monitor,
      color: 'from-amber-500 to-yellow-500',
      textColor: 'text-amber-500',
      bgColor: 'bg-amber-500/10',
    },
  ];

  return (
    <Card className="h-full shadow-lg border-slate-200/50 dark:border-slate-850">
      <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-6">
        Ringkasan Data Hari Ini
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {metrics.map((metric, idx) => (
          <div key={idx} className="p-4 rounded-2xl border border-slate-200/60 dark:border-slate-700/50 bg-white dark:bg-slate-800/40 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300 shadow-sm hover:shadow-md group">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl ${metric.bgColor} ${metric.textColor} relative overflow-hidden transition-transform duration-300 group-hover:scale-105`}>
                  {/* Pulsing ring inside background */}
                  <span className={`absolute inset-0 ${metric.bgColor} opacity-20 animate-pulse`} />
                  <metric.icon size={18} className="relative z-10" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">{metric.title}</p>
                  <p className="text-base font-black text-slate-800 dark:text-slate-100">
                    {metric.value} <span className="text-xs font-normal text-slate-400 dark:text-slate-500">{metric.unit}</span>
                  </p>
                </div>
              </div>

              {/* Mini Sparkline */}
              <div className="w-16 h-8 opacity-70 dark:opacity-50 group-hover:opacity-100 transition-opacity duration-300">
                <svg className={`w-full h-full ${metric.textColor}`} viewBox="0 0 50 20" fill="none">
                  <path
                    d={
                      metric.title === 'Durasi Tidur' ? "M 0 15 Q 12 5 25 12 T 50 8" :
                      metric.title === 'Konsumsi Air Putih' ? "M 0 18 Q 10 10 25 15 T 50 5" :
                      metric.title === 'Durasi Olahraga' ? "M 0 10 Q 15 18 30 5 T 50 12" :
                      "M 0 5 Q 12 15 25 8 T 50 16"
                    }
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="transition-all duration-500"
                  />
                </svg>
              </div>
            </div>
            
            <ProgressBar
              value={metric.value}
              max={metric.max}
              showValue={false}
              color={metric.color}
              size="sm"
            />
          </div>
        ))}
      </div>
    </Card>
  );
}
