import NavBar from '../components/ui/navBar';
import footer from '../layouts/footer';
import EventDetialsCard from '../components/eventDetailsPage/eventDetailsCard';
const EventDetails = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <NavBar />
      <main className="flex-1 py-10 m-8">
         <EventDetialsCard/>
      </main>
      <footer />
    </div>
  );
};
export default EventDetails;