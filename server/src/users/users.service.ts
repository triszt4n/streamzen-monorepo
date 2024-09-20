import { Injectable } from "@nestjs/common"
import { User, UserRole } from "@prisma/client"
import { PrismaService } from "../prisma/prisma.service"
import { CreateUserDto } from "./dto/create-user.dto"
import { UpdateUserDto } from "./dto/update-user.dto"

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany()
  }

  async findOne(id: string) {
    return this.prisma.user.findUnique({ where: { id: id } })
  }

  async findByAuthSchId(authSchId: string) {
    return this.prisma.user.findUnique({ where: { authSchId: authSchId } })
  }

  async create(data: CreateUserDto) {
    return this.prisma.user.create({ data })
  }

  async update(id: string, data: UpdateUserDto) {
    return this.prisma.user.update({ data, where: { id: id } })
  }

  async promoteUser(id: string, role: UserRole) {
    return this.prisma.user.update({
      data: { role },
      where: { id: id },
    })
  }

  async remove(id: string) {
    return this.prisma.user.delete({ where: { id: id } })
  }

  async findAllVideosCreatedByUser(user: User) {
    return this.prisma.user.findUnique({
      where: { id: user.id },
      include: {
        vods: true,
      },
    })
  }
}
