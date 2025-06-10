"use client";

import { MapPin, Navigation, Camera } from "lucide-react";
import { useState } from "react";
import m1 from "../../../assets/images/mosques/mosque1.jpg";
import m2 from "../../../assets/images/mosques/mosque2.jpg";
import m3 from "../../../assets/images/mosques/mosque3.jpg";
import m4 from "../../../assets/images/mosques/mosque4.jpg";
import m5 from "../../../assets/images/mosques/mosque5.jpg";
import m6 from "../../../assets/images/mosques/mosque6.jpg";
import m7 from "../../../assets/images/mosques/mosque7.jpg";
import m8 from "../../../assets/images/mosques/mosque8.jpg";
import m9 from "../../../assets/images/mosques/mosque9.jpg";
import m10 from "../../../assets/images/mosques/mosque10.jpg";
import m11 from "../../../assets/images/mosques/mosque11.jpg";
import m12 from "../../../assets/images/mosques/mosque12.jpg";

const mosqueImages = [m1, m2, m3, m4, m5, m6, m7, m8, m9, m10, m11, m12];

const MosqueCard = ({ mosque, distance, index }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const getDirectionsUrl = () => {
    return `https://www.google.com/maps/dir/?api=1&destination=${mosque.latitude},${mosque.longitude}`;
  };

  const getMosqueImage = () => {
    // Simply use the index to get the image
    return mosqueImages[index % mosqueImages.length];
  };
  console.log("Image URL:", getMosqueImage());

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
          <img
            src={getMosqueImage()}
            alt={mosque.name}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={handleImageError}
            onLoad={handleImageLoad}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-purple-800 to-purple-600 flex items-center justify-center relative">
            <div className="absolute inset-0 opacity-20 bg-[url('/images/mosque-pattern.png')] bg-repeat"></div>
            <div className="text-center text-white z-10">
              <div className="w-16 h-16 mx-auto mb-2 bg-white/20 rounded-full flex items-center justify-center">
                <MapPin className="h-8 w-8" />
              </div>
              <p className="text-sm font-medium">Mosque Image</p>
            </div>
          </div>
        )}
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
