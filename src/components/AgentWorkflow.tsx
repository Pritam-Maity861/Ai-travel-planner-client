import React from 'react'
import { Shield, Brain, Plane, Hotel, CloudSun, DollarSign, Calendar, UserCheck, CheckCircle } from 'lucide-react'
import type { TripStatus } from '../types/trip'

interface AgentWorkflowProps {
  status?: TripStatus
}

export const AgentWorkflow: React.FC<AgentWorkflowProps> = ({ status = 'running' }) => {
  const steps = [
    {
      id: 'guardrail',
      label: 'Guardrail',
      sub: 'Input validation',
      icon: Shield,
      active: status === 'running',
      completed: ['awaiting_review', 'completed'].includes(status),
    },
    {
      id: 'supervisor',
      label: 'Supervisor',
      sub: 'Intent routing',
      icon: Brain,
      active: status === 'running',
      completed: ['awaiting_review', 'completed'].includes(status),
    },
    {
      id: 'specialists',
      label: 'Specialists',
      sub: 'Air • Rail • Stays • Climate',
      icon: Plane,
      extraIcons: [Hotel, CloudSun],
      active: status === 'running',
      completed: ['awaiting_review', 'completed'].includes(status),
    },
    {
      id: 'budget',
      label: 'Budget & Itinerary',
      sub: 'Cost & Day Plan',
      icon: DollarSign,
      extraIcons: [Calendar],
      active: status === 'running',
      completed: ['awaiting_review', 'completed'].includes(status),
    },
    {
      id: 'review',
      label: 'Human Review',
      sub: 'User approval',
      icon: UserCheck,
      active: status === 'awaiting_review',
      completed: status === 'completed',
    },
    {
      id: 'final',
      label: 'Final Synthesis',
      sub: 'Generated guide',
      icon: CheckCircle,
      active: false,
      completed: status === 'completed',
    },
  ]

  return (
    <div className="w-full paper-card rounded-2xl p-4 sm:p-5 mb-8 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs transition-colors">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200/70 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-teal-600 dark:bg-teal-400 animate-pulse" />
          <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            Journey Curation Pipeline
          </h4>
        </div>
        <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
          Status: <span className="text-teal-800 dark:text-teal-400 font-semibold">{status.replace('_', ' ')}</span>
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {steps.map((step, idx) => {
          const Icon = step.icon
          return (
            <div
              key={step.id}
              className={`relative rounded-xl p-3 border transition-all ${
                step.active
                  ? 'bg-teal-50/90 dark:bg-teal-950/60 border-teal-300 dark:border-teal-700 shadow-2xs'
                  : step.completed
                  ? 'bg-slate-50 dark:bg-slate-800/50 border-teal-200/80 dark:border-teal-800/60 text-teal-900 dark:text-teal-200'
                  : 'bg-slate-50/60 dark:bg-slate-800/30 border-slate-200/60 dark:border-slate-800 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono font-medium text-slate-400 dark:text-slate-500">0{idx + 1}</span>
                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                    step.active
                      ? 'bg-teal-200/70 dark:bg-teal-800/60 text-teal-800 dark:text-teal-200'
                      : step.completed
                      ? 'bg-teal-100 dark:bg-teal-900/60 text-teal-700 dark:text-teal-300'
                      : 'bg-slate-200/60 dark:bg-slate-800 text-slate-400'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">{step.label}</div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{step.sub}</div>

              {step.active && (
                <div className="absolute inset-0 rounded-xl border border-teal-400/40 dark:border-teal-500/40 animate-pulse pointer-events-none" />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
