import React from "react";
import { User } from "lucide-react";
import ResourceList from "./ResourceList";
import RelatedContent from "./RelatedContent";
import { motion } from "framer-motion";
import logo from "../../../assets/images/general/finalLogo.png";

const ChatMessage = ({ query, response, isLoading = false }) => {
  const aiResponse = response?.data?.ai_response;
  const relatedContent = {
    quran: response?.data?.quran || [],
    hadith: response?.data?.hadith || [],
  };

  return (
    <div className="mb-8 last:mb-4 border-b pb-8">
      {/* User Message */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start gap-3 mb-4"
      >
        <div className="w-8 h-8 rounded-full bg-[var(--primary-color)] flex items-center justify-center">
          <User className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <p className="text-gray-800">{query}</p>
        </div>
      </motion.div>

      {/* AI Response */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start gap-3"
      >
        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-md overflow-hidden">
          <img
            src={logo || "/placeholder.svg"}
            alt="IslamGPT"
            className="w-8 h-8 object-contain"
          />
        </div>

        <div className="flex-1">
          <div className="flex flex-col md:flex-row gap-4">
            {/* ResourceList - 70% width */}
            <div className="w-full md:w-[70%]">
              <ResourceList
                query={query}
                aiResponse={aiResponse}
                isLoading={isLoading}
              />
            </div>

            {/* RelatedContent - 30% width */}
            <div className="w-full md:w-[30%]">
              {(relatedContent.quran.length > 0 ||
                relatedContent.hadith.length > 0 ||
                isLoading) && (
                <RelatedContent
                  content={relatedContent}
                  isLoading={isLoading}
                />
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ChatMessage;
