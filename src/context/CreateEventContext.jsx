import React, { createContext, useState } from 'react';

// Define Sports enum (simplified)
const Sports = {
  FOOTBALL: 'Football',
  BASKETBALL: 'Basketball',
  TENNIS: 'Tennis',
  // Add other sports as needed
};

// Create Event Context
export const CreateEventContext = createContext();

export const CreateEventProvider = ({ children }) => {
  const [eventData, setEventData] = useState({
    title: '',
    description: null,
    event_date: Math.floor(Date.now() / 1000), // Unix timestamp
    duration_hours: 1,
    location: { address: '', coordinates: { lat: 0, lng: 0 } }, // Simplified Location
    sport: Sports.FOOTBALL,
    max_participants: null,
    images: [],
    cost_per_person: null,
    requirements: [],
  });

  return (
    <CreateEventContext.Provider value={{ eventData, setEventData }}>
      {children}
    </CreateEventContext.Provider>
  );
};