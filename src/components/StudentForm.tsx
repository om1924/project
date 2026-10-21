import { useState } from 'react';
import { Search, Loader2, User, ClipboardList } from 'lucide-react';
import { COURSES, COUNTRIES } from '@/data/constants';
import type { StudentForm } from '@/types';

type Props = {
  onSubmit: (form: StudentForm) => void;
  loading: boolean;
};

export default function StudentForm({ onSubmit, loading }: Props) {
  const [form, setForm] = useState<StudentForm>({
    name: '',
    score: '',
    course: '',
    country: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const next: Record<string, string> = {};
    if (!form.name.trim()) next.name = 'Please enter your name';
    const scoreNum = Number(form.score);
    if (!form.score) next.score = 'Please enter your score';
    else if (isNaN(scoreNum) || scoreNum < 0 || scoreNum > 100)
      next.score = 'Score must be between 0 and 100';
    if (!form.course) next.course = 'Please select a course';
    if (!form.country) next.country = 'Please select a country';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) onSubmit(form);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 sm:p-8 max-w-2xl mx-auto"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-sky-500 to-blue-700 flex items-center justify-center">
          <ClipboardList className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800">Student Profile</h2>
          <p className="text-sm text-slate-500">Fill in your details to get matched</p>
        </div>
      </div>

      <div className="space-y-5">
        <div>
          <label className="flex items-center gap-1.5 text-sm font-medium text-slate-700 mb-1.5">
            <User className="w-4 h-4 text-slate-400" />
            Full Name
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="e.g. Om Sharma"
            className={`w-full px-4 py-2.5 rounded-lg border bg-slate-50 focus:bg-white focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none transition-all ${
              errors.name ? 'border-red-400' : 'border-slate-200'
            }`}
          />
          {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700 mb-1.5 block">
            Your Score (out of 100)
          </label>
          <input
            type="number"
            min="0"
            max="100"
            value={form.score}
            onChange={(e) => setForm({ ...form, score: e.target.value })}
            placeholder="e.g. 85"
            className={`w-full px-4 py-2.5 rounded-lg border bg-slate-50 focus:bg-white focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none transition-all ${
              errors.score ? 'border-red-400' : 'border-slate-200'
            }`}
          />
          {errors.score && <p className="mt-1 text-xs text-red-500">{errors.score}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="text-sm font-medium text-slate-700 mb-1.5 block">Course</label>
            <select
              value={form.course}
              onChange={(e) => setForm({ ...form, course: e.target.value })}
              className={`w-full px-4 py-2.5 rounded-lg border bg-slate-50 focus:bg-white focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none transition-all ${
                errors.course ? 'border-red-400' : 'border-slate-200'
              }`}
            >
              <option value="">Select a course</option>
              {COURSES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            {errors.course && <p className="mt-1 text-xs text-red-500">{errors.course}</p>}
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700 mb-1.5 block">Country</label>
            <select
              value={form.country}
              onChange={(e) => setForm({ ...form, country: e.target.value })}
              className={`w-full px-4 py-2.5 rounded-lg border bg-slate-50 focus:bg-white focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none transition-all ${
                errors.country ? 'border-red-400' : 'border-slate-200'
              }`}
            >
              <option value="">Select a country</option>
              {COUNTRIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            {errors.country && <p className="mt-1 text-xs text-red-500">{errors.country}</p>}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full px-6 py-3.5 rounded-xl bg-gradient-to-r from-sky-600 to-blue-700 text-white font-semibold shadow-lg shadow-sky-600/20 hover:shadow-xl hover:shadow-sky-600/30 hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:translate-y-0 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Finding colleges...
            </>
          ) : (
            <>
              <Search className="w-5 h-5" />
              Get Recommendations
            </>
          )}
        </button>
      </div>
    </form>
  );
}
