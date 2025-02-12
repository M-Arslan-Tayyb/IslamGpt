import React from "react";
import { Heart, Share2 } from "lucide-react";
import LoadingSkeleton from "@/components/common/LoadingSkelton";

const ResourceList = ({ query, aiResponse, isLoading }) => {
  if (isLoading) {
    return <LoadingSkeleton />;
  }
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">{query}</h1>
        <div className="flex gap-2">
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <Heart className="w-5 h-5 text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <Share2 className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>
      {aiResponse && (
        <div className="mb-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-2">AI Response</h3>
            <p className="text-gray-600">{aiResponse}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResourceList;
