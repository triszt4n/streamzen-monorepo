import { UserCombobox } from "@/components/composite/user-combobox"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { MainLayout } from "@/layouts/main.layout"
import { myAxios } from "@/lib/axios"
import { VodDto } from "@/lib/dto"
import { translateField } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQuery } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { PlusCircle, Upload, Video } from "lucide-react"
import { useForm } from "react-hook-form"
import { useParams } from "react-router-dom"
import { z } from "zod"

const schema = z.object({
  title: z.string().min(3, {
    message: "A cím legalább 3 karakter hosszú",
  }),
  descMarkdown: z.string().max(1000, {
    message: "A leírás legfeljebb 1000 karakter hosszú",
  }),
  availability: z.string(),
  crew: z.array(
    z.object({
      role: z.string(),
      userId: z.string(),
      priority: z.number(),
    })
  ),
  allowDownloads: z.boolean(),
  allowShare: z.boolean(),
})

export const EditVideoPage = () => {
  const { id } = useParams()

  const { data: vod, refetch } = useQuery({
    queryKey: ["vod", id],
    queryFn: async () => {
      const response = await myAxios.get<VodDto>(`/videos/${id}`)
      console.log("vod", response.data)
      return response.data
    },
  })

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: vod,
  })

  const mutation = useMutation({
    mutationFn: async (dto: z.infer<typeof schema>) => {
      try {
        await myAxios.patch(`/videos/${vod?.id}`, dto)
        await refetch()
      } catch (e) {
        console.error(e)
        form.setError("title", {
          message: (e as AxiosError)?.message || "Error communicating with server",
        })
      }
    },
  })

  function onSubmit(values: z.infer<typeof schema>) {
    mutation.mutate(values)
  }

  return (
    <MainLayout currentHref="/studio" navGroup="studio" className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mx-auto grid max-w-6xl flex-1 auto-rows-max gap-4">
          <div className="flex items-center gap-4">
            <h1 className="flex-1 flex gap-2 items-center shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
              <Video className="h-5 w-5" />
              <div className="">{vod?.title}</div>
            </h1>
            <Badge variant="outline" className="ml-auto sm:ml-0">
              {vod?.availability && translateField("availability", vod?.availability)}
            </Badge>
            <div className="hidden items-center gap-2 md:ml-auto md:flex">
              <Button size="sm" type="submit">
                Változtatások mentése
              </Button>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
            <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Projekt részletei</CardTitle>
                  <CardDescription>Alapvető információ a VoD projektről</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6">
                    <div className="grid gap-3">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Cím</FormLabel>
                            <FormControl>
                              <Input {...field} className="w-full" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid gap-3">
                      <FormField
                        control={form.control}
                        name="descMarkdown"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Leírás</FormLabel>
                            <FormControl>
                              <Textarea {...field} className="min-h-32" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Láthatóság vendégek számára</CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="availability"
                    render={({ field }) => (
                      <FormItem className="grid gap-3 grid-cols-2 items-center">
                        <FormLabel>Videó elérhetősége a weboldalon</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger id="availability" aria-label="Elérhetőség">
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="DRAFT">Draft</SelectItem>
                            <SelectItem value="UNLISTED">Unlisted</SelectItem>
                            <SelectItem value="PUBLISHED">Published</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Stáb</CardTitle>
                  <CardDescription>Kezeld a videó megvalósulásában segédkező stábtagokat</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Szerep</TableHead>
                        <TableHead>Név</TableHead>
                        <TableHead className="w-24">Prio</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-semibold">
                          <Input />
                        </TableCell>
                        <TableCell className="">
                          <UserCombobox />
                        </TableCell>
                        <TableCell className="">
                          <Input type="number" min="0" max="10000" step="50" defaultValue="100" />
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
                <CardFooter className="justify-center border-t p-4">
                  <Button size="sm" variant="ghost" className="gap-1">
                    <PlusCircle className="h-3.5 w-3.5" />
                    Stábtag hozzáadása
                  </Button>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Engedélyezések vendégek számára</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 grid-cols-1">
                    <div className="grid gap-3 grid-cols-2 items-center">
                      <Label htmlFor="allowDownloads">Letöltések (HD és normál minőségben)</Label>
                      <Select defaultValue="1">
                        <SelectTrigger id="allowDownloads" aria-label="Letöltések">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">Engedélyezve</SelectItem>
                          <SelectItem value="0">Tiltva</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-3 grid-cols-2 items-center">
                      <Label htmlFor="allowShare">Megosztás gomb</Label>
                      <Select defaultValue="1">
                        <SelectTrigger id="allowShare" aria-label="Megosztás gomb">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">Engedélyezve</SelectItem>
                          <SelectItem value="0">Tiltva</SelectItem>
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
                  <CardTitle>Statisztika</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {["Video length", "Views", "HLS process time", "HLS chunk number"].map((stat) => (
                      <div key={stat} className="grid grid-cols-[25px_1fr] items-start">
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
                  <CardTitle>Bélyegkép</CardTitle>
                  <CardDescription>Válassz egy generált képet, vagy töltsd fel egyet</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-2">
                    <img alt="Product image" className="aspect-square w-full rounded-md object-cover" height="300" src={vod?.thumbnailUrl} width="300" />
                    <div className="grid grid-cols-3 gap-2">
                      <button>
                        <img alt="Product image" className="aspect-square w-full rounded-md object-cover" height="84" src="/placeholder-user.jpg" width="84" />
                      </button>
                      <button>
                        <img alt="Product image" className="aspect-square w-full rounded-md object-cover" height="84" src="/placeholder-user.jpg" width="84" />
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
                  <CardTitle>VoD projekt törlése</CardTitle>
                  <CardDescription>A projekt és a videó véglegesen törlésre kerül</CardDescription>
                </CardHeader>
                <CardContent>
                  <div></div>
                  <Button size="sm" variant="destructive">
                    Törlés örökre
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 md:hidden">
            <Button size="sm" type="submit">
              Változtatások mentése
            </Button>
          </div>
        </form>
      </Form>
    </MainLayout>
  )
}
