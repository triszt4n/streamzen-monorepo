import { Divider } from '@nextui-org/react'
import { Role } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { headers } from 'next/headers'
import Container from '../../components/Container'
import AlbumUserList from '../../components/album-components/AlbumUserList'
import NewMemberForm from '../../components/forms/NewMemberForm'
import RefreshButton from '../../components/forms/RefreshButton'
import { UploadField } from '../../components/forms/UploadField'
import PhotosGrid from '../../components/photo-components/PhotosGrid'
import { authOptions } from '../../lib/authOptions'
import { getAlbum, getAlbumPhotos } from '../../services/albums.services'
import { getUsers } from '../../services/users.services'
import { AlbumWithUsers } from '../../types/album.types'
import { PhotoFull } from '../../types/photo.types'
import { formatDate } from '../../utils/date-utils'

export default async function AlbumPage({
  params,
}: {
  params: { id: string }
}) {
  const data = await getAlbum(params.id)
  const photos = (await getAlbumPhotos(params.id)) as PhotoFull[]
  const users = await getUsers()
  const session = await getServerSession(authOptions)
  const amIMember = (data: AlbumWithUsers) =>
    data.users.some((user) => user.userId === session?.user?.id)
  const amIAdmin = (data: AlbumWithUsers) =>
    data.users.some(
      (user) => user.userId === session?.user?.id && user.role === Role.ADMIN,
    )
  const headersPushed = (() => {
    const h = Object.fromEntries(headers().entries())
    delete h['content-type']
    delete h['Content-type']
    return h
  })()

  return (
    <Container className="py-12">
      {'error' in data ? (
        <div>
          <h3 className="mb-4 text-2xl font-semibold">
            An error occured while fetching your data
          </h3>
          <p>{data.error.message}</p>
        </div>
      ) : (
        <div className="flex flex-col gap-16">
          <div className="flex flex-col md:flex-row gap-8 justify-between">
            <div className="w-full">
              <h2 className="py-4 text-3xl font-extrabold leading-none tracking-tight">
                Album: {data.name}
              </h2>
              <p className="text-sm text-gray-500 mb-4">{data.description}</p>
              <p className="text-sm text-gray-500 text-end">
                Created at: {formatDate(data.createdAt as unknown as string)}
              </p>
              <p className="text-sm text-gray-500 text-end">
                #photos: {data._count.photos || 'no photos yet'}
              </p>
              <Divider className="my-2" />
              {amIMember(data) && (
                <div className="text-sm text-gray-500">
                  <p className="mb-1">Upload new photos here:</p>
                  <UploadField
                    multiple
                    maxFiles={10}
                    required
                    uploadPath={`${process.env.NEXTAUTH_URL}/api/albums/${params.id}/upload`}
                    headers={headersPushed}
                  />
                </div>
              )}
            </div>
            <div className="flex flex-col min-w-96 gap-4">
              <AlbumUserList users={data.users} />
              {amIAdmin(data) && (
                <NewMemberForm
                  users={users.filter(
                    (user) =>
                      !data.users.map((u) => u.userId).includes(user.id),
                  )}
                  albumId={params.id}
                />
              )}
            </div>
          </div>
          <div className="flex flex-row justify-end">
            <RefreshButton albumId={params.id} headers={headers()} />
          </div>
          <PhotosGrid
            photos={photos}
            isPublicAlbum={data.public}
            showDelete={amIAdmin(data)}
          />
        </div>
      )}
    </Container>
  )
}
