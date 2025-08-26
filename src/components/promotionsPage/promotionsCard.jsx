import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Gift,
  Star,
  Clock,
  MapPin,
  Store,
  Percent,
  Tag,
  Heart,
  Share,
  Eye,
  Users,
} from "lucide-react";
import { motion } from "framer-motion";

const PromotionsCard = () => {
  // Sample promotions data
  const promotions = [
    {
      id: 1,
      title: "Premium Gym Membership - 3 Months",
      description:
        "Get access to all gym facilities, classes, and personal training sessions",
      originalPrice: 2400,
      discountPercent: 40,
      pointsCost: 800,
      seller: "FitZone Gym",
      category: "Gym Membership",
      location: "New Cairo",
      rating: 4.8,
      reviews: 124,
      image: "/placeholder.jpg",
      expiresIn: "5 days",
      limited: 15,
      tags: ["Popular", "Limited Time"],
    },
    {
      id: 2,
      title: "Nike Training Shoes",
      description:
        "Professional running shoes with advanced cushioning technology",
      originalPrice: 1800,
      discountPercent: 35,
      pointsCost: 650,
      seller: "Sports World",
      category: "Sports Equipment",
      location: "Zamalek",
      rating: 4.9,
      reviews: 89,
      image: "/placeholder.jpg",
      expiresIn: "3 days",
      limited: 8,
      tags: ["New Arrival", "Best Seller"],
    },
    {
      id: 3,
      title: "Personal Training Sessions (5 Sessions)",
      description:
        "One-on-one personal training with certified fitness coaches",
      originalPrice: 1500,
      discountPercent: 50,
      pointsCost: 500,
      seller: "Elite Fitness",
      category: "Training",
      location: "Maadi",
      rating: 4.7,
      reviews: 67,
      image: "/placeholder.jpg",
      expiresIn: "7 days",
      limited: 20,
      tags: ["Hot Deal"],
    },
    {
      id: 4,
      title: "Protein Supplement Bundle",
      description:
        "Complete nutrition package with protein powder and vitamins",
      originalPrice: 800,
      discountPercent: 30,
      pointsCost: 400,
      seller: "NutriStore",
      category: "Supplements",
      location: "Downtown",
      rating: 4.6,
      reviews: 156,
      image: "/placeholder.jpg",
      expiresIn: "10 days",
      limited: 25,
      tags: ["Health", "Nutrition"],
    },
    {
      id: 5,
      title: "Swimming Pool Day Pass (10 Sessions)",
      description:
        "Access to Olympic-size swimming pool with changing facilities",
      originalPrice: 600,
      discountPercent: 45,
      pointsCost: 350,
      seller: "AquaCenter",
      category: "Swimming",
      location: "Heliopolis",
      rating: 4.5,
      reviews: 92,
      image: "/placeholder.jpg",
      expiresIn: "2 days",
      limited: 30,
      tags: ["Summer Special"],
    },
    {
      id: 6,
      title: "Tennis Racket Pro Series",
      description: "Professional tennis racket used by tournament players",
      originalPrice: 2200,
      discountPercent: 25,
      pointsCost: 750,
      seller: "Tennis Pro Shop",
      category: "Sports Equipment",
      location: "Dokki",
      rating: 4.8,
      reviews: 43,
      image: "/placeholder.jpg",
      expiresIn: "8 days",
      limited: 12,
      tags: ["Professional", "Tournament Grade"],
    },
  ];

  const getDiscountColor = (percent) => {
    if (percent >= 50) return "bg-red-500";
    if (percent >= 30) return "bg-orange-500";
    return "bg-green-500";
  };

  const canAfford = (pointsCost) => pointsCost <= 1250; // User's current points

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Available Promotions
          </h2>
          <p className="text-gray-600">
            Redeem amazing discounts with your points
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200"
          >
            <Gift className="h-3 w-3 mr-1" />
            {promotions.length} offers available
          </Badge>
        </div>
      </div>

      {/* Promotions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {promotions.map((promo, index) => (
          <motion.div
            key={promo.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group cursor-pointer">
              <CardHeader className="p-0 relative">
                <div className="relative">
                  <img
                    src={promo.image}
                    alt={promo.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                  {/* Discount Badge */}
                  <Badge
                    className={`absolute top-3 left-3 ${getDiscountColor(
                      promo.discountPercent
                    )} text-white`}
                  >
                    <Percent className="h-3 w-3 mr-1" />
                    {promo.discountPercent}% OFF
                  </Badge>

                  {/* Tags */}
                  <div className="absolute top-3 right-3 flex flex-col space-y-1">
                    {promo.tags.map((tag, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="absolute bottom-3 right-3 flex space-x-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="opacity-80 hover:opacity-100"
                    >
                      <Heart className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="opacity-80 hover:opacity-100"
                    >
                      <Share className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-4">
                <div className="space-y-3">
                  {/* Title and Description */}
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900 group-hover:text-green-600 transition-colors">
                      {promo.title}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                      {promo.description}
                    </p>
                  </div>

                  {/* Seller and Location */}
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Store className="h-4 w-4" />
                      <span>{promo.seller}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span>{promo.location}</span>
                    </div>
                  </div>

                  {/* Rating and Reviews */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium">
                        {promo.rating}
                      </span>
                      <span className="text-sm text-gray-500">
                        ({promo.reviews} reviews)
                      </span>
                    </div>
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <Eye className="h-4 w-4" />
                      <span>{promo.limited} left</span>
                    </div>
                  </div>

                  {/* Price Information */}
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500 line-through">
                          {promo.originalPrice} EGP
                        </span>
                        <span className="text-lg font-bold text-gray-900">
                          {Math.round(
                            promo.originalPrice *
                              (1 - promo.discountPercent / 100)
                          )}{" "}
                          EGP
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Gift className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium text-green-700">
                          {promo.pointsCost} Points
                        </span>
                      </div>
                      {!canAfford(promo.pointsCost) && (
                        <Badge
                          variant="outline"
                          className="text-red-600 border-red-200"
                        >
                          Insufficient Points
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Time and Action */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center space-x-1 text-sm text-orange-600">
                      <Clock className="h-4 w-4" />
                      <span>Expires in {promo.expiresIn}</span>
                    </div>
                  </div>

                  {/* Redeem Button */}
                  <Button
                    className={`w-full ${
                      canAfford(promo.pointsCost)
                        ? "bg-green-600 hover:bg-green-700 text-white"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                    disabled={!canAfford(promo.pointsCost)}
                  >
                    {canAfford(promo.pointsCost) ? (
                      <>
                        <Gift className="h-4 w-4 mr-2" />
                        Redeem Now
                      </>
                    ) : (
                      <>
                        <Tag className="h-4 w-4 mr-2" />
                        Need More Points
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default PromotionsCard;
