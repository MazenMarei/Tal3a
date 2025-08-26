import { Users, MapPin, Trophy, Clock, Star, ArrowRight, Plus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
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

const GroupsCard = () => {
  const context = useData();
  const { groups, loading, error } = context || { groups: [], loading: false, error: null };

  console.log('GroupsCard render:', { context, groups, loading, error, isGroupsArray: Array.isArray(groups) });

  if (loading) {
    console.log('Rendering loading state');
    return <div className="flex items-center mx-auto"><LoadingCard size="large" color="#4CAF50" textColor="#fff" /></div>;
  }
  if (error) {
    console.log('Rendering error state:', error);
    return <div className="flex items-center mx-auto"> <LoadingCard size="large" color="#4CAF50" textColor="#fff" /></div>;
  }
  if (!groups || !Array.isArray(groups) || groups.length === 0) {
    console.log('No groups available, groups:', groups);
    return <div>No groups available</div>;
  }

  console.log('Rendering groups:', groups);

  return (
    <div className="flex-1 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-green-600 mb-2">TOP SPORTS GROUPS</h2>
              </div>
              <div className="flex items-center justify-end gap-2">
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <select className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500">
                  <option>Most Popular</option>
                  <option>Newest</option>
                  <option>Rating</option>
                  <option>Distance</option>
                </select>
              </div>
              <Link to='/createGroup'>
        <Button
          className="w-50 bg-gradient-to-r items-center my-4 from-green-600 to-green-500 hover:from-green-600 hover:to-green-500 text-white font-semibold py-3 px-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 group/btn cursor-pointer flex items-center justify-center gap-2 mx-auto"
        >
          <span>CREATE GROUP</span>
          <Plus className="h-4 w-3 ml-2 group-hover/btn:translate-x-1 transition-transform" />
        </Button>
      </Link>
      </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {groups.map((group, index) => {
              console.log(`Rendering group ${index}:`, group);
              return (
                <Card
                  key={group.id || index}
                  className="group bg-white shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border-0 rounded-2xl hover:-translate-y-1"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={group.image || 'https://via.placeholder.com/400x300'}
                      alt={group.name || 'Unnamed Group'}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4">
                      <div className="bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg">
                        <span className="text-xl">{getSportIcon(group.sportType)}</span>
                      </div>
                    </div>
                    <div className="absolute top-4 right-4">
                      <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 shadow-lg flex items-center gap-1">
                        <Star className="h-3 w-3 text-yellow-500 fill-current" />
                        <span className="text-xs font-semibold text-slate-700">{group.rating || 'N/A'}</span>
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <h3 className="font-bold text-xl text-slate-800 group-hover:text-emerald-600 transition-colors">
                          {group.name || 'Unnamed Group'}
                        </h3>
                        <Badge className={`${getSkillLevelColor(group.skillLevel)} font-medium text-xs px-3 py-1 border`}>
                          {group.skillLevel || 'Unknown'}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm text-slate-600">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-emerald-500" />
                          <span className="font-medium">{group.location || 'Unknown Location'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-emerald-500" />
                          <span className="font-medium">{group.memberCount || 0} members</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Trophy className="h-4 w-4 text-emerald-500" />
                          <span className="font-medium">{group.sportType || 'Unknown Sport'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Clock className="h-4 w-4 text-emerald-500" />
                          <span className="font-medium">{group.nextEvent || 'No event scheduled'}</span>
                        </div>
                      </div>
                      <Link to={`/groups/${group.id || index}/posts`}>
                        <Button
                          className="w-full cursor-pointer bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 group/btn"
                        >
                          <span>Join Group</span>
                          <ArrowRight className="h-4 w-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
      <Link to='/login'>
        <Button
          className="w-100 bg-gradient-to-r items-center my-4 from-green-600 to-green-500 hover:from-green-600 hover:to-green-500 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 group/btn cursor-pointer flex items-center justify-center gap-2 mx-auto"
        >
          <span>EXPLORE ALL GROUPS</span>
          <ArrowRight className="h-4 w-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
        </Button>
      </Link>
    </div>
  );
};

export default GroupsCard;