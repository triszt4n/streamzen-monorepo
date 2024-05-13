import Container from '../../../components/Container'
import NewAlbumForm from '../../../components/forms/NewAlbumForm'
import { getAlbum } from '../../../services/albums.services'
import { AlbumWithUsers } from '../../../types/album.types'

export default async function EditAlbumPage({
  params,
}: {
  params: { id: string }
}) {
  const data = (await getAlbum(params.id)) as AlbumWithUsers

  return (
    <Container className="py-12">
      <NewAlbumForm title="Edit album" defaultValues={data} />
    </Container>
  )
}
