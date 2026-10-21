import { GraduationCap, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-500 to-blue-700 flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-white font-semibold">UniFinder</p>
              <p className="text-xs">University Finder</p>
            </div>
          </div>
          <p className="text-sm flex items-center gap-1.5">
            Built with <Heart className="w-4 h-4 text-red-500" /> for students seeking their dream college
          </p>
        </div>
        <div className="mt-6 pt-6 border-t border-slate-800 text-center text-xs">
          &copy; {new Date().getFullYear()} UniFinder. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
