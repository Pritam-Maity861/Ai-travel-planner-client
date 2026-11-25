import React, { useRef, useState } from 'react'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import { Navbar } from './components/Navbar'
import { Hero } from './components/Hero'
import { TripPlanner } from './components/TripPlanner'
import { HowItWorks } from './components/HowItWorks'
import { SpecialistGrid } from './components/SpecialistGrid'
import { FAQ } from './components/FAQ'
import { Footer } from './components/Footer'
import { AuthModal } from './components/AuthModal'
import { HistoryDrawer } from './components/HistoryDrawer'
import type { DestinationPrompt } from './data/destinations'

const AppContent: React.FC = () => {
  const { user, openAuthModal } = useAuth()
  const plannerRef = useRef<HTMLDivElement>(null)
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null)
  const [prefilledSample, setPrefilledSample] = useState<DestinationPrompt | null>(null)

  const scrollToPlanner = () => {
    const el = document.getElementById('planner')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleStartPlanning = () => {
    if (!user) {
      openAuthModal('login')
    } else {
      scrollToPlanner()
    }
  }

  const handleSelectDestination = (sample: DestinationPrompt) => {
    setPrefilledSample(sample)
    scrollToPlanner()
  }

  const handleSelectTrip = (threadId: string) => {
    setSelectedThreadId(threadId)
    scrollToPlanner()
  }

  const handleDeleteTrip = (threadId: string) => {
    if (selectedThreadId === threadId) {
      setSelectedThreadId(null)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 relative selection:bg-teal-500/20 selection:text-teal-900 dark:selection:bg-teal-500/30 dark:selection:text-teal-200 transition-colors duration-200">
      {/* Gentle, whisper-soft background ambiance */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-teal-50/60 dark:from-teal-950/20 via-slate-50/40 dark:via-transparent to-transparent pointer-events-none -z-10" />

      {/* Navbar with History, Dark Mode Toggle & Auth */}
      <Navbar
        onPlanClick={handleStartPlanning}
        onOpenHistory={() => setIsHistoryOpen(true)}
      />

      {/* Main Content */}
      <main>
        <Hero
          onExploreClick={handleStartPlanning}
          onSelectDestination={handleSelectDestination}
        />

        <div ref={plannerRef}>
          <TripPlanner
            selectedThreadId={selectedThreadId}
            onClearSelectedThread={() => setSelectedThreadId(null)}
            initialSample={prefilledSample}
          />
        </div>

        <HowItWorks />

        <SpecialistGrid />

        <FAQ />
      </main>

      {/* Footer */}
      <Footer />

      {/* Global Modals & Drawers */}
      <AuthModal />
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        onSelectTrip={handleSelectTrip}
        onDeleteTrip={handleDeleteTrip}
      />
    </div>
  )
}

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
