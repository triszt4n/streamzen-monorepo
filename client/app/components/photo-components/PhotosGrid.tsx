'use client'

import { FC, useState } from 'react'
import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'
import { PhotoFull } from '../../types/photo.types'
import ErrorModal from '../forms/ErrorModal'
import { PhotoCard } from './PhotoCard'

type Props = {
  photos: PhotoFull[]
  isPublicAlbum?: boolean
  showDelete?: boolean
}

const PhotosGrid: FC<Props> = ({ photos, isPublicAlbum, showDelete }) => {
  const [open, setOpen] = useState(false)
  const [index, setIndex] = useState(0)
  const [error, setError] = useState<string | undefined>(undefined)

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {photos.map((photo) => (
          <PhotoCard
            key={photo.id}
            photo={photo}
            onClick={() => {
              setOpen(true)
              setIndex(photos.indexOf(photo))
            }}
            onError={(error) => setError(error)}
            isPublicAlbum={isPublicAlbum}
            showDelete={showDelete}
          />
        ))}
      </div>
      <Lightbox
        open={open}
        index={index}
        close={() => setOpen(false)}
        slides={photos.map((photo) => ({ src: photo.src ?? '' }))}
      />
      <ErrorModal
        shouldOpen={!!error}
        message={error}
        onClose={() => setError(undefined)}
      />
    </>
  )
}

export default PhotosGrid
