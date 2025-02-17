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

const ContentCard = ({ item, type }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const truncateText = (text, maxLength = 89) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  };

  const dialogClass = isFullscreen
    ? "w-screen h-screen max-w-none !rounded-none"
    : "max-w-2xl";

  return (
    <>
      <div
        onClick={() => setIsModalOpen(true)}
        className="bg-white hover:bg-gray-50 rounded-lg p-4 cursor-pointer transition-all border border-gray-100 hover:border-[var(--primary-color)] hover:shadow-sm"
      >
        {/* <div className="flex items-start gap-3 mb-3">
          <div className="bg-[var(--text-bg-hover)] bg-opacity-10 px-3 py-1 rounded text-sm font-medium text-[var(--primary-color)]">
            {type}
          </div>
        </div> */}
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
          <div className="space-y-6 py-4">
            <div className=" rounded-lg p-6">
              <p className="text-2xl text-[var(--primary-color)] font-semibold text-right font-amiri leading-loose">
                {type === "Quran" ? item.ayah : item.hadith_arabic}
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">English Translation</h4>
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
        </DialogContent>
      </Dialog>
    </>
  );
};

const RelatedContent = ({ content, isLoading }) => {
  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (!content || content.length === 0) {
    return null;
  }

  const quranContent = content.filter((item) => item.type === "Quran");
  const hadithContent = content.filter((item) => item.type === "Hadith");

  return (
    <div className="bg-white rounded-lg shadow-md">
      {/* <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold">Related Content</h2>
      </div> */}
      <Accordion type="single" collapsible className="px-4 py-2">
        {quranContent.length > 0 && (
          <AccordionItem value="quran">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-2">
                <Book className="h-4 w-4" />
                <span>Related Quran</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3 pt-2">
                {quranContent.map((item, index) => (
                  <ContentCard key={index} item={item} type="Quran" />
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        )}
        {hadithContent.length > 0 && (
          <AccordionItem value="hadith">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                <span>Related Hadiths</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3 pt-2">
                {hadithContent.map((item, index) => (
                  <ContentCard key={index} item={item} type="Hadith" />
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
