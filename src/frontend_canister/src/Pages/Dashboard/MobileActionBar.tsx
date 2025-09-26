import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useTranslation } from 'react-i18next'

interface MobileActionBarProps {
  onCreateClick?: () => void
  onSearchClick?: () => void
  onMapClick?: () => void
  onNotificationsClick?: () => void
}

export default function MobileActionBar({
  onCreateClick,
  onSearchClick,
  onMapClick,
  onNotificationsClick,
}: MobileActionBarProps) {
  const { t } = useTranslation()

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-dark-bg border-gray-200 dark:border-gray-700 shadow-lg dark:shadow-gray-900/50 border-t p-4 z-50 backdrop-blur-sm">
      <div className="flex justify-around">
        <button
          onClick={onCreateClick}
          className="flex flex-col items-center gap-1 text-primary hover:text-primary-dark transition-colors"
        >
          <FontAwesomeIcon icon={['fas', 'plus-circle']} className="text-xl" />
          <span className="text-xs font-medium">
            {t('dashboard.mobileBar.create')}
          </span>
        </button>
        <button
          onClick={onSearchClick}
          className="flex flex-col items-center gap-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors"
        >
          <FontAwesomeIcon icon={['fas', 'search']} className="text-xl" />
          <span className="text-xs font-medium">
            {t('dashboard.mobileBar.search')}
          </span>
        </button>
        <button
          onClick={onMapClick}
          className="flex flex-col items-center gap-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors"
        >
          <FontAwesomeIcon
            icon={['fas', 'map-marker-alt']}
            className="text-xl"
          />
          <span className="text-xs font-medium">
            {t('dashboard.mobileBar.map')}
          </span>
        </button>
        <button
          onClick={onNotificationsClick}
          className="flex flex-col items-center gap-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors"
        >
          <FontAwesomeIcon icon={['fas', 'bell']} className="text-xl" />
          <span className="text-xs font-medium">
            {t('dashboard.mobileBar.notifications')}
          </span>
        </button>
      </div>
    </div>
  )
}
