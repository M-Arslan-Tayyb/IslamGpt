"use client"

import { useEffect, useState, useRef } from "react"
import { useLocation, useNavigate, useSearchParams } from "react-router-dom"
import ChatInterface from "../components/common/ChatInterface"
import ChatMessage from "../components/core/chat/chatMessage"
import ChatSidebar from "../components/core/chat/sidebar"
import Header from "@/components/common/Header"
import Footer from "@/components/common/Footer"
import { useGenerateAIMutation, useGetListingMutation, useGetHistoryMutation } from "../apis/chat/chatApi"
import { cn } from "@/lib/utils"
import "react-loading-skeleton/dist/skeleton.css"
import toast from "react-hot-toast"

const Chat = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const chatId = searchParams.get("chatId")

  // State for sidebar
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(window.innerWidth < 768)
  const [sessions, setSessions] = useState([]) // This will be populated from API

  // Use a ref to store the current session ID to avoid race conditions
  const sessionIdRef = useRef(chatId || null)
  // Also keep a state for UI updates
  const [activeSessionId, setActiveSessionId] = useState(chatId)

  // Existing state
  const [chatHistory, setChatHistory] = useState([])
  const [currentQuery, setCurrentQuery] = useState(null)
  const [isLoadingHistory, setIsLoadingHistory] = useState(false)

  // API hooks
  const generateAIMutation = useGenerateAIMutation()
  const getHistoryMutation = useGetHistoryMutation()
  const chatContainerRef = useRef(null)

  // Use the updated query hook for listings
  const {
    data: listingData,
    isLoading: isLoadingSessions,
    refetch: refetchSessions,
    error: listingError,
  } = useGetListingMutation()

  // Update the ref whenever activeSessionId changes
  useEffect(() => {
    console.log("Active session ID changed:", activeSessionId)
    sessionIdRef.current = activeSessionId
  }, [activeSessionId])

  // Log any errors with the listing data
  useEffect(() => {
    if (listingError) {
      console.error("Listing data error:", listingError)
    }
  }, [listingError])

  // Handle window resize for responsive behavior
  useEffect(() => {
    const handleResize = () => {
      // Only auto-collapse on small screens
      if (window.innerWidth < 768) {
        setIsSidebarCollapsed(true)
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Process sessions data when it's available
  useEffect(() => {
    if (listingData?.succeeded && listingData.data) {
      console.log("Listing data received:", listingData)

      // Transform the data to match the format expected by ChatSidebar
      const formattedSessions = listingData.data.map((session) => ({
        id: session.session_id,
        title: session.title || getFirstQuestion(session.history) || "New Chat",
        history: session.history,
      }))
      setSessions(formattedSessions)

      // If chatId is provided in URL, select that session
      if (chatId) {
        console.log("Setting active session from URL:", chatId)
        setActiveSessionId(chatId)
        sessionIdRef.current = chatId
        fetchSessionHistory(chatId)
      }
      // If no chatId but sessions exist, select the first one
      else if (formattedSessions.length > 0 && !sessionIdRef.current) {
        const firstSessionId = formattedSessions[0].id
        console.log("Setting active session to first session:", firstSessionId)
        setActiveSessionId(firstSessionId)
        sessionIdRef.current = firstSessionId
        navigate(`/chat?chatId=${firstSessionId}`, { replace: true })
        fetchSessionHistory(firstSessionId)
      }
    } else if (listingData) {
      console.log("Listing data format unexpected:", listingData)
    }
  }, [listingData])

  // Fetch session history when chatId changes
  useEffect(() => {
    if (chatId && chatId !== sessionIdRef.current) {
      console.log("URL chatId changed, updating active session:", chatId)
      setActiveSessionId(chatId)
      sessionIdRef.current = chatId
      fetchSessionHistory(chatId)
    } else if (location.state?.query) {
      handleAskQuestion(location.state.query)
    }
  }, [chatId, location.state])

  // Function to fetch session history
  const fetchSessionHistory = async (sessionId) => {
    if (!sessionId) return

    setIsLoadingHistory(true)
    try {
      const result = await getHistoryMutation.mutateAsync(sessionId)
      if (result.succeeded && result.data) {
        loadSessionHistory(result.data)
      }
    } catch (error) {
      console.error("Failed to fetch session history:", error)
      toast.error("Failed to load chat history")
    } finally {
      setIsLoadingHistory(false)
    }
  }

  // Helper function to load session history
  const loadSessionHistory = (sessionData) => {
    if (!sessionData.history) return

    const formattedHistory = sessionData.history.map((item) => {
      // Extract question and answer from the format "user_question: text" and "AI_answer: text"
      const query = item.question.replace("user_question: ", "")
      const aiResponse = item.answer.replace("AI_answer: ", "")

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
      }
    })

    setChatHistory(formattedHistory)
  }

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [chatHistory, currentQuery])

  // Toggle sidebar
  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed)
  }

  // Handle new chat
  const handleNewChat = () => {
    // Generate an 8-digit random number
    const newSessionId = Math.floor(10000000 + Math.random() * 90000000).toString();
    console.log("Creating new chat with session ID:", newSessionId);

    // Update both the state and the ref
    setActiveSessionId(newSessionId);
    sessionIdRef.current = newSessionId;

    // Clear the current chat
    navigate("/chat");
    setChatHistory([]);
    setCurrentQuery(null);

    // Open sidebar when creating a new chat
    setIsSidebarCollapsed(false);
  }

  // Handle session selection
  const handleSelectSession = (sessionId) => {
    if (sessionId === sessionIdRef.current) return

    console.log("Selecting session:", sessionId)
    navigate(`/chat?chatId=${sessionId}`)
    setActiveSessionId(sessionId)
    sessionIdRef.current = sessionId
    fetchSessionHistory(sessionId)

    // On mobile, collapse sidebar after selection
    if (window.innerWidth < 768) {
      setIsSidebarCollapsed(true)
    }
  }

  // Helper function to extract the first question as a title
  const getFirstQuestion = (history) => {
    if (!history || history.length === 0) return null
    const firstQuestion = history[0].question
    // Extract just the question part from "user_question: actual question"
    return firstQuestion.replace("user_question: ", "")
  }

  // Handle ask question
  const handleAskQuestion = async (query) => {
    setCurrentQuery({ query, response: null, relatedContent: null })

    try {
      // Get the current session ID from the ref to avoid race conditions
      const currentSessionId = sessionIdRef.current

      console.log("Sending message with session ID:", currentSessionId)

      const data = await generateAIMutation.mutateAsync({
        query,
        sessionId: currentSessionId,
      })

      // If the API returns a session ID and we don't have one, update it
      if (data.session_id && !currentSessionId) {
        console.log("Received new session ID from API:", data.session_id)
        setActiveSessionId(data.session_id)
        sessionIdRef.current = data.session_id
        navigate(`/chat?chatId=${data.session_id}`, { replace: true })
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
      }

      setChatHistory((prevHistory) => [...prevHistory, newHistoryItem])
      setCurrentQuery(null)

      // After sending a message, refresh the sessions list to get the updated data
      refetchSessions()
    } catch (error) {
      console.error("Failed to generate response:", error)
      setCurrentQuery(null)
      toast.error("Failed to generate response. Please try again.")
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-gray)]">
      <Header />
      <main className="flex-grow pt-16 flex relative">
        {/* Sidebar with transition */}
        <div
          className={cn(
            "fixed md:relative z-20 h-[calc(100vh-64px)] bg-white transition-all duration-300 ease-in-out",
            isSidebarCollapsed
              ? "w-[60px]" // Changed to show a thin strip instead of completely hiding
              : "w-[280px]",
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

        {/* Main chat area with proper spacing */}
        <div
          className={cn(
            "flex-1 transition-all duration-300 ease-in-out p-4",
            isSidebarCollapsed
              ? "ml-[60px]" // Adjusted margin to match collapsed sidebar width
              : "ml-0",
          )}
        >
          {chatHistory.length === 0 && !currentQuery && !isLoadingHistory ? (
            <ChatInterface onAskQuestion={handleAskQuestion} showInitial={true} />
          ) : (
            <div className="bg-white rounded-lg shadow-md w-full min-h-[85vh] relative">
              <div ref={chatContainerRef} className="h-[calc(85vh-80px)] overflow-y-auto p-6 smooth-scroll">
                {isLoadingHistory ? (
                  <div className="flex justify-center items-center h-full">
                    <p className="text-gray-500">Loading chat history...</p>
                  </div>
                ) : (
                  <>
                    {chatHistory.map((item, index) => (
                      <ChatMessage key={index} query={item.query} response={item.response} isLoading={false} />
                    ))}
                    {currentQuery && <ChatMessage query={currentQuery.query} response={null} isLoading={true} />}
                  </>
                )}
              </div>

              <div className="absolute bottom-0 left-0 w-full border-t border-gray-200 bg-white p-4">
                <ChatInterface
                  onAskQuestion={handleAskQuestion}
                  isCompact={true}
                  showInitial={false}
                  disabled={isLoadingHistory}
                />
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Chat

