import {
  RouterProvider,
  createBrowserRouter,
  Navigate,
} from "react-router-dom";
import AppLayout from "./layout/AppLayout";
import DashboardLayout from "./layout/DashboardLayout";
import ErrorBoundary from "./components/common/ErrorBoundry";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import DashBoard from "./pages/DashBoard";
import ForgotPass from "./pages/Forgot-Pass";
import Chat from "./pages/Chat";
import VerifyOtp from "./pages/VerifyOtp";
import ResetPassword from "./pages/ResetPassword";
import PrivateRoute from "./components/core/Auth/PrivateRoute";
import OpenRoute from "./components/core/Auth/OpenRoute";
import DashboardRoute from "./components/core/Auth/DashboardRoute";
import EmbraceIslam from "./pages/EmbraceIslam";
import Events from "./pages/Events";
import PrayerTime from "./pages/PrayerTime";
import NearByMosque from "./pages/NearByMosque";

function App() {
  const router = createBrowserRouter([
    {
      element: <DashboardLayout />,
      children: [
        {
          path: "/",
          element: <Navigate to="/dashboard" replace />,
        },
        {
          path: "/nearby-places",
          element: (
            <PrivateRoute>
              <ErrorBoundary>
                <NearByMosque />
              </ErrorBoundary>
            </PrivateRoute>
          ),
        },
        {
          path: "/dashboard",
          element: (
            <DashboardRoute>
              <ErrorBoundary>
                <DashBoard />
              </ErrorBoundary>
            </DashboardRoute>
          ),
        },
        {
          path: "/embrace-islam",
          element: (
            <PrivateRoute>
              <ErrorBoundary>
                <EmbraceIslam />
              </ErrorBoundary>
            </PrivateRoute>
          ),
        },
        {
          path: "/events",
          element: (
            <PrivateRoute>
              <ErrorBoundary>
                <Events />
              </ErrorBoundary>
            </PrivateRoute>
          ),
        },
        {
          path: "/prayer-time",
          element: (
            <PrivateRoute>
              <ErrorBoundary>
                <PrayerTime />
              </ErrorBoundary>
            </PrivateRoute>
          ),
        },
        {
          path: "/ai",
          element: (
            <PrivateRoute>
              <ErrorBoundary>{/* <ShahadaAI /> */}</ErrorBoundary>
            </PrivateRoute>
          ),
        },
      ],
    },
    // Routes without sidebar
    {
      path: "/chat",
      element: (
        <PrivateRoute>
          <ErrorBoundary>
            <Chat />
          </ErrorBoundary>
        </PrivateRoute>
      ),
    },

    {
      path: "/login",
      element: (
        <OpenRoute>
          <ErrorBoundary>
            <Login />
          </ErrorBoundary>
        </OpenRoute>
      ),
    },
    {
      path: "/forgot-password",
      element: (
        <OpenRoute>
          <ErrorBoundary>
            <ForgotPass />
          </ErrorBoundary>
        </OpenRoute>
      ),
    },
    {
      path: "/signup",
      element: (
        <OpenRoute>
          <ErrorBoundary>
            <Signup />
          </ErrorBoundary>
        </OpenRoute>
      ),
    },
    {
      path: "/verify-otp",
      element: (
        <OpenRoute>
          <ErrorBoundary>
            <VerifyOtp />
          </ErrorBoundary>
        </OpenRoute>
      ),
    },
    {
      path: "/reset-password",
      element: (
        <OpenRoute>
          <ErrorBoundary>
            <ResetPassword />
          </ErrorBoundary>
        </OpenRoute>
      ),
    },
    {
      path: "*",
      element: <Navigate to="/dashboard" replace />,
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
