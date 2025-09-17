import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faClock,
  faDownload,
  faGift,
  faMobileAlt,
  faStar,
} from '@fortawesome/free-solid-svg-icons'
import { faApple, faGooglePlay } from '@fortawesome/free-brands-svg-icons'
import { useTranslation } from 'react-i18next'

export default function AppDownload() {
  const { t } = useTranslation()

  const appFeatures = [
    {
      icon: faMobileAlt,
      titleKey: 'appDownload.features.crossPlatform.title',
      descriptionKey: 'appDownload.features.crossPlatform.description',
    },
    {
      icon: faStar,
      titleKey: 'appDownload.features.rating.title',
      descriptionKey: 'appDownload.features.rating.description',
    },
    {
      icon: faDownload,
      titleKey: 'appDownload.features.free.title',
      descriptionKey: 'appDownload.features.free.description',
    },
  ]

  return (
    <section
      id="download"
      className="py-20 bg-gradient-to-b from-primary to-success dark:from-primary-dark text-white"
    >
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h3 className="text-5xl font-bold mb-6">{t('appDownload.title')}</h3>
          <p className="text-xl text-gray-200 max-w-3xl mx-auto">
            {t('appDownload.subtitle')}
          </p>
        </div>
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-6">
              {appFeatures.map((feature, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="bg-white/20 p-3 rounded-full">
                    <FontAwesomeIcon icon={feature.icon} className="text-2xl" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold">{t(feature.titleKey)}</h4>
                    <p className="text-gray-200">{t(feature.descriptionKey)}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-white text-primary dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 px-8 py-4 rounded-2xl text-lg font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center">
                <FontAwesomeIcon icon={faApple} className="ml-3 text-2xl" />
                <div className="text-right">
                  <div className="text-sm">{t('appDownload.downloadFrom')}</div>
                  <div className="font-bold">App Store</div>
                </div>
              </button>
              <button className="bg-white text-primary dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 px-8 py-4 rounded-2xl text-lg font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center">
                <FontAwesomeIcon
                  icon={faGooglePlay}
                  className="ml-3 text-2xl"
                />
                <div className="text-right">
                  <div className="text-sm">{t('appDownload.downloadFrom')}</div>
                  <div className="font-bold">Google Play</div>
                </div>
              </button>
            </div>
            <div className="bg-white/0 p-6 rounded-2xl backdrop-blur-sm">
              <h5 className="text-lg font-bold mb-3">
                {t('appDownload.specialOffer.title')}
              </h5>
              <p className="text-gray-200 mb-4">
                {t('appDownload.specialOffer.description')}
              </p>
              <div className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faClock} className="text-accent" />
                <span className="text-sm">
                  {t('appDownload.specialOffer.limitedTime')}
                </span>
              </div>
            </div>
          </div>

          <div className="relative">
            <img
              className="w-full max-w-md mx-auto"
              src="./downloadNow.png"
              alt={t('appDownload.appPreviewAlt')}
            />
            <div className="absolute top-10 right-35 bg-accent text-dark p-4 rounded-full animate-bounce">
              <FontAwesomeIcon icon={faGift} className="text-2xl" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
