export interface DestinationPrompt {
  title: string
  origin: string
  destination: string
  durationDays: number
  budget: string
  currency: string
  adults: number
  children: number
  foodPreference: string
  tag: string
  badgeText: string
  image: string
  notes: string
}

export const SAMPLE_DESTINATIONS: DestinationPrompt[] = [
  {
    title: 'North Sikkim Expedition',
    origin: 'Kolkata',
    destination: 'North Sikkim',
    durationDays: 7,
    budget: '80000',
    currency: 'INR',
    adults: 6,
    children: 2,
    foodPreference: 'Vegetarian',
    tag: 'Himalayan Pass',
    badgeText: '7 Days • ₹80k',
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80',
    notes: 'Scenic tour with homestays. Prefer train options to New Jalpaiguri for budget savings.',
  },
  {
    title: 'Goa Coastal Escape',
    origin: 'Mumbai',
    destination: 'Goa',
    durationDays: 4,
    budget: '35000',
    currency: 'INR',
    adults: 4,
    children: 0,
    foodPreference: 'Non-Vegetarian',
    tag: 'Tropical Sunset',
    badgeText: '4 Days • ₹35k',
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
    notes: 'Relaxed beachside vacation with seaside dining and scenic train route options.',
  },
  {
    title: 'Dubai Luxury Getaway',
    origin: 'Kolkata',
    destination: 'Dubai',
    durationDays: 4,
    budget: '120000',
    currency: 'INR',
    adults: 2,
    children: 0,
    foodPreference: 'Non-Vegetarian',
    tag: 'Skyline & Dunes',
    badgeText: '4 Days • ₹1.2L',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80',
    notes: 'Weekend luxury vacation with boutique stays, desert safari, and downtown dining.',
  },
  {
    title: 'Tokyo Cultural Voyage',
    origin: 'New Delhi',
    destination: 'Tokyo',
    durationDays: 5,
    budget: '250000',
    currency: 'JPY',
    adults: 2,
    children: 1,
    foodPreference: 'Any / Standard',
    tag: 'Historic Pagoda',
    badgeText: '5 Days • ¥250k',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80',
    notes: 'Cultural and culinary immersion in Tokyo with high-speed Shinkansen day trip.',
  },
]

