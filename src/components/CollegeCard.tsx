import { Users, FileText, BadgeIndianRupee, Chrome as Home, Trophy, MapPin, ExternalLink } from 'lucide-react';
import type { College } from '@/types';

type Props = {
  college: College;
  rank: number;
};

export default function CollegeCard({ college, rank }: Props) {
  return (
    <article className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:border-sky-200 transition-all group">
      <div className="relative h-52 overflow-hidden bg-slate-100">
        <img
          src={college.image_url}
          alt={college.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3">
          <div className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-slate-800 text-xs font-semibold shadow-sm flex items-center gap-1">
            <Trophy className="w-3.5 h-3.5 text-amber-500" />
            Rank #{rank}
          </div>
        </div>
        <div className="absolute top-3 right-3">
          <div className="px-3 py-1 rounded-full bg-sky-600/90 backdrop-blur-sm text-white text-xs font-semibold shadow-sm">
            {college.course}
          </div>
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-center gap-1.5 text-slate-500 text-xs mb-1.5">
          <MapPin className="w-3.5 h-3.5" />
          {college.country}
        </div>
        <h3 className="text-lg font-bold text-slate-800 leading-snug mb-4">
          {college.name}
        </h3>

        <div className="space-y-3">
          <div className="flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-50 flex items-center justify-center shrink-0 mt-0.5">
              <Users className="w-4 h-4 text-sky-600" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Intake</p>
              <p className="text-sm text-slate-700 leading-relaxed">{college.intake}</p>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0 mt-0.5">
              <FileText className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Eligibility</p>
              <p className="text-sm text-slate-700 leading-relaxed">{college.eligibility}</p>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center shrink-0 mt-0.5">
              <BadgeIndianRupee className="w-4 h-4 text-amber-600" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Fee Structure</p>
              <p className="text-sm text-slate-700 leading-relaxed">{college.fee_structure}</p>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center shrink-0 mt-0.5">
              <Home className="w-4 h-4 text-violet-600" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Hostel & Mess Nearby</p>
              <p className="text-sm text-slate-700 leading-relaxed">{college.hostel_mess}</p>
            </div>
          </div>
        </div>

        {college.website_url && (
          <a
            href={college.website_url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-sky-600 text-white text-sm font-semibold hover:bg-sky-700 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            Visit Website
          </a>
        )}
      </div>
    </article>
  );
}
