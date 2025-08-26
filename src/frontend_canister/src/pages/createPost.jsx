import NavBar from '../components/ui/navBar';
import Footer from '../layouts/Footer';
import PostCard from '../components/createPostPage/postCard'
const CreatePost = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <NavBar />
      <main className="flex-1 py-10 m-8 my-20">
         <PostCard/>
      </main>
      <Footer />
    </div>
  );
};
export default CreatePost;