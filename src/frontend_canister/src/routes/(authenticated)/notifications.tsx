import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBell,
  faCalendar,
  faCheck,
  faCheckCircle,
  faGift,
  faInfoCircle,
  faTrash,
} from '@fortawesome/free-solid-svg-icons'

// Mock notifications data
const mockNotifications = [
  {
    id: 1,
    type: 'group_invitation',
    title: 'دعوة للانضمام إلى مجموعة',
    message: 'دعاك أحمد محمد للانضمام إلى مجموعة "فريق كرة القدم الأهلي"',
    timestamp: '2024-01-15T10:30:00Z',
    read: false,
    avatar:
      'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-1.jpg',
    actionButtons: ['accept', 'decline'],
  },
  {
    id: 2,
    type: 'event_reminder',
    title: 'تذكير بحدث قادم',
    message: 'لديك مباراة كرة قدم في الحديقة المركزية غداً الساعة 5:00 مساءً',
    timestamp: '2024-01-15T09:15:00Z',
    read: false,
    icon: faCalendar,
    color: 'text-blue-600',
  },
  {
    id: 3,
    type: 'achievement',
    title: 'إنجاز جديد!',
    message:
      'تهانينا! لقد أكملت 10 طلعات رياضية وحصلت على شارة "الرياضي النشط"',
    timestamp: '2024-01-14T18:45:00Z',
    read: true,
    icon: faCheckCircle,
    color: 'text-green-600',
  },
  {
    id: 4,
    type: 'promotion',
    title: 'عرض خاص',
    message: 'خصم 20% على جميع الأدوات الرياضية في متجر سبورت زون',
    timestamp: '2024-01-14T14:20:00Z',
    read: true,
    icon: faGift,
    color: 'text-pink-600',
  },
  {
    id: 5,
    type: 'system',
    title: 'تحديث النظام',
    message: 'تم تحديث التطبيق بميزات جديدة. تحقق من قسم الخريطة للاستكشاف',
    timestamp: '2024-01-13T12:00:00Z',
    read: true,
    icon: faInfoCircle,
    color: 'text-gray-600',
  },
  {
    id: 6,
    type: 'group_activity',
    title: 'نشاط المجموعة',
    message: 'محمد علي نشر منشوراً جديداً في مجموعة "عشاق الجري"',
    timestamp: '2024-01-13T08:30:00Z',
    read: true,
    avatar:
      'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-3.jpg',
  },
]

export const Route = createFileRoute('/(authenticated)/notifications')({
  component: NotificationsPage,
})

function NotificationsPage() {
  const { t } = useTranslation()
  const [notifications, setNotifications] = useState(mockNotifications)
  const [filter, setFilter] = useState<'all' | 'unread'>('all')

  const unreadCount = notifications.filter((n) => !n.read).length
  const filteredNotifications =
    filter === 'unread' ? notifications.filter((n) => !n.read) : notifications

  const markAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification,
      ),
    )
  }

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, read: true })),
    )
  }

  const deleteNotification = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  const handleAction = (notificationId: number, action: string) => {
    // Handle notification actions (accept, decline, etc.)
    console.log(`Action ${action} for notification ${notificationId}`)
    markAsRead(notificationId)
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60),
    )

    if (diffInHours < 1) return 'منذ قليل'
    if (diffInHours < 24) return `منذ ${diffInHours} ساعة`
    if (diffInHours < 48) return 'أمس'
    return `منذ ${Math.floor(diffInHours / 24)} أيام`
  }

  const getNotificationIcon = (notification: any) => {
    if (notification.avatar) {
      return (
        <img
          src={notification.avatar}
          alt="Avatar"
          className="w-10 h-10 rounded-full object-cover"
        />
      )
    }

    if (notification.icon) {
      return (
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center ${
            notification.type === 'achievement'
              ? 'bg-green-100'
              : notification.type === 'event_reminder'
                ? 'bg-blue-100'
                : notification.type === 'promotion'
                  ? 'bg-pink-100'
                  : 'bg-gray-100'
          }`}
        >
          <FontAwesomeIcon
            icon={notification.icon}
            className={`text-sm ${notification.color || 'text-gray-600'}`}
          />
        </div>
      )
    }

    return (
      <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
        <FontAwesomeIcon icon={faBell} className="text-white text-sm" />
      </div>
    )
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            الإشعارات
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {unreadCount > 0
              ? `لديك ${unreadCount} إشعار غير مقروء`
              : 'جميع الإشعارات مقروءة'}
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            <FontAwesomeIcon icon={faCheck} className="ml-2" />
            تعيين الكل كمقروء
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-4 mb-6 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setFilter('all')}
          className={`pb-2 px-1 font-medium transition-colors ${
            filter === 'all'
              ? 'text-primary border-b-2 border-primary'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
        >
          جميع الإشعارات ({notifications.length})
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`pb-2 px-1 font-medium transition-colors ${
            filter === 'unread'
              ? 'text-primary border-b-2 border-primary'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
        >
          غير مقروءة ({unreadCount})
        </button>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-12">
            <FontAwesomeIcon
              icon={faBell}
              className="text-6xl text-gray-300 dark:text-gray-600 mb-4"
            />
            <h3 className="text-xl font-medium text-gray-500 dark:text-gray-400 mb-2">
              لا توجد إشعارات
            </h3>
            <p className="text-gray-400 dark:text-gray-500">
              {filter === 'unread'
                ? 'جميع الإشعارات مقروءة'
                : 'لا توجد إشعارات حتى الآن'}
            </p>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 rounded-xl border transition-all duration-200 hover:shadow-md ${
                notification.read
                  ? 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                  : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
              }`}
            >
              <div className="flex items-start space-x-4">
                {/* Notification Icon/Avatar */}
                <div className="flex-shrink-0">
                  {getNotificationIcon(notification)}
                </div>

                {/* Notification Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3
                        className={`font-semibold ${
                          notification.read
                            ? 'text-gray-900 dark:text-white'
                            : 'text-gray-900 dark:text-white'
                        }`}
                      >
                        {notification.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm leading-relaxed">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                        {formatTime(notification.timestamp)}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2 ml-4">
                      {!notification.read && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                          title="تعيين كمقروء"
                        >
                          <FontAwesomeIcon icon={faCheck} className="text-sm" />
                        </button>
                      )}

                      <button
                        onClick={() => deleteNotification(notification.id)}
                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                        title="حذف الإشعار"
                      >
                        <FontAwesomeIcon icon={faTrash} className="text-sm" />
                      </button>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {notification.actionButtons && (
                    <div className="flex space-x-3 mt-3">
                      <button
                        onClick={() => handleAction(notification.id, 'accept')}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                      >
                        قبول
                      </button>
                      <button
                        onClick={() => handleAction(notification.id, 'decline')}
                        className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
                      >
                        رفض
                      </button>
                    </div>
                  )}
                </div>

                {/* Unread indicator */}
                {!notification.read && (
                  <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-2"></div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
