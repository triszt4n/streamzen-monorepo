export interface MeDto {
  id: number
  email: string
  firstName: string
  fullName: string
  imageUrl: string
}

export interface VodDto {
  id: number
  title: string
  descMarkdown: string
  thumbnailUrl?: string
  createdAt: string
  author: MeDto
  state: string
  statePercent: number
  availability: string
  uploadedFilename?: string
}
