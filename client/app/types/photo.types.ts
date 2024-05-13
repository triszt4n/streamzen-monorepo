import { Album, Photo, User } from '@prisma/client'

export type PhotoWithSrc = Photo & { src: string }

export type PhotoFull = Photo & { src?: string; author?: User; album?: Album }
