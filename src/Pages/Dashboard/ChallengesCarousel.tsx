import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import { useAppContext } from '@/contexts/AppProvider'

export default function ChallengesCarousel({
  mockChallenges,
}: {
  mockChallenges: Array<any>
}) {
  const { language, theme } = useAppContext()
  const { t } = useTranslation()

  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0)

  // Auto-rotate challenges carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentChallengeIndex((prev) => (prev + 1) % mockChallenges.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [currentChallengeIndex, mockChallenges.length])

  return (
    <section
      className={`${theme === 'dark' ? 'bg-dark-bg border border-gray-700' : 'bg-white border border-gray-200'} rounded-2xl p-6 shadow-lg`}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-3">
          <FontAwesomeIcon icon={['fas', 'trophy']} className="text-accent" />
          {t('dashboard.availableChallenges')}
        </h2>
        <div className="flex gap-2">
          {mockChallenges.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentChallengeIndex(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentChallengeIndex ? 'bg-primary' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="relative overflow-hidden rounded-xl">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(${(language === 'ar' ? currentChallengeIndex : -currentChallengeIndex) * 100}%)`,
          }}
        >
          {mockChallenges.map((challenge) => (
            <div key={challenge.id} className="min-w-full">
              <div className="relative">
                <img
                  src={challenge.image}
                  alt={challenge.title}
                  className="w-full h-48 object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent rounded-lg"></div>
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h3 className="text-xl font-bold mb-2">{challenge.title}</h3>
                  <p className="text-sm opacity-90 mb-3">
                    {challenge.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="bg-accent text-dark px-3 py-1 rounded-full text-sm font-semibold">
                        {challenge.reward} {t('dashboard.pts')}
                      </span>
                      <span className="text-xs opacity-80">
                        {challenge.participants} {t('dashboard.participants')}
                      </span>
                    </div>
                    <button className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg font-semibold transition-colors">
                      {t('dashboard.participate')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {mockChallenges.length === 0 && (
            <div className="min-w-full flex flex-col items-center justify-center h-48 py-8">
              <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4">
                <FontAwesomeIcon
                  icon={['fas', 'trophy']}
                  className="text-2xl text-gray-400 dark:text-gray-500"
                />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-300">
                {t('dashboard.noChallengesTitle')}
              </h3>
              <p className="text-sm text-center mb-4 text-gray-500 dark:text-gray-400 max-w-xs">
                {t('dashboard.noChallengesDescription')}
              </p>
              <button className="bg-primary hover:bg-primary-dark text-white dark:text-white px-6 py-2 rounded-lg font-medium transition-colors text-sm">
                {t('dashboard.exploreActivities')}
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
