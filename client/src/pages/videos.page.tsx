import { MainLayout } from "@/layouts/main.layout"

export default function VideosPage() {
  return (
    <MainLayout currentHref="/videos" breadcrumbs={[{ label: "Videos", href: "/videos" }]}>
      Itt lesz a VideosPage
    </MainLayout>
  )
}
