import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faComment,
  faHeart,
  faPaperPlane,
  faTimes,
} from '@fortawesome/free-solid-svg-icons'
import { faHeart as fasHeart } from '@fortawesome/free-regular-svg-icons'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import { useAppContext } from '@/contexts/AppProvider'

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
  replies?: Array<Comment>
}

interface ActivityType {
  id: number
  user: {
    name: string
    avatar: string
  }
  content: string
  time: string
  location?: string
  image?: string
  likes: number
  isLiked: boolean
}

interface CommentModalProps {
  isOpen: boolean
  post: ActivityType | null
  comments: Array<Comment>
  showAllComments: boolean
  likedPosts: Array<number>
  likedComments: Array<number>
  onClose: () => void
  onLoadMore: () => void
  onLikePost: (postId: number) => void
  onLikeComment: (commentId: number) => void
  onSendComment: (content: string) => void
}

export default function CommentModal({
  isOpen,
  post,
  comments,
  showAllComments,
  likedPosts,
  likedComments,
  onClose,
  onLoadMore,
  onLikePost,
  onLikeComment,
  onSendComment,
}: CommentModalProps) {
  const { language } = useAppContext()
  const { t } = useTranslation()
  const [newComment, setNewComment] = useState('')

  const handleSendComment = () => {
    if (!newComment.trim()) return
    onSendComment(newComment)
    setNewComment('')
  }

  if (!isOpen || !post) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div
        className="bg-white dark:bg-dark-bg rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl"
        dir={language === 'ar' ? 'rtl' : 'ltr'}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-bold text-secondary dark:text-white">
            {post.user.name}
            {t('dashboard.comments.postTitle')}
          </h2>
          <button
            onClick={onClose}
            className="flex p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors"
          >
            <FontAwesomeIcon icon={faTimes} className="text-xl" />
          </button>
        </div>

        <div className="flex flex-col max-h-[calc(90vh-80px)] overflow-y-auto">
          {/* Post Content - Left Side */}
          <div className="p-6 border-gray-200 dark:border-gray-700 lg:border-r">
            {/* Post Header */}
            <div
              className={`flex items-center gap-3 ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'} mb-4`}
            >
              <img
                src={post.user.avatar}
                alt={post.user.name}
                className="w-12 h-12 rounded-full"
              />
              <div className="flex-1">
                <h4 className="font-bold text-secondary dark:text-white">
                  {post.user.name}
                </h4>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span>{post.time}</span>
                  {post.location && (
                    <>
                      <span>•</span>
                      <FontAwesomeIcon
                        icon={['fas', 'map-marker-alt']}
                        className="text-xs"
                      />
                      <span>{post.location}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Post Content */}
            {post.content && (
              <p className="text-secondary dark:text-gray-300 mb-4">
                {post.content}
              </p>
            )}

            {/* Post Image */}
            {post.image && (
              <div className="mb-4">
                <img
                  src={post.image}
                  alt=""
                  className="w-full max-h-96 object-cover rounded-xl"
                />
              </div>
            )}

            {/* Post Actions */}
            <div className="flex items-center space-x-6 rtl:space-x-reverse pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => onLikePost(post.id)}
                className={`flex items-center space-x-2 rtl:space-x-reverse ${
                  likedPosts.includes(post.id) || post.isLiked
                    ? 'text-primary'
                    : 'text-gray-500 dark:text-gray-400 hover:text-primary'
                } transition-colors`}
              >
                <FontAwesomeIcon
                  icon={
                    likedPosts.includes(post.id) || post.isLiked
                      ? faHeart
                      : fasHeart
                  }
                />
                <span className="text-sm">{post.likes}</span>
              </button>
            </div>
          </div>

          {/* Comments Section - Right Side */}
          <div className="flex flex-col">
            {/* Comments Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-secondary dark:text-white">
                {t('dashboard.comments.title')} ({comments.length})
              </h3>
            </div>

            {/* Comments List */}
            <div className="flex-1 overflow-y-auto p-4">
              {comments.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <FontAwesomeIcon
                    icon={faComment}
                    className="text-4xl mb-4 text-gray-400 dark:text-gray-600"
                  />
                  <p className="text-gray-600 dark:text-gray-400">
                    {t('dashboard.comments.noComments')}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {t('dashboard.comments.beFirst')}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {comments.map((comment) => (
                    <div key={comment.id} className="space-y-3">
                      {/* Main Comment */}
                      <div
                        className={`flex gap-3 ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}
                      >
                        <img
                          src={comment.user.avatar}
                          alt={comment.user.name}
                          className="w-8 h-8 rounded-full flex-shrink-0"
                        />
                        <div className="flex-1">
                          <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl px-4 py-3">
                            <div className="flex items-center gap-2 mb-1">
                              <h6 className="font-semibold text-sm text-secondary dark:text-white">
                                {comment.user.name}
                              </h6>
                              <span className="text-xs text-gray-500">
                                {comment.time}
                              </span>
                            </div>
                            <p className="text-sm text-secondary dark:text-gray-300">
                              {comment.content}
                            </p>
                          </div>
                          <div className="flex items-center gap-4 mt-2 px-2">
                            <button
                              onClick={() => onLikeComment(comment.id)}
                              className={`text-xs font-medium ${
                                likedComments.includes(comment.id) ||
                                comment.isLiked
                                  ? 'text-primary'
                                  : 'text-gray-500 hover:text-primary'
                              } transition-colors`}
                            >
                              {likedComments.includes(comment.id) ||
                              comment.isLiked
                                ? t('dashboard.comments.liked')
                                : t('dashboard.comments.like')}{' '}
                              ({comment.likes})
                            </button>
                            <button className="text-xs font-medium text-gray-500 hover:text-primary transition-colors">
                              {t('dashboard.comments.reply')}
                            </button>
                          </div>

                          {/* Replies */}
                          {comment.replies && comment.replies.length > 0 && (
                            <div className="mt-3 space-y-2">
                              {comment.replies.map((reply) => (
                                <div
                                  key={reply.id}
                                  className={`flex gap-2 ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}
                                >
                                  <img
                                    src={reply.user.avatar}
                                    alt={reply.user.name}
                                    className="w-6 h-6 rounded-full flex-shrink-0"
                                  />
                                  <div className="flex-1">
                                    <div className="bg-gray-50 dark:bg-gray-600 rounded-xl px-3 py-2">
                                      <div className="flex items-center gap-2 mb-1">
                                        <h6 className="font-semibold text-xs text-secondary dark:text-white">
                                          {reply.user.name}
                                        </h6>
                                        <span className="text-xs text-gray-500">
                                          {reply.time}
                                        </span>
                                      </div>
                                      <p className="text-xs text-secondary dark:text-gray-300">
                                        {reply.content}
                                      </p>
                                    </div>
                                    <div className="flex items-center gap-3 mt-1 px-1">
                                      <button
                                        onClick={() => onLikeComment(reply.id)}
                                        className={`text-xs font-medium ${
                                          likedComments.includes(reply.id) ||
                                          reply.isLiked
                                            ? 'text-primary'
                                            : 'text-gray-500 hover:text-primary'
                                        } transition-colors`}
                                      >
                                        {likedComments.includes(reply.id) ||
                                        reply.isLiked
                                          ? t('dashboard.comments.liked')
                                          : t('dashboard.comments.like')}{' '}
                                        ({reply.likes})
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Load More Comments Button */}
                  {!showAllComments && (
                    <button
                      onClick={onLoadMore}
                      className="w-full py-3 text-center text-sm font-medium rounded-lg text-primary hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      {t('dashboard.comments.loadMore')}
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Comment Input */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
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
                    onKeyPress={(e) => {
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
        </div>
      </div>
    </div>
  )
}
