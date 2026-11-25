import React, { useState } from 'react'
import {
  CheckCircle2,
  RefreshCw,
  Calendar,
  Wallet,
  Car,
  Lightbulb,
  FileQuestion,
  ChevronRight,
  AlertTriangle,
  FileText,
  ExternalLink,
  Train,
  Plane,
  Users,
  Utensils,
  MapPin,
} from 'lucide-react'
import type { ReviewPayload } from '../types/trip'
import { getTripPreviewPdfUrl } from '../services/api'

interface ReviewModalProps {
  payload: ReviewPayload
  threadId: string
  onApprove: () => void
  onRequestChanges: (feedback: string) => void
  isLoading?: boolean
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  payload,
  threadId,
  onApprove,
  onRequestChanges,
  isLoading = false,
}) => {
  const [activeTab, setActiveTab] = useState<'itinerary' | 'budget' | 'pdf'>('itinerary')
  const [showFeedbackBox, setShowFeedbackBox] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [feedbackError, setFeedbackError] = useState('')

  const itinerary = payload.itinerary
  const budget = payload.budget
  const train = payload.train
  const flight = payload.flight
  const c = payload.trip_constraints || {}
  const revisionCount = payload.revision_count ?? 0

  const handleSendChanges = () => {
    if (!feedback.trim()) {
      setFeedbackError('Please specify what changes you would like the agents to make.')
      return
    }
    setFeedbackError('')
    onRequestChanges(feedback.trim())
  }

  const previewPdfUrl = getTripPreviewPdfUrl(threadId)

  const adults = c.adults ?? 1
  const children = c.children ?? 0
  const totalTravelers = c.travelers ?? (adults + children)
  const foodPref = c.food_preference ?? 'Standard / Any'
  const startDate = c.start_date
  const endDate = c.end_date

  return (
    <div className="w-full paper-card-elevated rounded-3xl p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 mb-12 shadow-sm transition-colors">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 text-xs font-semibold mb-2 border border-teal-200 dark:border-teal-800">
            <span className="w-2 h-2 rounded-full bg-teal-600 dark:bg-teal-400 animate-ping" />
            <span>Personal Review & Approval</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">
            Review Your Curated Travel Itinerary
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Review proposed daily schedules, train & flight options, dining alignment, and live PDF before finalizing your plan.
          </p>
        </div>

        {/* Revision badge */}
        <div className="text-right flex sm:flex-col items-center sm:items-end justify-between">
          <span className="text-xs text-slate-500 dark:text-slate-400">Revisions Used</span>
          <div className="flex items-center gap-1 font-mono text-sm font-bold text-slate-700 dark:text-slate-200">
            <span>{revisionCount}</span>
            <span className="text-slate-400 dark:text-slate-500">/ 3</span>
          </div>
        </div>
      </div>

      {/* Structured Parameters Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
        <div className="flex items-start gap-2.5">
          <Calendar className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
              Dates & Window
            </span>
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
              {startDate ? (endDate ? `${startDate} ➔ ${endDate}` : `From ${startDate}`) : 'Flexible Dates'}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-2.5">
          <Users className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
              Party Breakdown
            </span>
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
              {adults} Adult{adults > 1 ? 's' : ''}{children > 0 ? `, ${children} Child${children > 1 ? 'ren' : ''}` : ''} ({totalTravelers} Total)
            </p>
          </div>
        </div>

        <div className="flex items-start gap-2.5">
          <Utensils className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
              Dining Preference
            </span>
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
              {foodPref}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-2.5">
          <MapPin className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
              Sector Routing
            </span>
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
              {c.origin || 'Origin'} ➔ {c.destination || 'Destination'}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-6">
        <button
          onClick={() => setActiveTab('itinerary')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
            activeTab === 'itinerary'
              ? 'bg-teal-700 hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-700 text-white shadow-xs'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/80 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Day-by-Day Plan ({itinerary?.days?.length ?? 0} Days)</span>
        </button>

        <button
          onClick={() => setActiveTab('budget')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
            activeTab === 'budget'
              ? 'bg-teal-700 hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-700 text-white shadow-xs'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/80 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
          }`}
        >
          <Wallet className="w-4 h-4" />
          <span>Budget & Transit Comparison</span>
        </button>

        <button
          onClick={() => setActiveTab('pdf')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
            activeTab === 'pdf'
              ? 'bg-teal-700 hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-700 text-white shadow-xs'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/80 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>PDF Master Preview</span>
        </button>
      </div>

      {/* Tab 1: Day-wise Itinerary */}
      {activeTab === 'itinerary' && itinerary && (
        <div className="space-y-4">
          {/* Train Transit Intelligence Card (WorldTrainMap) */}
          {train?.summary && (
            <div className="p-5 rounded-2xl bg-teal-50/70 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800/80 shadow-2xs">
              <div className="flex items-center justify-between mb-2 pb-2 border-b border-teal-200/70 dark:border-teal-800/60">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-teal-700 text-white flex items-center justify-center">
                    <Train className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-teal-900 dark:text-teal-200 uppercase tracking-wider">
                      Real-Time Railway Intelligence (WorldTrainMap)
                    </h4>
                    <p className="text-[11px] text-teal-700 dark:text-teal-300">
                      Schedules & Route Options for {startDate || 'Departure Date'}
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-300">
                  Budget Optimization
                </span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed">
                {train.summary}
              </p>
            </div>
          )}

          {/* Flight Summary Card */}
          {flight?.summary && (
            <div className="p-5 rounded-2xl bg-sky-50/70 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800/80 shadow-2xs">
              <div className="flex items-center gap-2 mb-2 pb-2 border-b border-sky-200/70 dark:border-sky-800/60">
                <div className="w-7 h-7 rounded-lg bg-sky-700 text-white flex items-center justify-center">
                  <Plane className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-sky-900 dark:text-sky-200 uppercase tracking-wider">
                    Scheduled Flights & Aviation Route
                  </h4>
                </div>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed">
                {flight.summary}
              </p>
            </div>
          )}

          {/* Days Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {itinerary.days?.map((day) => (
              <div
                key={day.day}
                className="rounded-2xl p-5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200/90 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600 transition-all shadow-2xs"
              >
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-200/70 dark:border-slate-700/70">
                  <div className="flex items-center gap-2.5">
                    <span className="px-2.5 py-1 rounded-lg bg-slate-200/80 dark:bg-slate-700 text-slate-800 dark:text-slate-100 text-xs font-bold font-mono">
                      Day {day.day}
                    </span>
                    <h4 className="font-semibold text-slate-800 dark:text-slate-100 text-sm truncate">{day.title}</h4>
                  </div>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
                    <span className="text-[10px] font-bold text-teal-700 dark:text-teal-400 uppercase tracking-wider block mb-0.5">
                      Morning
                    </span>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{day.morning}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
                    <span className="text-[10px] font-bold text-sky-700 dark:text-sky-400 uppercase tracking-wider block mb-0.5">
                      Afternoon
                    </span>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{day.afternoon}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
                    <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider block mb-0.5">
                      Evening
                    </span>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{day.evening}</p>
                  </div>

                  {day.transport_notes && (
                    <div className="flex items-start gap-2 pt-1 text-[11px] text-slate-500 dark:text-slate-400">
                      <Car className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <span>{day.transport_notes}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Practical Tips */}
          {itinerary.tips && itinerary.tips.length > 0 && (
            <div className="p-4 rounded-2xl bg-teal-50/60 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800/70 mt-4">
              <h5 className="text-xs font-bold text-teal-900 dark:text-teal-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Lightbulb className="w-3.5 h-3.5 text-teal-700 dark:text-teal-400" />
                <span>Travel Tips, Packing & {foodPref} Dining Essentials</span>
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700 dark:text-slate-300">
                {itinerary.tips.map((tip, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="text-teal-700 dark:text-teal-400 font-mono text-[10px] mt-0.5">•</span>
                    <span>{tip}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Budget Breakdown & Transit Options */}
      {activeTab === 'budget' && budget && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1">
                {budget.flights_estimate ? 'Flights Estimate' : 'Train Transit'}
              </span>
              <p className="text-lg font-bold font-mono text-slate-800 dark:text-slate-100">
                INR {((budget.flights_estimate ?? budget.trains_estimate) || 0).toLocaleString()}
              </p>
              {budget.flights_estimate && budget.trains_estimate ? (
                <span className="text-[10px] text-teal-600 dark:text-teal-400 block mt-0.5">
                  Train Alt: INR {budget.trains_estimate.toLocaleString()}
                </span>
              ) : null}
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1">Accommodation</span>
              <p className="text-lg font-bold font-mono text-slate-800 dark:text-slate-100">
                INR {budget.hotel_estimate?.toLocaleString()}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1">Food ({foodPref}) & Local Transit</span>
              <p className="text-lg font-bold font-mono text-slate-800 dark:text-slate-100">
                INR {budget.food_and_transport_estimate?.toLocaleString()}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1">Activities & Tours</span>
              <p className="text-lg font-bold font-mono text-slate-800 dark:text-slate-100">
                INR {budget.activities_estimate?.toLocaleString()}
              </p>
            </div>

            <div className="col-span-2 sm:col-span-1 p-4 rounded-2xl bg-slate-800 dark:bg-slate-950 text-white border border-slate-700 dark:border-slate-800 shadow-2xs">
              <span className="text-[11px] text-slate-300 block mb-1 font-semibold">Total Projected</span>
              <p className="text-lg font-bold font-mono text-white">
                INR {budget.total_estimate?.toLocaleString()}
              </p>
              <span className="text-[10px] text-teal-300 font-medium">
                {budget.within_budget === true
                  ? '✓ Within Stated Budget'
                  : budget.within_budget === false
                  ? '⚠️ Exceeds Stated Budget'
                  : 'Budget Unconstrained'}
              </span>
            </div>
          </div>

          {/* Recommendations & Assumptions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
              <h5 className="text-xs font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Lightbulb className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                <span>Cost Optimization & Rail Transit Advice</span>
              </h5>
              <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                {budget.recommendations?.map((rec, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <ChevronRight className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
              <h5 className="text-xs font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <FileQuestion className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                <span>Party Size & Dining Assumptions</span>
              </h5>
              <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                {budget.assumptions?.map((ass, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-slate-400 font-mono text-[10px] mt-0.5">•</span>
                    <span>{ass}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: PDF Document Preview */}
      {activeTab === 'pdf' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-2.5">
              <FileText className="w-5 h-5 text-teal-700 dark:text-teal-400 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-100">Live PDF Master Itinerary Preview</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Includes full dates, adults & children breakdown, {foodPref} dining, and train/flight schedules.
                </p>
              </div>
            </div>
            <a
              href={previewPdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-teal-700 hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-700 text-white text-xs font-medium transition-all shadow-2xs"
            >
              <span>Open in New Tab</span>
              <ExternalLink className="w-3.5 h-3.5 text-teal-200" />
            </a>
          </div>

          <div className="w-full h-[580px] rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 shadow-inner">
            <iframe
              src={previewPdfUrl}
              title="Aetheria Travel Plan PDF Preview"
              className="w-full h-full border-0"
            />
          </div>
        </div>
      )}

      {/* Human Actions Toolbar */}
      <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onApprove}
            disabled={isLoading}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-full font-bold text-sm text-white bg-teal-700 hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-700 transition-all shadow-2xs cursor-pointer disabled:opacity-50 active:scale-95"
          >
            {isLoading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-teal-200" />
            )}
            <span>Approve & Save Master PDF</span>
          </button>

          <button
            onClick={() => setShowFeedbackBox(!showFeedbackBox)}
            disabled={isLoading || revisionCount >= 3}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-full font-semibold text-sm text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200/80 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <RefreshCw className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            <span>Request Changes</span>
          </button>
        </div>

        {revisionCount >= 3 && (
          <div className="flex items-center gap-2 text-xs text-amber-700 dark:text-amber-400 font-medium">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>Maximum revisions reached (3/3). Approving will proceed with current plan.</span>
          </div>
        )}
      </div>

      {/* Feedback Input Drawer / Box */}
      {showFeedbackBox && (
        <div className="mt-6 p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 animate-fadeIn">
          <h5 className="text-xs font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider mb-1">
            Specify Desired Adjustments
          </h5>
          <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">
            Share what to adjust (e.g. "Switch to train 12377 for budget savings", "Include Jain breakfast options on day 2").
          </p>

          <textarea
            rows={3}
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Describe your desired adjustments..."
            className="w-full p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-xs focus:outline-none focus:border-teal-700 dark:focus:border-teal-500 focus:ring-1 focus:ring-teal-700 dark:focus:ring-teal-500 transition-all mb-2"
          />

          {feedbackError && (
            <p className="text-xs text-rose-600 dark:text-rose-400 mb-3 font-medium">{feedbackError}</p>
          )}

          <div className="flex items-center justify-end gap-3">
            <button
              onClick={() => setShowFeedbackBox(false)}
              className="px-4 py-2 rounded-full text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSendChanges}
              disabled={isLoading}
              className="flex items-center gap-2 px-5 py-2 rounded-full text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-700 transition-all shadow-xs cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5 text-teal-200" />
              )}
              <span>Submit Revision Request</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
