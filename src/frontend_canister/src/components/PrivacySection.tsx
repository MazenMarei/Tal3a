import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCheckCircle,
  faEye,
  faShieldAlt,
  faUserShield,
} from '@fortawesome/free-solid-svg-icons'
import { useTranslation } from 'react-i18next'
import { useAppContext } from '../contexts/AppProvider'

export default function PrivacySection() {
  const { t } = useTranslation()
  const { language } = useAppContext()

  const privacyFeatures = [
    {
      icon: faUserShield,
      titleKey: 'privacy.secureLogin.title',
      descriptionKey: 'privacy.secureLogin.description',
      color: 'bg-emerald-500',
    },
    {
      icon: faShieldAlt,
      titleKey: 'privacy.identityVerification.title',
      descriptionKey: 'privacy.identityVerification.description',
      color: 'bg-yellow-500',
    },
    {
      icon: faEye,
      titleKey: 'privacy.dataPrivacy.title',
      descriptionKey: 'privacy.dataPrivacy.description',
      color: 'bg-blue-600',
    },
  ]

  return (
    <section className="py-50 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div className={`${language === 'ar' ? 'text-right' : 'text-left'}`}>
            <h2 className="text-4xl md:text-5xl font-bold text-secondary dark:!text-white mb-6">
              {t('privacy.title')}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
              {t('privacy.subtitle')}
            </p>

            <div className="space-y-6">
              {privacyFeatures.map((feature, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div
                    className={`${feature.color} w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0`}
                  >
                    <FontAwesomeIcon
                      icon={feature.icon}
                      className="text-white text-xl"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {t(feature.titleKey)}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {t(feature.descriptionKey)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Security Badge */}
            <div className="mt-8 inline-flex items-center gap-3 bg-emerald-50 dark:bg-emerald-900/20 px-6 py-3 rounded-full border border-emerald-200 dark:border-emerald-800">
              <FontAwesomeIcon
                icon={faCheckCircle}
                className="text-emerald-600 text-xl"
              />
              <span className="text-emerald-800 dark:text-emerald-400 font-semibold">
                {t('privacy.securityBadge')}
              </span>
            </div>
          </div>

          {/* Security Illustration */}
          <div className={`lg:order-1 relative`}>
            <div className="relative bg-gradient-to-br rounded-3xl p-8">
              {/* Central Shield */}
              <div className="relative z-10 flex flex-col items-center justify-center h-96">
                <div className="relative">
                  {/* Main Shield */}
                  <img
                    src="https://storage.googleapis.com/uxpilot-auth.appspot.com/a05e17fced-c5fa699720ad2ffba18b.png"
                    alt="Security Illustration"
                    className="w-full rounded-3xl shadow-2xl"
                  />
                  {/* Security Level Indicator */}
                  <div className="absolute -bottom-6 -right-6 bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-xl">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
                      <span className="text-gray-900 dark:text-white  font-semibold">
                        {t('privacy.securityLevel')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
