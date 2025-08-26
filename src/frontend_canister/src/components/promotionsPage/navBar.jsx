import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Percent, Gift, Tag } from "lucide-react";

const NavBar = () => {
  return (
    <nav className="bg-cream-100/95 backdrop-blur-sm border-b border-gray-200 h-75 flex justify-between items-center  shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Percent className="h-6 w-6 text-green-600" />
              <h1 className="text-xl font-bold text-gray-900">
                Promotions & Discounts
              </h1>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              <Gift className="h-3 w-3 mr-1" />
              Special Offers
            </Badge>
          </div>

          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm" className="hidden sm:flex">
              <Tag className="h-4 w-4 mr-2" />
              My Redeemed Offers
            </Button>
            <div className="bg-green-50 px-3 py-1 rounded-full">
              <span className="text-sm font-medium text-green-700">
                Your Points: 1,250
              </span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
