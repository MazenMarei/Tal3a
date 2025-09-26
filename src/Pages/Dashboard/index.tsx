import { useState } from 'react'

// Import all the new components
import ActivityFeed from './ActivityFeed'
import ChallengesCarousel from './ChallengesCarousel'
import CommentModal from './CommentModal'
import MobileActionBar from './MobileActionBar'
import RecentAchievements from './RecentAchievements'
import RecommendedTal3a from './RecommendedTal3a'
import SuggestedGroups from './SuggestedGroups'
import UpcomingTal3aat from './UpcomingTal3aat'
import WeatherWidget from './WeatherWidget'
import WelcomeHeader from './WlecomeHeader'
import { useAppContext } from '@/contexts/AppProvider'

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
  group?: {
    name: string
    avatar?: string
  }
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

// Comment interfaces
interface Comment {
  id: number
  user: {
    name: string
    avatar: string
  }
  content: string
  time: string
  timestamp: string
  likes: number
  isLiked: boolean
  replies?: Array<Reply>
}

interface Reply {
  id: number
  user: {
    name: string
    avatar: string
  }
  content: string
  time: string
  timestamp: string
  likes: number
  isLiked: boolean
}

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
    group: {
      name: 'مجموعة تنس الجزيرة',
      avatar:
        'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=40&h=40&fit=crop',
    },
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
    group: {
      name: 'مجموعة عدائي القاهرة',
      avatar:
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=40&h=40&fit=crop',
    },
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

// Recommended Tal3a mock data
const mockRecommendedTal3a = [
  {
    id: 1,
    title: 'ماتش ودي',
    category: 'كرة قدم',
    location: 'ملعب الأهلي - الجيزة',
    date: 'غداً 6:00 م',
    participants: 8,
    maxParticipants: 12,
    participantAvatars: [
      'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-2.jpg',
      'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-3.jpg',
      'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-4.jpg',
    ],
    gradient: 'from-green-500 to-green-600',
    color: 'green',
  },
  {
    id: 2,
    title: 'جري الصباح',
    category: 'جري',
    location: 'كورنيش النيل - الزمالك',
    date: 'السبت 7:00 ص',
    participants: 3,
    maxParticipants: 8,
    participantAvatars: [
      'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-5.jpg',
      'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-6.jpg',
      'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-7.jpg',
    ],
    gradient: 'from-purple-500 to-purple-600',
    color: 'purple',
  },
  {
    id: 3,
    title: 'يوجا المساء',
    category: 'يوجا',
    location: 'حديقة الأزهر',
    date: 'الأحد 6:00 م',
    participants: 6,
    maxParticipants: 10,
    participantAvatars: [
      'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-1.jpg',
      'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-5.jpg',
      'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-6.jpg',
    ],
    gradient: 'from-pink-500 to-pink-600',
    color: 'pink',
    isWomenOnly: true,
  },
]

// Mock comments data - organized by activity ID
const mockComments: Record<number, Array<Comment> | undefined> = {
  1: [
    {
      id: 1,
      user: {
        name: 'سلمى أحمد',
        avatar:
          'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-5.jpg',
      },
      content: 'فكرة ممتازة! أنا جاهزة 💪',
      time: 'منذ ساعة',
      timestamp: '2025-09-22T13:25:00Z',
      likes: 5,
      isLiked: false,
      replies: [
        {
          id: 11,
          user: {
            name: 'سارة أحمد',
            avatar:
              'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face',
          },
          content: 'شكراً! هنشوفك هناك 🎾',
          time: 'منذ 50 دقيقة',
          timestamp: '2025-09-22T13:35:00Z',
          likes: 2,
          isLiked: true,
        },
      ],
    },
    {
      id: 2,
      user: {
        name: 'كريم عادل',
        avatar:
          'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-9.jpg',
      },
      content: 'النادي ده جميل بس الملاعب مشغولة كتير',
      time: 'منذ 45 دقيقة',
      timestamp: '2025-09-22T13:40:00Z',
      likes: 3,
      isLiked: false,
    },
    {
      id: 3,
      user: {
        name: 'مريم محمد',
        avatar:
          'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-8.jpg',
      },
      content: 'عندي راكيت زيادة لو حد محتاج',
      time: 'منذ 30 دقيقة',
      timestamp: '2025-09-22T13:55:00Z',
      likes: 7,
      isLiked: true,
    },
  ],
  2: [
    {
      id: 4,
      user: {
        name: 'أحمد حسن',
        avatar:
          'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-3.jpg',
      },
      content: 'مبروك! إنجاز رائع 🏃‍♂️',
      time: 'منذ 10 دقائق',
      timestamp: '2025-09-22T14:05:00Z',
      likes: 12,
      isLiked: false,
    },
    {
      id: 5,
      user: {
        name: 'فاطمة علي',
        avatar:
          'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-7.jpg',
      },
      content: 'شجعتني أبدأ الجري! أي نصايح للمبتدئين؟',
      time: 'منذ 5 دقائق',
      timestamp: '2025-09-22T14:10:00Z',
      likes: 4,
      isLiked: true,
      replies: [
        {
          id: 12,
          user: {
            name: 'محمد علي',
            avatar:
              'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face',
          },
          content: 'ابدئي تدريجي، 10 دقائق كل يوم وزودي شوية بشوية',
          time: 'منذ دقيقتين',
          timestamp: '2025-09-22T14:13:00Z',
          likes: 8,
          isLiked: false,
        },
      ],
    },
  ],
}

export default function DashboardPage() {
  const { language } = useAppContext()

  // State management
  const [showAllActivities, setShowAllActivities] = useState(false)
  const [likedPosts, setLikedPosts] = useState<Array<number>>([2, 5, 7])

  // Comment modal state
  const [isCommentPopupOpen, setIsCommentPopupOpen] = useState(false)
  const [selectedPost, setSelectedPost] = useState<ActivityType | null>(null)
  const [displayedComments, setDisplayedComments] = useState<Array<Comment>>([])
  const [showAllComments, setShowAllComments] = useState(false)
  const [likedComments, setLikedComments] = useState<Array<number>>([5, 12])

  // Get activities to display
  const allActivities = [...mockFeedActivities, ...additionalActivities]

  // Event handlers
  const handleLikePost = (postId: number) => {
    setLikedPosts((prev) =>
      prev.includes(postId)
        ? prev.filter((id) => id !== postId)
        : [...prev, postId],
    )
  }

  const handleOpenComments = (post: ActivityType) => {
    setSelectedPost(post)
    const postComments = mockComments[post.id] ?? []
    const initialComments = showAllComments
      ? postComments
      : postComments.slice(0, 3)
    setDisplayedComments(initialComments)
    setIsCommentPopupOpen(true)
  }

  const handleCloseComments = () => {
    setIsCommentPopupOpen(false)
    setSelectedPost(null)
    setDisplayedComments([])
    setShowAllComments(false)
  }

  const handleLoadMoreComments = () => {
    if (selectedPost) {
      const allComments = mockComments[selectedPost.id] ?? []
      setDisplayedComments(allComments)
      setShowAllComments(true)
    }
  }

  const handleLikeComment = (commentId: number) => {
    setLikedComments((prev) =>
      prev.includes(commentId)
        ? prev.filter((id) => id !== commentId)
        : [...prev, commentId],
    )
  }

  const handleSendComment = (content: string) => {
    if (!content.trim() || !selectedPost) return

    const newCommentObj: Comment = {
      id: Date.now(),
      user: {
        name: 'You',
        avatar: '/public/logo.png',
      },
      content: content,
      time: 'now',
      timestamp: new Date().toISOString(),
      likes: 0,
      isLiked: false,
      replies: [],
    }

    setDisplayedComments((prev) => [...prev, newCommentObj])
  }

  const handleToggleShowAll = () => {
    setShowAllActivities(!showAllActivities)
  }

  // Mobile action handlers
  const handleMobileActions = {
    create: () => console.log('Create clicked'),
    search: () => console.log('Search clicked'),
    map: () => console.log('Map clicked'),
    notifications: () => console.log('Notifications clicked'),
  }

  return (
    <div
      className="min-h-screen bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text font-cairo"
      dir={language === 'ar' ? 'rtl' : 'ltr'}
    >
      <div className="container mx-auto px-4 py-6 pb-24 lg:pb-6 max-w-7xl">
        {/* Welcome Header Section */}
        <WelcomeHeader mockUserData={mockUserData} />

        {/* Main Dashboard Grid */}
        <div className="grid lg:grid-cols-3 gap-8 justify-center">
          {/* Left Column - Challenges and Feeds */}
          <div className="lg:col-span-2 space-y-8">
            {/* Challenges Carousel */}
            <ChallengesCarousel mockChallenges={mockChallenges} />

            {/* Recommended Tal3a Section */}
            <RecommendedTal3a mockRecommendedTal3a={mockRecommendedTal3a} />

            {/* Activity Feed */}
            <ActivityFeed
              activities={allActivities}
              showAllActivities={showAllActivities}
              onToggleShowAll={handleToggleShowAll}
              likedPosts={likedPosts}
              onLikePost={handleLikePost}
              onOpenComments={handleOpenComments}
            />
          </div>

          {/* Right Column - Suggested Content */}
          <div className="space-y-6">
            {/* Suggested Groups */}
            <SuggestedGroups />

            {/* Upcoming Tal3aat */}
            <UpcomingTal3aat />

            {/* Recent Achievements */}
            <RecentAchievements />

            {/* Weather Widget */}
            <WeatherWidget />
          </div>
        </div>

        {/* Mobile Action Bar */}
        <MobileActionBar
          onCreateClick={handleMobileActions.create}
          onSearchClick={handleMobileActions.search}
          onMapClick={handleMobileActions.map}
          onNotificationsClick={handleMobileActions.notifications}
        />
      </div>

      {/* Comment Modal */}
      <CommentModal
        isOpen={isCommentPopupOpen}
        post={selectedPost}
        comments={displayedComments}
        showAllComments={showAllComments}
        likedPosts={likedPosts}
        likedComments={likedComments}
        onClose={handleCloseComments}
        onLoadMore={handleLoadMoreComments}
        onLikePost={handleLikePost}
        onLikeComment={handleLikeComment}
        onSendComment={handleSendComment}
      />
    </div>
  )
}
