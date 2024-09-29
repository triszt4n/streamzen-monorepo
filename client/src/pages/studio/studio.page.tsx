import { ListFilter } from "lucide-react"

import { AddVideoSheet } from "@/components/composite/add-video-sheet"
import { TabAllVods } from "@/components/composite/tab-all-vods"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MainLayout } from "@/layouts/main.layout"
import { useEffect } from "react"

export const StudioPage = () => {
  useEffect(() => {
    localStorage.setItem("visitedStudio", "true")
  }, [])

  return (
    <MainLayout currentHref="/studio" navGroup="studio">
      <div className="max-w-[100rem] mx-auto flex flex-col gap-8">
        <h1 className="text-4xl font-medium tracking-tight lg:text-5xl font-heading">Admin felület - Stúdió</h1>
        <Tabs defaultValue="all">
          <div className="flex items-center">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="draft">Draft</TabsTrigger>
              <TabsTrigger value="published">Published</TabsTrigger>
              <TabsTrigger value="unlisted">Unlisted</TabsTrigger>
            </TabsList>
            <div className="ml-auto flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-7 gap-1">
                    <ListFilter className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Szűrés</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Szűrés feldolgozottság szerint</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuCheckboxItem>Streamable</DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem>Processing</DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem>Failed</DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem>Never started</DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
              {/* <Button size="sm" variant="outline" className="h-7 gap-1">
                <File className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Exportálás</span>
              </Button> */}
              <AddVideoSheet />
            </div>
          </div>
          <TabsContent value="all">
            <TabAllVods />
          </TabsContent>
          <TabsContent value="draft">
            <TabAllVods />
          </TabsContent>
          <TabsContent value="published">
            <TabAllVods />
          </TabsContent>
          <TabsContent value="unlisted">
            <TabAllVods />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  )
}
