import { useState, useRef } from 'react';
import {Link} from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, Calendar, Users, Clock, Copy, Award, Wallet, Activity, TrendingUp } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { useProfile } from '../../context/ProfileContext';

const ProfileCard = () => {
  const { profileData, updateProfile, getFavoriteSportsWithIcons, getUserInitials } = useProfile();
  const [selectedChart, setSelectedChart] = useState('activity');
  const hasToastShown = useRef(false);

  const handleShare = () => {
    const referralUrl = `https://example.com/app/refer/${profileData.username}`;
    navigator.clipboard.writeText(referralUrl).then(() => {
      updateProfile({ points: profileData.points + 100 });
    }).catch(() => {
      console.log('Failed to copy referral link');
    });
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-xl shadow-lg">
          <p className="font-semibold text-gray-900 mb-2">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-sm text-gray-600 capitalize">{entry.dataKey}:</span>
              <span className="text-sm font-medium text-gray-900">
                {entry.value}
                {entry.dataKey === 'distance' && ' km'}
                {entry.dataKey === 'calories' && ' cal'}
                {entry.dataKey === 'time' && ' min'}
                {entry.dataKey === 'activity' && '%'}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const chartConfigs = {
    activity: {
      title: "Weekly Activity Overview",
      subtitle: "Track your daily performance metrics",
      component: (
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={profileData.insightData}>
            <defs>
              <linearGradient id="activityGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#10B981" stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="caloriesGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis 
              dataKey="day" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6B7280', fontSize: 12 }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6B7280', fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              type="monotone" 
              dataKey="activity" 
              stroke="#10B981" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#activityGradient)" 
            />
            <Area 
              type="monotone" 
              dataKey="calories" 
              stroke="#F59E0B" 
              strokeWidth={2}
              fillOpacity={0.6} 
              fill="url(#caloriesGradient)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      )
    },
    performance: {
      title: "Monthly Performance Trends",
      subtitle: "Events, points, and active hours over time",
      component: (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={profileData.monthlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis 
              dataKey="month" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6B7280', fontSize: 12 }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6B7280', fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line 
              type="monotone" 
              dataKey="events" 
              stroke="#3B82F6" 
              strokeWidth={3}
              dot={{ fill: '#3B82F6', strokeWidth: 2, r: 6 }}
              activeDot={{ r: 8, stroke: '#3B82F6', strokeWidth: 2, fill: '#fff' }}
            />
            <Line 
              type="monotone" 
              dataKey="points" 
              stroke="#10B981" 
              strokeWidth={3}
              dot={{ fill: '#10B981', strokeWidth: 2, r: 6 }}
              activeDot={{ r: 8, stroke: '#10B981', strokeWidth: 2, fill: '#fff' }}
            />
            <Line 
              type="monotone" 
              dataKey="hours" 
              stroke="#F59E0B" 
              strokeWidth={3}
              dot={{ fill: '#F59E0B', strokeWidth: 2, r: 6 }}
              activeDot={{ r: 8, stroke: '#F59E0B', strokeWidth: 2, fill: '#fff' }}
            />
          </LineChart>
        </ResponsiveContainer>
      )
    },
    sports: {
      title: "Sport Activity Distribution",
      subtitle: "Breakdown of time spent in different sports",
      component: (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={profileData.sportDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={5}
                dataKey="value"
              >
                {profileData.sportDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => [`${value}%`, 'Percentage']}
                labelStyle={{ color: '#1F2937', fontWeight: 'bold' }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-col justify-center space-y-4">
            {profileData.sportDistribution.map((sport, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: sport.color }}
                  />
                  <span className="font-medium text-gray-900">{sport.name}</span>
                </div>
                <span className="text-gray-600 font-semibold">{sport.value}%</span>
              </div>
            ))}
          </div>
        </div>
      )
    },
    weekly: {
      title: "Weekly Distance & Time Analysis",
      subtitle: "Detailed breakdown of your weekly activities",
      component: (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={profileData.insightData} barGap={10}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis 
              dataKey="day" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6B7280', fontSize: 12 }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6B7280', fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="distance" 
              fill="#3B82F6" 
              radius={[4, 4, 0, 0]}
              name="Distance (km)"
            />
            <Bar 
              dataKey="time" 
              fill="#10B981" 
              radius={[4, 4, 0, 0]}
              name="Time (min)"
            />
          </BarChart>
        </ResponsiveContainer>
      )
    }
  };

  const chartOptions = [
    { key: 'activity', label: 'Activity Overview', icon: Activity },
    { key: 'performance', label: 'Performance', icon: TrendingUp },
    { key: 'sports', label: 'Sports Distribution', icon: Star },
    { key: 'weekly', label: 'Weekly Analysis', icon: Calendar }
  ];

  // Get favorite sports with icons from context
  const favoriteSportsWithIcons = getFavoriteSportsWithIcons();

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 bg-white shadow-sm border-0 shadow-xl">
          <CardContent className="p-6 text-center">
            <div className="mb-4">
              <div className="w-24 h-24 rounded-full mx-auto bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white text-2xl font-bold">
                {getUserInitials()}
              </div>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-1">
              {profileData.name}
            </h2>
            <div className="flex items-center justify-center gap-3 mb-4">
              <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">
                <Star className="w-3 h-3 mr-1 fill-current" />
                {profileData.rating} Rating
              </Badge>
              <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                Level {profileData.level}
              </Badge>
            </div>
            <p className="text-gray-600 text-sm mb-6 leading-relaxed">
              {profileData.bio}
            </p>
            <Link to='/editProfile'>
            <Button className="w-full cursor-pointer my-3 bg-green-600 hover:bg-green-700 text-white">
              Edit Profile
            </Button>
            </Link>
            <Link to='/posts'>
            <Button className="w-full cursor-pointer bg-green-500 hover:bg-green-700 text-white">
              Show Posts
            </Button>
            </Link>
          </CardContent>
        </Card>
        
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-white shadow-xl border-0">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Full Name</label>
                  <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-900">{profileData.name}</span>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Email Address</label>
                    <div className="mt-1 p-3 bg-gray-50 rounded-lg flex items-center">
                      <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                      <span className="text-gray-900 text-sm">{profileData.email}</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Location</label>
                    <div className="mt-1 p-3 bg-gray-50 rounded-lg flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      <span className="text-gray-900 text-sm">{profileData.city}, {profileData.governorate}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-xl border-0">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Favorite Sports</h3>
              <div className="grid grid-cols-3 gap-4">
                {favoriteSportsWithIcons.map((sport, index) => (
                  <div key={index} className="text-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="text-2xl mb-2">{sport.icon}</div>
                    <span className={`text-sm font-medium ${sport.color}`}>
                      {sport.name}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="bg-white shadow-xl border-0">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
            <div className="space-y-4">
              {profileData.stats.map((stat, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <stat.icon className="w-4 h-4 text-gray-400 mr-3" />
                    <span className="text-gray-600 text-sm">{stat.label}</span>
                  </div>
                  <span className="font-semibold text-gray-900">{stat.value}</span>
                </div>
              ))}
              
              <div className="pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center">
                    <profileData.walletPrincipal.icon className="w-4 h-4 text-green-600 mr-3" />
                    <span className="text-green-700 text-sm font-medium">{profileData.walletPrincipal.label}</span>
                  </div>
                  <span className="font-semibold text-green-800">{profileData.walletPrincipal.value}</span>
                </div>
                <div className="mt-4">
                  <label className="text-xs font-medium text-gray-400 mb-1 block">Principal ID</label>
                  <div className="flex items-center p-2 bg-gray-50 rounded-lg">
                    <span className="text-gray-900 font-mono text-xs flex-1">
                      {profileData.walletId}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-2 p-1 hover:bg-gray-200"
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white shadow-xl border-0 lg:col-span-3">
          <CardContent className="p-8">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {chartConfigs[selectedChart].title}
                </h3>
                <p className="text-gray-600">
                  {chartConfigs[selectedChart].subtitle}
                </p>
              </div>
              <div className="flex flex-wrap gap-2 mt-4 lg:mt-0">
                {chartOptions.map((option) => (
                  <Button
                    key={option.key}
                    onClick={() => setSelectedChart(option.key)}
                    variant={selectedChart === option.key ? "default" : "outline"}
                    size="sm"
                    className={`flex items-center space-x-2 ${
                      selectedChart === option.key 
                        ? 'bg-green-600 hover:bg-green-700 text-white border-green-600' 
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <option.icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{option.label}</span>
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-2xl">
              {chartConfigs[selectedChart].component}
            </div>
            
            <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-xl">
                <div className="text-2xl font-bold text-blue-600">89.2km</div>
                <div className="text-sm text-blue-600 font-medium">Total Distance</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-xl">
                <div className="text-2xl font-bold text-green-600">42h 15m</div>
                <div className="text-sm text-green-600 font-medium">Active Time</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-xl">
                <div className="text-2xl font-bold text-orange-600">2,980</div>
                <div className="text-sm text-orange-600 font-medium">Calories Burned</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-xl">
                <div className="text-2xl font-bold text-purple-600">68%</div>
                <div className="text-sm text-purple-600 font-medium">Week Average</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="bg-white shadow-xl border-0">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Days</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {profileData.freeDays.map((day, index) => (
              <div key={index} className="flex items-center p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl border border-green-200">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-3 animate-pulse"></div>
                <span className="text-green-800 font-medium">{day}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileCard;