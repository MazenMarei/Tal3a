import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, Eye, Plus } from "lucide-react";
import { Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import LoadingCard from '../loadingPage/loadingCard';

const getSportColor = (sport) => {
  const colors = {
    Football: "bg-green-500",
    Tennis: "bg-yellow-500",
    Basketball: "bg-orange-500",
    Cycling: "bg-blue-500",
    Running: "bg-red-500",
    Swimming: "bg-cyan-500",
  };
  return colors[sport] || "bg-gray-500";
};

const getButtonStyle = (tag) => {
  const styles = {
    Join: "bg-green-500 hover:bg-green-600 text-white",
    Leave: "bg-red-500 hover:bg-red-600 text-white",
    "Can't Go": "bg-red-500 hover:bg-red-600 text-white",
    "View Details": "bg-blue-500 hover:bg-blue-600 text-white",
  };
  return styles[tag] || "bg-gray-500 hover:bg-gray-600 text-white";
};

const EventsCard = () => {
  const context = useData();
  const { events, loading, error } = context || { events: [], loading: false, error: null };

  console.log('EventsCard render:', { context, events, loading, error, isEventsArray: Array.isArray(events) });

  if (loading) {
    console.log('Rendering loading state');
    return <div className="flex items-center mx-auto"><LoadingCard/></div>;
  }
  if (error) {
    console.log('Rendering error state:', error);
    return <div className="flex items-center mx-auto"><LoadingCard/></div>;
  }
  if (!events || !Array.isArray(events) || events.length === 0) {
    console.log('No events available, events:', events);
    return <div>No events available</div>;
  }

  console.log('Rendering events:', events);

  return (
    <div className="flex w-full flex-col items-center justify-center px-0 md:px-4 pb-8 bg-light-green-50 min-h-screen sm:px-6 lg:px-8">
           <div className="flex justify-end w-full mb-2">
        <Link to='/createEvent'>
        <Button
          className="w-50 bg-gradient-to-r items-center my-4 from-green-600 to-green-500 hover:from-green-600 hover:to-green-500 text-white font-semibold py-3 px-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 group/btn cursor-pointer flex items-center justify-center gap-2 mx-auto"
        >
          <span>CREATE EVENT</span>
          <Plus className="h-4 w-3 ml-2 group-hover/btn:translate-x-1 transition-transform" />
        </Button>
      </Link>
      </div>
      <div className="w-full lg:w-280 bg-white  rounded-lg">
        <div className="grid grid-cols-1 gap-6 p-4 sm:gap-8">
          {events.map((event, index) => {
            console.log(`Rendering event ${index}:`, event);
            
            // Create default tags for each event since they're not in your data
            const eventTags = ["Join", "Leave", "View Details"];
            
            return (
              <Card
                key={event.id || index}
                className="group overflow-hidden border border-green-100 shadow-xl shadow-green-100/20 hover:shadow-2xl hover:shadow-green-200/30 transition-all duration-500 transform hover:scale-[1.02] bg-white"
              >
                <div className="relative">
                  <div
                    className="h-48 sm:h-56 bg-cover bg-center relative overflow-hidden"
                    style={{ backgroundImage: `url(${event.image || 'https://via.placeholder.com/150'})` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent group-hover:from-green-900/60 group-hover:via-green-800/20 transition-all duration-500" />
                    <div className="absolute top-2 sm:top-4 right-2 sm:right-4">
                      <Badge className={`${getSportColor(event.type)} border-0 px-2 sm:px-3 py-1 text-xs sm:text-sm font-semibold shadow-lg`}>
                        {event.type || 'Unknown'}
                      </Badge>
                    </div>
                    <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 right-2 sm:right-4 text-white">
                      <div className="flex items-center space-x-1 sm:space-x-2 mb-1 sm:mb-2">
                        <div className="p-0.5 sm:p-1 bg-white/20 backdrop-blur-sm rounded-md">
                          <Calendar className="h-3 sm:h-4 w-3 sm:w-4" />
                        </div>
                        <span className="text-xs sm:text-sm font-semibold bg-black/30 px-1 sm:px-2 py-0.5 sm:py-1 rounded-md backdrop-blur-sm">
                          {event.time || 'No time specified'}
                        </span>
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold mb-1 sm:mb-3 group-hover:text-green-200 transition-colors">
                        {event.title || event.name || 'Untitled Event'}
                      </h3>
                      <div className="flex items-center justify-between text-xs sm:text-sm">
                        <div className="flex items-center space-x-1 sm:space-x-2">
                          <div className="p-0.5 sm:p-1 bg-white/20 backdrop-blur-sm rounded-md">
                            <MapPin className="h-3 sm:h-4 w-3 sm:w-4" />
                          </div>
                          <span className="font-medium">{event.location || 'Unknown Location'}</span>
                        </div>
                        <div className="flex items-center space-x-1 sm:space-x-2 bg-black/30 backdrop-blur-sm px-1 sm:px-3 py-0.5 sm:py-1 rounded-md">
                          <Users className="h-3 sm:h-4 w-3 sm:w-4" />
                          <span className="font-semibold cursor-pointer">
                            {event.going || 0} going{event.maybe > 0 ? `, ${event.maybe}` : ''}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <CardContent className="p-2 sm:p-6">
                  <div className="flex flex-wrap gap-1 sm:gap-3">
                    {eventTags.map((tag , tagIndex) => {
                      // If it's a "View Details" tag, make it a link to event details
                      if (tag === "View Details") {
                        return (
                          <Link key={tagIndex} to={`/events/${event.id}/details`}>
                            <Button
                              size="sm"
                              className={`text-xs cursor-pointer sm:text-sm px-2 sm:px-4 py-1 sm:py-2 rounded-lg sm:rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${getButtonStyle(tag)}`}
                            >
                              <Eye className="h-2 sm:h-3 w-2 sm:w-3 mr-0 sm:mr-2" />
                              {tag}
                            </Button>
                          </Link>
                        );
                      }
                      return (
                        <Button
                          key={tagIndex}
                          size="sm"
                          className={`text-xs sm:text-sm px-2 sm:px-4 py-1 sm:py-2 rounded-lg sm:rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${getButtonStyle(tag)}`}
                        >
                          {tag}
                        </Button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
      <div className="mt-6 sm:mt-12 text-center w-full bg-light-green-50">
        <Link to='/login'>
          <Button className="px-6 sm:px-8 py-2 sm:py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            EXPLORE ALL EVENTS
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default EventsCard;