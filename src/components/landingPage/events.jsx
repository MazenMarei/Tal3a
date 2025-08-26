import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Calendar, Clock, Users } from 'lucide-react';
import eventImage1 from '../../assets/images/event-1.jpg';
import eventImage2 from '../../assets/images/event-2.jpg';
import eventImage3 from '../../assets/images/event-3.jpg';

const Events = () => {
  const events = [
    {
      id: 1,
      title: 'Football Practice',
      group: 'Downtown Football Club',
      time: 'Today, 6:00 PM',
      attending: 12,
      status: 'Going',
      image: eventImage1,
      bgColor: 'from-blue-600 to-blue-800',
    },
    {
      id: 2,
      title: 'Morning Run',
      group: 'Running Team',
      time: 'Today, 8:00 AM',
      attending: 8,
      status: 'Maybe',
      image: eventImage2,
      bgColor: 'from-gray-600 to-gray-800',
    },
    {
      id: 3,
      title: 'Tennis Tournament',
      group: 'Tennis Group',
      time: 'Saturday, 2:00 PM',
      attending: 15,
      status: 'Going',
      image: eventImage3,
      bgColor: 'from-green-600 to-green-800',
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Going':
        return 'bg-teal-500 hover:bg-teal-600';
      case 'Maybe':
        return 'bg-yellow-500 hover:bg-yellow-600';
      default:
        return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  return (
    <section className="bg-gray-100 py-8 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-teal-500 mb-2">Upcoming Events</h2>
        </div>
        <div className="space-y-4 sm:space-y-6">
          {events.map((event) => (
            <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-40 sm:h-48 md:h-52">
                <div className={`absolute inset-0 bg-gradient-to-r ${event.bgColor}`}>
                  <div className="absolute inset-0 bg-black/50"></div>
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover mix-blend-overlay"
                  />
                </div>
                <CardContent className="relative z-10 h-full flex flex-col sm:flex-row sm:items-center sm:justify-between text-white p-4 sm:p-6">
                  <div className="flex items-center space-x-3 sm:space-x-4">
                    <Calendar className="h-5 w-5 sm:h-6 sm:w-6" />
                    <div>
                      <h3 className="text-lg sm:text-xl md:text-2xl font-bold">{event.title}</h3>
                      <p className="text-xs sm:text-sm md:text-base opacity-90">
                        {event.group}, {event.attending} attending
                      </p>
                      <div className="flex items-center space-x-2 mt-2 sm:hidden">
                        <Clock className="h-4 w-4" />
                        <span className="text-xs">{event.time}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mt-4 sm:mt-0">
                    <div className="text-left sm:text-right hidden sm:block">
                      <div className="flex items-center space-x-2 mb-2">
                        <Clock className="h-4 w-4" />
                        <span className="text-sm">{event.time}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4" />
                        <span className="text-sm">{event.attending} attending</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 sm:space-x-2 justify-start sm:justify-end">
                      <Button
                        size="sm"
                        className={`${getStatusColor(event.status)} text-white text-xs sm:text-sm py-1 sm:py-2 px-2 sm:px-4`}
                      >
                        {event.status}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-white/20 border-white/30 text-white hover:bg-white/30 text-xs sm:text-sm py-1 sm:py-2 px-2 sm:px-4"
                      >
                        Maybe
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-white/20 border-white/30 text-white hover:bg-white/30 text-xs sm:text-sm py-1 sm:py-2 px-2 sm:px-4"
                      >
                        Can't Go
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Events;