import Header from "../layouts/header";
import Footer from "../layouts/footer";
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
