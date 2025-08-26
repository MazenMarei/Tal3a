import { Card, CardContent } from '../ui/card';
import groupsImage from '../../assets/images/groups.jpg';
import eventsImage from '../../assets/images/events.jpg';
import findGroupImage from '../../assets/images/findGroup.jpg';

const Hero = () => {
  return (
    <section className="bg-gray-100 py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
            Welcome Back, <span className="text-teal-500">Username!</span>
          </h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="relative overflow-hidden h-48 group cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-800">
              <div className="absolute inset-0 bg-black/40"></div>
              <img src={groupsImage} alt="Groups" className="absolute inset-0 w-full h-full object-cover mix-blend-overlay" />
            </div>
            <CardContent className="relative z-10 h-full flex flex-col justify-center items-center text-white">
              <div className="text-5xl font-bold mb-2">12</div>
              <div className="text-xl font-semibold">Groups</div>
            </CardContent>
          </Card>
          <Card className="relative overflow-hidden h-48 group cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-purple-800">
              <div className="absolute inset-0 bg-black/40"></div>
              <img src={eventsImage} alt="Events" className="absolute inset-0 w-full h-full object-cover mix-blend-overlay" />
            </div>
            <CardContent className="relative z-10 h-full flex flex-col justify-center items-center text-white">
              <div className="text-5xl font-bold mb-2">3</div>
              <div className="text-xl font-semibold">Events</div>
            </CardContent>
          </Card>
          <Card className="relative overflow-hidden h-48 group cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-900">
              <div className="absolute inset-0 bg-black/40"></div>
              <img src={findGroupImage} alt="Find Groups" className="absolute inset-0 w-full h-full object-cover mix-blend-overlay" />
            </div>
            <CardContent className="relative z-10 h-full flex flex-col justify-center items-center text-white">
              <div className="text-2xl font-bold mb-2">Find Groups Near You</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Hero;
