import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  login(user: object): string {
    return this.jwtService.sign(user, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: '7 days',
    });
  }
}
