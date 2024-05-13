import { NextResponse } from 'next/server'
import prisma from '../../../../lib/prisma'
import { updateObjectAcls } from '../../../../services/s3.service'

export async function POST(
  req: Request,
  { params }: { params: { id: string } },
) {
  const data = await prisma.album.findUnique({
    where: { id: params.id },
    include: {
      photos: {
        select: {
          id: true,
          filename: true,
        },
      },
    },
  })

  if (!data) {
    return NextResponse.json({ message: 'Album not found' }, { status: 404 })
  }

  try {
    const s3Response = await updateObjectAcls(
      params.id,
      data.photos.map((p) => p.id + '.' + p.filename.split('.').pop()),
      data.public,
    )
    console.log('[S3 ACL UPDATE]', s3Response)
    return NextResponse.json(s3Response)
  } catch (error) {
    console.error('[S3 ERROR]', error)
    return NextResponse.json(
      { message: 'Error updating S3 ACL' },
      { status: 500 },
    )
  }
}
