import { File, ListFilter, MoreHorizontal } from "lucide-react"

import { AddVideoSheet } from "@/components/composite/add-video-sheet"
import { LoadingSpinner } from "@/components/loading-spinner"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MainLayout } from "@/layouts/main.layout"
import { myAxios } from "@/lib/axios"
import { VodDto } from "@/lib/dto"
import { badgeVariantForField, formatDateTime, translateField } from "@/lib/utils"
import { useQuery } from "@tanstack/react-query"
import { Link } from "react-router-dom"

export default function StudioPage() {
  const {
    data: vods,
    isError,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["vods"],
    queryFn: async () => {
      const response = await myAxios.get<VodDto[]>("/videos")
      return response.data
    },
  })

  return (
    <MainLayout
      currentHref="/studio"
      breadcrumbs={[{ href: "/studio", label: "Studio" }]}
      className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8"
    >
      <Tabs defaultValue="all">
        <div className="flex items-center">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="draft">Draft</TabsTrigger>
            <TabsTrigger value="active">Published</TabsTrigger>
            <TabsTrigger value="active">Unlisted</TabsTrigger>
          </TabsList>
          <div className="ml-auto flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-7 gap-1">
                  <ListFilter className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Filter</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filter by Processing</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem>Streamable</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>Processing</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>Failed</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>Never started</DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button size="sm" variant="outline" className="h-7 gap-1">
              <File className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Export</span>
            </Button>
            <AddVideoSheet refetchFunction={refetch} />
          </div>
        </div>
        <TabsContent value="all">
          <Card x-chunk="dashboard-06-chunk-0">
            <CardHeader>
              <CardTitle>Video-on-Demand Projects</CardTitle>
              <CardDescription>Manage your VoD Projects and view their status and performance</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="hidden w-[100px] sm:table-cell">
                      <span className="sr-only">Thumbnail</span>
                    </TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Process state</TableHead>
                    <TableHead>Availability</TableHead>
                    <TableHead className="hidden md:table-cell">Total views</TableHead>
                    <TableHead className="hidden md:table-cell">Created at</TableHead>
                    <TableHead>
                      <span className="sr-only">Actions</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading && (
                    <TableRow>
                      <TableCell colSpan={7}>
                        <div>
                          <LoadingSpinner />
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                  {isError && (
                    <TableRow>
                      <TableCell colSpan={7}>
                        <div className="text-center">Failed to load data</div>
                      </TableCell>
                    </TableRow>
                  )}
                  {vods?.map((vod) => (
                    <TableRow key={vod.id}>
                      <TableCell className="hidden sm:table-cell">
                        <img
                          alt="Product img"
                          className="aspect-square rounded-md object-cover"
                          height="64"
                          src={vod.thumbnailUrl ?? "/placeholder-vod.png"}
                          onError={(e) => {
                            e.currentTarget.src = "/placeholder-vod.png"
                          }}
                          width="54"
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        <Link to={`/studio/edit/${vod.id}`}>{vod.title}</Link>
                      </TableCell>
                      <TableCell>
                        <Badge variant={badgeVariantForField("state", vod.state)}>{translateField("state", vod.state)}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={badgeVariantForField("availability", vod.availability)}>{translateField("availability", vod.availability)}</Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">25 000</TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div>{formatDateTime(vod.createdAt)}</div>
                        <div className="text-xs text-muted-foreground">
                          by{" "}
                          <Link to={`/users/${vod.author.id}`} className="hover:underline">
                            {vod.author.fullName}
                          </Link>
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button aria-haspopup="true" size="icon" variant="ghost">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Toggle menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>
                              <Link to={`/studio/edit/${vod.id}`}>Edit</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter>
              <div className="text-xs text-muted-foreground">
                Showing <strong>1-10</strong> of <strong>{vods?.length ?? (isLoading ? "Loading..." : 0)}</strong> products
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </MainLayout>
  )
}
