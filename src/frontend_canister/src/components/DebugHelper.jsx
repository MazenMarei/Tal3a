import { useState } from "react";
import { useLoginFlow } from "../context/LoginFlowContext";
import { useData } from "../hooks/useCanisterHooks";

const DebugHelper = () => {
  const [showDebug, setShowDebug] = useState(false);
  const { formData, currentStep, isFromUserNotFound } = useLoginFlow();
  const { locations, loading, error } = useData() || {};

  const clearStorage = () => {
    localStorage.removeItem("tal3a_login_flow_data");
    localStorage.removeItem("tal3a_user_not_found");
    localStorage.removeItem("tal3a_navigate_to");
    window.location.reload();
  };

  if (!showDebug) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setShowDebug(true)}
          className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
        >
          Debug
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white border-2 border-gray-300 rounded-lg p-4 max-w-sm shadow-lg">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold text-sm">Debug Info</h3>
        <button
          onClick={() => setShowDebug(false)}
          className="text-gray-500 hover:text-gray-700 text-sm"
        >
          ✕
        </button>
      </div>
      
      <div className="text-xs space-y-2 max-h-64 overflow-y-auto">
        <div>
          <strong>Current Step:</strong> {currentStep}
        </div>
        
        <div>
          <strong>From User Not Found:</strong> {String(isFromUserNotFound)}
        </div>
        
        <div>
          <strong>Form Data:</strong>
          <pre className="bg-gray-100 p-1 rounded text-xs overflow-x-auto">
            {JSON.stringify(formData, null, 1)}
          </pre>
        </div>
        
        <div>
          <strong>Locations:</strong> {locations?.length || 0} items
          <br />
          <strong>Loading:</strong> {String(loading)}
          <br />
          <strong>Error:</strong> {error || "none"}
        </div>
        
        <div>
          <strong>LocalStorage:</strong>
          <br />
          User Not Found: {localStorage.getItem("tal3a_user_not_found") || "no"}
          <br />
          Navigate To: {localStorage.getItem("tal3a_navigate_to") || "none"}
        </div>
        
        <div className="pt-2 border-t">
          <button
            onClick={clearStorage}
            className="bg-red-500 text-white px-2 py-1 rounded text-xs w-full"
          >
            Clear Storage & Reload
          </button>
        </div>
      </div>
    </div>
  );
};

export default DebugHelper;
