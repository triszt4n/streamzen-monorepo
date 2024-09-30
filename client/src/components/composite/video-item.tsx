import { SkipForward } from "lucide-react"
import { Link } from "react-router-dom"

interface VideoItemProps {
  id: string
  title: string
  thumbnailUrl: string
}

export const VideoItem: React.FC<VideoItemProps> = ({ id, title, thumbnailUrl }) => {
  return (
    <div className="relative group overflow-hidden shadow-lg bg-background dark:bg-black/80">
      <Link to={`/videos/${id}`} className="absolute inset-0 z-10">
        <span className="sr-only">View</span>
      </Link>
      <img src={thumbnailUrl} alt={title} width={450} height={300} className="object-cover w-full aspect-[16/9] group-hover:opacity-50 transition-opacity" />
      <div className="p-4">
        <h3 className="font-bold tracking-tight text-base">
          <SkipForward className="h-5 w-5 inline-block mb-0.5 mr-1" />
          {title}
        </h3>
      </div>
    </div>
  )
}
