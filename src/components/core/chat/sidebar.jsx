"use client";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Plus, Trash2Icon } from "lucide-react";
import { useState } from "react";
import { useDeleteSessionMutation } from "../../../apis/chat/chatApi";
import ConfirmationModal from "@/components/common/ConfirmationModal";

const ChatSidebar = ({
  sessions = [],
  activeSessionId,
  onSelectSession,
  onNewChat,
  onToggleSidebar,
  isCollapsed,
  isLoading = false,
}) => {
  console.log("Sessions:", sessions);
  console.log("Active Session ID:", activeSessionId);
  const [hoveredSessionId, setHoveredSessionId] = useState(null);
  const { mutate: deleteSession, isLoading: isDeleting } =
    useDeleteSessionMutation();

  // Add state for confirmation modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState(null);
  const [showDelete, setShowDelete] = useState(false);

  // Format chat title for display
  const formatChatTitle = (query) => {
    return query.length > 30 ? query.substring(0, 30) + "..." : query;
  };

  // Sort sessions so that the latest one appears at the top
  const sortedSessions = [...sessions].reverse();

  // Handle delete button click
  const handleDeleteClick = (e, sessionId, sessionTitle) => {
    e.stopPropagation();
    setSessionToDelete({
      id: sessionId,
      title: sessionTitle || "New Conversation",
    });
    setShowDeleteModal(true);
  };

  // Handle confirmation
  const handleConfirmDelete = async () => {
    if (sessionToDelete) {
      await deleteSession({ session_id: sessionToDelete.id });
    }
    setShowDeleteModal(false);
  };

  if (isCollapsed) {
    return (
      <div className="h-full flex flex-col items-center bg-white border-r border-gray-200 w-[60px] relative">
        {/* New Chat Button (Collapsed) */}
        <Button
          onClick={onNewChat}
          className="mt-4 bg-[var(--primary-color)] hover:bg-[var(--secondary-color)] text-white w-10 h-10"
          size="icon"
        >
          <Plus className="h-5 w-5" />
        </Button>

        {/* Toggle Sidebar Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSidebar}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white shadow-md h-8 w-8 rounded-full flex items-center justify-center border border-gray-200"
          aria-label="Expand sidebar"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  const handleHover = () => {
    setShowDelete(true);
  };

  const handleLeave = () => {
    setShowDelete(false);
  };

  return (
    <div className="h-full flex flex-col bg-white border-r border-gray-200 w-full relative">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 className="font-semibold text-lg">Conversations</h2>
      </div>

      {/* New Chat Button */}
      <div className="p-4">
        <Button
          onClick={onNewChat}
          className="w-full bg-[var(--primary-color)] hover:bg-[var(--secondary-color)] text-white"
        >
          <Plus className="mr-2 h-4 w-4" /> New Chat
        </Button>
      </div>

      {/* Chat Sessions List */}
      <ScrollArea className="flex-1 px-2">
        <div
          className="space-y-2 py-2 "
          onMouseEnter={handleHover}
          onMouseLeave={handleLeave}
        >
          {isLoading ? (
            // Show loading skeletons
            Array(3)
              .fill(0)
              .map((_, index) => (
                <div key={index} className="p-2">
                  <Skeleton className="h-10 w-full" />
                </div>
              ))
          ) : sortedSessions.length > 0 ? (
            sortedSessions.map((session) => {
              // Convert both IDs to strings for accurate comparison
              const isActive = String(session.id) === String(activeSessionId);
              console.log(
                `Session ID: ${session.id}, Active ID: ${activeSessionId}, isActive: ${isActive}`
              );

              return (
                <div
                  key={session.id}
                  onMouseEnter={() => setHoveredSessionId(session.id)}
                  onMouseLeave={() => setHoveredSessionId(null)}
                >
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      isActive
                        ? "!bg-gray-200 !text-[var(--primary-color)] "
                        : "hover:bg-gray-100"
                    )}
                    onClick={() => onSelectSession(session.id)}
                  >
                    <div className="flex-1 truncate">
                      <span className="block truncate">
                        {formatChatTitle(session.title || "New Conversation")}
                      </span>
                    </div>

                    {hoveredSessionId === session.id && (
                      <Button
                        variant="ghost"
                        className="ml-2 text-red-500 hover:text-red-700 hover:bg-transparent p-1 h-auto min-h-0"
                        onClick={(e) =>
                          handleDeleteClick(e, session.id, session.title)
                        }
                        disabled={isDeleting}
                      >
                        <Trash2Icon className="w-4 h-4" stroke="currentColor" />
                      </Button>
                    )}
                  </Button>
                </div>
              );
            })
          ) : (
            <div className="text-center py-4 text-gray-500 text-sm">
              No conversations yet
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Toggle Sidebar Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onToggleSidebar}
        className="absolute top-1/2 -right-4 -translate-y-1/2 bg-white shadow-md h-8 w-8 rounded-full flex items-center justify-center border border-gray-200"
        aria-label="Collapse sidebar"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Conversation"
        description={
          sessionToDelete
            ? `Are you sure you want to delete "${formatChatTitle(
                sessionToDelete.title
              )}"? This action cannot be undone.`
            : ""
        }
        primaryButtonText="Delete"
        secondaryButtonText="Cancel"
        variant="destructive"
        isLoading={isDeleting}
        showIcon={true}
      />
    </div>
  );
};

export default ChatSidebar;
