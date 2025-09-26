import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useTranslation } from 'react-i18next'
import Tal3aCardAvatar from './Tal3aCardAvatar'
import { useAppContext } from '@/contexts/AppProvider'

export default function RecommendedTal3aCard({ tal3a }: { tal3a: any }) {
  const { t } = useTranslation()
  const { language } = useAppContext()

  return (
    <div
      key={tal3a.id}
      className={` bg-white dark:bg-dark-bg rounded-2xl shadow-sm overflow-hidden`}
    >
      <div className={`bg-gradient-to-r ${tal3a.gradient} h-32 relative`}>
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div
          className={`absolute top-4 ${language === 'ar' ? 'right-4' : 'left-4'} bg-white text-${tal3a.color}-500 px-3 py-1 rounded-full text-sm font-medium`}
        >
          {tal3a.category}
        </div>
        {tal3a.isWomenOnly && (
          <div
            className={`absolute top-4 ${language === 'ar' ? 'left-4' : 'right-4'} bg-${tal3a.color}-600 text-white px-2 py-1 rounded-full text-xs`}
          >
            {t('dashboard.womenOnly')}
          </div>
        )}
        <div
          className={`absolute bottom-4 ${language === 'ar' ? 'right-4' : 'left-4'} text-white`}
        >
          <h3 className="font-bold text-lg">{tal3a.title}</h3>
          <p className="text-sm opacity-90">{tal3a.location}</p>
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <FontAwesomeIcon
              icon={['fas', 'calendar']}
              className={`${language === 'ar' ? 'ml-2' : 'mr-2'} text-gray-500`}
            />
            <span className="text-sm text-gray-600">{tal3a.date}</span>
          </div>
          <div className="flex items-center">
            <FontAwesomeIcon
              icon={['fas', 'users']}
              className={`${language === 'ar' ? 'ml-2' : 'mr-2'} text-gray-500`}
            />
            <span className="text-sm text-gray-600">
              {tal3a.participants}/{tal3a.maxParticipants}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div
            className={`flex ${language === 'ar' ? 'space-x-reverse space-x-2' : '-space-x-2'}`}
          >
            {tal3a.participantAvatars
              .slice(0, 3)
              .map((avatar: any, index: number) => (
                <Tal3aCardAvatar
                  avatar={avatar}
                  key={index}
                  Zindex={tal3a.participantAvatars.length - index}
                  translateX={index * 5}
                />
              ))}
            {tal3a.participants > 3 && (
              <div
                className={`px-2 w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs text-gray-600 z-${tal3a.participantAvatars.length - 4} transform translate-x-${tal3a.participantAvatars.length * 5}`}
              >
                +{tal3a.participants - 3}
              </div>
            )}
          </div>

          <button
            className={`bg-${tal3a.color}-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-opacity-90 transition-all`}
          >
            {t('dashboard.join')}
          </button>
        </div>
      </div>
    </div>
  )
}
