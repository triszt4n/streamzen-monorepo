import {
  AuthSchProfile,
  AuthSchScope,
  Strategy,
} from '@kir-dev/passport-authsch';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { UserDto } from '../dto/user.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthSchStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
  ) {
    super({
      clientId: configService.get<string>('AUTHSCH_CLIENT_ID'),
      clientSecret: configService.get<string>('AUTHSCH_CLIENT_SECRET'),
      scopes: [AuthSchScope.PROFILE, AuthSchScope.PEK_PROFILE],
    });
  }

  validate(userProfile: AuthSchProfile): Promise<UserDto> {
    return Promise.resolve({
      displayName: userProfile.fullName,
    });
  }
}
