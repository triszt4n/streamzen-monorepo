import { MainLayout } from "@/layouts/main.layout"

export const EventsPage = () => {
  return (
    <MainLayout currentHref="/events" className="max-w-6xl mx-auto" publicPage>
      <h1 className="text-4xl font-medium tracking-tight lg:text-5xl font-heading">Budavári Schönherz Stúdió</h1>
      <div>Ez már a tartalom</div>
    </MainLayout>
  )
}
