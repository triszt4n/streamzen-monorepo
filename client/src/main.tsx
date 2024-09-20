import { TooltipProvider } from "@/components/ui/tooltip.tsx"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { RouterProvider, createBrowserRouter } from "react-router-dom"
import { ThemeProvider } from "./components/theme-provider.tsx"
import { AuthProvider } from "./hooks/auth-context.tsx"
import "./index.css"
import CollectionsPage from "./pages/collections.page.tsx"
import IndexPage from "./pages/index.page.tsx"
import EditVideoPage from "./pages/studio/edit.page.tsx"
import StudioPage from "./pages/studio/studio.page.tsx"
import VideosPage from "./pages/videos.page.tsx"

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
  {
    path: "/studio/edit/:id",
    element: <EditVideoPage />,
  },
])

const queryClient = new QueryClient()

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
)
