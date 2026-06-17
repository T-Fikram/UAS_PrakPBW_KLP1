export default function ProgressBar({ value = 0, max = 100, label, showValue = true, color, size = 'md' }) {
  const percentage = Math.min((value / max) * 100, 100);

  const getColor = () => {
    if (color) return color;
    if (percentage >= 80) return 'from-emerald-500 to-emerald-400';
    if (percentage >= 60) return 'from-blue-500 to-blue-400';
    if (percentage >= 40) return 'from-amber-500 to-amber-400';
    return 'from-rose-500 to-rose-400';
  };

  const heights = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  return (
    <div className="space-y-1.5">
      {(label || showValue) && (
        <div className="flex justify-between items-center text-sm">
          {label && <span className="font-medium text-slate-600 dark:text-slate-400">{label}</span>}
          {showValue && <span className="font-semibold text-slate-900 dark:text-white">{value}/{max}</span>}
        </div>
      )}
      <div className={`w-full ${heights[size]} bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden`}>
        <div
          className={`${heights[size]} bg-gradient-to-r ${getColor()} rounded-full transition-all duration-1000 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
