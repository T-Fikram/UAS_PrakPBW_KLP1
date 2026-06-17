import Card from '../ui/Card';
import { AlertCircle, CheckCircle, Info } from 'lucide-react';

export default function InsightsCard({ insights = [] }) {
  const getIcon = (type) => {
    switch (type) {
      case 'warning':
        return <AlertCircle className="text-rose-500 shrink-0 mt-0.5" size={18} />;
      case 'success':
        return <CheckCircle className="text-emerald-500 shrink-0 mt-0.5" size={18} />;
      default:
        return <Info className="text-sky-500 shrink-0 mt-0.5" size={18} />;
    }
  };

  const getBgColor = (type) => {
    switch (type) {
      case 'warning':
        return 'bg-rose-500/5 border-rose-500/10';
      case 'success':
        return 'bg-emerald-500/5 border-emerald-500/10';
      default:
        return 'bg-sky-500/5 border-sky-500/10';
    }
  };

  return (
    <Card className="h-full shadow-lg border-slate-200/50 dark:border-slate-850">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
          Insight Kesehatan Hari Ini
        </h3>
        {insights.length > 0 && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            LIVE ANALYSIS
          </div>
        )}
      </div>

      {insights.length > 0 ? (
        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
          {insights.map((insight, idx) => (
            <div
              key={idx}
              className={`flex gap-3 p-3.5 rounded-xl border ${getBgColor(insight.type)} animate-slide-in-up opacity-0 stagger-${(idx % 5) + 1} transition-all duration-300 hover:scale-[1.01]`}
            >
              {getIcon(insight.type)}
              <div>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  {insight.title}
                </p>
                <p className="text-xs text-slate-650 dark:text-slate-400 mt-0.5 leading-relaxed">
                  {insight.message}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-10 gap-3 text-center">
          <span className="text-3xl">✨</span>
          <div className="space-y-1">
            <p className="font-semibold text-slate-700 dark:text-slate-300">Belum ada insight</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-[240px] mx-auto">
              Silakan input data harian Anda terlebih dahulu agar sistem dapat menganalisis pola hidup Anda.
            </p>
          </div>
        </div>
      )}
    </Card>
  );
}
