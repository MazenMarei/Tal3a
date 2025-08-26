import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { MapPin, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import footballGroupImage from '../../assets/images/footballGroup.jpg';
import tennisGroupImage from '../../assets/images/tennisGroup.jpg';
import runningGroupImage from '../../assets/images/runningGroup.jpg';

const Groups = () => {
  const groups = [
    {
      id: 1,
      name: 'Football Club',
      location: 'Downtown',
      members: 45,
      image: footballGroupImage,
    },
    {
      id: 2,
      name: 'Tennis Group',
      location: 'Westside',
      members: 23,
      image: tennisGroupImage,
    },
    {
      id: 3,
      name: 'Running Team',
      location: 'Park Area',
      members: 65,
      image: runningGroupImage,
    },
  ];

  return (
    <section className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-green-600">Suggested Groups For You</h2>
          <div className="flex space-x-2">
            <Button variant="outline" size="icon" className="rounded-full border-gray-300 text-gray-600 hover:bg-gray-100 cursor-pointer">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="rounded-full border-gray-300 text-gray-600 hover:bg-gray-100 cursor-pointer">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {groups.map((group) => (
            <Card key={group.id} className="overflow-hidden rounded-lg shadow-lg hover:shadow-lg transition-shadow duration-300 ">
              <div className="relative h-50">
                <img
                  src={group.image}
                  alt={group.name}
                  className="w-full h-55 object-cover rounded-t-lg"
                />
              </div>
              <CardContent className="p-6 text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{group.name}</h3>
                <div className="flex flex-col items-center text-gray-600 space-y-1 mb-4">
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{group.location}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{group.members} members</span>
                  </div>
                </div>
                <Button className="w-full bg-green-500 hover:bg-green-600 text-white rounded-full py-2 cursor-pointer">
                  Join Group
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Groups;