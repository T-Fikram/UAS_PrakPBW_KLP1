export default function Card({ children, className = '', hover = false, glass = false, ...props }) {
  const baseClasses = 'rounded-2xl p-6 transition-all duration-300 card-gradient-border';
  const bgClasses = glass
    ? 'glass'
    : 'bg-white dark:bg-slate-800 border border-slate-200/50 dark:border-slate-700/50';
  const shadowClasses = 'shadow-sm hover:shadow-md';
  const hoverClasses = hover ? 'card-hover cursor-pointer' : '';

  return (
    <div className={`${baseClasses} ${bgClasses} ${shadowClasses} ${hoverClasses} ${className}`} {...props}>
      {children}
    </div>
  );
}
