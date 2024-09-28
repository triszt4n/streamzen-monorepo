import { Charts } from "@/components/composite/random-charts"
import { MainLayout } from "@/layouts/main.layout"

export const IndexPage = () => {
  return (
    <MainLayout currentHref="/" className="max-w-7xl mx-auto">
      <h1 className="text-4xl font-medium tracking-tight lg:text-5xl font-heading">Budavári Schönherz Stúdió</h1>
      <Charts />
    </MainLayout>
  )
}
