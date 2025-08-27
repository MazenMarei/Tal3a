// Integration Example - Demonstrates complete backend integration
import React, { useState } from "react";
import {
  useAuth,
  useUser,
  useEvents,
  useSocial,
} from "../hooks/useCanisterHooks";

const IntegrationExample = () => {
  const { isAuthenticated, login, logout } = useAuth();
  const { user, createUser, governorates } = useUser();
  const { events, createEvent, joinEvent, leaveEvent } = useEvents();
  const { groups, posts, createGroup, joinGroup, createPost, likePost } =
    useSocial();

  const [activeTab, setActiveTab] = useState("profile");
  const [formData, setFormData] = useState({});

  // Sports mapping from backend enum
  const sportsOptions = [
    "Basketball",
    "Tennis",
    "Volleyball",
    "Football",
    "Padel",
    "Fitness",
    "Cycling",
    "Handball",
    "Camping",
    "Running",
    "Skateboarding",
    "Swimming",
  ];

  // Handle profile creation
  const handleCreateProfile = async (e) => {
    e.preventDefault();

    const userData = {
      username: formData.username,
      bio: formData.bio ? [formData.bio] : [],
      governorate: parseInt(formData.governorate),
      city: parseInt(formData.city),
      sports: formData.sports || [],
      avatar_url: [],
      free_days: [],
    };

    const result = await createUser(userData);
    if (result.success) {
      setFormData({});
    }
  };

  // Handle event creation
  const handleCreateEvent = async (e) => {
    e.preventDefault();

    const eventData = {
      title: formData.eventTitle,
      description: formData.eventDescription ? [formData.eventDescription] : [],
      sport: { [formData.eventSport]: null },
      event_date: BigInt(new Date(formData.eventDate).getTime() * 1000000), // Convert to nanoseconds
      duration_hours: parseInt(formData.eventDuration),
      location: {
        governorate: parseInt(formData.eventGovernorate),
        city: parseInt(formData.eventCity),
        description: formData.eventLocation,
      },
      cost_per_person: formData.eventCost ? [BigInt(formData.eventCost)] : [],
      max_participants: formData.maxParticipants
        ? [parseInt(formData.maxParticipants)]
        : [],
      requirements: formData.requirements
        ? formData.requirements.split(",").map((r) => r.trim())
        : [],
      images: [],
    };

    const result = await createEvent(eventData);
    if (result.success) {
      setFormData({});
    }
  };

  // Handle group creation
  const handleCreateGroup = async (e) => {
    e.preventDefault();

    const groupData = {
      name: formData.groupName,
      description: formData.groupDescription,
      sport_type: { [formData.groupSport]: null },
      governorate_id: parseInt(formData.groupGovernorate),
      city_id: parseInt(formData.groupCity),
      public: formData.isPublic || false,
      parent_group_id: [],
      image: [],
    };

    const result = await createGroup(groupData);
    if (result.success) {
      setFormData({});
    }
  };

  // Handle post creation
  const handleCreatePost = async (e) => {
    e.preventDefault();

    const postData = {
      content: formData.postContent,
      group_id: formData.postGroup,
      images: [],
    };

    const result = await createPost(postData);
    if (result.success) {
      setFormData({});
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <h1 className="text-2xl font-bold mb-4">Tal3a Integration Demo</h1>
          <p className="text-gray-600 mb-6">
            Please login with Internet Identity to test the backend integration
          </p>
          <button
            onClick={login}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-lg transition-colors"
          >
            Login with Internet Identity
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">
              Tal3a Backend Integration Demo
            </h1>
            <div className="flex items-center space-x-4">
              <span className="text-green-600 font-medium">
                ✅ Authenticated
              </span>
              <button
                onClick={logout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Logout
              </button>
            </div>
          </div>

          {user && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold">Current User:</h3>
              <p>Username: {user.username}</p>
              <p>Sports: {user.sports?.join(", ")}</p>
              <p>Role: {Object.keys(user.role)[0]}</p>
            </div>
          )}
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-lg mb-6">
          <div className="flex border-b">
            {[
              { id: "profile", label: "Profile Management" },
              { id: "events", label: "Events" },
              { id: "groups", label: "Groups" },
              { id: "posts", label: "Posts" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 font-medium transition-colors ${
                  activeTab === tab.id
                    ? "border-b-2 border-blue-500 text-blue-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-6">
            {/* Profile Management Tab */}
            {activeTab === "profile" && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">Profile Management</h2>

                {!user ? (
                  <form
                    onSubmit={handleCreateProfile}
                    className="space-y-4 max-w-md"
                  >
                    <h3 className="font-semibold text-lg">Create Profile</h3>

                    <input
                      type="text"
                      placeholder="Username"
                      value={formData.username || ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          username: e.target.value,
                        }))
                      }
                      className="w-full p-2 border rounded-lg"
                      required
                    />

                    <textarea
                      placeholder="Bio (optional)"
                      value={formData.bio || ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          bio: e.target.value,
                        }))
                      }
                      className="w-full p-2 border rounded-lg"
                      rows={3}
                    />

                    <select
                      value={formData.governorate || ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          governorate: e.target.value,
                        }))
                      }
                      className="w-full p-2 border rounded-lg"
                      required
                    >
                      <option value="">Select Governorate</option>
                      {governorates.map((gov) => (
                        <option key={gov.id} value={gov.id}>
                          {gov.name}
                        </option>
                      ))}
                    </select>

                    <select
                      value={formData.city || ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          city: e.target.value,
                        }))
                      }
                      className="w-full p-2 border rounded-lg"
                      required
                    >
                      <option value="">Select City</option>
                      {/* You would need to fetch cities based on selected governorate */}
                    </select>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Sports (select multiple)
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {sportsOptions.map((sport) => (
                          <label key={sport} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={
                                formData.sports?.includes(sport) || false
                              }
                              onChange={(e) => {
                                const currentSports = formData.sports || [];
                                if (e.target.checked) {
                                  setFormData((prev) => ({
                                    ...prev,
                                    sports: [...currentSports, sport],
                                  }));
                                } else {
                                  setFormData((prev) => ({
                                    ...prev,
                                    sports: currentSports.filter(
                                      (s) => s !== sport
                                    ),
                                  }));
                                }
                              }}
                              className="mr-1"
                            />
                            <span className="text-sm">{sport}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition-colors"
                    >
                      Create Profile
                    </button>
                  </form>
                ) : (
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-green-800">
                      Profile Created Successfully!
                    </h3>
                    <p className="text-green-700">
                      You can now create events, join groups, and post content.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Events Tab */}
            {activeTab === "events" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">
                    Events ({events.length})
                  </h2>
                </div>

                {user && (
                  <form
                    onSubmit={handleCreateEvent}
                    className="bg-gray-50 p-4 rounded-lg space-y-4 max-w-2xl"
                  >
                    <h3 className="font-semibold">Create New Event</h3>

                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="Event Title"
                        value={formData.eventTitle || ""}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            eventTitle: e.target.value,
                          }))
                        }
                        className="p-2 border rounded-lg"
                        required
                      />

                      <select
                        value={formData.eventSport || ""}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            eventSport: e.target.value,
                          }))
                        }
                        className="p-2 border rounded-lg"
                        required
                      >
                        <option value="">Select Sport</option>
                        {sportsOptions.map((sport) => (
                          <option key={sport} value={sport}>
                            {sport}
                          </option>
                        ))}
                      </select>
                    </div>

                    <textarea
                      placeholder="Event Description"
                      value={formData.eventDescription || ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          eventDescription: e.target.value,
                        }))
                      }
                      className="w-full p-2 border rounded-lg"
                      rows={3}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="datetime-local"
                        value={formData.eventDate || ""}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            eventDate: e.target.value,
                          }))
                        }
                        className="p-2 border rounded-lg"
                        required
                      />

                      <input
                        type="number"
                        placeholder="Duration (hours)"
                        value={formData.eventDuration || ""}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            eventDuration: e.target.value,
                          }))
                        }
                        className="p-2 border rounded-lg"
                        min="1"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      Create Event
                    </button>
                  </form>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {events.slice(0, 6).map((event) => (
                    <div
                      key={event.id}
                      className="bg-white border rounded-lg p-4"
                    >
                      <h4 className="font-semibold">{event.title}</h4>
                      <p className="text-sm text-gray-600">
                        Sport: {Object.keys(event.sport)[0]}
                      </p>
                      <p className="text-sm text-gray-600">
                        Participants: {event.participants.length}
                      </p>
                      <p className="text-sm text-gray-600">
                        Status: {Object.keys(event.status)[0]}
                      </p>
                      <div className="mt-2 space-x-2">
                        <button
                          onClick={() => joinEvent(event.id)}
                          className="text-xs bg-blue-500 text-white px-2 py-1 rounded"
                        >
                          Join
                        </button>
                        <button
                          onClick={() => leaveEvent(event.id)}
                          className="text-xs bg-red-500 text-white px-2 py-1 rounded"
                        >
                          Leave
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Groups Tab */}
            {activeTab === "groups" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">
                    Groups ({groups.length})
                  </h2>
                </div>

                {user && (
                  <form
                    onSubmit={handleCreateGroup}
                    className="bg-gray-50 p-4 rounded-lg space-y-4 max-w-2xl"
                  >
                    <h3 className="font-semibold">Create New Group</h3>

                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="Group Name"
                        value={formData.groupName || ""}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            groupName: e.target.value,
                          }))
                        }
                        className="p-2 border rounded-lg"
                        required
                      />

                      <select
                        value={formData.groupSport || ""}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            groupSport: e.target.value,
                          }))
                        }
                        className="p-2 border rounded-lg"
                        required
                      >
                        <option value="">Select Sport</option>
                        {sportsOptions.map((sport) => (
                          <option key={sport} value={sport}>
                            {sport}
                          </option>
                        ))}
                      </select>
                    </div>

                    <textarea
                      placeholder="Group Description"
                      value={formData.groupDescription || ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          groupDescription: e.target.value,
                        }))
                      }
                      className="w-full p-2 border rounded-lg"
                      rows={3}
                      required
                    />

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="isPublic"
                        checked={formData.isPublic || false}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            isPublic: e.target.checked,
                          }))
                        }
                        className="mr-2"
                      />
                      <label htmlFor="isPublic">Public Group</label>
                    </div>

                    <button
                      type="submit"
                      className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      Create Group
                    </button>
                  </form>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {groups.slice(0, 6).map((group) => (
                    <div
                      key={group.id}
                      className="bg-white border rounded-lg p-4"
                    >
                      <h4 className="font-semibold">{group.name}</h4>
                      <p className="text-sm text-gray-600">
                        {group.description}
                      </p>
                      <p className="text-sm text-gray-600">
                        Sport: {Object.keys(group.sport_type)[0]}
                      </p>
                      <p className="text-sm text-gray-600">
                        Members: {group.members}
                      </p>
                      <p className="text-sm text-gray-600">
                        Posts: {group.posts}
                      </p>
                      <p className="text-sm text-gray-600">
                        {group.public ? "Public" : "Private"}
                      </p>
                      <button
                        onClick={() => joinGroup(group.id)}
                        className="mt-2 text-xs bg-purple-500 text-white px-2 py-1 rounded"
                      >
                        Join Group
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Posts Tab */}
            {activeTab === "posts" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">
                    Posts ({posts.length})
                  </h2>
                </div>

                {user && groups.length > 0 && (
                  <form
                    onSubmit={handleCreatePost}
                    className="bg-gray-50 p-4 rounded-lg space-y-4 max-w-2xl"
                  >
                    <h3 className="font-semibold">Create New Post</h3>

                    <select
                      value={formData.postGroup || ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          postGroup: e.target.value,
                        }))
                      }
                      className="w-full p-2 border rounded-lg"
                      required
                    >
                      <option value="">Select Group</option>
                      {groups.map((group) => (
                        <option key={group.id} value={group.id}>
                          {group.name}
                        </option>
                      ))}
                    </select>

                    <textarea
                      placeholder="What's on your mind?"
                      value={formData.postContent || ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          postContent: e.target.value,
                        }))
                      }
                      className="w-full p-2 border rounded-lg"
                      rows={4}
                      required
                    />

                    <button
                      type="submit"
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      Create Post
                    </button>
                  </form>
                )}

                <div className="space-y-4">
                  {posts.slice(0, 5).map((post) => (
                    <div
                      key={post.post_id}
                      className="bg-white border rounded-lg p-4"
                    >
                      <p className="mb-2">{post.content}</p>
                      <div className="flex justify-between items-center text-sm text-gray-600">
                        <span>Likes: {post.likes.toString()}</span>
                        <span>Comments: {post.comments.toString()}</span>
                        <button
                          onClick={() => likePost(post.post_id)}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          👍 Like
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntegrationExample;
