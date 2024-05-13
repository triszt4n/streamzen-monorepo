import { NextResponse } from 'next/server'
import prisma from '../../../lib/prisma'
import { deleteFile } from '../../../services/s3.service'

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } },
) {
  const photo = await prisma.photo.delete({
    where: {
      id: params.id,
    },
  })

  const s3Response = await deleteFile(
    photo.albumId!,
    photo.id,
    photo.filename.split('.').pop() ?? '',
  )

  return NextResponse.json({ photo, s3Response })
}
