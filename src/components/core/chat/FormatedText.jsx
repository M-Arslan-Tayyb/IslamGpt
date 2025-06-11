import React from "react";

const FormattedText = ({ text }) => {
  const formatText = (text) => {
    // Split by double line breaks to create paragraphs
    const paragraphs = text.split("\n\n");

    return paragraphs.map((paragraph, index) => {
      // Handle numbered lists
      if (paragraph.match(/^\d+\./)) {
        const lines = paragraph.split("\n");
        return (
          <div key={index} className="mb-4">
            {lines.map((line, lineIndex) => {
              if (line.match(/^\d+\./)) {
                return (
                  <div key={lineIndex} className="mb-3">
                    {formatInlineText(line)}
                  </div>
                );
              } else if (line.trim()) {
                return (
                  <div key={lineIndex} className="ml-4 mb-2 text-gray-700">
                    {formatInlineText(line)}
                  </div>
                );
              }
              return null;
            })}
          </div>
        );
      }

      // Regular paragraphs
      if (paragraph.trim()) {
        return (
          <p key={index} className="mb-4 leading-relaxed">
            {formatInlineText(paragraph)}
          </p>
        );
      }

      return null;
    });
  };

  const formatInlineText = (text) => {
    // Split by bold markers and process
    const parts = text.split(/(\*\*.*?\*\*)/g);

    return parts.map((part, index) => {
      // Handle bold text
      if (part.startsWith("**") && part.endsWith("**")) {
        const boldText = part.slice(2, -2);
        return (
          <strong key={index} className="font-semibold text-gray-900">
            {boldText}
          </strong>
        );
      }

      // Handle Quran/Hadith references (text in parentheses)
      if (part.includes("(Quran") || part.includes("(Sahih")) {
        return (
          <span key={index}>
            {part.replace(/($$[^)]+$$)/g, (match) => {
              return ``;
            })}
            <cite className="text-sm text-blue-600 font-medium ml-1">
              {part.match(/($$[^)]+$$)/)?.[0] || ""}
            </cite>
          </span>
        );
      }

      // Handle quoted text
      if (
        part.includes('"') &&
        (part.includes("Quran") || part.includes("Prophet"))
      ) {
        return (
          <span
            key={index}
            className="italic text-gray-800 bg-blue-50 px-2 py-1 rounded"
          >
            {part}
          </span>
        );
      }

      return <span key={index}>{part}</span>;
    });
  };

  return <div className="prose prose-gray max-w-none">{formatText(text)}</div>;
};

export default FormattedText;
