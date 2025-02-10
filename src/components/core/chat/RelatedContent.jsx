import React from "react";
import { ChevronRight, Book, MessageCircle, Video } from "lucide-react";

const Section = ({ title, icon: Icon, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);

  return (
    <div className="border-b border-gray-200 last:border-b-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full p-4 text-left"
      >
        <div className="flex items-center gap-2">
          <Icon className="w-5 h-5 text-[var(--primary-color)]" />
          <span className="font-medium text-gray-900">{title}</span>
        </div>
        <ChevronRight
          className={`w-5 h-5 text-gray-400 transition-transform ${
            isOpen ? "rotate-90" : ""
          }`}
        />
      </button>
      {isOpen && <div className="px-4 pb-4">{children}</div>}
    </div>
  );
};

const RelatedContent = ({ content }) => {
  if (!content) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Related Content</h2>
      <ul className="space-y-4">
        {content.map((item, index) => (
          <li
            key={index}
            className="border-b border-gray-200 pb-4 last:border-b-0 last:pb-0"
          >
            <h3 className="font-medium mb-2">{item.title}</h3>
            <p className="text-sm text-gray-600">{item.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RelatedContent;
