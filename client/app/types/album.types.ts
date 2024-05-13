import { Album, AlbumUser, User } from '@prisma/client'
import { PhotoWithSrc } from './photo.types'

export type NewAlbumInputs = Pick<Album, 'name' | 'public' | 'description'>

export type AlbumWithUsers = Album & {
  users: Array<AlbumUser & { user?: User }>
}

export type AlbumFull = AlbumWithUsers & {
  photos: PhotoWithSrc[]
  _count: { photos: number }
}
