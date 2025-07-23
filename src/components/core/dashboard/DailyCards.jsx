import React, { useState, useEffect } from "react";
import {
  Book,
  Copy,
  MessageCircle,
  HandIcon as PrayingHands,
} from "lucide-react";
import { duaData } from "../../../data/duaData";
import AudioPlayButton from "@/components/common/AudioPlayButton";
import { useGenerateAudioMutation } from "@/apis/chat/chatApi";

const Card = ({ title, icon: Icon, children, className = "" }) => {
  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <div className="flex items-center gap-2 mb-4">
        <div className="bg-[var(--text-bg)] bg-opacity-10 p-2 rounded-lg">
          <Icon className="w-5 h-5 text-[var(--primary-color)]" />
        </div>
        <h2 className="text-lg font-semibold text-[var(--primary-color)]">
          {title}
        </h2>
      </div>
      {children}
    </div>
  );
};

const TextSection = ({ text, translation, className = "" }) => {
  const { mutate: generateAudio, isPending } = useGenerateAudioMutation();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <p className="text-right arabic-text text-[1.4rem] leading-loose text-[var(--primary-color)]">
        {text}{" "}
        <span>
          {/* Audio Button */}
          <AudioPlayButton
            text={text}
            generateAudio={generateAudio}
            loading={isPending}
            buttonClass="text-blue-600 hover:text-blue-800 text-sm"
          />
        </span>
      </p>

      <p className="text-gray-600 text-sm">{translation}</p>

      {/* Buttons Row */}
      <div className="flex justify-between items-center">
        {/* Copy Button */}
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-[var(--primary-color)] transition-colors"
        >
          <Copy className="w-4 h-4" />
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
    </div>
  );
};

const HighlightedInfo = ({ label, value }) => (
  <div className="bg-[var(--text-bg)] bg-opacity-10 px-3 py-1 rounded-full inline-flex items-center">
    <span className="text-xs font-medium text-[var(--primary-color)]">
      {label}:
    </span>
    <span className="ml-1 text-sm font-semibold text-[var(--primary-color)]">
      {value}
    </span>
  </div>
);

const DailyCards = ({ quranData, hadithData }) => {
  const [randomDua, setRandomDua] = useState(duaData[0]);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * duaData.length);
    setRandomDua(duaData[randomIndex]);
  }, []);

  return (
    <div className="space-y-6 mt-8">
      {/* Quran Verse Card */}
      <Card title="Verse of the Day" icon={Book}>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <HighlightedInfo
              label="Surah"
              value={`${quranData?.surah_num}:${quranData?.ayah_num}`}
            />
          </div>
          <TextSection
            text={quranData?.Surah}
            translation={quranData?.english_translation}
          />
          <div className="mt-4 p-4 bg-[var(--text-bg)] bg-opacity-5 rounded-lg">
            <p className="text-gray-600 text-sm">
              {quranData?.arabic_translation}
            </p>
          </div>
        </div>
      </Card>

      {/* Hadith Card */}
      <Card title="Hadith of the Day" icon={MessageCircle}>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2 items-center">
            <HighlightedInfo label="Book" value={hadithData?.reference} />
            <HighlightedInfo label="Number" value={hadithData?.hadith_number} />
          </div>
          <TextSection
            text={hadithData?.hadith_arabic}
            translation={hadithData?.hadith_english}
          />
          <div className="mt-2 text-sm text-gray-500">
            <p className="font-medium text-[var(--primary-color)]">
              {hadithData?.english_chapter}
            </p>
            <p className="text-right mt-1 font-arabic">
              {hadithData?.arabic_chapter}
            </p>
          </div>
        </div>
      </Card>

      {/* Dua Card */}
      <Card title="Dua of the Day" icon={PrayingHands}>
        <div className="space-y-4">
          <div className="text-sm font-medium text-[var(--primary-color)]">
            <span>{randomDua?.title}</span>
          </div>
          <TextSection
            text={randomDua?.arabic}
            translation={randomDua?.english}
          />
          <div className="mt-4 p-4 bg-[var(--text-bg)] bg-opacity-5 rounded-lg">
            <p className="text-gray-600 text-sm">{randomDua?.urdu}</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default DailyCards;
