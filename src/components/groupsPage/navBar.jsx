import { Search, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const NavBar = () => {
  return (
    <header className="bg-cream-100/95 backdrop-blur-sm border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-6 py-12 sm:py-16">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-4 mb-3">
            <div className="p-2.5 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg shadow-sm">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-semibold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent tracking-tight">
              Discover Sports Groups
            </h1>
          </div>
          <p className="text-base sm:text-lg font-medium text-gray-500 text-pretty max-w-2xl mx-auto">
            Connect with like-minded athletes and find your perfect sports community.
          </p>
        </div>
        <div className="relative max-w-3xl mx-auto">
        <div class="relative group">
  <div class="absolute inset-0 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl opacity-10 group-hover:opacity-20 transition-opacity duration-200"></div>
  <div class="relative bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
    <div class="flex items-center">
      <div class="pl-5 pr-3">
        <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <input
        type="text"
        placeholder="Search groups by name, sport, or location..."
        class="flex-1 outline-none border-none bg-white text-gray-700 placeholder:text-gray-400 focus:ring-0 focus:ring-offset-0 py-3.5 text-sm sm:text-base"
      />
      <button
        class="m-1.5 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white px-5 py-2 rounded-lg font-medium shadow-xs hover:shadow-sm transition-all duration-200"
      >
        Search
      </button>
    </div>
  </div>
</div>
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            {['Football', 'Tennis', 'Basketball', 'Running', 'Swimming', 'Yoga'].map((sport) => (
              <Link
                key={sport}
                to={`/groups/${sport.toLowerCase()}`}
                className="px-4 py-2 bg-cream-50 hover:bg-green-50 hover:text-green-700 text-gray-600 text-sm font-medium rounded-full border border-gray-200 hover:border-green-200 transition-colors duration-200"
              >
                {sport}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};

export default NavBar;