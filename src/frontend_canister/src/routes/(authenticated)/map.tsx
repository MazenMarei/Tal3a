import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
import L from 'leaflet'

// Import Leaflet CSS
import 'leaflet/dist/leaflet.css'

// Fix for default markers in React Leaflet
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

import {
  faBasketballBall,
  faBicycle,
  faCalendar,
  faClock,
  faCompress,
  faExpand,
  faEye,
  faFilter,
  faFootballBall,
  faHeart,
  faLocationCrosshairs,
  faMap,
  faMapMarkerAlt,
  faRunning,
  faShare,
  faSwimmer,
  faTableTennis,
  faTimes,
  faUsers,
} from '@fortawesome/free-solid-svg-icons'

delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
})

// Mock events/tal3a data with coordinates (Cairo area) - [lat, lng] format for Leaflet
const mockEvents = [
  {
    id: 1,
    title: 'مباراة كرة قدم ودية',
    type: 'football',
    description: 'مباراة كرة قدم ودية في ملعب الحي - نحتاج 4 لاعبين إضافيين',
    date: '2024-01-20',
    time: '18:00',
    duration: '90 دقيقة',
    location: 'ملعب الحي - المعادي',
    coordinates: [29.9602, 31.2357] as [number, number],
    participants: 16,
    maxParticipants: 20,
    organizer: 'أحمد محمد',
    avatar:
      'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-1.jpg',
    image:
      'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=400&h=300&fit=crop',
    difficulty: 'متوسط',
    price: 'مجاني',
    likes: 24,
    isLiked: false,
  },
  {
    id: 2,
    title: 'جلسة يوجا في الحديقة',
    type: 'yoga',
    description: 'جلسة يوجا صباحية مريحة للمبتدئين والمتقدمين',
    date: '2024-01-21',
    time: '07:00',
    duration: '60 دقيقة',
    location: 'حديقة الأزهر',
    coordinates: [30.0291, 31.2621] as [number, number],
    participants: 8,
    maxParticipants: 15,
    organizer: 'سارة أحمد',
    avatar:
      'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-2.jpg',
    image:
      'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=300&fit=crop',
    difficulty: 'مبتدئ',
    price: '50 ج.م',
    likes: 18,
    isLiked: true,
  },
  {
    id: 3,
    title: 'جري صباحي جماعي',
    type: 'running',
    description: 'جري صباحي لمسافة 5 كيلو في كورنيش النيل',
    date: '2024-01-22',
    time: '06:30',
    duration: '45 دقيقة',
    location: 'كورنيش النيل - الجزيرة',
    coordinates: [30.0566, 31.2249] as [number, number],
    participants: 12,
    maxParticipants: 25,
    organizer: 'محمد علي',
    avatar:
      'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-3.jpg',
    image:
      'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=400&h=300&fit=crop',
    difficulty: 'متقدم',
    price: 'مجاني',
    likes: 35,
    isLiked: false,
  },
  {
    id: 4,
    title: 'تدريب سباحة',
    type: 'swimming',
    description: 'تدريب سباحة للمبتدئين في نادي الزمالك',
    date: '2024-01-23',
    time: '16:00',
    duration: '60 دقيقة',
    location: 'نادي الزمالك',
    coordinates: [30.0626, 31.2308] as [number, number],
    participants: 6,
    maxParticipants: 10,
    organizer: 'كريم حسام',
    avatar:
      'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-4.jpg',
    image:
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop',
    difficulty: 'مبتدئ',
    price: '100 ج.م',
    likes: 14,
    isLiked: true,
  },
]

const sportTypes = [
  { key: 'all', label: 'جميع الأنشطة', icon: faMap },
  { key: 'football', label: 'كرة القدم', icon: faFootballBall },
  { key: 'running', label: 'جري', icon: faRunning },
  { key: 'swimming', label: 'سباحة', icon: faSwimmer },
  { key: 'basketball', label: 'كرة السلة', icon: faBasketballBall },
  { key: 'cycling', label: 'ركوب دراجات', icon: faBicycle },
  { key: 'yoga', label: 'يوجا', icon: faTableTennis },
]

// Custom marker icons for different sports
const createCustomIcon = (type: string, color = '#10b981') => {
  const sportIcons = {
    football: '⚽',
    running: '🏃',
    swimming: '🏊',
    basketball: '🏀',
    cycling: '🚴',
    yoga: '🧘',
    default: '📍',
  }

  const icon = sportIcons[type as keyof typeof sportIcons] || sportIcons.default

  return L.divIcon({
    html: `
      <div style="
        background-color: ${color};
        width: 40px;
        height: 40px;
        border-radius: 50%;
        border: 3px solid white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        cursor: pointer;
      ">
        ${icon}
      </div>
    `,
    className: 'custom-marker',
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20],
  })
}

// User location icon
const createUserLocationIcon = () => {
  return L.divIcon({
    html: `
      <div style="
        background-color: #3b82f6;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        border: 4px solid white;
        box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.3);
        animation: pulse 2s infinite;
      "></div>
      <style>
        @keyframes pulse {
          0% { box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.3); }
          50% { box-shadow: 0 0 0 8px rgba(59, 130, 246, 0.1); }
          100% { box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.3); }
        }
      </style>
    `,
    className: 'user-location-marker',
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  })
}

// Component to handle map centering
function MapController({
  center,
  userLocation,
}: {
  center: [number, number]
  userLocation: [number, number] | null
}) {
  const map = useMap()

  useEffect(() => {
    if (userLocation) {
      map.setView(userLocation, 13, { animate: true })
    } else {
      map.setView(center, 12, { animate: true })
    }
  }, [map, center, userLocation])

  return null
}

export const Route = createFileRoute('/(authenticated)/map')({
  component: MapPage,
})

function MapPage() {
  const { t } = useTranslation()
  const [events, setEvents] = useState(mockEvents)
  const [selectedSport, setSelectedSport] = useState('all')
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<any>(null)
  const [userLocation, setUserLocation] = useState<[number, number] | null>(
    null,
  )
  const [isLocating, setIsLocating] = useState(false)
  const [mapCenter, setMapCenter] = useState<[number, number]>([
    30.0444, 31.2357,
  ]) // Cairo center

  const filteredEvents = events.filter(
    (event) => selectedSport === 'all' || event.type === selectedSport,
  )

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

  const getUserLocation = () => {
    setIsLocating(true)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          const newLocation: [number, number] = [latitude, longitude]
          setUserLocation(newLocation)
          setMapCenter(newLocation)
          setIsLocating(false)
        },
        (error) => {
          console.error('Error getting location:', error)
          // Default to Cairo center if location fails
          const defaultLocation: [number, number] = [30.0444, 31.2357]
          setUserLocation(defaultLocation)
          setMapCenter(defaultLocation)
          setIsLocating(false)
        },
      )
    } else {
      // Default to Cairo center if geolocation not supported
      const defaultLocation: [number, number] = [30.0444, 31.2357]
      setUserLocation(defaultLocation)
      setMapCenter(defaultLocation)
      setIsLocating(false)
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'سهل':
      case 'مبتدئ':
        return 'bg-green-100 text-green-800'
      case 'متوسط':
        return 'bg-yellow-100 text-yellow-800'
      case 'متقدم':
      case 'صعب':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
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

  return (
    <div
      className={`${isFullscreen ? 'fixed inset-0 z-50 bg-white dark:bg-gray-900' : 'p-6 max-w-full mx-10'}`}
    >
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <FontAwesomeIcon
              icon={faMap}
              className="text-3xl text-primary ml-3"
            />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              خريطة الأنشطة
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={getUserLocation}
              disabled={isLocating}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <FontAwesomeIcon
                icon={faLocationCrosshairs}
                className={`ml-2 ${isLocating ? 'animate-spin' : ''}`}
              />
              {isLocating ? 'جاري التحديد...' : 'موقعي'}
            </button>

            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <FontAwesomeIcon
                icon={isFullscreen ? faCompress : faExpand}
                className="ml-2"
              />
              {isFullscreen ? 'تصغير' : 'شاشة كاملة'}
            </button>
          </div>
        </div>

        {!isFullscreen && (
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            اكتشف الأنشطة الرياضية في منطقتك
          </p>
        )}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 mb-6">
        <FontAwesomeIcon icon={faFilter} className="text-gray-500" />
        <div className="flex flex-wrap gap-2">
          {sportTypes.map((sport) => (
            <button
              key={sport.key}
              onClick={() => setSelectedSport(sport.key)}
              className={`flex items-center px-4 py-2 rounded-full font-medium transition-all duration-200 ${
                selectedSport === sport.key
                  ? 'bg-primary text-white shadow-lg'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              <FontAwesomeIcon icon={sport.icon} className="ml-2" />
              {sport.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div
        className={`flex ${isFullscreen ? 'h-[calc(100vh-120px)]' : 'h-[600px]'} gap-6`}
      >
        {/* Map Section */}
        <div
          className={`${isFullscreen ? 'w-full' : 'w-3/4'} relative rounded-xl overflow-hidden z-0`}
        >
          <MapContainer
            center={mapCenter}
            zoom={12}
            style={{ height: '100%', width: '100%' }}
            className="rounded-xl"
          >
            {/* Clean minimal tile layer - CartoDB Positron */}
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
              subdomains="abcd"
              maxZoom={20}
            />

            {/* Map Controller for centering */}
            <MapController center={mapCenter} userLocation={userLocation} />

            {/* Event Markers */}
            {filteredEvents.map((event) => (
              <Marker
                key={event.id}
                position={event.coordinates}
                icon={createCustomIcon(event.type)}
              >
                <Popup>
                  <div className="p-2 max-w-xs">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-24 object-cover rounded mb-2"
                    />
                    <h4 className="font-semibold text-sm mb-1">
                      {event.title}
                    </h4>
                    <p className="text-xs text-gray-600 mb-2">
                      {event.description}
                    </p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">{event.time}</span>
                      <span
                        className={`px-2 py-1 rounded ${getDifficultyColor(event.difficulty)}`}
                      >
                        {event.difficulty}
                      </span>
                    </div>
                    <button
                      onClick={() => setSelectedEvent(event)}
                      className="w-full mt-2 bg-primary text-white py-1 px-2 rounded text-xs hover:bg-primary/90"
                    >
                      عرض التفاصيل
                    </button>
                  </div>
                </Popup>
              </Marker>
            ))}

            {/* User Location Marker */}
            {userLocation && (
              <Marker position={userLocation} icon={createUserLocationIcon()}>
                <Popup>
                  <div className="text-center">
                    <p className="font-semibold text-sm">موقعك الحالي</p>
                    <p className="text-xs text-gray-600">
                      {userLocation[0].toFixed(4)}, {userLocation[1].toFixed(4)}
                    </p>
                  </div>
                </Popup>
              </Marker>
            )}
          </MapContainer>
        </div>

        {/* Events List Section */}
        {!isFullscreen && (
          <div className="w-1/4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                الأنشطة القريبة ({filteredEvents.length})
              </h3>
            </div>

            <div className="flex-1 overflow-y-auto">
              {filteredEvents.map((event) => (
                <div
                  key={event.id}
                  className="p-4 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                  onClick={() => setSelectedEvent(event)}
                >
                  <div className="flex items-start space-x-3">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 dark:text-white text-sm line-clamp-1">
                        {event.title}
                      </h4>

                      <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1">
                        <FontAwesomeIcon icon={faCalendar} className="ml-1" />
                        <span>{formatDate(event.date)}</span>
                      </div>

                      <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1">
                        <FontAwesomeIcon icon={faClock} className="ml-1" />
                        <span>
                          {event.time} ({event.duration})
                        </span>
                      </div>

                      <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1">
                        <FontAwesomeIcon
                          icon={faMapMarkerAlt}
                          className="ml-1"
                        />
                        <span className="line-clamp-1">{event.location}</span>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        <span
                          className={`text-xs px-2 py-1 rounded ${getDifficultyColor(event.difficulty)}`}
                        >
                          {event.difficulty}
                        </span>

                        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                          <FontAwesomeIcon icon={faUsers} className="ml-1" />
                          <span>
                            {event.participants}/{event.maxParticipants}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {filteredEvents.length === 0 && (
                <div className="p-8 text-center">
                  <FontAwesomeIcon
                    icon={faMap}
                    className="text-4xl text-gray-300 dark:text-gray-600 mb-2"
                  />
                  <p className="text-gray-500 dark:text-gray-400">
                    لا توجد أنشطة متاحة
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Event Details Popup */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="relative">
              <img
                src={selectedEvent.image}
                alt={selectedEvent.title}
                className="w-full h-48 object-cover rounded-t-2xl"
              />

              <button
                onClick={() => setSelectedEvent(null)}
                className="absolute top-3 right-3 w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-opacity-70 transition-colors"
              >
                <FontAwesomeIcon icon={faTimes} className="text-sm" />
              </button>

              <div className="absolute bottom-3 right-3 flex gap-2">
                <button
                  onClick={() => toggleLike(selectedEvent.id)}
                  className="w-8 h-8 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-all"
                >
                  <FontAwesomeIcon
                    icon={faHeart}
                    className={`text-sm ${selectedEvent.isLiked ? 'text-red-500' : 'text-gray-400'}`}
                  />
                </button>
                <button className="w-8 h-8 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-all">
                  <FontAwesomeIcon
                    icon={faShare}
                    className="text-sm text-gray-600 dark:text-gray-400"
                  />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {selectedEvent.title}
                </h2>
                <span
                  className={`text-sm px-3 py-1 rounded-full ${getDifficultyColor(selectedEvent.difficulty)}`}
                >
                  {selectedEvent.difficulty}
                </span>
              </div>

              <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                {selectedEvent.description}
              </p>

              <div className="space-y-3 mb-6">
                <div className="flex items-center text-gray-700 dark:text-gray-300">
                  <FontAwesomeIcon
                    icon={faCalendar}
                    className="w-5 ml-3 text-primary"
                  />
                  <span>{formatDate(selectedEvent.date)}</span>
                </div>

                <div className="flex items-center text-gray-700 dark:text-gray-300">
                  <FontAwesomeIcon
                    icon={faClock}
                    className="w-5 ml-3 text-primary"
                  />
                  <span>
                    {selectedEvent.time} ({selectedEvent.duration})
                  </span>
                </div>

                <div className="flex items-center text-gray-700 dark:text-gray-300">
                  <FontAwesomeIcon
                    icon={faMapMarkerAlt}
                    className="w-5 ml-3 text-primary"
                  />
                  <span>{selectedEvent.location}</span>
                </div>

                <div className="flex items-center text-gray-700 dark:text-gray-300">
                  <FontAwesomeIcon
                    icon={faUsers}
                    className="w-5 ml-3 text-primary"
                  />
                  <span>
                    {selectedEvent.participants}/{selectedEvent.maxParticipants}{' '}
                    مشارك
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <img
                    src={selectedEvent.avatar}
                    alt={selectedEvent.organizer}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white text-sm">
                      {selectedEvent.organizer}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      منظم النشاط
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-bold text-lg text-primary">
                    {selectedEvent.price}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {selectedEvent.likes} إعجاب
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <button className="flex-1 bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors">
                  انضم للنشاط
                </button>
                <button className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <FontAwesomeIcon icon={faEye} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
