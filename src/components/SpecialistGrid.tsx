import React from 'react'
import { Plane, Hotel, CloudSun, DollarSign, Users, ArrowUpRight } from 'lucide-react'

export const SpecialistGrid: React.FC = () => {
  const specialists = [
    {
      title: 'Air & Rail Transit Specialist',
      desc: 'Compares scheduled flight departures alongside real-time train routes via WorldTrainMap, unlocking significant budget savings.',
      tool: 'Aviation & Railway Intelligence',
      icon: Plane,
      color: 'bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800',
      image: 'https://images.unsplash.com/photo-1506012787146-f92b2d7d6d96?auto=format&fit=crop&w=600&q=80',
    },
    {
      title: 'Hospitality & Stays Curator',
      desc: 'Discovers verified accommodations tailored to your travel group, neighborhood preferences, and comfort level.',
      tool: 'Curated Hotel Discovery',
      icon: Hotel,
      color: 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800',
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80',
    },
    {
      title: 'Climate & Packing Advisor',
      desc: 'Analyzes 16-day temperature trends and seasonal precipitation patterns to produce tailored daily packing advice.',
      tool: '16-Day Forecast Analysis',
      icon: CloudSun,
      color: 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
      image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80',
    },
    {
      title: 'Budget & Itinerary Architect',
      desc: 'Synthesizes routes, accommodations, and activities into transparent cost breakdowns and balanced morning-to-night plans.',
      tool: 'Balanced Trip Synthesis',
      icon: DollarSign,
      color: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
      image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=600&q=80',
    },
  ]

  return (
    <section id="specialists" className="py-20 border-t border-slate-200/80 dark:border-slate-800 relative transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-xs font-semibold text-teal-800 dark:text-teal-300 mb-3">
              <Users className="w-3.5 h-3.5 text-teal-700 dark:text-teal-400" />
              <span>Your Travel Concierge Team</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">
              Four Specialists, One Seamless Journey
            </h2>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md">
            Each specialist focuses exclusively on its domain, ensuring accurate flight routes, vetted stays, and realistic budgets without generic filler.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {specialists.map((specialist, i) => {
            const Icon = specialist.icon
            return (
              <div
                key={i}
                className="group rounded-3xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-teal-500/40 dark:hover:border-teal-500/40 shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col justify-between"
              >
                {/* Visual Header Image with Soft Gradient */}
                <div className="relative h-28 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <img
                    src={specialist.image}
                    alt={specialist.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-slate-900 via-white/50 dark:via-slate-900/60 to-transparent" />
                  <div
                    className={`absolute bottom-2 left-5 w-11 h-11 rounded-2xl ${specialist.color} border shadow-xs flex items-center justify-center group-hover:scale-105 transition-transform`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                <div className="p-6 pt-2 flex flex-col justify-between flex-1">
                  <div>
                    <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-2">
                      {specialist.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                      {specialist.desc}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                    <span className="font-medium text-[11px] text-slate-500 dark:text-slate-400">
                      {specialist.tool}
                    </span>
                    <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-colors" />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
