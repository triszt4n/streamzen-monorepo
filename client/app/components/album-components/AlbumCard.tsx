'use client'

import { Chip, User as UserComponent } from '@nextui-org/react'
import { Album, User } from '@prisma/client'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { DetailedHTMLProps, FC, HTMLAttributes } from 'react'
import { PhotoWithSrc } from '../../types/photo.types'
import { formatDateWithTime } from '../../utils/date-utils'

interface Props {
  album: Album & { author?: User; _count: { photos: number } }
  firstPhoto?: PhotoWithSrc
  showPublicChip?: boolean
}

const AlbumCard: FC<
  DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> & Props
> = ({ album, firstPhoto, showPublicChip, ...props }) => {
  const router = useRouter()

  return (
    <article
      {...props}
      className={'w-full border-1 p-4 rounded-xl '.concat(
        props.className ?? '',
      )}
    >
      <header>
        <div className="h-32 xl:h-48">
          <Image
            alt={firstPhoto?.filename ?? 'Album cover'}
            className="z-0 w-full h-full object-cover rounded-lg"
            src={firstPhoto?.src ?? '/images/album-placeholder.png'}
            height={450}
            width={800}
            onClick={() => router.push(`/albums/${album.id}`)}
          />
        </div>
        <div className="text-tiny text-foreground-500 text-end flex flex-row flex-wrap justify-between mt-2">
          <div>{album._count.photos} photos</div>
          <div>{formatDateWithTime(album.createdAt as unknown as string)}</div>
        </div>
        <h4 className="text-3xl font-extrabold tracking-tight mb-2 mt-6">
          <Link href={`/albums/${album.id}`}>{album.name}</Link>
        </h4>
      </header>
      <footer className="flex justify-between items-center flex-wrap gap-y-2">
        <UserComponent
          name={album.author?.name}
          description="Owner"
          avatarProps={{
            src: album.author?.image ?? undefined,
            size: 'sm',
            showFallback: true,
          }}
        />
        {showPublicChip && (
          <Chip color={album.public ? 'success' : 'danger'}>
            {album.public ? 'Public' : 'Private'}
          </Chip>
        )}
      </footer>
    </article>
  )
}

export default AlbumCard
