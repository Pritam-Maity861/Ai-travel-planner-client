import React from 'react'
import { ShieldAlert, Compass, PlusCircle } from 'lucide-react'

interface BlockedAlertProps {
  reason: string
  onSampleClick: (sample: string) => void
  onNewTrip?: () => void
}

export const BlockedAlert: React.FC<BlockedAlertProps> = ({ reason, onSampleClick, onNewTrip }) => {
  const suggestions = [
    'Plan a 4 day trip to Dubai from Kolkata under 80000 INR',
    'Weekend getaway to Goa for 2 travelers with beachside stays',
    '5 days cultural tour in Tokyo Japan with budget 150000 JPY',
  ]

  return (
    <div className="w-full rounded-3xl p-6 sm:p-8 bg-slate-100/90 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 mb-12 shadow-2xs transition-colors">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-2xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center shrink-0 border border-slate-300 dark:border-slate-700">
          <ShieldAlert className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              Travel Inquiry Scope Notice
            </span>
            {onNewTrip && (
              <button
                type="button"
                onClick={onNewTrip}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 hover:text-teal-900 dark:hover:text-teal-200 hover:border-teal-300 dark:hover:border-teal-600 transition-all cursor-pointer shadow-2xs"
              >
                <PlusCircle className="w-3.5 h-3.5 text-teal-700 dark:text-teal-400" />
                <span>Plan a New Travel</span>
              </button>
            )}
          </div>
          <h4 className="text-lg font-bold text-slate-800 dark:text-slate-100 mt-1">Please Provide a Travel Request</h4>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">{reason}</p>

          <div className="mt-5 pt-4 border-t border-slate-200 dark:border-slate-800">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-2">
              Try one of these sample travel inquiries instead:
            </span>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  onClick={() => onSampleClick(s)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 hover:text-teal-900 dark:hover:text-teal-200 hover:border-teal-300 dark:hover:border-teal-600 transition-all cursor-pointer shadow-2xs"
                >
                  <Compass className="w-3.5 h-3.5 text-teal-700 dark:text-teal-400" />
                  <span>"{s}"</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
