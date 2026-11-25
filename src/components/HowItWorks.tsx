import React from 'react'
import { Sparkles, Layers } from 'lucide-react'

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Consultation & Travel Scope',
      desc: 'Tell us where you want to go, who is traveling, dates, and budget. Our supervisor validates your destination constraints and requirements.',
      tag: 'Step 1: Scope & Intent',
      badge: 'text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700',
    },
    {
      num: '02',
      title: 'Real-Time Specialist Discovery',
      desc: 'Our flight specialist queries verified carrier routes, the stays curator evaluates neighborhood hotels, and climate advisor calculates forecast patterns.',
      tag: 'Step 2: Intelligent Matching',
      badge: 'text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700',
    },
    {
      num: '03',
      title: 'Human Review & Master PDF',
      desc: 'Review the complete draft in detail. Request adjustments or approve instantly to permanently save and download your official travel master PDF.',
      tag: 'Step 3: Verification & PDF',
      badge: 'text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700',
    },
  ]

  return (
    <section id="how-it-works" className="py-20 relative transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-xs font-semibold text-teal-800 dark:text-teal-300 mb-3">
            <Layers className="w-3.5 h-3.5 text-teal-700 dark:text-teal-400" />
            <span>The Curation Process</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">
            How Your Itinerary Takes Shape
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-3">
            No generic copy-paste plans. Every journey is assembled from real flight data, real hotel discovery, and human-in-the-loop review.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((st) => (
            <div
              key={st.num}
              className="rounded-3xl p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs hover:shadow-xs relative flex flex-col justify-between group hover:-translate-y-0.5 transition-all duration-300"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="font-mono text-3xl font-black text-slate-200 dark:text-slate-800 group-hover:text-teal-600/40 dark:group-hover:text-teal-400/40 transition-colors">
                    {st.num}
                  </span>
                  <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${st.badge}`}>
                    {st.tag}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">{st.title}</h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{st.desc}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                <Sparkles className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                <span>Curated with live travel data</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
