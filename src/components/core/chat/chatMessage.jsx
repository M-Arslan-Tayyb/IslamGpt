import React from "react";
import RelatedContent from "./RelatedContent";
import { Heart, Share2, MessageCircle } from 'lucide-react';
import { motion } from "framer-motion";

const ChatMessage = ({ query, response, relatedContent }) => {
    const hasRelatedContent = relatedContent && relatedContent.length > 0;
    const isSimpleQuery = !hasRelatedContent && response?.length < 100; // Adjust the length as needed

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
        >
            {/* Question Section */}
            <motion.div
                initial={{ x: -20 }}
                animate={{ x: 0 }}
                className="flex items-start gap-4 mb-4"
            >
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[var(--text-bg)] flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-[var(--primary-color)]" />
                </div>
                <div className="flex-grow">
                    <div className="bg-[var(--text-bg)] rounded-2xl rounded-tl-none p-4 inline-block">
                        <p className="text-gray-800 font-medium">{query}</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button className="p-2 hover:bg-[var(--text-bg)] rounded-full transition-colors">
                        <Heart className="w-5 h-5 text-gray-600" />
                    </button>
                    <button className="p-2 hover:bg-[var(--text-bg)] rounded-full transition-colors">
                        <Share2 className="w-5 h-5 text-gray-600" />
                    </button>
                </div>
            </motion.div>

            {/* Response Section */}
            <motion.div
                initial={{ x: 20 }}
                animate={{ x: 0 }}
                transition={{ delay: 0.2 }}
                className="ml-14"
            >
                {isSimpleQuery ? (
                    // Simple response without headers
                    <div className="bg-white rounded-2xl rounded-tl-none p-4 shadow-md border-l-4 border-[var(--primary-color)]">
                        <p className="text-gray-700">{response || "Coming Soon"}</p>
                    </div>
                ) : (
                    // Full response with Resources and Related Content
                    <div className="bg-white rounded-lg shadow-md border-l-4 border-[var(--primary-color)] p-6">
                        <div className="lg:flex lg:gap-6">
                            {/* Resources Section */}
                            <div className={`${hasRelatedContent ? 'lg:w-2/3' : 'w-full'} mb-4 lg:mb-0`}>
                                <h4 className="text-md font-semibold text-gray-900 mb-2">Resources</h4>
                                <div className="bg-[var(--text-bg)] p-4 rounded-lg">
                                    <p className="text-gray-700">
                                        {response || "Coming Soon"}
                                    </p>
                                </div>
                            </div>

                            {/* Related Content Section */}
                            {hasRelatedContent && (
                                <div className="lg:w-1/3">
                                    <h4 className="text-md font-semibold text-gray-900 mb-2">
                                        Related Content
                                    </h4>
                                    <RelatedContent content={relatedContent} />
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </motion.div>
        </motion.div>
    );
};

export default ChatMessage;