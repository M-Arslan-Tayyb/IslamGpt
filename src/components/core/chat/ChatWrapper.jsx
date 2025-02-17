import React from "react";
import { cn } from "@/lib/utils";

const ChatWrapper = ({ children, className }) => {
  return (
    <div
      className={cn(
        "relative min-h-[85vh] bg-white rounded-lg shadow-md",
        className
      )}
    >
      <div className="absolute inset-0 overflow-y-auto">
        <div className="h-full ">
          {" "}
          {/* Add padding bottom to account for fixed input */}
          {children}
        </div>
      </div>
    </div>
  );
};

export default ChatWrapper;
