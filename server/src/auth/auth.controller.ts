import { Get, Redirect, Res, UseGuards } from '@nestjs/common';
import { ApiFoundResponse, ApiQuery } from '@nestjs/swagger';
import { Response } from 'express';
import { ApiController } from 'src/utils/api-controller.decorator';
import { getHostFromUrl } from 'src/utils/auth.utils';
import { AuthService } from './auth.service';
import { UserDto } from './dto/user.dto';
import { AuthSchGuard } from './guards/authsch.guard';
import { JwtGuard } from './guards/jwt.guard';
import { CurrentUser } from '@kir-dev/passport-authsch';

@ApiController('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @UseGuards(AuthSchGuard)
  @Get('login')
  @ApiFoundResponse({
    description: 'Redirects to the AuthSch login page.',
  })
  login() {}

  @Get('callback')
  @UseGuards(AuthSchGuard)
  @Redirect(process.env.FRONTEND_CALLBACK, 302)
  @ApiFoundResponse({
    description: 'Redirects to the frontend and sets cookie with JWT.',
  })
  @ApiQuery({ name: 'code', required: true })
  oauthRedirect(@CurrentUser() user: UserDto, @Res() res: Response): void {
    const jwt = this.authService.login(user);
    res.cookie('jwt', jwt, {
      httpOnly: true,
      secure: true,
      domain: getHostFromUrl(process.env.FRONTEND_CALLBACK),
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    });
  }

  @Get('logout')
  @Redirect(process.env.FRONTEND_CALLBACK, 302)
  @ApiFoundResponse({
    description: 'Redirects to the frontend and clears the JWT cookie.',
  })
  logout(@Res() res: Response): void {
    res.clearCookie('jwt', {
      domain: getHostFromUrl(process.env.FRONTEND_CALLBACK),
    });
  }

  @Get('me')
  @UseGuards(JwtGuard)
  me(@CurrentUser() user: UserDto): UserDto {
    return user;
  }
}
