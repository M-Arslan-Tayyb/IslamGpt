import { MapPin, X } from "lucide-react";

const LocationPermissionModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full relative overflow-hidden">
        <div className="bg-[var(--primary-color)] p-6 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="flex items-center justify-center mb-4">
            <div className="bg-white/20 p-3 rounded-full">
              <MapPin className="h-8 w-8" />
            </div>
          </div>
          <h3 className="text-xl font-bold text-center">Location Access</h3>
        </div>

        <div className="p-6">
          <p className="text-[var(--text-gray)]">
            To find nearby mosques, we need access to your current location.
            This information is only used to show you the closest prayer spaces.
          </p>

          <div className="mt-6 flex flex-col space-y-2">
            <button
              onClick={onConfirm}
              className="w-full py-2 px-4 bg-[var(--primary-color)] text-white rounded-md hover:bg-[var(--primary-dark)] transition-all duration-300"
            >
              Allow Location Access
            </button>
            <button
              onClick={onClose}
              className="w-full py-2 px-4 border border-gray-300 text-[var(--text-gray)] rounded-md hover:bg-gray-50 transition-all duration-300"
            >
              Not Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationPermissionModal;
