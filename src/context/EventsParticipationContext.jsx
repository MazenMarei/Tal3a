import { createContext, useContext, useState } from 'react';

// Create the Event Participation Context
const EventParticipationContext = createContext();

// Sample event participation data based on the provided structure
const initialParticipationData = [
  {
    eventId: "1",
    id: 1,
    creator_id: "principal_1",
    title: "Annual Football Tournament",
    description: "Join us for an exciting football tournament with teams from across the city!",
    event_date: 1696118400, // Example timestamp (2023-10-01)
    duration_hours: 4,
    location: {
      governorate: "Cairo",
      city: "Nasr City",
      description: "Sports Complex, Field A"
    },
    sport: "Football",
    max_participants: 50,
    status: "Active",
    images: [],
    cost_per_person: 100,
    requirements: ["Sports shoes", "Team jersey"],
    created_at: 1693536000,
    updated_at: 1693536000
  },
  {
    eventId: "2",
    id: 2,
    creator_id: "principal_2",
    title: "Tennis Open Championship",
    description: "Compete in our annual tennis open for a chance to win exciting prizes!",
    event_date: 1698796800, // Example timestamp (2023-11-01)
    duration_hours: 3,
    location: {
      governorate: "Giza",
      city: "6th of October",
      description: "Tennis Academy Courts"
    },
    sport: "Tennis",
    max_participants: 30,
    participants: ["principal_4", "principal_5"],
    status: "Active",
    images: [],
    cost_per_person: 150,
    requirements: ["Tennis racket", "Appropriate attire"],
    created_at: 1693536000,
    updated_at: 1693536000
  }
];

// Event Participation Provider Component
export const EventParticipationProvider = ({ children }) => {
  const [participationData, setParticipationData] = useState(initialParticipationData);

  // Function to add a new participant to an event
  const addParticipant = (eventId, principal) => {
    setParticipationData((prevData) =>
      prevData.map((event) =>
        (event.eventId === eventId || event.id === parseInt(eventId)) && 
        (!event.max_participants || event.participants.length < event.max_participants)
          ? { ...event, participants: [...event.participants, principal] }
          : event
      )
    );
  };

  // Function to update event status
  const updateEventStatus = (eventId, status) => {
    setParticipationData((prevData) =>
      prevData.map((event) =>
        event.eventId === eventId || event.id === parseInt(eventId)
          ? { ...event, status }
          : event
      )
    );
  };

  return (
    <EventParticipationContext.Provider
      value={{
        participationData,
        addParticipant,
        updateEventStatus
      }}
    >
      {children}
    </EventParticipationContext.Provider>
  );
};

// Custom hook to use the Event Participation Context
export const useEventParticipation = () => {
  const context = useContext(EventParticipationContext);
  if (!context) {
    throw new Error('useEventParticipation must be used within an EventParticipationProvider');
  }
  return context;
};

export default EventParticipationContext;