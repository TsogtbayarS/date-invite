import type { Activity, Cuisine } from '../types/dateFlow'

export const activities: Array<{ id: Exclude<Activity, null>; emoji: string; label: string }> = [
  { id: 'coffee', emoji: '☕', label: 'Coffee' },
  { id: 'dinner', emoji: '🍽️', label: 'Dinner' },
  { id: 'fun', emoji: '🎳', label: 'Something fun' },
  { id: 'surprise', emoji: '✨', label: 'Surprise me' },
]

export const cuisines: Array<{ id: Exclude<Cuisine, null>; emoji: string; label: string }> = [
  { id: 'italian', emoji: '🍝', label: 'Italian' },
  { id: 'mexican', emoji: '🌮', label: 'Mexican' },
  { id: 'sushi', emoji: '🍣', label: 'Sushi / Japanese' },
  { id: 'american', emoji: '🍔', label: 'American' },
  { id: 'steak', emoji: '🥩', label: 'Steak / BBQ' },
  { id: 'light', emoji: '🥗', label: 'Something light' },
  { id: 'anything', emoji: '🌎', label: "I'm open to anything" },
]
