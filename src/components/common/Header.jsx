import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MapPin } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button"; // Shadcn Button Component
import logo from "../../assets/images/general/finalLogo.png";
import moment from "moment-hijri";
import { useLogout } from "@/apis/Auth/authApi";

// Set moment-hijri locale to English
moment.locale('en');

const Header = () => {
    const [currentDate] = useState(new Date());
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { token } = useSelector((state) => state.auth);
    const { user } = useSelector((state) => state.profile);
    console.log(user);
    console.log(token);

    // Format Gregorian date
    const gregorianDate = currentDate.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    });

    // Format Hijri date using moment-hijri
    const hijriDateStr = moment(currentDate).format('iMMMM iD, iYYYY') + ' AH';
    console.log(hijriDateStr);

    // Handle logout
    const logout = useLogout();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <header className="bg-white border-b border-gray-200 fixed w-full top-0 z-50">
            <div className="container mx-auto px-4 flex justify-between items-center h-16">
                {/* Left Section */}
                <div className="flex items-center space-x-4">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link to="/dashboard" className="flex items-center">
                            <img src={logo} alt="Islam GPT logo" className="h-14 w-16" />
                            <span className="text-[var(--primary-color)] text-xl font-semibold relative right-[10px] top-[2px]">
                                IslamGPT
                            </span>
                        </Link>
                    </div>

                    {/* Date and Location */}
                    <div className="hidden md:flex items-center space-x-4">
                        <div className="text-sm">
                            <p className="text-gray-600 text-xs">{gregorianDate}</p>
                            <p className="text-[var(--text-color)] text-xs font-bold">{hijriDateStr}</p>
                        </div>
                        <Button
                            variant="ghost"
                            className="flex items-center text-xs bg-[var(--text-bg)] hover:bg-[var(--text-bg-hover)] transition-all duration-300"
                        >
                            <MapPin className="h-4 w-4 mr-2" />
                            Select Location
                        </Button>
                    </div>
                </div>

                {/* Right Section: Login or User Profile */}
                <div className="flex items-center">
                    {!token ? (
                        // If not logged in, show Login button
                        <Link
                            to="/login"
                            className="px-6 py-2 bg-[var(--primary-color)] text-white rounded-lg text-sm hover:text-white hover:bg-[var(--secondary-color)]"
                        >
                            Login
                        </Link>
                    ) : (
                        // If logged in, show User Profile Dropdown
                        <DropdownMenu className="">
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="flex items-center space-x-2 bg-gray-100">
                                    {/* User Initials or Icon */}
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
                                <DropdownMenuItem className="flex items-center space-x-2">
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
                                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
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