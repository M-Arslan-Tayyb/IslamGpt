"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Clock, Moon, Sun, SunMedium, Sunrise, Sunset } from "lucide-react";
import { useEffect, useState } from "react";
import decorate_image from "../assets/images/dashboard/decorate.svg";
import mosqueImage from "../assets/images/general/nearby-background.webp";
import prayerCardImage from "../assets/images/prayerTime/prayerTime-card-image.webp";

const PrayerTime = () => {
  const [prayerData, setPrayerData] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [nextPrayer, setNextPrayer] = useState(null);
  const [currentPrayer, setCurrentPrayer] = useState("");

  const prayerNames = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];

  const prayerIcons = {
    Fajr: Sunrise,
    Dhuhr: Sun,
    Asr: SunMedium,
    Maghrib: Sunset,
    Isha: Moon,
  };

  useEffect(() => {
    fetchPrayerTimes();
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (prayerData) {
      calculateNextPrayer();
      determineCurrentPrayer();
    }
  }, [currentTime, prayerData]);

  const fetchPrayerTimes = async () => {
    try {
      const today = new Date();
      const formattedDate = `${today.getDate().toString().padStart(2, "0")}-${(
        today.getMonth() + 1
      )
        .toString()
        .padStart(2, "0")}-${today.getFullYear()}`;

      const response = await fetch(
        `https://api.aladhan.com/v1/timingsByCity/${formattedDate}?city=Karachi&country=PK`
      );
      const data = await response.json();
      setPrayerData(data.data);
    } catch (error) {
      console.error("Error fetching prayer times:", error);
    }
  };

  const timeToMinutes = (timeStr) => {
    const [hours, minutes] = timeStr.split(":").map(Number);
    return hours * 60 + minutes;
  };

  const calculateNextPrayer = () => {
    if (!prayerData) return;

    const now = currentTime;
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    const prayers = prayerNames.map((name) => ({
      name,
      time: prayerData.timings[name],
      minutes: timeToMinutes(prayerData.timings[name]),
    }));

    let nextPrayerInfo = prayers.find(
      (prayer) => prayer.minutes > currentMinutes
    );

    if (!nextPrayerInfo) {
      // Next prayer is Fajr of tomorrow
      nextPrayerInfo = prayers[0];
      const minutesUntilMidnight = 24 * 60 - currentMinutes;
      const minutesFromMidnightToFajr = nextPrayerInfo.minutes;
      const totalMinutes = minutesUntilMidnight + minutesFromMidnightToFajr;

      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      const seconds = 60 - now.getSeconds();

      setNextPrayer({
        name: nextPrayerInfo.name,
        time: nextPrayerInfo.time,
        countdown: `${hours.toString().padStart(2, "0")}:${minutes
          .toString()
          .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`,
      });
    } else {
      const minutesLeft = nextPrayerInfo.minutes - currentMinutes;
      const hours = Math.floor(minutesLeft / 60);
      const minutes = minutesLeft % 60;
      const seconds = 60 - now.getSeconds();

      setNextPrayer({
        name: nextPrayerInfo.name,
        time: nextPrayerInfo.time,
        countdown: `${hours.toString().padStart(2, "0")}:${minutes
          .toString()
          .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`,
      });
    }
  };

  const determineCurrentPrayer = () => {
    if (!prayerData) return;

    const now = currentTime;
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    const prayers = prayerNames.map((name) => ({
      name,
      minutes: timeToMinutes(prayerData.timings[name]),
    }));

    let current = "Isha"; // Default to Isha if before Fajr

    for (let i = 0; i < prayers.length; i++) {
      if (currentMinutes >= prayers[i].minutes) {
        current = prayers[i].name;
      } else {
        break;
      }
    }

    setCurrentPrayer(current);
  };

  const formatTime = (time) => {
    const [hours, minutes] = time.split(":");
    const hour = Number.parseInt(hours);
    const ampm = hour >= 12 ? "pm" : "am";
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  if (!prayerData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-orange-100 flex items-center justify-center">
        <div className="text-center">
          <Clock className="w-12 h-12 animate-spin mx-auto mb-4 text-orange-600" />
          <p className="text-lg text-gray-600">Loading prayer times...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-h-screen relative overflow-hidden mt-12">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${mosqueImage})` }}
      ></div>

      {/* Decorative Elements */}
      <div className="absolute w-full z-10">
        <img
          src={decorate_image || "/placeholder.svg"}
          alt="Islamic decoration"
          className="w-full h-full object-cover opacity-80"
        />
      </div>

      {/* Main Content */}
      <div className="relative z-30 container mx-auto px-4 py-8 flex flex-col justify-between min-h-screen space-y-32">
        {/* Top Section – Current Prayer */}
        <div className="flex-shrink-0 mb-8">
          <div className="bg-[hsla(35,92%,95%,0.9)] max-w-sm mx-auto rounded-2xl shadow-lg p-4 px-2 text-center space-y-2">
            <p className="text-sm text-black font-semibold">
              {prayerData.date.gregorian.date}
            </p>
            <p className="text-base text-[#0D0D21] font-bold">
              {prayerData.date.hijri.month.en} {prayerData.date.hijri.day},{" "}
              {prayerData.date.hijri.year} AH
            </p>

            <h2 className="text-3xl md:text-4xl font-bold text-[#0D0D21] mt-4">
              {currentPrayer}
            </h2>

            {nextPrayer && (
              <div className="flex justify-center items-center gap-2 mt-2">
                <span className="text-sm text-[#6B7280]">
                  Next Prayer Starts in:
                </span>
                <span className="bg-[#FF8D00] text-white font-mono font-semibold px-3 py-1 rounded">
                  {nextPrayer.countdown}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Section – Prayer Times Cards */}
        <div className="flex-grow">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 border border-orange-200 shadow-xl">
            <h3 className="text-base font-bold text-gray-800 mb-6">
              Prayer Times:
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {prayerNames.map((prayerName) => {
                const IconComponent = prayerIcons[prayerName];
                const isCurrentPrayer = currentPrayer === prayerName;
                const prayerTime = prayerData.timings[prayerName];

                return (
                  <Card
                    key={prayerName}
                    className={`transition-all duration-300 hover:shadow-lg relative overflow-hidden ${
                      isCurrentPrayer
                        ? "ring-2 ring-orange-300 shadow-lg"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <div
                      className={`absolute inset-0 bg-cover bg-center ${
                        isCurrentPrayer
                          ? "bg-orange-50  text-white"
                          : "bg-purple-50 text-purple-600"
                      }`}
                      style={{ backgroundImage: `url(${prayerCardImage})` }}
                    />

                    <CardContent className="p-6 text-center relative z-10">
                      <div
                        className={`w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center ${
                          isCurrentPrayer
                            ? "bg-orange-500 text-white"
                            : "bg-purple-100 text-purple-600"
                        }`}
                      >
                        <IconComponent className="w-6 h-6" />
                      </div>

                      <h4
                        className={`font-bold text-lg mb-2 ${
                          isCurrentPrayer ? "text-orange-600" : "text-gray-800"
                        }`}
                      >
                        {prayerName}
                      </h4>

                      <div className="space-y-1">
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Start Time:</span>{" "}
                          {formatTime(prayerTime)}
                        </p>
                        {/* <p className="text-sm text-gray-600">
                          <span className="font-medium">Iqamah:</span>{" "}
                          {formatTime(prayerTime)}
                        </p> */}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrayerTime;
