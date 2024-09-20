import { CurrentUser } from "@kir-dev/passport-authsch"
import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common"
import { UserDto } from "src/auth/dto/user.dto"
import { JwtGuard } from "src/auth/guards/jwt.guard"
import { CreateVideoDto } from "./dto/create-video.dto"
import { UpdateVideoDto } from "./dto/update-video.dto"
import { VideoService } from "./video.service"

@Controller("videos")
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

  @Post()
  @UseGuards(JwtGuard)
  create(@Body() createVideoDto: CreateVideoDto, @CurrentUser() user: UserDto) {
    return this.videoService.create(createVideoDto, user)
  }

  @Get()
  findAll() {
    return this.videoService.findAll()
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.videoService.findOne(id)
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateVideoDto: UpdateVideoDto) {
    return this.videoService.update(id, updateVideoDto)
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.videoService.remove(id)
  }
}
