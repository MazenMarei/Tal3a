import NavBar from '../components/profilePage/navBar';
import Footer from '../layouts/Footer';
import NotificationCard from '@/components/notificationPage/notificationCard';

const ProfilePage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <NavBar />
      <main className="flex-1 py-10 m-8">
        <NotificationCard />
      </main>
      <Footer />
    </div>
  );
};
export default ProfilePage;