import { Sparkles, RotateCcw, Loader2, AlertCircle } from 'lucide-react';
import CollegeCard from './CollegeCard';
import type { College, StudentForm } from '@/types';

type Props = {
  colleges: College[];
  form: StudentForm;
  loading: boolean;
  error: string | null;
  onReset: () => void;
};

export default function Results({ colleges, form, loading, error, onReset }: Props) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <Loader2 className="w-10 h-10 text-sky-600 animate-spin mb-4" />
        <p className="text-slate-600 font-medium">Finding the best colleges for you...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto py-12">
        <div className="flex items-start gap-3 p-5 rounded-xl bg-red-50 border border-red-200">
          <AlertCircle className="w-6 h-6 text-red-500 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-red-800">Something went wrong</h3>
            <p className="text-sm text-red-600 mt-1">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="max-w-2xl mx-auto text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-100 text-sky-700 text-sm font-medium mb-4">
          <Sparkles className="w-4 h-4" />
          {colleges.length} recommendations ready
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">
          Hey {form.name}, here are your top picks
        </h2>
        <p className="mt-2 text-slate-600">
          Best matches for <span className="font-semibold text-slate-800">{form.course}</span> in{' '}
          <span className="font-semibold text-slate-800">{form.country}</span> with a score of{' '}
          <span className="font-semibold text-slate-800">{form.score}/100</span>
        </p>
        <button
          onClick={onReset}
          className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white border border-slate-200 text-slate-700 font-medium hover:border-sky-300 hover:text-sky-700 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Start over
        </button>
      </div>

      {colleges.length === 0 ? (
        <div className="max-w-2xl mx-auto">
          <div className="text-center p-10 rounded-2xl bg-slate-50 border border-slate-200">
            <p className="text-slate-600 font-medium">
              No colleges found for your combination. Try a different course or country.
            </p>
            <button
              onClick={onReset}
              className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-sky-600 text-white font-medium hover:bg-sky-700 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Try again
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {colleges.map((college, i) => (
            <CollegeCard key={college.id} college={college} rank={i + 1} />
          ))}
        </div>
      )}
    </div>
  );
}
