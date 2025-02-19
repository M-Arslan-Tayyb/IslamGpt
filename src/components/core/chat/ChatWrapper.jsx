import React from "react";
import { cn } from "@/lib/utils";

const ChatWrapper = ({ children, relatedContent, isLoading }) => {
  return (
    <div className="bg-white rounded-lg shadow-md w-full min-h-[85vh] relative">
      <div className="grid grid-cols-1 lg:grid-cols-4 h-full">
        {/* Main chat area */}
        <div className="lg:col-span-3 border-r border-gray-200">
          <div className="h-[calc(85vh-80px)] overflow-y-auto">
            {/* Chat content area */}
            <div className="pb-20">
              {" "}
              {/* Padding bottom for input field */}
              {children}
            </div>
          </div>
          {/* Fixed input at bottom */}
          {/* <div className="absolute bottom-0 left-0 w-full lg:w-3/4 border-t border-gray-200 bg-white p-4"> */}
          {/* <div className="max-w-3xl mx-auto"> */}
          {/* Input field will be rendered here */}
          {/* </div>
          </div> */}
        </div>

        {/* Related content sidebar */}
        <div className="lg:col-span-1 h-[75vh] overflow-y-auto">
          {relatedContent}
        </div>
      </div>
    </div>
  );
};

export default ChatWrapper;
