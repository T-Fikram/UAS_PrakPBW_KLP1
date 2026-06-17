import { useState, useEffect } from 'react';

export default function CircularProgress({ value = 0, size = 160, strokeWidth = 10, label, sublabel }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    const duration = 1200;
    let startTime = null;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const easeProgress = progress * (2 - progress); // easeOutQuad
      setDisplayValue(Math.floor(start + easeProgress * (end - start)));
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [value]);

  const offset = circumference - (displayValue / 100) * circumference;

  const getGradientColors = () => {
    if (value >= 80) return ['#059669', '#34d399']; // Emerald -> Teal
    if (value >= 60) return ['#2563eb', '#3b82f6']; // Blue
    if (value >= 40) return ['#d97706', '#f59e0b']; // Amber
    return ['#dc2626', '#ef4444']; // Red
  };

  const getGlowColor = () => {
    if (value >= 80) return 'rgba(5, 150, 105, 0.4)';
    if (value >= 60) return 'rgba(37, 99, 235, 0.4)';
    if (value >= 40) return 'rgba(217, 119, 6, 0.4)';
    return 'rgba(220, 38, 38, 0.4)';
  };

  const colors = getGradientColors();
  const glow = getGlowColor();
  const gradId = `grad-${value}-${Math.floor(Math.random() * 1000)}`;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size + 24} height={size + 24} className="circular-progress-ring overflow-visible">
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={colors[0]} />
            <stop offset="100%" stopColor={colors[1]} />
          </linearGradient>
        </defs>
        
        {/* Spinning particle trail */}
        <circle
          cx={(size + 24) / 2}
          cy={(size + 24) / 2}
          r={radius + 8}
          fill="none"
          stroke={colors[0]}
          strokeWidth="1.5"
          strokeDasharray="4 8"
          className="animate-spin"
          style={{ animationDuration: '10s', opacity: value > 0 ? 0.5 : 0 }}
        />

        {/* Background circle */}
        <circle
          cx={(size + 24) / 2}
          cy={(size + 24) / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-slate-200 dark:text-slate-700/50"
        />
        
        {/* Glow effect */}
        <circle
          cx={(size + 24) / 2}
          cy={(size + 24) / 2}
          r={radius}
          fill="none"
          stroke={`url(#${gradId})`}
          strokeWidth={strokeWidth + 4}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="circular-progress-fill"
          style={{ filter: `drop-shadow(0 0 10px ${glow})`, opacity: displayValue > 0 ? 0.35 : 0 }}
        />
        
        {/* Progress circle */}
        <circle
          cx={(size + 24) / 2}
          cy={(size + 24) / 2}
          r={radius}
          fill="none"
          stroke={`url(#${gradId})`}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="circular-progress-fill"
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-3xl font-black text-slate-900 dark:text-white text-glow-primary">{displayValue}</span>
        {label && <span className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-0.5">{label}</span>}
        {sublabel && <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">{sublabel}</span>}
      </div>
    </div>
  );
}
