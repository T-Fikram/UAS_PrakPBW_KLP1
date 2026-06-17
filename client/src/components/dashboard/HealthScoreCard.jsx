import Card from '../ui/Card';
import CircularProgress from '../ui/CircularProgress';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function HealthScoreCard({ score, category, hasData }) {
  const navigate = useNavigate();

  return (
    <Card className="flex flex-col items-center justify-center text-center h-full relative overflow-hidden">
      <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-6 w-full text-left">
        Health Score Hari Ini
      </h3>

      {hasData ? (
        <div className="flex flex-col items-center gap-5 my-2 relative">
          {score >= 80 && (
            <>
              {/* Micro-sparkles for premium scores */}
              <div className="absolute top-2 left-0 text-yellow-400 text-lg animate-bounce-subtle" style={{ animationDelay: '0.2s' }}>✨</div>
              <div className="absolute bottom-16 right-0 text-yellow-400 text-lg animate-bounce-subtle" style={{ animationDelay: '0.7s' }}>✨</div>
            </>
          )}
          <div className="relative p-2 flex items-center justify-center">
            {/* Outer pulsing ring */}
            <div className="absolute inset-0 rounded-full bg-emerald-500/5 dark:bg-emerald-500/5 animate-ping" style={{ animationDuration: '4s' }} />
            <CircularProgress value={score} label="Score" />
          </div>
          <div className="space-y-1 z-10">
            <Badge category={category} size="lg" className="shadow-sm" />
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
              Berdasarkan evaluasi kebiasaan harian Anda.
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-8 gap-4 flex-1">
          <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-700/50 flex items-center justify-center text-slate-400 text-2xl">
            📊
          </div>
          <div className="space-y-1">
            <p className="font-semibold text-slate-700 dark:text-slate-300">Belum ada data hari ini</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-[200px]">
              Masukkan kebiasaan harian Anda untuk melihat cerminan kesehatan.
            </p>
          </div>
          <Button
            size="sm"
            onClick={() => navigate('/input')}
            className="mt-2"
          >
            <Plus size={16} /> Input Data
          </Button>
        </div>
      )}
    </Card>
  );
}
