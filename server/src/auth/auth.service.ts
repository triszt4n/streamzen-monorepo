import { AuthSchProfile } from "@kir-dev/passport-authsch"
import { Injectable } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { JwtService } from "@nestjs/jwt"
import { UserDto } from "./dto/user.dto"
import { PrismaService } from "src/prisma/prisma.service"
import * as crypto from "crypto"

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService
  ) {}

  login(user: object): string {
    return this.jwtService.sign(user, {
      secret: this.configService.get<string>("JWT_SECRET"),
      expiresIn: "7 days",
    })
  }

  private getGravatarUrl(email: string, size = 80) {
    const trimmedEmail = email.trim().toLowerCase()
    const hash = crypto.createHash("sha256").update(trimmedEmail).digest("hex")
    return `https://www.gravatar.com/avatar/${hash}?s=${size}&d=identicon`
  }

  async createOrUpdateUser(prof: AuthSchProfile): Promise<UserDto> {
    const gravatarUrl = this.getGravatarUrl(prof.email, 200)

    return this.prisma.user.upsert({
      where: { authSchId: prof.authSchId },
      update: {
        fullName: prof.fullName,
        firstName: prof.firstName,
        email: prof.email,
        imageUrl: gravatarUrl,
      },
      create: {
        authSchId: prof.authSchId,
        fullName: prof.fullName,
        firstName: prof.firstName,
        email: prof.email,
        imageUrl: gravatarUrl,
      },
    })
  }
}
