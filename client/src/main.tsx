import { TooltipProvider } from "@/components/ui/tooltip.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./assets/fonts/Inter_18pt-Regular.ttf";
import { ThemeProvider } from "./components/theme-provider.tsx";
import { AuthProvider } from "./hooks/auth-context.tsx";
import "./index.css";
import CollectionsPage from "./pages/collections.tsx";
import IndexPage from "./pages/index.tsx";
import StudioPage from "./pages/studio.tsx";
import VideosPage from "./pages/videos.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <IndexPage />,
  },
  {
    path: "/videos",
    element: <VideosPage />,
  },
  {
    path: "/collections",
    element: <CollectionsPage />,
  },
  {
    path: "/studio",
    element: <StudioPage />,
  },
]);

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <TooltipProvider>
            <RouterProvider router={router} />
          </TooltipProvider>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>
);
