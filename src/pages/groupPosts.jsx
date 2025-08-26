import NavBar from '../components/ui/navBar';
import Footer from '../layouts/Footer';
import GroupPostsCard from '../components/groupPosts/groupPostsCard';
const GroupPosts = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <NavBar />
      <main className="flex-1 py-10 m-8">
         <GroupPostsCard/>
      </main>
      <Footer />
    </div>
  );
};
export default GroupPosts;