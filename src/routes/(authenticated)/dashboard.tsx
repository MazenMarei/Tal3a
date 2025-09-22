import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useAppContext } from '../../contexts/AppProvider'

// Activity interfaces
interface BaseActivity {
  id: number
  user: {
    name: string
    avatar: string
  }
  activity: string
  content: string
  time: string
  timestamp: string
  location?: string
  source: 'Tal3a App' | 'Facebook' | 'Instagram' | 'Strava' | 'MyFitnessPal'
  likes: number
  comments: number
  shares: number
  isLiked: boolean
  image?: string
  originalPost?: {
    user: string
    content: string
  }
}

interface PostActivity extends BaseActivity {
  type: 'post'
}

interface PointsActivity extends BaseActivity {
  type: 'points_earned' | 'challenge_completed'
  points: number
}

interface AchievementActivity extends BaseActivity {
  type: 'achievement_unlocked'
  achievement: {
    name: string
    icon: string
    points: number
  }
}

interface WorkoutActivity extends BaseActivity {
  type: 'workout_completed'
  workout: {
    duration: string
    calories: number
    type: string
  }
}

interface JoinActivity extends BaseActivity {
  type:
    | 'joined_tal3a'
    | 'tal3a_joined'
    | 'group_created'
    | 'tal3a_created'
    | 'event_joined'
}

interface PostSharedActivity extends BaseActivity {
  type: 'post_shared'
}

type ActivityType =
  | PostActivity
  | PointsActivity
  | AchievementActivity
  | WorkoutActivity
  | JoinActivity
  | PostSharedActivity

export const Route = createFileRoute('/(authenticated)/dashboard')({
  component: RouteComponent,
})

// Mock user data - in real app this would come from API/context
const mockUserData = {
  name: 'أحمد محمد',
  level: 'نشط',
  avatar:
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
  stats: {
    tal3aatThisMonth: 12,
    totalPoints: 2840,
    groupsJoined: 5,
    globalRank: 247,
    activeDays: 28,
    activeHours: 156,
  },
}

// Mock data for feeds and challenges
const mockChallenges = [
  {
    id: 1,
    title: 'تحدي الجري الأسبوعي',
    description: 'اجري 10 كيلومترات خلال الأسبوع',
    sport: 'running',
    reward: 50,
    participants: 124,
    deadline: '2025-09-29',
    image:
      'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=200&fit=crop',
  },
  {
    id: 2,
    title: 'تحدي كرة القدم الجماعي',
    description: 'شارك في 3 مباريات كرة قدم',
    sport: 'football',
    reward: 100,
    participants: 89,
    deadline: '2025-10-05',
    image:
      'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=200&fit=crop',
  },
  {
    id: 3,
    title: 'تحدي السباحة الشهري',
    description: 'اسبح 5000 متر خلال الشهر',
    sport: 'swimming',
    reward: 75,
    participants: 56,
    deadline: '2025-09-30',
    image:
      'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=400&h=200&fit=crop',
  },
]

const mockFeedActivities: Array<ActivityType> = [
  {
    id: 1,
    type: 'tal3a_joined',
    user: {
      name: 'سارة أحمد',
      avatar:
        'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face',
    },
    activity: 'انضمت لطلعة كرة تنس',
    content:
      'أخيراً لقيت مجموعة تنس في المنطقة! متحمسة للعب معاكم يوم السبت 🎾',
    time: 'منذ 5 دقائق',
    timestamp: '2025-09-22T14:25:00Z',
    location: 'نادي الجزيرة الرياضي',
    source: 'Tal3a App',
    likes: 12,
    comments: 3,
    shares: 1,
    image:
      'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=300&h=150&fit=crop',
    isLiked: false,
  },
  {
    id: 2,
    type: 'challenge_completed',
    user: {
      name: 'محمد علي',
      avatar:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face',
    },
    activity: 'أكمل تحدي الجري الأسبوعي',
    content:
      'تحدي الجري الأسبوعي مكتمل! 🏃‍♂️ 10 كيلومترات في 5 أيام. الهدف القادم: 15 كيلومتر!',
    time: 'منذ 15 دقيقة',
    timestamp: '2025-09-22T14:15:00Z',
    location: 'كورنيش النيل',
    source: 'Strava',
    likes: 28,
    comments: 8,
    shares: 4,
    points: 50,
    isLiked: true,
  },
  {
    id: 3,
    type: 'group_created',
    user: {
      name: 'فاطمة محمود',
      avatar:
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face',
    },
    activity: 'أنشأت مجموعة كرة سلة جديدة',
    content:
      'مين عايز ينضم لمجموعة كرة السلة الجديدة؟ 🏀 هنلعب كل يوم خميس من 7-9 مساءً',
    time: 'منذ ساعة',
    timestamp: '2025-09-22T13:30:00Z',
    location: 'مدينة نصر الرياضي',
    source: 'Tal3a App',
    likes: 15,
    comments: 6,
    shares: 2,
    image:
      'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=300&h=150&fit=crop',
    isLiked: false,
  },
  {
    id: 4,
    type: 'post_shared',
    user: {
      name: 'أحمد حسن',
      avatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face',
    },
    activity: 'شارك منشور',
    content:
      'بحث عن شريك للعب تنس الطاولة في وسط البلد. المواعيد مرنة والمستوى متوسط 🏓',
    time: 'منذ ساعتين',
    timestamp: '2025-09-22T12:30:00Z',
    location: 'وسط البلد',
    source: 'Facebook',
    likes: 7,
    comments: 2,
    shares: 0,
    originalPost: {
      user: 'كريم محمود',
      content: 'بدور على حد يلعب معايا تنس طاولة',
    },
    isLiked: false,
  },
  {
    id: 5,
    type: 'achievement_unlocked',
    user: {
      name: 'نور الدين',
      avatar:
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face',
    },
    activity: 'حصل على إنجاز جديد',
    content: 'وصلت للمستوى الذهبي! 🥇 شكراً لكل اللي ساعدني أوصل للنتيجة دي',
    time: 'منذ 3 ساعات',
    timestamp: '2025-09-22T11:30:00Z',
    source: 'Tal3a App',
    likes: 45,
    comments: 12,
    shares: 8,
    achievement: {
      name: 'المستوى الذهبي',
      icon: 'trophy',
      points: 500,
    },
    isLiked: true,
  },
  {
    id: 6,
    type: 'workout_completed',
    user: {
      name: 'ياسمين أحمد',
      avatar:
        'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face',
    },
    activity: 'أنهت تمرين اليوم',
    content:
      'تمرين رائع اليوم! 💪 45 دقيقة كارديو + 30 دقيقة أوزان. الطاقة عالية جداً!',
    time: 'منذ 4 ساعات',
    timestamp: '2025-09-22T10:30:00Z',
    location: 'جيم فتنس تايم',
    source: 'MyFitnessPal',
    likes: 22,
    comments: 5,
    shares: 1,
    workout: {
      duration: '75 دقيقة',
      calories: 420,
      type: 'كارديو + أوزان',
    },
    isLiked: false,
  },
]

const additionalActivities: Array<ActivityType> = [
  {
    id: 7,
    type: 'tal3a_created',
    user: {
      name: 'حسام محمد',
      avatar:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face',
    },
    activity: 'أنشأ طلعة جديدة',
    content: 'طلعة كرة قدم يوم الجمعة الساعة 6 مساءً. محتاجين 4 لاعبين كمان ⚽',
    time: 'منذ 5 ساعات',
    timestamp: '2025-09-22T09:30:00Z',
    location: 'ملعب الأهلي',
    source: 'Tal3a App',
    likes: 18,
    comments: 7,
    shares: 3,
    isLiked: true,
  },
  {
    id: 8,
    type: 'event_joined',
    user: {
      name: 'مريم سعد',
      avatar:
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face',
    },
    activity: 'انضمت لبطولة',
    content: 'متحمسة للبطولة الشهرية! أول مرة أشارك في بطولة رسمية 🏆',
    time: 'منذ 6 ساعات',
    timestamp: '2025-09-22T08:30:00Z',
    location: 'نادي الزمالك',
    source: 'Instagram',
    likes: 31,
    comments: 9,
    shares: 2,
    image:
      'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=300&h=150&fit=crop',
    isLiked: false,
  },
]

function RouteComponent() {
  const { language, theme } = useAppContext()
  const { t } = useTranslation()
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0)
  const [showAllActivities, setShowAllActivities] = useState(false)
  const [likedPosts, setLikedPosts] = useState<Array<number>>([2, 5, 7])

  // Get activities to display
  const displayedActivities = showAllActivities
    ? [...mockFeedActivities, ...additionalActivities]
    : mockFeedActivities

  // Handle like/unlike posts
  const handleLikePost = (postId: number) => {
    setLikedPosts((prev) =>
      prev.includes(postId)
        ? prev.filter((id) => id !== postId)
        : [...prev, postId],
    )
  }

  // Get source icon based on platform
  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'App':
        return ['fas', 'mobile-alt'];
      case 'Website':
        return ['fas', 'globe'];
      case 'Instagram':
        return ['fab', 'instagram'];
      case 'Facebook':
        return ['fab', 'facebook'];
      case 'Twitter':
        return ['fab', 'twitter'];
      case 'WhatsApp':
        return ['fab', 'whatsapp'];
      case 'Telegram':
        return ['fab', 'telegram'];
      default:
        return ['fas', 'share'];
    }
  };

  // Auto-rotate challenges carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentChallengeIndex((prev) => (prev + 1) % mockChallenges.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const getSportIcon = (sport: string) => {
    switch (sport) {
      case 'running':
        return ['fas', 'running']
      case 'football':
        return ['fas', 'futbol']
      case 'swimming':
        return ['fas', 'swimmer']
      case 'basketball':
        return ['fas', 'basketball-ball']
      case 'tennis':
        return ['fas', 'table-tennis']
      default:
        return ['fas', 'dumbbell']
    }
  }

  return (
    <div
      className={`min-h-screen ${theme === 'dark' ? 'bg-dark-bg text-dark-text' : 'bg-light-bg text-light-text'} font-cairo`}
      dir={language === 'ar' ? 'rtl' : 'ltr'}
    >
      <div className="container mx-auto px-4 py-6 pb-24 lg:pb-6 max-w-7xl">
        {/* Welcome Header Section */}
        <section
          id="hero-dashboard"
          className={`${
            theme === 'dark'
              ? 'bg-gradient-to-r from-gray-800 via-primary-dark to-gray-900'
              : 'bg-gradient-to-r from-primary to-secondary'
          } text-white py-12 rounded-2xl mb-8 relative overflow-hidden`}
        >
          {/* Background decorative elements */}
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute -top-8 -right-8 w-32 h-32 bg-accent rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-highlight rounded-full opacity-30"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
              <div className="lg:col-span-2">
                <div className={`flex items-center gap-3 mb-4 ${'flex-row'}`}>
                  <div
                    className={`w-24 h-24 rounded-full overflow-hidden border-4 ${
                      theme === 'dark' ? 'border-white/30' : 'border-white/20'
                    } shadow-lg`}
                  >
                    <img
                      src={mockUserData.avatar}
                      alt={mockUserData.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div
                    className={language === 'ar' ? 'text-right' : 'text-left'}
                  >
                    <h2 className="text-3xl font-bold">
                      {t('dashboard.welcome')} {mockUserData.name}! 👋
                    </h2>
                    <p
                      className={`text-lg ${theme === 'dark' ? 'text-white/70' : 'text-white/80'}`}
                    >
                      {language === 'ar'
                        ? 'جاهز لطلعة جديدة؟'
                        : 'Ready for a new Tal3a?'}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
                  <div
                    className={`${
                      theme === 'dark'
                        ? 'bg-white/5 backdrop-blur-md border border-white/10'
                        : 'bg-white/10 backdrop-blur-sm'
                    } rounded-xl p-4 text-center hover:bg-white/20 transition-all duration-300`}
                  >
                    <FontAwesomeIcon
                      icon={['fas', 'running']}
                      className={`text-2xl mb-2 ${theme === 'dark' ? 'text-accent-yellow' : 'text-accent'}`}
                    />
                    <div className="text-2xl font-bold">
                      {mockUserData.stats.tal3aatThisMonth}
                    </div>
                    <div
                      className={`text-sm ${theme === 'dark' ? 'text-white/70' : 'text-white/80'}`}
                    >
                      {t('dashboard.thisMonth')}
                    </div>
                  </div>
                  <div
                    className={`${
                      theme === 'dark'
                        ? 'bg-white/5 backdrop-blur-md border border-white/10'
                        : 'bg-white/10 backdrop-blur-sm'
                    } rounded-xl p-4 text-center hover:bg-white/20 transition-all duration-300`}
                  >
                    <FontAwesomeIcon
                      icon={['fas', 'users']}
                      className={`text-2xl mb-2 ${theme === 'dark' ? 'text-accent-yellow' : 'text-accent'}`}
                    />
                    <div className="text-2xl font-bold">
                      {mockUserData.stats.groupsJoined}
                    </div>
                    <div
                      className={`text-sm ${theme === 'dark' ? 'text-white/70' : 'text-white/80'}`}
                    >
                      {t('dashboard.groups')}
                    </div>
                  </div>
                  <div
                    className={`${
                      theme === 'dark'
                        ? 'bg-white/5 backdrop-blur-md border border-white/10'
                        : 'bg-white/10 backdrop-blur-sm'
                    } rounded-xl p-4 text-center hover:bg-white/20 transition-all duration-300`}
                  >
                    <FontAwesomeIcon
                      icon={['fas', 'trophy']}
                      className={`text-2xl mb-2 ${theme === 'dark' ? 'text-accent-yellow' : 'text-accent'}`}
                    />
                    <div className="text-2xl font-bold">8</div>
                    <div
                      className={`text-sm ${theme === 'dark' ? 'text-white/70' : 'text-white/80'}`}
                    >
                      {language === 'ar' ? 'إنجازات جديدة' : 'New achievements'}
                    </div>
                  </div>
                </div>
              </div>

              <div
                className={`${
                  theme === 'dark'
                    ? 'bg-white/5 backdrop-blur-md border border-white/10'
                    : 'bg-white/10 backdrop-blur-sm'
                } rounded-2xl p-6 hover:bg-white/15 transition-all duration-300`}
              >
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <FontAwesomeIcon
                    icon={['fas', 'chart-bar']}
                    className="text-accent"
                  />
                  {language === 'ar' ? 'إحصائيات الأسبوع' : 'Weekly Stats'}
                </h3>
                <div className="space-y-4">
                  <div
                    className={`flex items-center ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'} justify-between`}
                  >
                    <span
                      className={`${theme === 'dark' ? 'text-white/70' : 'text-white/80'} flex items-center gap-2`}
                    >
                      <FontAwesomeIcon
                        icon={['fas', 'futbol']}
                        className="text-sm"
                      />
                      {language === 'ar' ? 'كرة القدم' : 'Football'}
                    </span>
                    <div
                      className={`flex items-center ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'} gap-3`}
                    >
                      <div
                        className={`w-20 h-2 ${theme === 'dark' ? 'bg-white/10' : 'bg-white/20'} rounded-full`}
                      >
                        <div className="w-3/4 h-full bg-accent rounded-full"></div>
                      </div>
                      <span className="text-sm font-semibold">75%</span>
                    </div>
                  </div>
                  <div
                    className={`flex items-center ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'} justify-between`}
                  >
                    <span
                      className={`${theme === 'dark' ? 'text-white/70' : 'text-white/80'} flex items-center gap-2`}
                    >
                      <FontAwesomeIcon
                        icon={['fas', 'running']}
                        className="text-sm"
                      />
                      {language === 'ar' ? 'الجري' : 'Running'}
                    </span>
                    <div
                      className={`flex items-center ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'} gap-3`}
                    >
                      <div
                        className={`w-20 h-2 ${theme === 'dark' ? 'bg-white/10' : 'bg-white/20'} rounded-full`}
                      >
                        <div className="w-1/2 h-full bg-success rounded-full"></div>
                      </div>
                      <span className="text-sm font-semibold">50%</span>
                    </div>
                  </div>
                  <div
                    className={`flex items-center ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'} justify-between`}
                  >
                    <span
                      className={`${theme === 'dark' ? 'text-white/70' : 'text-white/80'} flex items-center gap-2`}
                    >
                      <FontAwesomeIcon
                        icon={['fas', 'basketball-ball']}
                        className="text-sm"
                      />
                      {language === 'ar' ? 'كرة السلة' : 'Basketball'}
                    </span>
                    <div
                      className={`flex items-center ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'} gap-3`}
                    >
                      <div
                        className={`w-20 h-2 ${theme === 'dark' ? 'bg-white/10' : 'bg-white/20'} rounded-full`}
                      >
                        <div className="w-1/4 h-full bg-danger rounded-full"></div>
                      </div>
                      <span className="text-sm font-semibold">25%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Dashboard Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Challenges and Feeds */}
          <div className="lg:col-span-2 space-y-8">
            {/* Challenges Carousel */}
            <div
              className={`${theme === 'dark' ? 'bg-dark-bg border border-gray-700' : 'bg-white border border-gray-200'} rounded-2xl p-6 shadow-lg`}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-3">
                  <FontAwesomeIcon
                    icon={['fas', 'trophy']}
                    className="text-accent"
                  />
                  {t('dashboard.availableChallenges')}
                </h2>
                <div className="flex gap-2">
                  {mockChallenges.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentChallengeIndex(index)}
                      className={`w-3 h-3 rounded-full transition-colors ${
                        index === currentChallengeIndex
                          ? 'bg-primary'
                          : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="relative overflow-hidden rounded-xl">
                <div
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{
                    transform: `translateX(${language === 'ar' ? currentChallengeIndex : -currentChallengeIndex} * 100%)`,
                  }}
                >
                  {mockChallenges.map((challenge) => (
                    <div key={challenge.id} className="min-w-full">
                      <div className="relative">
                        <img
                          src={challenge.image}
                          alt={challenge.title}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent rounded-lg"></div>
                        <div className="absolute bottom-4 left-4 right-4 text-white">
                          <h3 className="text-xl font-bold mb-2">
                            {challenge.title}
                          </h3>
                          <p className="text-sm opacity-90 mb-3">
                            {challenge.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <span className="bg-accent text-dark px-3 py-1 rounded-full text-sm font-semibold">
                                {challenge.reward} {t('dashboard.pts')}
                              </span>
                              <span className="text-xs opacity-80">
                                {challenge.participants}{' '}
                                {t('dashboard.participants')}
                              </span>
                            </div>
                            <button className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg font-semibold transition-colors">
                              {t('dashboard.participate')}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Activity Feed */}
            <div className="space-y-6">
              {/* Create Post Section */}
              <div
                className={`${theme === 'dark' ? 'bg-dark-bg border border-gray-700' : 'bg-white border border-gray-200'} rounded-2xl p-6 shadow-lg`}
              >
                <div className={`flex items-center gap-4 ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'} mb-4`}>
                  <img
                    src={mockUserData.avatar}
                    alt={mockUserData.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div className="flex-1 relative">
                    <textarea
                      placeholder={language === 'ar' ? 'شاركنا رأيك، اقتراح لطلعة جديدة، أو أي شيء يخص المجتمع...' : 'Share your thoughts, suggest a new Tal3a, or anything related to the community...'}
                      className={`w-full p-4 ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-100'} rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-primary ${theme === 'dark' ? 'focus:bg-gray-600' : 'focus:bg-white'} transition-all`}
                      rows={3}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className={`flex items-center gap-4 ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <button className={`flex items-center gap-2 ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'} ${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-primary'} transition-colors`}>
                      <FontAwesomeIcon icon={['fas', 'camera']} />
                      <span className="text-sm">{language === 'ar' ? 'صورة' : 'Photo'}</span>
                    </button>
                    <button className={`flex items-center gap-2 ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'} ${theme === 'dark' ? 'text-gray-400 hover:text-accent' : 'text-gray-500 hover:text-accent'} transition-colors`}>
                      <FontAwesomeIcon icon={['fas', 'calendar-plus']} />
                      <span className="text-sm">{language === 'ar' ? 'طلعة جديدة' : 'New Tal3a'}</span>
                    </button>
                    <button className={`flex items-center gap-2 ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'} ${theme === 'dark' ? 'text-gray-400 hover:text-success' : 'text-gray-500 hover:text-success'} transition-colors`}>
                      <FontAwesomeIcon icon={['fas', 'square-poll-vertical']} />
                      <span className="text-sm">{language === 'ar' ? 'استطلاع' : 'Poll'}</span>
                    </button>
                  </div>
                  <button className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-full font-semibold transition-colors opacity-50 cursor-not-allowed" disabled>
                    {language === 'ar' ? 'نشر' : 'Post'}
                  </button>
                </div>
              </div>

              {/* Dynamic Posts from mockFeedActivities */}
              <div className="space-y-6">
                {/* Pinned Post - Show first activity as pinned */}
                {displayedActivities.length > 0 && (
                  <div className={`${theme === 'dark' ? 'bg-dark-bg border border-accent/30' : 'bg-white border border-accent/30'} rounded-2xl p-6 shadow-lg border-2`}>
                    <div className={`flex items-center gap-2 ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'} mb-4`}>
                      <FontAwesomeIcon icon={['fas', 'thumbtack']} className="text-accent" />
                      <span className="text-accent font-semibold text-sm">
                        {language === 'ar' ? 'منشور مثبت' : 'Pinned Post'}
                      </span>
                    </div>
                    
                    {/* Use first activity as pinned post */}
                    <div className={`flex items-center gap-3 ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'} mb-4`}>
                      <img
                        src={displayedActivities[0].user.avatar}
                        alt={displayedActivities[0].user.name}
                        className="w-12 h-12 rounded-full"
                      />
                      <div className="flex-1">
                        <div className={`flex items-center gap-2 ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
                          <h4 className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-secondary'}`}>
                            {displayedActivities[0].user.name}
                          </h4>
                          <FontAwesomeIcon icon={['fas', 'crown']} className="text-accent text-sm" title={language === 'ar' ? 'مؤسس المجموعة' : 'Group Founder'} />
                          <span className="bg-primary text-white text-xs px-2 py-1 rounded-full">
                            {language === 'ar' ? 'مؤسس' : 'Founder'}
                          </span>
                        </div>
                        <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} text-sm`}>
                          {displayedActivities[0].time}
                        </p>
                      </div>
                    </div>

                    {displayedActivities[0].content && (
                      <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-secondary'} mb-4`}>
                        {displayedActivities[0].content}
                      </p>
                    )}

                    <div className="flex items-center justify-between">
                      <div className={`flex items-center gap-6 ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
                        <button className="flex items-center gap-2 text-primary">
                          <FontAwesomeIcon icon={['fas', 'heart']} />
                          <span className="text-sm">{displayedActivities[0].likes}</span>
                        </button>
                        <button className={`flex items-center gap-2 ${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-secondary'} transition-colors`}>
                          <FontAwesomeIcon icon={['fas', 'comment']} />
                          <span className="text-sm">{displayedActivities[0].comments}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Regular Posts - Skip first one since it's pinned */}
                {displayedActivities.slice(1, showAllActivities ? displayedActivities.length : 4).map((activity) => (
                  <div
                    key={activity.id}
                    className={`${theme === 'dark' ? 'bg-dark-bg border border-gray-700' : 'bg-white border border-gray-200'} rounded-2xl p-6 shadow-lg`}
                  >
                    {/* Post Header */}
                    <div className={`flex items-center gap-3 ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'} mb-4`}>
                      <img
                        src={activity.user.avatar}
                        alt={activity.user.name}
                        className="w-12 h-12 rounded-full"
                      />
                      <div className="flex-1">
                        <div className={`flex items-center gap-2 ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
                          <h4 className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-secondary'}`}>
                            {activity.user.name}
                          </h4>
                          <span className="text-sm text-primary font-medium">
                            {activity.activity}
                          </span>
                          {/* Source badge */}
                          <div className="flex items-center gap-1">
                            <FontAwesomeIcon
                              icon={getSourceIcon(activity.source) as any}
                              className="text-xs"
                            />
                            <span className="text-xs opacity-70">{activity.source}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm opacity-70">
                          <span>{activity.time}</span>
                          {activity.location && (
                            <>
                              <span>•</span>
                              <FontAwesomeIcon icon={['fas', 'map-marker-alt']} className="text-xs" />
                              <span>{activity.location}</span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="relative">
                        <button className={`${theme === 'dark' ? 'text-gray-400 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'} p-1`}>
                          <FontAwesomeIcon icon={['fas', 'ellipsis']} />
                        </button>
                      </div>
                    </div>

                    {/* Post Content */}
                    {activity.content && (
                      <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-secondary'} mb-4`}>
                        {activity.content}
                      </p>
                    )}

                    {/* Special Content Blocks */}
                    {(activity.type === 'points_earned' || activity.type === 'challenge_completed') &&
                      'points' in activity && activity.points && (
                        <div className="mb-4">
                          <span className="bg-success text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 w-fit">
                            <FontAwesomeIcon icon={['fas', 'trophy']} />
                            +{activity.points} {t('dashboard.points')}
                          </span>
                        </div>
                      )}

                    {activity.type === 'achievement_unlocked' && 'achievement' in activity && (
                      <div className={`mb-4 p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'} border-l-4 border-accent`}>
                        <div className="flex items-center gap-2">
                          <FontAwesomeIcon
                            icon={['fas', activity.achievement.icon as any]}
                            className="text-accent"
                          />
                          <span className="font-semibold">{activity.achievement.name}</span>
                          <span className="text-sm opacity-70">+{activity.achievement.points} {t('dashboard.points')}</span>
                        </div>
                      </div>
                    )}

                    {activity.type === 'workout_completed' && 'workout' in activity && (
                      <div className={`mb-4 p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                        <div className="grid grid-cols-3 gap-3 text-center text-sm">
                          <div>
                            <div className="font-semibold">{activity.workout.duration}</div>
                            <div className="opacity-70">{language === 'ar' ? 'المدة' : 'Duration'}</div>
                          </div>
                          <div>
                            <div className="font-semibold">{activity.workout.calories}</div>
                            <div className="opacity-70">{language === 'ar' ? 'سعرة' : 'Calories'}</div>
                          </div>
                          <div>
                            <div className="font-semibold">{activity.workout.type}</div>
                            <div className="opacity-70">{language === 'ar' ? 'النوع' : 'Type'}</div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Post Image */}
                    {activity.image && (
                      <div className="relative mb-4">
                        <img
                          className="w-full h-64 object-cover rounded-xl"
                          src={activity.image}
                          alt=""
                        />
                      </div>
                    )}

                    {/* Post Actions */}
                    <div className="flex items-center justify-between">
                      <div className={`flex items-center gap-6 ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
                        <button
                          onClick={() => handleLikePost(activity.id)}
                          className={`flex items-center gap-2 ${
                            likedPosts.includes(activity.id) || activity.isLiked
                              ? 'text-primary'
                              : `${theme === 'dark' ? 'text-gray-400 hover:text-primary' : 'text-gray-500 hover:text-primary'}`
                          } transition-colors`}
                        >
                          <FontAwesomeIcon 
                            icon={
                              likedPosts.includes(activity.id) || activity.isLiked
                                ? ['fas', 'heart']
                                : ['far', 'heart']
                            }
                          />
                          <span className="text-sm">{activity.likes}</span>
                        </button>
                        <button className={`flex items-center gap-2 ${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-secondary'} transition-colors`}>
                          <FontAwesomeIcon icon={['fas', 'comment']} />
                          <span className="text-sm">{activity.comments}</span>
                        </button>
                        <button className={`flex items-center gap-2 ${theme === 'dark' ? 'text-gray-400 hover:text-accent' : 'text-gray-500 hover:text-accent'} transition-colors`}>
                          <FontAwesomeIcon icon={['fas', 'share']} />
                          <span className="text-sm">{activity.shares}</span>
                        </button>
                      </div>
                      {(activity.type === 'points_earned' || activity.type === 'challenge_completed') &&
                        'points' in activity && activity.points && (
                          <div className="flex items-center text-accent text-sm">
                            <FontAwesomeIcon icon={['fas', 'coins']} className={`${language === 'ar' ? 'ml-1' : 'mr-1'}`} />
                            <span>+{activity.points} {language === 'ar' ? 'نقطة' : 'points'}</span>
                          </div>
                        )}
                    </div>

                    {/* Comment Input */}
                    <div className={`flex items-center gap-3 ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'} mt-4 pt-4 ${theme === 'dark' ? 'border-gray-700' : 'border-gray-100'} border-t`}>
                      <img
                        src={mockUserData.avatar}
                        alt={mockUserData.name}
                        className="w-8 h-8 rounded-full"
                      />
                      <div className="flex-1 relative">
                        <input
                          type="text"
                          placeholder={language === 'ar' ? 'اكتب تعليق...' : 'Write a comment...'}
                          className={`w-full py-2 px-4 ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-100'} rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary ${theme === 'dark' ? 'focus:bg-gray-600' : 'focus:bg-white'} transition-all`}
                        />
                        <button className={`absolute ${language === 'ar' ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 text-primary hover:text-primary/80 transition-colors`}>
                          <FontAwesomeIcon icon={['fas', 'paper-plane']} className="text-sm" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Show More/Less Button */}
                {displayedActivities.length > 3 && (
                  <button
                    onClick={() => setShowAllActivities(!showAllActivities)}
                    className="w-full mt-4 py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-primary hover:text-primary transition-colors"
                  >
                    {showAllActivities
                      ? t('dashboard.showLess')
                      : t('dashboard.viewMoreActivities')}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Suggested Content */}
          <div className="space-y-6">
            {/* Points & Achievements */}
            <div
              className={`${theme === 'dark' ? 'bg-dark-bg border border-gray-700' : 'bg-white border border-gray-200'} rounded-2xl p-6 shadow-lg`}
            >
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <FontAwesomeIcon
                  icon={['fas', 'medal']}
                  className="text-accent"
                />
                {t('dashboard.pointsAndAchievements')}
              </h3>

              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">
                    {mockUserData.stats.totalPoints.toLocaleString()}
                  </div>
                  <div className="text-sm opacity-70">
                    {t('dashboard.totalPoints')}
                  </div>
                </div>

                <div
                  className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <FontAwesomeIcon
                      icon={['fas', 'fire']}
                      className="text-orange-500"
                    />
                    <span className="font-semibold">
                      {t('dashboard.activityStreak')}
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-orange-500">
                    7 {t('dashboard.days')}
                  </div>
                </div>

                <div
                  className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <FontAwesomeIcon
                      icon={['fas', 'bullseye']}
                      className="text-blue-500"
                    />
                    <span className="font-semibold">
                      {t('dashboard.weeklyGoal')}
                    </span>
                  </div>
                  <div className="w-full bg-gray-300 rounded-full h-2 mb-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: '75%' }}
                    ></div>
                  </div>
                  <div className="text-sm opacity-70">
                    3/4 {t('dashboard.tal3aat')}
                  </div>
                </div>
              </div>
            </div>

            {/* Suggested Groups */}
            <div
              className={`${theme === 'dark' ? 'bg-dark-bg border border-gray-700' : 'bg-white border border-gray-200'} rounded-2xl p-6 shadow-lg`}
            >
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <FontAwesomeIcon
                  icon={['fas', 'users']}
                  className="text-primary"
                />
                {t('dashboard.suggestedGroups')}
              </h3>

              <div className="space-y-3">
                {[
                  {
                    name: 'كرة قدم القاهرة الجديدة',
                    members: 124,
                    sport: 'football',
                  },
                  {
                    name: 'جري الزمالك الصباحي',
                    members: 89,
                    sport: 'running',
                  },
                  { name: 'تنس المعادي', members: 45, sport: 'tennis' },
                ].map((group, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'} border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FontAwesomeIcon
                          icon={getSportIcon(group.sport) as any}
                          className="text-primary"
                        />
                        <div>
                          <div className="font-semibold text-sm">
                            {group.name}
                          </div>
                          <div className="text-xs opacity-70">
                            {group.members} {t('dashboard.members')}
                          </div>
                        </div>
                      </div>
                      <button className="text-primary hover:text-primary-dark text-sm font-semibold">
                        {t('dashboard.join')}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Incoming Tal3aat */}
            <div
              className={`${theme === 'dark' ? 'bg-dark-bg border border-gray-700' : 'bg-white border border-gray-200'} rounded-2xl p-6 shadow-lg`}
            >
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <FontAwesomeIcon
                  icon={['fas', 'bell']}
                  className="text-accent"
                />
                {t('dashboard.upcomingTal3aat')}
              </h3>

              <div className="space-y-3">
                {[
                  {
                    title: 'مباراة كرة قدم',
                    time: 'اليوم 6:00 م',
                    location: 'ملعب الأهلي',
                  },
                  {
                    title: 'جري صباحي',
                    time: 'غداً 7:00 ص',
                    location: 'كورنيش النيل',
                  },
                  {
                    title: 'تنس طاولة',
                    time: 'الجمعة 8:00 م',
                    location: 'نادي الجزيرة',
                  },
                ].map((tal3a, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'} border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}
                  >
                    <div className="font-semibold text-sm mb-1">
                      {tal3a.title}
                    </div>
                    <div className="text-xs opacity-70 mb-1">{tal3a.time}</div>
                    <div className="text-xs opacity-70">{tal3a.location}</div>
                  </div>
                ))}
              </div>

              <button className="w-full mt-4 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors">
                {t('dashboard.viewAllTal3aat')}
              </button>
            </div>

            {/* Recent Achievements */}
            <div
              className={`${theme === 'dark' ? 'bg-dark-bg border border-gray-700' : 'bg-white border border-gray-200'} rounded-2xl p-6 shadow-lg`}
            >
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <FontAwesomeIcon
                  icon={['fas', 'trophy']}
                  className="text-accent"
                />
                {language === 'ar' ? 'إنجازات حديثة' : 'Recent Achievements'}
              </h3>

              <div className="space-y-3">
                {[
                  {
                    title:
                      language === 'ar'
                        ? 'أول تحدٍ مكتمل'
                        : 'First Challenge Complete',
                    points: 100,
                    icon: 'trophy',
                    color: 'text-yellow-500',
                  },
                  {
                    title: language === 'ar' ? 'عضو نشط' : 'Active Member',
                    points: 50,
                    icon: 'star',
                    color: 'text-blue-500',
                  },
                  {
                    title:
                      language === 'ar' ? 'صانع مجتمع' : 'Community Builder',
                    points: 75,
                    icon: 'users',
                    color: 'text-green-500',
                  },
                ].map((achievement, index) => (
                  <div
                    key={index}
                    className={`flex items-center gap-3 p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'} border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}
                  >
                    <div
                      className={`w-10 h-10 ${theme === 'dark' ? 'bg-gray-700' : 'bg-white'} rounded-full flex items-center justify-center`}
                    >
                      <FontAwesomeIcon
                        icon={['fas', achievement.icon as any]}
                        className={achievement.color}
                      />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-sm">
                        {achievement.title}
                      </div>
                      <div className="text-xs opacity-70">
                        +{achievement.points} {t('dashboard.points')}
                      </div>
                    </div>
                    <FontAwesomeIcon
                      icon={['fas', 'check-circle']}
                      className="text-success"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Weather Widget */}
            <div
              className={`${theme === 'dark' ? 'bg-gradient-to-br from-blue-900 to-blue-800' : 'bg-gradient-to-br from-blue-400 to-blue-600'} text-white rounded-2xl p-6 shadow-lg`}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <FontAwesomeIcon
                    icon={['fas', 'cloud-sun']}
                    className="text-yellow-300"
                  />
                  {language === 'ar' ? 'الطقس' : 'Weather'}
                </h3>
                <div className="text-right">
                  <div className="text-2xl font-bold">28°C</div>
                  <div className="text-sm opacity-80">
                    {language === 'ar' ? 'القاهرة' : 'Cairo'}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold">
                    {language === 'ar' ? 'مشمس جزئياً' : 'Partly Sunny'}
                  </div>
                  <div className="text-sm opacity-80">
                    {language === 'ar'
                      ? 'مناسب للأنشطة الخارجية'
                      : 'Perfect for outdoor activities'}
                  </div>
                </div>
                <FontAwesomeIcon
                  icon={['fas', 'sun']}
                  className="text-3xl text-yellow-300"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Action Bar for Mobile */}
        <div
          className={`lg:hidden fixed bottom-0 left-0 right-0 ${
            theme === 'dark'
              ? 'bg-dark-bg border-gray-700 shadow-lg shadow-gray-900/50'
              : 'bg-white border-gray-200 shadow-lg'
          } border-t p-4 z-50 backdrop-blur-sm`}
        >
          <div className="flex justify-around">
            <button className="flex flex-col items-center gap-1 text-primary hover:text-primary-dark transition-colors">
              <FontAwesomeIcon
                icon={['fas', 'plus-circle']}
                className="text-xl"
              />
              <span className="text-xs font-medium">
                {language === 'ar' ? 'إنشاء' : 'Create'}
              </span>
            </button>
            <button
              className={`flex flex-col items-center gap-1 ${
                theme === 'dark'
                  ? 'text-gray-400 hover:text-white'
                  : 'text-gray-500 hover:text-gray-700'
              } transition-colors`}
            >
              <FontAwesomeIcon icon={['fas', 'search']} className="text-xl" />
              <span className="text-xs font-medium">
                {language === 'ar' ? 'بحث' : 'Search'}
              </span>
            </button>
            <button
              className={`flex flex-col items-center gap-1 ${
                theme === 'dark'
                  ? 'text-gray-400 hover:text-white'
                  : 'text-gray-500 hover:text-gray-700'
              } transition-colors`}
            >
              <FontAwesomeIcon
                icon={['fas', 'map-marker-alt']}
                className="text-xl"
              />
              <span className="text-xs font-medium">
                {language === 'ar' ? 'خريطة' : 'Map'}
              </span>
            </button>
            <button
              className={`flex flex-col items-center gap-1 ${
                theme === 'dark'
                  ? 'text-gray-400 hover:text-white'
                  : 'text-gray-500 hover:text-gray-700'
              } transition-colors`}
            >
              <FontAwesomeIcon icon={['fas', 'bell']} className="text-xl" />
              <span className="text-xs font-medium">
                {language === 'ar' ? 'إشعارات' : 'Notifications'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
