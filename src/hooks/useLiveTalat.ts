import { useQuery } from '@tanstack/react-query'
import type { Tal3a } from '../types/tal3a'

const fetchLiveTalat = async (): Promise<Array<Tal3a>> => {
  console.log('Fetching mock data...')

  const mockData: Array<Tal3a> = [
    {
      id: '1',
      sport: 'Football',
      title: 'ماتش كورة في نادي المعادي',
      location: 'Maadi',
      participants: 8,
      maxParticipants: 12,
      imageUrl: 'https://placehold.co/600x400/00B894/FFFFFF?text=Football',
      date: '2025-09-15',
      time: '18:00',
      difficulty: 'intermediate',
      price: 50,
    },
    {
      id: '2',
      sport: 'Running',
      title: 'جري الصبح حوالين الزمالك',
      location: 'Zamalek',
      participants: 15,
      maxParticipants: 30,
      imageUrl: 'https://placehold.co/600x400/FDC500/FFFFFF?text=Running',
      date: '2025-09-16',
      time: '06:00',
      difficulty: 'beginner',
    },
    {
      id: '3',
      sport: 'Cycling',
      title: 'عجلة في التجمع الخامس',
      location: '5th Settlement',
      participants: 5,
      maxParticipants: 10,
      imageUrl: 'https://placehold.co/600x400/004E64/FFFFFF?text=Cycling',
      date: '2025-09-17',
      time: '07:00',
      difficulty: 'advanced',
      price: 100,
    },
    {
      id: '4',
      sport: 'Tennis',
      title: 'تنس في كلوب الجزيرة',
      location: 'Gezira',
      participants: 3,
      maxParticipants: 4,
      imageUrl: 'https://placehold.co/600x400/00B894/FFFFFF?text=Tennis',
      date: '2025-09-18',
      time: '16:00',
      difficulty: 'intermediate',
      price: 200,
    },
    {
      id: '5',
      sport: 'Basketball',
      title: 'بسكت في نادي الأهلي',
      location: 'Nasr City',
      participants: 6,
      maxParticipants: 10,
      imageUrl: 'https://placehold.co/600x400/FDC500/FFFFFF?text=Basketball',
      date: '2025-09-19',
      time: '19:00',
      difficulty: 'advanced',
      price: 75,
    },
  ]

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  return mockData
}

export const useLiveTalat = () => {
  return useQuery({
    queryKey: ['liveTalat'],
    queryFn: fetchLiveTalat,
  })
}
