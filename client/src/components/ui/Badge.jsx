const categoryStyles = {
  'Excellent': 'badge-excellent',
  'Good': 'badge-good',
  'Fair': 'badge-fair',
  'Needs Improvement': 'badge-needs-improvement',
};

export default function Badge({ category, size = 'md', className = '' }) {
  const sizes = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-3 py-1 text-xs',
    lg: 'px-4 py-1.5 text-sm',
  };

  return (
    <span className={`
      inline-flex items-center font-semibold rounded-full
      ${categoryStyles[category] || 'bg-slate-500 text-white'}
      ${sizes[size]}
      ${className}
    `}>
      {category}
    </span>
  );
}
