import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faComment,
  faHeart,
  faPaperPlane,
} from '@fortawesome/free-solid-svg-icons'
import { faHeart as fasHeart } from '@fortawesome/free-regular-svg-icons'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import { useAppContext } from '@/contexts/AppProvider'

// Activity interfaces (matching the main dashboard)
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

interface ActivityFeedProps {
  activities: Array<ActivityType>
  showAllActivities: boolean
  onToggleShowAll: () => void
  likedPosts: Array<number>
  onLikePost: (postId: number) => void
  onOpenComments: (post: ActivityType) => void
}

export default function ActivityFeed({
  activities,
  showAllActivities,
  onToggleShowAll,
  likedPosts,
  onLikePost,
  onOpenComments,
}: ActivityFeedProps) {
  const { language } = useAppContext()
  const { t } = useTranslation()
  const [newComment, setNewComment] = useState('')

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'App':
      case 'Tal3a App':
        return ['fas', 'mobile-alt']
      case 'Website':
        return ['fas', 'globe']
      case 'Instagram':
        return ['fab', 'instagram']
      case 'Facebook':
        return ['fab', 'facebook']
      case 'Twitter':
        return ['fab', 'twitter']
      case 'WhatsApp':
        return ['fab', 'whatsapp']
      case 'Telegram':
        return ['fab', 'telegram']
      case 'Strava':
        return ['fas', 'running']
      case 'MyFitnessPal':
        return ['fas', 'dumbbell']
      default:
        return ['fas', 'share']
    }
  }

  const handleSendComment = () => {
    if (!newComment.trim()) return
    // Handle comment sending logic here
    setNewComment('')
  }

  const displayedActivities = showAllActivities
    ? activities
    : activities.slice(1, 4)

  return (
    <div className="space-y-6">
      <div className="space-y-6">
        {displayedActivities.map((activity) => (
          <div
            key={activity.id}
            className="bg-white dark:bg-dark-bg border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-lg"
          >
            {/* Post Header */}
            <div
              className={`flex items-center gap-3 ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'} mb-4`}
            >
              <img
                src={activity.user.avatar}
                alt={activity.user.name}
                className="w-12 h-12 rounded-full"
              />
              <div className="flex-1">
                <div
                  className={`flex flex-col ${language === 'ar' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`flex items-center gap-2 ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}
                  >
                    <h4 className="font-bold text-secondary dark:text-white">
                      {activity.user.name}
                    </h4>
                    <span className="text-sm text-primary font-medium">
                      {activity.activity}
                    </span>
                  </div>

                  {/* Group info */}
                  {activity.group && (
                    <div
                      className={`flex items-center gap-2 mt-1 ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}
                    >
                      <FontAwesomeIcon
                        icon={['fas', 'arrow-right']}
                        className={`text-xs text-gray-400 ${language === 'ar' ? 'rotate-180' : ''}`}
                      />
                      {activity.group.avatar && (
                        <img
                          src={activity.group.avatar}
                          alt={activity.group.name}
                          className="w-4 h-4 rounded-full"
                        />
                      )}
                      <span className="text-sm text-gray-600 hover:underline cursor-pointer">
                        {activity.group.name}
                      </span>
                    </div>
                  )}

                  {/* Source badge */}
                  <div
                    className={`flex items-center gap-1 mt-1 ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}
                  >
                    <FontAwesomeIcon
                      icon={getSourceIcon(activity.source) as any}
                      className="text-xs text-gray-400"
                    />
                    <span className="text-xs opacity-70 text-gray-500">
                      {activity.source}
                    </span>
                    <span className="text-xs opacity-70 text-gray-500">•</span>
                    <span className="text-xs opacity-70 text-gray-500">
                      {activity.time}
                    </span>
                    {activity.location && (
                      <>
                        <span className="text-xs opacity-70 text-gray-500">
                          •
                        </span>
                        <FontAwesomeIcon
                          icon={['fas', 'map-marker-alt']}
                          className="text-xs text-gray-400"
                        />
                        <span className="text-xs opacity-70 text-gray-500">
                          {activity.location}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="relative">
                <button className="text-gray-400 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1">
                  <FontAwesomeIcon icon={['fas', 'ellipsis']} />
                </button>
              </div>
            </div>

            {/* Post Content */}
            {activity.content && (
              <p className="text-secondary dark:text-gray-300 mb-4">
                {activity.content}
              </p>
            )}

            {/* Special Content Blocks */}
            {(activity.type === 'points_earned' ||
              activity.type === 'challenge_completed') &&
              activity.points && (
                <div className="mb-4">
                  <span className="bg-success text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 w-fit">
                    <FontAwesomeIcon icon={['fas', 'trophy']} />+
                    {activity.points} {t('dashboard.points')}
                  </span>
                </div>
              )}

            {activity.type === 'achievement_unlocked' && (
              <div className="mb-4 p-3 rounded-lg bg-gray-100 dark:bg-gray-700 border-l-4 border-accent">
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon
                    icon={['fas', activity.achievement.icon as any]}
                    className="text-accent"
                  />
                  <span className="font-semibold">
                    {activity.achievement.name}
                  </span>
                  <span className="text-sm opacity-70">
                    +{activity.achievement.points} {t('dashboard.points')}
                  </span>
                </div>
              </div>
            )}

            {activity.type === 'workout_completed' && (
              <div className="mb-4 p-3 rounded-lg bg-gray-100 dark:bg-gray-700">
                <div className="grid grid-cols-3 gap-3 text-center text-sm">
                  <div>
                    <div className="font-semibold">
                      {activity.workout.duration}
                    </div>
                    <div className="opacity-70">{t('dashboard.duration')}</div>
                  </div>
                  <div>
                    <div className="font-semibold">
                      {activity.workout.calories}
                    </div>
                    <div className="opacity-70">{t('dashboard.calories')}</div>
                  </div>
                  <div>
                    <div className="font-semibold">{activity.workout.type}</div>
                    <div className="opacity-70">{t('dashboard.type')}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Post Image */}
            {activity.image && (
              <div className="relative mb-4">
                <img
                  className="w-full max-h-[40rem] object-cover rounded-xl"
                  src={activity.image}
                  alt=""
                />
              </div>
            )}

            {/* Post Actions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center justify-center gap-3 rtl:space-x-reverse">
                <button
                  onClick={() => onLikePost(activity.id)}
                  className={`flex items-center space-x-2 rtl:space-x-reverse ${
                    likedPosts.includes(activity.id) || activity.isLiked
                      ? 'text-primary'
                      : 'text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary'
                  } transition-colors`}
                >
                  <FontAwesomeIcon
                    className="mx-1"
                    icon={
                      likedPosts.includes(activity.id) || activity.isLiked
                        ? faHeart
                        : fasHeart
                    }
                  />
                  <span className="text-sm">{activity.likes}</span>
                </button>
                <button
                  onClick={() => onOpenComments(activity)}
                  className="flex items-center space-x-2 rtl:space-x-reverse text-gray-500 dark:text-gray-400 hover:text-secondary dark:hover:text-white transition-colors"
                >
                  <FontAwesomeIcon icon={faComment} className="mx-1" />
                  <span className="text-sm">{activity.comments}</span>
                </button>
              </div>
              {(activity.type === 'points_earned' ||
                activity.type === 'challenge_completed') &&
                activity.points && (
                  <div className="flex items-center text-accent text-sm">
                    <FontAwesomeIcon
                      icon={['fas', 'coins']}
                      className={`${language === 'ar' ? 'ml-1' : 'mr-1'}`}
                    />
                    <span>
                      +{activity.points} {t('dashboard.points')}
                    </span>
                  </div>
                )}
            </div>

            {/* Comment Input Section */}
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div
                className={`flex items-center gap-3 ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <img
                  src="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-1.jpg"
                  alt="Current User"
                  className="w-8 h-8 rounded-full flex-shrink-0"
                />
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSendComment()
                      }
                    }}
                    placeholder={t('dashboard.writeComment')}
                    className="w-full py-3 px-4 bg-gray-100 dark:bg-gray-700 text-secondary dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  />
                  <button
                    onClick={handleSendComment}
                    className={`absolute ${language === 'ar' ? 'left-3' : 'right-3'} top-1/2 transform -translate-y-1/2 text-primary hover:text-primary/80 transition-colors disabled:opacity-50`}
                    disabled={!newComment.trim()}
                  >
                    <FontAwesomeIcon icon={faPaperPlane} className="text-sm" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Show More/Less Button */}
        {activities.length > 3 && (
          <button
            onClick={onToggleShowAll}
            className="w-full mt-4 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl text-gray-500 dark:text-gray-400 hover:border-primary hover:text-primary transition-colors"
          >
            {showAllActivities
              ? t('dashboard.showLess')
              : t('dashboard.viewMoreActivities')}
          </button>
        )}
      </div>
    </div>
  )
}
