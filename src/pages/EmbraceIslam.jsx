import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import EmbraceIslamImage from "../assets/images/embraceIslam/shahadaHero.webp";
import EmbraceIslamBg from "../assets/images/embraceIslam/shahadaHeroBg.png";
import { Button } from "@/components/ui/button";
import { useState, useRef } from "react";
import certificate from "../assets/images/embraceIslam/shahada-certificate.webp";
import shahadaAudio from "../assets/audios/shahada-audio.mp3";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const EmbraceIslam = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
  };
  return (
    <div className="w-full mt-4">
      {/* Hero Section */}
      <section
        className="relative min-h-[600px] w-full py-16 md:py-24 lg:py-32 bg-[#fef4e6] mt-12"
        style={{
          backgroundImage: `url(${EmbraceIslamBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="container flex justify-around px-4">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            {/* Left Content */}
            <div className="max-w-xl">
              <h1 className="text-4xl md:text-5xl lg:text-5xl font-bold text-gray-900 mb-6">
                Embracing Islam
                <br />
                Made Easy
              </h1>
              <p className="text-gray-700 text-base mb-6">
                The word 'Muslim' literally means a person who submits to the
                will of God, regardless of their background.
              </p>
              <p className="text-gray-700 text-base mb-8">
                Embracing Islam is simple and can be done online or with other
                Muslims. If you truly believe Islam is the true faith, just say
                the "Shahada" (Declaration of Faith), the first of the five
                pillars.
              </p>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span>
                      <Button className="bg-[var(--primary-color)] text-white rounded-full px-8 py-6 text-lg font-medium cursor-not-allowed hover:bg-[var(--secondary-color)]">
                        Register for a Certificate
                      </Button>
                    </span>
                  </TooltipTrigger>
                  <TooltipContent
                    side="top"
                    sideOffset={15}
                    className="bg-black text-white border border-gray-700 px-3 py-2 rounded-md shadow-md"
                  >
                    <p>Coming Soon...</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            {/* Right Image */}
            <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
              <img
                src={EmbraceIslamImage || "/placeholder.svg"}
                alt="Person making the declaration of faith"
                className="rounded-2xl max-w-full h-[380px]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* How to Pronounce Shahada Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">
            How to Pronounce Shahada
          </h2>

          {/* YouTube Video Embed */}
          <div className="max-w-4xl mx-auto mb-8">
            <div
              className="relative w-full"
              style={{ paddingBottom: "56.25%" }}
            >
              <iframe
                className="absolute top-0 left-0 w-full h-full rounded-lg"
                src="https://www.youtube.com/embed/I65bnNoOIu0"
                title="How to Pronounce Shahada"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>

          <div className="max-w-3xl mx-auto">
            <p className="text-lg text-gray-700 mb-6">
              The Shahadah can be declared as follows:
            </p>

            {/* Audio Player Section */}
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 mb-6">
              <div className="flex items-center gap-4 mb-4">
                <button
                  onClick={toggleAudio}
                  className="bg-orange-500 hover:bg-orange-600 text-white rounded-full p-3 transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    {isPlaying ? (
                      <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                    ) : (
                      <path d="M8 5v14l11-7z" />
                    )}
                  </svg>
                </button>

                <audio
                  ref={audioRef}
                  onEnded={handleAudioEnded}
                  preload="metadata"
                  src={shahadaAudio}
                >
                  <source
                    src="/audio/shahada-pronunciation.mp3"
                    type="audio/mpeg"
                  />
                  Your browser does not support the audio element.
                </audio>
                <div className="flex-1">
                  <div className="text-right mb-2">
                    <span className="text-2xl font-arabic text-[var(--primary-color)]">
                      أَشْهَدُ أَنْ لَا إِلَٰهَ إِلَّا اللَّهُ وَأَشْهَدُ أَنَّ
                      مُحَمَّدًا رَسُولُ اللَّهِ
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 uppercase tracking-wide">
                    ASH-HADU ALLA ILAAHA ILLA-ALLAH WA ASH-HADU ANNA MUHAMMADAN
                    RASUL-ALLAH
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-3">
                The English translation of the shahadah is:
              </h3>
              <p className="text-lg italic text-gray-700 bg-gray-50 p-4 rounded-lg border-l-4 border-[var(--primary-color)]">
                "I bear witness that there is no deity (none worthy of worship)
                but Allah, and I bear witness that Muhammad is the Messenger of
                Allah."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Shahada Certificate Section */}
      <section className="py-4 md:py-8 lg:py-16 px-16 md:px-24 bg-[#fef4e6]">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12 max-w-6xl mx-auto">
            {/* Left Content */}
            <div className="lg:w-1/2">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Shahada Certificate for Embracing Islam
              </h2>
              <p className="text-base text-gray-700 mb-8">
                For those who say their shahadah and embrace Islam with us.
              </p>
              <div className="flex items-start gap-3 mb-8">
                <div className="w-4 h-4 bg-orange-500 transform rotate-45 mt-2 flex-shrink-0"></div>
                <p className="text-base text-gray-900">
                  Click the button below and take your shahada with our Imam.
                </p>
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span>
                      <Button className="bg-[var(--primary-color)] text-white rounded-full px-8 py-6 text-lg font-medium cursor-not-allowed hover:bg-[var(--secondary-color)]">
                        Register for a Certificate
                      </Button>
                    </span>
                  </TooltipTrigger>
                  <TooltipContent
                    side="top"
                    sideOffset={15}
                    className="bg-black text-white border border-gray-700 px-3 py-2 rounded-md shadow-md"
                  >
                    <p>Coming Soon...</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            {/* Right Certificate Image */}
            <div className="lg:w-1/2 flex justify-center">
              <img
                src={certificate || "/placeholder.svg?height=400&width=600"}
                alt="Shahada Certificate for Embracing Islam"
                className="max-w-full h-auto rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem
                value="item-1"
                className="bg-gray-50 rounded-lg px-6"
              >
                <AccordionTrigger className="text-left text-base font-medium  data-[state=open]:text-[var(--primary-color)]">
                  How do I embrace Islam?
                </AccordionTrigger>
                <AccordionContent className="text-gray-700 pt-2 pb-4">
                  To embrace Islam, you must declare the Shahada with sincerity
                  and belief. This can be done in private or in the presence of
                  witnesses.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="item-2"
                className="bg-gray-50 rounded-lg px-6"
              >
                <AccordionTrigger className="text-left text-base font-medium  data-[state=open]:text-[var(--primary-color)]">
                  Do I need to change my name if I become a Muslim?
                </AccordionTrigger>
                <AccordionContent className="text-gray-700 pt-2 pb-4">
                  No, absolutely not. The Prophet ﷺ changed some companions'
                  names with negative meanings after their conversion to Islam.
                  Islam allows individuals to maintain their cultural roots,
                  provided they don't contradict religious principles. For
                  instance, one can choose their style of dress and food, as
                  long as they avoid prohibitions like nudity or pork
                  consumption. See our article for more details.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="item-3"
                className="bg-gray-50 rounded-lg px-6"
              >
                <AccordionTrigger className="text-left text-base font-medium  data-[state=open]:text-[var(--primary-color)]">
                  Do I need a certificate to embrace Islam?
                </AccordionTrigger>
                <AccordionContent className="text-gray-700 pt-2 pb-4">
                  While a certificate is not required to embrace Islam, it can
                  be helpful for documentation purposes.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="item-4"
                className="bg-gray-50 rounded-lg px-6"
              >
                <AccordionTrigger className="text-left text-base font-medium  data-[state=open]:text-[var(--primary-color)]">
                  Do I need a certificate to perform Hajj or Umrah?
                </AccordionTrigger>
                <AccordionContent className="text-gray-700 pt-2 pb-4">
                  Many Islamic countries require a certificate of conversion to
                  Islam for Hajj and Umrah visa applications.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="item-5"
                className="bg-gray-50 rounded-lg px-6"
              >
                <AccordionTrigger className="text-left text-base font-medium  data-[state=open]:text-[var(--primary-color)]">
                  Can I get a certificate if I have already embraced Islam?
                </AccordionTrigger>
                <AccordionContent className="text-gray-700 pt-2 pb-4">
                  Yes, you can still obtain a certificate of embracing Islam
                  even if you have already declared the Shahada.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EmbraceIslam;
