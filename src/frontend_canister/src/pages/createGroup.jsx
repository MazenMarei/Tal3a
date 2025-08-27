import NavBar from '../components/ui/navBar';
import footer from '../layouts/footer';
import CreateGroupCard from '../components/createGroupPage/createGroupCard';
const CreateGroup = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <NavBar />
      <main className="flex-1 py-10 m-8">
         <CreateGroupCard/>
      </main>
      <footer />
    </div>
  );
};
export default CreateGroup;