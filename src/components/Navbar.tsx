import React, { useEffect, useState } from 'react'
import {
  LogOut,
  FolderHeart,
  Sun,
  Moon,
  Menu,
  X,
  Compass,
} from 'lucide-react'
import { checkHealth } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import logoImg from '../assets/logo.jpg'

interface NavbarProps {
  onPlanClick: () => void
  onOpenHistory: () => void
}

const NAV_LINKS = [
  { label: 'Planner', href: '#planner' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Concierge', href: '#specialists' },
  { label: 'FAQ', href: '#faq' },
]

export const Navbar: React.FC<NavbarProps> = ({ onPlanClick, onOpenHistory }) => {
  const { user, openAuthModal, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const [isHealthy, setIsHealthy] = useState<boolean | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    checkHealth().then((res) => {
      setIsHealthy(res.status === 'ok')
    })
    const interval = setInterval(() => {
      checkHealth().then((res) => setIsHealthy(res.status === 'ok'))
    }, 15000)
    return () => clearInterval(interval)
  }, [])

  const handleNavClick = () => {
    setMobileMenuOpen(false)
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-40 pt-3 sm:pt-4 px-3 sm:px-6 pointer-events-none flex flex-col items-center">
      {/* Main Floating Pill */}
      <div className="pointer-events-auto max-w-[calc(100vw-1.5rem)] inline-flex items-center justify-between gap-2.5 sm:gap-5 rounded-full bg-neutral-950/95 dark:bg-slate-900/95 backdrop-blur-md border border-white/10 p-1.5 pl-2 shadow-xl">
        {/* Brand Logo + Name (compact on mobile) */}
        <a
          href="#"
          className="flex items-center gap-2 group shrink-0 pr-1"
          title="AI-Travel_planner"
        >
          <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center transition-transform group-hover:scale-105 relative shrink-0">
            <img
              src={logoImg}
              alt="AI-Travel_planner Logo"
              className="w-full h-full object-cover rounded-full"
            />
            <span
              className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-neutral-950 ${
                isHealthy ? 'bg-emerald-400' : isHealthy === false ? 'bg-rose-500' : 'bg-amber-400'
              }`}
            />
          </div>
          <span className="text-xs sm:text-[13px] font-bold text-white tracking-tight whitespace-nowrap md:hidden">
            AI-Travel_planner
          </span>
        </a>

        {/* Desktop & Tablet Navigation Links */}
        <nav className="hidden md:flex items-center gap-5 text-xs sm:text-[13px] font-medium text-white/85">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} className="hover:text-white transition-colors whitespace-nowrap">
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right Controls */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            type="button"
            className="w-8 h-8 rounded-full flex items-center justify-center text-white/75 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? (
              <Moon className="w-3.5 h-3.5" />
            ) : (
              <Sun className="w-3.5 h-3.5 text-amber-400" />
            )}
          </button>

          {/* User History (shown in bar on sm+, and in mobile drawer on <sm) */}
          {user && (
            <button
              onClick={onOpenHistory}
              className="hidden sm:flex items-center gap-1.5 px-3 h-8 rounded-full text-xs font-medium text-white/90 hover:text-white hover:bg-white/10 transition-all cursor-pointer whitespace-nowrap"
              title="View past conversations & trips"
            >
              <FolderHeart className="w-3.5 h-3.5 text-teal-400" />
              <span>My Journeys</span>
            </button>
          )}

          {/* Auth / Login Pill */}
          {user ? (
            <div className="flex items-center gap-1">
              <div
                className="flex items-center gap-1.5 pl-1 pr-2 sm:pr-2.5 h-8 rounded-full bg-white text-neutral-950 text-xs font-semibold"
                title={user.name}
              >
                <div className="w-6 h-6 rounded-full bg-neutral-900 text-white text-[10px] font-bold flex items-center justify-center">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:inline max-w-[90px] truncate">
                  {user.name}
                </span>
              </div>
              <button
                onClick={logout}
                className="hidden sm:flex w-8 h-8 rounded-full items-center justify-center text-white/70 hover:text-rose-400 hover:bg-white/10 transition-all cursor-pointer"
                title="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => openAuthModal('login')}
              className="px-4 sm:px-5 h-8 rounded-full text-xs sm:text-[13px] font-semibold text-neutral-950 bg-white hover:bg-slate-100 transition-all cursor-pointer shadow-xs active:scale-95 whitespace-nowrap"
            >
              Login
            </button>
          )}

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="md:hidden w-8 h-8 rounded-full flex items-center justify-center text-white/85 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile & Small Tablet Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden pointer-events-auto mt-2 w-[calc(100vw-1.5rem)] max-w-sm rounded-3xl bg-neutral-950/95 dark:bg-slate-900/95 backdrop-blur-md border border-white/10 p-4 shadow-2xl animate-scaleIn">
          <nav className="flex flex-col gap-1 mb-3">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={handleNavClick}
                className="px-3.5 py-2.5 rounded-2xl text-sm font-medium text-white/85 hover:text-white hover:bg-white/10 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
            {user ? (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false)
                    onOpenHistory()
                  }}
                  className="flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-sm font-medium text-white/90 bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <FolderHeart className="w-4 h-4 text-teal-400" />
                    <span>My Journeys</span>
                  </span>
                  <span className="text-[11px] text-white/50">History</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false)
                    onPlanClick()
                  }}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-full text-xs font-semibold text-white bg-teal-600 hover:bg-teal-500 transition-colors cursor-pointer"
                >
                  <Compass className="w-4 h-4" />
                  <span>Plan a Trip</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false)
                    logout()
                  }}
                  className="flex items-center justify-center gap-2 px-4 py-2 rounded-full text-xs font-medium text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out ({user.name})</span>
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false)
                  openAuthModal('login')
                }}
                className="w-full py-2.5 rounded-full text-xs font-semibold text-neutral-950 bg-white hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Login / Create Account
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
