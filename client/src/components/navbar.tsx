import bssLogoBlugBg from "@/assets/bss-logo-bluebg.svg"
import schLogo from "@/assets/logo-sch-easy.svg"
import { useAuth } from "@/hooks/use-auth.hook"
import { useMe } from "@/hooks/use-me.hook"
import { StreamzenRouteObject } from "@/lib/routes"
import { Menu, Search } from "lucide-react"
import { Link } from "react-router-dom"
import { ModeToggle } from "./mode-toggle"
import { Button } from "./ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { Input } from "./ui/input"
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet"

interface NavbarProps {
  routesNavGroup: StreamzenRouteObject[]
  currentHref: string
  navGroup: string
}

export const Navbar: React.FC<NavbarProps> = ({ routesNavGroup, currentHref, navGroup }) => {
  const { authenticated, login, logout } = useAuth()
  const { data: me } = useMe()

  return (
    <header className="sticky shadow-md top-0 flex h-12 items-center gap-4 border-b bg-background px-4 md:px-6">
      <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-4 md:text-sm lg:gap-8">
        <Link to="/" className="block w-20 lg:w-24">
          <img src={bssLogoBlugBg} alt="Budavári Schönherz Stúdió logója" className="h-full w-full" />
        </Link>
        {routesNavGroup.map((route) => (
          <Link
            key={route.path}
            to={route.path ?? "/"}
            className={`${route.path === currentHref ? "text-tertiary dark:text-tertiary" : "text-primary dark:text-foreground"} transition-colors hover:text-tertiary dark:hover:text-tertiary font-bold`}
          >
            {route.navTitle}
          </Link>
        ))}
      </nav>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <nav className="grid gap-6 text-lg font-medium">
            <Link to="/" className="block w-32">
              <img src={bssLogoBlugBg} alt="Budavári Schönherz Stúdió logója" className="h-full w-full" />
            </Link>
            {routesNavGroup.map((route) => (
              <Link key={route.path} to={route.path ?? "/"} className={`${route.path === currentHref ? "" : "text-muted-foreground"} hover:text-foreground`}>
                {route.navTitle}
              </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
      <div className="flex w-full md:w-auto items-center gap-4 md:ml-auto md:gap-2">
        <form className="ml-auto flex-1 sm:flex-initial">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-primary dark:text-tertiary" />
            <Input type="search" placeholder="Tartalom böngészése..." className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]" />
          </div>
        </form>
        <ModeToggle />
        {navGroup === "studio" && authenticated && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="overflow-hidden">
                <img
                  src={me?.imageUrl}
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder-user.jpg"
                  }}
                  width={36}
                  height={36}
                  alt="Avatar"
                  className="overflow-hidden"
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                <div>
                  <div className="">{me?.fullName}</div>
                  <div className="text-xs text-muted-foreground">{me?.email}</div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link to="/">Vissza a főoldalra</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  logout()
                }}
              >
                Kijelentkezés
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        {navGroup === "studio" && !authenticated && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="overflow-hidden">
                Bejelentkezés
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => {
                  login()
                }}
              >
                <div className="flex justify-between items-center">
                  <img src={schLogo} className="w-4 h-4 mr-2" alt="AuthSCH" />
                  <div>AuthSCH-val</div>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        {navGroup === "main" && localStorage.getItem("visitedStudio") === "true" && (
          <Link to="/studio">
            <Button variant="default" size="sm" className="font-bold">
              Stúdió
            </Button>
          </Link>
        )}
      </div>
    </header>
  )
}
