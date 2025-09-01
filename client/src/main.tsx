import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";

import HomePage from "./pages/HomePage.tsx";
import AdminLoginPage from "./pages/AdminLoginPage.tsx";
import AdminDashboard from "./pages/AdminDashboard.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
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
        path: "/admin/dashboard",
        element: <AdminDashboard />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
