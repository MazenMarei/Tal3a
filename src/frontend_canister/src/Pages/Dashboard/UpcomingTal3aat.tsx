import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useTranslation } from 'react-i18next'

interface UpcomingTal3a {
  title: string
  time: string
  location: string
}

interface UpcomingTal3aatProps {
  tal3aat?: Array<UpcomingTal3a>
  onViewAll?: () => void
}

export default function UpcomingTal3aat({
  tal3aat,
  onViewAll,
}: UpcomingTal3aatProps) {
  const { t } = useTranslation()

  const defaultTal3aat: Array<UpcomingTal3a> = [
    {
      title: t('dashboard.upcomingTal3aat.footballMatch'),
      time: t('dashboard.upcomingTal3aat.todayAt6pm'),
      location: t('dashboard.upcomingTal3aat.ahlyClub'),
    },
    {
      title: t('dashboard.upcomingTal3aat.morningRun'),
      time: t('dashboard.upcomingTal3aat.tomorrowAt7am'),
      location: t('dashboard.upcomingTal3aat.nileCornice'),
    },
    {
      title: t('dashboard.upcomingTal3aat.tableTennis'),
      time: t('dashboard.upcomingTal3aat.fridayAt8pm'),
      location: t('dashboard.upcomingTal3aat.jaziraClub'),
    },
  ]

  const displayTal3aat = tal3aat || defaultTal3aat

  const handleViewAll = () => {
    if (onViewAll) {
      onViewAll()
    } else {
      // Default behavior - could navigate to events page
      console.log('Navigate to all events')
    }
  }

  return (
    <div className="bg-white dark:bg-dark-bg border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-lg">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <FontAwesomeIcon icon={['fas', 'bell']} className="text-accent" />
        {t('dashboard.upcomingTal3aat.title')}
      </h3>

      <div className="space-y-3">
        {displayTal3aat.map((tal3a, index) => (
          <div
            key={index}
            className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
          >
            <div className="font-semibold text-sm mb-1">{tal3a.title}</div>
            <div className="text-xs opacity-70 mb-1">{tal3a.time}</div>
            <div className="text-xs opacity-70">{tal3a.location}</div>
          </div>
        ))}
      </div>

      <button
        onClick={handleViewAll}
        className="w-full mt-4 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors"
      >
        {t('dashboard.viewAllTal3aat')}
      </button>
    </div>
  )
}
