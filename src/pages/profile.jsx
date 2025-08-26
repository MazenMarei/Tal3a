import NavBar from '../components/ui/navBar';
import Footer from '../layouts/Footer';
import ProfileCard from '../components/profilePage/profileCard';

const ProfilePage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <NavBar />
      <main className="flex-1 py-10 m-8">
        <ProfileCard />
      </main>
      <Footer />
    </div>
  );
};
export default ProfilePage;