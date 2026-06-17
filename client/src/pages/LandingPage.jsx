import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Button from '../components/ui/Button';
import Footer from '../components/layout/Footer';
import {
  Heart,
  Moon,
  Droplet,
  Flame,
  Monitor,
  CheckCircle,
  TrendingUp,
  Award,
  ArrowRight,
  Sun,
  Shield
} from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  const [simulatedScore, setSimulatedScore] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = 85;
    const duration = 1500;
    let startTime = null;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const easeProgress = progress * (2 - progress); // easeOutQuad
      setSimulatedScore(Math.floor(easeProgress * end));
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    const timer = setTimeout(() => {
      requestAnimationFrame(animate);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200/50 dark:border-slate-800/50 transition-all duration-300">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/25">
              <Heart size={18} className="text-white" />
            </div>
            <span className="text-xl font-black gradient-text">HealthMirror</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {isAuthenticated ? (
              <Button size="sm" onClick={() => navigate('/dashboard')}>
                Dashboard <ArrowRight size={16} />
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate('/login')}
                  className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors"
                >
                  Masuk
                </button>
                <Button size="sm" onClick={() => navigate('/register')}>
                  Daftar
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden hero-gradient py-20 sm:py-32 flex-1 flex items-center">
        {/* Floating Decorative Orbs */}
        <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-emerald-400/15 dark:bg-emerald-500/10 blur-3xl animate-float" />
        <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-sky-400/15 dark:bg-sky-500/10 blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          <div className="text-center lg:text-left animate-slide-in-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold mb-6">
              ✨ Cermin Digital Kebiasaan Sehat Anda
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-slate-900 dark:text-white mb-6 break-words">
              Kenali Gaya Hidupmu Lewat <span className="gradient-text">HealthMirror</span>
            </h1>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed mb-6">
              Ubah kebiasaan harian seperti pola tidur, konsumsi air, olahraga, dan screen time menjadi skor terukur. Evaluasi kesehatan Anda secara objektif hari ini.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button size="lg" onClick={() => navigate(isAuthenticated ? '/dashboard' : '/register')}>
                Mulai Sekarang <ArrowRight size={18} />
              </Button>
              <a href="#features">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Pelajari Fitur
                </Button>
              </a>
            </div>
          </div>

          <div className="flex justify-center items-center animate-slide-in-right">
            <div className="relative w-full max-w-[420px]">
              <div className="absolute inset-0 bg-gradient-to-tr from-emerald-400 to-sky-400 rounded-3xl blur-3xl opacity-20 dark:opacity-30 animate-pulse-slow" />
              <div className="relative glass border border-white/40 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl animate-float">
                {/* Simulated Widget */}
                <div className="flex items-center justify-between mb-6">
                  <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">Skor Harian</span>
                  <span className="px-2.5 py-1 text-xs font-bold bg-emerald-500 text-white rounded-full shadow-md shadow-emerald-500/20">Excellent</span>
                </div>
                <div className="flex items-center justify-center mb-6">
                  <div className="relative w-36 h-36 flex items-center justify-center">
                    {/* Glowing outer rings */}
                    <div className="absolute inset-0 rounded-full bg-emerald-500/20 dark:bg-emerald-500/30 animate-ping" style={{ animationDuration: '3s' }} />
                    <div className="absolute inset-2 rounded-full border-4 border-dashed border-emerald-400/40 dark:border-emerald-500/30 animate-spin" style={{ animationDuration: '20s' }} />
                    <div className="w-28 h-28 rounded-full border-[8px] border-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/25 bg-white dark:bg-slate-800 relative z-10 transition-transform hover:scale-105 duration-300">
                      <span className="text-3xl font-black text-slate-800 dark:text-white text-glow-primary">{simulatedScore}</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="flex items-center gap-1.5 font-medium"><Moon size={14} className="text-indigo-400" /> Tidur</span>
                      <span className="font-bold">8 Jam (25 pts)</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div className="w-[85%] h-full bg-indigo-500 rounded-full transition-all duration-1000" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="flex items-center gap-1.5 font-medium"><Droplet size={14} className="text-sky-400" /> Air</span>
                      <span className="font-bold">9 Gelas (25 pts)</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div className="w-[90%] h-full bg-sky-500 rounded-full transition-all duration-1000" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 sm:py-28 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Mengapa Memilih HealthMirror?
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
              Membantu memantau kebiasaan penting Anda melalui visualisasi data dan insight cerdas tanpa kerumitan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="relative p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800/80 bg-white dark:bg-slate-800/40 card-hover group shadow-md hover:shadow-xl transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-inner">
                  <CheckCircle size={24} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Evaluasi Harian Cepat</h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  Hanya butuh 1 menit untuk mencatat tidur, air, olahraga, dan screen time harian Anda.
                </p>
              </div>
            </div>

            <div className="relative p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800/80 bg-white dark:bg-slate-800/40 card-hover group shadow-md hover:shadow-xl transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-sky-500/5 to-blue-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative">
                <div className="w-12 h-12 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-inner">
                  <TrendingUp size={24} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Visualisasi Tren</h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  Pantau grafik tren mingguan dan bulanan untuk memahami pola hidup Anda dari waktu ke waktu.
                </p>
              </div>
            </div>

            <div className="relative p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800/80 bg-white dark:bg-slate-800/40 card-hover group shadow-md hover:shadow-xl transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative">
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-inner">
                  <Award size={24} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Dynamic Insights</h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  Dapatkan rekomendasi otomatis berdasarkan data harian untuk membantu perbaikan pola hidup sehat.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 sm:py-28 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800/80 relative overflow-hidden">
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-800 to-transparent transform -translate-y-1/2 hidden md:block" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-sky-500/10 text-sky-600 dark:text-sky-400 rounded-full text-xs font-semibold animate-bounce-subtle">
              🚀 Alur Sederhana
            </div>
            <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Bagaimana HealthMirror Bekerja?
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base">
              Hanya dengan 3 langkah mudah untuk mulai melacak dan memperbaiki kebiasaan Anda.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-8 bg-white dark:bg-slate-800/60 rounded-3xl border border-slate-200/50 dark:border-slate-700/50 shadow-md hover:shadow-lg transition-all duration-305">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500 text-white flex items-center justify-center text-xl font-bold shadow-lg shadow-emerald-500/25 mb-6 relative">
                1
                <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-300 border-2 border-white dark:border-slate-800 animate-ping" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Input Data Harian</h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Catat tidur, konsumsi air, olahraga, dan screen time Anda melalui slider interaktif kami yang mudah digunakan.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-8 bg-white dark:bg-slate-800/60 rounded-3xl border border-slate-200/50 dark:border-slate-700/50 shadow-md hover:shadow-lg transition-all duration-305">
              <div className="w-14 h-14 rounded-2xl bg-sky-500 text-white flex items-center justify-center text-xl font-bold shadow-lg shadow-sky-500/25 mb-6">
                2
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Pantau Skor Kesehatan</h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Algoritma kami menghitung skor harian dari 0-100 secara instan untuk memberikan gambaran kualitas hidup Anda.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-8 bg-white dark:bg-slate-800/60 rounded-3xl border border-slate-200/50 dark:border-slate-700/50 shadow-md hover:shadow-lg transition-all duration-305">
              <div className="w-14 h-14 rounded-2xl bg-purple-500 text-white flex items-center justify-center text-xl font-bold shadow-lg shadow-purple-500/25 mb-6">
                3
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Dapatkan Tren & Insight</h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Lihat grafik perkembangan dari hari ke hari serta dapatkan insight cerdas yang disesuaikan secara otomatis.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SDGs Section */}
      <section id="sdgs" className="py-20 bg-gradient-to-r from-emerald-500/5 via-teal-500/5 to-emerald-500/5 dark:from-emerald-950/10 dark:to-emerald-950/10 border-t border-b border-emerald-500/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full text-xs font-semibold">
                🌍 SDGs Alignment
              </div>
              <h2 className="text-3xl font-black text-slate-900 dark:text-white">
                Mendukung SDGs Goal 3: Good Health & Well-Being
              </h2>
              <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
                HealthMirror berkomitmen penuh mendukung Sustainable Development Goals (SDGs) Goal 3 yang bertujuan menjamin kehidupan yang sehat dan meningkatkan kesejahteraan bagi seluruh penduduk di segala usia.
              </p>
              <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
                Melalui penyediaan dashboard pencatatan mandiri yang modern, kami memberdayakan masyarakat khususnya generasi muda dan mahasiswa untuk sadar dan secara berkala mengevaluasi kualitas pola tidur, hidrasi, aktivitas fisik, serta paparan radiasi layar secara mandiri demi terciptanya produktivitas yang seimbang dan sehat.
              </p>

              {/* SDG Goals Sub-cards */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-white/50 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-700/50 flex items-center gap-3">
                  <span className="text-2xl">🌱</span>
                  <div>
                    <h5 className="font-bold text-xs">Pola Hidup Sehat</h5>
                    <p className="text-[10px] text-slate-400">Pencegahan dini</p>
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-white/50 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-700/50 flex items-center gap-3">
                  <span className="text-2xl">⚡</span>
                  <div>
                    <h5 className="font-bold text-xs">Kesejahteraan Pemuda</h5>
                    <p className="text-[10px] text-slate-400">Mental & Fisik</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <div className="w-full max-w-[400px] border border-emerald-500/20 dark:border-emerald-500/10 p-8 rounded-3xl bg-white dark:bg-slate-800/80 shadow-xl flex flex-col items-center text-center gap-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-bl-full" />
                <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600 text-3xl shadow-inner animate-glow-pulse">
                  🎯
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Mengapa Ini Penting?</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Generasi muda dengan kesibukan tinggi rentan mengalami burnout, dehidrasi, kurang tidur, dan kecanduan gawai. Cermin kesehatan sederhana ini mengedukasi kebiasaan mikro agar tidak berkembang menjadi masalah kronis.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 sm:py-28 bg-white dark:bg-slate-900 text-center relative overflow-hidden">
        {/* Floating circles background */}
        <div className="absolute -top-20 -left-20 w-60 h-60 rounded-full bg-emerald-500/5 dark:bg-emerald-500/5 blur-2xl" />
        <div className="absolute -bottom-20 -right-20 w-60 h-60 rounded-full bg-sky-500/5 dark:bg-sky-500/5 blur-2xl" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6 relative z-10">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
            Mulai Ambil Kontrol Kesehatan Anda
          </h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-lg mx-auto text-sm sm:text-base leading-relaxed">
            Daftarkan diri Anda hari ini gratis dan pantau kebiasaan sehat secara objektif melalui cermin digital interaktif.
          </p>
          <div className="pt-2">
            <Button size="lg" onClick={() => navigate('/register')} className="shadow-lg shadow-emerald-500/20 hover:shadow-xl hover:shadow-emerald-500/30 transition-all duration-300">
              Daftar Sekarang <ArrowRight size={18} />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
