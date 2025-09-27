import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClock,
  faFilter,
  faGift,
  faHeart,
  faMapMarkerAlt,
  faShare,
  faShoppingCart,
  faStar,
  faTrophy,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { faHeart as faHeartOutline } from "@fortawesome/free-regular-svg-icons";

// Mock promotions data
const mockPromotions = [
  {
    id: 1,
    title: "خصم 30% على جميع الأحذية الرياضية",
    description:
      "احصل على خصم كبير على مجموعة واسعة من الأحذية الرياضية لجميع الأنشطة",
    discount: 30,
    originalPrice: 500,
    discountedPrice: 350,
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop",
    category: "أحذية",
    brand: "نايكي",
    location: "القاهرة - المعادي",
    expiryDate: "2024-02-15T23:59:59Z",
    isLiked: false,
    likes: 45,
    isPremium: true,
    rating: 4.8,
    reviews: 124,
  },
  {
    id: 2,
    title: "عضوية مجانية لمدة شهر في نادي فيتنس بلس",
    description: "استمتع بشهر كامل من التمارين الرياضية مجاناً في أحدث الأجهزة",
    discount: 100,
    originalPrice: 200,
    discountedPrice: 0,
    image:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
    category: "عضويات",
    brand: "فيتنس بلس",
    location: "الجيزة - المهندسين",
    expiryDate: "2024-02-10T23:59:59Z",
    isLiked: true,
    likes: 89,
    isPremium: false,
    rating: 4.6,
    reviews: 67,
  },
  {
    id: 3,
    title: "حقيبة رياضية مع إكسسوارات",
    description: "حقيبة رياضية عملية مع زجاجة مياه ومنشفة وحافظة للهاتف",
    discount: 25,
    originalPrice: 120,
    discountedPrice: 90,
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop",
    category: "إكسسوارات",
    brand: "أديداس",
    location: "الإسكندرية - سموحة",
    expiryDate: "2024-02-20T23:59:59Z",
    isLiked: false,
    likes: 23,
    isPremium: false,
    rating: 4.3,
    reviews: 34,
  },
  {
    id: 4,
    title: "دروس سباحة جماعية - خصم 40%",
    description: "تعلم السباحة مع مدربين محترفين في مجموعات صغيرة",
    discount: 40,
    originalPrice: 300,
    discountedPrice: 180,
    image:
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop",
    category: "دروس",
    brand: "أكاديمية السباحة",
    location: "القاهرة - مدينة نصر",
    expiryDate: "2024-01-25T23:59:59Z",
    isLiked: true,
    likes: 156,
    isPremium: true,
    rating: 4.9,
    reviews: 203,
  },
  {
    id: 5,
    title: "مجموعة أوزان منزلية",
    description: "مجموعة كاملة من الأوزان والدمبلز لتمارين منزلية فعالة",
    discount: 20,
    originalPrice: 800,
    discountedPrice: 640,
    image:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
    category: "معدات",
    brand: "هوم جيم",
    location: "الجيزة - الدقي",
    expiryDate: "2024-03-01T23:59:59Z",
    isLiked: false,
    likes: 78,
    isPremium: false,
    rating: 4.4,
    reviews: 92,
  },
  {
    id: 6,
    title: "تطبيق تغذية رياضية - اشتراك سنوي",
    description: "خطط تغذية مخصصة للرياضيين مع متابعة يومية",
    discount: 50,
    originalPrice: 240,
    discountedPrice: 120,
    image:
      "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&h=300&fit=crop",
    category: "تطبيقات",
    brand: "نيوتري فيت",
    location: "أونلاين",
    expiryDate: "2024-02-28T23:59:59Z",
    isLiked: false,
    likes: 34,
    isPremium: true,
    rating: 4.7,
    reviews: 145,
  },
];

const categories = [
  "جميع العروض",
  "أحذية",
  "عضويات",
  "إكسسوارات",
  "دروس",
  "معدات",
  "تطبيقات",
];

export const Route = createFileRoute("/(authenticated)/promotions")({
  component: PromotionsPage,
});

function PromotionsPage() {
  const [promotions, setPromotions] = useState(mockPromotions);
  const [selectedCategory, setSelectedCategory] = useState("جميع العروض");
  const [sortBy, setSortBy] = useState<
    "discount" | "expiry" | "price" | "rating"
  >("discount");

  const filteredPromotions = promotions.filter(
    (promotion) =>
      selectedCategory === "جميع العروض" ||
      promotion.category === selectedCategory
  );

  const sortedPromotions = [...filteredPromotions].sort((a, b) => {
    switch (sortBy) {
      case "discount":
        return b.discount - a.discount;
      case "expiry":
        return (
          new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime()
        );
      case "price":
        return a.discountedPrice - b.discountedPrice;
      case "rating":
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

  const toggleLike = (id: number) => {
    setPromotions((prev) =>
      prev.map((promotion) =>
        promotion.id === id
          ? {
              ...promotion,
              isLiked: !promotion.isLiked,
              likes: promotion.isLiked
                ? promotion.likes - 1
                : promotion.likes + 1,
            }
          : promotion
      )
    );
  };

  const formatTimeLeft = (expiryDate: string) => {
    const now = new Date().getTime();
    const expiry = new Date(expiryDate).getTime();
    const diffInHours = Math.floor((expiry - now) / (1000 * 60 * 60));

    if (diffInHours < 0) return "منتهي الصلاحية";
    if (diffInHours < 24) return `${diffInHours} ساعة متبقية`;
    const days = Math.floor(diffInHours / 24);
    return `${days} ${days === 1 ? "يوم" : "أيام"} متبقية`;
  };

  const getDiscountBadgeColor = (discount: number) => {
    if (discount >= 50) return "bg-red-500";
    if (discount >= 30) return "bg-orange-500";
    if (discount >= 20) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <FontAwesomeIcon
            icon={faGift}
            className="text-3xl text-primary ml-3"
          />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            العروض والتخفيضات
          </h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          اكتشف أفضل العروض على المنتجات والخدمات الرياضية
        </p>
      </div>

      {/* Filters and Sorting */}
      <div className="flex flex-col lg:flex-row gap-4 mb-8">
        {/* Categories */}
        <div className="flex-1">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full font-medium transition-all duration-200 ${
                  selectedCategory === category
                    ? "bg-primary text-white shadow-lg"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-3">
          <FontAwesomeIcon icon={faFilter} className="text-gray-500" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="discount">أعلى خصم</option>
            <option value="expiry">الأقرب انتهاءً</option>
            <option value="price">الأقل سعراً</option>
            <option value="rating">الأعلى تقييماً</option>
          </select>
        </div>
      </div>

      {/* Promotions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedPromotions.map((promotion) => (
          <div
            key={promotion.id}
            className="flex  flex-col bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700 group"
          >
            {/* Image and Badges */}
            <div className="relative">
              <img
                src={promotion.image}
                alt={promotion.title}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />

              {/* Discount Badge */}
              <div
                className={`absolute top-3 right-3 ${getDiscountBadgeColor(promotion.discount)} text-white px-3 py-1 rounded-full font-bold text-sm shadow-lg`}
              >
                {promotion.discount === 100
                  ? "مجاني"
                  : `${promotion.discount}%-`}
              </div>

              {/* Premium Badge */}
              {promotion.isPremium && (
                <div className="absolute top-3 left-3 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center">
                  <FontAwesomeIcon icon={faTrophy} className="ml-1" />
                  مميز
                </div>
              )}

              {/* Like Button */}
              <button
                onClick={() => toggleLike(promotion.id)}
                className="absolute bottom-3 right-3 w-10 h-10 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-all duration-200"
              >
                <FontAwesomeIcon
                  icon={promotion.isLiked ? faHeart : faHeartOutline}
                  className={`text-lg ${promotion.isLiked ? "text-red-500" : "text-gray-400"}`}
                />
              </button>
            </div>

            {/* Content */}
            <div className="p-5 flex flex-col justify-between h-full">
              <div>
                {/* Category and Rating */}
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full">
                    {promotion.category}
                  </span>
                  <div className="flex items-center">
                    <FontAwesomeIcon
                      icon={faStar}
                      className="text-yellow-400 text-sm ml-1"
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {promotion.rating} ({promotion.reviews})
                    </span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2 line-clamp-2">
                  {promotion.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                  {promotion.description}
                </p>

                {/* Brand and Location */}
                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-500 mb-3">
                  <span className="font-medium">{promotion.brand}</span>
                  <div className="flex items-center">
                    <FontAwesomeIcon icon={faMapMarkerAlt} className="ml-1" />
                    <span>{promotion.location}</span>
                  </div>
                </div>
              </div>
              {/* Price */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-bold text-primary">
                    {promotion.discountedPrice === 0
                      ? "مجاني"
                      : `${promotion.discountedPrice} ج.م`}
                  </span>
                  {promotion.discountedPrice > 0 && (
                    <span className="text-gray-500 dark:text-gray-400 line-through text-lg">
                      {promotion.originalPrice} ج.م
                    </span>
                  )}
                </div>
              </div>

              {/* Time Left */}
              <div className="flex items-center text-sm mb-4">
                <FontAwesomeIcon icon={faClock} className="text-red-500 ml-2" />
                <span className="text-red-600 dark:text-red-400 font-medium">
                  {formatTimeLeft(promotion.expiryDate)}
                </span>
              </div>
              <div>
                {/* Actions */}
                <div className="flex gap-3">
                  <button className="flex-1 bg-primary text-white px-4 py-2 rounded-lg font-medium hover:!bg-primary/90 hover:scale-101 hover:cursor-pointer transition-all duration-200 flex items-center justify-center">
                    <FontAwesomeIcon icon={faShoppingCart} className="ml-2" />
                    احصل على العرض
                  </button>
                  <button className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <FontAwesomeIcon icon={faShare} />
                  </button>
                </div>

                {/* Likes Count */}
                <div className="flex items-center justify-center mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                  <FontAwesomeIcon
                    icon={faUsers}
                    className="text-gray-400 ml-2"
                  />
                  <span className="text-sm text-gray-500 dark:text-gray-500">
                    {promotion.likes} شخص أعجبهم هذا العرض
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {sortedPromotions.length === 0 && (
        <div className="text-center py-16">
          <FontAwesomeIcon
            icon={faGift}
            className="text-6xl text-gray-300 dark:text-gray-600 mb-4"
          />
          <h3 className="text-2xl font-medium text-gray-500 dark:text-gray-400 mb-2">
            لا توجد عروض
          </h3>
          <p className="text-gray-400 dark:text-gray-500">
            لا توجد عروض في هذه الفئة حالياً
          </p>
        </div>
      )}
    </div>
  );
}
