import React, { createContext, useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

type Theme = 'light' | 'dark'
type Language = 'ar' | 'en'

interface AppContextType {
  theme: Theme
  language: Language
  toggleTheme: () => void
  setLanguage: (lang: Language) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export const useAppContext = () => {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider')
  }
  return context
}

interface AppProviderProps {
  children: React.ReactNode
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const { i18n } = useTranslation()
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('tal3a-theme')
    return saved === 'dark' ? 'dark' : 'light'
  })
  const [language, setLanguageState] = useState<Language>(() => {
    return i18n.language === 'en' ? 'en' : 'ar'
  })

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    localStorage.setItem('tal3a-theme', newTheme)
  }

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    i18n.changeLanguage(lang)
  }

  useEffect(() => {
    // Update HTML attributes for theme and RTL/LTR
    const html = document.documentElement
    html.setAttribute('data-theme', theme)
    html.setAttribute('dir', language === 'ar' ? 'rtl' : 'ltr')
    html.setAttribute('lang', language)
  }, [theme, language])

  return (
    <AppContext.Provider value={{ theme, language, toggleTheme, setLanguage }}>
      {children}
    </AppContext.Provider>
  )
}

export default AppProvider
