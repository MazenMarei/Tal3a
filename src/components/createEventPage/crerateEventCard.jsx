import React, { useContext } from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { CreateEventContext } from '../../context/CreateEventContext';
import Swal from 'sweetalert2';

// Define Sports enum (simplified)
const Sports = {
  FOOTBALL: 'Football',
  BASKETBALL: 'Basketball',
  TENNIS: 'Tennis',
  // Add other sports as needed
};

const CreateEventCard = () => {
  const { eventData, setEventData } = useContext(CreateEventContext);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEventData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLocationChange = (e) => {
    const { name, value } = e.target;
    setEventData((prev) => ({
      ...prev,
      location: { ...prev.location, [name]: value },
    }));
  };

  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files);
    Promise.all(
      files.map((file) => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(file); // Use DataURL for image preview
        });
      })
    ).then((results) => {
      setEventData((prev) => ({ ...prev, images: results }));
    });
  };

  const handleRequirementsChange = (e) => {
    const requirements = e.target.value.split(',').map((req) => req.trim());
    setEventData((prev) => ({ ...prev, requirements }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to create this event?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#10B981",
      cancelButtonColor: "#EF4444",
      confirmButtonText: "Yes, create it!",
      cancelButtonText: "No, cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        // Here you would typically send eventData to an API
        console.log("Event Data Saved:", eventData);
        Swal.fire({
          title: "Created!",
          text: "Your event has been created successfully.",
          icon: "success",
          confirmButtonColor: "#10B981",
        });
      }
    });
  };

  const getEventInitials = () => {
    return eventData.title
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <Card className="bg-white shadow-lg rounded-xl border border-teal-100">
          <CardHeader className="p-6 text-center border-b border-gray-100">
            <h2 className="text-2xl font-semibold text-teal-900">Create Event</h2>
          </CardHeader>
          <CardContent className="p-6">
            <div className="relative w-full h-80 mt-4 mb-6 overflow-hidden rounded-xl shadow-md ">
              <Avatar className="w-full h-full border-4 border-teal-200 rounded-xl">
                <AvatarImage 
                  src={eventData.images[0]} 
                  alt="Event Image" 
                  className="object-cover w-full h-full rounded-xl"
                />
                <AvatarFallback className="bg-gradient-to-br from-green-400 to-green-600 text-white text-3xl font-bold rounded-xl flex items-center justify-center">
                  {getEventInitials()}
                </AvatarFallback>
              </Avatar>
              <label className="absolute bottom-4 right-4 bg-teal-600 text-white px-4 py-2 rounded-full cursor-pointer hover:bg-teal-700 transition-colors text-sm font-medium shadow-sm">
                <Input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImagesChange}
                  className="hidden"
                />
                Change Image
              </label>
              {eventData.images.length > 1 && (
                <div className="absolute top-4 right-4 bg-gray-800 text-white px-2 py-1 rounded-full text-xs">
                  {eventData.images.length} Images
                </div>
              )}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-sm font-medium text-teal-800">
                    Event Title
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    value={eventData.title}
                    onChange={handleInputChange}
                    className="w-full bg-gray-50 border-none focus:ring-2 focus:ring-teal-500 text-gray-800 placeholder-teal-400 p-3 rounded-lg"
                    placeholder="Enter event title"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-medium text-teal-800">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={eventData.description || ''}
                    onChange={handleInputChange}
                    className="w-full bg-gray-50 border-none focus:ring-2 focus:ring-teal-500 text-gray-800 placeholder-teal-400 p-3 rounded-lg min-h-[100px] resize-none"
                    placeholder="Describe your event..."
                    maxLength={200}
                  />
                  <div className="text-right text-xs text-gray-500">
                    {(eventData.description || '').length}/200 characters
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="event_date" className="text-sm font-medium text-teal-800">
                    Event Date
                  </Label>
                  <Input
                    id="event_date"
                    name="event_date"
                    type="datetime-local"
                    value={new Date(eventData.event_date * 1000).toISOString().slice(0, -8)}
                    onChange={(e) =>
                      setEventData((prev) => ({
                        ...prev,
                        event_date: Math.floor(new Date(e.target.value).getTime() / 1000),
                      }))
                    }
                    className="w-full bg-gray-50 border-none focus:ring-2 focus:ring-teal-500 text-gray-800 p-3 rounded-lg"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration_hours" className="text-sm font-medium text-teal-800">
                    Duration (Hours)
                  </Label>
                  <Input
                    id="duration_hours"
                    name="duration_hours"
                    type="number"
                    value={eventData.duration_hours}
                    onChange={handleInputChange}
                    className="w-full bg-gray-50 border-none focus:ring-2 focus:ring-teal-500 text-gray-800 placeholder-teal-400 p-3 rounded-lg"
                    placeholder="Enter duration"
                    min="1"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address" className="text-sm font-medium text-teal-800">
                    Location Address
                  </Label>
                  <Input
                    id="address"
                    name="address"
                    value={eventData.location.address}
                    onChange={handleLocationChange}
                    className="w-full bg-gray-50 border-none focus:ring-2 focus:ring-teal-500 text-gray-800 placeholder-teal-400 p-3 rounded-lg"
                    placeholder="Enter location address"
                    required
                  />
                </div>
              </div>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="sport" className="text-sm font-medium text-teal-800">
                    Sport
                  </Label>
                  <select
                    id="sport"
                    name="sport"
                    value={eventData.sport}
                    onChange={handleInputChange}
                    className="w-full bg-gray-50 border-none focus:ring-2 focus:ring-teal-500 text-gray-800 p-3 rounded-lg"
                  >
                    {Object.values(Sports).map((sport) => (
                      <option key={sport} value={sport}>
                        {sport}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max_participants" className="text-sm font-medium text-teal-800">
                    Max Participants
                  </Label>
                  <Input
                    id="max_participants"
                    name="max_participants"
                    type="number"
                    value={eventData.max_participants || ''}
                    onChange={handleInputChange}
                    className="w-full bg-gray-50 border-none focus:ring-2 focus:ring-teal-500 text-gray-800 placeholder-teal-400 p-3 rounded-lg"
                    placeholder="Enter max participants"
                    min="1"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cost_per_person" className="text-sm font-medium text-teal-800">
                    Cost per Person
                  </Label>
                  <Input
                    id="cost_per_person"
                    name="cost_per_person"
                    type="number"
                    value={eventData.cost_per_person || ''}
                    onChange={handleInputChange}
                    className="w-full bg-gray-50 border-none focus:ring-2 focus:ring-teal-500 text-gray-800 placeholder-teal-400 p-3 rounded-lg"
                    placeholder="Enter cost per person"
                    min="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="requirements" className="text-sm font-medium text-teal-800">
                    Requirements (comma-separated)
                  </Label>
                  <Input
                    id="requirements"
                    name="requirements"
                    value={eventData.requirements.join(', ')}
                    onChange={handleRequirementsChange}
                    className="w-full bg-gray-50 border-none focus:ring-2 focus:ring-teal-500 text-gray-800 placeholder-teal-400 p-3 rounded-lg"
                    placeholder="Enter requirements (e.g., shoes, equipment)"
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 mt-8 pt-6 border-t border-gray-100">
              <Button
                onClick={() => window.history.back()}
                variant="outline"
                className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg px-6 py-3 transition-all duration-200"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                className="flex-1 bg-teal-600 hover:bg-teal-700 text-white rounded-lg px-6 py-3 transition-all duration-200"
              >
                Create Event
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateEventCard;