import { ArrowDown, Sparkles, Compass } from 'lucide-react';

type Props = {
  onStart: () => void;
};

export default function Hero({ onStart }: Props) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-sky-50 via-white to-white">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 -left-20 w-72 h-72 bg-sky-200/40 rounded-full blur-3xl" />
        <div className="absolute top-40 right-0 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-100 text-sky-700 text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            Find your dream university in minutes
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-800 leading-tight tracking-tight">
            Discover the perfect college for{' '}
            <span className="bg-gradient-to-r from-sky-600 to-blue-700 bg-clip-text text-transparent">
              your future
            </span>
          </h1>

          <p className="mt-6 text-lg text-slate-600 leading-relaxed">
            Tell us your score, your course, and where you want to study — we'll give you
            five handpicked college recommendations with eligibility, fees, intake, and
            nearby hostel & mess details.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onStart}
              className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-sky-600 to-blue-700 text-white font-semibold shadow-lg shadow-sky-600/20 hover:shadow-xl hover:shadow-sky-600/30 hover:-translate-y-0.5 transition-all flex items-center gap-2"
            >
              <Compass className="w-5 h-5" />
              Get Recommendations
            </button>
            <a
              href="#how-it-works"
              className="px-7 py-3.5 rounded-xl bg-white text-slate-700 font-semibold border border-slate-200 hover:border-sky-300 hover:text-sky-700 transition-colors flex items-center gap-2"
            >
              <ArrowDown className="w-5 h-5" />
              How it works
            </a>
          </div>
        </div>

        <div id="how-it-works" className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { step: '01', title: 'Enter your details', desc: 'Share your name, your score, the course you want, and the country you prefer.' },
            { step: '02', title: 'We match colleges', desc: 'Our system matches your profile against a curated list of top universities.' },
            { step: '03', title: 'Compare & decide', desc: 'Review intake, eligibility, fees, and hostel options for each recommendation.' },
          ].map((item) => (
            <div
              key={item.step}
              className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg hover:border-sky-200 transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center text-lg font-bold mb-4">
                {item.step}
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">{item.title}</h3>
              <p className="text-slate-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
