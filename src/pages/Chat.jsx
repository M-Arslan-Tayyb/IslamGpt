import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import ChatInterface from "../components/common/ChatInterface";
import ResourceList from "../components/core/chat/ResourceList";
import RelatedContent from "../components/core/chat/RelatedContent";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { useGenerateAIMutation } from "../apis/chat/chatApi";

const LoadingSkeleton = () => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <div className="lg:col-span-2">
      <div className="bg-white rounded-lg p-6">
        <Skeleton height={32} width={200} className="mb-4" />
        <Skeleton height={100} className="mb-4" />
        <Skeleton height={50} className="mb-2" />
      </div>
    </div>
    <div className="lg:col-span-1">
      <div className="bg-white rounded-lg p-6">
        <Skeleton height={32} width={150} className="mb-4" />
        <Skeleton height={400} />
      </div>
    </div>
  </div>
);

const Chat = () => {
  const location = useLocation();
  const [currentQuery, setCurrentQuery] = useState(null);
  const [aiResponse, setAiResponse] = useState(null);
  const [relatedContent, setRelatedContent] = useState(null);
  const generateAIMutation = useGenerateAIMutation();

  useEffect(() => {
    if (location.state?.query) {
      handleAskQuestion(location.state.query);
    }
  }, [location.state]);

  const handleAskQuestion = async (query) => {
    setCurrentQuery(query);
    setAiResponse(null);
    setRelatedContent(null);
    try {
      const response = await generateAIMutation.mutateAsync(query);
      const { data } = response;

      setAiResponse(data.data.ai_response);

      const combinedContent = [
        ...data.data.quran.map((item) => ({
          type: "Quran",
          title: `Quran: Surah ${item.surah_name} (${item.surah_number}:${item.ayah_no})`,
          description: item.english_trans,
          ...item,
        })),
        ...data.data.hadith.map((item) => ({
          type: "Hadith",
          title: `Hadith: ${item.hadith_book_name}`,
          description: item.hadith_english,
          ...item,
        })),
      ];
      setRelatedContent(combinedContent);
    } catch (error) {
      console.error("Failed to generate response:", error);
    }
  };

  const renderContent = () => {
    if (generateAIMutation.isLoading) {
      return <LoadingSkeleton />;
    }

    if (currentQuery) {
      return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ResourceList query={currentQuery} aiResponse={aiResponse} />
            <div className="mt-6">
              <ChatInterface
                onAskQuestion={handleAskQuestion}
                isCompact={true}
              />
            </div>
          </div>
          <div className="lg:col-span-1">
            <RelatedContent content={relatedContent} />
          </div>
        </div>
      );
    }

    return <ChatInterface onAskQuestion={handleAskQuestion} />;
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-gray)]">
      <Header />
      <main className="flex-grow pt-16">
        <div className="container mx-auto px-4 py-8">{renderContent()}</div>
      </main>
      <Footer />
    </div>
  );
};

export default Chat;
