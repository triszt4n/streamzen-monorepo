import { Delete, Get, NotFoundException, Post, UseGuards } from "@nestjs/common"
import { JwtGuard } from "src/auth/guards/jwt.guard"
import { ApiController } from "src/utils/api-controller.decorator"
import { UsersService } from "./users.service"

@ApiController("users")
@UseGuards(JwtGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll() {
    return this.usersService.findAll()
  }

  @Get(":id")
  async findOne(id: string) {
    return this.usersService.findOne(id)
  }

  @Post(":id/promote")
  async promote(id: string) {
    try {
      return this.usersService.promoteUser(id, "ADMIN")
    } catch {
      throw new NotFoundException("A felhasználó nem található!")
    }
  }

  @Delete(":id")
  async remove(id: string) {
    try {
      return this.usersService.remove(id)
    } catch {
      throw new NotFoundException("A felhasználó nem található!")
    }
  }
}
