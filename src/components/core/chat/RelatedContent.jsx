import React, { useState, useEffect } from "react";
import { ChevronRight, Book, MessageCircle, X, Maximize2 } from 'lucide-react';
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

// Helper function to get a unique identifier for each content item
const getContentId = (item) => {
  if (!item) return "";
  if (item.type === "Hadith") {
    return `hadith-${item.hadith_reference || ""}-${item.hadith_book_name || ""}`;
  } else {
    return `quran-${item.surah_name || ""}-${item.ayah_no || ""}`;
  }
};

const ContentCard = ({ item, allContent, currentItem, onNavigate }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [dialogItem, setDialogItem] = useState(item);

  useEffect(() => {
    if (isModalOpen) {
      setDialogItem(item);
    }
  }, [isModalOpen, item]);

  // Get the appropriate text content based on content type
  const getContentText = (item) => {
    if (!item) return "";

    // For Hadith items, use hadith_english if description is undefined
    if (item.type === "Hadith") {
      return item.description || item.hadith_english || "";
    }

    // For other items, use description
    return item.description || "";
  };

  const truncateText = (text, maxLength = 89) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  };

  const dialogClass = isFullscreen
    ? "w-screen h-screen max-w-none !rounded-none"
    : "max-w-[90vw] w-full h-[80vh]";

  const isSelected = getContentId(item) === getContentId(currentItem);

  return (
    <>
      <div
        onClick={() => {
          setIsModalOpen(true);
          onNavigate(item);
        }}
        className={`bg-white hover:bg-[var(--text-bg)] rounded-lg p-3 cursor-pointer transition-all border border-gray-200 hover:border-[var(--primary-color)] hover:shadow-sm ${isSelected ? "border-[var(--primary-color)] bg-[var(--text-bg)]" : ""
          }`}
      >
        <p className="text-sm text-gray-600">
          {truncateText(getContentText(item))}
        </p>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className={`${dialogClass} [&>button]:hidden`}>
          <DialogHeader className="border-b pb-4">
            <div className="flex items-center justify-between mb-4">
              <DialogTitle className="text-xl">
                {dialogItem.type === "Hadith"
                  ? `${dialogItem.hadith_book_name || "Hadith"}`
                  : `Surah ${dialogItem.surah_name || ""}`}
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
              {dialogItem.type === "Hadith" ? (
                <>
                  <MetadataBadge>
                    Chapter: {dialogItem.hadith_chapter_english || "N/A"}
                  </MetadataBadge>
                  <MetadataBadge>
                    Book: {dialogItem.hadith_book_name || "N/A"}
                  </MetadataBadge>
                  <MetadataBadge>
                    Reference: {dialogItem.hadith_reference || "N/A"}
                  </MetadataBadge>
                </>
              ) : (
                <>
                  <MetadataBadge>Surah: {dialogItem.surah_name || "N/A"}</MetadataBadge>
                  <MetadataBadge>Verse: {dialogItem.ayah_no || "N/A"}</MetadataBadge>
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
                    {dialogItem.type === "Quran"
                      ? dialogItem.ayah || ""
                      : dialogItem.hadith_arabic || ""}
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900">
                    English Translation
                  </h4>
                  <p className="text-gray-600 leading-relaxed">
                    {getContentText(dialogItem)}
                  </p>
                </div>
                {dialogItem.type === "Quran" && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900">
                      Arabic Translation
                    </h4>
                    <p className="text-gray-600 leading-relaxed">
                      {dialogItem.arabic_trans || "No translation available"}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Related Content Sidebar */}
            <div className="lg:col-span-1 overflow-y-auto p-4 bg-gray-50">
              <h3 className="font-medium text-gray-900 mb-4">
                More {dialogItem.type}s
              </h3>
              <div className="space-y-3">
                {allContent
                  .filter((content) => content && content.type === dialogItem.type)
                  .map((content, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        console.log("Sidebar item clicked:", getContentId(content));
                        setDialogItem(content);
                        onNavigate(content);
                      }}
                      className={`p-3 rounded-lg cursor-pointer transition-all ${getContentId(content) === getContentId(dialogItem)
                          ? "bg-[var(--primary-color)] text-white"
                          : "bg-white hover:bg-[var(--text-bg)]"
                        }`}
                    >
                      <p className="text-sm">
                        {truncateText(getContentText(content), 60)}
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
  const [currentItem, setCurrentItem] = useState(null);
  const [activeAccordion, setActiveAccordion] = useState(null);

  useEffect(() => {
    // Set initial content and accordion value when content changes
    if (content) {
      if (content.quran && content.quran.length > 0) {
        setCurrentItem(content.quran[0]);
        setActiveAccordion("quran");
      } else if (content.hadith && content.hadith.length > 0) {
        setCurrentItem(content.hadith[0]);
        setActiveAccordion("hadith");
      }
    }
  }, [content]);

  if (isLoading) {
    // return <LoadingSkeleton />;
  }

  // Add additional checks to prevent errors
  if (!content || !content.quran || !content.hadith ||
    (content.quran.length === 0 && content.hadith.length === 0)) {
    return null;
  }

  // Make sure we have valid arrays
  const quranContent = Array.isArray(content.quran) ? content.quran : [];
  const hadithContent = Array.isArray(content.hadith) ? content.hadith : [];

  // Combine all content
  const allContent = [...quranContent, ...hadithContent];

  const handleNavigate = (item) => {
    console.log("RelatedContent handleNavigate - Item:", getContentId(item));
    setCurrentItem(item);
    setActiveAccordion(item.type === "Quran" ? "quran" : "hadith");
  };

  return (
    <div className="bg-[var(--text-bg)] rounded-lg">
      <div className="rounded-lg">
        <Accordion
          type="single"
          collapsible
          className="px-4 py-2"
          value={activeAccordion}
          onValueChange={(value) => {
            console.log("Accordion onValueChange - Value:", value);
            setActiveAccordion(value);

            if (value === "quran" && quranContent.length > 0) {
              setCurrentItem(quranContent[0]);
            } else if (value === "hadith" && hadithContent.length > 0) {
              setCurrentItem(hadithContent[0]);
            }
          }}
        >
          {/* Quran Section */}
          {quranContent.length > 0 && (
            <AccordionItem value="quran" className="border-b-0">
              <AccordionTrigger className="hover:bg-[var(--text-bg-hover)] px-3 py-2 rounded-lg transition">
                <div className="flex items-center gap-2 text-[var(--primary-color)]">
                  <Book className="h-4 w-4" />
                  <span className="font-medium">Related Quran</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 mt-2">
                  {quranContent.map((item, index) => (
                    <ContentCard
                      key={index}
                      item={item}
                      allContent={allContent}
                      currentItem={currentItem}
                      onNavigate={handleNavigate}
                    />
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          )}

          {/* Hadith Section */}
          {hadithContent.length > 0 && (
            <AccordionItem value="hadith" className="border-b-0">
              <AccordionTrigger className="hover:bg-[var(--text-bg-hover)] px-3 py-2 rounded-lg transition">
                <div className="flex items-center gap-2 text-[var(--primary-color)]">
                  <MessageCircle className="h-4 w-4" />
                  <span className="font-medium">Related Hadiths</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 mt-2">
                  {hadithContent.map((item, index) => (
                    <ContentCard
                      key={index}
                      item={item}
                      allContent={allContent}
                      currentItem={currentItem}
                      onNavigate={handleNavigate}
                    />
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          )}
        </Accordion>
      </div>
    </div>
  );
};

export default RelatedContent;