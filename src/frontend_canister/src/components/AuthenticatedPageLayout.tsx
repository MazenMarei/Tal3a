import { useState } from 'react'
import Footer from './Footer'
import Sidebar from './Sidebar'
import { useAppContext } from '@/contexts/AppProvider'

export default function AuthenticatedPageLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { language } = useAppContext()
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <div
      className={
        'flex min-h-screen bg-gray-50 dark:bg-gray-900' +
        (language === 'ar' ? ' rtl ' : ' ltr ')
      }
    >
      <div
        className={
          (isCollapsed ? 'w-16 ' : 'w-64 ') + ' transition-all duration-300'
        }
      >
        <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      </div>
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {children}
        <Footer />
      </div>
    </div>
  )
}
