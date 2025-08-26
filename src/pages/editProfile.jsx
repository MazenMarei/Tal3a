import NavBar from '../components/ui/navBar';
import Footer from '../layouts/Footer';
import EditProfileCard from '../components/editProfilePage/editProfileCard';

const EditProfile = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col ">
      <NavBar />
      <main className="flex-1 py-10 m-8 my-20">
        <EditProfileCard />
      </main>
      <Footer />
    </div>
  );
};
export default EditProfile;