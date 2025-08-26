import NavBar from '../components/ui/navBar';
import Footer from '../layouts/Footer';
import PostsCard from '../components/postsPage/postsCard'
const Posts = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <NavBar />
      <main className="flex-1 py-10 m-8">
         <PostsCard/>
      </main>
      <Footer />
    </div>
  );
};
export default Posts;