import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import { Mail, Lock, Heart, ArrowLeft } from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Login gagal. Periksa kembali email dan password Anda.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen mesh-gradient flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative Floating Shapes */}
      <div className="absolute top-10 left-[15%] w-16 h-16 rounded-2xl bg-emerald-400/20 dark:bg-emerald-500/10 blur-sm animate-float" />
      <div className="absolute bottom-20 right-[15%] w-24 h-24 rounded-full bg-sky-400/20 dark:bg-sky-500/10 blur-sm animate-float" style={{ animationDelay: '1.5s' }} />
      <div className="absolute top-[60%] left-[8%] w-12 h-12 rounded-xl bg-purple-400/20 dark:bg-purple-500/10 blur-sm animate-float" style={{ animationDelay: '3s' }} />

      {/* Back to Home Link */}
      <div className="absolute top-6 left-6 sm:left-12">
        <Link
          to="/"
          className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
        >
          <ArrowLeft size={16} /> Kembali ke Beranda
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md z-10 animate-fade-in">
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/25">
            <Heart size={24} className="text-white" />
          </div>
        </div>
        <h2 className="text-center text-3xl font-black tracking-tight text-slate-900 dark:text-white">
          Selamat Datang Kembali
        </h2>
        <p className="mt-2 text-center text-sm text-slate-500 dark:text-slate-400">
          Masuk ke akun HealthMirror Anda
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10 px-4 sm:px-0">
        <Card className="animate-scale-in shadow-xl border-slate-200/50 dark:border-slate-800">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-semibold leading-relaxed">
                ⚠️ {error}
              </div>
            )}

            <Input
              label="Alamat Email"
              type="email"
              placeholder="nama@email.com"
              icon={Mail}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              icon={Lock}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div>
              <Button type="submit" className="w-full shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 transition-all duration-300" loading={loading}>
                Masuk ke Dashboard
              </Button>
            </div>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-slate-500 dark:text-slate-400">Belum punya akun? </span>
            <Link to="/register" className="font-semibold text-emerald-600 dark:text-emerald-400 hover:underline">
              Daftar di sini
            </Link>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-700/50 flex items-center justify-center gap-2 text-xs text-slate-400 dark:text-slate-500 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>1.240+ pengguna aktif melacak kesehatan hari ini</span>
          </div>
        </Card>
      </div>
    </div>
  );
}
