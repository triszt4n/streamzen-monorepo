import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { MainLayout } from "@/layouts/main.layout"
import { myAxios } from "@/lib/axios"
import { VodDto } from "@/lib/dto"
import { translateField } from "@/lib/utils"
import { useQuery } from "@tanstack/react-query"
import { PlusCircle, Table, Upload, Video } from "lucide-react"
import { useParams } from "react-router-dom"

export default function EditVideoPage() {
  const { id } = useParams()

  const { data: vod } = useQuery({
    queryKey: ["vod", id],
    queryFn: async () => {
      const response = await myAxios.get<VodDto>(`/videos/${id}`)
      return response.data
    },
  })

  return (
    <MainLayout
      currentHref={`/studio`}
      breadcrumbs={[
        { label: "Studio", href: `/studio` },
        { label: "Edit VoD Project", href: `/studio/edit/${id}` },
      ]}
      className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8"
    >
      <div className="mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4">
        <div className="flex items-center gap-4">
          <h1 className="flex-1 flex gap-2 items-center shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
            <Video className="h-5 w-5" />
            <div className="">{vod?.title}</div>
          </h1>
          <Badge variant="outline" className="ml-auto sm:ml-0">
            {vod?.availability && translateField("availability", vod?.availability)}
          </Badge>
          <div className="hidden items-center gap-2 md:ml-auto md:flex">
            <Button variant="outline" size="sm">
              Discard
            </Button>
            <Button size="sm">Save Changes</Button>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
          <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
            <Card x-chunk="dashboard-07-chunk-0">
              <CardHeader>
                <CardTitle>Project Details</CardTitle>
                <CardDescription>Basic information about the Video-on-Demand</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  <div className="grid gap-3">
                    <Label htmlFor="name">Title</Label>
                    <Input id="name" type="text" className="w-full" defaultValue="Gamer Gear Pro Controller" />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" className="min-h-32" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card x-chunk="dashboard-07-chunk-1">
              <CardHeader>
                <CardTitle>Stock</CardTitle>
                <CardDescription>Lipsum dolor sit amet, consectetur adipiscing elit</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">SKU</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead className="w-[100px]">Size</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-semibold">GGPC-001</TableCell>
                      <TableCell>
                        <Label htmlFor="stock-1" className="sr-only">
                          Stock
                        </Label>
                        <Input id="stock-1" type="number" defaultValue="100" />
                      </TableCell>
                      <TableCell>
                        <Label htmlFor="price-1" className="sr-only">
                          Price
                        </Label>
                        <Input id="price-1" type="number" defaultValue="99.99" />
                      </TableCell>
                      <TableCell>
                        <ToggleGroup type="single" defaultValue="s" variant="outline">
                          <ToggleGroupItem value="s">S</ToggleGroupItem>
                          <ToggleGroupItem value="m">M</ToggleGroupItem>
                          <ToggleGroupItem value="l">L</ToggleGroupItem>
                        </ToggleGroup>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-semibold">GGPC-002</TableCell>
                      <TableCell>
                        <Label htmlFor="stock-2" className="sr-only">
                          Stock
                        </Label>
                        <Input id="stock-2" type="number" defaultValue="143" />
                      </TableCell>
                      <TableCell>
                        <Label htmlFor="price-2" className="sr-only">
                          Price
                        </Label>
                        <Input id="price-2" type="number" defaultValue="99.99" />
                      </TableCell>
                      <TableCell>
                        <ToggleGroup type="single" defaultValue="m" variant="outline">
                          <ToggleGroupItem value="s">S</ToggleGroupItem>
                          <ToggleGroupItem value="m">M</ToggleGroupItem>
                          <ToggleGroupItem value="l">L</ToggleGroupItem>
                        </ToggleGroup>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-semibold">GGPC-003</TableCell>
                      <TableCell>
                        <Label htmlFor="stock-3" className="sr-only">
                          Stock
                        </Label>
                        <Input id="stock-3" type="number" defaultValue="32" />
                      </TableCell>
                      <TableCell>
                        <Label htmlFor="price-3" className="sr-only">
                          Stock
                        </Label>
                        <Input id="price-3" type="number" defaultValue="99.99" />
                      </TableCell>
                      <TableCell>
                        <ToggleGroup type="single" defaultValue="s" variant="outline">
                          <ToggleGroupItem value="s">S</ToggleGroupItem>
                          <ToggleGroupItem value="m">M</ToggleGroupItem>
                          <ToggleGroupItem value="l">L</ToggleGroupItem>
                        </ToggleGroup>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter className="justify-center border-t p-4">
                <Button size="sm" variant="ghost" className="gap-1">
                  <PlusCircle className="h-3.5 w-3.5" />
                  Add Variant
                </Button>
              </CardFooter>
            </Card>
            <Card x-chunk="dashboard-07-chunk-2">
              <CardHeader>
                <CardTitle>Product Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 sm:grid-cols-3">
                  <div className="grid gap-3">
                    <Label htmlFor="category">Category</Label>
                    <Select>
                      <SelectTrigger id="category" aria-label="Select category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="clothing">Clothing</SelectItem>
                        <SelectItem value="electronics">Electronics</SelectItem>
                        <SelectItem value="accessories">Accessories</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="subcategory">Subcategory (optional)</Label>
                    <Select>
                      <SelectTrigger id="subcategory" aria-label="Select subcategory">
                        <SelectValue placeholder="Select subcategory" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="t-shirts">T-Shirts</SelectItem>
                        <SelectItem value="hoodies">Hoodies</SelectItem>
                        <SelectItem value="sweatshirts">Sweatshirts</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
            <Card x-chunk="dashboard-07-chunk-3">
              <CardHeader>
                <CardTitle>Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {["Video length", "Views", "HLS process time", "HLS chunk number"].map((stat) => (
                    <div className="grid grid-cols-[25px_1fr] items-start">
                      <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">{stat}</p>
                        <p className="text-sm text-muted-foreground">25 001 231</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card className="overflow-hidden" x-chunk="dashboard-07-chunk-4">
              <CardHeader>
                <CardTitle>Thumbnail</CardTitle>
                <CardDescription>Choose a generated or upload a custom thumbnail</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2">
                  <img alt="Product image" className="aspect-square w-full rounded-md object-cover" height="300" src="/placeholder.svg" width="300" />
                  <div className="grid grid-cols-3 gap-2">
                    <button>
                      <img alt="Product image" className="aspect-square w-full rounded-md object-cover" height="84" src="/placeholder.svg" width="84" />
                    </button>
                    <button>
                      <img alt="Product image" className="aspect-square w-full rounded-md object-cover" height="84" src="/placeholder.svg" width="84" />
                    </button>
                    <button className="flex aspect-square w-full items-center justify-center rounded-md border border-dashed">
                      <Upload className="h-4 w-4 text-muted-foreground" />
                      <span className="sr-only">Upload</span>
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card x-chunk="dashboard-07-chunk-5">
              <CardHeader>
                <CardTitle>Delete VoD Project</CardTitle>
                <CardDescription>The project and the video will be permanently deleted</CardDescription>
              </CardHeader>
              <CardContent>
                <div></div>
                <Button size="sm" variant="destructive">
                  Delete forever
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
        <div className="flex items-center justify-center gap-2 md:hidden">
          <Button variant="outline" size="sm">
            Discard
          </Button>
          <Button size="sm">Save Changes</Button>
        </div>
      </div>
    </MainLayout>
  )
}
