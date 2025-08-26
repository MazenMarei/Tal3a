import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Camera, Check } from 'lucide-react'

const Step3PersonalInfo = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    bio: '',
    profilePicture: null
  })
  const [usernameAvailable, setUsernameAvailable] = useState(false)

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    if (field === 'username' && value.length > 3) {
      setUsernameAvailable(true)
    }
  }

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        setFormData(prev => ({ ...prev, profilePicture: reader.result }))
      }
      reader.readAsDataURL(file)
    }
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
            <span className="text-sm font-medium">Step 3 of 4</span>
          </div>
          <div className="flex justify-center space-x-2">
            <div className="w-3 h-3 bg-white/30 rounded-full"></div>
            <div className="w-3 h-3 bg-white/30 rounded-full"></div>
            <div className="w-3 h-3 bg-white rounded-full"></div>
            <div className="w-3 h-3 bg-white/30 rounded-full"></div>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-2xl p-8 shadow-lg">
        <h2 className="text-2xl md:text-3xl font-bold text-emerald-500 mb-8 text-center">
          Add Your Personal Information
        </h2>
        <div className="max-w-md mx-auto space-y-6">
          <div>
            <div className="flex items-center justify-center">
              <div className="relative">
                <Avatar className="w-24 h-24 border-4 border-gray-200">
                  <AvatarImage src={formData.profilePicture || "/placeholder-avatar.jpg"} />
                  <AvatarFallback className="bg-gray-100">
                    <Camera className="w-8 h-8 text-gray-400" />
                  </AvatarFallback>
                </Avatar>
                <label htmlFor="profile-picture-upload" className="absolute -bottom-2 -right-2 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white hover:bg-emerald-600 transition-colors cursor-pointer">
                  <Camera className="w-4 h-4" />
                </label>
                <input
                  id="profile-picture-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleProfilePictureChange}
                />
              </div>
            </div>
            <p className="text-center text-sm text-emerald-600 mt-2">Add photo</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              placeholder="Enter full name..."
              value={formData.fullName}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
              className="w-full py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bio <span className="text-red-500">*</span>
            </label>
            <Textarea
              placeholder="Enter Your Bio"
              value={formData.bio}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              className="w-full py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-emerald-500 min-h-[120px] resize-none"
            />
          </div>
        </div>
        <div className="flex justify-between mt-12">
          <Link to="/login-flow/sports">
            <Button 
              variant="outline" 
              className="px-8 py-3 cursor-pointer text-lg font-medium border-2 border-gray-300 text-gray-600 hover:bg-gray-50 rounded-xl"
            >
              Back
            </Button>
          </Link>
          <Link to="/login-flow/social-password">
            <Button className="px-8 py-3 cursor-pointer text-lg font-medium bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl">
              Continue
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Step3PersonalInfo;