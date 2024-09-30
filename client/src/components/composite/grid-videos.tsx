import { VideoItem } from "./video-item"

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
            <VideoItem key={video.id} id={video.id} title={video.title} thumbnailUrl={video.thumbnail} />
          ))}
        </div>
      </div>
    </section>
  )
}
