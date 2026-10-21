import { useState, useEffect, useCallback } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import StudentForm from '@/components/StudentForm';
import Results from '@/components/Results';
import AdminPanel from '@/components/AdminPanel';
import Footer from '@/components/Footer';
import { supabase } from '@/lib/supabase';
import type { College, StudentForm as Form } from '@/types';

type View = 'home' | 'admin';
type Stage = 'form' | 'results';

export default function App() {
  const [view, setView] = useState<View>('home');
  const [stage, setStage] = useState<Stage>('form');
  const [form, setForm] = useState<Form | null>(null);
  const [colleges, setColleges] = useState<College[]>([]);
  const [allColleges, setAllColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formRef, setFormRef] = useState<HTMLDivElement | null>(null);

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

      // Priority 1: Exact Course + Country + Minimum Score Eligible
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

      // Priority 2: Exact Course + Country (relaxing score cutoff)
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

      // Priority 3: Same Course across ANY country
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

      // Priority 4: Fill remaining slots with top-ranked colleges overall
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

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar
        onNavigate={(v) => {
          setView(v);
          if (v === 'home') handleReset();
        }}
        currentView={view}
      />

      <main className="flex-1">
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