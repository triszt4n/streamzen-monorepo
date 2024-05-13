'use client'

import { ExclamationTriangleIcon, TrashIcon } from '@heroicons/react/24/outline'
import {
  Avatar,
  Button,
  Card,
  CardFooter,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Snippet,
  Spinner,
} from '@nextui-org/react'
import { Album, Photo, User } from '@prisma/client'
import Image from 'next/image'
import { FC, useState } from 'react'
import revalidatePhotosAction from '../../actions/revalidatePhotos'
import { formatDate } from '../../utils/date-utils'
import { shortenStringWithEllipsis } from '../../utils/string-utils'

type Props = {
  photo: Photo & { author?: User; album?: Album; src?: string }
  isPublicAlbum?: boolean
  onClick?: () => void
  onError?: (error: string) => void
  showDelete?: boolean
}

export const PhotoCard: FC<Props> = ({
  photo,
  isPublicAlbum,
  onClick,
  onError,
  showDelete,
}) => {
  const [submitStatus, setSubmitStatus] = useState<
    'idle' | 'loading' | 'error' | 'success'
  >('idle')
  const [isOpen, setIsOpen] = useState(false)

  const onCopy = () => {
    navigator.clipboard.writeText(photo.src ?? '')
  }
  const onDelete = async () => {
    setIsOpen(false)
    setSubmitStatus('loading')

    try {
      const response = await fetch(`/api/photos/${photo.id}`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        throw new Error('Failed to delete photo')
      }
      setSubmitStatus('idle')
      await revalidatePhotosAction()
    } catch (error) {
      onError?.((error as any)?.message)
      setSubmitStatus('error')
      setTimeout(() => {
        setSubmitStatus('idle')
      }, 3000)
    }
  }

  return (
    <>
      <Card
        isFooterBlurred
        radius="lg"
        className="border-none w-full max-h-72 bg-foreground/10 justify-center"
      >
        <Image
          alt={photo.filename}
          className="object-contain cursor-pointer"
          height={450}
          width={800}
          src={photo.src ?? ''}
          onClick={onClick}
        />
        <CardFooter className="before:bg-white/10 font border-white/20 border-1 overflow-hidden p-1 absolute before:rounded-xl rounded-large bottom-0.5 w-[calc(100%_-_2px)] ml-[1px] shadow-small z-10 gap-0.5">
          <Snippet
            classNames={{
              base: 'flex-1',
              pre: 'brake-all text-sm font-sans',
            }}
            size={isPublicAlbum ? 'sm' : 'md'}
            onCopy={onCopy}
            symbol=""
            tooltipProps={{
              content: 'Copy URL to clipboard',
            }}
            variant="solid"
            hideCopyButton={!isPublicAlbum}
          >
            {shortenStringWithEllipsis(photo.filename, 30)}
          </Snippet>
          {showDelete && (
            <div>
              <Popover
                placement="top"
                showArrow
                offset={10}
                isOpen={isOpen}
                onOpenChange={(open) => setIsOpen(open)}
              >
                <PopoverTrigger>
                  <Button isIconOnly size="sm" color="danger">
                    {submitStatus === 'loading' ? (
                      <Spinner size="sm" />
                    ) : submitStatus === 'error' ? (
                      <ExclamationTriangleIcon className="h-4 w-4" />
                    ) : (
                      <TrashIcon className="h-4 w-4" />
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <div className="px-1 py-2 w-full">
                    <p className="text-small font-bold text-foreground">
                      Delete this photo?
                    </p>
                    <div className="mt-2 flex flex-col gap-2 w-full">
                      <Button size="sm" color="danger" onClick={onDelete}>
                        Confirm
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          )}
        </CardFooter>
        <CardFooter className="before:bg-white/10 border-white/20 border-1 overflow-hidden p-1 absolute before:rounded-xl rounded-large top-0.5 w-[calc(100%_-_2px)] ml-[1px] shadow-small z-10 gap-0.5">
          <div className="flex flex-1 gap-2 items-center">
            <div
              className="flex-1 text-white text-xs text-end"
              style={{
                textShadow:
                  'rgb(0, 0, 0) 1px 1px 1px, rgb(0, 0, 0) 2px 2px 4px',
              }}
            >
              <p>
                uploaded by <b>{photo.author?.name}</b>
              </p>
              <p>on {formatDate(photo.createdAt as unknown as string)}</p>
            </div>
            <Avatar
              alt={photo.author?.name || 'Unknown'}
              className="flex-shrink-0"
              size="sm"
              src={photo.author?.image || undefined}
              imgProps={{ referrerPolicy: 'no-referrer' }}
            />
          </div>
        </CardFooter>
      </Card>
    </>
  )
}
