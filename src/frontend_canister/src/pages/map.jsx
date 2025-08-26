import Header from "../components/ui/navBar";
import Footer from "../layouts/Footer";
import MapCard from "../components/mapPage/mapCard";

function Map() {
  return (
    <div className="flex flex-col min-h-screen bg-cream-100">
      <div className="bg-cream-100 fixed top-0 left-0 right-0 z-50">
        <Header />
      </div>
      <main className="flex-grow flex items-center justify-center my-5">
        <MapCard />
      </main>
      <Footer />
    </div>
  );
}

export default Map;
