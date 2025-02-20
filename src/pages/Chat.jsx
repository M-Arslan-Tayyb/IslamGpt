import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import ChatInterface from "../components/common/ChatInterface";
import ChatMessage from "../components/core/chat/chatMessage";
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

    const [chatHistory, setChatHistory] = useState([]);
    const [currentQuery, setCurrentQuery] = useState(null);
    const generateAIMutation = useGenerateAIMutation();
    const chatContainerRef = useRef(null);

    useEffect(() => {
        if (chatId) {
            const storedHistory = localStorage.getItem(`chat_${chatId}`);
            if (storedHistory) {
                setChatHistory(JSON.parse(storedHistory));
            }
        } else if (location.state?.query) {
            handleAskQuestion(location.state.query);
        }
    }, [chatId, location.state]);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [chatHistory, currentQuery]);

    const handleAskQuestion = async (query) => {
        setCurrentQuery({ query, response: null, relatedContent: null });

        try {
            const data = await generateAIMutation.mutateAsync(query);
            const newHistoryItem = {
                query,
                response: data.data.ai_response,
                relatedContent: [
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
                ],
            };

            const currentChatId = chatId || generateChatId();
            if (!chatId) {
                navigate(`/chat?chatId=${currentChatId}`, { replace: true });
            }

            setChatHistory(prevHistory => [...prevHistory, newHistoryItem]);
            setCurrentQuery(null);
            localStorage.setItem(`chat_${currentChatId}`, JSON.stringify([...chatHistory, newHistoryItem]));
        } catch (error) {
            console.error("Failed to generate response:", error);
            setCurrentQuery(null);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-[var(--bg-gray)]">
            <Header />
            <main className="flex-grow pt-16">
                <div className="container mx-auto px-4 py-8">
                    <div className="bg-white rounded-lg shadow-md w-full min-h-[85vh] relative">
                        <div
                            ref={chatContainerRef}
                            className="h-[calc(85vh-80px)] overflow-y-auto p-6 smooth-scroll"
                        >
                            {chatHistory.map((item, index) => (
                                <ChatMessage
                                    key={index}
                                    query={item.query}
                                    response={item.response}
                                    relatedContent={item.relatedContent}
                                />
                            ))}
                            {currentQuery && (
                                <ChatMessage
                                    query={currentQuery.query}
                                    response={null}
                                    relatedContent={null}
                                />
                            )}
                            {generateAIMutation.isPending && (
                                <div className="mt-4">
                                    <Skeleton height={24} width="60%" />
                                    <Skeleton height={48} />
                                    <Skeleton height={24} width="40%" />
                                </div>
                            )}
                        </div>

                        <div className="absolute bottom-0 left-0 w-full border-t border-gray-200 bg-white p-4">
                            {console.log("handleAskQuestion exists?", typeof handleAskQuestion)}
                            <ChatInterface onAskQuestion={handleAskQuestion} isCompact={true} />
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Chat;

function generateChatId() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
        var r = (Math.random() * 16) | 0,
            v = c == "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}