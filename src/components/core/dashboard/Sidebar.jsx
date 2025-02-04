/* eslint-disable react/prop-types */
import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  MessageCircle,
  Book,
  Calendar,
  MapPin,
  Clock,
  Brain,
  Menu,
  CircleX,
} from "lucide-react";

// Mobile menu items (simplified version of main menu)
const mobileMenuItems = [
  {
    title: "Home",
    icon: Home,
    path: "/dashboard",
  },
  {
    title: "Chat",
    icon: MessageCircle,
    path: "/chat",
  },
  {
    title: "Prayers",
    icon: Clock,
    path: "/prayer-time",
  },
  {
    title: "Learn",
    icon: Book,
    path: "/learn-islam",
  },
];

// Desktop menu items (full navigation)
const menuItems = [
  {
    title: "Dashboard",
    icon: Home,
    path: "/dashboard",
    showInSidebar: true,
    description: "View your dashboard",
  },
  {
    title: "Chat",
    icon: MessageCircle,
    path: "/chat",
    showInSidebar: false,
    description: "Start a conversation",
  },
  {
    title: "Learn Islam",
    icon: Book,
    path: "/learn-islam",
    showInSidebar: true,
    description: "Explore Islamic teachings",
  },
  {
    title: "Events",
    icon: Calendar,
    path: "/events",
    showInSidebar: true,
    description: "View upcoming events",
  },
  {
    title: "Nearby Mosques",
    icon: MapPin,
    path: "/nearby-places",
    showInSidebar: false,
    description: "Find mosques and Islamic centers",
  },
  {
    title: "Prayer Time",
    icon: Clock,
    path: "/prayer-time",
    showInSidebar: true,
    description: "Check prayer times",
  },
  {
    title: "About IslamGPT",
    icon: Brain,
    path: "https://islam-gpt-landing-page.vercel.app/",
    showInSidebar: true,
    hasSeparator: true,
    description: "Learn about IslamGPT",
  },
];

const Tooltip = ({ children, content }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef(null);
  const tooltipRef = useRef(null);

  useEffect(() => {
    if (isVisible && triggerRef.current && tooltipRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      setPosition({
        top: triggerRect.top + (triggerRect.height - tooltipRect.height) / 2,
        left: triggerRect.right + 10,
      });
    }
  }, [isVisible]);

  return (
    <div
      ref={triggerRef}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div
          ref={tooltipRef}
          className="fixed z-50 px-2 py-1 text-xs bg-gray-800 text-white rounded shadow-lg"
          style={{ top: `${position.top}px`, left: `${position.left}px` }}
        >
          {content}
        </div>
      )}
    </div>
  );
};

const Sidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className="hidden md:flex bg-white h-screen fixed left-0 top-16 border-r border-gray-200 transition-all duration-300 flex-col"
        style={{ width: isOpen ? "13rem" : "4rem" }}
      >
        <div className="flex flex-col h-full">
          {/* Breadcrumb icon */}
          <div className="px-4 py-3 flex justify-end items-center">
            <button
              onClick={toggleSidebar}
              className="text-gray-600 hover:text-[var(--primary-color)] p-1 rounded-md hover:bg-gray-100"
            >
              {isOpen ? (
                <CircleX className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Main Navigation */}
          <nav className="flex-1 px-4 py-6 overflow-y-auto">
            <ul className="space-y-1">
              {menuItems.map((item, index) => (
                <React.Fragment key={item.path}>
                  {item.hasSeparator && (
                    <li className="my-2">
                      <div className="h-[1px] bg-gray-200" />
                    </li>
                  )}
                  <li>
                    {!isOpen ? (
                      <Tooltip content={item.description}>
                        <Link
                          to={item.path}
                          className={`flex items-center px-2 justify-center py-3 text-xs rounded-lg transition-colors ${
                            location.pathname === item.path
                              ? "bg-[var(--text-bg)] text-[var(--primary-color)] font-semibold"
                              : "text-[var(--text-gray)] hover:bg-[var(--text-bg-hover)]"
                          }`}
                        >
                          <item.icon className="w-4 h-4" />
                        </Link>
                      </Tooltip>
                    ) : (
                      <Link
                        to={item.path}
                        className={`flex items-center px-4 py-3 text-xs rounded-lg transition-colors ${
                          location.pathname === item.path
                            ? "bg-[var(--text-bg)] text-[var(--primary-color)] font-semibold"
                            : "text-[var(--text-gray)] hover:bg-[var(--text-bg-hover)]"
                        }`}
                      >
                        <item.icon className="w-4 h-4 mr-3" />
                        {item.title}
                      </Link>
                    )}
                  </li>
                </React.Fragment>
              ))}
            </ul>
          </nav>
        </div>
      </aside>

      {/* Mobile Footer Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <nav className="flex justify-evenly items-center px-4 py-2">
          {mobileMenuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center px-3 py-1 hover:bg-[var(--text-bg-hover)] transition-all duration-300 rounded-md ${
                location.pathname === item.path
                  ? "text-[var(--primary-color)]"
                  : "text-gray-600"
              }`}
            >
              <item.icon className="w-4 h-4" />
              <span className="text-xs mt-1">{item.title}</span>
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
