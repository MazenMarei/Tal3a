import Header from "../layouts/Header";
import Footer from "../layouts/Footer";
import Hero from "../components/landingPage/hero";
import Groups from "../components/landingPage/groups";
import Events from "../components/landingPage/events";
const LandingPage = () => {
  return (
    <>
      <Header />
      <Hero />
      <Groups />
      <Events />
      <Footer />
    </>
  );
};
export default LandingPage;
