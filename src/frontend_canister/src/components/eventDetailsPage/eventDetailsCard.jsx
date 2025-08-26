import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from 'react-hot-toast';
import { 
  Search, 
  Mail, 
  Video, 
  Smile, 
  Heart, 
  MessageCircle, 
  Trash2, 
  Edit, 
  ArrowLeft, 
  Users, 
  MapPin, 
  Calendar, 
  Clock,
  Star,
  Gift,
  Check,
  Eye,
  Share2,
  Bookmark
} from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { useEventParticipation } from '../../context/EventsParticipationContext';
import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import LoadingCard from '../loadingPage/loadingCard';

const getSportColor = (sport) => {
  const colors = {
    Football: "bg-green-500 text-white",
    Tennis: "bg-yellow-500 text-white",
    Basketball: "bg-orange-500 text-white",
    Cycling: "bg-blue-500 text-white",
  };
  return colors[sport] || "bg-gray-500 text-white";
};

const EventDetailsCard = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { events, posts, loading, error } = useData();
  const { participationData } = useEventParticipation();
  const [isBookmarked, setIsBookmarked] = useState(false);

  if (loading) {
    return <div className="flex items-center mx-auto"><LoadingCard size="large" color="#4CAF50" textColor="#fff" /></div>;
  }

  if (error) {
    return <div className="flex items-center mx-auto"><LoadingCard size="large" color="#4CAF50" textColor="#fff" /></div>;
  }

  // Find the current event
  const currentEvent = events?.find(event => event.id === eventId || event.id === parseInt(eventId));
  
  if (!currentEvent) {
    return (
      <div className="container mx-auto p-4 max-w-6xl">
        <div className="text-center py-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Event Not Found</h2>
          <Link to="/events">
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Events
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Filter posts for this specific event
  const eventPosts = posts?.filter(post => post.eventId === eventId || post.eventId === parseInt(eventId)) || [];

  // Find participation data for this event
  const eventParticipation = participationData.find(part => part.eventId === eventId || part.eventId === parseInt(eventId));

  const handleDelete = (id) => console.log(`Delete post with id: ${id}`);
  const handleUpdate = (id) => console.log(`Update post with id: ${id}`);

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    toast.success(isBookmarked ? 'Event removed from bookmarks' : 'Event bookmarked!', {
      duration: 2000,
      position: 'top-center',
    });
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Event link copied to clipboard!', {
      duration: 2000,
      position: 'top-center',
    });
  };

  // Get recent event posts or use sample data
  const recentEventPosts = eventPosts.length > 0 
    ? eventPosts.slice(0, 4).map(post => ({
        id: post.id,
        author: post.name,
        content: post.text,
        time: post.time
      }))
    : [
        { id: 1, author: "Ahmed Ali", content: "Can't wait for this event! 🏃‍♂️", time: "1 hour ago" },
        { id: 2, author: "Sara Hassan", content: "Who else is going? Let's meet up!", time: "3 hours ago" },
        { id: 3, author: "Omar Mohamed", content: "This looks amazing! Count me in! 🔥", time: "5 hours ago" },
        { id: 4, author: "Fatma Ahmed", content: "Perfect timing for the weekend! ⚽", time: "1 day ago" }
      ];

  return (
    <>
      <Helmet>
        <title>{currentEvent.title} - Event Details | Egypt Sports Community</title>
        <meta name="description" content={`Join ${currentEvent.title} - ${currentEvent.sport} event in ${currentEvent.location}. ${currentEvent.going} people attending.`} />
        <meta name="keywords" content={`${currentEvent.title}, ${currentEvent.sport}, ${currentEvent.location}, sports event, Egypt sports`} />
        <meta property="og:title" content={`${currentEvent.title} - Sports Event`} />
        <meta property="og:description" content={`Join us for ${currentEvent.title} in ${currentEvent.location}`} />
        <meta property="og:image" content={currentEvent.image} />
      </Helmet>

      <div className="container mx-auto p-4 max-w-6xl min-h-screen">
        {/* Event Header */}
        <Card className="bg-white shadow-lg rounded-xl border border-green-100 mb-6 overflow-hidden">
          <div className="relative">
            <img
              src={currentEvent.image || 'https://via.placeholder.com/800x300'}
              alt={currentEvent.title}
              className="w-full h-64 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
            
            {/* Header Controls */}
            <div className="absolute top-4 left-4 flex gap-2">
              <Button
                onClick={() => navigate(-1)}
                className="bg-white/90 backdrop-blur-sm hover:bg-white text-gray-800 rounded-full p-2"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </div>
            
            <div className="absolute top-4 right-4 flex gap-2">
              <Button
                onClick={handleShare}
                className="bg-white/90 backdrop-blur-sm hover:bg-white text-gray-800 rounded-full p-2"
              >
                <Share2 className="w-5 h-5" />
              </Button>
              <Button
                onClick={handleBookmark}
                className={`backdrop-blur-sm rounded-full p-2 ${
                  isBookmarked ? 'bg-yellow-500 text-white' : 'bg-white/90 hover:bg-white text-gray-800'
                }`}
              >
                <Bookmark className="w-5 h-5" />
              </Button>
              <div className="bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg">
                <Badge className={`${getSportColor(currentEvent.sport)} border-0 px-3 py-1`}>
                  {currentEvent.sport}
                </Badge>
              </div>
            </div>

            {/* Event Title and Basic Info */}
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <h1 className="text-3xl md:text-4xl font-bold mb-3">{currentEvent.title}</h1>
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2 bg-black/30 backdrop-blur-sm rounded-lg px-3 py-1">
                  <Calendar className="h-4 w-4" />
                  <span className="font-medium">{currentEvent.time}</span>
                </div>
                <div className="flex items-center gap-2 bg-black/30 backdrop-blur-sm rounded-lg px-3 py-1">
                  <MapPin className="h-4 w-4" />
                  <span className="font-medium">{currentEvent.location}</span>
                </div>
                <div className="flex items-center gap-2 bg-black/30 backdrop-blur-sm rounded-lg px-3 py-1">
                  <Users className="h-4 w-4" />
                  <span className="font-medium">{currentEvent.going} going</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

{/* Participation Box */}
<Card className="bg-white shadow-none rounded-2xl mb-6 max-w-6xl  mx-auto">
  <CardContent className="p-6 sm:p-8 lg:p-10">
    {eventParticipation ? (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow duration-200">
          <span className="block text-sm font-semibold text-green-600 mb-1">Description</span>
          <span className="text-gray-700 text-sm">{eventParticipation.description || 'No description available'}</span>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow duration-200">
          <span className="block text-sm font-semibold text-green-600 mb-1">Date</span>
          <span className="text-gray-700 text-sm">{new Date(eventParticipation.event_date * 1000).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow duration-200">
          <span className="block text-sm font-semibold text-green-600 mb-1">Duration</span>
          <span className="text-gray-700 text-sm">{eventParticipation.duration_hours} hours</span>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow duration-200">
          <span className="block text-sm font-semibold text-green-600 mb-1">Location</span>
          <span className="text-gray-700 text-sm">{`${eventParticipation.location.governorate}, ${eventParticipation.location.city}, ${eventParticipation.location.description}`}</span>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow duration-200">
          <span className="block text-sm font-semibold text-green-600 mb-1">Sport</span>
          <span className="text-gray-700 text-sm">{eventParticipation.sport}</span>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow duration-200">
          <span className="block text-sm font-semibold text-green-600 mb-1">Max Participants</span>
          <span className="text-gray-700 text-sm">{eventParticipation.max_participants || 'Unlimited'}</span>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow duration-200">
          <span className="block text-sm font-semibold text-green-600 mb-1">Cost per Person</span>
          <span className="text-gray-700 text-sm">{eventParticipation.cost_per_person ? `${eventParticipation.cost_per_person} EGP` : 'Free'}</span>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow duration-200">
          <span className="block text-sm font-semibold text-green-600 mb-1">Requirements</span>
          <span className="text-gray-700 text-sm">{eventParticipation.requirements.join(', ') || 'None'}</span>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow duration-200">
          <span className="block text-sm font-semibold text-green-600 mb-1">Status</span>
          <Badge className="bg-green-50 text-green-700 border-green-200 font-medium text-xs px-2 py-1 border rounded-full">
            {eventParticipation.status}
          </Badge>
        </div>
      </div>
    ) : (
      <p className="text-gray-500 text-sm text-center">No participation details available for this event.</p>
    )}
  </CardContent>
</Card>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Post Creation Card */}
            <Card className="bg-white shadow-lg rounded-xl border border-green-100">
              <CardHeader className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 w-full">
                  <Avatar className="w-12 h-12 border-2 border-green-200">
                    <AvatarImage src="https://api.dicebear.com/6.x/initials/svg?seed=MM" alt="Current User" />
                    <AvatarFallback>MM</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 w-full">
                    <Input
                      placeholder={`Share your thoughts about ${currentEvent.title}...`}
                      className="w-full bg-green-50 border-none focus:ring-2 focus:ring-green-500 text-gray-800 placeholder-green-400 p-2 sm:p-3 rounded-lg"
                    />
                  </div>
                  <div className="flex flex-wrap justify-end space-x-2 sm:space-x-3 mt-2 sm:mt-0">
                    <Mail className="w-6 h-6 text-green-600 cursor-pointer hover:text-green-800" />
                    <Video className="w-6 h-6 text-green-600 cursor-pointer hover:text-green-800" />
                    <Smile className="w-6 h-6 text-green-600 cursor-pointer hover:text-green-800" />
                    <Link to='/createPost'>
                      <Button className="bg-green-600 cursor-pointer hover:bg-green-700 text-white rounded-full px-4 py-2 transition-all duration-200 text-sm sm:text-base">
                        POST TO EVENT
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Search Bar */}
            <div className="relative mb-6">
              <Input
                placeholder={`Search discussions about ${currentEvent.title}`}
                className="pl-12 pr-4 py-3 bg-white shadow-md rounded-lg focus:ring-2 focus:ring-green-500 text-gray-800 placeholder-green-400 w-full"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-400" />
            </div>

            {/* Posts */}
            {eventPosts.length === 0 ? (
              <Card className="bg-white shadow-lg rounded-xl border border-green-100 p-8 text-center">
                <div className="text-gray-500">
                  <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-semibold mb-2">No discussions yet</h3>
                  <p className="text-sm">Be the first to share your thoughts about this event!</p>
                </div>
              </Card>
            ) : (
              eventPosts.map((post) => (
                <Card key={post.id} className="bg-white shadow-lg rounded-xl border border-green-100 hover:shadow-xl transition-shadow duration-300">
                  <CardHeader className="p-6 border-b border-green-50">
                    <div className="flex items-center space-x-4">
                      <Avatar className="w-12 h-12 border-2 border-green-200">
                        <AvatarImage src={post.avatar} alt={post.name} />
                        <AvatarFallback>{post.initials}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-green-900">{post.name}</p>
                        <p className="text-sm text-gray-600">{post.time}</p>
                        <Badge variant="outline" className="text-xs mt-1 text-green-600 border-green-200">
                          Event Participant
                        </Badge>
                      </div>
                      <div className="ml-auto flex space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => handleUpdate(post.id)} className="text-green-600 hover:text-green-800">
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
                        <MessageCircle className="w-6 h-6 cursor-pointer hover:text-green-500 transition-colors" />
                        <span className="text-sm">{post.comments || 0}</span>
                      </div>
                    </div>
                  </CardContent>
                  <div className="border-t border-green-50 p-6">
                    <div className="flex items-center space-x-4">
                      <Avatar className="w-10 h-10 border-2 border-green-200">
                        <AvatarImage src="https://api.dicebear.com/6.x/initials/svg?seed=MM" alt="Current User" />
                        <AvatarFallback>MM</AvatarFallback>
                      </Avatar>
                      <Input
                        placeholder="Write a comment..."
                        className="flex-1 bg-green-50 border-none focus:ring-2 focus:ring-green-500 text-gray-800 placeholder-green-400"
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
            <Card className="bg-white shadow-lg rounded-xl border border-green-100">
              <CardHeader className="p-4">
                <h3 className="font-semibold text-gray-800">Event Info</h3>
              </CardHeader>
              <CardContent className="p-4 pt-0 space-y-3">
                <div className="text-sm text-gray-600 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Going:</span> 
                    <span className="text-green-600 font-semibold">{currentEvent.going || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Maybe:</span> 
                    <span className="text-yellow-600 font-semibold">{currentEvent.maybe || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Sport:</span> 
                    <span>{currentEvent.sport || 'Unknown'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Posts:</span> 
                    <span>{eventPosts.length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg rounded-xl border border-green-100">
              <CardHeader className="p-4">
                <h3 className="font-semibold text-gray-800">Recent Activity</h3>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="space-y-4">
                  {recentEventPosts.slice(0, 4).map((post) => (
                    <div key={post.id} className="border-l-2 border-green-200 pl-3 py-2">
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
                  {recentEventPosts.length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-4">No recent activity</p>
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

export default EventDetailsCard;