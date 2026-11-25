import React from 'react'
import logoImg from '../assets/logo.jpg'

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-slate-200 dark:border-slate-800 py-12 bg-white dark:bg-slate-900 mt-16 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <img
            src={logoImg}
            alt="AI-Travel_planner Logo"
            className="w-8 h-8 rounded-lg object-cover shadow-2xs"
          />
          <div>
            <span className="font-bold text-sm text-slate-800 dark:text-slate-100">AI-Travel_planner</span>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Bespoke Travel Intelligence & Itineraries
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6 text-xs text-slate-600 dark:text-slate-400 font-medium">
          <a href="#planner" className="hover:text-teal-800 dark:hover:text-teal-300 transition-colors">
            Planner
          </a>
          <a href="#how-it-works" className="hover:text-teal-800 dark:hover:text-teal-300 transition-colors">
            How It Works
          </a>
          <a href="#specialists" className="hover:text-teal-800 dark:hover:text-teal-300 transition-colors">
            Concierge Team
          </a>
          <a href="#faq" className="hover:text-teal-800 dark:hover:text-teal-300 transition-colors">
            FAQ
          </a>
        </div>

        <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
          <span>&copy; {new Date().getFullYear()} Aetheria Journeys. All rights reserved.</span>
        </div>
      </div>
    </footer>
  )
}
