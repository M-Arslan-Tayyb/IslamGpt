// components/common/AudioPlayButton.jsx
import { useEffect, useRef, useState } from "react";
import { Volume2, Square } from "lucide-react";

const maleVoiceNames = [
  "google uk english male",
  "alex",
  "daniel",
  "fred",
  "mark",
];

// ✅ Detect Arabic characters
const isArabicText = (text) => /[\u0600-\u06FF]/.test(text);

// ✅ Select appropriate voice based on language
const selectAppropriateVoice = (voices, isArabic) => {
  if (isArabic) {
    return (
      voices.find((v) => v.lang.startsWith("ar")) ||
      voices.find((v) => v.name.toLowerCase().includes("arabic")) ||
      voices[0]
    );
  }

  const lowerVoices = voices.map((v) => ({
    name: v.name.toLowerCase(),
    voice: v,
  }));

  for (const name of maleVoiceNames) {
    const found = lowerVoices.find((v) => v.name === name);
    if (found) return found.voice;
  }

  const maleNamedVoice = lowerVoices.find((v) => v.name.includes("male"));
  return maleNamedVoice?.voice || voices[0];
};

// ✅ SpeechSynthesis fallback with voice + language support
const speakWithSpeechSynthesis = (text, onEndCallback, onStartCallback) => {
  window.speechSynthesis.cancel();

  const isArabic = isArabicText(text);
  const utterance = new SpeechSynthesisUtterance(text);
  const voices = window.speechSynthesis.getVoices();

  const selectedVoice = selectAppropriateVoice(voices, isArabic);
  utterance.voice = selectedVoice;
  utterance.lang = selectedVoice?.lang || (isArabic ? "ar-XA" : "en-US");

  utterance.pitch = 1;
  utterance.rate = 1;
  utterance.onerror = (event) => console.error("Speech Error:", event.error);
  utterance.onend = onEndCallback;
  if (onStartCallback) onStartCallback();

  const speak = () => window.speechSynthesis.speak(utterance);

  if (voices.length === 0) {
    window.speechSynthesis.onvoiceschanged = () => {
      const updatedVoice = selectAppropriateVoice(
        window.speechSynthesis.getVoices(),
        isArabic
      );
      utterance.voice = updatedVoice;
      utterance.lang = updatedVoice?.lang || utterance.lang;
      speak();
      window.speechSynthesis.onvoiceschanged = null;
    };
  } else {
    speak();
  }

  return () => window.speechSynthesis.cancel();
};

const AudioPlayButton = ({
  text = "",
  generateAudio, // optional mutation fn from useMutation
  buttonClass = "",
  iconSize = 5,
  loading = false,
}) => {
  const audioRef = useRef(null);
  const stopSynthRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [useSynth, setUseSynth] = useState(false);

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
      if (audioRef.current) audioRef.current.currentTime = 0;
      stopSynthRef.current?.();
    };
  }, []);

  const stopAudio = () => {
    if (useSynth) {
      stopSynthRef.current?.();
    } else if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
  };

  const handleClick = () => {
    if (!text) return;

    if (isPlaying) {
      stopAudio();
      return;
    }

    if (generateAudio) {
      generateAudio(text, {
        onSuccess: (url) => {
          const audio = new Audio(url);
          audioRef.current = audio;
          setUseSynth(false);

          audio.onended = () => setIsPlaying(false);
          audio.onerror = () => {
            fallbackToSynthesis();
          };

          audio
            .play()
            .then(() => setIsPlaying(true))
            .catch(() => fallbackToSynthesis());
        },
        onError: () => {
          fallbackToSynthesis();
        },
      });
    } else {
      fallbackToSynthesis();
    }
  };

  const fallbackToSynthesis = () => {
    setUseSynth(true);
    stopSynthRef.current = speakWithSpeechSynthesis(
      text,
      () => setIsPlaying(false),
      () => setIsPlaying(true)
    );
  };
  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`flex items-center gap-2 ${buttonClass}`}
    >
      {isPlaying ? (
        <>
          <Square className={`w-${iconSize} h-${iconSize}`} />
          Stop
        </>
      ) : loading ? (
        <div className="w-5 h-5 border-2 border-t-transparent border-[var(--primary-color)] rounded-full animate-spin" />
      ) : (
        <>
          <Volume2 className={`w-${iconSize} h-${iconSize}`} />
          Read Aloud
        </>
      )}
    </button>
  );
};

export default AudioPlayButton;
