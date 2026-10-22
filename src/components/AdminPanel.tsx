import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { ADMIN_USERNAME, ADMIN_PASSWORD, COURSES, COUNTRIES } from '@/data/constants';
import { Lock, LogOut, Plus, Pencil, Trash2, X, Loader as Loader2, ShieldCheck, Search, ExternalLink, History } from 'lucide-react';
import type { College, SearchLog } from '@/types';

type Props = {
  colleges: College[];
  fetchColleges: () => Promise<void>;
};

type Draft = {
  id?: string;
  name: string;
  course: string;
  country: string;
  image_url: string;
  intake: string;
  eligibility: string;
  fee_structure: string;
  hostel_mess: string;
  min_score: string;
  ranking: string;
  website_url: string;
};

const emptyDraft: Draft = {
  name: '',
  course: '',
  country: '',
  image_url: '',
  intake: '',
  eligibility: '',
  fee_structure: '',
  hostel_mess: '',
  min_score: '',
  ranking: '',
  website_url: '',
};

export default function AdminPanel({ colleges, fetchColleges }: Props) {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const [editing, setEditing] = useState<Draft | null>(null);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState<'colleges' | 'logs'>('colleges');

  const [searchLogs, setSearchLogs] = useState<SearchLog[]>([]);
  const [logSearch, setLogSearch] = useState('');
  const [logsLoading, setLogsLoading] = useState(false);

  const fetchSearchLogs = useCallback(async () => {
    setLogsLoading(true);
    const { data, error } = await supabase
      .from('search_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(200);
    setLogsLoading(false);
    if (error) {
      console.error('search logs fetch error', error);
      return;
    }
    setSearchLogs(data ?? []);
  }, []);

  useEffect(() => {
    if (loggedIn && tab === 'logs' && searchLogs.length === 0) {
      fetchSearchLogs();
    }
  }, [loggedIn, tab, searchLogs.length, fetchSearchLogs]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      setLoggedIn(true);
      setLoginError('');
    } else {
      setLoginError('Invalid credentials. Please try again.');
    }
  };

  const startEdit = (c: College) => {
    setEditing({
      id: c.id,
      name: c.name,
      course: c.course,
      country: c.country,
      image_url: c.image_url,
      intake: c.intake,
      eligibility: c.eligibility,
      fee_structure: c.fee_structure,
      hostel_mess: c.hostel_mess,
      min_score: String(c.min_score),
      ranking: c.ranking != null ? String(c.ranking) : '',
      website_url: c.website_url ?? '',
    });
  };

  const startAdd = () => {
    setEditing({ ...emptyDraft });
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    setSaving(true);
    const payload = {
      name: editing.name,
      course: editing.course,
      country: editing.country,
      image_url: editing.image_url,
      intake: editing.intake,
      eligibility: editing.eligibility,
      fee_structure: editing.fee_structure,
      hostel_mess: editing.hostel_mess,
      min_score: Number(editing.min_score) || 0,
      ranking: editing.ranking ? Number(editing.ranking) : null,
      website_url: editing.website_url || null,
    };
    try {
      if (editing.id) {
        const { error } = await supabase.from('colleges').update(payload).eq('id', editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('colleges').insert(payload);
        if (error) throw error;
      }
      await fetchColleges();
      setEditing(null);
    } catch (err) {
      alert('Failed to save college. ' + (err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (c: College) => {
    if (!confirm(`Delete "${c.name}"? This cannot be undone.`)) return;
    const { error } = await supabase.from('colleges').delete().eq('id', c.id);
    if (error) {
      alert('Failed to delete: ' + error.message);
      return;
    }
    await fetchColleges();
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!loggedIn) {
    return (
      <div className="max-w-md mx-auto py-16">
        <form
          onSubmit={handleLogin}
          className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-sky-500 to-blue-700 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">Admin Login</h2>
              <p className="text-sm text-slate-500">Sign in to manage colleges</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1.5 block">Username</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none transition-all"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1.5 block">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none transition-all"
                />
              </div>
            </div>
            {loginError && (
              <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-lg">{loginError}</p>
            )}
            <button
              type="submit"
              className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-sky-600 to-blue-700 text-white font-semibold shadow-lg shadow-sky-600/20 hover:shadow-xl transition-all"
            >
              Sign In
            </button>
          </div>
        </form>
      </div>
    );
  }

  const filtered = colleges.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.course.toLowerCase().includes(search.toLowerCase()) ||
      c.country.toLowerCase().includes(search.toLowerCase()),
  );

  const filteredLogs = searchLogs.filter(
    (log) =>
      log.student_name.toLowerCase().includes(logSearch.toLowerCase()) ||
      (log.student_email ?? '').toLowerCase().includes(logSearch.toLowerCase()) ||
      log.course.toLowerCase().includes(logSearch.toLowerCase()) ||
      log.country.toLowerCase().includes(logSearch.toLowerCase()),
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Admin Dashboard</h2>
          <p className="text-sm text-slate-500">
            {tab === 'colleges'
              ? `${colleges.length} colleges in the database`
              : `${searchLogs.length} student searches logged`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {tab === 'colleges' && (
            <button
              onClick={startAdd}
              className="px-4 py-2.5 rounded-lg bg-sky-600 text-white font-medium hover:bg-sky-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add College
            </button>
          )}
          {tab === 'logs' && (
            <button
              onClick={fetchSearchLogs}
              className="px-4 py-2.5 rounded-lg bg-white border border-slate-200 text-slate-700 font-medium hover:border-sky-300 hover:text-sky-700 transition-colors flex items-center gap-2"
            >
              <Loader2 className={`w-4 h-4 ${logsLoading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          )}
          <button
            onClick={() => setLoggedIn(false)}
            className="px-4 py-2.5 rounded-lg bg-white border border-slate-200 text-slate-700 font-medium hover:border-red-300 hover:text-red-600 transition-colors flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>

      {/* Tab selector */}
      <div className="flex gap-1 mb-6 p-1 bg-slate-100 rounded-xl w-fit">
        <button
          onClick={() => setTab('colleges')}
          className={`px-5 py-2.5 rounded-lg font-medium text-sm transition-all flex items-center gap-2 ${
            tab === 'colleges'
              ? 'bg-white text-slate-800 shadow-sm'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <Search className="w-4 h-4" />
          Colleges
        </button>
        <button
          onClick={() => setTab('logs')}
          className={`px-5 py-2.5 rounded-lg font-medium text-sm transition-all flex items-center gap-2 ${
            tab === 'logs'
              ? 'bg-white text-slate-800 shadow-sm'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <History className="w-4 h-4" />
          Search Logs
        </button>
      </div>

      {/* Colleges tab */}
      {tab === 'colleges' && (
        <>
          <div className="relative mb-4 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, course, or country..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none transition-all"
            />
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 text-left text-slate-600">
                    <th className="px-4 py-3 font-semibold">College</th>
                    <th className="px-4 py-3 font-semibold">Course</th>
                    <th className="px-4 py-3 font-semibold">Country</th>
                    <th className="px-4 py-3 font-semibold">Min Score</th>
                    <th className="px-4 py-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={c.image_url}
                            alt={c.name}
                            loading="lazy"
                            className="w-12 h-12 rounded-lg object-cover shrink-0"
                          />
                          <span className="font-medium text-slate-800 line-clamp-2 max-w-xs">{c.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-600">{c.course}</td>
                      <td className="px-4 py-3 text-slate-600">{c.country}</td>
                      <td className="px-4 py-3 text-slate-600">{c.min_score}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => startEdit(c)}
                            className="p-2 rounded-lg text-slate-500 hover:bg-sky-50 hover:text-sky-600 transition-colors"
                            title="Edit"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => remove(c)}
                            className="p-2 rounded-lg text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filtered.length === 0 && (
              <p className="text-center text-slate-500 py-10">No colleges match your search.</p>
            )}
          </div>
        </>
      )}

      {/* Search Logs tab */}
      {tab === 'logs' && (
        <>
          <div className="relative mb-4 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={logSearch}
              onChange={(e) => setLogSearch(e.target.value)}
              placeholder="Search by student name, email, course, or country..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none transition-all"
            />
          </div>

          {logsLoading && searchLogs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24">
              <Loader2 className="w-8 h-8 text-sky-600 animate-spin mb-4" />
              <p className="text-slate-600 font-medium">Loading search logs...</p>
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center">
              <History className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 font-medium">
                {searchLogs.length === 0
                  ? 'No student searches have been logged yet.'
                  : 'No logs match your search.'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredLogs.map((log) => (
                <div
                  key={log.id}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4 p-5 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center shrink-0">
                        <Search className="w-5 h-5 text-sky-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">{log.student_name}</p>
                        <p className="text-sm text-slate-500">
                          {log.student_email ?? 'Not signed in'}
                        </p>
                      </div>
                    </div>
                    <div className="text-sm text-slate-500 text-right">
                      {formatDate(log.created_at)}
                    </div>
                  </div>

                  <div className="px-5 py-4 flex flex-wrap gap-2">
                    <span className="px-3 py-1 rounded-lg bg-sky-50 text-sky-700 text-xs font-medium">
                      Course: {log.course}
                    </span>
                    <span className="px-3 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-medium">
                      Country: {log.country}
                    </span>
                    <span className="px-3 py-1 rounded-lg bg-amber-50 text-amber-700 text-xs font-medium">
                      Score: {log.score}/100
                    </span>
                  </div>

                  <div className="px-5 pb-5">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
                      Recommended Colleges ({log.college_results.length})
                    </p>
                    <div className="flex flex-col gap-2">
                      {log.college_results.length === 0 && (
                        <p className="text-sm text-slate-400 italic">No colleges were matched.</p>
                      )}
                      {log.college_results.map((c, i) => (
                        <div
                          key={c.id}
                          className="flex items-center justify-between gap-3 px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-100"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-600 text-xs font-bold flex items-center justify-center shrink-0">
                              {i + 1}
                            </span>
                            <span className="text-sm font-medium text-slate-700 truncate">
                              {c.name}
                            </span>
                          </div>
                          {c.website_url ? (
                            <a
                              href={c.website_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-600 hover:text-sky-700 transition-colors shrink-0"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                              Visit
                            </a>
                          ) : (
                            <span className="text-xs text-slate-400 shrink-0">No website</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-800">
                {editing.id ? 'Edit College' : 'Add College'}
              </h3>
              <button
                onClick={() => setEditing(null)}
                className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={save} className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1.5 block">College Name</label>
                <input
                  type="text"
                  required
                  value={editing.name}
                  onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none transition-all"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1.5 block">Course</label>
                  <select
                    required
                    value={editing.course}
                    onChange={(e) => setEditing({ ...editing, course: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none transition-all"
                  >
                    <option value="">Select course</option>
                    {COURSES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1.5 block">Country</label>
                  <select
                    required
                    value={editing.country}
                    onChange={(e) => setEditing({ ...editing, country: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none transition-all"
                  >
                    <option value="">Select country</option>
                    {COUNTRIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1.5 block">Image URL</label>
                <input
                  type="url"
                  required
                  value={editing.image_url}
                  onChange={(e) => setEditing({ ...editing, image_url: e.target.value })}
                  placeholder="https://images.pexels.com/..."
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none transition-all"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1.5 block">Official Website URL (optional)</label>
                <input
                  type="url"
                  value={editing.website_url}
                  onChange={(e) => setEditing({ ...editing, website_url: e.target.value })}
                  placeholder="https://www.college.edu"
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none transition-all"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1.5 block">Intake</label>
                <input
                  type="text"
                  required
                  value={editing.intake}
                  onChange={(e) => setEditing({ ...editing, intake: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none transition-all"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1.5 block">Eligibility</label>
                <textarea
                  required
                  value={editing.eligibility}
                  onChange={(e) => setEditing({ ...editing, eligibility: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none transition-all resize-none"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1.5 block">Fee Structure</label>
                <textarea
                  required
                  value={editing.fee_structure}
                  onChange={(e) => setEditing({ ...editing, fee_structure: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none transition-all resize-none"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1.5 block">Hostel & Mess Nearby</label>
                <textarea
                  required
                  value={editing.hostel_mess}
                  onChange={(e) => setEditing({ ...editing, hostel_mess: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none transition-all resize-none"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1.5 block">Min Score (0-100)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={editing.min_score}
                    onChange={(e) => setEditing({ ...editing, min_score: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1.5 block">Ranking (optional)</label>
                  <input
                    type="number"
                    min="1"
                    value={editing.ranking}
                    onChange={(e) => setEditing({ ...editing, ranking: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none transition-all"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditing(null)}
                  className="px-5 py-2.5 rounded-lg bg-white border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 rounded-lg bg-sky-600 text-white font-semibold hover:bg-sky-700 transition-colors flex items-center gap-2 disabled:opacity-60"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  {editing.id ? 'Save Changes' : 'Add College'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
