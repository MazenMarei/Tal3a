import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

const Step2Sports = () => {
  const [selectedSports, setSelectedSports] = useState([])

  const sports = [
    { id: 'football', name: 'Football', color: 'bg-emerald-500', icon: '⚽' },
    { id: 'basketball', name: 'Basketball', color: 'bg-orange-500', icon: '🏀' },
    { id: 'tennis', name: 'Tennis', color: 'bg-green-500', icon: '🎾' },
    { id: 'running', name: 'Running', color: 'bg-gray-600', icon: '🏃' },
    { id: 'swimming', name: 'Swimming', color: 'bg-blue-500', icon: '🏊' },
    { id: 'yoga', name: 'Yoga', color: 'bg-purple-300', icon: '🧘' },
    { id: 'cycling', name: 'Cycling', color: 'bg-blue-400', icon: '🚴' },
    { id: 'volleyball', name: 'Volleyball', color: 'bg-yellow-600', icon: '🏐' },
    { id: 'pingpong', name: 'Ping Pong', color: 'bg-yellow-400', icon: '🏓' },
    { id: 'golf', name: 'Golf', color: 'bg-gray-500', icon: '⛳' }
  ]

  const toggleSport = (sportId) => {
    setSelectedSports(prev => 
      prev.includes(sportId) 
        ? prev.filter(id => id !== sportId)
        : [...prev, sportId]
    )
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="relative bg-gradient-to-br from-green-900 via-green-600 to-green-700  rounded-3xl p-8 md:p-12 mb-8 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-64 h-64 md:w-80 md:h-80 rounded-full border-8 border-white/30 relative">
              <div className="absolute inset-0 rounded-full">
                <div className="absolute top-0 left-1/2 w-px h-full bg-white/30 transform -translate-x-1/2"></div>
                <div className="absolute top-1/2 left-0 w-full h-px bg-white/30 transform -translate-y-1/2"></div>
                <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 border border-white/30 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="relative z-10 text-center text-white">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Welcome to <span className="text-emerald-400">Tal3a</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Let's set up your sports profile up!
          </p>
          <div className="flex justify-center items-center space-x-2 mb-4">
            <span className="text-sm font-medium">Step 2 of 4</span>
          </div>
          <div className="flex justify-center space-x-2">
            <div className="w-3 h-3 bg-white/30 rounded-full"></div>
            <div className="w-3 h-3 bg-white rounded-full"></div>
            <div className="w-3 h-3 bg-white/30 rounded-full"></div>
            <div className="w-3 h-3 bg-white/30 rounded-full"></div>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-2xl p-8 shadow-lg">
        <h2 className="text-2xl md:text-3xl font-bold text-emerald-500 mb-2 text-center">
          What sports are you interested in?
        </h2>
        <p className="text-gray-600 text-center mb-8">Select one or more</p>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
          {sports.map((sport) => (
            <button
              key={sport.id}
              onClick={() => toggleSport(sport.id)}
              className={`
                relative aspect-square rounded-2xl p-4 transition-all duration-200 transform hover:scale-105
                ${selectedSports.includes(sport.id) 
                  ? `${sport.color} text-white shadow-lg` 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }
              `}
            >
              <div className="flex flex-col items-center justify-center h-full">
                <div className="text-3xl mb-2">{sport.icon}</div>
                <span className="text-sm font-medium text-center">{sport.name}</span>
              </div>
              {selectedSports.includes(sport.id) && (
                <div className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                </div>
              )}
            </button>
          ))}
        </div>
        <div className="flex justify-between">
          <Link to="/login-flow/location">
            <Button  
              variant="outline" 
              className="px-8 py-3 cursor-pointer text-lg font-medium border-2 border-gray-300 text-gray-600 hover:bg-gray-50 rounded-xl"
            >
              Back
            </Button>
          </Link>
          <Link to="/login-flow/personal-info">
            <Button className="px-8 py-3 cursor-pointer text-lg font-medium bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl">
              Continue
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Step2Sports;