"use client";

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
  MoreHorizontal,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
{
  /* Desktop Sidebar */
}
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

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
    title: "Nearby Mosques",
    icon: MapPin,
    path: "/nearby-places",
    showInSidebar: false,
    description: "Find mosques and Islamic centers",
  },
];

// Additional menu items to show in "More" popover
const moreMenuItems = [
  {
    title: "Embrace Islam",
    icon: Book,
    path: "/embrace-islam",
    description: "How to embrace Islam",
  },
  {
    title: "Events",
    icon: Calendar,
    path: "/events",
    description: "View upcoming events",
  },
  {
    title: "Prayer Time",
    icon: Clock,
    path: "/prayer-time",
    description: "Check prayer times",
  },
  {
    title: "About IslamGPT",
    icon: Brain,
    path: "https://islam-gpt-landing-page.vercel.app/",
    description: "Learn about IslamGPT",
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
    title: "Nearby Mosques",
    icon: MapPin,
    path: "/nearby-places",
    showInSidebar: false,
    description: "Find mosques and Islamic centers",
  },
  {
    title: "Embrace Islam",
    icon: Book,
    path: "/embrace-islam",
    showInSidebar: true,
    description: "How to embrace Islam",
  },
  {
    title: "Events",
    icon: Calendar,
    path: "/events",
    showInSidebar: true,
    description: "View upcoming events",
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

const Sidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  const [morePopoverOpen, setMorePopoverOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // Check if any of the "more" items is currently active
  const isMoreActive = moreMenuItems.some(
    (item) => location.pathname === item.path
  );

  return (
    <>
      <TooltipProvider>
        <aside
          className="hidden md:flex bg-white h-screen fixed left-0 top-16 border-r border-gray-200 transition-all duration-300 flex-col"
          style={{ width: isOpen ? "13rem" : "4rem" }}
        >
          <div className="flex flex-col h-full">
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

            <nav className="flex-1 px-4 py-6 overflow-y-auto">
              <ul className="space-y-1">
                {menuItems.map((item) => (
                  <React.Fragment key={item.path}>
                    {item.hasSeparator && (
                      <li className="my-2">
                        <div className="h-[1px] bg-gray-200" />
                      </li>
                    )}
                    <li>
                      {!isOpen ? (
                        <Tooltip>
                          <TooltipTrigger asChild>
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
                          </TooltipTrigger>
                          <TooltipContent side="right">
                            {item.description}
                          </TooltipContent>
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
      </TooltipProvider>

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

          {/* More Button with Popover */}
          <Popover open={morePopoverOpen} onOpenChange={setMorePopoverOpen}>
            <PopoverTrigger asChild>
              <button
                className={`flex flex-col items-center justify-center px-3 py-1 hover:bg-[var(--text-bg-hover)] transition-all duration-300 rounded-md ${
                  isMoreActive || morePopoverOpen
                    ? "text-[var(--primary-color)]"
                    : "text-gray-600"
                }`}
              >
                <MoreHorizontal className="w-4 h-4" />
                <span className="text-xs mt-1">More</span>
              </button>
            </PopoverTrigger>
            <PopoverContent
              className="w-80 p-0 mb-2"
              side="top"
              align="end"
              sideOffset={8}
            >
              <div className="p-2">
                <div className="space-y-1">
                  {moreMenuItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMorePopoverOpen(false)}
                      className={`flex items-center p-3 rounded-lg transition-colors hover:bg-gray-50 ${
                        location.pathname === item.path
                          ? "bg-[var(--text-bg)] text-[var(--primary-color)]"
                          : "text-gray-700"
                      }`}
                    >
                      <item.icon className="w-5 h-5 mr-3 text-gray-500" />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm">{item.title}</div>
                        <div className="text-xs text-gray-500 truncate">
                          {item.description}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
