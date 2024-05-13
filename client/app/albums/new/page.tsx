import Container from '../../components/Container'
import NewAlbumForm from '../../components/forms/NewAlbumForm'

export default async function NewAlbumPage() {
  return (
    <Container className="py-12">
      <NewAlbumForm title="Create album" />
    </Container>
  )
}
