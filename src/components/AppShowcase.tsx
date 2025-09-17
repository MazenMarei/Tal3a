import { ArrowLeft, ArrowRight, Check } from 'lucide-react'
import { useAppContext } from '../contexts/AppProvider'

export default function AppShowcase() {
  const { language } = useAppContext()

  const ArrowIcon = language === 'ar' ? ArrowLeft : ArrowRight

  const appFeatures = [
    {
      titleAr: 'تصفح الأنشطة المتاحة',
      titleEn: 'Browse Available Activities',
      descriptionAr:
        'شاهد جميع الأنشطة الرياضية المتاحة في منطقتك مع تفاصيل كاملة عن التوقيت والمكان',
      descriptionEn:
        'View all available sports activities in your area with complete details about timing and location',
    },
    {
      titleAr: 'احجز مكانك بسهولة',
      titleEn: 'Book Your Spot Easily',
      descriptionAr:
        'احجز مكانك في النشاط المناسب لك بضغطة واحدة مع تأكيد فوري',
      descriptionEn:
        'Book your spot in the activity that suits you with one click and instant confirmation',
    },
    {
      titleAr: 'تواصل مع المشاركين',
      titleEn: 'Connect with Participants',
      descriptionAr: 'تواصل مع باقي المشاركين في النشاط وكون صداقات جديدة',
      descriptionEn:
        'Connect with other participants in the activity and make new friendships',
    },
  ]

  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Mobile Mockups */}
          <div
            className={`${language === 'ar' ? 'lg:order-2' : ''} flex justify-center`}
          >
            <div className="relative">
              {/* First Phone */}
              <div className="bg-gray-900 rounded-3xl p-2 shadow-2xl">
                <div className="bg-white rounded-2xl w-72 h-[500px] overflow-hidden">
                  {/* Status Bar */}
                  <div className="bg-emerald-600 h-10 flex items-center justify-between px-4 text-white text-xs">
                    <span>9:41</span>
                    <span className="font-bold">طلعة</span>
                    <span>●●●●●</span>
                  </div>

                  {/* App Content */}
                  <div className="p-4 h-full bg-gray-50">
                    <h3 className="font-bold text-lg mb-4 text-center">
                      الأنشطة المتاحة اليوم
                    </h3>

                    <div className="space-y-3">
                      {/* Activity Item */}
                      <div className="bg-white rounded-lg p-3 shadow-sm flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center text-white">
                          ⚽
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-sm">
                            كرة قدم - الزمالك
                          </div>
                          <div className="text-xs text-gray-500">
                            5:00 مساءً - 7 مشاركين
                          </div>
                        </div>
                        <div className="text-emerald-600 font-bold text-sm">
                          انضم
                        </div>
                      </div>

                      {/* Activity Item */}
                      <div className="bg-white rounded-lg p-3 shadow-sm flex items-center gap-3">
                        <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white">
                          🏀
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-sm">
                            كرة سلة - مدينة نصر
                          </div>
                          <div className="text-xs text-gray-500">
                            7:00 مساءً - 4 مشاركين
                          </div>
                        </div>
                        <div className="text-emerald-600 font-bold text-sm">
                          انضم
                        </div>
                      </div>

                      {/* Activity Item */}
                      <div className="bg-white rounded-lg p-3 shadow-sm flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white">
                          🏊
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-sm">
                            سباحة - كلوب سبورتنج
                          </div>
                          <div className="text-xs text-gray-500">
                            10:00 صباحاً - 6 مشاركين
                          </div>
                        </div>
                        <div className="text-emerald-600 font-bold text-sm">
                          انضم
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Second Phone (Overlapped) */}
              <div className="absolute -right-8 top-16 bg-gray-900 rounded-3xl p-2 shadow-2xl">
                <div className="bg-white rounded-2xl w-64 h-[400px] overflow-hidden">
                  {/* Status Bar */}
                  <div className="bg-emerald-600 h-10 flex items-center justify-between px-4 text-white text-xs">
                    <span>9:41</span>
                    <span className="font-bold">طلعة</span>
                    <span>●●●●●</span>
                  </div>

                  {/* Profile Content */}
                  <div className="p-4 text-center">
                    <div className="w-16 h-16 bg-emerald-600 rounded-full mx-auto mb-3 flex items-center justify-center text-white text-xl">
                      👤
                    </div>
                    <h4 className="font-bold mb-2">أحمد محمد</h4>
                    <div className="text-sm text-gray-600 mb-4">
                      عضو منذ 2023
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center mb-4">
                      <div>
                        <div className="font-bold text-emerald-600">25</div>
                        <div className="text-xs text-gray-500">نشاط</div>
                      </div>
                      <div>
                        <div className="font-bold text-emerald-600">150</div>
                        <div className="text-xs text-gray-500">نقطة</div>
                      </div>
                      <div>
                        <div className="font-bold text-emerald-600">5</div>
                        <div className="text-xs text-gray-500">شارات</div>
                      </div>
                    </div>

                    <div className="flex justify-center gap-1 mb-4">
                      <div className="w-6 h-6 bg-yellow-400 rounded text-xs flex items-center justify-center">
                        🏆
                      </div>
                      <div className="w-6 h-6 bg-blue-500 rounded text-xs flex items-center justify-center">
                        ⚽
                      </div>
                      <div className="w-6 h-6 bg-red-500 rounded text-xs flex items-center justify-center">
                        🏃
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div
            className={`${language === 'ar' ? 'lg:order-1 text-right' : 'text-left'}`}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              {language === 'ar' ? 'مميزات طلعة' : "Tal'a Features"}
            </h2>

            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
              {language === 'ar'
                ? 'تطبيق سهل وبسيط يساعدك على إيجاد أنشطة رياضية مناسبة لك والتواصل مع رياضيين آخرين'
                : 'A simple and easy app that helps you find suitable sports activities and connect with other athletes'}
            </p>

            <div className="space-y-6 mb-8">
              {appFeatures.map((feature, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="w-6 h-6 bg-emerald-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                      {language === 'ar' ? feature.titleAr : feature.titleEn}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {language === 'ar'
                        ? feature.descriptionAr
                        : feature.descriptionEn}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-200 flex items-center gap-3 shadow-lg hover:shadow-xl hover:scale-105">
              {language === 'ar' ? 'جرب التطبيق الآن' : 'Try the App Now'}
              <ArrowIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
