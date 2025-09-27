import { useTranslation } from 'react-i18next'
import RecommendedTal3aCard from './RecommededTal3aCard'

export default function RecommendedTal3a({
  mockRecommendedTal3a,
}: {
  mockRecommendedTal3a: Array<any>
}) {
  const { t } = useTranslation()

  return (
    <section id="recommended-section" className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className={`text-2xl font-bold text-secondary dark:text-white`}>
          {t('dashboard.recommendedForYou')}
        </h2>
        <button className="text-primary font-medium hover:underline">
          {t('dashboard.seeMore')}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockRecommendedTal3a.map((tal3a) => (
          <RecommendedTal3aCard tal3a={tal3a} key={tal3a.id} />
        ))}
      </div>
    </section>
  )
}
