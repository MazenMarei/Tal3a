import NavBar from '../components/profilePage/navBar';
import Footer from '../layouts/Footer';
import CreateGroupCard from '../components/createGroupPage/createGroupCard';
const CreateGroup = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <NavBar />
      <main className="flex-1 py-10 m-8">
         <CreateGroupCard/>
      </main>
      <Footer />
    </div>
  );
};
export default CreateGroup;