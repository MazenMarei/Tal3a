import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Mail, Video, Smile, Heart, MessageCircle, Trash2, Edit } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { Helmet } from 'react-helmet-async';
import LoadingCard from '../loadingPage/loadingCard';

const PostsCard = () => {
  const { posts, loading, error } = useData();

  if (loading) return <div className="flex items-center mx-auto"><LoadingCard/></div>;
  if (error) return <div className="flex items-center mx-auto"><LoadingCard/></div>;

  const handleDelete = (id) => console.log(`Delete post with id: ${id}`);
  const handleUpdate = (id) => console.log(`Update post with id: ${id}`);

  return (
    <>
      <Helmet>
        <title>Egypt Sports Posts - Community Updates 2025</title>
        <meta name="description" content={`Check out the latest ${posts.length} posts from the Egypt Sports Community in 2025.`} />
        <meta name="keywords" content={`Egypt sports posts, community updates, ${posts.map(p => p.name).join(', ')}, 2025`} />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="Egypt Sports Posts 2025" />
        <meta property="og:description" content={`View ${posts.length} community posts from Egypt Sports in 2025.`} />
        <meta property="og:image" content="https://yourdomain.com/posts-og-image.jpg" />
        <meta property="og:url" content="https://yourdomain.com/posts" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>
      <div className="container mx-auto lg:mx-84 p-4 max-w-6xl bg-gradient-to-br from-gray-50 min-h-screen">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-white shadow-lg rounded-xl border border-teal-100">
              <CardHeader className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 w-full">
                  <Avatar className="w-12 h-12 border-2 border-teal-200">
                    <AvatarImage src="https://api.dicebear.com/6.x/initials/svg?seed=MM" alt="Mahmoud" />
                    <AvatarFallback>MM</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 w-full">
                    <Input
                      placeholder="What's new, Mahmoud Mohamed?"
                      className="w-full bg-gray-50 border-none focus:ring-2 focus:ring-teal-500 text-gray-800 placeholder-teal-400 p-2 sm:p-3 rounded-lg"
                    />
                  </div>
                  <div className="flex flex-wrap justify-end space-x-2 sm:space-x-3 mt-2 sm:mt-0">
                    <Mail className="w-6 h-6 text-teal-600 cursor-pointer hover:text-teal-800" />
                    <Video className="w-6 h-6 text-teal-600 cursor-pointer hover:text-teal-800" />
                    <Smile className="w-6 h-6 text-teal-600 cursor-pointer hover:text-teal-800" />
                    <Link to="/createPost">
                      <Button className="bg-teal-600 cursor-pointer hover:bg-teal-700 text-white rounded-full px-4 py-2 transition-all duration-200 text-sm sm:text-base">
                        POST
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardHeader>
            </Card>
            <div className="relative mb-6">
              <Input
                placeholder="Search Posts People and News"
                className="pl-12 pr-4 py-3 bg-white shadow-md rounded-lg focus:ring-2 focus:ring-teal-500 text-gray-800 placeholder-teal-400 w-full"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-teal-400" />
            </div>
            {posts.map((post) => (
              <Card key={post.id} className="bg-white shadow-lg rounded-xl border border-teal-100 hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="p-6 border-b border-teal-50">
                  <div className="flex items-center space-x-4">
                    <Avatar className="w-12 h-12 border-2 border-teal-200">
                      <AvatarImage src={post.avatar} alt={post.name} />
                      <AvatarFallback>{post.initials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-teal-900">{post.name}</p>
                      <p className="text-sm text-gray-600">{post.time}</p>
                    </div>
                    <div className="ml-auto flex space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => handleUpdate(post.id)} className="text-teal-600 hover:text-teal-800">
                        <Edit className="w-5 h-5" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(post.id)} className="text-red-600 hover:text-red-800">
                        <Trash2 className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <p className="text-gray-700 mb-4 leading-relaxed">{post.text}</p>
                  {post.image && (
                    <img src={post.image} alt="Post image" className="w-full h-64 object-cover rounded-lg mb-4 shadow-md" />
                  )}
                  <div className="flex items-center space-x-6 text-gray-500">
                    <Heart className="w-6 h-6 cursor-pointer hover:text-red-500 transition-colors" />
                    <MessageCircle className="w-6 h-6 cursor-pointer hover:text-teal-500 transition-colors" />
                  </div>
                </CardContent>
                <div className="border-t border-teal-50 p-6">
                  <div className="flex items-center space-x-4">
                    <Avatar className="w-10 h-10 border-2 border-teal-200">
                      <AvatarImage src={post.avatar} alt={post.name} />
                      <AvatarFallback>{post.initials}</AvatarFallback>
                    </Avatar>
                    <Input
                      placeholder="comment to Post, edit, inspect and more."
                      className="flex-1 bg-gray-50 border-none focus:ring-2 focus:ring-teal-500 text-gray-800 placeholder-teal-400"
                    />
                    <Button className="bg-green-500 cursor-pointer hover:bg-green-600 text-white px-4 py-2 rounded-lg">
                      POST NOW
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default PostsCard;