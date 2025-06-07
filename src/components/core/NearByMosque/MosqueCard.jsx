"use client";

import { MapPin, Navigation, Camera } from "lucide-react";
import { useState } from "react";

const MosqueCard = ({ mosque, distance }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const getDirectionsUrl = () => {
    return `https://www.google.com/maps/dir/?api=1&destination=${mosque.latitude},${mosque.longitude}`;
  };

  // Generate Google Street View image URL
  const getStreetViewImage = () => {
    const apiKey = "AIzaSyBkL_Vpfma-nrNUdarOrwCiGM-QkAgnbe0"; // Replace with your Google API key
    return `https://maps.googleapis.com/maps/api/streetview?size=400x200&location=${mosque.latitude},${mosque.longitude}&heading=151.78&pitch=-0.76&key=${apiKey}`;
  };

  // Generate Google Places photo URL (alternative approach)
  const getPlacesPhoto = () => {
    // This would require a place_id from Google Places API
    // For now, we'll use a fallback mosque image
    return `/images/mosque-placeholder.jpg`;
  };

  // Fallback mosque images array
  const fallbackImages = [
    "/images/mosque-1.jpg",
    "/images/mosque-2.jpg",
    "/images/mosque-3.jpg",
    "/images/mosque-4.jpg",
    "/images/mosque-5.jpg",
  ];

  // Get a consistent fallback image based on mosque name
  const getFallbackImage = () => {
    const index = mosque.name.length % fallbackImages.length;
    return fallbackImages[index];
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-100">
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden">
        {!imageError ? (
          <>
            <img
              src={!imageError ? getStreetViewImage() : getFallbackImage()}
              alt={mosque.name}
              className="w-full h-full object-cover"
              onError={handleImageError}
              onLoad={handleImageLoad}
            />

            {imageLoading && (
              <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
                <Camera className="h-8 w-8 text-gray-400" />
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[var(--primary-dark)] to-[var(--primary-color)] flex items-center justify-center relative">
            <div className="absolute inset-0 opacity-20 bg-[url('/images/mosque-pattern.png')] bg-repeat"></div>
            <div className="text-center text-white z-10">
              <div className="w-16 h-16 mx-auto mb-2 bg-white/20 rounded-full flex items-center justify-center">
                <MapPin className="h-8 w-8" />
              </div>
              <p className="text-sm font-medium">Mosque Image</p>
            </div>
          </div>
        )}

        {/* Distance Badge */}
        <div className="absolute top-3 right-3 bg-black/70 text-white px-2 py-1 rounded-full text-xs font-medium">
          {distance} km
        </div>

        {/* Type Badge */}
        <div className="absolute top-3 left-3">
          <div
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              mosque.type === "node"
                ? "bg-green-500 text-white"
                : "bg-orange-500 text-white"
            }`}
          >
            {mosque.type === "node" ? "Nearby" : "Distant"}
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4">
        <h3 className="font-bold text-lg text-[var(--text-color)] mb-2 line-clamp-2">
          {mosque.name}
        </h3>

        <div className="flex items-center text-[var(--text-gray)] text-sm mb-3">
          <MapPin className="h-4 w-4 mr-1" />
          <span>{distance} km from your location</span>
        </div>

        {/* Action Button */}
        <a
          href={getDirectionsUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-full py-2 px-4 bg-[var(--primary-color)] text-white rounded-md hover:bg-[var(--secondary-color)] transition-colors duration-300 text-sm font-medium"
        >
          <Navigation className="h-4 w-4 mr-2" />
          Get Directions
        </a>
      </div>
    </div>
  );
};

export default MosqueCard;
