import { MainLayout } from "@/layouts/main.layout"

export default function CollectionsPage() {
  return (
    <MainLayout currentHref="/collections" breadcrumbs={[{ label: "Collections", href: "/collections" }]}>
      Itt lesz a CollectionsPage
    </MainLayout>
  )
}
