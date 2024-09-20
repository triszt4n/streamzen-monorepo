import { MainLayout } from "@/layouts/main.layout"
import { Link } from "react-router-dom"
import { Button } from "../components/ui/button"

export default function IndexPage() {
  return (
    <MainLayout currentHref="/" breadcrumbs={[{ label: "Home", href: "/" }]}>
      <h1 className="text-3xl font-bold">Welcome to Vite UI</h1>
      <Link to="/videos">
        <Button>Dashboard</Button>
      </Link>
    </MainLayout>
  )
}
