import { forwardRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const Input = forwardRef(({ label, error, icon: Icon, className = '', type = 'text', ...props }, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 transition-colors">
          {label}
        </label>
      )}
      <div className="relative group">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors">
            <Icon size={18} />
          </div>
        )}
        
        <input
          ref={ref}
          type={inputType}
          className={`
            w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5
            text-sm text-slate-900 placeholder-slate-400 transition-all duration-300
            dark:border-slate-600 dark:bg-slate-700/50 dark:text-white dark:placeholder-slate-500
            focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10
            ${Icon ? 'pl-10' : ''}
            ${isPassword ? 'pr-10' : ''}
            ${error ? 'border-rose-500 dark:border-rose-500 focus:ring-rose-500/10 focus:border-rose-500' : ''}
            ${className}
          `}
          {...props}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors focus:outline-none"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {error && (
        <p className="text-xs text-rose-500 mt-1 font-medium animate-fade-in">⚠️ {error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
