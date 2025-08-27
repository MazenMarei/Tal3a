import Header from "../layouts/header.jsx";
import Footer from "../layouts/footer.jsx";
import Hero from "@/components/onboardPage/Hero.jsx";
import WhyChoose from "@/components/onboardPage/whyChooseUs.jsx";
import PopularSports from "@/components/onboardPage/popularSports.jsx";
import Community from "@/components/onboardPage/community.jsx";
import ReadyToStart from "@/components/onboardPage/readyToStart.jsx";
import GetApp from "@/components/getAppPage/getApp";
const Onboarding = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <GetApp />
      <main>
        <Hero />
        <WhyChoose />
        <PopularSports />
        <Community />
        <ReadyToStart />
      </main>
      <Footer />
    </div>
  );
};

export default Onboarding;
