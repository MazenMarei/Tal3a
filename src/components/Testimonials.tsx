import { useTranslation } from 'react-i18next'
import { Quote, Star } from 'lucide-react'
import { useAppContext } from '../contexts/AppProvider'

interface TestimonialProps {
  name: string
  nameEn: string
  role: string
  roleEn: string
  content: string
  contentEn: string
  avatar: string
  rating: number
}

const TestimonialCard: React.FC<TestimonialProps> = ({
  name,
  nameEn,
  role,
  roleEn,
  content,
  contentEn,
  avatar,
  rating,
}) => {
  const { language } = useAppContext()

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="flex items-center mb-4">
        <Quote className="text-[#00B894] w-8 h-8 mb-4" />
      </div>

      <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
        "{language === 'ar' ? content : contentEn}"
      </p>

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <img
            src={avatar}
            alt={language === 'ar' ? name : nameEn}
            className="w-12 h-12 rounded-full object-cover me-4"
          />
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white">
              {language === 'ar' ? name : nameEn}
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {language === 'ar' ? role : roleEn}
            </p>
          </div>
        </div>

        <div className="flex items-center">
          {Array.from({ length: rating }).map((_, i) => (
            <Star key={i} className="w-5 h-5 text-[#FDC500] fill-current" />
          ))}
        </div>
      </div>
    </div>
  )
}

export default function Testimonials() {
  const { t } = useTranslation()

  const testimonials = [
    {
      name: 'أحمد محمود',
      nameEn: 'Ahmed Mahmoud',
      role: 'لاعب كرة قدم',
      roleEn: 'Football Player',
      content:
        'تطبيق رائع ساعدني في العثور على فريق كرة قدم في منطقتي. الآن أمارس الرياضة بانتظام مع أصدقاء جدد!',
      contentEn:
        'Amazing app that helped me find a football team in my area. Now I exercise regularly with new friends!',
      avatar: 'https://placehold.co/100x100/00B894/FFFFFF?text=A',
      rating: 5,
    },
    {
      name: 'فاطمة علي',
      nameEn: 'Fatma Ali',
      role: 'محاسبة ولاعبة تنس',
      roleEn: 'Accountant & Tennis Player',
      content:
        'طلعة غيرت حياتي! من صعوبة في العثور على شريك تنس إلى لعب 3 مرات في الأسبوع. التطبيق سهل والمجتمع رائع.',
      contentEn:
        "Tal'a changed my life! From struggling to find a tennis partner to playing 3 times a week. Easy app and great community.",
      avatar: 'https://placehold.co/100x100/FDC500/FFFFFF?text=F',
      rating: 5,
    },
    {
      name: 'محمد حسن',
      nameEn: 'Mohamed Hassan',
      role: 'مهندس وعدّاء',
      roleEn: 'Engineer & Runner',
      content:
        'أفضل تطبيق لمن يريد ممارسة الرياضة في مصر. المجموعات منظمة والأنشطة متنوعة. أنصح به بشدة!',
      contentEn:
        'Best app for anyone wanting to exercise in Egypt. Well-organized groups and diverse activities. Highly recommend!',
      avatar: 'https://placehold.co/100x100/004E64/FFFFFF?text=M',
      rating: 5,
    },
  ]

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {t('i18n.language') === 'ar'
              ? 'ماذا يقول أعضاؤنا'
              : 'What Our Members Say'}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            {t('i18n.language') === 'ar'
              ? 'انضم لآلاف المصريين الذين يمارسون الرياضة بانتظام مع طلعة'
              : "Join thousands of Egyptians who exercise regularly with Tal'a"}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} {...testimonial} />
          ))}
        </div>
      </div>
    </section>
  )
}
