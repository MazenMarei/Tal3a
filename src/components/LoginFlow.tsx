import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

interface LoginFlowProps {
  onComplete: (userData: UserData) => void
}

interface UserData {
  name: string
  avatar?: string
  bio?: string
  referralCode?: string
  location?: string
  sports?: Array<string>
}

export default function LoginFlow({ onComplete }: LoginFlowProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [userData, setUserData] = useState<UserData>({
    name: '',
    avatar: '',
    bio: '',
    referralCode: '',
    location: '',
    sports: [],
  })
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  // Get referral code from URL params
  const urlParams = new URLSearchParams(window.location.search)
  const referralFromUrl = urlParams.get('ref')

  const validateStep = (step: number): boolean => {
    const newErrors: { [key: string]: string } = {}

    if (step === 2) {
      if (!userData.name.trim()) {
        newErrors.name = t('loginFlow.validation.nameRequired')
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (currentStep === 2 && !validateStep(2)) {
      return
    }

    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    } else {
      handleComplete()
    }
  }

  const handleComplete = async () => {
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const result = submitUserData({
        ...userData,
        referralCode: userData.referralCode || referralFromUrl || undefined,
      })

      if (result) {
        onComplete(userData)
        navigate({ to: '/dashboard' })
      }
    } catch (error) {
      console.error('Failed to complete registration:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const submitUserData = (data: UserData): boolean => {
    console.log('Submitting user data:', data)
    return true
  }

  const handleSportToggle = (sport: string) => {
    const currentSports = userData.sports || []
    const newSports = currentSports.includes(sport)
      ? currentSports.filter((s) => s !== sport)
      : [...currentSports, sport]

    setUserData({ ...userData, sports: newSports })
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="text-center">
            <div className="bg-primary w-16 h-16 rounded-2xl flex items-center justify-center text-white mx-auto mb-6">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold mb-3 text-secondary dark:text-white">
              {t('loginFlow.welcome.title')}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              {t('loginFlow.welcome.subtitle')}
            </p>
            <div className="space-y-4">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-6">
                <h3 className="font-bold text-lg mb-2 text-secondary dark:text-white">
                  {t('loginFlow.welcome.benefitsTitle')}
                </h3>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <li>• {t('loginFlow.welcome.benefit1')}</li>
                  <li>• {t('loginFlow.welcome.benefit2')}</li>
                  <li>• {t('loginFlow.welcome.benefit3')}</li>
                  <li>• {t('loginFlow.welcome.benefit4')}</li>
                </ul>
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="text-center">
            <div className="bg-primary w-16 h-16 rounded-2xl flex items-center justify-center text-white mx-auto mb-6">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h2 className="text-3xl font-bold mb-3 text-secondary dark:text-white">
              {t('loginFlow.profile.title')}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {t('loginFlow.profile.subtitle')}
            </p>

            <div className="space-y-6">
              {/* Name Field */}
              <div>
                <label className="block text-right text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('loginFlow.profile.nameLabel')} *
                </label>
                <input
                  type="text"
                  value={userData.name}
                  onChange={(e) =>
                    setUserData({ ...userData, name: e.target.value })
                  }
                  placeholder={t('loginFlow.profile.namePlaceholder')}
                  className={`w-full p-4 border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white ${errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1 text-right">
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Avatar Upload */}
              <div>
                <label className="block text-right text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('loginFlow.profile.avatarLabel')} *
                </label>
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-24 h-24 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center overflow-hidden">
                    {userData.avatar ? (
                      <img
                        src={userData.avatar}
                        alt="Avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <svg
                        className="w-12 h-12 text-gray-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                  <label className="cursor-pointer bg-gray-50 dark:bg-gray-700 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-4 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                    <div className="text-center">
                      <svg
                        className="mx-auto h-8 w-8 text-gray-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                        {t('loginFlow.profile.avatarUpload')}
                      </p>
                    </div>
                    <input type="file" accept="image/*" className="hidden" />
                  </label>
                </div>
              </div>

              {/* Bio Field (Optional) */}
              <div>
                <label className="block text-right text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('loginFlow.profile.bioLabel')} ({t('common.optional')})
                </label>
                <textarea
                  value={userData.bio}
                  onChange={(e) =>
                    setUserData({ ...userData, bio: e.target.value })
                  }
                  placeholder={t('loginFlow.profile.bioPlaceholder')}
                  className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
                  rows={3}
                  maxLength={300}
                />
                <div className="text-right text-sm text-gray-500 mt-1">
                  {userData.bio?.length || 0}/300
                </div>
              </div>

              {/* Referral Code (Optional) */}
              <div>
                <label className="block text-right text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('loginFlow.profile.referralLabel')} ({t('common.optional')}
                  )
                </label>
                <input
                  type="text"
                  value={userData.referralCode || referralFromUrl || ''}
                  onChange={(e) =>
                    setUserData({ ...userData, referralCode: e.target.value })
                  }
                  placeholder={t('loginFlow.profile.referralPlaceholder')}
                  className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white text-center"
                  maxLength={20}
                />
                {referralFromUrl && (
                  <p className="text-sm text-green-600 mt-2">
                    ✅ {t('loginFlow.profile.referralFound')}
                  </p>
                )}
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="text-center">
            <div className="bg-yellow-500 w-16 h-16 rounded-2xl flex items-center justify-center text-white mx-auto mb-6">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h2 className="text-3xl font-bold mb-3 text-secondary dark:text-white">
              {t('loginFlow.location.title')}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {t('loginFlow.location.subtitle')}
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-right text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('loginFlow.location.cityLabel')}
                </label>
                <select
                  value={userData.location}
                  onChange={(e) =>
                    setUserData({ ...userData, location: e.target.value })
                  }
                  className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value="">{t('loginFlow.location.selectCity')}</option>
                  <option value="cairo">
                    {t('loginFlow.location.cities.cairo')}
                  </option>
                  <option value="alexandria">
                    {t('loginFlow.location.cities.alexandria')}
                  </option>
                  <option value="giza">
                    {t('loginFlow.location.cities.giza')}
                  </option>
                  <option value="luxor">
                    {t('loginFlow.location.cities.luxor')}
                  </option>
                  <option value="aswan">
                    {t('loginFlow.location.cities.aswan')}
                  </option>
                </select>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
                <div className="flex items-center justify-center space-x-2">
                  <svg
                    className="w-5 h-5 text-blue-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="text-sm text-blue-600 dark:text-blue-400">
                    {t('loginFlow.location.gpsNote')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="text-center">
            <div className="bg-blue-500 w-16 h-16 rounded-2xl flex items-center justify-center text-white mx-auto mb-6">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold mb-3 text-secondary dark:text-white">
              {t('loginFlow.sports.title')}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {t('loginFlow.sports.subtitle')}
            </p>

            <div className="grid grid-cols-2 gap-4">
              {[
                { key: 'football', icon: '⚽', color: 'bg-green-500' },
                { key: 'running', icon: '🏃', color: 'bg-blue-500' },
                { key: 'basketball', icon: '🏀', color: 'bg-orange-500' },
                { key: 'swimming', icon: '🏊', color: 'bg-cyan-500' },
                { key: 'cycling', icon: '🚴', color: 'bg-purple-500' },
                { key: 'yoga', icon: '🧘', color: 'bg-pink-500' },
              ].map((sport) => {
                const isSelected = userData.sports?.includes(sport.key) || false
                return (
                  <button
                    key={sport.key}
                    onClick={() => handleSportToggle(sport.key)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      isSelected
                        ? 'border-primary bg-primary/10 dark:bg-primary/20'
                        : 'border-gray-300 dark:border-gray-600 hover:border-primary/50'
                    }`}
                  >
                    <div
                      className={`w-12 h-12 rounded-xl ${sport.color} flex items-center justify-center text-white text-2xl mx-auto mb-2`}
                    >
                      {sport.icon}
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t(`loginFlow.sports.${sport.key}`)}
                    </span>
                    {isSelected && (
                      <div className="mt-2">
                        <svg
                          className="w-5 h-5 text-primary mx-auto"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        )

      default:
        return null
    }
  }

  const totalSteps = 4

  return (
    <section className="bg-gradient-to-b from-primary to-secondary text-white relative overflow-hidden font-cairo flex items-center min-h-[calc(100vh-5.5rem)] justify-center pt-20 lg:pt-0">
      <div className="container relative z-10 px-6 pb-6">
        <div className="max-w-2xl mx-auto">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm opacity-80">
                {t('loginFlow.progress.step')} {currentStep}{' '}
                {t('loginFlow.progress.of')} {totalSteps}
              </span>
              <span className="text-sm opacity-80">
                {Math.round((currentStep / totalSteps) * 100)}%{' '}
                {t('loginFlow.progress.complete')}
              </span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div
                className="bg-white rounded-full h-2 transition-all duration-300"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Step Content */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 lg:p-12">
            {renderStep()}

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center mt-8">
              {currentStep > 1 ? (
                <button
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="px-6 py-3 text-gray-600 dark:text-gray-300 hover:text-primary transition-colors"
                >
                  {t('loginFlow.navigation.previous')}
                </button>
              ) : (
                <div></div>
              )}

              <button
                onClick={handleNext}
                disabled={isLoading}
                className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-secondary transition-all disabled:opacity-50"
              >
                {isLoading
                  ? t('loginFlow.navigation.saving')
                  : currentStep === totalSteps
                    ? t('loginFlow.navigation.start')
                    : t('loginFlow.navigation.next')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
