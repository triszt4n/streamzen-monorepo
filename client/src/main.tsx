import { TooltipProvider } from "@/components/ui/tooltip.tsx"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { RouterProvider, createBrowserRouter } from "react-router-dom"
import { ThemeProvider } from "./components/theme-provider.tsx"
import { AuthProvider } from "./hooks/auth-context.tsx"
import { BreadcrumbProvider } from "./hooks/breadcrumb-context.tsx"
import "./index.css"
import { routes } from "./lib/routes.tsx"

const router = createBrowserRouter(routes)
const queryClient = new QueryClient()

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BreadcrumbProvider>
          <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <TooltipProvider>
              <RouterProvider router={router} />
            </TooltipProvider>
          </ThemeProvider>
        </BreadcrumbProvider>
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>
)
