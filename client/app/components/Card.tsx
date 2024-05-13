import { MapPinIcon } from '@heroicons/react/24/outline'
import { Badge, Chip } from '@nextui-org/react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function Card() {
  const router = useRouter()

  return (
    <div className="w-full">
      <header>
        <Badge
          content="valami"
          color="secondary"
          placement="bottom-right"
          classNames={{
            base: 'aspect-[21/9] w-full',
            badge: 'text-xs px-1.5 py-0.5',
          }}
        >
          <Image
            alt={`Image`}
            className={`z-0 w-full h-full object-contain rounded-lg cursor-pointer`}
            src=""
            height={540}
            width={1280}
            onClick={() => {}}
          />
        </Badge>
        <h4 className="text-3xl font-extrabold tracking-tight my-2">
          <Link href={`/project/`}>linky</Link>
        </h4>
      </header>
      <footer>
        <p className="mb-2">short desc</p>
        <div className="flex items-center gap-2 mt-2">
          {[].map((techStack, index) => (
            <Chip key={`${techStack}-${index}`} size="sm">
              {techStack}
            </Chip>
          ))}
        </div>
        {[].map((p) => (
          <div
            key={p}
            className="flex items-center gap-2 mt-2 text-foreground text-opacity-70 hover:text-opacity-100"
          >
            <MapPinIcon className="w-4 h-4" />
            <a
              className="hover:underline"
              href={`https://github.com/${p}`}
              rel="noopener noreferrer"
              target="_blank"
            >
              {p}
            </a>
          </div>
        ))}
      </footer>
    </div>
  )
}
