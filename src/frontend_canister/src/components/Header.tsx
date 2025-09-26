import { Link } from '@tanstack/react-router'
import { Languages, Moon, Sun } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useAppContext } from '../contexts/AppProvider'

export default function Header() {
  const { t } = useTranslation()
  const { theme, language, toggleTheme, setLanguage } = useAppContext()

  const navigationItems = [
    {
      href: '/#hero',
      labelKey: 'header.nav.home',
    },
    {
      href: '/#features',
      labelKey: 'header.nav.features',
    },
    {
      href: '/#community',
      labelKey: 'header.nav.community',
    },
    {
      href: '/#sports',
      labelKey: 'header.nav.sports',
    },
    {
      href: '/#download',
      labelKey: 'header.nav.download',
    },
  ]

  return (
    <header
      id="header"
      className="bg-white shadow-lg sticky top-0 z-50 dark:bg-gray-900"
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-4">
            <div className=" rounded-xl p-2">
              <img
                src="./logo.png"
                alt="App Logo"
                className="object-fill w-35"
              />
            </div>
          </Link>

          {/* Navigation Links - Hidden on mobile */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item, index) => (
              <a
                key={index}
                href={item.href}
                className="text-secondary dark:!text-white hover:text-primary transition-colors font-bold cursor-pointer"
              >
                {t(item.labelKey)}
              </a>
            ))}
          </nav>

          {/* Right side controls */}
          <div className="flex items-center space-x-4">
            {/* Language Toggle */}
            <button
              onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
              className="flex items-center space-x-1 p-2 rounded-md hover:bg-gray-100 transition-colors"
              aria-label="Toggle language"
            >
              <Languages className="h-4 w-4" />
              <span className="text-sm font-medium">
                {language === 'ar' ? 'EN' : 'ع'}
              </span>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md hover:bg-gray-100 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </button>

            <Link
              to="/dashboard"
              className="bg-primary dark:!bg-secondary text-white text-sm text-nowrap md:text-xl px-4 py-2 md:px-6 md:py-3 rounded-full font-semibold hover:bg-success transition-colors cursor-pointer"
            >
              {t('header.getStarted')}
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
