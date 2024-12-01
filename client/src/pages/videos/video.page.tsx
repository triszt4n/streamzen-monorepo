import { VideoPlayer } from "@/components/composite/video-player"
import { LoadingSpinner } from "@/components/loading-spinner"
import { MainLayout } from "@/layouts/main.layout"
import { myAxios } from "@/lib/axios"
import { VodDto } from "@/lib/dto"
import { useQuery } from "@tanstack/react-query"
import { useParams } from "react-router-dom"

export const VideoPage = () => {
  const { id } = useParams()

  const { data: vod, isLoading } = useQuery({
    queryKey: ["vod", id],
    queryFn: async () => {
      const response = await myAxios.get<VodDto>(`/videos/${id}`)
      console.log("vod", response.data)
      return response.data
    },
  })

  return (
    <MainLayout currentHref="/videos" className="max-w-6xl mx-auto">
      {isLoading && (
        <div>
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && vod && (
        <div className="w-full flex justify-center">
          <VideoPlayer src={`/media-assets/${vod.id}/${vod.uploadedFilename}.m3u8`} />
        </div>
      )}
    </MainLayout>
  )
}
