import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useTranslation } from 'react-i18next'
import { useAppContext } from '@/contexts/AppProvider'

export default function WelcomeHeader({ mockUserData }: { mockUserData: any }) {
  const { language } = useAppContext()
  const { t } = useTranslation()

  return (
    <section
      id="hero-dashboard"
      className="bg-gradient-to-r from-primary to-secondary dark:from-gray-800 dark:via-primary-dark dark:to-gray-900 text-white py-12 rounded-2xl mb-8 relative overflow-hidden"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="absolute -top-8 -right-8 w-32 h-32 bg-accent rounded-full opacity-20 animate-pulse"></div>
      <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-highlight rounded-full opacity-30"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          <div className="lg:col-span-2">
            <div className={`flex items-center gap-3 mb-4 ${'flex-row'}`}>
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white/20 dark:border-white/30 shadow-lg">
                <img
                  src={mockUserData.avatar}
                  alt={mockUserData.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className={language === 'ar' ? 'text-right' : 'text-left'}>
                <h2 className="text-3xl font-bold">
                  {t('dashboard.welcome')} {mockUserData.name}! 👋
                </h2>
                <p className="text-lg text-white/80 dark:text-white/70">
                  {t('dashboard.readyForNewTal3a')}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
              <div className="bg-white/10 dark:bg-white/5 backdrop-blur-sm dark:backdrop-blur-md dark:border dark:border-white/10 rounded-xl p-4 text-center hover:bg-white/20 transition-all duration-300">
                <FontAwesomeIcon
                  icon={['fas', 'running']}
                  className="text-2xl mb-2 text-accent dark:text-accent-yellow"
                />
                <div className="text-2xl font-bold">
                  {mockUserData.stats.tal3aatThisMonth}
                </div>
                <div className="text-sm text-white/80 dark:text-white/70">
                  {t('dashboard.thisMonth')}
                </div>
              </div>
              <div className="bg-white/10 dark:bg-white/5 backdrop-blur-sm dark:backdrop-blur-md dark:border dark:border-white/10 rounded-xl p-4 text-center hover:bg-white/20 transition-all duration-300">
                <FontAwesomeIcon
                  icon={['fas', 'users']}
                  className="text-2xl mb-2 text-accent dark:text-accent-yellow"
                />
                <div className="text-2xl font-bold">
                  {mockUserData.stats.groupsJoined}
                </div>
                <div className="text-sm text-white/80 dark:text-white/70">
                  {t('dashboard.groups')}
                </div>
              </div>
              <div className="bg-white/10 dark:bg-white/5 backdrop-blur-sm dark:backdrop-blur-md dark:border dark:border-white/10 rounded-xl p-4 text-center hover:bg-white/20 transition-all duration-300">
                <FontAwesomeIcon
                  icon={['fas', 'trophy']}
                  className="text-2xl mb-2 text-accent dark:text-accent-yellow"
                />
                <div className="text-2xl font-bold">8</div>
                <div className="text-sm text-white/80 dark:text-white/70">
                  {t('dashboard.newAchievements')}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/10 dark:bg-white/5 backdrop-blur-sm dark:backdrop-blur-md dark:border dark:border-white/10 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <FontAwesomeIcon
                icon={['fas', 'chart-bar']}
                className="text-accent"
              />
              {t('dashboard.weeklyStats')}
            </h3>
            <div className="space-y-4">
              <div
                className={`flex items-center ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'} justify-between`}
              >
                <span className="text-white/80 dark:text-white/70 flex items-center gap-2">
                  <FontAwesomeIcon
                    icon={['fas', 'futbol']}
                    className="text-sm"
                  />
                  {t('sports.football')}
                </span>
                <div
                  className={`flex items-center ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'} gap-3`}
                >
                  <div className="w-20 h-2 bg-white/20 dark:bg-white/10 rounded-full">
                    <div className="w-3/4 h-full bg-accent rounded-full"></div>
                  </div>
                  <span className="text-sm font-semibold">75%</span>
                </div>
              </div>
              <div
                className={`flex items-center ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'} justify-between`}
              >
                <span className="text-white/80 dark:text-white/70 flex items-center gap-2">
                  <FontAwesomeIcon
                    icon={['fas', 'running']}
                    className="text-sm"
                  />
                  {t('sports.running')}
                </span>
                <div
                  className={`flex items-center ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'} gap-3`}
                >
                  <div className="w-20 h-2 bg-white/20 dark:bg-white/10 rounded-full">
                    <div className="w-1/2 h-full bg-success rounded-full"></div>
                  </div>
                  <span className="text-sm font-semibold">50%</span>
                </div>
              </div>
              <div
                className={`flex items-center ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'} justify-between`}
              >
                <span className="text-white/80 dark:text-white/70 flex items-center gap-2">
                  <FontAwesomeIcon
                    icon={['fas', 'basketball-ball']}
                    className="text-sm"
                  />
                  {t('sports.basketball')}
                </span>
                <div
                  className={`flex items-center ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'} gap-3`}
                >
                  <div className="w-20 h-2 bg-white/20 dark:bg-white/10 rounded-full">
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
  )
}
