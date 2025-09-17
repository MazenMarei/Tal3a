import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useTranslation } from 'react-i18next'

const ProblemStatement = () => {
  const { t } = useTranslation()

  const problems = [
    {
      icon: 'user-times',
      titleKey: 'problemStatement.isolation.title',
      descriptionKey: 'problemStatement.isolation.description',
      bgColor: 'bg-danger',
    },
    {
      icon: 'comments',
      titleKey: 'problemStatement.organization.title',
      descriptionKey: 'problemStatement.organization.description',
      bgColor: 'bg-accent',
    },
    {
      icon: 'battery-empty',
      titleKey: 'problemStatement.motivation.title',
      descriptionKey: 'problemStatement.motivation.description',
      bgColor: 'bg-secondary',
    },
  ]

  return (
    <section id="problem" className="py-20 bg-white dark:from-[#003F50] dark:to-gray-800 dark:bg-gradient-to-b">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h3 className="text-5xl font-bold text-secondary dark:!text-white mb-6">
            {t('problemStatement.title')}
          </h3>
          <p className="text-xl text-gray-600 dark:!text-gray-300 max-w-3xl mx-auto">
            {t('problemStatement.subtitle')}
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {problems.map((problem, index) => (
            <div
              key={index}
              className="text-center p-8 rounded-2xl bg-gray-50 dark:bg-gray-800 hover:shadow-lg transition-shadow"
            >
              <div
                className={`${problem.bgColor} w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6`}
              >
                <FontAwesomeIcon
                  icon={['fas', problem.icon as any]}
                  className="text-white  text-2xl"
                />
              </div>
              <h4 className="text-2xl font-bold text-secondary dark:!text-white mb-4">
                {t(problem.titleKey)}
              </h4>
              <p className="text-gray-600 dark:!text-gray-300">{t(problem.descriptionKey)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ProblemStatement
