import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useTranslation } from 'react-i18next'

export default function FeaturesSection() {
  const { t } = useTranslation()

  const mainFeatures = [
    {
      icon: 'search',
      titleKey: 'features.main.discover.title',
      descriptionKey: 'features.main.discover.description',
      bgColor: 'bg-primary',
    },
    {
      icon: 'users',
      titleKey: 'features.main.joinGroups.title',
      descriptionKey: 'features.main.joinGroups.description',
      bgColor: 'bg-success',
    },
    {
      icon: 'trophy',
      titleKey: 'features.main.earnRewards.title',
      descriptionKey: 'features.main.earnRewards.description',
      bgColor: 'bg-accent',
    },
  ]

  const additionalFeatures = [
    {
      icon: 'map-marker-alt',
      titleKey: 'features.additional.nearbyLocations.title',
      descriptionKey: 'features.additional.nearbyLocations.description',
      bgColor: 'bg-primary',
    },
    {
      icon: 'calendar-alt',
      titleKey: 'features.additional.smartScheduling.title',
      descriptionKey: 'features.additional.smartScheduling.description',
      bgColor: 'bg-success',
    },
    {
      icon: 'chart-line',
      titleKey: 'features.additional.trackProgress.title',
      descriptionKey: 'features.additional.trackProgress.description',
      bgColor: 'bg-secondary',
    },
  ]

  return (
    <section
      id="features"
      className="py-20 bg-gradient-to-b from-light to-white dark:from-gray-800 dark:to-gray-900"
    >
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h3 className="text-5xl font-bold text-secondary dark:!text-white mb-6">
            {t('features.title')}
          </h3>
          <p className="text-xl text-gray-600 dark:!text-gray-300 max-w-3xl mx-auto">
            {t('features.subtitle')}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <div className="space-y-8">
            {mainFeatures.map((feature, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div
                  className={`${feature.bgColor}  w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0`}
                >
                  <FontAwesomeIcon
                    icon={['fas', feature.icon as any]}
                    className="text-white"
                  />
                </div>
                <div>
                  <h4 className="text-2xl font-bold text-secondary dark:!text-white mb-2">
                    {t(feature.titleKey)}
                  </h4>
                  <p className="text-gray-600 dark:!text-gray-300">{t(feature.descriptionKey)}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="relative">
            <img
              className="w-full rounded-3xl shadow-2xl bg-white dark:bg-gray-800 p-4"
              src="./FeaturesSection.png"
              alt="mobile app interface showing sports activities discovery screen with Egyptian users, modern UI design"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {additionalFeatures.map((feature, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
            >
              <div
                className={`${feature.bgColor} w-16 h-16 rounded-2xl flex items-center justify-center mb-6`}
              >
                <FontAwesomeIcon
                  icon={['fas', feature.icon as any]}
                  className="text-white text-xl"
                />
              </div>
              <h4 className="text-xl font-bold text-secondary dark:!text-white mb-4">
                {t(feature.titleKey)}
              </h4>
              <p className="text-gray-600 dark:!text-gray-300">{t(feature.descriptionKey)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
