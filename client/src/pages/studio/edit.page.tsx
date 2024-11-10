import { Dropzone } from "@/components/composite/dropzone"
import { AllowsEditor } from "@/components/composite/video-editor/allows-editor"
import { AvailabilityEditor } from "@/components/composite/video-editor/availability-editor"
import { CrewEditor } from "@/components/composite/video-editor/crew-editor"
import { DetailsEditor } from "@/components/composite/video-editor/details-editor"
import { LoadingSpinner } from "@/components/loading-spinner"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form } from "@/components/ui/form"
import { Progress } from "@/components/ui/progress"
import { MainLayout } from "@/layouts/main.layout"
import { myAxios } from "@/lib/axios"
import { VodDto } from "@/lib/dto"
import { translateField } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQuery } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { TriangleAlert, Upload, Video } from "lucide-react"
import { useEffect, useState } from "react"
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
  const [files, setFiles] = useState<File[]>([])
  const [uploadError, setUploadError] = useState<string | undefined>(undefined)

  const {
    data: vod,
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["vod", id],
    queryFn: async () => {
      const response = await myAxios.get<VodDto>(`/videos/${id}`)
      console.log("vod", response.data)
      return response.data
    },
  })

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  })

  useEffect(() => {
    if (vod) {
      form.reset(vod)
    }
  }, [vod, form.reset])

  const editMutation = useMutation({
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

  const uploadMutation = useMutation({
    mutationFn: async (dto: { file: File }) => {
      setUploadError(undefined)
      try {
        const formData = new FormData()
        formData.append("file", dto.file)
        await myAxios.post(`/videos/${vod?.id}/upload`, formData)
      } catch (e) {
        console.error(e)
        setUploadError((e as AxiosError)?.message || "Error communicating with server")
      }
    },
    onSuccess: async (data /*, variables, context*/) => {
      console.log("upload success", data)
      await refetch()
    },
  })

  function onSubmit(values: z.infer<typeof schema>) {
    editMutation.mutate(values)
  }

  function onClickUpload() {
    uploadMutation.mutate({ file: files[0] })
  }

  function onClickDelete() {
    console.log("deleting")
  }

  return (
    <MainLayout currentHref="/studio" navGroup="studio" className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      {isLoading && (
        <div>
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && vod && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mx-auto grid max-w-6xl flex-1 auto-rows-max gap-4 mb-10">
            <div className="flex items-center gap-4">
              <h1 className="flex-1 flex gap-2 items-center shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                <Video className="h-5 w-5" />
                <div className="">{vod?.title}</div>
              </h1>
              <Badge variant="outline" className="ml-auto sm:ml-0">
                {vod?.availability && translateField("availability", vod?.availability)}
              </Badge>
              <div className="hidden items-center gap-2 md:ml-auto md:flex">
                <Button size="sm" type="submit" disabled={files.length > 0}>
                  {files.length > 0 ? "Fejezd be a feltöltést!" : "Változtatások mentése"}
                </Button>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
              <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
                <DetailsEditor />
                <AvailabilityEditor vodState={vod.state} />
                <CrewEditor />
                <AllowsEditor />
              </div>
              <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
                {vod.state === "UNPROCESSED" && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Videó feltöltése</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Dropzone onChange={setFiles} className="w-full" />
                      {files?.length > 0 && !uploadMutation.isPending && (
                        <Button size="sm" className="w-full mt-4" onClick={onClickUpload}>
                          Feltöltés indítása
                        </Button>
                      )}
                      {uploadMutation.isPending && (
                        <Button size="sm" variant="outline" className="w-full mt-4" disabled>
                          <LoadingSpinner className="h-4 w-4 inline-block" />
                        </Button>
                      )}
                      {uploadError && (
                        <Alert variant="destructive" className="mt-4">
                          <TriangleAlert className="h-4 w-4" />
                          <AlertTitle>Feltöltési hiba</AlertTitle>
                          <AlertDescription>{uploadError}</AlertDescription>
                        </Alert>
                      )}
                    </CardContent>
                  </Card>
                )}
                {vod.state === "UPLOADED" && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Sikeres feltöltés</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center text-muted-foreground text-sm">
                      <LoadingSpinner className="inline-block mr-2 mb-0.5" />
                      Várakozás kapacitásra
                    </CardContent>
                  </Card>
                )}
                {vod.state === "PROCESSING" && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Feldolgozás folyamatban</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Progress value={33} className="w-full" />
                    </CardContent>
                  </Card>
                )}
                {vod.state === "FAILED" && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Sikertelen feldolgozás</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Alert variant="destructive">
                        <TriangleAlert className="h-4 w-4" />
                        <AlertTitle>Konvertálási hiba</AlertTitle>
                        <AlertDescription>Keresd fel az üzemeltetőt a részletekért vagy kezdd újra a feltöltést.</AlertDescription>
                      </Alert>
                      <Dropzone onChange={setFiles} className="w-full mt-8" />
                    </CardContent>
                  </Card>
                )}
                {vod.state === "PROCESSED" && (
                  <>
                    <Card>
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
                    <Card className="overflow-hidden">
                      <CardHeader>
                        <CardTitle>Bélyegkép</CardTitle>
                        <CardDescription>Válassz egy generált képet, vagy töltsd fel egyet</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid gap-2">
                          <img alt="Product image" className="aspect-square w-full rounded-md object-cover" height="300" src={vod?.thumbnailUrl} width="300" />
                          <div className="grid grid-cols-3 gap-2">
                            <button>
                              <img
                                alt="Product image"
                                className="aspect-square w-full rounded-md object-cover"
                                height="84"
                                src="/placeholder-user.jpg"
                                width="84"
                              />
                            </button>
                            <button>
                              <img
                                alt="Product image"
                                className="aspect-square w-full rounded-md object-cover"
                                height="84"
                                src="/placeholder-user.jpg"
                                width="84"
                              />
                            </button>
                            <button className="flex aspect-square w-full items-center justify-center rounded-md border border-dashed">
                              <Upload className="h-4 w-4 text-muted-foreground" />
                              <span className="sr-only">Upload</span>
                            </button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </>
                )}
                <Card>
                  <CardHeader>
                    <CardTitle>VoD projekt törlése</CardTitle>
                    <CardDescription>A projekt és a videó véglegesen törlésre kerül</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="destructive">
                          Törlés örökre
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Biztosan törlöd a Video-on-Demand projektet?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Ez a művelet nem visszafordítható. Ezzel törlésre kerül a projekt és a hozzá tartozó videó is szervereinkről.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Mégse</AlertDialogCancel>
                          <AlertDialogAction onClick={onClickDelete}>Törlés megerősítése</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </CardContent>
                </Card>
              </div>
            </div>
            <div className="flex items-center justify-center gap-2 md:hidden">
              <Button size="sm" type="submit" disabled={files.length > 0}>
                {files.length > 0 ? "Fejezd be a feltöltést!" : "Változtatások mentése"}
              </Button>
            </div>
          </form>
        </Form>
      )}
    </MainLayout>
  )
}
