import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'
import { useTranslation } from 'react-i18next'

const FAQSection: React.FC = () => {
  const { t } = useTranslation()
  const [openFAQ, setOpenFAQ] = useState<number | null>(null)

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index)
  }

  const faqData = [
    {
      questionKey: 'faq.whatIsTal3a.question',
      answerKey: 'faq.whatIsTal3a.answer',
    },
    {
      questionKey: 'faq.isFree.question',
      answerKey: 'faq.isFree.answer',
    },
    {
      questionKey: 'faq.userSafety.question',
      answerKey: 'faq.userSafety.answer',
    },
    {
      questionKey: 'faq.rewards.question',
      answerKey: 'faq.rewards.answer',
    },
    {
      questionKey: 'faq.availability.question',
      answerKey: 'faq.availability.answer',
    },
    {
      questionKey: 'faq.contact.question',
      answerKey: 'faq.contact.answer',
    },
  ]

  return (
    <section
      id="faq"
      className="py-20 bg-light dark:!bg-gray-900"
    >
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h3 className="text-5xl font-bold text-secondary dark:!text-white mb-6">
            {t('faq.title')}
          </h3>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto dark:!text-gray-300">
            {t('faq.subtitle')}
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          {faqData.map((faq, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden"
            >
              <button
                className="w-full text-right p-6 focus:outline-none hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                onClick={() => toggleFAQ(index)}
              >
                <div className="flex justify-between items-center">
                  <h4 className="text-xl font-bold text-secondary dark:!text-white">
                    {t(faq.questionKey)}
                  </h4>
                  <FontAwesomeIcon
                    icon={faChevronDown}
                    className={`text-primary dark:!text-white transform transition-transform ${
                      openFAQ === index ? 'rotate-180' : ''
                    }`}
                  />
                </div>
              </button>

              {openFAQ === index && (
                <div className="px-6 pb-6">
                  <p className="text-gray-600 dark:!text-gray-300">{t(faq.answerKey)}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FAQSection
