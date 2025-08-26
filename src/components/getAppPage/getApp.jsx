import React, { useEffect, useRef } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import LogoImage from '../../assets/images/logo.png';
import { Link } from 'react-router-dom';

function GetApp() {
  const hasToastShown = useRef(false);

  useEffect(() => {
    const toastId = 'get-app-toast';
    if (!hasToastShown.current) {
      hasToastShown.current = true;
      toast.custom(
        (t) => (
          <div
            className={`${
              t.visible ? 'animate-slide-in' : 'animate-slide-out'
            } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-green-500 ring-opacity-50 overflow-hidden transform transition-all duration-300 ease-in-out`}
          >
            <div className="flex-1 p-3">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <img
                    className="h-12 w-12 rounded-full border-2 border-green-200"
                    src={LogoImage}
                    alt="App Logo"
                  />
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-sm font-semibold text-green-900">
                    Get Our App!
                  </p>
                  <p className="mt-1 text-sm text-gray-600">
                    Download now for a better experience on your device.
                  </p>
                  <Link
                    to="/download"
                    rel="noopener noreferrer"
                    className="mt-1 inline-block px-4 py-1 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
                  >
                    Download Now
                  </Link>
                </div>
              </div>
            </div>
            <div className="flex border-l border-green-200">
              <button
                onClick={() => toast.dismiss(t.id)}
                className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-green-600 hover:text-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        ),
        {
          id: toastId, 
          duration: 8000,
          position: 'bottom-right',
        }
      );
    }
    return () => {
      toast.dismiss(toastId);
      hasToastShown.current = false; 
    };
  }, []);

  return (
    <div className="bg-gray-100 flex items-center justify-center">
      <Toaster />
    </div>
  );
}

export default GetApp;