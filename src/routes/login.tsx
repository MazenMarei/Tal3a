import {
  faCheck,
  faMedal,
  faShield,
  faTrophy,
  faUser,
  faXmark,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link, createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
// import { useAuth } from '../contexts/AuthProvider'

const LoginPage = () => {
  const { t, i18n } = useTranslation()
  const language = i18n.language
  // const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showIIModal, setShowIIModal] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      // const success = await login(email, password)
      const success = true

      if (!success) {
        setError(t('login.errors.invalidCredentials'))
      }
    } catch (err) {
      setError(t('login.errors.loginFailed'))
    } finally {
      setIsLoading(false)
    }
  }

  const handleDemoLogin = async (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail)
    setPassword(demoPassword)
    setIsLoading(true)
    setError('')

    try {
      // const success = await login(demoEmail, demoPassword)
      const success = true
      if (!success) {
        setError(t('login.errors.invalidCredentials'))
      }
    } catch (err) {
      setError(t('login.errors.loginFailed'))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="bg-gradient-to-b from-primary to-secondary text-white relative overflow-hidden  font-cairo flex items-center min-h-[calc(100vh-5.5rem)] justify-center pt-20 lg:pt-0 mid:pt-0">
      <div className="container relative z-10  px-6 pb-6 mid:px-0 mid:pb-0 lg:px-0 lg:pb-0">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Welcome Content */}
          <div className="text-white">
            <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              {t('login.welcome.title')}{' '}
              <span className="text-accent">{t('common.appName')}</span>
            </h1>
            <p className="text-xl lg:text-2xl mb-8 opacity-90 leading-relaxed">
              {t('login.welcome.subtitle')}
            </p>

            <div className="grid grid-cols-3 gap-6 mb-8 max-w-md mx-auto lg:mx-0">
              <div className="text-center">
                <div className="bg-white/20 dark:bg-gray-900/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <FontAwesomeIcon icon={faUser} className="text-2xl" />
                </div>
                <div className="text-sm">{t('login.stats.users')}</div>
              </div>
              <div className="text-center">
                <div className="bg-white/20 dark:bg-gray-900/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <FontAwesomeIcon icon={faTrophy} className="text-2xl" />
                </div>
                <div className="text-sm">{t('login.stats.groups')}</div>
              </div>
              <div className="text-center">
                <div className="bg-white/20 dark:bg-gray-900/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <FontAwesomeIcon icon={faMedal} className="text-2xl" />
                </div>
                <div className="text-sm">{t('login.stats.sports')}</div>
              </div>
            </div>

            <div className="bg-white/10 dark:bg-gray-900/20 rounded-3xl p-6 backdrop-blur-sm">
              <div className="flex items-center mb-4">
                <img
                  src="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-2.jpg"
                  className="w-12 h-12 rounded-full ml-3"
                  alt="User testimonial"
                />
                <div className="text-right">
                  <div className="font-bold">{t('login.testimonial.name')}</div>
                  <div className="text-sm opacity-80">
                    {t('login.testimonial.role')}
                  </div>
                </div>
              </div>
              <p className="text-sm opacity-90">
                {t('login.testimonial.quote')}
              </p>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 lg:p-12 max-w-md mx-auto w-full relative flex flex-col">
            <div className="absolute -top-30 -right-30 w-32 h-32 bg-accent rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute -bottom-30 -left-30 w-24 h-24 bg-highlight rounded-full opacity-30 animate-bounce"></div>

            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold  mb-3 text-secondary dark:!text-white">
                ابدأ رحلتك الرياضية
              </h2>
              <p className="text-gray-600 dark:!text-white">الخطوة 1 من 5</p>
            </div>

            {/* <!-- Internet Identity Login --> */}
            <div className="space-y-6 mb-8">
              <button
                id="internet-identity-btn"
                className="w-full bg-gradient-to-r from-primary to-secondary text-white py-4 px-6 rounded-xl font-bold text-lg hover:shadow-xl transition-all transform hover:scale-[1.02] flex items-center justify-center"
                onClick={() => setShowIIModal(true)}
              >
                <img
                  src="./nfid_logo.png"
                  alt="Nfid Logo"
                  className="w-8 h-8 m-2"
                />
                <div className="text-right flex flex-row">
                  <div>تسجيل دخول </div>
                  <div className="opacity-90 mx-2">NFID</div>
                </div>
              </button>

              {/* <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">
                    {language === 'ar' ? 'أو' : 'or'}
                  </span>
                </div>
              </div> */}

              <button
                id="internet-identity-btn"
                className="w-full bg-gradient-to-r from-[#E81F79] to-[#5A2684] text-white py-4 px-6 rounded-xl font-bold text-lg hover:shadow-xl transition-all transform hover:scale-[1.02] flex items-center justify-center"
                onClick={() => setShowIIModal(true)}
              >
                <img
                  src="./ii_logo.png"
                  alt="Internet Identity Logo"
                  className=" w-9 m-2"
                />
                <div className="text-right">
                  <div>تسجيل دخول آمن</div>
                  <div className="text-sm opacity-90">Internet Identity</div>
                </div>
              </button>
            </div>

            {/* <!-- Security Note --> */}
            <div className="mt-8 bg-gray-50 rounded-2xl p-4 dark:bg-gray-700">
              <div className="flex items-start">
                <div className="bg-primary w-8 h-8 rounded-lg flex items-center justify-center text-white ml-3 mt-1">
                  <i className="text-sm" data-fa-i2svg="">
                    <svg
                      className="svg-inline--fa fa-shield-halved"
                      aria-hidden="true"
                      focusable="false"
                      data-prefix="fas"
                      data-icon="shield-halved"
                      role="img"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                      data-fa-i2svg=""
                    >
                      <path
                        fill="currentColor"
                        d="M256 0c4.6 0 9.2 1 13.4 2.9L457.7 82.8c22 9.3 38.4 31 38.3 57.2c-.5 99.2-41.3 280.7-213.6 363.2c-16.7 8-36.1 8-52.8 0C57.3 420.7 16.5 239.2 16 140c-.1-26.2 16.3-47.9 38.3-57.2L242.7 2.9C246.8 1 251.4 0 256 0zm0 66.8V444.8C394 378 431.1 230.1 432 141.4L256 66.8l0 0z"
                      ></path>
                    </svg>
                  </i>
                </div>
                <div>
                  <h4 className="font-bold text-secondary text-sm mb-1 dark:!text-white">
                    حماية كاملة لبياناتك
                  </h4>
                  <p className="text-gray-600 text-xs dark:!text-gray-300">
                    نستخدم أحدث تقنيات الأمان لحماية معلوماتك الشخصية
                  </p>
                </div>
              </div>
            </div>

            {/* <!-- Terms --> */}
            <p className="text-center text-xs text-gray-500 mt-6 dark:!text-gray-400">
              بالمتابعة، أنت توافق على
              <span className="text-nile-green cursor-pointer hover:underline mx-1">
                20% مكتمل
              </span>
              و
              <span className="text-nile-green cursor-pointer hover:underline mx-1">
                سياسة الخصوصية
              </span>
            </p>
          </div>
        </div>
      </div>
      {/* Internet Identity Modal */}
      {showIIModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-3xl max-w-md w-full p-8 relative">
            <button
              onClick={() => setShowIIModal(false)}
              className="absolute top-4 left-4 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
            >
              <FontAwesomeIcon icon={faXmark} className="text-xl" />
            </button>

            <div className="text-center">
              <div className="bg-gradient-to-br from-primary to-secondary w-20 h-20 rounded-2xl flex items-center justify-center text-white mx-auto mb-6">
                <i className="text-4xl" data-fa-i2svg="">
                  <svg
                    className="svg-inline--fa fa-shield-halved"
                    aria-hidden="true"
                    focusable="false"
                    data-prefix="fas"
                    data-icon="shield-halved"
                    role="img"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                    data-fa-i2svg=""
                  >
                    <path
                      fill="currentColor"
                      d="M256 0c4.6 0 9.2 1 13.4 2.9L457.7 82.8c22 9.3 38.4 31 38.3 57.2c-.5 99.2-41.3 280.7-213.6 363.2c-16.7 8-36.1 8-52.8 0C57.3 420.7 16.5 239.2 16 140c-.1-26.2 16.3-47.9 38.3-57.2L242.7 2.9C246.8 1 251.4 0 256 0zm0 66.8V444.8C394 378 431.1 230.1 432 141.4L256 66.8l0 0z"
                    ></path>
                  </svg>
                </i>
              </div>

              <h3 className="text-2xl font-bold text-secondary dark:text-white mb-4">
                {t('login.internetIdentity.modal.title')}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                {t('login.internetIdentity.modal.description')}
              </p>

              <div className="space-y-4 mb-8">
                {['privacy', 'noPasswords', 'quickSecure'].map((feature) => (
                  <div key={feature} className="flex items-center">
                    <div className="bg-green-500 w-6 h-6 rounded-full flex items-center justify-center ml-3">
                      <FontAwesomeIcon
                        icon={faCheck}
                        className="text-white text-xs"
                      />
                    </div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {t(`login.internetIdentity.modal.features.${feature}`)}
                    </span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setShowIIModal(false)}
                className="w-full bg-primary text-white py-4 px-6 rounded-xl font-bold hover:bg-secondary transition-all"
              >
                {t('login.internetIdentity.modal.continue')}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export const Route = createFileRoute('/login')({
  component: LoginPage,
})
