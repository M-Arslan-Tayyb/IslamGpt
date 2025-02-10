import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ChatInterface from "../components/common/ChatInterface";
import ResourceList from "../components/core/chat/ResourceList";
import RelatedContent from "../components/core/chat/RelatedContent";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { useGenerateAIMutation } from "../apis/chat/chatApi";

// Static resource list (replace with your actual data)
const staticResourceList = [
  { id: 1, title: "Introduction to Islam", type: "Article" },
  { id: 2, title: "The Five Pillars of Islam", type: "Video" },
  { id: 3, title: "Understanding the Quran", type: "Book" },
];

const Chat = () => {
  const location = useLocation();
  const [currentQuery, setCurrentQuery] = useState(null);
  const [relatedContent, setRelatedContent] = useState(null);
  const generateAIMutation = useGenerateAIMutation();

  useEffect(() => {
    if (location.state?.payload) {
      handleAskQuestion(location.state.payload.query);
    }
  }, [location.state]);

  const handleAskQuestion = async (query) => {
    setCurrentQuery(query);
    try {
      const response = await generateAIMutation.mutateAsync(query);
      setRelatedContent(response.data.related_content);
    } catch (error) {
      console.error("Failed to generate response:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-gray)]">
      <Header />
      <main className="flex-grow pt-16">
        <div className="container mx-auto px-4 py-8">
          {!currentQuery ? (
            <ChatInterface onAskQuestion={handleAskQuestion} />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <ResourceList resources={staticResourceList} />
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
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Chat;
