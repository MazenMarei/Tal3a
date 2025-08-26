import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Filter, MapPin, X } from 'lucide-react';

const Sidebar = ({ isOpen = true, onClose }) => {
  const [selectedSports, setSelectedSports] = useState(['football', 'tennis']);
  const [selectedCities, setSelectedCities] = useState(['London', 'Paris']);
  const sportTypes = [
    { id: 'football', label: 'Football' },
    { id: 'tennis', label: 'Tennis' },
    { id: 'basketball', label: 'Basketball' },
    { id: 'running', label: 'Running' }
  ];
  const cities = [
    { id: 'London', label: 'London' },
    { id: 'Paris', label: 'Paris' },
    { id: 'New York', label: 'New York' },
    { id: 'Tokyo', label: 'Tokyo' }
  ];
  const toggleSport = (sportId) => {
    setSelectedSports(prev =>
      prev.includes(sportId)
        ? prev.filter(id => id !== sportId)
        : [...prev, sportId]
    );
  };
  const toggleCity = (cityId) => {
    setSelectedCities(prev =>
      prev.includes(cityId)
        ? prev.filter(id => id !== cityId)
        : [...prev, cityId]
    );
  };
  const clearAllFilters = () => {
    setSelectedSports([]);
    setSelectedCities([]);
  };
  const getActiveFiltersCount = () => {
    return selectedSports.length + selectedCities.length;
  };

  return (
    <div className={`w-80 bg-cream-100 border-r border-gray-200 h-screen overflow-y-auto transition-all duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="p-6">
        <Card className="bg-white/90 backdrop-blur-sm shadow-md border border-gray-100 rounded-2xl">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-semibold text-gray-700 flex items-center gap-2">
                <Filter className="h-5 w-5 text-green-500" />
                Filters
              </CardTitle>
              {getActiveFiltersCount() > 0 && (
                <div className="px-2 py-1 bg-green-500 text-white text-xs font-medium rounded-full">
                  {getActiveFiltersCount()}
                </div>
              )}
              {onClose && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="lg:hidden hover:bg-gray-100"
                >
                  <X className="h-4 w-4 text-gray-500" />
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <div className="w-1.5 h-5 bg-green-500 rounded"></div>
                Sport Type
                {selectedSports.length > 0 && (
                  <span className="ml-auto px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                    {selectedSports.length}
                  </span>
                )}
              </h3>
              <div className="space-y-3">
                {sportTypes.map((sport) => (
                  <div
                    key={sport.id}
                    className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                    onClick={() => toggleSport(sport.id)}
                  >
                    <Checkbox
                      checked={selectedSports.includes(sport.id)}
                      onCheckedChange={() => toggleSport(sport.id)}
                      className="border-gray-300 rounded"
                    />
                    <label className="text-sm font-medium text-gray-700 cursor-pointer">
                      {sport.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-green-500" />
                City Location
                {selectedCities.length > 0 && (
                  <span className="ml-auto px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                    {selectedCities.length}
                  </span>
                )}
              </h3>
              <div className="space-y-3">
                {cities.map((city) => (
                  <div
                    key={city.id}
                    className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                    onClick={() => toggleCity(city.id)}
                  >
                    <Checkbox
                      checked={selectedCities.includes(city.id)}
                      onCheckedChange={() => toggleCity(city.id)}
                      className="border-gray-300 rounded"
                    />
                    <label className="text-sm font-medium text-gray-700 cursor-pointer">
                      {city.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <div className="pt-4 border-t border-gray-200">
              <Button
                onClick={clearAllFilters}
                disabled={getActiveFiltersCount() === 0}
                className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white font-medium py-2 px-4 rounded-md shadow-sm transition-colors disabled:cursor-not-allowed"
              >
                {getActiveFiltersCount() > 0
                  ? `Clear All Filters (${getActiveFiltersCount()})`
                  : 'No Filters Applied'
                }
              </Button>
            </div>
            {getActiveFiltersCount() > 0 && (
              <div className="bg-green-50 p-3 rounded-lg border border-green-100">
                <h4 className="text-sm font-medium text-green-700 mb-2">Active Filters:</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedSports.map(sportId => (
                    <span key={sportId} className="px-2 py-1 bg-green-500 text-white text-xs rounded-full">
                      {sportTypes.find(s => s.id === sportId)?.label}
                    </span>
                  ))}
                  {selectedCities.map(cityId => (
                    <span key={cityId} className="px-2 py-1 bg-green-500 text-white text-xs rounded-full">
                      {cities.find(c => c.id === cityId)?.label}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Sidebar;