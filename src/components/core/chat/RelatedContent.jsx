import React, { useState } from "react";
import { ChevronRight, Book, MessageCircle, X, Maximize2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import LoadingSkeleton from "@/components/common/LoadingSkelton";

const MetadataBadge = ({ children }) => (
  <Badge
    variant="secondary"
    className="bg-[#FDF4E7] text-[var(--text-gray)] hover:bg-[#FDF4E7]"
  >
    {children}
  </Badge>
);

const ContentCard = ({ item, type, allContent, currentIndex, onNavigate }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const truncateText = (text, maxLength = 89) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  };

  const dialogClass = isFullscreen
    ? "w-screen h-screen max-w-none !rounded-none"
    : "max-w-[90vw] w-full h-[80vh]";

  return (
    <>
      <div
        onClick={() => setIsModalOpen(true)}
        className="bg-white hover:bg-[var(--text-bg)] rounded-lg p-3 cursor-pointer transition-all border border-gray-200 hover:border-[var(--primary-color)] hover:shadow-sm"
      >
        <p className="text-sm text-gray-600">
          {truncateText(item.description)}
        </p>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className={dialogClass}>
          <DialogHeader className="border-b pb-4">
            <div className="flex items-center justify-between mb-4">
              <DialogTitle className="text-xl">
                {type === "Hadith"
                  ? "Riyadussalihin"
                  : `Surah ${item.surah_name}`}
              </DialogTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setIsFullscreen(!isFullscreen)}
                >
                  <Maximize2 className="h-4 w-4" />
                </Button>
                <DialogClose asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <X className="h-4 w-4" />
                  </Button>
                </DialogClose>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {type === "Hadith" ? (
                <>
                  <MetadataBadge>
                    Chapter: {item.hadith_chapter_english}
                  </MetadataBadge>
                  <MetadataBadge>Book: {item.hadith_book_name}</MetadataBadge>
                  <MetadataBadge>
                    Reference: {item.hadith_reference}
                  </MetadataBadge>
                </>
              ) : (
                <>
                  <MetadataBadge>Surah: {item.surah_name}</MetadataBadge>
                  <MetadataBadge>Verse: {item.ayah_no}</MetadataBadge>
                </>
              )}
            </div>
          </DialogHeader>

          <div className="grid grid-cols-1 lg:grid-cols-3 h-full overflow-hidden">
            {/* Main Content */}
            <div className="lg:col-span-2 overflow-y-auto p-6 border-r">
              <div className="space-y-6">
                <div className="rounded-lg">
                  <p className="text-2xl text-[var(--primary-color)] font-semibold text-right font-amiri leading-loose">
                    {type === "Quran" ? item.ayah : item.hadith_arabic}
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900">
                    English Translation
                  </h4>
                  <p className="text-gray-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
                {type === "Quran" && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900">
                      Arabic Translation
                    </h4>
                    <p className="text-gray-600 leading-relaxed">
                      {item.arabic_trans}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Related Content Sidebar */}
            <div className="lg:col-span-1 overflow-y-auto p-4 bg-gray-50">
              <h3 className="font-medium text-gray-900 mb-4">More {type}s</h3>
              <div className="space-y-3">
                {allContent
                  .filter((content) => content.type === type)
                  .map((content, idx) => (
                    <div
                      key={idx}
                      onClick={() => onNavigate(idx)}
                      className={`p-3 rounded-lg cursor-pointer transition-all ${
                        idx === currentIndex
                          ? "bg-[var(--primary-color)] text-white"
                          : "bg-white hover:bg-[var(--text-bg)]"
                      }`}
                    >
                      <p className="text-sm">
                        {truncateText(content.description, 60)}
                      </p>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

const RelatedContent = ({ content, isLoading }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (!content || (content.quran.length === 0 && content.hadith.length === 0)) {
    return null;
  }

  const handleNavigate = (newIndex) => {
    setSelectedIndex(newIndex);
  };

  return (
    <div className="bg-[var(--text-bg)] rounded-lg">
      <Accordion type="single" collapsible className="px-4 py-2">
        {content.quran.length > 0 && (
          <AccordionItem value="quran" className="border-b-0">
            <AccordionTrigger className="hover:no-underline py-2 px-3 rounded-lg hover:bg-[var(--text-bg-hover)]">
              <div className="flex items-center gap-2 text-[var(--primary-color)]">
                <Book className="h-4 w-4" />
                <span className="font-medium">Related Quran</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2 mt-2">
                {content.quran.map((item, index) => (
                  <ContentCard
                    key={index}
                    item={item}
                    type="Quran"
                    allContent={[...content.quran, ...content.hadith]}
                    currentIndex={selectedIndex}
                    onNavigate={handleNavigate}
                  />
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        )}
        {content.hadith.length > 0 && (
          <AccordionItem value="hadith" className="border-b-0">
            <AccordionTrigger className="hover:no-underline py-2 px-3 rounded-lg hover:bg-[var(--text-bg-hover)]">
              <div className="flex items-center gap-2 text-[var(--primary-color)]">
                <MessageCircle className="h-4 w-4" />
                <span className="font-medium">Related Hadiths</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2 mt-2">
                {content.hadith.map((item, index) => (
                  <ContentCard
                    key={index}
                    item={item}
                    type="Hadith"
                    allContent={[...content.quran, ...content.hadith]}
                    currentIndex={selectedIndex}
                    onNavigate={handleNavigate}
                  />
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        )}
      </Accordion>
    </div>
  );
};

export default RelatedContent;
