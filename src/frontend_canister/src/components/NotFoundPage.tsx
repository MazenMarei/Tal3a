import { Link } from '@tanstack/react-router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faArrowLeft,
  faExclamationTriangle,
  faHome,
  faSearch,
} from '@fortawesome/free-solid-svg-icons'
import { useTranslation } from 'react-i18next'
import { useAppContext } from '../contexts/AppProvider'

export default function NotFoundPage() {
  const { t } = useTranslation()
  const { language } = useAppContext()

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-primary to-secondary text-white flex items-center justify-center px-6"
      dir={language === 'ar' ? 'rtl' : 'ltr'}
    >
      <div className="text-center max-w-2xl mx-auto">
        {/* 404 Animation */}
        <div className="relative mb-12">
          <div className="text-[12rem] md:text-[16rem] font-bold opacity-20 leading-none">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-full p-8 animate-pulse">
              <FontAwesomeIcon
                icon={faExclamationTriangle}
                className="text-accent text-6xl"
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6 mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            {t('notFound.title')}
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8">
            {t('notFound.subtitle')}
          </p>
          <p className="text-lg text-gray-400 max-w-lg mx-auto">
            {t('notFound.description')}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Link
            to="/"
            className="bg-accent hover:bg-yellow-400 text-dark px-8 py-4 rounded-full font-semibold transition-colors flex items-center gap-3 min-w-[200px] justify-center"
          >
            <FontAwesomeIcon icon={faHome} />
            {t('notFound.backHome')}
          </Link>

          <button
            onClick={() => window.history.back()}
            className="border-2 border-white hover:bg-white hover:text-primary text-white px-8 py-4 rounded-full font-semibold transition-colors flex items-center gap-3 min-w-[200px] justify-center"
          >
            <FontAwesomeIcon
              icon={faArrowLeft}
              className={language === 'ar' ? 'rotate-180' : ''}
            />
            {t('notFound.goBack')}
          </button>
        </div>

        {/* Search Suggestion */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <FontAwesomeIcon icon={faSearch} className="text-accent text-xl" />
            <h3 className="text-xl font-semibold">
              {t('notFound.searchHelp.title')}
            </h3>
          </div>
          <p className="text-gray-300 mb-4">
            {t('notFound.searchHelp.description')}
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Link
              to="/"
              hash="features"
              className="bg-white/10 hover:bg-white/20 rounded-lg p-3 text-center transition-colors"
            >
              {t('notFound.quickLinks.features')}
            </Link>
            <Link
              to="/"
              hash="community"
              className="bg-white/10 hover:bg-white/20 rounded-lg p-3 text-center transition-colors"
            >
              {t('notFound.quickLinks.community')}
            </Link>
            <Link
              to="/"
              hash="sports"
              className="bg-white/10 hover:bg-white/20 rounded-lg p-3 text-center transition-colors"
            >
              {t('notFound.quickLinks.sports')}
            </Link>
            <Link
              to="/"
              hash="download"
              className="bg-white/10 hover:bg-white/20 rounded-lg p-3 text-center transition-colors"
            >
              {t('notFound.quickLinks.download')}
            </Link>
          </div>
        </div>

        {/* Fun Sports Animation */}
        <div className="flex justify-center items-center gap-8 opacity-60">
          <div className="animate-bounce delay-100">⚽</div>
          <div className="animate-bounce delay-200">🏀</div>
          <div className="animate-bounce delay-300">🏐</div>
          <div className="animate-bounce delay-400">🎾</div>
          <div className="animate-bounce delay-500">🏓</div>
        </div>

        {/* Background Decorative Elements */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-accent/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-success/10 rounded-full blur-xl"></div>
        <div className="absolute top-1/3 right-1/4 w-24 h-24 bg-white/5 rounded-full blur-lg"></div>
      </div>
    </div>
  )
}
