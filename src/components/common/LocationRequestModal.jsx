"use client";
import { MapPin, X, Navigation } from "lucide-react";

const LocationRequestModal = ({
  isOpen,
  onClose,
  onConfirm,
  isRequired = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full relative overflow-hidden">
        <div className="bg-gradient-to-r from-[var(--primary-dark)] to-[var(--primary-color)] p-6 text-white">
          {!isRequired && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white/80 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          )}
          <div className="flex items-center justify-center mb-4">
            <div className="bg-white/20 p-3 rounded-full">
              <MapPin className="h-8 w-8" />
            </div>
          </div>
          <h3 className="text-xl font-bold text-center">
            {isRequired ? "Location Required" : "Enable Location Services"}
          </h3>
        </div>

        <div className="p-6">
          <p className="text-[var(--text-gray)] mb-4">
            {isRequired
              ? "This page requires your location to show nearby mosques. Please allow location access to continue."
              : "To provide you with personalized Islamic services and find nearby mosques, we need access to your current location."}
          </p>

          <div className="bg-[var(--text-bg)] p-4 rounded-lg mb-6">
            <h4 className="font-semibold text-[var(--primary-color)] mb-2">
              We use your location to:
            </h4>
            <ul className="text-sm text-[var(--text-gray)] space-y-1">
              <li>• Find nearby mosques for prayer</li>
              <li>• Show accurate prayer times</li>
            </ul>
          </div>

          <div className="flex flex-col space-y-3">
            <button
              onClick={onConfirm}
              className="w-full py-3 px-4 bg-[var(--primary-color)] text-white rounded-md hover:bg-[var(--primary-dark)] transition-all duration-300 flex items-center justify-center"
            >
              <Navigation className="h-4 w-4 mr-2" />
              Allow Location Access
            </button>

            {!isRequired && (
              <button
                onClick={onClose}
                className="w-full py-2 px-4 border border-gray-300 text-[var(--text-gray)] rounded-md hover:bg-gray-50 transition-all duration-300"
              >
                Maybe Later
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationRequestModal;
