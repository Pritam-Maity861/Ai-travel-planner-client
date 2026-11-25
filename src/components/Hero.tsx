import React, { useMemo } from 'react'
import { Plus, Star } from 'lucide-react'
import DottedMap from 'dotted-map'
import { SAMPLE_DESTINATIONS, type DestinationPrompt } from '../data/destinations'
import heroBg from '../assets/hero-bg.jpg'

interface HeroProps {
  onExploreClick: () => void
  onSelectDestination?: (sample: DestinationPrompt) => void
}

const TRAVEL_DESTINATIONS = [
  { label: 'United States', lat: 39.8, lng: -98.5, sampleIdx: null, mobileHidden: false },
  { label: 'Greenland', lat: 71.7, lng: -42.6, sampleIdx: null, mobileHidden: true },
  { label: 'Brazil', lat: -14.2, lng: -51.9, sampleIdx: null, mobileHidden: true },
  { label: 'Paris', lat: 48.8, lng: 2.3, sampleIdx: null, mobileHidden: false },
  { label: 'Egypt', lat: 26.8, lng: 30.8, sampleIdx: null, mobileHidden: true },
  { label: 'Dubai', lat: 25.2, lng: 55.3, sampleIdx: 2, mobileHidden: false },
  { label: 'North Sikkim', lat: 27.7, lng: 88.6, sampleIdx: 0, mobileHidden: false },
  { label: 'Goa', lat: 15.3, lng: 74.1, sampleIdx: 1, mobileHidden: false },
  { label: 'Tokyo', lat: 35.7, lng: 139.7, sampleIdx: 3, mobileHidden: false },
  { label: 'Australia', lat: -25.3, lng: 133.8, sampleIdx: null, mobileHidden: true },
]

const AVATARS = [
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
]

export const Hero: React.FC<HeroProps> = ({ onExploreClick, onSelectDestination }) => {
  const { mapPoints, mapWidth, mapHeight, pins } = useMemo(() => {
    const map = new DottedMap({ height: 56, grid: 'diagonal' })
    const points = map.getPoints()
    const { width, height } = map.image
    const resolvedPins = TRAVEL_DESTINATIONS.map((dest) => {
      const pt = map.getPin({ lat: dest.lat, lng: dest.lng })
      return {
        ...dest,
        left: pt ? `${(pt.x / width) * 100}%` : '50%',
        top: pt ? `${(pt.y / height) * 100}%` : '50%',
      }
    })
    return { mapPoints: points, mapWidth: width, mapHeight: height, pins: resolvedPins }
  }, [])

  const scrollToInfo = () => {
    const el = document.getElementById('how-it-works')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="relative pt-22 sm:pt-28 pb-12 sm:pb-16 overflow-hidden bg-gradient-to-br from-sky-100/80 via-white to-blue-50/70 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Row: Editorial Headline (Left) + CTAs & Subtitle (Right) */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 sm:gap-8 mb-10 sm:mb-12">
          <h1 className="font-editorial text-3xl sm:text-5xl lg:text-[64px] font-semibold tracking-tight text-neutral-900 dark:text-slate-100 leading-[1.1]">
            Your Next <em className="italic font-semibold">Great</em>
            <br />
            <em className="italic font-semibold">Adventure</em> Awaits
          </h1>

          <div className="max-w-xs">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <button
                type="button"
                onClick={onExploreClick}
                className="px-6 py-2.5 rounded-full bg-[#f05a28] hover:bg-[#d94a1c] text-white text-xs sm:text-sm font-semibold shadow-sm transition-all cursor-pointer active:scale-95"
              >
                Explore Now
              </button>
              <button
                type="button"
                onClick={scrollToInfo}
                className="px-6 py-2.5 rounded-full bg-white/90 dark:bg-slate-800 border border-[#f05a28]/35 text-neutral-800 dark:text-slate-200 hover:bg-orange-50 dark:hover:bg-slate-700 text-xs sm:text-sm font-semibold transition-all cursor-pointer"
              >
                More Info
              </button>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              From hidden gems to iconic destinations — explore the world like never before with
              AI-planned escapes.
            </p>
          </div>
        </div>

        {/* Bottom Row: 2-Column Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left Column: Dotted World Map Card + Social Proof */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-5">
            <div className="relative flex-1 min-h-[260px] sm:min-h-[290px] rounded-3xl bg-[#f1f8fc] dark:bg-slate-900/90 border border-sky-100 dark:border-slate-800 p-4 overflow-hidden shadow-2xs flex items-center justify-center">
              {/* Geographically Accurate Dotted World Map */}
              <div
                className="relative w-full"
                style={{ aspectRatio: `${mapWidth} / ${mapHeight}` }}
              >
                <svg
                  viewBox={`0 0 ${mapWidth} ${mapHeight}`}
                  className="w-full h-full text-sky-500/55 dark:text-sky-400/35"
                  aria-hidden="true"
                >
                  {mapPoints.map((pt, idx) => (
                    <circle key={idx} cx={pt.x} cy={pt.y} r={0.28} fill="currentColor" />
                  ))}
                </svg>

                {/* Floating Destination Pins locked to exact lat/lng */}
                {pins.map((pin) => {
                  const sample = pin.sampleIdx !== null ? SAMPLE_DESTINATIONS[pin.sampleIdx] : null
                  return (
                    <button
                      key={pin.label}
                      type="button"
                      onClick={() => {
                        if (sample && onSelectDestination) {
                          onSelectDestination(sample)
                        } else {
                          onExploreClick()
                        }
                      }}
                      style={{ left: pin.left, top: pin.top }}
                      className={`absolute -translate-x-1/2 -translate-y-full flex-col items-center gap-0.5 group cursor-pointer z-10 hover:z-20 ${
                        pin.mobileHidden ? 'hidden sm:flex' : 'flex'
                      }`}
                    >
                      <span className="px-1.5 sm:px-2 py-0.5 rounded-full bg-sky-200/95 dark:bg-sky-900/95 text-[8px] sm:text-[10px] font-semibold text-sky-950 dark:text-sky-100 shadow-xs group-hover:bg-[#f05a28] group-hover:text-white group-hover:scale-105 transition-all whitespace-nowrap">
                        {pin.label}
                      </span>
                      <span className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-white border-2 border-blue-600 group-hover:border-[#f05a28] shadow-xs transition-colors" />
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Social Proof Strip */}
            <div className="flex items-center justify-center sm:justify-start gap-3.5 px-2">
              <div className="flex -space-x-2.5">
                {AVATARS.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt="Traveler"
                    className="w-9 h-9 rounded-full object-cover border-2 border-white dark:border-slate-900 shadow-2xs"
                  />
                ))}
              </div>
              <div>
                <div className="flex items-center gap-0.5 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mt-0.5">
                  1,000+ travelers joined
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Showcase Card with Floating Feature Callouts */}
          <div className="lg:col-span-7">
            <div className="relative h-full min-h-[240px] sm:min-h-[340px] lg:min-h-[360px] rounded-3xl overflow-hidden bg-sky-50 dark:bg-slate-900 border border-sky-100 dark:border-slate-800 shadow-sm group">
              <img
                src={heroBg}
                alt="Curated global travel destinations"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/35 via-transparent to-sky-900/10" />

              {/* Floating Pill Callout: Budget Friendly */}
              <button
                type="button"
                onClick={onExploreClick}
                className="absolute top-[14%] left-[8%] sm:left-[22%] inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-white/95 dark:bg-slate-900/95 text-[11px] sm:text-xs font-semibold text-slate-800 dark:text-slate-100 shadow-md hover:scale-105 transition-transform cursor-pointer"
              >
                <span>Budget Friendly</span>
                <span className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-[#f05a28] text-white flex items-center justify-center">
                  <Plus className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                </span>
              </button>

              {/* Floating Pill Callout: World Tour */}
              <button
                type="button"
                onClick={onExploreClick}
                className="absolute top-[46%] right-[6%] sm:right-[12%] inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-white/95 dark:bg-slate-900/95 text-[11px] sm:text-xs font-semibold text-slate-800 dark:text-slate-100 shadow-md hover:scale-105 transition-transform cursor-pointer"
              >
                <span>World Tour</span>
                <span className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-[#f05a28] text-white flex items-center justify-center">
                  <Plus className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                </span>
              </button>

              {/* Floating Pill Callout: Premium Stay */}
              <button
                type="button"
                onClick={onExploreClick}
                className="absolute bottom-[12%] left-[8%] sm:left-[14%] inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-white/95 dark:bg-slate-900/95 text-[11px] sm:text-xs font-semibold text-slate-800 dark:text-slate-100 shadow-md hover:scale-105 transition-transform cursor-pointer"
              >
                <span>Premium Stay</span>
                <span className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-[#f05a28] text-white flex items-center justify-center">
                  <Plus className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
