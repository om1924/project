import { GraduationCap, ShieldCheck, LogIn, UserPlus, LogOut } from 'lucide-react';
import type { Session } from '@supabase/supabase-js';

type Props = {
  onNavigate: (view: 'home' | 'admin') => void;
  currentView: 'home' | 'admin';
  session: Session | null;
  onSignIn: () => void;
  onSignUp: () => void;
  onSignOut: () => void;
};

export default function Navbar({ onNavigate, currentView, session, onSignIn, onSignUp, onSignOut }: Props) {
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

            {session ? (
              <>
                <span className="hidden sm:inline-flex text-sm text-slate-500 px-2 max-w-[160px] truncate">
                  {session.user.email}
                </span>
                <button
                  onClick={onSignOut}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors flex items-center gap-1.5"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Sign Out</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={onSignIn}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors flex items-center gap-1.5"
                >
                  <LogIn className="w-4 h-4" />
                  Sign In
                </button>
                <button
                  onClick={onSignUp}
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-sky-600 to-blue-700 text-white hover:shadow-lg transition-all flex items-center gap-1.5"
                >
                  <UserPlus className="w-4 h-4" />
                  Sign Up
                </button>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
