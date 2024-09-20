import { Module } from "@nestjs/common"
import { JwtModule } from "@nestjs/jwt"
import { PassportModule } from "@nestjs/passport"
import { PrismaModule } from "src/prisma/prisma.module"
import { AuthController } from "./auth.controller"
import { AuthService } from "./auth.service"
import { AuthSchStrategy } from "./strategies/authsch.strategy"
import { JwtStrategy } from "./strategies/jwt.strategy"

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: "2 days" },
    }),
    PassportModule.register({}),
    PrismaModule,
  ],
  controllers: [AuthController],
  providers: [AuthSchStrategy, JwtStrategy, AuthService],
})
export class AuthModule {}
