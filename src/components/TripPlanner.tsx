import React, { useEffect, useState } from 'react'
import {
  Sparkles,
  Send,
  Loader2,
  Compass,
  AlertCircle,
  LogIn,
  Lock,
  Calendar,
  Users,
  Utensils,
  Wallet,
  Train,
  MapPin,
  RotateCw,
  Trash2,
  PlusCircle,
} from 'lucide-react'
import { createTrip, deleteTrip, getTrip, reviewTrip } from '../services/api'
import type { TripResponse } from '../types/trip'
import { AgentWorkflow } from './AgentWorkflow'
import { ReviewModal } from './ReviewModal'
import { FinalPlan } from './FinalPlan'
import { BlockedAlert } from './BlockedAlert'
import { DeleteConfirmModal } from './DeleteConfirmModal'
import { SAMPLE_DESTINATIONS, type DestinationPrompt } from '../data/destinations'
import { useAuth } from '../context/AuthContext'

interface TripPlannerProps {
  selectedThreadId?: string | null
  onClearSelectedThread?: () => void
  initialSample?: DestinationPrompt | null
}

export const TripPlanner: React.FC<TripPlannerProps> = ({
  selectedThreadId,
  onClearSelectedThread,
  initialSample,
}) => {
  const { user, openAuthModal } = useAuth()

  // Form State
  const [origin, setOrigin] = useState('Kolkata')
  const [destination, setDestination] = useState('North Sikkim')
  const [startDate, setStartDate] = useState(() => {
    return new Date().toISOString().split('T')[0]
  })
  const [endDate, setEndDate] = useState(() => {
    const d = new Date()
    d.setDate(d.getDate() + 7)
    return d.toISOString().split('T')[0]
  })
  const [adults, setAdults] = useState(2)
  const [children, setChildren] = useState(0)
  const [budget, setBudget] = useState('80000')
  const [currency, setCurrency] = useState('INR')
  const [foodPreference, setFoodPreference] = useState('Vegetarian')
  const [notes, setNotes] = useState('')

  const [loading, setLoading] = useState(false)
  const [currentTrip, setCurrentTrip] = useState<TripResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isDeletingTrip, setIsDeletingTrip] = useState(false)

  // Calculate duration in days
  const getDurationDays = () => {
    if (startDate && endDate) {
      const start = new Date(startDate)
      const end = new Date(endDate)
      const diffTime = end.getTime() - start.getTime()
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
      return diffDays > 0 ? diffDays : 1
    }
    return 7
  }

  // Handle loading a past trip selected from History Drawer
  useEffect(() => {
    if (selectedThreadId) {
      setLoading(true)
      setError(null)
      getTrip(selectedThreadId)
        .then((trip) => {
          setCurrentTrip(trip)
        })
        .catch((err: any) => {
          setError(err.message || 'Failed to load selected trip from history.')
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }, [selectedThreadId])

  // Handle prefilled destination selection from Hero
  useEffect(() => {
    if (initialSample) {
      handleSampleClick(initialSample)
    }
  }, [initialSample])

  const handleSampleClick = (sample: DestinationPrompt) => {
    setOrigin(sample.origin)
    setDestination(sample.destination)
    setBudget(sample.budget)
    setCurrency(sample.currency)
    setAdults(sample.adults)
    setChildren(sample.children)
    setFoodPreference(sample.foodPreference)
    setNotes(sample.notes)

    // Set departure to current date (today) and end date according to duration
    const start = new Date()
    const end = new Date()
    end.setDate(end.getDate() + sample.durationDays)
    setStartDate(start.toISOString().split('T')[0])
    setEndDate(end.toISOString().split('T')[0])

    if (!user) {
      openAuthModal('login')
      return
    }
    setError(null)
    if (onClearSelectedThread) {
      onClearSelectedThread()
    }
  }

  const handleSubmit = async (e?: React.FormEvent, retryThreadId?: string) => {
    if (e) e.preventDefault()

    if (!user) {
      openAuthModal('login')
      return
    }

    if (!origin.trim() || !destination.trim()) {
      setError('Please provide both Origin and Destination cities.')
      return
    }

    if (!startDate || !endDate) {
      setError('Please select both departure and return dates.')
      return
    }

    const duration = getDurationDays()
    const totalTravelers = adults + children
    const targetThreadId =
      retryThreadId || currentTrip?.thread_id || selectedThreadId || undefined

    setLoading(true)
    setError(null)

    // Synthesize structured query prompt for LLM + pass structured attributes
    const compositeQuery = notes.trim()
      ? `Plan a ${duration}-day trip to ${destination} from ${origin} starting on ${startDate} through ${endDate} for ${totalTravelers} people (${adults} adults and ${children} children). Budget is ${budget} ${currency}. Food preference is ${foodPreference}. Check real-time train availability via WorldTrainMap for starting date to optimize budget. Additional notes: ${notes.trim()}`
      : `Plan a ${duration}-day trip to ${destination} from ${origin} starting on ${startDate} through ${endDate} for ${totalTravelers} people (${adults} adults and ${children} children). Budget is ${budget} ${currency}. Food preference is ${foodPreference}. Check real-time train availability via WorldTrainMap for starting date to optimize budget.`

    try {
      const response = await createTrip({
        query: compositeQuery,
        thread_id: targetThreadId,
        origin: origin.trim(),
        destination: destination.trim(),
        start_date: startDate,
        end_date: endDate,
        adults,
        children,
        budget: budget ? parseFloat(budget) : undefined,
        currency,
        food_preference: foodPreference,
      })
      setCurrentTrip(response)
    } catch (err: any) {
      setError(err.message || 'Failed to start trip planning session.')
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async () => {
    if (!currentTrip?.thread_id) return
    setLoading(true)
    setError(null)
    try {
      const res = await reviewTrip(currentTrip.thread_id, { action: 'approve' })
      setCurrentTrip(res)
    } catch (err: any) {
      setError(err.message || 'Failed to approve trip plan.')
    } finally {
      setLoading(false)
    }
  }

  const handleRequestChanges = async (feedback: string) => {
    if (!currentTrip?.thread_id) return
    setLoading(true)
    setError(null)
    try {
      const res = await reviewTrip(currentTrip.thread_id, {
        action: 'request_changes',
        feedback,
      })
      setCurrentTrip(res)
    } catch (err: any) {
      setError(err.message || 'Failed to request changes.')
    } finally {
      setLoading(false)
    }
  }

  const handleNewTrip = () => {
    setCurrentTrip(null)
    setError(null)
    setNotes('')
    if (onClearSelectedThread) {
      onClearSelectedThread()
    }
  }

  const handleOpenDeleteModal = () => {
    setIsDeleteModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    const threadId = currentTrip?.thread_id || selectedThreadId
    if (!threadId) return
    setIsDeletingTrip(true)
    try {
      await deleteTrip(threadId)
      setIsDeleteModalOpen(false)
      handleNewTrip()
    } catch (err: any) {
      setError(err.message || 'Failed to delete trip session.')
    } finally {
      setIsDeletingTrip(false)
    }
  }

  const todayStr = new Date().toISOString().split('T')[0]

  return (
    <section id="planner" className="py-10 relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Active Session Header Bar */}
      {(currentTrip || selectedThreadId) && (
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 mb-6 shadow-2xs animate-fadeIn">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-500 animate-pulse" />
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Active Session:{' '}
              <span className="text-teal-700 dark:text-teal-400 font-mono">
                {currentTrip?.thread_id?.slice(0, 8) || selectedThreadId?.slice(0, 8)}...
              </span>
            </span>
            {currentTrip?.status && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                {currentTrip.status}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleNewTrip}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-teal-700 hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-700 text-white text-xs font-medium transition-all cursor-pointer shadow-2xs"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Plan a New Travel</span>
            </button>
            <button
              type="button"
              onClick={handleOpenDeleteModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-medium transition-all cursor-pointer"
              title="Delete this journey"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>
          </div>
        </div>
      )}

      {/* Search Input Box */}
      <div className="relative paper-card-elevated rounded-3xl p-4 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 mb-8 overflow-hidden transition-colors">
        {/* Sign in overlay if unauthenticated */}
        {!user && (
          <div className="absolute inset-0 z-20 rounded-3xl backdrop-blur-xs bg-slate-900/25 dark:bg-black/60 border border-slate-300/80 dark:border-slate-700 flex flex-col items-center justify-center p-6 text-center animate-fadeIn">
            <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 shadow-xl border border-slate-200 dark:border-slate-800 flex flex-col items-center">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 flex items-center justify-center text-teal-700 dark:text-teal-300 mb-3 shadow-2xs">
                <Lock className="w-6 h-6" />
              </div>
              <h4 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100 mb-1.5">
                Sign In to Plan Your Journey
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-md mb-6 leading-relaxed">
                Sign in to customize dates, traveler counts, train schedules, food preferences, and download master PDFs.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 w-full">
                <button
                  type="button"
                  onClick={() => openAuthModal('login')}
                  className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold text-white bg-teal-700 hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-700 shadow-2xs transition-all cursor-pointer active:scale-95 flex-1"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign In</span>
                </button>
                <button
                  type="button"
                  onClick={() => openAuthModal('register')}
                  className="px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-all cursor-pointer"
                >
                  <span>Create Account</span>
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 flex items-center justify-center text-teal-700 dark:text-teal-300">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 block">
                Bespoke Travel Consultation
              </span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Specify your dates, party size, dining preference, and budget parameters.
              </p>
            </div>
          </div>

          <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-[11px] font-medium text-teal-800 dark:text-teal-300">
            <Train className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            <span>WorldTrainMap Rail Intelligence Enabled</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Row 1: Origin & Destination */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                <MapPin className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                <span>Departure City (Origin)</span>
              </label>
              <input
                type="text"
                required
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                placeholder="e.g. Kolkata, New Delhi, London"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-teal-700 dark:focus:border-teal-500 focus:ring-1 focus:ring-teal-700 dark:focus:ring-teal-500 transition-all"
                disabled={loading || !user}
              />
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                <MapPin className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                <span>Destination</span>
              </label>
              <input
                type="text"
                required
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="e.g. North Sikkim, Dubai, Tokyo, Goa"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-teal-700 dark:focus:border-teal-500 focus:ring-1 focus:ring-teal-700 dark:focus:ring-teal-500 transition-all"
                disabled={loading || !user}
              />
            </div>
          </div>

          {/* Row 2: Travel Dates & Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                <Calendar className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                <span>Start / Departure Date</span>
              </label>
              <input
                type="date"
                required
                min={todayStr}
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-teal-700 dark:focus:border-teal-500 focus:ring-1 focus:ring-teal-700 dark:focus:ring-teal-500 transition-all"
                disabled={loading || !user}
              />
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                <Calendar className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                <span>Return / End Date</span>
              </label>
              <input
                type="date"
                required
                min={startDate || todayStr}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-teal-700 dark:focus:border-teal-500 focus:ring-1 focus:ring-teal-700 dark:focus:ring-teal-500 transition-all"
                disabled={loading || !user}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Calculated Trip Duration
              </label>
              <div className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-semibold flex items-center justify-between">
                <span>{getDurationDays()} Days</span>
                <span className="text-[11px] text-teal-700 dark:text-teal-300 font-normal">
                  {getDurationDays() > 1 ? `${getDurationDays() - 1} Nights` : 'Day Trip'}
                </span>
              </div>
            </div>
          </div>

          {/* Row 3: Travelers Breakdown (Adults + Children) & Food Preferences */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                <Users className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                <span>Adults (Age 12+)</span>
              </label>
              <div className="flex items-center">
                <input
                  type="number"
                  min={1}
                  max={50}
                  value={adults}
                  onChange={(e) => setAdults(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-teal-700 dark:focus:border-teal-500 focus:ring-1 focus:ring-teal-700 dark:focus:ring-teal-500 transition-all"
                  disabled={loading || !user}
                />
              </div>
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                <Users className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                <span>Children (Age 0-11)</span>
              </label>
              <div className="flex items-center">
                <input
                  type="number"
                  min={0}
                  max={30}
                  value={children}
                  onChange={(e) => setChildren(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-teal-700 dark:focus:border-teal-500 focus:ring-1 focus:ring-teal-700 dark:focus:ring-teal-500 transition-all"
                  disabled={loading || !user}
                />
              </div>
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                <Utensils className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                <span>Food & Dining Preference</span>
              </label>
              <select
                value={foodPreference}
                onChange={(e) => setFoodPreference(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-teal-700 dark:focus:border-teal-500 focus:ring-1 focus:ring-teal-700 dark:focus:ring-teal-500 transition-all cursor-pointer"
                disabled={loading || !user}
              >
                <option value="Vegetarian">Vegetarian (Pure Veg)</option>
                <option value="Non-Vegetarian">Non-Vegetarian</option>
                <option value="Vegan">Vegan (Plant-Based)</option>
                <option value="Jain">Jain Vegetarian</option>
                <option value="Halal">Halal</option>
                <option value="Any / Standard">Any / No Restriction</option>
              </select>
            </div>
          </div>

          {/* Row 4: Budget & Currency */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div className="sm:col-span-2">
              <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                <Wallet className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                <span>Target Budget (Group Total)</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={1000}
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="e.g. 80000"
                  className="flex-1 min-w-0 px-3.5 py-2.5 rounded-xl bg-slate-50/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-teal-700 dark:focus:border-teal-500 focus:ring-1 focus:ring-teal-700 dark:focus:ring-teal-500 transition-all"
                  disabled={loading || !user}
                />
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-24 px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold focus:outline-none focus:border-teal-700 transition-all cursor-pointer"
                  disabled={loading || !user}
                >
                  <option value="INR">INR (₹)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="AED">AED</option>
                  <option value="JPY">JPY (¥)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Travel Party Summary
              </label>
              <div className="px-3.5 py-2.5 rounded-xl bg-teal-50/60 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 text-xs text-teal-900 dark:text-teal-200 font-medium">
                {adults} Adult{adults > 1 ? 's' : ''}
                {children > 0 ? `, ${children} Child${children > 1 ? 'ren' : ''}` : ''}
                {' '}({adults + children} Total)
              </div>
            </div>
          </div>

          {/* Row 5: Custom Notes & Wishes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Specific Wishes, Pace, or Transport Preference (Optional)
            </label>
            <div className="relative">
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Prefer train options to New Jalpaiguri for budget savings, relaxed pace, mountain view homestays..."
                className="w-full p-3.5 pr-14 rounded-2xl bg-slate-50/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-teal-700 dark:focus:border-teal-500 focus:ring-1 focus:ring-teal-700 dark:focus:ring-teal-500 transition-all resize-none"
                disabled={loading || !user}
              />

              <button
                type="submit"
                disabled={loading || !user}
                className="absolute right-3 bottom-3 p-3 rounded-xl bg-teal-700 hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-700 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-xs cursor-pointer active:scale-95"
                title="Generate Curated Itinerary"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin text-teal-200" />
                ) : (
                  <Send className="w-5 h-5 text-teal-200" />
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Sample Prompt Cards with Visual Mini Thumbnails */}
        <div className="mt-6 pt-5 border-t border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Popular Curated Itineraries:
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {SAMPLE_DESTINATIONS.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSampleClick(sample)}
                className="group relative rounded-2xl overflow-hidden border border-slate-200/90 dark:border-slate-800 hover:border-teal-400/80 dark:hover:border-teal-500/80 transition-all duration-300 text-left shadow-2xs hover:shadow-xs cursor-pointer p-2 flex items-center gap-3 bg-slate-50/70 dark:bg-slate-850/60 hover:bg-teal-50/40 dark:hover:bg-teal-950/20 active:scale-98"
              >
                <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 relative bg-slate-200 dark:bg-slate-800">
                  <img
                    src={sample.image}
                    alt={sample.destination}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                  />
                  <div className="absolute inset-0 bg-black/10" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate group-hover:text-teal-700 dark:group-hover:text-teal-300 transition-colors">
                    {sample.destination}
                  </div>
                  <div className="text-[10px] text-teal-700 dark:text-teal-400 font-semibold truncate">
                    {sample.badgeText}
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                    From {sample.origin}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-800 dark:text-rose-300 text-xs sm:text-sm mb-8 animate-fadeIn">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-600 dark:text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Agent Workflow Visualizer */}
      {(loading || currentTrip) && (
        <AgentWorkflow status={loading ? 'running' : currentTrip?.status} />
      )}

      {/* Loading Pulse Card */}
      {loading && (
        <div className="w-full paper-card rounded-3xl p-8 sm:p-12 text-center border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 mb-12 shadow-2xs transition-colors">
          <div className="w-14 h-14 rounded-2xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 flex items-center justify-center mx-auto mb-4 animate-bounce">
            <Sparkles className="w-7 h-7 text-teal-700 dark:text-teal-400 animate-spin" style={{ animationDuration: '6s' }} />
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">
            Curating Your Journey for {startDate}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-lg mx-auto leading-relaxed mb-6">
            Querying WorldTrainMap rail availability & direct flights • Discovering stays for {adults + children} travelers • Tailoring {foodPreference} dining • Analyzing 16-day climate patterns.
          </p>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 font-medium">
            <span className="w-2 h-2 rounded-full bg-teal-600 dark:bg-teal-400 animate-ping" />
            <span>Consulting Flight, Train, Stay & Itinerary Specialists...</span>
          </div>
        </div>
      )}

      {/* Failed Generation State Card */}
      {currentTrip?.status === 'failed' && (
        <div className="w-full rounded-3xl p-6 sm:p-8 bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 mb-12 shadow-2xs animate-fadeIn">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-2xl bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300 flex items-center justify-center shrink-0 border border-rose-300 dark:border-rose-800">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h4 className="text-base sm:text-lg font-bold text-rose-900 dark:text-rose-200">
                Generation Encountered an Issue
              </h4>
              <p className="text-xs sm:text-sm text-rose-800 dark:text-rose-300 mt-1 leading-relaxed">
                {currentTrip.message ||
                  'The planning graph encountered an issue. You can retry with the same session or start a new travel.'}
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleSubmit(undefined, currentTrip.thread_id)}
                  disabled={loading}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-700 hover:bg-rose-800 text-white text-xs font-medium transition-all cursor-pointer shadow-xs"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <RotateCw className="w-4 h-4" />
                  )}
                  <span>Retry Generation (Same Session)</span>
                </button>
                <button
                  type="button"
                  onClick={handleNewTrip}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-rose-300 dark:border-rose-800 text-slate-700 dark:text-slate-200 hover:bg-rose-50 dark:hover:bg-slate-700 text-xs font-medium transition-all cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4 text-teal-700 dark:text-teal-400" />
                  <span>Plan a New Travel</span>
                </button>
                <button
                  type="button"
                  onClick={handleOpenDeleteModal}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-rose-700 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/40 text-xs font-medium transition-all cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete Failed Journey</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Blocked by Guardrail */}
      {currentTrip?.status === 'blocked' && (
        <BlockedAlert
          reason={currentTrip.message || 'Request did not pass the travel domain validator.'}
          onSampleClick={(sampleQuery) => {
            setNotes(sampleQuery)
            setError(null)
          }}
          onNewTrip={handleNewTrip}
        />
      )}

      {/* Awaiting Human-in-the-Loop Review */}
      {currentTrip?.status === 'awaiting_review' && currentTrip.review_payload && (
        <ReviewModal
          payload={currentTrip.review_payload}
          threadId={currentTrip.thread_id}
          onApprove={handleApprove}
          onRequestChanges={handleRequestChanges}
          isLoading={loading}
        />
      )}

      {/* Completed Final Plan */}
      {currentTrip?.status === 'completed' && currentTrip.message && (
        <FinalPlan
          markdown={currentTrip.message}
          threadId={currentTrip.thread_id}
          onNewTrip={handleNewTrip}
        />
      )}

      {/* Custom Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        journeyName={
          currentTrip?.destination
            ? `Trip to ${currentTrip.destination}`
            : currentTrip?.title || 'Current Travel Session'
        }
        isLoading={isDeletingTrip}
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
      />
    </section>
  )
}
