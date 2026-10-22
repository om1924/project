import { useState, useEffect, useCallback } from 'react';
import type { Session } from '@supabase/supabase-js';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import StudentForm from '@/components/StudentForm';
import Results from '@/components/Results';
import AdminPanel from '@/components/AdminPanel';
import AuthPage from '@/components/AuthPage';
import Footer from '@/components/Footer';
import { supabase } from '@/lib/supabase';
import type { College, StudentForm as Form, CollegeResult } from '@/types';

type View = 'home' | 'admin' | 'auth';
type Stage = 'form' | 'results';

export default function App() {
  const [view, setView] = useState<View>('home');
  const [stage, setStage] = useState<Stage>('form');
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [session, setSession] = useState<Session | null>(null);
  const [form, setForm] = useState<Form | null>(null);
  const [colleges, setColleges] = useState<College[]>([]);
  const [allColleges, setAllColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formRef, setFormRef] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const fetchColleges = useCallback(async () => {
    const { data, error } = await supabase
      .from('colleges')
      .select('*')
      .order('ranking', { ascending: true, nullsFirst: false });
    if (error) {
      console.error('fetch error', error);
      return;
    }
    setAllColleges(data ?? []);
  }, []);

  useEffect(() => {
    fetchColleges();
  }, [fetchColleges]);

  const handleSubmit = async (submittedForm: Form) => {
    setForm(submittedForm);
    setLoading(true);
    setError(null);
    setStage('results');

    try {
      const score = Number(submittedForm.score);
      let resultList: College[] = [];

      let query1 = supabase
        .from('colleges')
        .select('*')
        .lte('min_score', score)
        .order('ranking', { ascending: true, nullsFirst: false });

      if (submittedForm.course && submittedForm.course !== 'All') {
        query1 = query1.eq('course', submittedForm.course);
      }
      if (submittedForm.country && submittedForm.country !== 'All') {
        query1 = query1.eq('country', submittedForm.country);
      }

      const { data: tier1, error: err1 } = await query1;
      if (err1) throw err1;
      resultList = [...(tier1 ?? [])];

      if (resultList.length < 5) {
        let query2 = supabase
          .from('colleges')
          .select('*')
          .order('ranking', { ascending: true, nullsFirst: false });

        if (submittedForm.course && submittedForm.course !== 'All') {
          query2 = query2.eq('course', submittedForm.course);
        }
        if (submittedForm.country && submittedForm.country !== 'All') {
          query2 = query2.eq('country', submittedForm.country);
        }

        const { data: tier2 } = await query2;
        if (tier2) {
          for (const col of tier2) {
            if (!resultList.some((r) => r.id === col.id)) {
              resultList.push(col);
            }
          }
        }
      }

      if (resultList.length < 5 && submittedForm.course && submittedForm.course !== 'All') {
        const { data: tier3 } = await supabase
          .from('colleges')
          .select('*')
          .eq('course', submittedForm.course)
          .order('ranking', { ascending: true, nullsFirst: false });

        if (tier3) {
          for (const col of tier3) {
            if (!resultList.some((r) => r.id === col.id)) {
              resultList.push(col);
            }
          }
        }
      }

      if (resultList.length < 5) {
        const { data: tier4 } = await supabase
          .from('colleges')
          .select('*')
          .order('ranking', { ascending: true, nullsFirst: false })
          .limit(10);

        if (tier4) {
          for (const col of tier4) {
            if (!resultList.some((r) => r.id === col.id)) {
              resultList.push(col);
            }
          }
        }
      }

      setColleges(resultList.slice(0, 5));

      const collegeResults: CollegeResult[] = resultList.slice(0, 5).map((c) => ({
        id: c.id,
        name: c.name,
        website_url: c.website_url,
      }));

      const userEmail = session?.user?.email ?? null;

      const { error: logError } = await supabase.from('search_logs').insert({
        student_email: userEmail,
        student_name: submittedForm.name,
        score: Number(submittedForm.score),
        course: submittedForm.course,
        country: submittedForm.country,
        college_results: collegeResults,
      });
      if (logError) console.error('Failed to log search', logError);
    } catch (err) {
      setError('We could not load college recommendations. Please try again. ' + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setStage('form');
    setForm(null);
    setColleges([]);
    setError(null);
  };

  const scrollToForm = () => {
    formRef?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleAuthSuccess = () => {
    setView('home');
    handleReset();
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setView('home');
    handleReset();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar
        onNavigate={(v) => {
          setView(v);
          if (v === 'home') handleReset();
        }}
        currentView={view === 'auth' ? 'home' : view}
        session={session}
        onSignIn={() => { setAuthMode('signin'); setView('auth'); }}
        onSignUp={() => { setAuthMode('signup'); setView('auth'); }}
        onSignOut={handleSignOut}
      />

      <main className="flex-1">
        {view === 'auth' && (
          <AuthPage
            mode={authMode}
            onModeChange={setAuthMode}
            onSuccess={handleAuthSuccess}
            onBack={() => setView('home')}
          />
        )}

        {view === 'home' && (
          <>
            {stage === 'form' && <Hero onStart={scrollToForm} />}
            <section
              ref={setFormRef}
              className="py-12 px-4 sm:px-6 lg:px-8"
            >
              {stage === 'form' ? (
                <StudentForm onSubmit={handleSubmit} loading={loading} />
              ) : (
                form && (
                  <Results
                    colleges={colleges}
                    form={form}
                    loading={loading}
                    error={error}
                    onReset={handleReset}
                  />
                )
              )}
            </section>
          </>
        )}

        {view === 'admin' && <AdminPanel colleges={allColleges} fetchColleges={fetchColleges} />}
      </main>

      <Footer />
    </div>
  );
}
