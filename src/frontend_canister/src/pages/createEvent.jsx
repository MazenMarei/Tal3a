import NavBar from "../components/ui/navBar";
import footer from "../layouts/footer";
import CreateEventCard from "../components/createEventPage/crerateEventCard";
const CreateEvent = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <NavBar />
      <main className="flex-1 py-10 m-8">
        <CreateEventCard />
      </main>
      <footer />
    </div>
  );
};
export default CreateEvent;
