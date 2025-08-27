import { useAuth, useUser } from "./useCanisterHooks";

export const useProfile = () => {
  const { isAuthenticated, login, logout, principal } = useAuth();
  const { user, loading, createUser, updateProfile } = useUser();

  // Create compatibility layer for existing components
  const profileData = user
    ? {
        name: user.username || "User",
        username: `@${user.username || "user"}`,
        bio: user.bio || "Sports enthusiast",
        email: `${user.username || "user"}@tal3a.com`,
        city: user.city?.name || "Cairo",
        governorate: user.governorate?.name || "Cairo Governorate",
        profileImage: user.avatar_url
          ? URL.createObjectURL(new Blob([user.avatar_url]))
          : `https://api.dicebear.com/6.x/initials/svg?seed=${
              user.username || "U"
            }`,
        favoriteSports: user.sports || ["Football"],
        freeDays: ["Monday", "Wednesday", "Friday", "Saturday"],
        rating: 4.8,
        level: 5,
        points: 2450,
        stats: [
          { label: "Events joined", value: "24", icon: null },
          { label: "Events hosted", value: "8", icon: null },
          { label: "Community rating", value: "4.8", icon: null },
          { label: "Active hours", value: "156", icon: null },
          { label: "Points earned", value: "2450", icon: null },
        ],
        walletPrincipal: {
          label: "Wallet Principal",
          value: "Connected",
          icon: null,
        },
        walletId: principal?.toString() || "Not connected",
        insightData: [
          { day: "Mon", activity: 85, distance: 12.5, calories: 450, time: 75 },
          { day: "Tue", activity: 45, distance: 6.2, calories: 220, time: 40 },
          {
            day: "Wed",
            activity: 95,
            distance: 18.3,
            calories: 680,
            time: 120,
          },
          { day: "Thu", activity: 30, distance: 4.1, calories: 180, time: 30 },
          { day: "Fri", activity: 88, distance: 15.7, calories: 590, time: 95 },
          {
            day: "Sat",
            activity: 92,
            distance: 20.2,
            calories: 720,
            time: 135,
          },
          { day: "Sun", activity: 25, distance: 3.8, calories: 140, time: 25 },
        ],
        monthlyData: [
          { month: "Jan", events: 12, points: 850, hours: 45 },
          { month: "Feb", events: 18, points: 1200, hours: 62 },
          { month: "Mar", events: 15, points: 980, hours: 53 },
          { month: "Apr", events: 22, points: 1450, hours: 78 },
          { month: "May", events: 19, points: 1300, hours: 68 },
          { month: "Jun", events: 25, points: 1680, hours: 89 },
        ],
        sportDistribution: [
          { name: "Football", value: 45, color: "#10B981" },
          { name: "Running", value: 30, color: "#3B82F6" },
          { name: "Cycling", value: 20, color: "#F59E0B" },
          { name: "Others", value: 5, color: "#8B5CF6" },
        ],
        availableSports: [
          "Football",
          "Basketball",
          "Tennis",
          "Running",
          "Cycling",
          "Swimming",
          "Boxing",
          "Yoga",
          "Weightlifting",
          "Volleyball",
          "Badminton",
          "Table Tennis",
          "Golf",
          "Cricket",
          "Rugby",
          "Martial Arts",
          "Rock Climbing",
          "Hiking",
          "Dancing",
          "Skiing",
        ],
        weekDays: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        governorates: [
          "Cairo Governorate",
          "Alexandria Governorate",
          "Giza Governorate",
        ],
      }
    : null;

  const getUserInitials = () => {
    if (!user?.username) return "U";
    return user.username
      .split(" ")
      .map((name) => name.charAt(0))
      .join("")
      .toUpperCase();
  };

  const getFavoriteSportsWithIcons = () => {
    const sportIcons = {
      Football: "⚽",
      Basketball: "🏀",
      Tennis: "🎾",
      Running: "🏃",
      Cycling: "🚴",
      Swimming: "🏊",
    };

    const sports = user?.sports || ["Football"];
    return sports.map((sport) => ({
      name: sport,
      icon: sportIcons[sport] || "🏃",
      color: "text-green-500",
    }));
  };

  // Compatibility state object
  const state = {
    actor: null, // This would be available through useAuth if needed
    authClient: null,
    isAuthenticated,
    principal: principal?.toString() || "",
  };

  return {
    profileData,
    isAuthenticated,
    loading,
    state,
    login,
    logout,
    updateProfile: (data) => updateProfile(data),
    getUserInitials,
    getFavoriteSportsWithIcons,
    createUser,
    resetProfile: () => {}, // Placeholder for compatibility
  };
};
