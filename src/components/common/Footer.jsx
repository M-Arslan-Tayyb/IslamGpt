import React from "react";

const LANDING_PAGE_URL = "https://islam-gpt-landing-page.vercel.app";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 py-4 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex justify-center items-center space-x-8">
          <a
            href={`${LANDING_PAGE_URL}#faq`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-[var(--primary-color)] text-sm transition-colors"
          >
            FAQ's
          </a>
          <span className="text-gray-300">|</span>
          <a
            href={`${LANDING_PAGE_URL}#terms`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-[var(--primary-color)] text-sm transition-colors"
          >
            Terms
          </a>
          <span className="text-gray-300">|</span>
          <a
            href={`${LANDING_PAGE_URL}#privacy`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-[var(--primary-color)] text-sm transition-colors"
          >
            Privacy
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
