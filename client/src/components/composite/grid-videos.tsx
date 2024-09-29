import { SkipForward } from "lucide-react"
import { Link } from "react-router-dom"

interface GridVideosProps {
  videos: {
    id: string
    title: string
    description: string
    thumbnail: string
  }[]
}

const videosConst = [
  {
    id: "1",
    title: "Clothing",
    description: "Discover the latest fashion trends.",
    thumbnail: "/placeholder-user.jpg",
  },
  {
    id: "2",
    title: "Electronics",
    description: "Upgrade your tech with our latest gadgets.",
    thumbnail: "/placeholder-user.jpg",
  },
  {
    id: "3",
    title: "Home & Garden",
    description: "Transform your living space with our home decor.",
    thumbnail: "/placeholder-user.jpg",
  },
  {
    id: "4",
    title: "Beauty & Personal Care",
    description: "Pamper yourself with our premium beauty products.",
    thumbnail: "/placeholder-user.jpg",
  },
  {
    id: "5",
    title: "Sports & Outdoors",
    description: "Gear up for your next adventure.",
    thumbnail: "/placeholder-user.jpg",
  },
  {
    id: "6",
    title: "Toys & Games",
    description: "Discover the latest toys and games.",
    thumbnail: "/placeholder-user.jpg",
  },
]

export const GridVideos: React.FC<GridVideosProps> = ({ videos = videosConst }) => {
  return (
    <section className="w-full py-12 md:py-16 lg:py-20">
      <div className="grid gap-6 md:gap-8 px-4 md:px-6 max-w-6xl mx-auto">
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          {videos.map((video) => (
            <div className="relative group overflow-hidden shadow-lg bg-background dark:bg-black/80">
              <Link to={`/videos/${video.id}`} className="absolute inset-0 z-10">
                <span className="sr-only">View</span>
              </Link>
              <img
                src={video.thumbnail}
                alt={video.title}
                width={450}
                height={300}
                className="object-cover w-full aspect-[16/9] group-hover:opacity-50 transition-opacity"
              />
              <div className="p-4">
                <h3 className="font-bold tracking-tight text-base">
                  <SkipForward className="h-5 w-5 inline-block mb-0.5 mr-1" />
                  {video.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
