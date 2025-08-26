import NavBar from '../components/profilePage/navBar';
import Footer from '../layouts/Footer';
import EventDetialsCard from '../components/eventDetailsPage/eventDetailsCard';
const EventDetails = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <NavBar />
      <main className="flex-1 py-10 m-8">
         <EventDetialsCard/>
      </main>
      <Footer />
    </div>
  );
};
export default EventDetails;