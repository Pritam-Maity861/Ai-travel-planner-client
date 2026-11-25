import type { ReviewRequest, TripCreateRequest, TripHistoryItem, TripResponse } from '../types/trip'
import type { AuthResponse, User } from '../types/user'

const API_ORIGIN = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '')
const API_BASE = `${API_ORIGIN}/api/v1`
const TOKEN_KEY = 'aetheria_auth_token'

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function setStoredToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearStoredToken(): void {
  localStorage.removeItem(TOKEN_KEY)
}

function getAuthHeaders(): HeadersInit {
  const token = getStoredToken()
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  return headers
}

export async function checkHealth(): Promise<{ status: string }> {
  try {
    const res = await fetch(`${API_BASE}/health`)
    if (!res.ok) throw new Error('Health check failed')
    return await res.json()
  } catch {
    return { status: 'offline' }
  }
}

// Auth API calls
export async function registerApi(data: {
  email: string
  password: string
  name: string
}): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    throw new Error(errorData.detail || `Registration failed (${res.status})`)
  }

  const responseData: AuthResponse = await res.json()
  setStoredToken(responseData.access_token)
  return responseData
}

export async function loginApi(data: {
  email: string
  password: string
}): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    throw new Error(errorData.detail || `Login failed (${res.status})`)
  }

  const responseData: AuthResponse = await res.json()
  setStoredToken(responseData.access_token)
  return responseData
}

export async function getMeApi(): Promise<User> {
  const res = await fetch(`${API_BASE}/auth/me`, {
    headers: getAuthHeaders(),
  })

  if (!res.ok) {
    throw new Error('Not authenticated')
  }

  return await res.json()
}

// Trips API calls
export async function createTrip(data: TripCreateRequest): Promise<TripResponse> {
  const res = await fetch(`${API_BASE}/trips`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    throw new Error(errorData.detail || `Request failed with status ${res.status}`)
  }

  return await res.json()
}

export async function listUserTrips(): Promise<TripHistoryItem[]> {
  const res = await fetch(`${API_BASE}/trips`, {
    headers: getAuthHeaders(),
  })

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    throw new Error(errorData.detail || `Failed to fetch trip history (${res.status})`)
  }

  return await res.json()
}

export async function reviewTrip(threadId: string, data: ReviewRequest): Promise<TripResponse> {
  const res = await fetch(`${API_BASE}/trips/${threadId}/review`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    throw new Error(errorData.detail || `Review action failed with status ${res.status}`)
  }

  return await res.json()
}

export async function getTrip(threadId: string): Promise<TripResponse> {
  const res = await fetch(`${API_BASE}/trips/${threadId}`, {
    headers: getAuthHeaders(),
  })

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    throw new Error(errorData.detail || `Failed to fetch trip (${res.status})`)
  }

  return await res.json()
}

export function getTripPdfUrl(threadId: string): string {
  return `${API_BASE}/trips/${threadId}/pdf`
}

export function getTripPreviewPdfUrl(threadId: string): string {
  return `${API_BASE}/trips/${threadId}/preview-pdf`
}

export async function deleteTrip(threadId: string): Promise<void> {
  const res = await fetch(`${API_BASE}/trips/${threadId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  })

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    throw new Error(errorData.detail || `Failed to delete trip (${res.status})`)
  }
}
