import React, { useEffect, useState } from 'react'
import {
  X,
  Compass,
  Download,
  Calendar,
  ChevronRight,
  Sparkles,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Loader2,
  Trash2,
} from 'lucide-react'
import type { TripHistoryItem } from '../types/trip'
import { deleteTrip, getTripPdfUrl, listUserTrips } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { DeleteConfirmModal } from './DeleteConfirmModal'

interface HistoryDrawerProps {
  isOpen: boolean
  onClose: () => void
  onSelectTrip: (threadId: string) => void
  onDeleteTrip?: (threadId: string) => void
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  onSelectTrip,
  onDeleteTrip,
}) => {
  const { user } = useAuth()
  const [trips, setTrips] = useState<TripHistoryItem[]>([])
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [tripToDelete, setTripToDelete] = useState<TripHistoryItem | null>(null)
  const [error, setError] = useState<string | null>(null)

  const fetchTrips = async () => {
    if (!user) return
    setLoading(true)
    setError(null)
    try {
      const data = await listUserTrips()
      setTrips(data)
    } catch (err: any) {
      setError(err.message || 'Failed to load past journeys')
    } finally {
      setLoading(false)
    }
  }

  const handleOpenDelete = (e: React.MouseEvent, trip: TripHistoryItem) => {
    e.stopPropagation()
    setTripToDelete(trip)
  }

  const handleConfirmDelete = async () => {
    if (!tripToDelete) return
    setDeleting(true)
    try {
      await deleteTrip(tripToDelete.thread_id)
      setTrips((prev) => prev.filter((t) => t.thread_id !== tripToDelete.thread_id))
      if (onDeleteTrip) {
        onDeleteTrip(tripToDelete.thread_id)
      }
      setTripToDelete(null)
    } catch (err: any) {
      setError(err.message || 'Failed to delete journey')
    } finally {
      setDeleting(false)
    }
  }

  useEffect(() => {
    if (isOpen && user) {
      fetchTrips()
    }
  }, [isOpen, user])

  if (!isOpen) return null

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3 h-3" />
            <span>Completed</span>
          </span>
        )
      case 'awaiting_review':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <Clock className="w-3 h-3" />
            <span>Review Needed</span>
          </span>
        )
      case 'blocked':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
            <AlertTriangle className="w-3 h-3" />
            <span>Blocked</span>
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20">
            <Sparkles className="w-3 h-3" />
            <span>{status}</span>
          </span>
        )
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/35 dark:bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-md h-full bg-slate-50 dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 flex flex-col shadow-xl overflow-hidden transition-colors">
        {/* Drawer Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 flex items-center justify-center text-teal-700 dark:text-teal-300 shadow-2xs">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base">My Journeys</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Past conversations & saved itineraries</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {loading && (
            <div className="py-12 text-center">
              <Loader2 className="w-7 h-7 text-teal-700 dark:text-teal-400 animate-spin mx-auto mb-3" />
              <p className="text-xs text-slate-500 dark:text-slate-400">Retrieving your archived journeys...</p>
            </div>
          )}

          {error && (
            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-800 dark:text-rose-300 text-xs">
              {error}
            </div>
          )}

          {!loading && trips.length === 0 && !error && (
            <div className="py-16 text-center">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center mx-auto mb-3 text-slate-400">
                <FileText className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1">No saved journeys yet</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                Plan a journey above. Once you review and approve it, your full plan and downloadable PDF
                will be permanently archived here.
              </p>
            </div>
          )}

          {!loading &&
            trips.map((trip) => (
              <div
                key={trip.thread_id}
                className="p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600 transition-all flex flex-col gap-3 shadow-2xs group"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-sm text-slate-800 dark:text-slate-100 truncate">
                        {trip.destination ? `Trip to ${trip.destination}` : trip.title || 'Travel Plan'}
                      </span>
                      {getStatusBadge(trip.status)}
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                      "{trip.user_query}"
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-700/60">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{new Date(trip.created_at).toLocaleDateString()}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {trip.has_pdf && (
                      <a
                        href={getTripPdfUrl(trip.thread_id)}
                        download
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-700 hover:bg-teal-50 dark:hover:bg-teal-900/50 text-slate-700 dark:text-slate-200 hover:text-teal-900 dark:hover:text-teal-200 border border-slate-200 dark:border-slate-600 font-medium transition-all"
                        title="Download Final PDF from DB"
                      >
                        <Download className="w-3 h-3 text-teal-700 dark:text-teal-300" />
                        <span>PDF</span>
                      </a>
                    )}

                    <button
                      onClick={() => {
                        onSelectTrip(trip.thread_id)
                        onClose()
                      }}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-teal-700 hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-700 text-white font-medium transition-all cursor-pointer shadow-2xs"
                    >
                      <span>View</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>

                    <button
                      onClick={(e) => handleOpenDelete(e, trip)}
                      className="p-1.5 rounded-full text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-all cursor-pointer"
                      title="Delete Journey"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>

        {/* Drawer Footer */}
        {user && (
          <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-600 dark:text-slate-400 flex items-center justify-between">
            <span className="truncate">{user.email}</span>
            <span className="font-mono text-teal-800 dark:text-teal-400 font-semibold">{trips.length} Journey(s)</span>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={tripToDelete !== null}
        journeyName={tripToDelete?.destination ? `Trip to ${tripToDelete.destination}` : tripToDelete?.title || tripToDelete?.user_query}
        isLoading={deleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setTripToDelete(null)}
      />
    </div>
  )
}
