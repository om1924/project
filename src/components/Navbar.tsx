import { GraduationCap, ShieldCheck } from 'lucide-react';

type Props = {
  onNavigate: (view: 'home' | 'admin') => void;
  currentView: 'home' | 'admin';
};

export default function Navbar({ onNavigate, currentView }: Props) {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-blue-700 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-lg font-bold text-slate-800 leading-tight">UniFinder</h1>
              <p className="text-xs text-slate-500 leading-tight">University Finder</p>
            </div>
          </button>

          <nav className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('home')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentView === 'home'
                  ? 'bg-sky-50 text-sky-700'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Find College
            </button>
            <button
              onClick={() => onNavigate('admin')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                currentView === 'admin'
                  ? 'bg-sky-50 text-sky-700'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              Admin
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}
