import React, { useMemo, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Check, Copy, Sparkles, Printer, PlusCircle, FileDown } from 'lucide-react'
import { getTripPdfUrl } from '../services/api'

interface FinalPlanProps {
  markdown: string
  threadId: string
  onNewTrip: () => void
}

export const FinalPlan: React.FC<FinalPlanProps> = ({ markdown, threadId, onNewTrip }) => {
  const [copied, setCopied] = useState(false)

  // Replace raw HTML <br> tags emitted by LLMs inside table cells/prose so they render cleanly
  const formattedMarkdown = useMemo(() => {
    return markdown.replace(/<br\s*\/?>/gi, ' · ')
  }, [markdown])

  const handleCopy = () => {
    navigator.clipboard.writeText(markdown)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="w-full paper-card-elevated rounded-3xl p-6 sm:p-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 mb-12 shadow-sm animate-in fade-in duration-500 transition-colors">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 text-xs font-semibold mb-2 border border-teal-200 dark:border-teal-800">
            <Sparkles className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            <span>Itinerary Finalized & Saved</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">
            Your Complete Travel Master Plan
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-1">Ref ID: {threadId.slice(0, 8)}</p>
          <p className="text-[12px] text-slate-600 dark:text-slate-400 mt-0.5">
            Your master PDF report has been generated. You can download it now or access it anytime from My Journeys.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <a
            href={getTripPdfUrl(threadId)}
            download={`Aetheria_Trip_${threadId.slice(0, 8)}.pdf`}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold bg-teal-700 hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-700 text-white shadow-2xs transition-all cursor-pointer active:scale-95"
          >
            <FileDown className="w-3.5 h-3.5 text-teal-200" />
            <span>Download Master PDF</span>
          </a>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-all cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Text'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-all cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print</span>
          </button>

          <button
            onClick={onNewTrip}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5 text-teal-700 dark:text-teal-400" />
            <span>Plan Another Trip</span>
          </button>
        </div>
      </div>

      {/* Rendered Markdown Body in serene coastal theme with dark mode support */}
      <article className="max-w-none text-slate-700 dark:text-slate-300 leading-relaxed">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({ children }) => (
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 mt-8 mb-4 pb-2 border-b border-slate-200 dark:border-slate-800 first:mt-0">
                {children}
              </h1>
            ),
            h2: ({ children }) => (
              <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100 mt-8 mb-3 flex items-center gap-2">
                {children}
              </h2>
            ),
            h3: ({ children }) => (
              <h3 className="text-base sm:text-lg font-bold text-teal-800 dark:text-teal-300 mt-6 mb-2">
                {children}
              </h3>
            ),
            p: ({ children }) => (
              <p className="text-sm sm:text-[15px] text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                {children}
              </p>
            ),
            ul: ({ children }) => (
              <ul className="list-disc pl-5 space-y-1.5 mb-4 text-sm sm:text-[15px] text-slate-600 dark:text-slate-300">
                {children}
              </ul>
            ),
            ol: ({ children }) => (
              <ol className="list-decimal pl-5 space-y-1.5 mb-4 text-sm sm:text-[15px] text-slate-600 dark:text-slate-300">
                {children}
              </ol>
            ),
            li: ({ children }) => <li className="leading-relaxed">{children}</li>,
            strong: ({ children }) => (
              <strong className="font-semibold text-slate-900 dark:text-slate-100">{children}</strong>
            ),
            hr: () => <hr className="my-6 border-slate-200 dark:border-slate-800" />,
            blockquote: ({ children }) => (
              <blockquote className="border-l-4 border-teal-500 bg-teal-50/50 dark:bg-teal-950/30 pl-4 py-2 pr-3 my-4 rounded-r-xl text-sm text-slate-700 dark:text-slate-300 italic">
                {children}
              </blockquote>
            ),
            table: ({ children }) => (
              <div className="my-5 w-full overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  {children}
                </table>
              </div>
            ),
            thead: ({ children }) => (
              <thead className="bg-slate-100 dark:bg-slate-800/90 text-slate-800 dark:text-slate-100 border-b border-slate-200 dark:border-slate-700">
                {children}
              </thead>
            ),
            tbody: ({ children }) => (
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-slate-900">
                {children}
              </tbody>
            ),
            tr: ({ children }) => (
              <tr className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                {children}
              </tr>
            ),
            th: ({ children }) => (
              <th className="px-3.5 py-2.5 font-bold text-slate-800 dark:text-slate-100 whitespace-nowrap">
                {children}
              </th>
            ),
            td: ({ children }) => (
              <td className="px-3.5 py-2.5 text-slate-600 dark:text-slate-300 align-top">
                {children}
              </td>
            ),
            code: ({ children }) => (
              <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-teal-800 dark:text-teal-300 font-mono text-xs">
                {children}
              </code>
            ),
          }}
        >
          {formattedMarkdown}
        </ReactMarkdown>
      </article>
    </div>
  )
}
