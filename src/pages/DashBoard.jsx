"use client";

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ChatInterface from "../components/common/ChatInterface";
import DailyCards from "../components/core/dashboard/DailyCards";
import { useDailyContent } from "../apis/dashboard/dashbaordApi";
import LocationRequestModal from "../components/common/LocationRequestModal";

const Dashboard = () => {
  const { data: dailyContent, isLoading, isError } = useDailyContent();
  const navigate = useNavigate();

  const handleAskQuestion = (query) => {
    // Navigate to the chat page with the query
    navigate("/chat", { state: { query } });
  };

  const {
    hasValidLocation,
    locationStatus,
    isLocationModalOpen,
    requestLocation,
    showLocationModal,
    hideLocationModal,
  } = useLocationService();

  useEffect(() => {
    // Show location request modal when user first visits dashboard
    const hasShownLocationRequest = localStorage.getItem(
      "hasShownLocationRequest"
    );

    if (
      !hasValidLocation &&
      !hasShownLocationRequest &&
      locationStatus === "unknown"
    ) {
      // Small delay to ensure page is loaded
      setTimeout(() => {
        showLocationModal(false);
        localStorage.setItem("hasShownLocationRequest", "true");
      }, 1000);
    }
  }, [hasValidLocation, locationStatus, showLocationModal]);

  const handleLocationConfirm = async () => {
    try {
      await requestLocation();
    } catch (error) {
      console.error("Location request failed:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow pt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <ChatInterface onAskQuestion={handleAskQuestion} />
          </div>

          {isLoading ? (
            <div className="mt-8 space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-64 bg-gray-200 rounded-lg"></div>
                </div>
              ))}
            </div>
          ) : isError ? (
            <div className="mt-8 text-center text-red-500">
              Failed to load daily content. Please refresh the page.
            </div>
          ) : (
            <DailyCards
              quranData={dailyContent?.data?.quran}
              hadithData={dailyContent?.data?.hadith}
            />
          )}
        </div>
      </main>
      <LocationRequestModal
        isOpen={isLocationModalOpen}
        onClose={hideLocationModal}
        onConfirm={handleLocationConfirm}
        isRequired={false}
      />
    </div>
  );
};

export default Dashboard;
