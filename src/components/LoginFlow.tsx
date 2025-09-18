import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

interface LoginFlowProps {
  onComplete: (userData: UserData) => void
}

interface UserData {
  bio?: string
  referralCode?: string
  // Add other fields as needed
}

export default function LoginFlow({ onComplete }: LoginFlowProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [userData, setUserData] = useState<UserData>({})
  const [isLoading, setIsLoading] = useState(false)

  // Get referral code from URL params
  const urlParams = new URLSearchParams(window.location.search)
  const referralFromUrl = urlParams.get('ref')

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1)
    } else {
      handleComplete()
    }
  }

  const handleComplete = async () => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Call fake function
      const result = await submitUserData({
        ...userData,
        referralCode: userData.referralCode || referralFromUrl || undefined,
      })

      if (result) {
        onComplete(userData)
        navigate({ to: '/dashboard' })
      }
    } catch (error) {
      console.error('Failed to complete registration:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const submitUserData = async (data: UserData): Promise<boolean> => {
    // Fake function that returns true
    console.log('Submitting user data:', data)
    return true
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-3 text-secondary dark:text-white">
              مرحباً بك في طلعة!
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              دعنا نعرف المزيد عنك لنقدم لك أفضل تجربة رياضية
            </p>
            <div className="space-y-4">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-6">
                <h3 className="font-bold text-lg mb-2 text-secondary dark:text-white">
                  ✨ ما ستحصل عليه
                </h3>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <li>• العثور على شركاء الرياضة المناسبين</li>
                  <li>• الانضمام لمجموعات رياضية في منطقتك</li>
                  <li>• كسب مكافآت على كل نشاط</li>
                  <li>• تتبع تقدمك الرياضي</li>
                </ul>
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-3 text-secondary dark:text-white">
              نبذة تعريفية (اختياري)
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              أخبر الآخرين عن اهتماماتك الرياضية وأهدافك
            </p>
            <textarea
              value={userData.bio || ''}
              onChange={(e) =>
                setUserData({ ...userData, bio: e.target.value })
              }
              placeholder="مثال: أحب كرة القدم وأبحث عن فريق للعب معه كل أسبوع..."
              className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
              rows={4}
              maxLength={300}
            />
            <div className="text-right text-sm text-gray-500 mt-2">
              {userData.bio?.length || 0}/300
            </div>
          </div>
        )

      case 3:
        return (
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-3 text-secondary dark:text-white">
              كود الدعوة (اختياري)
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              إذا كان لديك كود دعوة من صديق، أدخله هنا للحصول على مكافآت إضافية
            </p>
            <input
              type="text"
              value={userData.referralCode || referralFromUrl || ''}
              onChange={(e) =>
                setUserData({ ...userData, referralCode: e.target.value })
              }
              placeholder="أدخل كود الدعوة"
              className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white text-center"
              maxLength={20}
            />
            {referralFromUrl && (
              <p className="text-sm text-green-600 mt-2">
                ✅ تم العثور على كود الدعوة تلقائياً
              </p>
            )}
          </div>
        )

      case 4:
        return (
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-3 text-secondary dark:text-white">
              اختر اهتماماتك الرياضية
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              سنساعدك في العثور على الأنشطة المناسبة لك
            </p>
            <div className="grid grid-cols-2 gap-4">
              {[
                'كرة القدم',
                'الجري',
                'كرة السلة',
                'التنس',
                'السباحة',
                'اليوجا',
              ].map((sport) => (
                <label
                  key={sport}
                  className="flex items-center space-x-3 p-3 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    className="form-checkbox h-5 w-5 text-primary"
                  />
                  <span className="text-gray-700 dark:text-gray-300">
                    {sport}
                  </span>
                </label>
              ))}
            </div>
          </div>
        )

      case 5:
        return (
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-3 text-secondary dark:text-white">
              كل شيء جاهز! 🎉
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              أصبحت جاهزاً لبدء رحلتك الرياضية مع طلعة
            </p>
            <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-6 text-white mb-6">
              <h3 className="font-bold text-lg mb-2">🎁 مكافأة الترحيب</h3>
              <p className="text-sm opacity-90">
                احصل على 100 نقطة مجانية لبدء رحلتك!
              </p>
            </div>
            {userData.bio && (
              <div className="text-left bg-gray-50 dark:bg-gray-700 rounded-xl p-4 mb-4">
                <h4 className="font-bold text-sm text-gray-700 dark:text-gray-300 mb-2">
                  نبذتك:
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {userData.bio}
                </p>
              </div>
            )}
            {(userData.referralCode || referralFromUrl) && (
              <div className="text-left bg-green-50 dark:bg-green-900/20 rounded-xl p-4 mb-4">
                <h4 className="font-bold text-sm text-green-700 dark:text-green-300 mb-2">
                  كود الدعوة:
                </h4>
                <p className="text-sm text-green-600 dark:text-green-400">
                  {userData.referralCode || referralFromUrl}
                </p>
              </div>
            )}
          </div>
        )

      default:
        return null
    }
  }

  return (
    <section className="bg-gradient-to-b from-primary to-secondary text-white relative overflow-hidden font-cairo flex items-center min-h-[calc(100vh-5.5rem)] justify-center pt-20 lg:pt-0">
      <div className="container relative z-10 px-6 pb-6">
        <div className="max-w-2xl mx-auto">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm opacity-80">
                الخطوة {currentStep} من 5
              </span>
              <span className="text-sm opacity-80">
                {Math.round((currentStep / 5) * 100)}% مكتمل
              </span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div
                className="bg-white rounded-full h-2 transition-all duration-300"
                style={{ width: `${(currentStep / 5) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Step Content */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 lg:p-12">
            {renderStep()}

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center mt-8">
              {currentStep > 1 ? (
                <button
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="px-6 py-3 text-gray-600 dark:text-gray-300 hover:text-primary transition-colors"
                >
                  السابق
                </button>
              ) : (
                <div></div>
              )}

              <button
                onClick={handleNext}
                disabled={isLoading}
                className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-secondary transition-all disabled:opacity-50"
              >
                {isLoading
                  ? 'جاري الحفظ...'
                  : currentStep === 5
                    ? 'ابدأ الآن!'
                    : 'التالي'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
