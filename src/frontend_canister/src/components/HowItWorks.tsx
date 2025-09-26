import { useTranslation } from 'react-i18next'
import { Search, Trophy, UserPlus } from 'lucide-react'
import { useAppContext } from '../contexts/AppProvider'

interface StepProps {
  stepNumber: number
  icon: React.ReactNode
  title: string
  description: string
  color: string
}

const Step: React.FC<StepProps> = ({
  stepNumber,
  icon,
  title,
  description,
  color,
}) => {
  const { language } = useAppContext()

  return (
    <div className="text-center group">
      <div className="relative mb-6">
        {/* Step connector line - hidden on first and last step */}
        {stepNumber < 3 && (
          <div
            className={`absolute top-1/2 ${language === 'ar' ? 'right-0' : 'left-full'} w-full h-0.5 bg-gray-200 dark:bg-gray-700 transform -translate-y-1/2 hidden lg:block`}
          />
        )}

        {/* Icon container */}
        <div
          className={`relative z-10 w-20 h-20 mx-auto rounded-full ${color} text-white flex items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-lg`}
        >
          {icon}
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center text-sm font-bold text-gray-900 dark:text-white border-2 border-current">
            {stepNumber}
          </div>
        </div>
      </div>

      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
        {title}
      </h3>

      <p className="text-gray-600 dark:text-gray-400 max-w-xs mx-auto">
        {description}
      </p>
    </div>
  )
}

export default function HowItWorks() {
  const { t } = useTranslation()

  const steps = [
    {
      icon: <Search size={32} />,
      title: t('howItWorks.step1.title'),
      description: t('howItWorks.step1.description'),
      color: 'bg-[#00B894]',
    },
    {
      icon: <UserPlus size={32} />,
      title: t('howItWorks.step2.title'),
      description: t('howItWorks.step2.description'),
      color: 'bg-[#FDC500]',
    },
    {
      icon: <Trophy size={32} />,
      title: t('howItWorks.step3.title'),
      description: t('howItWorks.step3.description'),
      color: 'bg-[#004E64]',
    },
  ]

  return (
    <section id="how-it-works" className="py-20 bg-white dark:from-gray-900 dark:bg-gradient-to-b dark:to-primary-dark">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {t('howItWorks.title')}
          </h2>
          <div className="w-24 h-1 bg-[#00B894] mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-8 relative">
          {steps.map((step, index) => (
            <Step
              key={index}
              stepNumber={index + 1}
              icon={step.icon}
              title={step.title}
              description={step.description}
              color={step.color}
            />
          ))}
        </div>

        {/* Call to action */}
        <div className="text-center mt-16">
          <button className="bg-gradient-to-r from-[#00B894] to-[#FDC500] text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105">
            {t('hero.cta')}
          </button>
        </div>
      </div>
    </section>
  )
}
