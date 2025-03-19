import React, { useState } from "react";
import { useLocation, Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Header from "../components/common/Header";
import Sidebar from "../components/core/dashboard/Sidebar";
import Footer from "../components/common/Footer";

// Routes that should not show the sidebar
const routesWithoutSidebar = ["/chat", "/nearby-places"];

const DashboardLayout = () => {
  const location = useLocation();
  const { token } = useSelector((state) => state.auth);
  const showSidebar = !routesWithoutSidebar.includes(location.pathname);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-gray)]">
      <Header />
      <div className="flex flex-1">
        {showSidebar && (
          <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        )}
        <main
          className={`flex-1 transition-all duration-300 ${showSidebar ? (isSidebarOpen ? "md:ml-52" : "md:ml-16") : ""
            } pb-16 md:pb-0`}
        >
          <div className="container mx-auto px-4 py-8">
            <Outlet />
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default DashboardLayout;
