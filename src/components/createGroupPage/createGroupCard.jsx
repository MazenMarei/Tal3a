import React, { useContext } from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { CreateGroupContext } from '../../context/CreateGroupContext';
import Swal from 'sweetalert2';

// Define Sports enum (simplified)
const Sports = {
  FOOTBALL: 'Football',
  BASKETBALL: 'Basketball',
  TENNIS: 'Tennis',
  // Add other sports as needed
};

const CreateGroupCard = () => {
  const { groupData, setGroupData } = useContext(CreateGroupContext);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setGroupData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setGroupData((prev) => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file); // Use DataURL for image preview
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to create this group?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#10B981",
      cancelButtonColor: "#EF4444",
      confirmButtonText: "Yes, create it!",
      cancelButtonText: "No, cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        // Here you would typically send groupData to an API
        console.log("Group Data Saved:", groupData);
        Swal.fire({
          title: "Created!",
          text: "Your group has been created successfully.",
          icon: "success",
          confirmButtonColor: "#10B981",
        });
      }
    });
  };

  const getGroupInitials = () => {
    return groupData.name
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
            <h2 className="text-2xl font-semibold text-teal-900">Create Group</h2>
          </CardHeader>
          <CardContent className="p-6">
            <div className="relative w-full h-80 mt-4 mb-6 overflow-hidden rounded-xl shadow-md">
              <Avatar className="w-full h-full border-4 border-teal-200 rounded-xl">
                <AvatarImage 
                  src={groupData.image} 
                  alt="Group Image" 
                  className="object-cover w-full h-full rounded-xl"
                />
                <AvatarFallback className="bg-gradient-to-br from-green-400 to-green-600 text-white text-3xl font-bold rounded-xl flex items-center justify-center">
                  {getGroupInitials()}
                </AvatarFallback>
              </Avatar>
              <label className="absolute bottom-4 right-4 bg-teal-600 text-white px-4 py-2 rounded-full cursor-pointer hover:bg-teal-700 transition-colors text-sm font-medium shadow-sm">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                Change Image
              </label>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium text-teal-800">
                    Group Name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={groupData.name}
                    onChange={handleInputChange}
                    className="w-full bg-gray-50 border-none focus:ring-2 focus:ring-teal-500 text-gray-800 placeholder-teal-400 p-3 rounded-lg"
                    placeholder="Enter group name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="governorate_id" className="text-sm font-medium text-teal-800">
                    Governorate ID
                  </Label>
                  <Input
                    id="governorate_id"
                    name="governorate_id"
                    type="number"
                    value={groupData.governorate_id}
                    onChange={handleInputChange}
                    className="w-full bg-gray-50 border-none focus:ring-2 focus:ring-teal-500 text-gray-800 placeholder-teal-400 p-3 rounded-lg"
                    placeholder="Enter governorate ID"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city_id" className="text-sm font-medium text-teal-800">
                    City ID
                  </Label>
                  <Input
                    id="city_id"
                    name="city_id"
                    type="number"
                    value={groupData.city_id}
                    onChange={handleInputChange}
                    className="w-full bg-gray-50 border-none focus:ring-2 focus:ring-teal-500 text-gray-800 placeholder-teal-400 p-3 rounded-lg"
                    placeholder="Enter city ID"
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
                    value={groupData.description}
                    onChange={handleInputChange}
                    className="w-full bg-gray-50 border-none focus:ring-2 focus:ring-teal-500 text-gray-800 placeholder-teal-400 p-3 rounded-lg min-h-[100px] resize-none"
                    placeholder="Describe your group..."
                    maxLength={200}
                  />
                  <div className="text-right text-xs text-gray-500">
                    {groupData.description.length}/200 characters
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="sport_type" className="text-sm font-medium text-teal-800">
                    Sport Type
                  </Label>
                  <select
                    id="sport_type"
                    name="sport_type"
                    value={groupData.sport_type}
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
                  <Label htmlFor="parent_group_id" className="text-sm font-medium text-teal-800">
                    Parent Group ID
                  </Label>
                  <Input
                    id="parent_group_id"
                    name="parent_group_id"
                    value={groupData.parent_group_id || ''}
                    onChange={handleInputChange}
                    className="w-full bg-gray-50 border-none focus:ring-2 focus:ring-teal-500 text-gray-800 placeholder-teal-400 p-3 rounded-lg"
                    placeholder="Enter parent group ID (optional)"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-teal-800">
                    <input
                      type="checkbox"
                      name="public"
                      checked={groupData.public}
                      onChange={handleInputChange}
                      className="mr-2 rounded focus:ring-teal-500"
                    />
                    Public Group
                  </Label>
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
                Create Group
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateGroupCard;