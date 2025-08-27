import NavBar from '../components/ui/navBar';
import footer from '../layouts/footer';
import PostCard from '../components/createPostPage/postCard'
const CreatePost = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <NavBar />
      <main className="flex-1 py-10 m-8 my-20">
         <PostCard/>
      </main>
      <footer />
    </div>
  );
};
export default CreatePost;