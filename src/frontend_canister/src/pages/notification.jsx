import NavBar from '../components/ui/navBar';
import footer from '../layouts/footer';
import NotificationCard from '@/components/notificationPage/notificationCard';

const ProfilePage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <NavBar />
      <main className="flex-1 py-10 m-8">
        <NotificationCard />
      </main>
      <footer />
    </div>
  );
};
export default ProfilePage;