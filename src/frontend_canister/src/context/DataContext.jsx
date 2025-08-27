// Data Context - Global state management for app data (integrated with backend)
import { createContext, useState, useEffect } from "react";
import {
  useAuth,
  useUser,
  useEvents,
  useSocial,
} from "../hooks/useCanisterHooks";

const DataContext = createContext();

// Provider component for managing global app data from backend
export const DataProvider = ({ children }) => {
  // Get backend data from other contexts
  const { isAuthenticated } = useAuth();
  const { user, governorates, fetchCities } = useUser();
  const { events } = useEvents();
  const { groups, posts } = useSocial();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [locations, setLocations] = useState([]);

  // Fetch governorates with cities data
  useEffect(() => {
    const fetchLocationData = async () => {
      if (!governorates || governorates.length === 0) return;

      try {
        setLoading(true);
        
        // Create locations with mock data for now since we need the structure
        // This matches the expected structure for the location step
        const mockLocations = [
          {
            id: 1,
            name: "Cairo",
            slug: "cairo",
            name_l1: "القاهرة",
            lat: 30.0444,
            lng: 31.2357,
            cities: [
              { id: 1, name: "New Cairo", lat: 30.0281, lng: 31.4859 },
              { id: 2, name: "Heliopolis", lat: 30.0808, lng: 31.3043 },
              { id: 3, name: "Maadi", lat: 29.9529, lng: 31.2565 },
              { id: 4, name: "Zamalek", lat: 30.0618, lng: 31.2194 },
              { id: 5, name: "Downtown", lat: 30.0444, lng: 31.2357 }
            ]
          },
          {
            id: 2,
            name: "Alexandria",
            slug: "alexandria", 
            name_l1: "الإسكندرية",
            lat: 31.2001,
            lng: 29.9187,
            cities: [
              { id: 6, name: "Alexandria Center", lat: 31.2001, lng: 29.9187 },
              { id: 7, name: "Montaza", lat: 31.2156, lng: 29.9702 },
              { id: 8, name: "Miami", lat: 31.1975, lng: 29.9097 },
              { id: 9, name: "Sidi Gaber", lat: 31.2144, lng: 29.9388 }
            ]
          },
          {
            id: 3,
            name: "Giza",
            slug: "giza",
            name_l1: "الجيزة", 
            lat: 30.0131,
            lng: 31.2089,
            cities: [
              { id: 10, name: "6th of October", lat: 29.9097, lng: 30.9746 },
              { id: 11, name: "Sheikh Zayed", lat: 30.0778, lng: 30.9951 },
              { id: 12, name: "Dokki", lat: 30.0378, lng: 31.2123 },
              { id: 13, name: "Mohandessin", lat: 30.0626, lng: 31.2025 }
            ]
          }
        ];

        setLocations(mockLocations);
        
      } catch (error) {
        console.error("Error fetching location data:", error);
        setError("Failed to load location data");
      } finally {
        setLoading(false);
      }
    };

    fetchLocationData();
  }, [governorates, fetchCities]);

  // Enhanced events with formatted data
  const enhancedEvents = events?.map((event) => ({
    ...event,
    id: event.id.toString(),
    sport: Object.keys(event.sport)[0],
    status: Object.keys(event.status)[0],
    participantCount: event.participants.length,
    isJoined:
      isAuthenticated &&
      event.participants.some(
        (p) => p.toString() === user?.principal_id?.toString()
      ),
  })) || [];

  // Enhanced groups with formatted data
  const enhancedGroups = groups?.map((group) => ({
    ...group,
    sport_type: Object.keys(group.sport_type)[0],
    memberCount: group.members,
    postCount: group.posts,
  })) || [];

  // Enhanced posts with formatted data
  const enhancedPosts = posts?.map((post) => ({
    ...post,
    id: post.post_id,
    likeCount: Number(post.likes),
    commentCount: Number(post.comments),
    createdAt: new Date(Number(post.created_at) / 1000000).toISOString(), // Convert from nanoseconds
    updatedAt: new Date(Number(post.updated_at) / 1000000).toISOString(),
  })) || [];

  const value = {
    locations,
    groups: enhancedGroups,
    events: enhancedEvents,
    posts: enhancedPosts,
    loading,
    error,
    // Additional data from user context
    user,
    governorates,
    isAuthenticated,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export { DataContext };
