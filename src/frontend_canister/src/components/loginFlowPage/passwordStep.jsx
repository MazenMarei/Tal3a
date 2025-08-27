import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useLoginFlow } from "../../context/LoginFlowContext";

const Step4FreeDays = () => {
  const { formData, updateFormData, nextStep } = useLoginFlow();
  const [selectedDays, setSelectedDays] = useState(formData.free_days || []);
  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  // Load saved data on mount
  useEffect(() => {
    if (formData.free_days) {
      setSelectedDays(formData.free_days);
    }
  }, [formData]);

  const handleDayToggle = (day) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleContinue = () => {
    // Save the selected days
    updateFormData({
      free_days: selectedDays,
    });

    // Go to completion step
    nextStep();
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-green-900 via-green-600 to-green-700 rounded-3xl p-8 md:p-12 mb-8 overflow-hidden">
        {/* Soccer Ball Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-64 h-64 md:w-80 md:h-80 rounded-full border-8 border-white/30 relative">
              <div className="absolute inset-0 rounded-full">
                <div className="absolute top-0 left-1/2 w-px h-full bg-white/30 transform -translate-x-1/2"></div>
                <div className="absolute top-1/2 left-0 w-full h-px bg-white/30 transform -translate-y-1/2"></div>
                <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 border border-white/30 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-center text-white">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Welcome to <span className="text-emerald-400">Tal3a</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Let's set up your sports profile!
          </p>
          <div className="flex justify-center items-center space-x-2 mb-4">
            <span className="text-sm font-medium">Step 4 of 4</span>
          </div>
          <div className="flex justify-center space-x-2">
            <div className="w-3 h-3 bg-white/30 rounded-full"></div>
            <div className="w-3 h-3 bg-white/30 rounded-full"></div>
            <div className="w-3 h-3 bg-white/30 rounded-full"></div>
            <div className="w-3 h-3 bg-white rounded-full"></div>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-2xl p-8 shadow-lg">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-emerald-500 my-10">
            SELECT YOUR FREE DAYS
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            {daysOfWeek.map((day) => (
              <button
                key={day}
                onClick={() => handleDayToggle(day)}
                className={`px-6 py-3 rounded-xl border-2 text-lg font-medium transition-all duration-200 ${
                  selectedDays.includes(day)
                    ? "bg-emerald-500 text-white border-emerald-500"
                    : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                }`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>
        <div className="flex justify-between mt-12">
          <Button
            variant="outline"
            className="px-8 py-3 cursor-pointer text-lg font-medium border-2 border-gray-300 text-gray-600 hover:bg-gray-50 rounded-xl"
            onClick={handleContinue}
          >
            Skip
          </Button>
          <Button
            className="px-8 py-3 cursor-pointer text-lg font-medium bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl"
            onClick={handleContinue}
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Step4FreeDays;
