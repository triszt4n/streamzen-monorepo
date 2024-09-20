import { CurrentUser } from "@kir-dev/passport-authsch"
import { Get, Logger, Res, UseGuards } from "@nestjs/common"
import { ApiFoundResponse, ApiQuery } from "@nestjs/swagger"
import { Response } from "express"
import { ApiController } from "src/utils/api-controller.decorator"
import { getHostFromUrl } from "src/utils/auth.utils"
import { AuthService } from "./auth.service"
import { UserDto } from "./dto/user.dto"
import { AuthSchGuard } from "./guards/authsch.guard"
import { JwtGuard } from "./guards/jwt.guard"

@ApiController("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  logger = new Logger(AuthController.name)

  @UseGuards(AuthSchGuard)
  @Get("login")
  @ApiFoundResponse({
    description: "Redirects to the AuthSch login page.",
  })
  login() {}

  @Get("callback")
  @UseGuards(AuthSchGuard)
  @ApiFoundResponse({
    description: "Redirects to the frontend and sets cookie with JWT.",
  })
  @ApiQuery({ name: "code", required: true })
  oauthRedirect(@CurrentUser() user: UserDto, @Res() res: Response): void {
    const jwt = this.authService.login(user)
    res.cookie("jwt", jwt, {
      httpOnly: true,
      secure: true,
      domain: process.env.NODE_ENV === "production" ? getHostFromUrl(process.env.FRONTEND_CALLBACK) : undefined,
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    })
    res.redirect(302, process.env.FRONTEND_CALLBACK + "?authenticated=true")
  }

  @Get("logout")
  @ApiFoundResponse({
    description: "Redirects to the frontend and clears the JWT cookie.",
  })
  logout(@Res() res: Response): void {
    res.clearCookie("jwt", {
      domain: getHostFromUrl(process.env.FRONTEND_CALLBACK),
    })
    res.redirect(302, process.env.FRONTEND_CALLBACK)
  }

  @Get("me")
  @UseGuards(JwtGuard)
  me(@CurrentUser() user: UserDto): UserDto {
    this.logger.log(`User requested:`, user)
    return user
  }
}
