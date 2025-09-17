export interface Tal3a {
  id: string
  sport: 'Football' | 'Running' | 'Cycling' | 'Tennis' | 'Basketball'
  title: string
  location: string
  participants: number
  maxParticipants: number
  imageUrl: string
  date: string
  time: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  price?: number
}

export interface User {
  id: string
  name: string
  avatar: string
  level: number
  points: number
  badges: Array<Badge>
}

export interface Badge {
  id: string
  name: string
  description: string
  imageUrl: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  earnedAt?: string
}

export interface LeaderboardEntry {
  rank: number
  user: User
  weeklyPoints: number
}
