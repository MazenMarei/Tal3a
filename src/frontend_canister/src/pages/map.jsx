// Map Page - Interactive map view for location-based features
import Header from "../components/ui/navBar";
import footer from "../layouts/footer";
import MapCard from "../components/mapPage/mapCard";

function Map() {
  return (
    <div className="flex flex-col min-h-screen bg-cream-100">
      {/* Fixed header navigation at top */}
      <div className="bg-cream-100 fixed top-0 left-0 right-0 z-50">
        <Header />
      </div>

      {/* Main map content area */}
      <main className="flex-grow flex items-center justify-center my-5">
        <MapCard />
      </main>

      {/* Footer component */}
      <footer />
    </div>
  );
}

export default Map;
