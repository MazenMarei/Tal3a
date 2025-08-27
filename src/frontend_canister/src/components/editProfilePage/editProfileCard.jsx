import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useProfile } from "../../hooks/useProfile";
import Swal from "sweetalert2";

const EditProfileCard = () => {
  const { profileData, updateProfile } = useProfile();

  const [formData, setFormData] = useState({
    name: profileData.name,
    profileImage: profileData.profileImage,
    city: profileData.city,
    governorate: profileData.governorate,
    bio: profileData.bio,
    favoriteSports: [...profileData.favoriteSports],
    freeDays: [...profileData.freeDays],
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleInputChange("profileImage", reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleSportSelection = (sport) => {
    const maxSports = 3; // Set maximum number of sports
    if (formData.favoriteSports.includes(sport)) {
      const newSports = formData.favoriteSports.filter((s) => s !== sport);
      handleInputChange("favoriteSports", newSports);
    } else if (formData.favoriteSports.length < maxSports) {
      const newSports = [...formData.favoriteSports, sport];
      handleInputChange("favoriteSports", newSports);
    } else {
      Swal.fire({
        title: "Limit Reached",
        text: `You can only select up to ${maxSports} sports.`,
        icon: "warning",
        confirmButtonColor: "#10B981",
      });
    }
  };

  const toggleDaySelection = (day) => {
    const newDays = formData.freeDays.includes(day)
      ? formData.freeDays.filter((d) => d !== day)
      : [...formData.freeDays, day];
    handleInputChange("freeDays", newDays);
  };

  const handleSave = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to save these changes?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#10B981",
      cancelButtonColor: "#EF4444",
      confirmButtonText: "Yes, save it!",
      cancelButtonText: "No, cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        updateProfile(formData);
        Swal.fire({
          title: "Saved!",
          text: "Your profile has been updated successfully.",
          icon: "success",
          confirmButtonColor: "#10B981",
        }).then(() => {
          console.log("Profile updated:", formData);
        });
      }
    });
  };

  const getUserInitials = () => {
    return formData.name
      .split(" ")
      .map((name) => name.charAt(0))
      .join("")
      .toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <Card className="bg-white shadow-lg rounded-xl border border-teal-100">
          <CardHeader className="p-6 text-center border-b border-gray-100">
            <div className="relative mx-auto w-24 h-24">
              <Avatar className="w-24 h-24 border-2 border-teal-200 mx-auto">
                <AvatarImage src={formData.profileImage} alt="Profile" />
                <AvatarFallback className="bg-gradient-to-br from-green-400 to-green-600 text-white text-xl font-bold">
                  {getUserInitials()}
                </AvatarFallback>
              </Avatar>
              <label className="absolute bottom-0 right-0 bg-teal-600 text-white px-2 py-1 rounded-full cursor-pointer hover:bg-teal-700 transition-colors text-xs">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                Change
              </label>
            </div>
            <h2 className="text-2xl font-semibold text-teal-900 mt-4">
              Edit Profile
            </h2>
          </CardHeader>

          <CardContent className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="fullName"
                    className="text-sm font-medium text-teal-800"
                  >
                    Full Name
                  </Label>
                  <Input
                    id="fullName"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="w-full bg-gray-50 border-none focus:ring-2 focus:ring-teal-500 text-gray-800 placeholder-teal-400 p-3 rounded-lg"
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="city"
                    className="text-sm font-medium text-teal-800"
                  >
                    City
                  </Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    className="w-full bg-gray-50 border-none focus:ring-2 focus:ring-teal-500 text-gray-800 placeholder-teal-400 p-3 rounded-lg"
                    placeholder="Enter your city"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="governorate"
                    className="text-sm font-medium text-teal-800"
                  >
                    Governorate
                  </Label>
                  <select
                    id="governorate"
                    value={formData.governorate}
                    onChange={(e) =>
                      handleInputChange("governorate", e.target.value)
                    }
                    className="w-full bg-gray-50 border-none focus:ring-2 focus:ring-teal-500 text-gray-800 p-3 rounded-lg"
                  >
                    {profileData.governorates.map((gov) => (
                      <option key={gov} value={gov}>
                        {gov}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="bio"
                    className="text-sm font-medium text-teal-800"
                  >
                    Bio
                  </Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => handleInputChange("bio", e.target.value)}
                    className="w-full bg-gray-50 border-none focus:ring-2 focus:ring-teal-500 text-gray-800 placeholder-teal-400 p-3 rounded-lg min-h-[100px] resize-none"
                    placeholder="Tell us about yourself..."
                    maxLength={200}
                  />
                  <div className="text-right text-xs text-gray-500">
                    {formData.bio.length}/200 characters
                  </div>
                </div>
                <div className="space-y-10">
                  <Label className="text-sm font-medium text-teal-800">
                    Selected Days ({formData.freeDays.length})
                  </Label>
                  <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-lg min-h-[60px]">
                    {formData.freeDays.map((day, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
                      >
                        {day}
                        <button
                          type="button"
                          onClick={() => toggleDaySelection(day)}
                          className="ml-1 text-green-600 hover:text-green-800"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                    {formData.freeDays.length === 0 && (
                      <span className="text-gray-500 text-sm">
                        No days selected
                      </span>
                    )}
                  </div>
                </div>
                <div className="space-y-10">
                  <Label className="text-sm font-medium text-teal-800">
                    Selected Sports ({formData.favoriteSports.length}/3)
                  </Label>
                  <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-lg min-h-[60px]">
                    {formData.favoriteSports.map((sport, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-teal-100 text-teal-800"
                      >
                        {sport}
                        <button
                          type="button"
                          onClick={() => toggleSportSelection(sport)}
                          className="ml-1 text-teal-600 hover:text-teal-800"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                    {formData.favoriteSports.length === 0 && (
                      <span className="text-gray-500 text-sm">
                        No sports selected
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-teal-800">
                    Available Days
                  </Label>
                  <div className="grid grid-cols-2 gap-3">
                    {profileData.weekDays.map((day) => (
                      <div
                        key={day}
                        onClick={() => toggleDaySelection(day)}
                        className={`p-3 rounded-lg cursor-pointer transition-all duration-200 border ${
                          formData.freeDays.includes(day)
                            ? "bg-green-100 border-green-500 shadow-sm"
                            : "bg-gray-50 border-gray-200 hover:bg-green-50"
                        }`}
                      >
                        <span className="text-sm font-medium text-green-800">
                          {day}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    Click to select or deselect days
                  </div>
                </div>

                <div className="space-y-3 ">
                  <Label className="text-sm font-medium text-teal-800">
                    Favorite Sports
                  </Label>
                  <div className="grid grid-cols-2 gap-3">
                    {profileData.availableSports.map((sport) => (
                      <div
                        key={sport}
                        onClick={() => toggleSportSelection(sport)}
                        className={`p-3 rounded-lg cursor-pointer transition-all duration-200 border ${
                          formData.favoriteSports.includes(sport)
                            ? "bg-teal-100 border-teal-500 shadow-sm"
                            : "bg-gray-50 border-gray-200 hover:bg-teal-50"
                        }`}
                      >
                        <span className="text-sm font-medium text-teal-800">
                          {sport}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    Click to select or deselect sports (max 3)
                  </div>
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
                onClick={handleSave}
                className="flex-1 bg-teal-600 hover:bg-teal-700 text-white rounded-lg px-6 py-3 transition-all duration-200"
              >
                Save Changes
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditProfileCard;
