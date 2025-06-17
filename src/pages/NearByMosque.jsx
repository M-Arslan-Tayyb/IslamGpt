"use client";

import { useState, useEffect } from "react";
import { MapPin, Loader2, RefreshCw } from "lucide-react";
import { useNearbyMosquesMutation } from "@/apis/NearByMosque/mosque";
import LocationRequestModal from "@/components/common/LocationRequestModal";
import MosqueCard from "@/components/core/NearByMosque/MosqueCard";
import nearbyImage from "../assets/images/general/nearby-background.webp";
import decorate_image from "../assets/images/dashboard/decorate.svg";

const NearByMosque = () => {
  const [userLocation, setUserLocation] = useState({
    latitude: null,
    longitude: null,
  });
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [mosquesData, setMosquesData] = useState([]);

  const nearbyMosquesMutation = useNearbyMosquesMutation();

  // Check if location is available and valid
  const hasValidLocation = Boolean(
    userLocation?.latitude && userLocation?.longitude
  );

  // Check for saved location on component mount
  useEffect(() => {
    const savedLocation = localStorage.getItem("userLocation");
    if (savedLocation) {
      try {
        const location = JSON.parse(savedLocation);
        if (location.latitude && location.longitude) {
          setUserLocation(location);
          // Automatically fetch mosques if location exists
          fetchNearbyMosques(location.latitude, location.longitude);
        } else {
          setIsLocationModalOpen(true);
        }
      } catch (error) {
        console.error("Error parsing saved location:", error);
        setIsLocationModalOpen(true);
      }
    } else {
      setIsLocationModalOpen(true);
    }
  }, []);

  const fetchNearbyMosques = async (latitude, longitude) => {
    try {
      const response = await nearbyMosquesMutation.mutateAsync({
        latitude,
        longitude,
      });
      if (response.data.succeeded) {
        setMosquesData(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching nearby mosques:", error);
    }
  };

  const requestLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by your browser"));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const locationData = { latitude, longitude };

          // Save to state
          setUserLocation(locationData);

          // Save to localStorage
          localStorage.setItem("userLocation", JSON.stringify(locationData));

          // Fetch nearby mosques
          fetchNearbyMosques(latitude, longitude);

          // Close modal
          setIsLocationModalOpen(false);

          resolve(locationData);
        },
        (error) => {
          let errorMessage = "Unable to get your location";

          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage =
                "Location access denied. Please enable location services.";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = "Location information is unavailable.";
              break;
            case error.TIMEOUT:
              errorMessage = "Location request timed out.";
              break;
            default:
              errorMessage =
                "An unknown error occurred while getting location.";
              break;
          }

          reject(new Error(errorMessage));
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 300000, // 5 minutes
        }
      );
    });
  };

  const handleLocationConfirm = async () => {
    try {
      await requestLocation();
    } catch (error) {
      console.error("Location request failed:", error);
    }
  };

  const handleRefreshMosques = () => {
    if (hasValidLocation) {
      fetchNearbyMosques(userLocation.latitude, userLocation.longitude);
    }
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d.toFixed(1);
  };

  const deg2rad = (deg) => {
    return deg * (Math.PI / 180);
  };

  const getLocationString = () => {
    if (!hasValidLocation) return "Location not set";
    return `${userLocation.latitude.toFixed(
      4
    )}, ${userLocation.longitude.toFixed(4)}`;
  };

  // Force location requirement - don't show page content without location
  if (!hasValidLocation) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[var(--bg-light)] ">
        <div className="text-center max-w-md mx-auto">
          <div className="bg-[var(--text-bg)] p-8 rounded-lg shadow-lg">
            <MapPin className="h-20 w-20 mx-auto text-[var(--primary-color)] mb-6" />
            <h2 className="text-2xl font-bold mb-4 text-[var(--primary-color)]">
              Location Access Required
            </h2>
            <p className="text-[var(--text-gray)] mb-6">
              This page requires your current location to find nearby mosques.
              Please allow location access to continue.
            </p>
            <button
              onClick={handleLocationConfirm}
              disabled={nearbyMosquesMutation.isPending}
              className="w-full py-3 px-4 bg-[var(--primary-color)] text-white rounded-md hover:bg-[var(--primary-dark)] transition-all duration-300 font-medium disabled:opacity-50"
            >
              {nearbyMosquesMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin inline" />
                  Getting Location...
                </>
              ) : (
                "Enable Location Services"
              )}
            </button>
          </div>
        </div>

        <LocationRequestModal
          isOpen={isLocationModalOpen}
          onClose={() => setIsLocationModalOpen(false)}
          onConfirm={handleLocationConfirm}
          isRequired={true}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-light)] pb-10 mt-12">
      {/* Hero Section */}

      <div className="relative h-[450px] w-full overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${nearbyImage})` }}
        ></div>

        {/* Decoration Images */}
        <img
          src={decorate_image}
          alt="Decoration Left"
          className="absolute top-0 left-0 w-full object-cover h-auto z-30"
        />

        {/* Optional pattern overlay */}
        <div className="absolute inset-0 bg-[url('/images/mosque-pattern.png')] bg-repeat opacity-20 z-10"></div>

        {/* Text/content on top of the image */}
        <div className="relative z-40 flex flex-col items-center justify-center h-full text-white container mx-auto px-4">
          <div className="bg-[hsla(35,92%,95%,1)] text-black px-6 py-4 rounded-xl text-center shadow-md">
            <h1 className="text-2xl md:text-3xl font-bold">Nearby Mosques</h1>
            <p className="mt-2 max-w-md">
              Find mosques near your current location for prayer.
            </p>
            <div className="mt-4 flex items-center justify-center bg-white/40 backdrop-blur-sm px-4 py-2 rounded-full">
              <MapPin className="h-4 w-4 mr-2" />
              <span className="text-sm">{getLocationString()}</span>
              <button
                onClick={handleRefreshMosques}
                disabled={nearbyMosquesMutation.isPending}
                className="ml-2 p-1 rounded-full hover:bg-white/30 disabled:opacity-50"
                title="Refresh mosques"
              >
                <RefreshCw
                  className={`h-4 w-4 ${
                    nearbyMosquesMutation.isPending ? "animate-spin" : ""
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 mt-6">
        {/* Results Count */}
        {mosquesData.length > 0 && (
          <div className="text-center mb-6">
            <p className="text-[var(--text-gray)]">
              Found {mosquesData.length} mosque
              {mosquesData.length !== 1 ? "s" : ""} near you
            </p>
          </div>
        )}

        {/* Content */}
        {nearbyMosquesMutation.isPending ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-[var(--primary-color)]" />
            <span className="ml-2 text-[var(--text-gray)]">
              Finding nearby mosques...
            </span>
          </div>
        ) : nearbyMosquesMutation.isError ? (
          <div className="text-center py-10">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
              <p className="text-red-600 mb-4">
                Error loading mosques. Please try again.
              </p>
              <button
                onClick={handleRefreshMosques}
                className="w-full py-2 px-4 bg-[var(--primary-color)] text-white rounded-md hover:bg-[var(--primary-dark)] transition-all duration-300"
              >
                Retry
              </button>
            </div>
          </div>
        ) : mosquesData.length === 0 ? (
          <div className="text-center py-10">
            <div className="bg-[var(--text-bg)] rounded-lg p-6 max-w-md mx-auto">
              <MapPin className="h-12 w-12 mx-auto text-[var(--primary-color)] mb-4" />
              <p className="text-[var(--text-gray)]">
                No mosques found in your area.
              </p>
              <button
                onClick={handleRefreshMosques}
                className="mt-4 py-2 px-4 bg-[var(--primary-color)] text-white rounded-md hover:bg-[var(--primary-dark)] transition-all duration-300"
              >
                Search Again
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mosquesData.map((mosque, index) => (
              <MosqueCard
                key={`${mosque.name}-${mosque.latitude}-${mosque.longitude}-${index}`}
                mosque={mosque}
                distance={calculateDistance(
                  userLocation.latitude,
                  userLocation.longitude,
                  mosque.latitude,
                  mosque.longitude
                )}
                index={index}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NearByMosque;
