import React, { createContext, useContext, useState, useEffect } from "react";
import { Calendar, Users, Star, Clock, Award, Wallet } from "lucide-react";
import { AuthClient } from "@dfinity/auth-client";
import { canisterId as useCanisterId } from "declarations/user_canister/index.js";
import { createActor } from "declarations/user_canister";

const network = import.meta.env.DFX_NETWORK;
console.log(import.meta.env);

const identityProvider =
  network == "ic"
    ? "https://identity.ic0.app"
    : "http://rdmx6-jaaaa-aaaaa-aaadq-cai.localhost:4943"; // Local

const nfidProvider =
  network == "ic"
    ? "https://nfid.one"
    : "http://rdmx6-jaaaa-aaaaa-aaadq-cai.localhost:4943"; // Local

const ProfileContext = createContext();

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
};

export const ProfileProvider = ({ children }) => {
  const [state, setState] = useState({
    actor: undefined,
    authClient: undefined,
    isAuthenticated: false,
    principal: "",
  });

  const [profileData, setProfileData] = useState({
    name: "Ahmed Hassan",
    username: "@ahmed_hassan",
    bio: "A passionate football player and sports enthusiast from Cairo. Love organizing community events and bringing athletes together",
    email: "ahmed.hassan.example@gmail.com",
    city: "Cairo",
    governorate: "Cairo Governorate",
    profileImage: "https://api.dicebear.com/6.x/initials/svg?seed=AH",

    favoriteSports: ["Football", "Running", "Cycling"],
    freeDays: ["Monday", "Wednesday", "Friday", "Saturday"],

    rating: 4.8,
    level: 5,
    points: 2450,

    stats: [
      { label: "Events joined", value: "24", icon: Calendar },
      { label: "Events hosted", value: "8", icon: Users },
      { label: "Community rating", value: "4.8", icon: Star },
      { label: "Active hours", value: "156", icon: Clock },
      { label: "Points earned", value: "2450", icon: Award },
    ],

    walletPrincipal: {
      label: "Wallet Principal",
      value: "Connected",
      icon: Wallet,
    },
    walletId: "rdmx6-jaaaa-aaaah-qacaq-cai",

    insightData: [
      { day: "Mon", activity: 85, distance: 12.5, calories: 450, time: 75 },
      { day: "Tue", activity: 45, distance: 6.2, calories: 220, time: 40 },
      { day: "Wed", activity: 95, distance: 18.3, calories: 680, time: 120 },
      { day: "Thu", activity: 30, distance: 4.1, calories: 180, time: 30 },
      { day: "Fri", activity: 88, distance: 15.7, calories: 590, time: 95 },
      { day: "Sat", activity: 92, distance: 20.2, calories: 720, time: 135 },
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
      "Dakahlia Governorate",
      "Red Sea Governorate",
      "Beheira Governorate",
      "Fayoum Governorate",
      "Gharbeya Governorate",
      "Ismailia Governorate",
      "Menofia Governorate",
      "Minya Governorate",
      "Qaliubiya Governorate",
      "New Valley Governorate",
      "Suez Governorate",
      "Aswan Governorate",
      "Assiut Governorate",
      "Beni Suef Governorate",
      "Port Said Governorate",
      "Damietta Governorate",
      "Sharkia Governorate",
      "South Sinai Governorate",
      "Kafr Al Sheikh Governorate",
      "Matrouh Governorate",
      "Luxor Governorate",
      "Qena Governorate",
      "North Sinai Governorate",
      "Sohag Governorate",
    ],
  });
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const updateProfile = (updates) => {
    setProfileData((prev) => {
      const newData = { ...prev, ...updates };

      if (updates.points !== undefined) {
        newData.stats = prev.stats.map((stat) =>
          stat.label === "Points earned"
            ? { ...stat, value: updates.points.toString() }
            : stat
        );
      }

      if (updates.favoriteSports) {
        const sportsCount = {};
        updates.favoriteSports.forEach((sport) => {
          sportsCount[sport] = (sportsCount[sport] || 0) + 1;
        });

        const total = Object.values(sportsCount).reduce(
          (sum, count) => sum + count,
          0
        );
        newData.sportDistribution = Object.entries(sportsCount).map(
          ([sport, count], index) => ({
            name: sport,
            value: Math.round((count / total) * 100),
            color: ["#10B981", "#3B82F6", "#F59E0B", "#8B5CF6", "#EF4444"][
              index % 5
            ],
          })
        );
      }

      return newData;
    });
  };

  const resetProfile = () => {
    setProfileData({
      name: "Ahmed Hassan",
      username: "@ahmed_hassan",
      bio: "A passionate football player and sports enthusiast from Cairo. Love organizing community events and bringing athletes together",
      email: "ahmed.hassan.example@gmail.com",
      city: "Cairo",
      governorate: "Cairo Governorate",
      profileImage: "https://api.dicebear.com/6.x/initials/svg?seed=AH",
      favoriteSports: ["Football", "Running", "Cycling"],
      freeDays: ["Monday", "Wednesday", "Friday", "Saturday"],
    });
  };

  const getUserInitials = () => {
    return profileData.name
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
      Boxing: "🥊",
      Yoga: "🧘",
      Weightlifting: "🏋️",
      Volleyball: "🏐",
      Badminton: "🏸",
      "Table Tennis": "🏓",
      Golf: "⛳",
      Cricket: "🏏",
      Rugby: "🏉",
      "Martial Arts": "🥋",
      "Rock Climbing": "🧗",
      Hiking: "🥾",
      Dancing: "💃",
      Skiing: "⛷️",
    };

    return profileData.favoriteSports.map((sport) => ({
      name: sport,
      icon: sportIcons[sport] || "🏃",
      color: "text-green-500",
    }));
  };

  const login = async (type) => {
    // Implement login logic here
    const provider = type === "nfid" ? nfidProvider : identityProvider;
    await state.authClient.login({
      provider,
      onSuccess: updateActor,
    });
  };
  const logout = async () => {
    // Implement logout logic here
    await state.authClient.logout();
    updateActor();
  };

  const updateActor = async () => {
    const authClient = await AuthClient.create();
    const isAuthenticated = await authClient.isAuthenticated();
    const identity = authClient.getIdentity();

    const actor = createActor(useCanisterId, {
      identity,
    });
    setIsAuthenticated(isAuthenticated);
    setState((prev) => ({
      ...prev,
      actor,
      authClient,
    }));

    if (isAuthenticated) {
      // getting user data
      const userData = await actor.get_current_user();
      if (userData.Ok) {
        console.log("User data fetched successfully:", userData.Ok);
      } else {
        // Handle error case
        console.error("Failed to fetch user data:", userData.Err);
      }
    }
  };

  // Initialize auth client
  useEffect(() => {
    updateActor();
  }, []);

  const value = {
    profileData,
    updateProfile,
    resetProfile,
    getUserInitials,
    getFavoriteSportsWithIcons,
    login,
    logout,
    isAuthenticated,
  };

  return (
    <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
  );
};
