const variants = {
  primary: 'bg-emerald-600 hover:bg-emerald-750 text-white shadow-md shadow-emerald-500/10 btn-shimmer hover:-translate-y-0.5 hover:shadow-lg hover:shadow-emerald-500/20 active:translate-y-0',
  secondary: 'bg-sky-500 hover:bg-sky-600 text-white shadow-md shadow-sky-500/10 btn-shimmer hover:-translate-y-0.5 hover:shadow-lg hover:shadow-sky-500/20 active:translate-y-0',
  outline: 'border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white dark:border-emerald-400 dark:text-emerald-400 dark:hover:bg-emerald-400 dark:hover:text-slate-900 hover:-translate-y-0.5 active:translate-y-0',
  ghost: 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700',
  danger: 'bg-rose-500 hover:bg-rose-600 text-white shadow-md shadow-rose-500/10 btn-shimmer hover:-translate-y-0.5 hover:shadow-lg hover:shadow-rose-500/20 active:translate-y-0',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-3 text-base',
  xl: 'px-9 py-4 text-lg',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  loading = false,
  disabled = false,
  ...props
}) {
  return (
    <button
      className={`
        inline-flex items-center justify-center gap-2 rounded-xl font-semibold
        transition-all duration-300 active:scale-95 disabled:opacity-50
        disabled:cursor-not-allowed disabled:active:scale-100
        ${variants[variant]} ${sizes[size]} ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  );
}
