"use client";
import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import ChatInterface from "../components/common/ChatInterface";
import ChatMessage from "../components/core/chat/chatMessage";
import ChatSidebar from "../components/core/chat/sidebar";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import {
  useGenerateAIMutation,
  useGetListingMutation,
  useGetHistoryMutation,
} from "../apis/chat/chatApi";
import { cn } from "@/lib/utils";
import "react-loading-skeleton/dist/skeleton.css";
import toast from "react-hot-toast";

const Chat = () => {
  const location = useLocation();

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const chatId = searchParams.get("chatId");

  // State for sidebar
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(
    window.innerWidth < 768
  );
  const [sessions, setSessions] = useState([]);

  // Use a ref to store the current session ID to avoid race conditions
  const sessionIdRef = useRef(chatId || null);
  // Also keep a state for UI updates
  const [activeSessionId, setActiveSessionId] = useState(chatId);

  // Track which sessions are truly new (just created)
  const [newlyCreatedSessions, setNewlyCreatedSessions] = useState(new Set());

  // ADDED: Track if we've processed the dashboard query to prevent duplicate calls
  const [dashboardQueryProcessed, setDashboardQueryProcessed] = useState(false);

  // Existing state
  const [chatHistory, setChatHistory] = useState([]);
  const [currentQuery, setCurrentQuery] = useState(null);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  // API hooks
  const generateAIMutation = useGenerateAIMutation();
  const getHistoryMutation = useGetHistoryMutation();
  const chatContainerRef = useRef(null);

  // Use the updated query hook for listings
  const {
    data: listingData,
    isLoading: isLoadingSessions,
    refetch: refetchSessions,
    error: listingError,
  } = useGetListingMutation();

  // Update the ref whenever activeSessionId changes
  useEffect(() => {
    console.log("Active session ID changed:", activeSessionId);
    sessionIdRef.current = activeSessionId;
  }, [activeSessionId]);

  // Handle window resize for responsive behavior
  useEffect(() => {
    const handleResize = () => {
      // Only auto-collapse on small screens
      if (window.innerWidth < 768) {
        setIsSidebarCollapsed(true);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // FIXED: Simplified session loading and dashboard query handling
  useEffect(() => {
    if (listingData?.succeeded && listingData.data) {
      console.log("Listing data received:", listingData);

      // Transform the data to match the format expected by ChatSidebar
      const formattedSessions = listingData.data.map((session) => ({
        id: session.session_id,
        title: session.title || getFirstQuestion(session.history) || "New Chat",
        history: session.history,
      }));

      setSessions(formattedSessions);

      // Handle different navigation scenarios
      if (chatId) {
        // URL has chatId - this is an existing session
        console.log("Setting active session from URL:", chatId);
        setActiveSessionId(chatId);
        sessionIdRef.current = chatId;
        fetchSessionHistory(chatId);
      } else if (location.state?.query && !dashboardQueryProcessed) {
        // Coming from dashboard with a query
        console.log("Processing dashboard query:", location.state.query);
        handleDashboardQuery(location.state.query);
        setDashboardQueryProcessed(true);
      } else if (!sessionIdRef.current) {
        // No session ID and no dashboard query - create new chat
        handleNewChat();
      }
    }
  }, [listingData, dashboardQueryProcessed]);

  // SIMPLIFIED: Handle URL changes for existing sessions only
  useEffect(() => {
    if (chatId && chatId !== sessionIdRef.current && !location.state?.query) {
      console.log("URL chatId changed, updating active session:", chatId);
      setActiveSessionId(chatId);
      sessionIdRef.current = chatId;
      fetchSessionHistory(chatId);
    }
  }, [chatId]);

  // FIXED: Simplified dashboard query handler
  const handleDashboardQuery = (query) => {
    console.log("🚀 Handling dashboard query:", query);

    // Create a new session for the dashboard query
    const newSessionId = Math.floor(
      10000000 + Math.random() * 90000000
    ).toString();

    console.log("📝 Creating new session for dashboard query:", newSessionId);

    // Mark this session as newly created
    setNewlyCreatedSessions((prev) => {
      const newSet = new Set([...prev, newSessionId]);
      console.log("🏷️ Newly created sessions:", Array.from(newSet));
      return newSet;
    });

    // Update session state
    setActiveSessionId(newSessionId);
    sessionIdRef.current = newSessionId;

    // Clear current chat
    setChatHistory([]);
    setCurrentQuery(null);

    // Update URL to include the new session ID
    navigate(`/chat?chatId=${newSessionId}`, { replace: true });

    // Add the new session to the sessions list immediately with "New Chat" title
    setSessions((prevSessions) => [
      ...prevSessions,
      {
        id: newSessionId,
        title: "New Chat",
        history: [],
      },
    ]);

    // Process the query - this will update the title
    setTimeout(() => {
      handleAskQuestion(query);
    }, 100); // Small delay to ensure state is updated
  };

  // Function to fetch session history
  const fetchSessionHistory = async (sessionId) => {
    if (!sessionId) return;

    setIsLoadingHistory(true);
    try {
      const result = await getHistoryMutation.mutateAsync(sessionId);
      if (result.succeeded && result.data) {
        loadSessionHistory(result.data, sessionId);
      }
    } catch (error) {
      console.error("Failed to fetch session history:", error);
      toast.error("Failed to load chat history");
    } finally {
      setIsLoadingHistory(false);
    }
  };

  // Helper function to load session history
  const loadSessionHistory = (sessionData, sessionId) => {
    if (!sessionData.history) return;

    const formattedHistory = sessionData.history.map((item) => {
      const query = item.question.replace("user_question: ", "");
      const aiResponse = item.answer.replace("AI_answer: ", "");

      return {
        query,
        response: {
          data: {
            ai_response: aiResponse,
            quran: (item.metadata?.quran || []).map((quranItem) => ({
              type: "Quran",
              title: `Quran: Surah ${quranItem.surah_name} (${quranItem.surah_number}:${quranItem.ayah_no})`,
              description: quranItem.english_trans,
              ...quranItem,
            })),
            hadith: (item.metadata?.hadith || []).map((hadithItem) => ({
              type: "Hadith",
              title: `Hadith: ${hadithItem.hadith_book_name}`,
              description: item.hadith_english,
              ...hadithItem,
            })),
          },
        },
      };
    });

    setChatHistory(formattedHistory);

    // Update sessions with loaded history
    setSessions((prevSessions) => {
      const existingIndex = prevSessions.findIndex(
        (s) => String(s.id) === String(sessionId)
      );

      if (existingIndex !== -1) {
        const updatedSessions = [...prevSessions];
        const existingSession = prevSessions[existingIndex];

        updatedSessions[existingIndex] = {
          ...existingSession,
          history: formattedHistory,
          title:
            existingSession.title ||
            getFirstQuestion(sessionData.history) ||
            "New Chat",
        };

        return updatedSessions;
      } else {
        return [
          ...prevSessions,
          {
            id: sessionId,
            title:
              sessionData.title ||
              getFirstQuestion(sessionData.history) ||
              "New Chat",
            history: formattedHistory,
          },
        ];
      }
    });
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory, currentQuery]);

  // Toggle sidebar
  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  // Handle new chat - mark session as newly created
  const handleNewChat = () => {
    const newSessionId = Math.floor(
      10000000 + Math.random() * 90000000
    ).toString();

    console.log("Creating new chat with session ID:", newSessionId);

    setNewlyCreatedSessions((prev) => new Set([...prev, newSessionId]));

    setActiveSessionId(newSessionId);
    sessionIdRef.current = newSessionId;

    setChatHistory([]);
    setCurrentQuery(null);

    navigate(`/chat?chatId=${newSessionId}`, { replace: true });
    setIsSidebarCollapsed(false);
  };

  // Handle session selection - this is for EXISTING sessions
  const handleSelectSession = (sessionId) => {
    if (sessionId === sessionIdRef.current) return;

    console.log("Selecting EXISTING session:", sessionId);

    navigate(`/chat?chatId=${sessionId}`);
    setActiveSessionId(sessionId);
    sessionIdRef.current = sessionId;
    fetchSessionHistory(sessionId);

    if (window.innerWidth < 768) {
      setIsSidebarCollapsed(true);
    }
  };

  // Helper function to extract the first question as a title
  const getFirstQuestion = (history) => {
    if (!history || history.length === 0) return null;
    const firstQuestion = history[0].question;
    return firstQuestion.replace("user_question: ", "");
  };

  // FIXED: Better session management in handleAskQuestion
  const handleAskQuestion = async (query) => {
    console.log("🔄 Processing question:", query);
    setCurrentQuery({ query, response: null, relatedContent: null });

    try {
      const currentSessionId = sessionIdRef.current;
      console.log("📤 Sending message with session ID:", currentSessionId);

      const data = await generateAIMutation.mutateAsync({
        query,
        sessionId: currentSessionId,
      });

      if (data.session_id && !currentSessionId) {
        console.log("Received new session ID from API:", data.session_id);
        setActiveSessionId(data.session_id);
        sessionIdRef.current = data.session_id;
        navigate(`/chat?chatId=${data.session_id}`, { replace: true });
      }

      const newHistoryItem = {
        query,
        response: {
          data: {
            ai_response: data.data.ai_response,
            quran: data.data.quran.map((item) => ({
              type: "Quran",
              title: `Quran: Surah ${item.surah_name} (${item.surah_number}:${item.ayah_no})`,
              description: item.english_trans,
              ...item,
            })),
            hadith: data.data.hadith.map((item) => ({
              type: "Hadith",
              title: `Hadith: ${item.hadith_book_name}`,
              description: item.hadith_english,
              ...item,
            })),
          },
        },
      };

      setChatHistory((prevHistory) => [...prevHistory, newHistoryItem]);

      // FIXED: Update sessions with proper title logic
      setSessions((prevSessions) => {
        const existingIndex = prevSessions.findIndex(
          (s) => String(s.id) === String(sessionIdRef.current)
        );

        console.log("📋 Session update - Looking for:", sessionIdRef.current);
        console.log("📋 Found at index:", existingIndex);

        if (existingIndex !== -1) {
          const existingSession = prevSessions[existingIndex];
          const updatedSessions = [...prevSessions];

          const isNewlyCreatedSession = newlyCreatedSessions.has(
            String(sessionIdRef.current)
          );
          const currentHistory = existingSession.history || [];
          const isFirstMessage = currentHistory.length === 0;
          const hasDefaultTitle =
            !existingSession.title ||
            existingSession.title === "New Chat" ||
            existingSession.title.trim() === "";

          console.log("🏷️ Title decision:", {
            sessionId: sessionIdRef.current,
            isNewlyCreatedSession,
            isFirstMessage,
            hasDefaultTitle,
            currentTitle: existingSession.title,
            willUpdate:
              isNewlyCreatedSession && isFirstMessage && hasDefaultTitle,
          });

          if (isNewlyCreatedSession && isFirstMessage && hasDefaultTitle) {
            // Update title for new session
            updatedSessions[existingIndex] = {
              ...existingSession,
              title: query.length > 50 ? query.substring(0, 50) + "..." : query,
              history: [...currentHistory, newHistoryItem],
            };

            // Remove from newly created sessions
            setNewlyCreatedSessions((prev) => {
              const newSet = new Set(prev);
              newSet.delete(String(sessionIdRef.current));
              return newSet;
            });

            console.log("✅ Updated title to:", query);
          } else {
            // Keep existing title
            updatedSessions[existingIndex] = {
              ...existingSession,
              history: [...currentHistory, newHistoryItem],
            };
            console.log("❌ Kept existing title:", existingSession.title);
          }

          return updatedSessions;
        } else {
          // Session not found - add it
          console.warn("⚠️ Session not found, adding new one");

          const isNewlyCreatedSession = newlyCreatedSessions.has(
            String(sessionIdRef.current)
          );

          if (isNewlyCreatedSession) {
            setNewlyCreatedSessions((prev) => {
              const newSet = new Set(prev);
              newSet.delete(String(sessionIdRef.current));
              return newSet;
            });

            return [
              ...prevSessions,
              {
                id: sessionIdRef.current,
                title:
                  query.length > 50 ? query.substring(0, 50) + "..." : query,
                history: [newHistoryItem],
              },
            ];
          } else {
            return [
              ...prevSessions,
              {
                id: sessionIdRef.current,
                title: "Chat Session",
                history: [newHistoryItem],
              },
            ];
          }
        }
      });

      setCurrentQuery(null);
    } catch (error) {
      console.error("Failed to generate response:", error);
      setCurrentQuery(null);
      toast.error("Failed to generate response. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-gray)]">
      <Header />
      <main className="flex-grow pt-16 flex relative">
        <div
          className={cn(
            "fixed md:relative z-20 h-[calc(100vh-64px)] bg-white transition-all duration-300 ease-in-out",
            isSidebarCollapsed ? "w-[60px]" : "w-[280px]"
          )}
        >
          <ChatSidebar
            sessions={sessions}
            activeSessionId={activeSessionId}
            onSelectSession={handleSelectSession}
            onNewChat={handleNewChat}
            onToggleSidebar={toggleSidebar}
            isCollapsed={isSidebarCollapsed}
            isLoading={isLoadingSessions}
          />
        </div>

        <div
          className={cn(
            "flex-1 transition-all duration-300 ease-in-out p-4",
            isSidebarCollapsed ? "ml-[60px]" : "ml-0"
          )}
        >
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
            <p className="text-sm text-amber-800 font-medium">
              ⚠️ IslamGpt can make mistakes. Please cross-verify the response
              for accuracy.
            </p>
          </div>

          {chatHistory.length === 0 && !currentQuery && !isLoadingHistory ? (
            <ChatInterface
              onAskQuestion={handleAskQuestion}
              showInitial={true}
              isPending={generateAIMutation.isPending}
            />
          ) : (
            <div className="bg-white rounded-lg shadow-md w-full min-h-[85vh] relative">
              <div
                ref={chatContainerRef}
                className="h-[calc(85vh-80px)] overflow-y-auto p-6 smooth-scroll"
              >
                {isLoadingHistory ? (
                  <div className="flex justify-center items-center h-full">
                    <p className="text-gray-500">Loading chat history...</p>
                  </div>
                ) : (
                  <>
                    {chatHistory.map((item, index) => (
                      <ChatMessage
                        key={index}
                        query={item.query}
                        response={item.response}
                        isLoading={false}
                      />
                    ))}
                    {currentQuery && (
                      <ChatMessage
                        query={currentQuery.query}
                        response={null}
                        isLoading={true}
                      />
                    )}
                  </>
                )}
              </div>
              <div className="absolute bottom-0 left-0 w-full border-t border-gray-200 bg-white p-4">
                <ChatInterface
                  onAskQuestion={handleAskQuestion}
                  isCompact={true}
                  showInitial={false}
                  disabled={isLoadingHistory}
                  isPending={generateAIMutation.isPending}
                />
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
