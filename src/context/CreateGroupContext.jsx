import React, { createContext, useState } from 'react';

// Define Sports enum (simplified)
const Sports = {
  FOOTBALL: 'Football',
  BASKETBALL: 'Basketball',
  TENNIS: 'Tennis',
  // Add other sports as needed
};

// Create Group Context
export const CreateGroupContext = createContext();

export const CreateGroupProvider = ({ children }) => {
  const [groupData, setGroupData] = useState({
    name: '',
    governorate_id: 0,
    city_id: 0,
    description: '',
    sport_type: Sports.FOOTBALL,
    image: null,
    parent_group_id: null,
    public: true,
  });

  return (
    <CreateGroupContext.Provider value={{ groupData, setGroupData }}>
      {children}
    </CreateGroupContext.Provider>
  );
};