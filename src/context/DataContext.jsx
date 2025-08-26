import { createContext, useContext, useState, useEffect } from 'react';

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }) => {
  const [locations, setLocations] = useState([]);
  const [groups, setGroups] = useState([]);
  const [events, setEvents] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [locRes, grpRes, evtRes, postRes] = await Promise.all([
          fetch('http://localhost:3001/locations'),
          fetch('http://localhost:3001/groups'),
          fetch('http://localhost:3001/events'),
          fetch('http://localhost:3001/posts'),
        ]);
        const [locationsData, groupsData, eventsData, postsData] = await Promise.all([
          locRes.json(),
          grpRes.json(),
          evtRes.json(),
          postRes.json(),
        ]);
        setLocations(locationsData);
        setGroups(groupsData);
        setEvents(eventsData);
        setPosts(postsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const value = {
    locations,
    groups,
    events,
    posts,
    loading,
    error,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};