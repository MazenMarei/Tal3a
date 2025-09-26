const BASE_URL = import.meta.env.VITE_BASE_URL;

const fetchData = async (endpoint, method = 'GET', body = null) => {
  const headers = {
    'Content-Type': 'application/json',
  };
  const token = localStorage.getItem('authToken');
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  const options = {
    method,
    headers,
  };

  if (body) {
    options.body = JSON.stringify(body);
  }
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, options);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const error = new Error(errorData.message || `HTTP error! status: ${response.status}`);
      error.status = response.status;
      error.data = errorData;
      throw error;
    }
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }
    
    return null;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
};
export const getAllGroups = () => fetchData("/groups");
export const getGroupById = (id) => fetchData(`/groups/${id}`);
export const createGroup = (groupData) => fetchData("/groups", 'POST', groupData);
export const updateGroup = (id, groupData) => fetchData(`/groups/${id}`, 'PUT', groupData);
export const deleteGroup = (id) => fetchData(`/groups/${id}`, 'DELETE');

export const getGroupsPaginated = (page = 1, limit = 10) => 
  fetchData(`/groups?page=${page}&limit=${limit}`);
export const searchGroups = (query) => 
  fetchData(`/groups/search?q=${encodeURIComponent(query)}`);

export const filterGroups = (location = '', category = '', status = '') => {
  const queryParams = new URLSearchParams();
  if (location) queryParams.append('location', location);
  if (category) queryParams.append('category', category);
  if (status) queryParams.append('status', status);
  
  const queryString = queryParams.toString();
  return fetchData(`/groups/filter${queryString ? `?${queryString}` : ''}`);
};

export const getGroupsByStatus = (status) => 
  filterGroups('', '', status);

export const getGroupsByCategory = (category) => 
  filterGroups('', category, '');

export const getGroupsByLocation = (location) => 
  filterGroups(location, '', '');

export const getActiveGroups = () => 
  filterGroups('', '', 'active');

export const getInactiveGroups = () => 
  filterGroups('', '', 'inactive');

export default fetchData;