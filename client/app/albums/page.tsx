import { PlusCircleIcon } from '@heroicons/react/24/outline'
import { Role } from '@prisma/client'
import ActionButton from '../components/ActionButton'
import Container from '../components/Container'
import AlbumCard from '../components/album-components/AlbumCard'
import { getAlbumsUser } from '../services/albums.services'

export default async function MyAlbumsPage() {
  const data = await getAlbumsUser()

  return (
    <section className="py-12">
      <Container>
        <h2 className="mb-8 text-3xl font-extrabold leading-none tracking-tight">
          Albums where you are a member
        </h2>
        <hr className="mb-8" />
        {'error' in data ? (
          <div>
            <h3 className="mb-4 text-2xl font-semibold">
              An error occured while fetching your data
            </h3>
            <p>{data.error.message}</p>
          </div>
        ) : (
          <>
            <div className="flex flex-row gap-8 justify-end">
              <ActionButton
                icon={<PlusCircleIcon className="h-4 w-4" />}
                className="flex-row-reverse"
                href="/albums/new"
              >
                Create a new album
              </ActionButton>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
              {data.map((album) => (
                <AlbumCard
                  key={album.id}
                  album={{
                    ...album,
                    author: album.users.find((u) => u.role === Role.ADMIN)
                      ?.user,
                  }}
                  firstPhoto={album.photos[0]}
                  showPublicChip
                />
              ))}
            </div>
          </>
        )}
      </Container>
    </section>
  )
}
