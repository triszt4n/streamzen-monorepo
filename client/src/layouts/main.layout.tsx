import bgPattern from "@/assets/bg-pattern.svg"

import { BreadcrumbComposite } from "@/components/breadcrumb-composite"
import { Footer } from "@/components/footer"
import { Navbar } from "@/components/navbar"
import { Toaster } from "@/components/ui/sonner"
import { routes } from "@/lib/routes"

interface MainLayoutProps {
  currentHref: string
  navGroup?: string
  className?: string
}

export const MainLayout: React.FC<React.PropsWithChildren<MainLayoutProps>> = ({ children, navGroup = "main", currentHref, className = "" }) => {
  const routesNavGroup = routes.filter((route) => route.navGroup === navGroup)

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Navbar routesNavGroup={routesNavGroup} currentHref={currentHref} navGroup={navGroup} />
      <div
        className="flex min-h-[calc(100vh_-_theme(spacing.84))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8"
        style={{ background: `url(${bgPattern}) 20px 20px repeat` }}
      >
        <BreadcrumbComposite />
        <main>
          <div className={className}>{children}</div>
        </main>
        <Toaster />
      </div>
      <Footer />
    </div>
  )
}
