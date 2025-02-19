import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import ChatInterface from "../components/common/ChatInterface";
import ResourceList from "../components/core/chat/ResourceList";
import RelatedContent from "../components/core/chat/RelatedContent";
import ChatWrapper from "../components/core/chat/ChatWrapper";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { useGenerateAIMutation } from "../apis/chat/chatApi";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const Chat = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const chatId = searchParams.get("chatId");

  const [currentQuery, setCurrentQuery] = useState(null);
  const [aiResponse, setAiResponse] = useState(null);
  const [relatedContent, setRelatedContent] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const generateAIMutation = useGenerateAIMutation();

  useEffect(() => {
    if (chatId) {
      const storedHistory = localStorage.getItem(`chat_${chatId}`);
      if (storedHistory) {
        const parsedHistory = JSON.parse(storedHistory);
        setChatHistory(parsedHistory);
        if (parsedHistory.length > 0) {
          const lastItem = parsedHistory[parsedHistory.length - 1];
          setCurrentQuery(lastItem.query);
          setAiResponse(lastItem.response);
          setRelatedContent(lastItem.relatedContent);
        }
      }
    } else if (location.state?.query) {
      handleAskQuestion(location.state.query);
    }
  }, [chatId, location.state]);

  const handleAskQuestion = async (query) => {
    setCurrentQuery(query);
    setAiResponse(null);
    setRelatedContent(null);

    try {
      const data = await generateAIMutation.mutateAsync(query);
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

      // Generate a new chatId if it doesn't exist
      const currentChatId = chatId || generateChatId();
      if (!chatId) {
        navigate(`/chat?chatId=${currentChatId}`, { replace: true });
      }

      // Update chat history
      const newHistoryItem = {
        query,
        response: data.data.ai_response,
        relatedContent: combinedContent,
      };
      const updatedHistory = [...chatHistory, newHistoryItem];
      setChatHistory(updatedHistory);

      // Save to localStorage
      localStorage.setItem(
        `chat_${currentChatId}`,
        JSON.stringify(updatedHistory)
      );
    } catch (error) {
      console.error("Failed to generate response:", error);
    }
  };
  const renderContent = () => {
    if (!currentQuery) {
      return <ChatInterface onAskQuestion={handleAskQuestion} />;
    }

    return (
      <ChatWrapper
        relatedContent={
          <RelatedContent
            content={relatedContent}
            isLoading={generateAIMutation.isPending}
          />
        }
      >
        <div className="p-6">
          {generateAIMutation.isPending ? (
            <div>
              <div className="flex items-center justify-between mb-6">
                <Skeleton width={150} height={28} />
                <div className="flex gap-2">
                  <Skeleton circle width={32} height={32} />
                  <Skeleton circle width={32} height={32} />
                </div>
              </div>
              <div className="flex flex-col items-center justify-center py-12">
                <Skeleton width={120} height={24} className="mb-2" />
              </div>
            </div>
          ) : (
            <ResourceList query={currentQuery} aiResponse={aiResponse} />
          )}
        </div>
        <div>
          <ChatInterface onAskQuestion={handleAskQuestion} isCompact={true} />
        </div>
      </ChatWrapper>
    );
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

// Helper function to generate a unique chat ID
function generateChatId() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
