import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useTranslation } from 'react-i18next'

interface Achievement {
  title: string
  points: number
  icon: string
  color: string
}

interface RecentAchievementsProps {
  achievements?: Array<Achievement>
}

export default function RecentAchievements({
  achievements,
}: RecentAchievementsProps) {
  const { t } = useTranslation()

  const defaultAchievements: Array<Achievement> = [
    {
      title: t('dashboard.achievements.firstChallengeComplete'),
      points: 100,
      icon: 'trophy',
      color: 'text-yellow-500',
    },
    {
      title: t('dashboard.achievements.activeMember'),
      points: 50,
      icon: 'star',
      color: 'text-blue-500',
    },
    {
      title: t('dashboard.achievements.communityBuilder'),
      points: 75,
      icon: 'users',
      color: 'text-green-500',
    },
  ]

  const displayAchievements = achievements || defaultAchievements

  return (
    <div className="bg-white dark:bg-dark-bg border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-lg">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <FontAwesomeIcon icon={['fas', 'trophy']} className="text-accent" />
        {t('dashboard.achievements.title')}
      </h3>

      <div className="space-y-3">
        {displayAchievements.map((achievement, index) => (
          <div
            key={index}
            className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
          >
            <div className="w-10 h-10 bg-white dark:bg-gray-700 rounded-full flex items-center justify-center">
              <FontAwesomeIcon
                icon={['fas', achievement.icon as any]}
                className={achievement.color}
              />
            </div>
            <div className="flex-1">
              <div className="font-semibold text-sm">{achievement.title}</div>
              <div className="text-xs opacity-70">
                +{achievement.points} {t('dashboard.points')}
              </div>
            </div>
            <FontAwesomeIcon
              icon={['fas', 'check-circle']}
              className="text-success"
            />
          </div>
        ))}
      </div>
    </div>
  )
}
