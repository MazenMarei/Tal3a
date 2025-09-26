import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Filter,
  Tag,
  Store,
  Percent,
  Clock,
  Gift,
  Star,
  MapPin,
} from "lucide-react";

const SideBar = () => {
  const categories = [
    { name: "Sports Equipment", count: 24, icon: Gift },
    { name: "Gym Memberships", count: 18, icon: Store },
    { name: "Sports Apparel", count: 32, icon: Tag },
    { name: "Health Supplements", count: 15, icon: Star },
    { name: "Training Sessions", count: 12, icon: Clock },
  ];

  const discountRanges = [
    { range: "10-25% OFF", count: 45 },
    { range: "25-50% OFF", count: 32 },
    { range: "50-75% OFF", count: 18 },
    { range: "75%+ OFF", count: 8 },
  ];

  const locations = [
    { city: "Cairo", count: 52 },
    { city: "Alexandria", count: 28 },
    { city: "Giza", count: 35 },
    { city: "Luxor", count: 12 },
  ];

  return (
    <div className="w-80 bg-white shadow-sm border-r border-gray-200 h-full">
      <div className="p-4 space-y-6">
        {/* Filter Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <Filter className="h-5 w-5 mr-2 text-green-600" />
            Filters
          </h2>
          <Button
            variant="ghost"
            size="sm"
            className="text-green-600 hover:text-green-700"
          >
            Clear All
          </Button>
        </div>

        {/* Categories */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-700 flex items-center">
              <Tag className="h-4 w-4 mr-2" />
              Categories
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              {categories.map((category, index) => {
                const IconComponent = category.icon;
                return (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md cursor-pointer transition-colors"
                  >
                    <div className="flex items-center space-x-2">
                      <IconComponent className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-700">
                        {category.name}
                      </span>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {category.count}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Discount Range */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-700 flex items-center">
              <Percent className="h-4 w-4 mr-2" />
              Discount Range
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              {discountRanges.map((discount, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md cursor-pointer transition-colors"
                >
                  <span className="text-sm text-gray-700">
                    {discount.range}
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {discount.count}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Location */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-700 flex items-center">
              <MapPin className="h-4 w-4 mr-2" />
              Location
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              {locations.map((location, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md cursor-pointer transition-colors"
                >
                  <span className="text-sm text-gray-700">{location.city}</span>
                  <Badge variant="outline" className="text-xs">
                    {location.count}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Points Info */}
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4">
            <div className="text-center">
              <Gift className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <h3 className="text-sm font-medium text-green-800 mb-1">
                Your Points
              </h3>
              <p className="text-2xl font-bold text-green-700 mb-2">1,250</p>
              <p className="text-xs text-green-600">
                Redeem offers with your points!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SideBar;
