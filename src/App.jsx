import { RouterProvider, createBrowserRouter } from "react-router-dom"
import AppLayout from "./layout/AppLayout"
import ErrorBoundary from "./components/common/ErrorBoundry"
import Home from "./pages/DashBoard"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import DashBoard from "./pages/DashBoard"

function App() {
  const router = createBrowserRouter([
    {
      element: <AppLayout />,
      children: [
        {
          path: "/",
          element: (
            <ErrorBoundary>
              <DashBoard />
            </ErrorBoundary>
          ),
        },
        // Add more routes that should use AppLayout here
      ]
    },
    {
      path: "/login",
      element: (
        <ErrorBoundary>
          <Login />
        </ErrorBoundary>
      ),
    },
    {
      path: "/signup",
      element: (
        <ErrorBoundary>
          <Signup />
        </ErrorBoundary>
      ),
    },
    // You can add more routes that don't use AppLayout here
  ]);

  return <RouterProvider router={router} />
}

export default App