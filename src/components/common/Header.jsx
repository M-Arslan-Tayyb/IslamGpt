import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { MapPin, ArrowLeft } from "lucide-react";
import { useSelector } from "react-redux";
// Import useLogout hook

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import logo from "../../assets/images/general/finalLogo.png";
import moment from "moment-hijri";
import { useLogout } from "@/apis/Auth/authApi";

moment.locale("en");

const Header = () => {
  const [currentDate] = useState(new Date());
  const navigate = useNavigate();
  const location = useLocation();
  const isChat = location.pathname === "/chat";

  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);

  const gregorianDate = currentDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const hijriDateStr = moment(currentDate).format("iMMMM iD, iYYYY") + " AH";

  const logout = useLogout();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header className="bg-white border-b border-gray-200 fixed w-full top-0 z-50">
      <div className="container mx-auto px-4 flex justify-between items-center h-16">
        <div className="flex items-center gap-4">
          {/* Back Button for Chat Page */}
          {isChat && (
            <Button
              variant="ghost"
              onClick={() => navigate("/dashboard")}
              className="hover:bg-gray-100"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}

          {/* Logo - Single Instance */}
          <Link to="/dashboard" className="flex items-center">
            <img
              src={logo || "/placeholder.svg"}
              alt="Islam GPT logo"
              className="h-14 w-16"
            />
            <span className="text-[var(--primary-color)] text-xl font-semibold relative right-[10px] top-[2px]">
              IslamGPT
            </span>
          </Link>

          {/* Date and Location - Only on Dashboard */}
          {!isChat && (
            <div className="hidden md:flex items-center gap-4">
              <div className="text-sm">
                <p className="text-gray-600 text-xs">{gregorianDate}</p>
                <p className="text-[var(--text-color)] text-xs font-bold">
                  {hijriDateStr}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* User Profile/Login Section */}
        <div className="flex items-center">
          {!token ? (
            <Link
              to="/login"
              className="px-6 py-2 bg-[var(--primary-color)] text-white rounded-lg text-sm hover:text-white hover:bg-[var(--secondary-color)]"
            >
              Login
            </Link>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 bg-gray-100"
                >
                  <div className="h-8 w-8 flex items-center justify-center bg-gray-200 text-gray-700 rounded-full">
                    {user?.firstName?.charAt(0)}
                    {user?.lastName?.charAt(0)}
                  </div>
                  <span className="text-sm font-medium">
                    {user?.firstName} {user?.lastName}
                  </span>
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem className="flex items-center gap-2">
                  <div className="h-8 w-8 flex items-center justify-center bg-gray-200 text-gray-700 rounded-full">
                    {user?.firstName?.charAt(0)}
                    {user?.lastName?.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      {user?.firstName} {user?.lastName}
                    </p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer"
                >
                  <span className="text-red-500">Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
