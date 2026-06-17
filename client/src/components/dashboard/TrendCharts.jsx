import Card from '../ui/Card';
import LineChart from '../charts/LineChart';
import { BarChart3 } from 'lucide-react';

export default function TrendCharts({ records = [] }) {
  // Extract last 7 records
  const sortedRecords = [...records]
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(-7);

  const labels = sortedRecords.map(r => {
    const d = new Date(r.date);
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
  });

  const scores = sortedRecords.map(r => r.healthScore);

  return (
    <Card className="h-full">
      <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-2">
        <BarChart3 size={18} className="text-emerald-500" /> Tren Health Score (7 Hari Terakhir)
      </h3>

      {scores.length > 0 ? (
        <div className="h-[260px] w-full">
          <LineChart
            data={scores}
            labels={labels}
            label="Health Score"
            color="#059669"
            fill={true}
          />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
          <span className="text-3xl">📈</span>
          <div className="space-y-1">
            <p className="font-semibold text-slate-700 dark:text-slate-300">Belum ada data visualisasi</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-[240px] mx-auto">
              Visualisasi grafik akan muncul setelah Anda menginput data setidaknya selama 2 hari berbeda.
            </p>
          </div>
        </div>
      )}
    </Card>
  );
}
