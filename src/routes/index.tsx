import { createFileRoute } from '@tanstack/react-router'
import { useAppContext } from '../contexts/AppProvider'
import HeroNew from '../components/HeroNew'
import ProblemStatement from '../components/ProblemStatement'
import FeaturesSection from '../components/FeaturesSection'
import CommunitySection from '../components/CommunitySection'
import SportsCategories from '../components/SportsCategories'
import FAQSection from '../components/FAQSection'
import AppDownload from '../components/AppDownload'
import Footer from '../components/Footer'
import PrivacySection from '../components/PrivacySection'
import RewardsSection from '../components/RewardsSection'
import HowItWorks from '@/components/HowItWorks'
import Header from '@/components/Header'

export const Route = createFileRoute('/')({
  component: LandingPage,
})

function LandingPage() {
  const { language } = useAppContext()

  return (
    <>
      <Header />

      <div
        className="min-h-screen bg-light text-dark font-cairo"
        dir={language === 'ar' ? 'rtl' : 'ltr'}
      >
        <HeroNew />
        <ProblemStatement />
        <FeaturesSection />
        <HowItWorks />
        <CommunitySection />
        <SportsCategories />
        <PrivacySection />
        <RewardsSection />
        <AppDownload />
        <FAQSection />
        <Footer />
      </div>
    </>
  )
}
