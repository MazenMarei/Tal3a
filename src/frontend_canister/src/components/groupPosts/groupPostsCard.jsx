import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from 'react-hot-toast';
import { Search, Mail, Video, Smile, Heart, MessageCircle, Trash2, Edit, ArrowLeft, Users, MapPin, Trophy, Clock, Star, Gift, Check } from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import LoadingCard from '../loadingPage/loadingCard';

const getSkillLevelColor = (level) => {
  switch (level?.toLowerCase()) {
    case 'beginner':
      return 'bg-green-100 text-green-700 border-green-200';
    case 'active group':
      return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    case 'all levels':
      return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'competitive':
      return 'bg-orange-100 text-orange-700 border-orange-200';
    case 'relaxing':
      return 'bg-purple-100 text-purple-700 border-purple-200';
    default:
      return 'bg-gray-100 text-gray-700 border-gray-200';
  }
};

const getSportIcon = (sportType) => {
  switch (sportType?.toLowerCase()) {
    case 'football':
      return '⚽';
    case 'tennis':
      return '🎾';
    case 'basketball':
      return '🏀';
    case 'running':
      return '🏃';
    case 'swimming':
      return '🏊';
    case 'yoga':
      return '🧘';
    default:
      return '🏃';
  }
};

const GroupPostsCard = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const { groups, posts, loading, error } = useData();
  const [isJoined, setIsJoined] = useState(false);

  if (loading) {
    return <div className="flex items-center mx-auto"><LoadingCard size="large" color="#4CAF50" textColor="#fff" /></div>;
  }

  if (error) {
    return <div className="flex items-center mx-auto"><LoadingCard size="large" color="#4CAF50" textColor="#fff" /></div>;
  }

  // Find the current group
  const currentGroup = groups?.find(group => group.id === groupId || group.id === parseInt(groupId));
  
  if (!currentGroup) {
    return (
      <div className="container mx-auto p-4 max-w-6xl">
        <div className="text-center py-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Group Not Found</h2>
          <Link to="/groups">
            <Button className="bg-teal-600 hover:bg-teal-700 text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Groups
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Filter posts for this specific group (assuming posts have a groupId property)
  const groupPosts = posts?.filter(post => post.groupId === groupId || post.groupId === parseInt(groupId)) || [];

  const handleDelete = (id) => console.log(`Delete post with id: ${id}`);
  const handleUpdate = (id) => console.log(`Update post with id: ${id}`);

  const handleJoinGroup = () => {
    setIsJoined(true);
    toast.success(`Congratulations! You have successfully joined ${currentGroup.name}! 🎉`, {
      duration: 4000,
      position: 'top-center',
      style: {
        background: '#10B981',
        color: 'white',
        fontWeight: 'bold',
        borderRadius: '12px',
        padding: '16px',
      },
    });
  };

  // Sample recent posts for demo (you can replace this with actual recent posts)
  const recentPosts = [
    { id: 1, author: "Ahmed Hassan", content: "Great training session today! 💪", time: "2 hours ago" },
    { id: 2, author: "Sara Mohamed", content: "Looking forward to tomorrow's match!", time: "5 hours ago" },
    { id: 3, author: "Omar Ali", content: "New training schedule is up!", time: "1 day ago" },
    { id: 4, author: "Fatma Nour", content: "Thanks for the amazing game everyone! 🏆", time: "2 days ago" }
  ];

  return (
    <>
      <Helmet>
        <title>{currentGroup.name} - Posts | Egypt Sports Community</title>
        <meta name="description" content={`View posts and discussions from ${currentGroup.name} sports group. ${currentGroup.sportType} group in ${currentGroup.location}.`} />
        <meta name="keywords" content={`${currentGroup.name}, ${currentGroup.sportType}, ${currentGroup.location}, sports group, Egypt sports`} />
        <meta property="og:title" content={`${currentGroup.name} - Group Posts`} />
        <meta property="og:description" content={`Join the conversation in ${currentGroup.name} - ${currentGroup.sportType} group`} />
        <meta property="og:image" content={currentGroup.image} />
      </Helmet>

      <div className="container mx-auto p-4 max-w-6xl bg-gradient-to-br from-gray-50 min-h-screen">
        {/* Group Header */}
        <Card className="bg-white shadow-lg rounded-xl border border-teal-100 mb-6 overflow-hidden">
          <div className="relative">
            <img
              src={currentGroup.image || 'https://via.placeholder.com/800x200'}
              alt={currentGroup.name}
              className="w-full h-48 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            <div className="absolute top-4 left-4">
              <Button
                onClick={() => navigate(-1)}
                className="bg-white/90 backdrop-blur-sm hover:bg-white text-gray-800 rounded-full p-2"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </div>
            <div className="absolute top-4 right-4">
              <div className="bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg">
                <span className="text-2xl">{getSportIcon(currentGroup.sportType)}</span>
              </div>
            </div>
          </div>
          
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">{currentGroup.name}</h1>
                <Badge className={`${getSkillLevelColor(currentGroup.skillLevel)} font-medium text-sm px-3 py-1 border mb-4`}>
                  {currentGroup.skillLevel}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                <span className="text-lg font-semibold text-gray-700">{currentGroup.rating || '4.9'}</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-teal-500" />
                <span className="font-medium">{currentGroup.location || 'Egypt'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-teal-500" />
                <span className="font-medium">{currentGroup.memberCount || 10} members</span>
              </div>
              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4 text-teal-500" />
                <span className="font-medium">{currentGroup.sportType ||'Gold'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Gift className="h-4 w-4 text-teal-500" />
                <span className="font-medium">{currentGroup.prize || 'Champion'}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Post Creation Card */}
            <Card className="bg-white shadow-lg rounded-xl border border-teal-100">
              <CardHeader className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 w-full">
                  <Avatar className="w-12 h-12 border-2 border-teal-200">
                    <AvatarImage src="https://api.dicebear.com/6.x/initials/svg?seed=MM" alt="Current User" />
                    <AvatarFallback>MM</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 w-full">
                    <Input
                      placeholder={`Share something with ${currentGroup.name}...`}
                      className="w-full bg-gray-50 border-none focus:ring-2 focus:ring-teal-500 text-gray-800 placeholder-teal-400 p-2 sm:p-3 rounded-lg"
                    />
                  </div>
                  <div className="flex flex-wrap justify-end space-x-2 sm:space-x-3 mt-2 sm:mt-0">
                    <Mail className="w-6 h-6 text-teal-600 cursor-pointer hover:text-teal-800" />
                    <Video className="w-6 h-6 text-teal-600 cursor-pointer hover:text-teal-800" />
                    <Smile className="w-6 h-6 text-teal-600 cursor-pointer hover:text-teal-800" />
                    <Link to='/createPost'>
                    <Button className="bg-teal-600 cursor-pointer hover:bg-teal-700 text-white rounded-full px-4 py-2 transition-all duration-200 text-sm sm:text-base">
                      POST TO GROUP
                    </Button>
                    </Link>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Search Bar */}
            <div className="relative mb-6">
              <Input
                placeholder={`Search posts in ${currentGroup.name}`}
                className="pl-12 pr-4 py-3 bg-white shadow-md rounded-lg focus:ring-2 focus:ring-teal-500 text-gray-800 placeholder-teal-400 w-full"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-teal-400" />
            </div>

            {/* Posts */}
            {groupPosts.length === 0 ? (
              <Card className="bg-white shadow-lg rounded-xl border border-teal-100 p-8 text-center">
                <div className="text-gray-500">
                  <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-semibold mb-2">No posts yet</h3>
                  <p className="text-sm">Be the first to share something with this group!</p>
                </div>
              </Card>
            ) : (
              groupPosts.map((post) => (
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
                        <Badge variant="outline" className="text-xs mt-1 text-teal-600 border-teal-200">
                          {currentGroup.name} Member
                        </Badge>
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
                      <div className="flex items-center space-x-1">
                        <Heart className="w-6 h-6 cursor-pointer hover:text-red-500 transition-colors" />
                        <span className="text-sm">{post.likes || 0}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MessageCircle className="w-6 h-6 cursor-pointer hover:text-teal-500 transition-colors" />
                        <span className="text-sm">{post.comments || 0}</span>
                      </div>
                    </div>
                  </CardContent>
                  <div className="border-t border-teal-50 p-6">
                    <div className="flex items-center space-x-4">
                      <Avatar className="w-10 h-10 border-2 border-teal-200">
                        <AvatarImage src="https://api.dicebear.com/6.x/initials/svg?seed=MM" alt="Current User" />
                        <AvatarFallback>MM</AvatarFallback>
                      </Avatar>
                      <Input
                        placeholder="Write a comment..."
                        className="flex-1 bg-gray-50 border-none focus:ring-2 focus:ring-teal-500 text-gray-800 placeholder-teal-400"
                      />
                      <Button className="bg-green-500 cursor-pointer hover:bg-green-600 text-white px-4 py-2 rounded-lg">
                        COMMENT
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="bg-white shadow-lg rounded-xl border border-teal-100">
              <CardHeader className="p-4">
                <h3 className="font-semibold text-gray-800">Group Info</h3>
              </CardHeader>
              <CardContent className="p-4 pt-0 space-y-3">
                <div className="text-sm text-gray-600 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Members:</span> 
                    <span>{currentGroup.memberCount || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Location:</span> 
                    <span className="text-right">{currentGroup.location || 'Unknown'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Prize:</span> 
                    <span>{currentGroup.prize || 'No prize'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Posts:</span> 
                    <span>{groupPosts.length}</span>
                  </div>
                </div>
                <Button 
                  onClick={handleJoinGroup}
                  disabled={isJoined}
                  className={`w-full transition-all duration-200 ${
                    isJoined 
                      ? 'bg-green-500 hover:bg-green-500 cursor-default' 
                      : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600'
                  } text-white`}
                >
                  {isJoined ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Joined
                    </>
                  ) : (
                    'Join Group'
                  )}
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg rounded-xl border border-teal-100">
              <CardHeader className="p-4">
                <h3 className="font-semibold text-gray-800">Recent Posts</h3>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="space-y-4">
                  {recentPosts.slice(0, 4).map((post) => (
                    <div key={post.id} className="border-l-2 border-teal-200 pl-3 py-2">
                      <div className="flex items-start space-x-2">
                        <Avatar className="w-6 h-6 flex-shrink-0">
                          <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${post.author}`} />
                          <AvatarFallback className="text-xs">{post.author.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-gray-800 truncate">{post.author}</p>
                          <p className="text-xs text-gray-600 mt-1 line-clamp-2">{post.content}</p>
                          <p className="text-xs text-gray-400 mt-1">{post.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {recentPosts.length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-4">No recent posts</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default GroupPostsCard;