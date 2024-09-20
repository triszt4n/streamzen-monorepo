import { Injectable } from "@nestjs/common"
import { UserDto } from "src/auth/dto/user.dto"
import { PrismaService } from "src/prisma/prisma.service"
import { CreateVideoDto } from "./dto/create-video.dto"
import { UpdateVideoDto } from "./dto/update-video.dto"

@Injectable()
export class VideoService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createVideoDto: CreateVideoDto, user: UserDto) {
    return this.prisma.vod.create({
      data: {
        title: createVideoDto.title,
        descMarkdown: "",
        filename: "unknown",
        ext: "unknown",
        author: {
          connect: {
            id: user.id,
          },
        },
      },
    })
  }

  async findAll() {
    return this.prisma.vod.findMany({
      include: {
        author: true,
      },
    })
  }

  async findOne(id: string) {
    return this.prisma.vod.findUnique({
      where: {
        id,
      },
    })
  }

  async update(id: string, updateVideoDto: UpdateVideoDto) {
    return this.prisma.vod.update({
      where: {
        id,
      },
      data: {
        title: updateVideoDto.title,
      },
    })
  }

  async remove(id: string) {
    return this.prisma.vod.delete({
      where: {
        id,
      },
    })
  }
}
