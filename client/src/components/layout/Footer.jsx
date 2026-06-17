import { Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                <Heart size={16} className="text-white" />
              </div>
              <span className="text-lg font-bold text-white">HealthMirror</span>
            </div>
            <p className="text-sm leading-relaxed">
              Platform kesehatan digital yang membantu Anda memantau dan meningkatkan kualitas gaya hidup sehari-hari.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#features" className="hover:text-emerald-400 transition-colors">Fitur</a></li>
              <li><a href="#how-it-works" className="hover:text-emerald-400 transition-colors">Cara Kerja</a></li>
              <li><a href="#sdgs" className="hover:text-emerald-400 transition-colors">SDGs</a></li>
              <li><a href="/register" className="hover:text-emerald-400 transition-colors">Daftar</a></li>
            </ul>
          </div>

          {/* SDGs */}
          <div>
            <h4 className="text-white font-semibold mb-4">SDGs Support</h4>
            <p className="text-sm leading-relaxed">
              Mendukung SDGs Goal 3: Good Health and Well-Being — Menjamin kehidupan sehat dan mendorong kesejahteraan bagi semua.
            </p>
            <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-medium">
              🎯 SDGs Goal 3
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs">© {new Date().getFullYear()} HealthMirror. All rights reserved.</p>
          <p className="text-xs flex items-center gap-1">
            Made with <Heart size={12} className="text-rose-500" /> for a healthier life
          </p>
        </div>
      </div>
    </footer>
  );
}
