import { Role } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import { authOptions } from '../../lib/authOptions'
import prisma from '../../lib/prisma'
import { getAlbumsPublic } from '../../services/albums.services'
import { NewAlbumInputs } from '../../types/album.types'

export async function GET(req: NextRequest) {
  const data = await getAlbumsPublic(
    req.nextUrl.searchParams.get('sortby') ?? 'createdAt_desc',
  )
  return NextResponse.json(data)
}

export async function POST(req: Request) {
  const body = (await req.json()) as NewAlbumInputs
  const session = await getServerSession(authOptions)

  if (!session?.user?.id)
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

  const albumUser = await prisma.albumUser.create({
    data: {
      album: {
        create: {
          ...body,
        },
      },
      user: {
        connect: {
          id: session?.user?.id,
        },
      },
      role: Role.ADMIN,
    },
    include: {
      album: true,
    },
  })

  return NextResponse.json(albumUser.album)
}
