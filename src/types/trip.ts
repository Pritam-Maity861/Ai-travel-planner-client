export type TripStatus = 'running' | 'awaiting_review' | 'completed' | 'blocked' | 'failed'

export interface DayPlan {
  day: number
  title: string
  morning: string
  afternoon: string
  evening: string
  transport_notes: string
}

export interface ItineraryPlan {
  days: DayPlan[]
  tips: string[]
}

export interface BudgetAnalysis {
  flights_estimate?: number | null
  trains_estimate?: number | null
  hotel_estimate?: number | null
  food_and_transport_estimate?: number | null
  activities_estimate?: number | null
  total_estimate: number
  within_budget: boolean | null
  recommendations: string[]
  assumptions: string[]
}

export interface TrainResults {
  origin?: string
  destination?: string
  start_date?: string
  raw?: any
  summary?: string
}

export interface TripConstraints {
  origin?: string | null
  destination?: string | null
  start_date?: string | null
  end_date?: string | null
  duration_days?: number | null
  travelers?: number | null
  adults?: number | null
  children?: number | null
  budget?: number | null
  currency?: string | null
  food_preference?: string | null
  preferences?: string[] | null
}

export interface ReviewPayload {
  type: string
  trip_constraints?: TripConstraints
  flight?: any
  train?: TrainResults
  itinerary?: ItineraryPlan
  budget?: BudgetAnalysis
  revision_count?: number
}

export interface TripResponse {
  thread_id: string
  status: TripStatus
  title?: string | null
  destination?: string | null
  has_pdf?: boolean
  message?: string | null
  review_payload?: ReviewPayload | null
}

export interface TripHistoryItem {
  thread_id: string
  title?: string | null
  destination?: string | null
  user_query: string
  status: TripStatus
  has_pdf: boolean
  created_at: string
}

export interface TripCreateRequest {
  query: string
  thread_id?: string
  origin?: string
  destination?: string
  start_date?: string
  end_date?: string
  adults?: number
  children?: number
  budget?: number
  currency?: string
  food_preference?: string
}

export interface ReviewRequest {
  action: 'approve' | 'request_changes'
  feedback?: string
}
