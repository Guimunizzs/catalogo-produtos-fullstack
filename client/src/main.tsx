import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import { AuthProvider } from "./context/AuthContext.tsx";
import "./index.css";
import App from "./App.tsx";

import HomePage from "./pages/HomePage.tsx";
import AdminLoginPage from "./pages/AdminLoginPage.tsx";
import AdminDashboard from "./pages/AdminDashboard.tsx";
import AdminEditProductPage from "./pages/AdminEditProductPage.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <AuthProvider>
        <App />
      </AuthProvider>
    ),
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/admin/login",
        element: <AdminLoginPage />,
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "/admin/dashboard",
            element: <AdminDashboard />,
          },
          {
            path: "/admin/edit/:productId",
            element: <AdminEditProductPage />,
          },
        ],
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
