import { VideoPlayer } from "@/components/composite/video-player"
import { MainLayout } from "@/layouts/main.layout"

export const LivePage = () => {
  return (
    <MainLayout currentHref="/live" className="max-w-6xl mx-auto">
      <div className="w-full flex justify-center">
        <VideoPlayer src={`${import.meta.env.LIVE_PATH}`} />
      </div>
    </MainLayout>
  )
}
