import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBasketballBall,
  faBicycle,
  faBookmark,
  faCalendar,
  faClock,
  faEye,
  faFilter,
  faFootballBall,
  faHeart,
  faList,
  faMapMarkerAlt,
  faPlus,
  faRunning,
  faSearch,
  faShare,
  faStar,
  faSwimmer,
  faTableTennis,
  faTh,
  faUsers,
} from '@fortawesome/free-solid-svg-icons'

// Mock events data
const mockEvents = [
  {
    id: 1,
    title: 'مباراة كرة قدم ودية',
    type: 'football',
    description:
      'مباراة كرة قدم ودية في ملعب الحي - نحتاج 4 لاعبين إضافيين للفريق',
    date: '2024-01-20',
    time: '18:00',
    duration: '90 دقيقة',
    location: 'ملعب الحي - المعادي',
    participants: 16,
    maxParticipants: 20,
    organizer: 'أحمد محمد',
    image:
      'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=400&h=300&fit=crop',
    difficulty: 'متوسط',
    price: 'مجاني',
    priceValue: 0,
    likes: 24,
    isLiked: false,
    isBookmarked: true,
    rating: 4.5,
  },
  {
    id: 2,
    title: 'جلسة يوجا في الحديقة',
    type: 'yoga',
    description: 'جلسة يوجا صباحية مريحة للمبتدئين والمتقدمين مع مدربة معتمدة',
    date: '2024-01-21',
    time: '07:00',
    duration: '60 دقيقة',
    location: 'حديقة الأزهر',
    participants: 8,
    maxParticipants: 15,
    organizer: 'سارة أحمد',
    image:
      'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=300&fit=crop',
    difficulty: 'مبتدئ',
    price: '50 ج.م',
    priceValue: 50,
    likes: 18,
    isLiked: true,
    isBookmarked: false,
    rating: 4.8,
  },
  {
    id: 3,
    title: 'جري صباحي جماعي',
    type: 'running',
    description:
      'جري صباحي لمسافة 5 كيلو في كورنيش النيل مع مجموعة من العدائين',
    date: '2024-01-22',
    time: '06:30',
    duration: '45 دقيقة',
    location: 'كورنيش النيل - الجزيرة',
    participants: 12,
    maxParticipants: 25,
    organizer: 'محمد علي',
    image:
      'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=400&h=300&fit=crop',
    difficulty: 'متقدم',
    price: 'مجاني',
    priceValue: 0,
    likes: 35,
    isLiked: false,
    isBookmarked: true,
    rating: 4.2,
  },
  {
    id: 4,
    title: 'تدريب سباحة للمبتدئين',
    type: 'swimming',
    description: 'تدريب سباحة للمبتدئين في نادي الزمالك مع مدرب معتمد',
    date: '2024-01-23',
    time: '16:00',
    duration: '60 دقيقة',
    location: 'نادي الزمالك',
    participants: 6,
    maxParticipants: 10,
    organizer: 'كريم حسام',
    image:
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop',
    difficulty: 'مبتدئ',
    price: '100 ج.م',
    priceValue: 100,
    likes: 14,
    isLiked: true,
    isBookmarked: false,
    rating: 4.6,
  },
]

const sportTypes = [
  { key: 'all', label: 'جميع الأنشطة', icon: faCalendar },
  { key: 'football', label: 'كرة القدم', icon: faFootballBall },
  { key: 'running', label: 'جري', icon: faRunning },
  { key: 'swimming', label: 'سباحة', icon: faSwimmer },
  { key: 'basketball', label: 'كرة السلة', icon: faBasketballBall },
  { key: 'cycling', label: 'ركوب دراجات', icon: faBicycle },
  { key: 'yoga', label: 'يوجا', icon: faTableTennis },
]

export const Route = createFileRoute('/(authenticated)/events')({
  component: EventsPage,
})

function EventsPage() {
  const [events, setEvents] = useState(mockEvents)
  const [filteredEvents, setFilteredEvents] = useState(mockEvents)
  const [selectedSport, setSelectedSport] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)

  // Filter events
  useEffect(() => {
    let filtered = events

    if (selectedSport !== 'all') {
      filtered = filtered.filter((event) => event.type === selectedSport)
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (event) =>
          event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.location.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    setFilteredEvents(filtered)
  }, [selectedSport, searchQuery, events])

  const toggleLike = (id: number) => {
    setEvents((prev) =>
      prev.map((event) =>
        event.id === id
          ? {
              ...event,
              isLiked: !event.isLiked,
              likes: event.isLiked ? event.likes - 1 : event.likes + 1,
            }
          : event,
      ),
    )
  }

  const toggleBookmark = (id: number) => {
    setEvents((prev) =>
      prev.map((event) =>
        event.id === id
          ? { ...event, isBookmarked: !event.isBookmarked }
          : event,
      ),
    )
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'مبتدئ':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'متوسط':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'متقدم':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('ar-EG', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const getSportIcon = (type: string) => {
    const sport = sportTypes.find((s) => s.key === type)
    return sport?.icon || faCalendar
  }

  const renderStars = (rating: number) => {
    const stars = []
    const fullStars = Math.floor(rating)

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <FontAwesomeIcon
          key={i}
          icon={faStar}
          className="text-yellow-400 text-xs"
        />,
      )
    }

    return stars
  }

  return (
    <div className="p-6 max-w-full mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <FontAwesomeIcon
              icon={faCalendar}
              className="text-3xl text-primary ml-3"
            />
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                الأنشطة الرياضية
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-lg mt-1">
                اكتشف واشترك في أفضل الأنشطة الرياضية في منطقتك
              </p>
            </div>
          </div>

          <button className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
            <FontAwesomeIcon icon={faPlus} className="ml-2" />
            إنشاء نشاط جديد
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center ml-3">
                <FontAwesomeIcon
                  icon={faCalendar}
                  className="text-blue-600 text-xl"
                />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {events.length}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  إجمالي الأنشطة
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center ml-3">
                <FontAwesomeIcon
                  icon={faUsers}
                  className="text-green-600 text-xl"
                />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {events.reduce((sum, event) => sum + event.participants, 0)}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  المشاركين
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center ml-3">
                <FontAwesomeIcon
                  icon={faHeart}
                  className="text-purple-600 text-xl"
                />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {events.reduce((sum, event) => sum + event.likes, 0)}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  إعجابات
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center ml-3">
                <FontAwesomeIcon
                  icon={faStar}
                  className="text-orange-600 text-xl"
                />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {(
                    events.reduce((sum, event) => sum + event.rating, 0) /
                    events.length
                  ).toFixed(1)}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  متوسط التقييم
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-6">
        <div className="flex flex-col lg:flex-row gap-4 mb-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <FontAwesomeIcon
                icon={faSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="ابحث في الأنشطة..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-10 pl-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-gray-600 text-primary shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
            >
              <FontAwesomeIcon icon={faTh} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded transition-colors ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-gray-600 text-primary shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
            >
              <FontAwesomeIcon icon={faList} />
            </button>
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <FontAwesomeIcon icon={faFilter} className="ml-2" />
            فلترة
          </button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  نوع النشاط
                </label>
                <select
                  value={selectedSport}
                  onChange={(e) => setSelectedSport(e.target.value)}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary"
                >
                  {sportTypes.map((sport) => (
                    <option key={sport.key} value={sport.key}>
                      {sport.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center gap-2 mb-4">
          <span className="text-sm text-gray-600 dark:text-gray-400">عرض:</span>
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            {filteredEvents.length} من {events.length} نشاط
          </span>
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((event) => (
          <div
            key={event.id}
            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all duration-200 group"
          >
            <div className="relative">
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
              />

              <div className="absolute top-3 right-3 flex gap-2">
                <button
                  onClick={() => toggleBookmark(event.id)}
                  className="w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
                >
                  <FontAwesomeIcon
                    icon={faBookmark}
                    className={`text-sm ${event.isBookmarked ? 'text-yellow-400' : 'text-white'}`}
                  />
                </button>
              </div>

              <div className="absolute bottom-3 left-3">
                <span
                  className={`text-xs px-2 py-1 rounded-full border ${getDifficultyColor(event.difficulty)}`}
                >
                  {event.difficulty}
                </span>
              </div>

              <div className="absolute bottom-3 right-3">
                <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center">
                  <FontAwesomeIcon
                    icon={getSportIcon(event.type)}
                    className="text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="p-6">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">
                {event.title}
              </h3>

              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                {event.description}
              </p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <FontAwesomeIcon
                    icon={faCalendar}
                    className="w-4 ml-2 text-primary"
                  />
                  <span>{formatDate(event.date)}</span>
                </div>

                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <FontAwesomeIcon
                    icon={faClock}
                    className="w-4 ml-2 text-primary"
                  />
                  <span>
                    {event.time} ({event.duration})
                  </span>
                </div>

                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <FontAwesomeIcon
                    icon={faMapMarkerAlt}
                    className="w-4 ml-2 text-primary"
                  />
                  <span className="line-clamp-1">{event.location}</span>
                </div>

                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <FontAwesomeIcon
                    icon={faUsers}
                    className="w-4 ml-2 text-primary"
                  />
                  <span>
                    {event.participants}/{event.maxParticipants} مشارك
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-1">
                  {renderStars(event.rating)}
                  <span className="text-sm text-gray-600 dark:text-gray-400 mr-1">
                    ({event.rating})
                  </span>
                </div>

                <div className="text-right">
                  <p className="font-bold text-lg text-primary">
                    {event.price}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleLike(event.id)}
                    className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <FontAwesomeIcon
                      icon={faHeart}
                      className={`${event.isLiked ? 'text-red-500' : ''}`}
                    />
                    <span>{event.likes}</span>
                  </button>

                  <button className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-blue-500 transition-colors">
                    <FontAwesomeIcon icon={faShare} />
                  </button>

                  <button className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-green-500 transition-colors">
                    <FontAwesomeIcon icon={faEye} />
                  </button>
                </div>

                <button className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
                  انضم الآن
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredEvents.length === 0 && (
        <div className="text-center py-12">
          <FontAwesomeIcon
            icon={faCalendar}
            className="text-6xl text-gray-300 dark:text-gray-600 mb-4"
          />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            لا توجد أنشطة متاحة
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            جرب تغيير معايير البحث أو الفلترة
          </p>
          <button className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors">
            إنشاء نشاط جديد
          </button>
        </div>
      )}
    </div>
  )
}
