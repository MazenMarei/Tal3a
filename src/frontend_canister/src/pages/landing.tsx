import Header from "@/components/Landing/header";
import Footer from "@/components/footer.jsx";
import Hero from "@/components/Landing/Hero.jsx";
import WhyChoose from "@/components/Landing/whyChooseUs.jsx";
import PopularSports from "@/components/Landing/popularSports.jsx";
import Community from "@/components/Landing/community.jsx";
import ReadyToStart from "@/components/Landing/readyToStart.jsx";
import GetApp from "@/components/getAppPage/getApp";
const Landing = () => {
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

export default Landing;
