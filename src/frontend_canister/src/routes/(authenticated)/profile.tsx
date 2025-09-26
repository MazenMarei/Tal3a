import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faAward,
  faBasketballBall,
  faBell,
  faBirthdayCake,
  faCalendar,
  faCamera,
  faChartBar,
  faCog,
  faCrown,
  faEdit,
  faEnvelope,
  faFire,
  faFlag,
  faFutbol,
  faHeart,
  faMapMarkerAlt,
  faMedal,
  faPhone,
  faRunning,
  faShare,
  faStar,
  faTrophy,
  faUser,
  faUsers,
} from '@fortawesome/free-solid-svg-icons'
import { useAppContext } from '../../contexts/AppProvider'

// Mock user profile data
const mockUserProfile = {
  id: 1,
  name: 'أحمد محمد',
  username: '@ahmed_mohamed',
  avatar:
    'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-1.jpg',
  coverPhoto:
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
  bio: 'محب للرياضة والأنشطة الخارجية. أحب كرة القدم والجري وأستمتع بالطلعات مع الأصدقاء.',
  location: 'القاهرة، مصر',
  email: 'ahmed.mohamed@example.com',
  phone: '+20 123 456 7890',
  birthDate: '1995-03-15',
  joinDate: '2023-01-15',
  isVerified: true,
  stats: {
    totalPoints: 2547,
    tal3aatCount: 45,
    friendsCount: 127,
    achievementsCount: 12,
    currentStreak: 15,
    completedChallenges: 8,
    ranking: 23,
  },
  preferences: {
    favoriteActivities: ['Football', 'Running', 'Basketball', 'Tennis'],
    skillLevel: 'Intermediate',
    availability: 'Weekends & Evenings',
    preferredLocation: 'New Cairo',
  },
  achievements: [
    {
      id: 1,
      name: 'First Tal3a Complete',
      icon: 'trophy',
      points: 100,
      date: '2023-01-20',
      rarity: 'common',
    },
    {
      id: 2,
      name: 'Social Butterfly',
      icon: 'users',
      points: 150,
      date: '2023-02-10',
      rarity: 'uncommon',
    },
    {
      id: 3,
      name: 'Streak Master',
      icon: 'fire',
      points: 200,
      date: '2023-03-05',
      rarity: 'rare',
    },
    {
      id: 4,
      name: 'Challenge Champion',
      icon: 'crown',
      points: 300,
      date: '2023-04-12',
      rarity: 'epic',
    },
  ],
  recentActivities: [
    {
      id: 1,
      type: 'tal3a_joined',
      title: 'انضم إلى مباراة كرة قدم',
      description: 'في ستاد الأهلي',
      date: '2023-09-24',
      image:
        'https://images.unsplash.com/photo-1574629810360-7efbbe195018?ixlib=rb-4.0.3&auto=format&fit=crop&w=1074&q=80',
    },
    {
      id: 2,
      type: 'achievement_earned',
      title: 'حصل على إنجاز جديد',
      description: 'Streak Master - 15 يوم متتالي',
      date: '2023-09-22',
    },
    {
      id: 3,
      type: 'challenge_completed',
      title: 'أكمل تحدي الجري',
      description: '10 كيلومتر في أسبوع',
      date: '2023-09-20',
      points: 150,
    },
  ],
  notifications: [
    {
      id: 1,
      type: 'tal3a_invitation',
      title: 'دعوة لطلعة جديدة',
      message:
        'أحمد علي دعاك لانضمام إلى مباراة كرة قدم غداً في الساعة 5 مساءً',
      time: '10 دقائق مضت',
      isRead: false,
      avatar:
        'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-2.jpg',
      actionRequired: true,
    },
    {
      id: 2,
      type: 'friend_request',
      title: 'طلب صداقة جديد',
      message: 'سارة محمد أرسلت لك طلب صداقة',
      time: '30 دقيقة مضت',
      isRead: false,
      avatar:
        'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-3.jpg',
      actionRequired: true,
    },
    {
      id: 3,
      type: 'achievement',
      title: 'إنجاز جديد!',
      message: 'مبروك! لقد حصلت على إنجاز "عضو نشط" وكسبت 100 نقطة',
      time: '2 ساعة مضت',
      isRead: true,
      avatar: null,
      actionRequired: false,
    },
    {
      id: 4,
      type: 'tal3a_reminder',
      title: 'تذكير: طلعة اليوم',
      message: 'لا تنس! لديك مباراة تنس في نادي الجزيرة اليوم الساعة 7 مساءً',
      time: '4 ساعات مضت',
      isRead: true,
      avatar: null,
      actionRequired: false,
    },
    {
      id: 5,
      type: 'group_join',
      title: 'انضمام إلى مجموعة',
      message: 'لقد انضممت بنجاح إلى مجموعة "جري الزمالك الصباحي"',
      time: '1 يوم مضت',
      isRead: true,
      avatar: null,
      actionRequired: false,
    },
    {
      id: 6,
      type: 'challenge_complete',
      title: 'تحدي مكتمل',
      message: 'أكملت تحدي "10 كيلومتر في الأسبوع" وحصلت على 150 نقطة!',
      time: '2 أيام مضت',
      isRead: true,
      avatar: null,
      actionRequired: false,
    },
  ],
}

export const Route = createFileRoute('/(authenticated)/profile')({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      tab: (search.tab as string) || 'overview',
    }
  },
})

function RouteComponent() {
  const { theme, language } = useAppContext()
  const { tab } = Route.useSearch()
  const [activeTab, setActiveTab] = useState(tab || 'overview')
  const [isEditing, setIsEditing] = useState(false)

  // Update activeTab when URL search parameter changes
  useEffect(() => {
    setActiveTab(tab || 'overview')
  }, [tab])

  // Count unread notifications
  const unreadCount = mockUserProfile.notifications.filter(
    (n) => !n.isRead,
  ).length

  const tabs = [
    {
      id: 'overview',
      label: language === 'ar' ? 'نظرة عامة' : 'Overview',
      icon: faUser,
    },
    {
      id: 'activities',
      label: language === 'ar' ? 'الأنشطة' : 'Activities',
      icon: faRunning,
    },
    {
      id: 'achievements',
      label: language === 'ar' ? 'الإنجازات' : 'Achievements',
      icon: faTrophy,
    },
    {
      id: 'notifications',
      label: language === 'ar' ? 'الإشعارات' : 'Notifications',
      icon: faBell,
    },
    {
      id: 'statistics',
      label: language === 'ar' ? 'الإحصائيات' : 'Statistics',
      icon: faChartBar,
    },
    {
      id: 'settings',
      label: language === 'ar' ? 'الإعدادات' : 'Settings',
      icon: faCog,
    },
  ]

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common':
        return 'text-gray-500 bg-gray-100'
      case 'uncommon':
        return 'text-green-500 bg-green-100'
      case 'rare':
        return 'text-blue-500 bg-blue-100'
      case 'epic':
        return 'text-purple-500 bg-purple-100'
      case 'legendary':
        return 'text-yellow-500 bg-yellow-100'
      default:
        return 'text-gray-500 bg-gray-100'
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'tal3a_invitation':
        return faUsers
      case 'friend_request':
        return faUser
      case 'achievement':
        return faTrophy
      case 'tal3a_reminder':
        return faBell
      case 'group_join':
        return faUsers
      case 'challenge_complete':
        return faAward
      default:
        return faBell
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'tal3a_invitation':
        return 'text-blue-500'
      case 'friend_request':
        return 'text-green-500'
      case 'achievement':
        return 'text-yellow-500'
      case 'tal3a_reminder':
        return 'text-orange-500'
      case 'group_join':
        return 'text-purple-500'
      case 'challenge_complete':
        return 'text-red-500'
      default:
        return 'text-gray-500'
    }
  }

  const handleAcceptRequest = (notificationId: number) => {
    // Handle accept logic here
    console.log('Accepted notification:', notificationId)
  }

  const handleDeclineRequest = (notificationId: number) => {
    // Handle decline logic here
    console.log('Declined notification:', notificationId)
  }

  const markAsRead = (notificationId: number) => {
    // Handle mark as read logic here
    console.log('Marked as read:', notificationId)
  }

  return (
    <div
      className={`min-h-screen ${theme === 'dark' ? 'bg-dark-bg text-dark-text' : 'bg-light-bg text-light-text'} font-cairo`}
      dir={language === 'ar' ? 'rtl' : 'ltr'}
    >
      <div className="container mx-auto px-4 py-6 pb-24 lg:pb-6 max-w-7xl">
        {/* Profile Header */}
        <div
          className={`${theme === 'dark' ? 'bg-dark-bg border border-gray-700' : 'bg-white border border-gray-200'} rounded-2xl overflow-hidden shadow-lg mb-8`}
        >
          {/* Cover Photo */}
          <div className="relative h-64 lg:h-80">
            <img
              src={mockUserProfile.coverPhoto}
              alt="Cover"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>

            {/* Edit Cover Button */}
            <button
              className={`absolute top-4 ${language === 'ar' ? 'left-4' : 'right-4'} bg-black/30 backdrop-blur-sm text-white p-2 rounded-full hover:bg-black/50 transition-colors`}
            >
              <FontAwesomeIcon icon={faCamera} className="text-sm" />
            </button>

            {/* Profile Picture */}
            <div
              className={`absolute -bottom-16 left-1/2 transform -translate-x-1/2 ${language === 'ar' ? 'lg:right-8 lg:left-auto' : 'lg:left-8'} lg:transform-none`}
            >
              <div className="relative">
                <img
                  src={mockUserProfile.avatar}
                  alt={mockUserProfile.name}
                  className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
                />
                {mockUserProfile.isVerified && (
                  <div
                    className={`absolute -top-2 ${language === 'ar' ? '-left-2' : '-right-2'} bg-primary text-white rounded-full p-2`}
                  >
                    <FontAwesomeIcon icon={faStar} className="text-sm" />
                  </div>
                )}
                <button
                  className={`absolute bottom-2 ${language === 'ar' ? 'left-2' : 'right-2'} bg-primary text-white p-2 rounded-full hover:bg-primary-dark transition-colors`}
                >
                  <FontAwesomeIcon icon={faCamera} className="text-xs" />
                </button>
              </div>
            </div>
          </div>

          {/* Profile Info */}
          <div className="pt-20 lg:pt-8 px-6 pb-6">
            <div className="lg:flex lg:items-start lg:justify-between">
              <div
                className={`text-center ${language === 'ar' ? 'lg:text-right lg:mr-48' : 'lg:text-left lg:ml-48'}`}
              >
                <div
                  className={`flex items-center justify-center ${language === 'ar' ? 'lg:justify-end' : 'lg:justify-start'} gap-3 mb-2`}
                >
                  <h1
                    className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-secondary'}`}
                  >
                    {mockUserProfile.name}
                  </h1>
                  {mockUserProfile.isVerified && (
                    <FontAwesomeIcon
                      icon={faStar}
                      className="text-primary text-xl"
                    />
                  )}
                </div>
                <p className="text-gray-500 mb-2">{mockUserProfile.username}</p>
                <p
                  className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} mb-4 max-w-lg`}
                >
                  {mockUserProfile.bio}
                </p>

                {/* Profile Stats */}
                <div
                  className={`flex justify-center ${language === 'ar' ? 'lg:justify-end' : 'lg:justify-start'} gap-8 mb-4`}
                >
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">
                      {mockUserProfile.stats.tal3aatCount}
                    </div>
                    <div className="text-sm text-gray-500">
                      {language === 'ar' ? 'طلعة' : 'Tal3aat'}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">
                      {mockUserProfile.stats.friendsCount}
                    </div>
                    <div className="text-sm text-gray-500">
                      {language === 'ar' ? 'صديق' : 'Friends'}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">
                      {mockUserProfile.stats.totalPoints.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500">
                      {language === 'ar' ? 'نقطة' : 'Points'}
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div
                  className={`flex items-center justify-center ${language === 'ar' ? 'lg:justify-end' : 'lg:justify-start'} gap-2 text-gray-500 mb-4`}
                >
                  <FontAwesomeIcon icon={faMapMarkerAlt} />
                  <span>{mockUserProfile.location}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div
                className={`flex justify-center ${language === 'ar' ? 'lg:justify-start' : 'lg:justify-end'} gap-3 mt-6 lg:mt-0`}
              >
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors"
                >
                  <FontAwesomeIcon icon={faEdit} />
                  <span>
                    {language === 'ar' ? 'تعديل الملف الشخصي' : 'Edit Profile'}
                  </span>
                </button>
                <button
                  className={`flex items-center gap-2 ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-700'} px-6 py-3 rounded-lg font-semibold hover:opacity-80 transition-opacity`}
                >
                  <FontAwesomeIcon icon={faShare} />
                  <span>{language === 'ar' ? 'مشاركة' : 'Share'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div
          className={`${theme === 'dark' ? 'bg-dark-bg border border-gray-700' : 'bg-white border border-gray-200'} rounded-2xl p-6 shadow-lg mb-8`}
        >
          <div className="flex flex-wrap gap-2 lg:gap-4">
            {tabs.map((tabItem) => (
              <button
                key={tabItem.id}
                onClick={() => setActiveTab(tabItem.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors relative ${
                  activeTab === tabItem.id
                    ? 'bg-primary text-white'
                    : `${theme === 'dark' ? 'text-gray-400 hover:text-white hover:bg-gray-700' : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'}`
                }`}
              >
                <FontAwesomeIcon icon={tabItem.icon} className="text-sm" />
                <span className="hidden sm:inline">{tabItem.label}</span>
                {tabItem.id === 'notifications' && unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Quick Stats */}
                <div
                  className={`${theme === 'dark' ? 'bg-dark-bg border border-gray-700' : 'bg-white border border-gray-200'} rounded-2xl p-6 shadow-lg`}
                >
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <FontAwesomeIcon
                      icon={faChartBar}
                      className="text-primary"
                    />
                    {language === 'ar' ? 'إحصائيات سريعة' : 'Quick Stats'}
                  </h3>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div
                      className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'} text-center`}
                    >
                      <FontAwesomeIcon
                        icon={faFire}
                        className="text-2xl text-orange-500 mb-2"
                      />
                      <div className="text-xl font-bold">
                        {mockUserProfile.stats.currentStreak}
                      </div>
                      <div className="text-sm text-gray-500">
                        {language === 'ar' ? 'أيام متتالية' : 'Day Streak'}
                      </div>
                    </div>

                    <div
                      className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'} text-center`}
                    >
                      <FontAwesomeIcon
                        icon={faTrophy}
                        className="text-2xl text-yellow-500 mb-2"
                      />
                      <div className="text-xl font-bold">
                        {mockUserProfile.stats.completedChallenges}
                      </div>
                      <div className="text-sm text-gray-500">
                        {language === 'ar' ? 'تحديات مكتملة' : 'Challenges'}
                      </div>
                    </div>

                    <div
                      className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'} text-center`}
                    >
                      <FontAwesomeIcon
                        icon={faMedal}
                        className="text-2xl text-blue-500 mb-2"
                      />
                      <div className="text-xl font-bold">
                        #{mockUserProfile.stats.ranking}
                      </div>
                      <div className="text-sm text-gray-500">
                        {language === 'ar' ? 'الترتيب العام' : 'Global Rank'}
                      </div>
                    </div>

                    <div
                      className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'} text-center`}
                    >
                      <FontAwesomeIcon
                        icon={faAward}
                        className="text-2xl text-purple-500 mb-2"
                      />
                      <div className="text-xl font-bold">
                        {mockUserProfile.stats.achievementsCount}
                      </div>
                      <div className="text-sm text-gray-500">
                        {language === 'ar' ? 'إنجازات' : 'Achievements'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Favorite Activities */}
                <div
                  className={`${theme === 'dark' ? 'bg-dark-bg border border-gray-700' : 'bg-white border border-gray-200'} rounded-2xl p-6 shadow-lg`}
                >
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <FontAwesomeIcon icon={faHeart} className="text-red-500" />
                    {language === 'ar'
                      ? 'الأنشطة المفضلة'
                      : 'Favorite Activities'}
                  </h3>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {mockUserProfile.preferences.favoriteActivities.map(
                      (activity, index) => (
                        <div
                          key={index}
                          className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'} text-center`}
                        >
                          <FontAwesomeIcon
                            icon={
                              activity === 'Football'
                                ? faFutbol
                                : activity === 'Running'
                                  ? faRunning
                                  : faBasketballBall
                            }
                            className="text-2xl text-primary mb-2"
                          />
                          <div className="font-semibold">{activity}</div>
                        </div>
                      ),
                    )}
                  </div>
                </div>

                {/* Recent Activities */}
                <div
                  className={`${theme === 'dark' ? 'bg-dark-bg border border-gray-700' : 'bg-white border border-gray-200'} rounded-2xl p-6 shadow-lg`}
                >
                  <h3 className="text-xl font-bold mb-6">
                    {language === 'ar'
                      ? 'الأنشطة الأخيرة'
                      : 'Recent Activities'}
                  </h3>

                  <div className="space-y-4">
                    {mockUserProfile.recentActivities.map((activity) => (
                      <div
                        key={activity.id}
                        className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'} flex items-start gap-4`}
                      >
                        {activity.image && (
                          <img
                            src={activity.image}
                            alt=""
                            className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                          />
                        )}
                        <div className="flex-1">
                          <h4 className="font-semibold mb-1">
                            {activity.title}
                          </h4>
                          <p className="text-sm text-gray-500 mb-2">
                            {activity.description}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-gray-400">
                            <span>{activity.date}</span>
                            {activity.points && (
                              <span className="flex items-center gap-1 text-accent">
                                <FontAwesomeIcon icon={faTrophy} />+
                                {activity.points} points
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Achievements Tab */}
            {activeTab === 'achievements' && (
              <div
                className={`${theme === 'dark' ? 'bg-dark-bg border border-gray-700' : 'bg-white border border-gray-200'} rounded-2xl p-6 shadow-lg`}
              >
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <FontAwesomeIcon
                    icon={faTrophy}
                    className="text-yellow-500"
                  />
                  {language === 'ar' ? 'الإنجازات' : 'Achievements'}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {mockUserProfile.achievements.map((achievement) => (
                    <div
                      key={achievement.id}
                      className={`p-6 rounded-xl border-2 ${getRarityColor(achievement.rarity)} ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} hover:scale-105 transition-transform`}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-16 h-16 rounded-full ${getRarityColor(achievement.rarity)} flex items-center justify-center`}
                        >
                          <FontAwesomeIcon
                            icon={
                              achievement.icon === 'crown'
                                ? faCrown
                                : achievement.icon === 'users'
                                  ? faUsers
                                  : achievement.icon === 'fire'
                                    ? faFire
                                    : faTrophy
                            }
                            className="text-2xl"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-lg mb-1">
                            {achievement.name}
                          </h4>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <span>+{achievement.points} points</span>
                            <span>•</span>
                            <span>{achievement.date}</span>
                          </div>
                          <div
                            className={`inline-block px-2 py-1 rounded-full text-xs font-semibold mt-2 ${getRarityColor(achievement.rarity)}`}
                          >
                            {achievement.rarity}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div
                className={`${theme === 'dark' ? 'bg-dark-bg border border-gray-700' : 'bg-white border border-gray-200'} rounded-2xl p-6 shadow-lg`}
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <FontAwesomeIcon icon={faBell} className="text-primary" />
                    {language === 'ar' ? 'الإشعارات' : 'Notifications'}
                  </h3>
                  <button className="text-sm text-primary hover:text-primary-dark">
                    {language === 'ar'
                      ? 'تحديد الكل كمقروء'
                      : 'Mark All as Read'}
                  </button>
                </div>

                <div className="space-y-4">
                  {mockUserProfile.notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 rounded-lg border transition-all hover:shadow-md ${
                        !notification.isRead
                          ? `${theme === 'dark' ? 'bg-blue-900/10 border-blue-500/30' : 'bg-blue-50 border-blue-200'}`
                          : `${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`
                      }`}
                    >
                      <div
                        className={`flex items-start gap-4 ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}
                      >
                        {/* Notification Icon/Avatar */}
                        <div className="flex-shrink-0">
                          {notification.avatar ? (
                            <img
                              src={notification.avatar}
                              alt=""
                              className="w-12 h-12 rounded-full"
                            />
                          ) : (
                            <div
                              className={`w-12 h-12 rounded-full ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} flex items-center justify-center`}
                            >
                              <FontAwesomeIcon
                                icon={getNotificationIcon(notification.type)}
                                className={`${getNotificationColor(notification.type)} text-lg`}
                              />
                            </div>
                          )}
                          {!notification.isRead && (
                            <div
                              className={`absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full ${language === 'ar' ? '-left-1 -right-auto' : ''}`}
                            ></div>
                          )}
                        </div>

                        {/* Notification Content */}
                        <div className="flex-1">
                          <div
                            className={`flex items-center justify-between mb-1 ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}
                          >
                            <h4
                              className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
                            >
                              {notification.title}
                            </h4>
                            <span className="text-xs text-gray-500">
                              {notification.time}
                            </span>
                          </div>

                          <p
                            className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} mb-3`}
                          >
                            {notification.message}
                          </p>

                          {/* Action Buttons */}
                          {notification.actionRequired && (
                            <div
                              className={`flex gap-2 ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}
                            >
                              {notification.type === 'tal3a_invitation' && (
                                <>
                                  <button
                                    onClick={() =>
                                      handleAcceptRequest(notification.id)
                                    }
                                    className="px-4 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary-dark transition-colors"
                                  >
                                    {language === 'ar' ? 'قبول' : 'Accept'}
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleDeclineRequest(notification.id)
                                    }
                                    className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                                      theme === 'dark'
                                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                                  >
                                    {language === 'ar' ? 'رفض' : 'Decline'}
                                  </button>
                                </>
                              )}

                              {notification.type === 'friend_request' && (
                                <>
                                  <button
                                    onClick={() =>
                                      handleAcceptRequest(notification.id)
                                    }
                                    className="px-4 py-2 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 transition-colors"
                                  >
                                    {language === 'ar' ? 'قبول' : 'Accept'}
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleDeclineRequest(notification.id)
                                    }
                                    className="px-4 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors"
                                  >
                                    {language === 'ar' ? 'رفض' : 'Decline'}
                                  </button>
                                </>
                              )}
                            </div>
                          )}

                          {/* Mark as read button for unread notifications */}
                          {!notification.isRead &&
                            !notification.actionRequired && (
                              <button
                                onClick={() => markAsRead(notification.id)}
                                className="text-xs text-primary hover:text-primary-dark"
                              >
                                {language === 'ar'
                                  ? 'تحديد كمقروء'
                                  : 'Mark as read'}
                              </button>
                            )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Empty state */}
                {mockUserProfile.notifications.length === 0 && (
                  <div className="text-center py-12">
                    <FontAwesomeIcon
                      icon={faBell}
                      className={`text-4xl mb-4 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`}
                    />
                    <p
                      className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}
                    >
                      {language === 'ar'
                        ? 'لا توجد إشعارات'
                        : 'No notifications yet'}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Other tabs placeholder */}
            {activeTab !== 'overview' && activeTab !== 'achievements' && (
              <div
                className={`${theme === 'dark' ? 'bg-dark-bg border border-gray-700' : 'bg-white border border-gray-200'} rounded-2xl p-6 shadow-lg text-center`}
              >
                <h3 className="text-xl font-bold mb-4">
                  {tabs.find((tabItem) => tabItem.id === activeTab)?.label}
                </h3>
                <p className="text-gray-500">
                  {language === 'ar'
                    ? 'هذا القسم قيد التطوير'
                    : 'This section is under development'}
                </p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Notifications Summary */}
            {unreadCount > 0 && (
              <div
                className={`${theme === 'dark' ? 'bg-dark-bg border border-gray-700' : 'bg-white border border-gray-200'} rounded-2xl p-4 shadow-lg`}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold flex items-center gap-2">
                    <FontAwesomeIcon icon={faBell} className="text-primary" />
                    {language === 'ar' ? 'إشعارات جديدة' : 'New Notifications'}
                  </h3>
                  <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                </div>

                <div className="space-y-2">
                  {mockUserProfile.notifications
                    .filter((n) => !n.isRead)
                    .slice(0, 3)
                    .map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'} cursor-pointer hover:opacity-80`}
                        onClick={() => setActiveTab('notifications')}
                      >
                        <div className="text-xs font-medium truncate">
                          {notification.title}
                        </div>
                        <div className="text-xs text-gray-500 truncate">
                          {notification.time}
                        </div>
                      </div>
                    ))}
                </div>

                <button
                  onClick={() => setActiveTab('notifications')}
                  className="w-full mt-3 py-2 text-sm text-primary hover:text-primary-dark font-medium"
                >
                  {language === 'ar'
                    ? 'عرض جميع الإشعارات'
                    : 'View All Notifications'}
                </button>
              </div>
            )}

            {/* Contact Info */}
            <div
              className={`${theme === 'dark' ? 'bg-dark-bg border border-gray-700' : 'bg-white border border-gray-200'} rounded-2xl p-6 shadow-lg`}
            >
              <h3 className="text-lg font-bold mb-4">
                {language === 'ar' ? 'معلومات الاتصال' : 'Contact Info'}
              </h3>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <FontAwesomeIcon
                    icon={faEnvelope}
                    className="text-gray-400"
                  />
                  <span className="text-sm">{mockUserProfile.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <FontAwesomeIcon icon={faPhone} className="text-gray-400" />
                  <span className="text-sm">{mockUserProfile.phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <FontAwesomeIcon
                    icon={faBirthdayCake}
                    className="text-gray-400"
                  />
                  <span className="text-sm">{mockUserProfile.birthDate}</span>
                </div>
                <div className="flex items-center gap-3">
                  <FontAwesomeIcon
                    icon={faCalendar}
                    className="text-gray-400"
                  />
                  <span className="text-sm">
                    {language === 'ar' ? 'انضم في' : 'Joined'}{' '}
                    {mockUserProfile.joinDate}
                  </span>
                </div>
              </div>
            </div>

            {/* Preferences */}
            <div
              className={`${theme === 'dark' ? 'bg-dark-bg border border-gray-700' : 'bg-white border border-gray-200'} rounded-2xl p-6 shadow-lg`}
            >
              <h3 className="text-lg font-bold mb-4">
                {language === 'ar' ? 'التفضيلات' : 'Preferences'}
              </h3>

              <div className="space-y-3">
                <div>
                  <div className="text-sm font-semibold text-gray-500 mb-1">
                    {language === 'ar' ? 'مستوى المهارة' : 'Skill Level'}
                  </div>
                  <div className="text-sm">
                    {mockUserProfile.preferences.skillLevel}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-500 mb-1">
                    {language === 'ar' ? 'الأوقات المتاحة' : 'Availability'}
                  </div>
                  <div className="text-sm">
                    {mockUserProfile.preferences.availability}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-500 mb-1">
                    {language === 'ar'
                      ? 'المنطقة المفضلة'
                      : 'Preferred Location'}
                  </div>
                  <div className="text-sm">
                    {mockUserProfile.preferences.preferredLocation}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div
              className={`${theme === 'dark' ? 'bg-dark-bg border border-gray-700' : 'bg-white border border-gray-200'} rounded-2xl p-6 shadow-lg`}
            >
              <h3 className="text-lg font-bold mb-4">
                {language === 'ar' ? 'إجراءات سريعة' : 'Quick Actions'}
              </h3>

              <div className="space-y-3">
                <button className="w-full text-left flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <FontAwesomeIcon icon={faFlag} className="text-primary" />
                  <span className="text-sm">
                    {language === 'ar' ? 'إنشاء تحدي' : 'Create Challenge'}
                  </span>
                </button>
                <button className="w-full text-left flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <FontAwesomeIcon icon={faUsers} className="text-primary" />
                  <span className="text-sm">
                    {language === 'ar' ? 'دعوة الأصدقاء' : 'Invite Friends'}
                  </span>
                </button>
                <button className="w-full text-left flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <FontAwesomeIcon icon={faShare} className="text-primary" />
                  <span className="text-sm">
                    {language === 'ar'
                      ? 'مشاركة الملف الشخصي'
                      : 'Share Profile'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
