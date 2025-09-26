import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useTranslation } from 'react-i18next'

interface SuggestedGroup {
  name: string
  members: number
  sport: string
}

interface SuggestedGroupsProps {
  groups?: Array<SuggestedGroup>
}

export default function SuggestedGroups({ groups }: SuggestedGroupsProps) {
  const { t } = useTranslation()

  const defaultGroups: Array<SuggestedGroup> = [
    {
      name: t('dashboard.suggestedGroups.footballCairoGroup'),
      members: 124,
      sport: 'football',
    },
    {
      name: t('dashboard.suggestedGroups.runningZamalekGroup'),
      members: 89,
      sport: 'running',
    },
    {
      name: t('dashboard.suggestedGroups.tennisMaadiGroup'),
      members: 45,
      sport: 'tennis',
    },
  ]

  const displayGroups = groups || defaultGroups

  const getSportIcon = (sport: string) => {
    switch (sport) {
      case 'running':
        return ['fas', 'running']
      case 'football':
        return ['fas', 'futbol']
      case 'swimming':
        return ['fas', 'swimmer']
      case 'basketball':
        return ['fas', 'basketball-ball']
      case 'tennis':
        return ['fas', 'table-tennis']
      default:
        return ['fas', 'dumbbell']
    }
  }

  return (
    <div className="bg-white dark:bg-dark-bg border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-lg">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <FontAwesomeIcon icon={['fas', 'users']} className="text-primary" />
        {t('dashboard.suggestedGroups.title')}
      </h3>

      <div className="space-y-3">
        {displayGroups.map((group, index) => (
          <div
            key={index}
            className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FontAwesomeIcon
                  icon={getSportIcon(group.sport) as any}
                  className="text-primary"
                />
                <div>
                  <div className="font-semibold text-sm">{group.name}</div>
                  <div className="text-xs opacity-70">
                    {group.members} {t('dashboard.members')}
                  </div>
                </div>
              </div>
              <button className="text-primary hover:text-primary-dark text-sm font-semibold">
                {t('dashboard.join')}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
