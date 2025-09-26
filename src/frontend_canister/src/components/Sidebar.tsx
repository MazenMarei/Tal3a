import { useState } from 'react'
import { Link, useRouter } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBell,
  faCalendar,
  faChevronDown,
  faChevronLeft,
  faChevronRight,
  faCoins,
  faEdit,
  faGift,
  faHome,
  faMap,
  faSearch,
  faUser,
  faUsers,
} from '@fortawesome/free-solid-svg-icons'
import { cn } from '@/lib/utils'
import { useAppContext } from '@/contexts/AppProvider'

const menuItems = [
  {
    id: 'dashboard',
    label: 'sidebar.dashboard',
    href: '/dashboard',
    icon: faHome,
    color: 'text-blue-600',
  },
  {
    id: 'groups',
    label: 'sidebar.groups',
    href: '',
    icon: faUsers,
    color: 'text-green-600',
    childs: [
      {
        id: 'my-groups',
        label: 'sidebar.myGroups',
        href: '/my-groups',
        icon: faUsers,
        color: 'text-green-600',
      },
      {
        id: 'search-groups',
        label: 'sidebar.searchGroups',
        href: '/search-groups',
        icon: faSearch,
        color: 'text-blue-600',
      },
    ],
  },
  {
    id: 'events',
    label: 'sidebar.events',
    href: '/events',
    icon: faCalendar,
    color: 'text-purple-600',
  },
  {
    id: 'map',
    label: 'sidebar.map',
    href: '/map',
    icon: faMap,
    color: 'text-red-600',
  },
  {
    id: 'promotions',
    label: 'sidebar.promotions',
    href: '/promotions',
    icon: faGift,
    color: 'text-pink-600',
  },
]

const groupsItems = [
  {
    id: 'my-groups',
    label: 'sidebar.myGroups',
    href: '/my-groups',
    icon: faUsers,
    color: 'text-green-600',
  },
  {
    id: 'search-groups',
    label: 'sidebar.searchGroups',
    href: '/search-groups',
    icon: faSearch,
    color: 'text-blue-600',
  },
]

const secondaryItems = [
  {
    id: 'notifications',
    label: 'sidebar.notifications',
    href: '/profile?tab=notifications',
    icon: faBell,
    color: 'text-yellow-600',
  },
  {
    id: 'profile',
    label: 'sidebar.profile',
    href: '/profile',
    icon: faUser,
    color: 'text-gray-600',
  },
]

const createItems = [
  {
    id: 'create-event',
    label: 'sidebar.createEvent',
    href: '/createEvent',
    icon: faCalendar,
    color: 'text-green-600',
  },
  {
    id: 'create-group',
    label: 'sidebar.createGroup',
    href: '/createGroup',
    icon: faUsers,
    color: 'text-blue-600',
  },
  {
    id: 'create-post',
    label: 'sidebar.createPost',
    href: '/createPost',
    icon: faEdit,
    color: 'text-purple-600',
  },
]

interface SidebarProps {
  className?: string
  isCollapsed: boolean
  setIsCollapsed: (collapsed: boolean) => void
}

export default function Sidebar({
  className,
  isCollapsed,
  setIsCollapsed,
}: SidebarProps) {
  const { t } = useTranslation()
  const router = useRouter()
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isMenueOpen, setIsMenueOpen] = useState<Record<string, boolean>>({})
  const [currentPath, setCurrentPath] = useState(router.state.location.pathname)
  const { language } = useAppContext()
  const isActive = (href: string) => {
    return currentPath === href
  }

  const isGroupsActive = groupsItems.some((item) => isActive(item.href))

  return (
    <aside
      className={`fixed top-0 h-full bg-white dark:bg-gray-900 border-x border-gray-200 dark:border-gray-700 shadow-lg transition-all duration-300 z-40 ${
        isCollapsed ? 'w-16' : 'w-64'
      } ${className || ''}
      ${language === 'ar' ? ' right-0 ' : ' left-0  '}
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        {!isCollapsed && (
          <div className="flex items-center space-x-2">
            <img src="/logo.png" alt="Logo" className="w-32" />
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <FontAwesomeIcon
            icon={language === 'ar' ? faChevronRight : faChevronLeft}
            className={`text-gray-500 duration-500  ${isCollapsed ? 'rotate-180' : 'rotate-0'}`}
          />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col overflow-y-auto py-4 justify-between h-[calc(100vh-4.5rem)]">
        <div>
          {/* Main Navigation */}
          <div className="px-3 mb-6">
            {/* {!isCollapsed && (
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3">
                {t('sidebar.navigation')}
              </h3>
            )} */}
            {/* User Info */}
            {!isCollapsed && (
              <div className="bg-gradient-to-br from-primary to-primary dark:from-gray-900 dark:to-gray-800 rounded-2xl p-6 text-white mb-6">
                <div
                  className={
                    'flex items-center mb-4 ' +
                    (language === 'en' ? ' flex-row-reverse ' : ' flex-row ')
                  }
                >
                  <img
                    src="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-2.jpg"
                    className="w-16 h-16 rounded-full border-3 border-white ml-4"
                  />
                  <div>
                    <h3 className="text-xl font-bold">{'أحمد محمد'}</h3>
                    <div className={'flex items-center flex-row '}>
                      <FontAwesomeIcon
                        icon={faCoins}
                        className="text-yellow-400 mx-1"
                      />
                      <span className="text-sm">500</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">12</div>
                    <div className="text-xs opacity-90">طلعات</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">5</div>
                    <div className="text-xs opacity-90">مجموعات</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">8</div>
                    <div className="text-xs opacity-90">شارات</div>
                  </div>
                </div>
              </div>
            )}
            <ul className="space-y-1">
              {menuItems.map((item) =>
                item.childs ? (
                  <li key={item.id}>
                    <button
                      onClick={() =>
                        setIsMenueOpen({
                          ...isMenueOpen,
                          [item.id]: !(isMenueOpen[item.id] ?? false),
                        })
                      }
                      className={`w-full flex items-center px-3 py-2 rounded-lg transition-all duration-200 group ${
                        isGroupsActive
                          ? ' bg-primary  text-white shadow-md'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-green-600'
                      }`}
                    >
                      <FontAwesomeIcon
                        icon={item.icon}
                        className={cn(
                          'w-5 h-5 transition-colors',
                          isGroupsActive ? 'text-white' : item.color,
                          isCollapsed ? 'mx-auto' : 'mx-3',
                        )}
                      />
                      {!isCollapsed && (
                        <>
                          <span className="font-medium">{t(item.label)}</span>
                          <FontAwesomeIcon
                            icon={faChevronDown}
                            className={`w-3 h-3 ${language === 'ar' ? 'mr-auto' : 'ml-auto'} transition-transform duration-250 ${
                              isMenueOpen[item.id] ? 'rotate-180' : 'rotate-0'
                            }`}
                          />
                        </>
                      )}
                    </button>

                    {/* Nested groups items with smooth animation */}
                    <div
                      className={`overflow-hidden transition-all duration-300 ease-in-out ${
                        !isCollapsed && isMenueOpen[item.id]
                          ? 'max-h-32 opacity-100'
                          : 'max-h-0 opacity-0'
                      }`}
                    >
                      {!isCollapsed && (
                        <ul className="mt-2 ml-6 space-y-1">
                          {item.childs.map((chiledItem, index) => (
                            <li
                              key={chiledItem.id}
                              className={`transform transition-all duration-200 ease-in-out ${
                                isMenueOpen[item.id]
                                  ? 'translate-y-0 opacity-100'
                                  : '-translate-y-2 opacity-0'
                              }`}
                              style={{
                                transitionDelay: isMenueOpen[item.id]
                                  ? `${index * 50}ms`
                                  : '0ms',
                              }}
                            >
                              <Link
                                to={chiledItem.href}
                                onClick={() => setCurrentPath(chiledItem.href)}
                                className={`flex items-center px-3 py-2 rounded-lg transition-all duration-200 text-sm ${
                                  isActive(chiledItem.href)
                                    ? ' bg-primary  text-white shadow-md'
                                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-green-600'
                                }`}
                              >
                                <FontAwesomeIcon
                                  icon={chiledItem.icon}
                                  className={cn(
                                    'w-4 h-4 mx-3 transition-colors',
                                    isActive(chiledItem.href)
                                      ? 'text-white'
                                      : chiledItem.color,
                                  )}
                                />
                                <span className="font-medium">
                                  {t(chiledItem.label)}
                                </span>
                                {isActive(chiledItem.href) && (
                                  <div className="mx-auto w-2 h-2 bg-white rounded-full"></div>
                                )}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </li>
                ) : (
                  <li key={item.id}>
                    <Link
                      to={item.href}
                      onClick={() => setCurrentPath(item.href)}
                      className={`flex items-center px-3 py-2 rounded-lg transition-all duration-200 group ${
                        isActive(item.href)
                          ? ' bg-primary  text-white shadow-md'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-green-600'
                      }`}
                    >
                      <FontAwesomeIcon
                        icon={item.icon}
                        className={cn(
                          'w-5 h-5 transition-colors',
                          isActive(item.href) ? 'text-white' : item.color,
                          isCollapsed ? 'mx-auto' : 'mx-3',
                        )}
                      />
                      {!isCollapsed && (
                        <span className="font-medium">{t(item.label)}</span>
                      )}
                      {isActive(item.href) && !isCollapsed && (
                        <div
                          className={`${language === 'ar' ? 'mr-auto' : 'ml-auto'} w-2 h-2 bg-white rounded-full`}
                        ></div>
                      )}
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </div>

          {/* Create Section */}
          <div className="px-3 mb-6">
            {/* {!isCollapsed && (
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3">
                {t('sidebar.create')}
              </h3>
            )} */}

            {/* {isCollapsed ? (
              <button
                onClick={() => setIsCreateOpen(!isCreateOpen)}
                className="w-full flex items-center justify-center px-3 py-2 rounded-lg text-white bg-gradient-to-r from-primary to-emerald-500 hover:from-secondary hover:to-emerald-600 transition-all duration-200 shadow-md"
              >
                <FontAwesomeIcon icon={faPlus} className="w-5 h-5" />
              </button>
            ) : (
              <ul className="space-y-1">
                {createItems.map((item) => (
                  <li key={item.id}>
                    <Link
                      to={item.href}
                      className={cn(
                        'flex items-center px-3 py-2 rounded-lg transition-all duration-200 group',
                        isActive(item.href)
                          ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-md'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-green-600',
                      )}
                    >
                      <FontAwesomeIcon
                        icon={item.icon}
                        className={cn(
                          'w-4 h-4 mx-3 transition-colors',
                          isActive(item.href) ? 'text-white' : item.color,
                        )}
                      />
                      <span className="font-medium text-sm">
                        {t(item.label)}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )} */}
          </div>
        </div>

        {/* Secondary Navigation */}
        <div className="px-3 flex flex-col gap-6">
          <div className={isCollapsed ? ' hidden ' : ' block '}>
            <div className="bg-gradient-to-r from-[#FDC500] to-yellow-400 rounded-xl p-4 text-white">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold">تحدي الأسبوع</span>
                <i data-fa-i2svg="">
                  <svg
                    className="svg-inline--fa fa-fire"
                    aria-hidden="true"
                    focusable="false"
                    data-prefix="fas"
                    data-icon="fire"
                    role="img"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 448 512"
                    data-fa-i2svg=""
                  >
                    <path
                      fill="currentColor"
                      d="M159.3 5.4c7.8-7.3 19.9-7.2 27.7 .1c27.6 25.9 53.5 53.8 77.7 84c11-14.4 23.5-30.1 37-42.9c7.9-7.4 20.1-7.4 28 .1c34.6 33 63.9 76.6 84.5 118c20.3 40.8 33.8 82.5 33.8 111.9C448 404.2 348.2 512 224 512C98.4 512 0 404.1 0 276.5c0-38.4 17.8-85.3 45.4-131.7C73.3 97.7 112.7 48.6 159.3 5.4zM225.7 416c25.3 0 47.7-7 68.8-21c42.1-29.4 53.4-88.2 28.1-134.4c-4.5-9-16-9.6-22.5-2l-25.2 29.3c-6.6 7.6-18.5 7.4-24.7-.5c-16.5-21-46-58.5-62.8-79.8c-6.3-8-18.3-8.1-24.7-.1c-33.8 42.5-50.8 69.3-50.8 99.4C112 375.4 162.6 416 225.7 416z"
                    ></path>
                  </svg>
                </i>
              </div>
              <div className="text-sm mb-3">اشترك في 3 طلعات هذا الأسبوع</div>
              <div className="w-full bg-white/30 rounded-full h-2">
                <div
                  className="bg-white h-2 rounded-full"
                  style={{ width: '66%' }}
                ></div>
              </div>
              <div className="text-xs mt-2">2/3 مكتمل</div>
            </div>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            {!isCollapsed && (
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3">
                {t('sidebar.account')}
              </h3>
            )}
            <ul className="space-y-1">
              {secondaryItems.map((item) => (
                <li key={item.id}>
                  <Link
                    to={item.href}
                    onClick={() => setCurrentPath(item.href)}
                    className={cn(
                      'flex items-center px-3 py-2 rounded-lg transition-all duration-200 group',
                      isActive(item.href)
                        ? ' bg-primary text-white shadow-md'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-600',
                    )}
                  >
                    <FontAwesomeIcon
                      icon={item.icon}
                      className={cn(
                        'w-5 h-5 transition-colors',
                        isActive(item.href) ? 'text-white' : item.color,
                        isCollapsed ? 'mx-auto' : 'mx-3',
                      )}
                    />
                    {!isCollapsed && (
                      <span className="font-medium">{t(item.label)}</span>
                    )}
                    {isActive(item.href) && !isCollapsed && (
                      <div className={`${language === 'ar' ? 'mr-auto' : 'ml-auto'} w-2 h-2 bg-white rounded-full`}></div>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>

      {/* Collapse Menu for Create Items */}
      {isCollapsed && isCreateOpen && (
        <div
          className={`absolute ${language === 'ar' ? 'right-16' : 'left-16'} top-20 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-2 min-w-48 z-50`}
        >
          {createItems.map((item) => (
            <Link
              key={item.id}
              to={item.href}
              className="flex items-center px-3 py-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              onClick={() => setIsCreateOpen(false)}
            >
              <FontAwesomeIcon
                icon={item.icon}
                className={cn('w-4 h-4 mx-3', item.color)}
              />
              <span className="text-sm font-medium">{t(item.label)}</span>
            </Link>
          ))}
        </div>
      )}
    </aside>
  )
}
