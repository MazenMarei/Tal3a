import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';
import { useData } from '../../context/DataContext';
import LoadingCard from '../loadingPage/loadingCard';

const Step1Location = () => {
  const [governorate, setGovernorate] = useState('');
  const [city, setCity] = useState('');
  const { locations, loading, error } = useData() || { locations: [], loading: false, error: null };

  const sortedGovernorates = locations
    .map((loc) => loc.name)
    .sort((a, b) => a.localeCompare(b));
  const sortedCities = governorate
    ? locations
        .find((loc) => loc.name === governorate)
        ?.cities.map((city) => city.name)
        .sort((a, b) => a.localeCompare(b)) || []
    : [];

  const handleUseCurrentLocation = async () => {
    try {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            try {
              let closestGov = null;
              let closestCity = null;
              let minDistance = Infinity;

              locations.forEach((gov) => {
                const govDistance = Math.sqrt(
                  Math.pow(position.coords.latitude - gov.lat, 2) +
                  Math.pow(position.coords.longitude - gov.lng, 2)
                );
                if (govDistance < minDistance) {
                  minDistance = govDistance;
                  closestGov = gov.name;
                  gov.cities.forEach((city) => {
                    const cityDistance = Math.sqrt(
                      Math.pow(position.coords.latitude - city.lat, 2) +
                      Math.pow(position.coords.longitude - city.lng, 2)
                    );
                    if (cityDistance < minDistance) {
                      minDistance = cityDistance;
                      closestCity = city.name;
                    }
                  });
                }
              });

              if (closestGov) {
                setGovernorate(closestGov);
                if (closestCity) {
                  setCity(closestCity);
                }
              }
            } catch (error) {
              console.error('Error processing geolocation data:', error);
            }
          },
          (error) => {
            console.error('Geolocation error:', error);
          }
        );
      } else {
        console.error('Geolocation not supported');
      }
    } catch (error) {
      console.error('Error in handleUseCurrentLocation:', error);
    }
  };

  // Disable Continue button if no location is selected or still loading
  const isContinueDisabled = !governorate || !city || loading;

  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto text-center py-8">
        <LoadingCard size="large" color="#4CAF50" textColor="#fff" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-4xl mx-auto text-center py-8">
        <p className="text-lg text-red-600">{error}</p>
      </div>
    );
  }

  if (!locations || !Array.isArray(locations) || locations.length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto text-center py-8">
        <p className="text-lg text-gray-600">No locations available</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="relative bg-gradient-to-br from-green-900 via-green-600 to-green-700 rounded-3xl p-8 md:p-12 mb-8 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-64 h-64 md:w-80 md:h-80 rounded-full border-8 border-white/30 relative">
              <div className="absolute inset-0 rounded-full">
                <div className="absolute top-0 left-1/2 w-px h-full bg-white/30 transform -translate-x-1/2"></div>
                <div className="absolute top-1/2 left-0 w-full h-px bg-white/30 transform -translate-y-1/2"></div>
                <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 border border-white/30 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
        <div className="relative z-10 text-center text-white">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Welcome to <span className="text-emerald-400">Tal3a</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Let's set up your sports profile up!
          </p>
          <div className="flex justify-center items-center space-x-2 mb-4">
            <span className="text-sm font-medium">Step 1 of 4</span>
          </div>
          <div className="flex justify-center space-x-2">
            <div className="w-3 h-3 bg-white rounded-full"></div>
            <div className="w-3 h-3 bg-white/30 rounded-full"></div>
            <div className="w-3 h-3 bg-white/30 rounded-full"></div>
            <div className="w-3 h-3 bg-white/30 rounded-full"></div>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-2xl p-8 shadow-lg">
        <h2 className="text-2xl md:text-3xl font-bold text-emerald-500 mb-8 text-center">
          Where are you located?
        </h2>
        <div className="max-w-md mx-auto space-y-6">
          <div className="relative">
            <select
              value={governorate}
              onChange={(e) => {
                setGovernorate(e.target.value);
                setCity(''); // Reset city when governorate changes
              }}
              className="w-full appearance-none py-3 px-4 pr-8 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-emerald-500 focus:outline-none text-gray-800 bg-gray-50 transition-all"
            >
              <option value="" disabled>Select Governorate</option>
              {sortedGovernorates.map((gov) => (
                <option key={gov} value={gov}>
                  {gov}
                </option>
              ))}
            </select>
          </div>
          <div className="relative">
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              disabled={!governorate}
              className="w-full appearance-none py-3 px-4 pr-8 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-emerald-500 focus:outline-none text-gray-800 bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="" disabled>Select City</option>
              {sortedCities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>
          <div className="text-center">
            <span className="text-gray-500 font-medium">OR</span>
          </div>
          <Button
            variant="outline"
            className="w-full py-3 text-lg font-medium border-2 border-emerald-500 text-emerald-600 hover:bg-emerald-50 rounded-xl"
            onClick={handleUseCurrentLocation}
          >
            <MapPin className="w-5 h-5 mr-2" />
            Use Current Location
          </Button>
        </div>
        <div className="flex justify-between mt-12">
          <Button
            variant="outline"
            className="px-8 py-3 cursor-pointer text-lg font-medium border-2 border-gray-300 text-gray-600 hover:bg-gray-50 rounded-xl"
            disabled
          >
            Skip
          </Button>
          <Link to="/login-flow/sports">
            <Button
              className="px-8 py-3 cursor-pointer text-lg font-medium bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl"
              disabled={isContinueDisabled}
            >
              Continue
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Step1Location;