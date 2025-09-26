import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBasketballBall,
  faBicycle,
  faDumbbell,
  faFutbol,
  faHeart,
  faPlus,
  faRunning,
  faSwimmer,
  faTableTennis,
  faVolleyballBall,
} from '@fortawesome/free-solid-svg-icons'
import { useTranslation } from 'react-i18next'

export default function SportsCategories() {
  const { t } = useTranslation()

  const sportsData = [
    {
      icon: faFutbol,
      nameKey: 'sports.football',
      countKey: 'sports.footballCount',
      gradient: 'from-primary to-success',
    },
    {
      icon: faRunning,
      nameKey: 'sports.running',
      countKey: 'sports.runningCount',
      gradient: 'from-accent to-yellow-500',
    },
    {
      icon: faSwimmer,
      nameKey: 'sports.swimming',
      countKey: 'sports.swimmingCount',
      gradient: 'from-secondary to-blue-600',
    },
    {
      icon: faTableTennis,
      nameKey: 'sports.tableTennis',
      countKey: 'sports.tableTennisCount',
      gradient: 'from-danger to-red-600',
    },
    {
      icon: faDumbbell,
      nameKey: 'sports.gym',
      countKey: 'sports.gymCount',
      gradient: 'from-purple-500 to-purple-700',
    },
    {
      icon: faBicycle,
      nameKey: 'sports.cycling',
      countKey: 'sports.cyclingCount',
      gradient: 'from-green-500 to-green-700',
    },
    {
      icon: faBasketballBall,
      nameKey: 'sports.basketball',
      countKey: 'sports.basketballCount',
      gradient: 'from-orange-500 to-orange-700',
    },
    {
      icon: faHeart,
      nameKey: 'sports.yoga',
      countKey: 'sports.yogaCount',
      gradient: 'from-pink-500 to-pink-700',
    },
    {
      icon: faVolleyballBall,
      nameKey: 'sports.volleyball',
      countKey: 'sports.volleyballCount',
      gradient: 'from-indigo-500 to-indigo-700',
    },
    {
      icon: faPlus,
      nameKey: 'sports.more',
      countKey: 'sports.moreCount',
      gradient: 'from-teal-500 to-teal-700',
    },
  ]

  return (
    <section id="sports" className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h3 className="text-5xl font-bold text-secondary dark:!text-white mb-6">
            {t('sports.title')}
          </h3>
          <p className="text-xl text-gray-600 dark:!text-gray-300 max-w-3xl mx-auto">
            {t('sports.subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-5 gap-6">
          {sportsData.map((sport, index) => (
            <div
              key={index}
              className={`text-center p-6 rounded-2xl bg-gradient-to-br ${sport.gradient} text-white hover:shadow-lg transition-all hover:-translate-y-2 cursor-pointer`}
            >
              <FontAwesomeIcon icon={sport.icon} className="text-4xl mb-4" />
              <h4 className="font-bold text-lg">
                {t(sport.nameKey)}
              </h4>
              <p className="text-sm text-gray-200 mt-2">
                {t(sport.countKey)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}