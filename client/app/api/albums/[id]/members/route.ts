import { Role } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { authOptions } from '../../../../lib/authOptions'
import prisma from '../../../../lib/prisma'

export async function POST(
  req: Request,
  { params }: { params: { id: string } },
) {
  const body = (await req.json()) as { id: string }
  const session = await getServerSession(authOptions)

  if (!session?.user?.id)
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

  const requestingAlbumUser = await prisma.albumUser.findFirst({
    where: {
      userId: session.user.id,
      albumId: params.id,
    },
  })

  if (!requestingAlbumUser || requestingAlbumUser?.role === Role.USER)
    return NextResponse.json(
      { message: 'Forbidden: not admin of album!' },
      { status: 403 },
    )

  const data = await prisma.albumUser.create({
    data: {
      user: {
        connect: {
          id: body.id,
        },
      },
      album: {
        connect: {
          id: params.id,
        },
      },
      role: Role.USER,
    },
  })

  return NextResponse.json(data)
}
