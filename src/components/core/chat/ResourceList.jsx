import React from "react";
import { Heart, Share2 } from "lucide-react";

const mockResources = [
  {
    id: 1,
    type: "Article",
    title: "Who is Allah",
    arabicTitle: "إسلام ويب",
    number: "1",
  },
  {
    id: 2,
    type: "Fatwa",
    title: "Who is Allaah? - Islam Question & Answer",
    arabicTitle: "الإسلام سؤال وجواب 2",
  },
  {
    id: 3,
    type: "Fatwa",
    title: "Is Allah Above the Heavens? - Islamic Ruling",
    arabicTitle: "الإسلام سؤال وجواب 3",
  },
];

const ResourceList = ({ query }) => {
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

      <div className="mb-6">
        <div className="text-sm text-gray-600 mb-4">
          {mockResources.length} Resources found
        </div>

        <div className="space-y-4">
          {mockResources.map((resource) => (
            <div
              key={resource.id}
              className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <div className="flex items-start gap-3">
                <div className="bg-[var(--primary-color)] bg-opacity-10 p-2 rounded">
                  <span className="text-[var(--primary-color)] text-sm font-medium">
                    {resource.type}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 mb-1">
                    {resource.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {resource.arabicTitle}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* <div className="mt-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Ask a follow up question..."
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent"
          />
          <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-[var(--primary-color)] text-white rounded-lg">
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M20 4L3 11L10 14L13 21L20 4Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div> */}
    </div>
  );
};

export default ResourceList;
