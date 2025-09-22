import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faFacebook,
  faInstagram,
  faLinkedin,
  faTwitter,
} from '@fortawesome/free-brands-svg-icons'
import { faMoon, faRunning, faSun } from '@fortawesome/free-solid-svg-icons'
import { useTranslation } from 'react-i18next'
import { useAppContext } from '../contexts/AppProvider'

export default function Footer() {
  const { t } = useTranslation()
  const { language, toggleTheme, setLanguage, theme } = useAppContext()

  const footerSections = {
    sports: {
      titleKey: 'footer.sports.title',
      linkKeys: [
        'footer.sports.football',
        'footer.sports.running',
        'footer.sports.swimming',
        'footer.sports.basketball',
        'footer.sports.tennis',
        'footer.sports.gym',
      ],
    },
    company: {
      titleKey: 'footer.company.title',
      linkKeys: [
        'footer.company.about',
        'footer.company.jobs',
        'footer.company.partnerships',
        'footer.company.press',
        'footer.company.blog',
        'footer.company.contact',
      ],
    },
    support: {
      titleKey: 'footer.support.title',
      linkKeys: [
        'footer.support.helpCenter',
        'footer.support.communityGuidelines',
        'footer.support.privacyPolicy',
        'footer.support.termsOfService',
        'footer.support.reportIssue',
        'footer.support.dataSecurity',
      ],
    },
  }

  return (
    <footer
      id="footer"
      className="bg-secondary dark:!from-gray-900 dark:!to-secondary dark:!bg-gradient-to-b text-white py-16"
    >
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="bg-primary rounded-xl p-2">
                <FontAwesomeIcon
                  icon={faRunning}
                  className="text-white text-2xl"
                />
              </div>
              <h3 className="text-3xl font-bold">{t('common.appName')}</h3>
            </div>
            <p className="text-gray-300 leading-relaxed">
              {t('footer.description')}
            </p>
            <div className="flex space-x-4">
              <span className="bg-white/10  p-3  rounded-full hover:bg-opacity-20 transition-colors cursor-pointer">
                <FontAwesomeIcon icon={faFacebook} className="text-xl" />
              </span>
              <span className="bg-white/10 p-3 rounded-full hover:bg-opacity-20 transition-colors cursor-pointer">
                <FontAwesomeIcon icon={faInstagram} className="text-xl" />
              </span>
              <span className="bg-white/10 p-3 rounded-full hover:bg-opacity-20 transition-colors cursor-pointer">
                <FontAwesomeIcon icon={faTwitter} className="text-xl" />
              </span>
              <span className="bg-white/10 p-3 rounded-full hover:bg-opacity-20 transition-colors cursor-pointer">
                <FontAwesomeIcon icon={faLinkedin} className="text-xl" />
              </span>
            </div>
          </div>

          <div>
            <h4 className="text-xl font-bold mb-6">
              {t(footerSections.sports.titleKey)}
            </h4>
            <ul className="space-y-3">
              {footerSections.sports.linkKeys.map((linkKey, index) => (
                <li key={index}>
                  <span className="text-gray-300 hover:text-white transition-colors cursor-pointer">
                    {t(linkKey)}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xl font-bold mb-6">
              {t(footerSections.company.titleKey)}
            </h4>
            <ul className="space-y-3">
              {footerSections.company.linkKeys.map((linkKey, index) => (
                <li key={index}>
                  <span className="text-gray-300 hover:text-white transition-colors cursor-pointer">
                    {t(linkKey)}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xl font-bold mb-6">
              {t(footerSections.support.titleKey)}
            </h4>
            <ul className="space-y-3">
              {footerSections.support.linkKeys.map((linkKey, index) => (
                <li key={index}>
                  <span className="text-gray-300 hover:text-white transition-colors cursor-pointer">
                    {t(linkKey)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-600 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-300 text-center md:text-right mb-4 md:mb-0">
              {t('footer.copyright')}
            </p>
            <div className="flex space-x-4">
              <select
                className="bg-white/10 text-white px-4  py-2 rounded-lg border border-gray-600 focus:outline-none"
                value={language}
                name="language"
                onChange={() => {
                  setLanguage(language === 'ar' ? 'en' : 'ar')
                }}
              >
                <option value="ar" className="bg-gray-800 text-white">
                  العربية
                </option>
                <option value="en" className="bg-gray-800 text-white">
                  English
                </option>
              </select>
              <button
                className="bg-white/10 text-white px-4 py-2 rounded-lg border border-gray-600 hover:bg-opacity-20 transition-colors"
                onClick={toggleTheme}
              >
                <FontAwesomeIcon icon={theme === 'dark' ? faSun : faMoon} className="mx-2 " />
                {theme.toLocaleUpperCase()}
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
