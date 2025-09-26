import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCoins,
  faDumbbell,
  faGift,
  faStar,
  faStore,
  faUserTie,
  faWaterLadder,
} from '@fortawesome/free-solid-svg-icons'
import { useTranslation } from 'react-i18next'

export default function RewardsSection() {
  const { t } = useTranslation()

  const earnPointsData = [
    { labelKey: 'rewards.earnPoints.attendEvent', points: '+50' },
    { labelKey: 'rewards.earnPoints.organizeEvent', points: '+100' },
    { labelKey: 'rewards.earnPoints.inviteFriend', points: '+25' },
    { labelKey: 'rewards.earnPoints.monthlyGoal', points: '+200' },
  ]

  const redeemPointsData = [
    { labelKey: 'rewards.redeemPoints.discount20', points: '500' },
    { labelKey: 'rewards.redeemPoints.gymMembership', points: '2000' },
    { labelKey: 'rewards.redeemPoints.sportsEquipment', points: '1500' },
    { labelKey: 'rewards.redeemPoints.personalTraining', points: '3000' },
  ]

  const partnersData = [
    {
      icon: faStore,
      titleKey: 'rewards.partners.stores.title',
      countKey: 'rewards.partners.stores.count',
      bgColor: 'bg-primary',
    },
    {
      icon: faDumbbell,
      titleKey: 'rewards.partners.gyms.title',
      countKey: 'rewards.partners.gyms.count',
      bgColor: 'bg-success',
    },
    {
      icon: faWaterLadder,
      titleKey: 'rewards.partners.clubs.title',
      countKey: 'rewards.partners.clubs.count',
      bgColor: 'bg-secondary',
    },
    {
      icon: faUserTie,
      titleKey: 'rewards.partners.trainers.title',
      countKey: 'rewards.partners.trainers.count',
      bgColor: 'bg-danger',
    },
  ]

  return (
    <section
      id="rewards"
      className="py-20 bg-gradient-to-b  from-accent to-yellow-500  dark:from-gray-800 dark:to-primary-dark text-dark"
    >
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 dark:text-white">
          <h3 className="text-5xl font-bold mb-6">{t('rewards.title')}</h3>
          <p className="text-xl max-w-3xl mx-auto">{t('rewards.subtitle')}</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <div className="space-y-8">
            {/* How to Earn Points */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-xl font-bold text-secondary dark:!text-white">
                  {t('rewards.earnPoints.title')}
                </h4>
                <div className="bg-primary text-white p-2 rounded-full">
                  <FontAwesomeIcon icon={faCoins} className="text-xl" />
                </div>
              </div>
              <div className="space-y-3">
                {earnPointsData.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center"
                  >
                    <span className="text-gray-600 dark:text-gray-400">{t(item.labelKey)}</span>
                    <span className="font-bold text-primary">
                      {item.points} {t('rewards.points')}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Redeem Points */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-xl font-bold text-secondary dark:!text-white">
                  {t('rewards.redeemPoints.title')}
                </h4>
                <div className="bg-success text-white p-2 rounded-full">
                  <FontAwesomeIcon icon={faGift} className="text-xl" />
                </div>
              </div>
              <div className="space-y-3">
                {redeemPointsData.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center "
                  >
                    <span className="text-gray-600 dark:text-gray-400">{t(item.labelKey)}</span>
                    <span className="font-bold text-success">
                      {item.points} {t('rewards.points')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* App Preview with Current Points */}
          <div className="relative">
            <img
              className="w-full rounded-3xl shadow-2xl"
              src="https://storage.googleapis.com/uxpilot-auth.appspot.com/16aaacf82e-a2b41bb72161f5a31c80.png"
              alt={t('rewards.appPreviewAlt')}
            />
            <div className="absolute -bottom-4 -left-4 bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-lg">
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <FontAwesomeIcon
                  icon={faStar}
                  className="text-accent text-xl"
                />
                <div>
                  <div className="font-bold text-secondary dark:!text-white">
                    {t('rewards.currentBalance.title')}
                  </div>
                  <div className="text-2xl font-bold text-primary">
                    {t('rewards.currentBalance.amount')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Partners Grid */}
        <div className="grid md:grid-cols-4 gap-6">
          {partnersData.map((partner, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 p-6 rounded-2xl text-center shadow-lg"
            >
              <div
                className={`w-16 h-16 ${partner.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}
              >
                <FontAwesomeIcon
                  icon={partner.icon}
                  className="text-white text-xl"
                />
              </div>
              <h5 className="font-bold text-secondary dark:!text-white mb-2">
                {t(partner.titleKey)}
              </h5>
              <p className="text-gray-600 dark:text-gray-400 text-sm">{t(partner.countKey)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
