import { Photo } from '@prisma/client'
import { Session, getServerSession } from 'next-auth'
import { authOptions } from '../lib/authOptions'
import prisma from '../lib/prisma'
import { getSignedFileUrl } from './s3.service'

export async function getAlbumsUser() {
  let session: Session | null = null
  try {
    session = await getServerSession(authOptions)
    console.log('SESSION', session)
  } catch (error) {
    console.error('SESSION ERROR', error)
  }

  if (!session?.user?.id) {
    return {
      error: { message: 'Unauthorized, no session provided.' },
      status: 401,
    }
  }

  try {
    const data = await prisma.albumUser.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        album: {
          include: {
            users: {
              include: {
                user: true,
              },
            },
            photos: {
              take: 1,
              orderBy: {
                createdAt: 'asc',
              },
            },
            _count: {
              select: { photos: true },
            },
          },
        },
      },
    })

    const mappedData = await Promise.all(
      data.map(async (au) => {
        if (!au.album.public) {
          const firstPhoto: Photo | undefined = au.album.photos[0]

          if (firstPhoto) {
            const signedUrl = await getSignedFileUrl(
              `${firstPhoto.albumId}/${firstPhoto.id}.${firstPhoto.filename.split('.').pop()}`,
              process.env.S3_BUCKET_NAME ?? '',
            )
            au.album.photos[0].src = signedUrl
          }
        }
        return au.album
      }),
    )

    return mappedData
  } catch (error) {
    console.error(error)
    return {
      error: { message: 'Error fetching data' },
      status: 500,
    }
  }
}

export async function getAlbumsPublic(sortBy: string = 'createdAt_desc') {
  const [sortField, sortDirection] = sortBy?.split('_') ?? ['createdAt', 'desc']

  const data = await prisma.album.findMany({
    where: {
      public: true,
    },
    include: {
      users: {
        include: {
          user: true,
        },
      },
      photos: {
        take: 1,
        orderBy: {
          createdAt: 'asc',
        },
      },
      _count: {
        select: { photos: true },
      },
    },
    orderBy: {
      [sortField]: sortDirection,
    },
  })

  return data
}

export async function getAlbum(id: string) {
  const data = await prisma.album.findUnique({
    where: { id },
    include: {
      users: {
        include: {
          user: true,
        },
      },
      _count: {
        select: { photos: true },
      },
    },
  })

  return data ?? { error: { message: 'Album not found' }, status: 404 }
}

export async function getAlbumPhotos(id: string) {
  const data = await prisma.photo.findMany({
    where: {
      albumId: id,
    },
    include: {
      author: true,
      album: true,
    },
  })

  const mappedData = await Promise.all(
    data.map(async (photo) => {
      if (!photo.album?.public) {
        const signedUrl = await getSignedFileUrl(
          `${photo.albumId}/${photo.id}.${photo.filename.split('.').pop()}`,
          process.env.S3_BUCKET_NAME ?? '',
        )
        photo.src = signedUrl
      }
      return photo
    }),
  )
  return mappedData
}
