// Events Context - Manages event data and operations
import React, { createContext, useState, useEffect } from "react";
import { useAuth } from "../hooks/useCanisterHooks";
import toast from "react-hot-toast";

const EventsContext = createContext();

export const EventsProvider = ({ children }) => {
  const { actors, isAuthenticated } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all events
  const fetchAllEvents = async () => {
    if (!actors.event) return;

    try {
      setLoading(true);
      setError(null);

      const result = await actors.event.get_all_events();

      // Validate and sanitize events data
      const validatedEvents = Array.isArray(result)
        ? result.filter((event) => {
            if (!event || typeof event !== "object") return false;

            // Ensure required fields exist
            return event.id && event.name && event.date && event.location;
          })
        : [];

      setEvents(validatedEvents);
    } catch (error) {
      console.error("Error fetching events:", error);
      setError(error.message);
      toast.error("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  // Fetch filtered events
  const fetchFilteredEvents = async (filter) => {
    if (!actors.event) return [];

    try {
      const result = await actors.event.filter_events(filter);

      // Validate and sanitize the data
      const validatedEvents = Array.isArray(result)
        ? result.filter((event) => {
            if (!event || typeof event !== "object") return false;

            // Ensure required fields exist
            return event.id && event.name && event.date && event.location;
          })
        : [];

      return validatedEvents;
    } catch (error) {
      console.error("Error filtering events:", error);
      return [];
    }
  };

  // Get single event
  const getEvent = async (eventId) => {
    if (!actors.event) return null;

    try {
      const result = await actors.event.get_event(eventId);
      return result.length > 0 ? result[0] : null;
    } catch (error) {
      console.error("Error fetching event:", error);
      return null;
    }
  };

  // Create new event
  const createEvent = async (eventData) => {
    if (!actors.event) {
      toast.error("Events service not available");
      return { success: false, error: "Service unavailable" };
    }

    if (!isAuthenticated) {
      toast.error("Please login to create events");
      return { success: false, error: "Not authenticated" };
    }

    try {
      setLoading(true);
      const result = await actors.event.create_event(eventData);

      if (result.Ok) {
        await fetchAllEvents(); // Refresh events list
        toast.success("Event created successfully!");
        return { success: true, event: result.Ok };
      } else {
        toast.error(`Failed to create event: ${result.Err}`);
        return { success: false, error: result.Err };
      }
    } catch (error) {
      console.error("Error creating event:", error);
      toast.error("Failed to create event");
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Update event
  const updateEvent = async (eventId, updateData) => {
    if (!actors.event) {
      toast.error("Events service not available");
      return { success: false, error: "Service unavailable" };
    }

    if (!isAuthenticated) {
      toast.error("Please login to update events");
      return { success: false, error: "Not authenticated" };
    }

    try {
      setLoading(true);
      const result = await actors.event.update_event(eventId, updateData);

      if (result.Ok) {
        await fetchAllEvents(); // Refresh events list
        toast.success("Event updated successfully!");
        return { success: true };
      } else {
        toast.error(`Failed to update event: ${result.Err}`);
        return { success: false, error: result.Err };
      }
    } catch (error) {
      console.error("Error updating event:", error);
      toast.error("Failed to update event");
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Delete event
  const deleteEvent = async (eventId) => {
    if (!actors.event) {
      toast.error("Events service not available");
      return { success: false, error: "Service unavailable" };
    }

    if (!isAuthenticated) {
      toast.error("Please login to delete events");
      return { success: false, error: "Not authenticated" };
    }

    try {
      setLoading(true);
      const result = await actors.event.delete_event(eventId);

      if (result.Ok) {
        await fetchAllEvents(); // Refresh events list
        toast.success("Event deleted successfully!");
        return { success: true };
      } else {
        toast.error(`Failed to delete event: ${result.Err}`);
        return { success: false, error: result.Err };
      }
    } catch (error) {
      console.error("Error deleting event:", error);
      toast.error("Failed to delete event");
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Join event
  const joinEvent = async (eventId) => {
    if (!actors.event) {
      toast.error("Events service not available");
      return { success: false, error: "Service unavailable" };
    }

    if (!isAuthenticated) {
      toast.error("Please login to join events");
      return { success: false, error: "Not authenticated" };
    }

    try {
      const result = await actors.event.join_event(eventId);

      if (result.Ok) {
        await fetchAllEvents(); // Refresh events list
        toast.success("Joined event successfully!");
        return { success: true };
      } else {
        toast.error(`Failed to join event: ${result.Err}`);
        return { success: false, error: result.Err };
      }
    } catch (error) {
      console.error("Error joining event:", error);
      toast.error("Failed to join event");
      return { success: false, error: error.message };
    }
  };

  // Leave event
  const leaveEvent = async (eventId) => {
    if (!actors.event) {
      toast.error("Events service not available");
      return { success: false, error: "Service unavailable" };
    }

    if (!isAuthenticated) {
      toast.error("Please login to leave events");
      return { success: false, error: "Not authenticated" };
    }

    try {
      const result = await actors.event.leave_event(eventId);

      if (result.Ok) {
        await fetchAllEvents(); // Refresh events list
        toast.success("Left event successfully!");
        return { success: true };
      } else {
        toast.error(`Failed to leave event: ${result.Err}`);
        return { success: false, error: result.Err };
      }
    } catch (error) {
      console.error("Error leaving event:", error);
      toast.error("Failed to leave event");
      return { success: false, error: error.message };
    }
  };

  // Get event participants
  const getEventParticipants = async (eventId) => {
    if (!actors.event) return [];

    try {
      const result = await actors.event.get_event_participants(eventId);

      if (result.Ok) {
        return result.Ok;
      } else {
        console.error("Failed to fetch participants:", result.Err);
        return [];
      }
    } catch (error) {
      console.error("Error fetching participants:", error);
      return [];
    }
  };

  // Review event
  const reviewEvent = async (eventId, rating, comment) => {
    if (!actors.event) {
      toast.error("Events service not available");
      return { success: false, error: "Service unavailable" };
    }

    if (!isAuthenticated) {
      toast.error("Please login to review events");
      return { success: false, error: "Not authenticated" };
    }

    try {
      const result = await actors.event.review_event(
        eventId,
        rating,
        comment ? [comment] : []
      );

      if (result.Ok) {
        toast.success("Review submitted successfully!");
        return { success: true, reviewId: result.Ok };
      } else {
        toast.error(`Failed to submit review: ${result.Err}`);
        return { success: false, error: result.Err };
      }
    } catch (error) {
      console.error("Error reviewing event:", error);
      toast.error("Failed to submit review");
      return { success: false, error: error.message };
    }
  };

  // Get event reviews
  const getEventReviews = async (eventId) => {
    if (!actors.event) return [];

    try {
      const result = await actors.event.get_event_reviews(eventId);
      return result;
    } catch (error) {
      console.error("Error fetching reviews:", error);
      return [];
    }
  };

  // Initialize events data when authenticated
  useEffect(() => {
    if (actors.event) {
      fetchAllEvents();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actors.event]);

  const value = {
    events,
    loading,
    error,
    fetchAllEvents,
    fetchFilteredEvents,
    getEvent,
    createEvent,
    updateEvent,
    deleteEvent,
    joinEvent,
    leaveEvent,
    getEventParticipants,
    reviewEvent,
    getEventReviews,
  };

  return (
    <EventsContext.Provider value={value}>{children}</EventsContext.Provider>
  );
};

export { EventsContext };
