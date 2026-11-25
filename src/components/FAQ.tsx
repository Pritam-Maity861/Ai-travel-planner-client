import React, { useState } from 'react'
import { ChevronDown, HelpCircle } from 'lucide-react'

export const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const items = [
    {
      q: 'How does Human-in-the-Loop review work?',
      a: 'After the specialist agents assemble flight, hotel, weather, and budget data, LangGraph triggers an `interrupt()`. The graph safely pauses, persists intermediate state in PostgreSQL, and delivers the draft to the frontend. You can approve it immediately or provide revision requests (up to 3 times) to re-run only the affected downstream agents.',
    },
    {
      q: 'How does PostgreSQL ensure long-term state persistence?',
      a: 'We use two decoupled PostgreSQL layers: SQLAlchemy asyncpg manages the primary `conversations` table for business records, while psycopg AsyncConnectionPool powers the LangGraph `AsyncPostgresSaver` checkpointer. Even if the server restarts mid-planning, your thread ID and state checkpoints remain intact.',
    },
    {
      q: 'What tools power the Flight, Hotel, and Weather agents?',
      a: 'The Flight agent connects via FastMCP to AviationStack for real-time flight schedules. The Hotel agent uses Tavily MCP for live web extraction of accommodations matching budget and ratings. The Weather agent utilizes Open-Meteo FastMCP for coordinates and daily 16-day forecasts without requiring paid API keys.',
    },
    {
      q: 'Why is the backend completely asynchronous?',
      a: 'Every FastAPI endpoint, database query (asyncpg), LLM invocation (ChatGroq ainvoke), and MCP tool call is non-blocking. Flight, Hotel, and Weather queries fan out concurrently in Stage 1, eliminating sequential network bottlenecks.',
    },
  ]

  return (
    <section id="faq" className="py-20 border-t border-slate-200/80 dark:border-slate-800 relative transition-colors">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-xs font-semibold text-teal-800 dark:text-teal-300 mb-3">
            <HelpCircle className="w-3.5 h-3.5 text-teal-700 dark:text-teal-400" />
            <span>Common Inquiries</span>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {items.map((item, idx) => (
            <div
              key={idx}
              className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs overflow-hidden transition-all"
            >
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full flex items-center justify-between p-5 text-left font-semibold text-sm sm:text-base text-slate-800 dark:text-slate-100 hover:text-teal-800 dark:hover:text-teal-300 transition-colors cursor-pointer"
              >
                <span>{item.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 dark:text-slate-500 transition-transform shrink-0 ml-4 ${
                    openIndex === idx ? 'rotate-180 text-teal-700 dark:text-teal-400' : ''
                  }`}
                />
              </button>

              {openIndex === idx && (
                <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-3">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
