import { ExtractJwt, SecretOrKeyProvider, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/users/users.service';

interface AccessToken {
  sub: string;
  iat: number;
  exp: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService
  ) {
    const secretProvider: SecretOrKeyProvider = (
      _request,
      _rawJwtToken,
      done
    ) => {
      const secret = this.configService.get<string>('JWT_SECRET');
      done(undefined, secret);
    };

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKeyProvider: secretProvider
    });
  }

  async validate(payload: AccessToken) {
    const user = await this.usersService.findById(payload.sub);

    if (user) {
      const passwordUpdateDate =
        await this.usersService.getUserPasswordUpdateDate(user.id);

      if (
        !passwordUpdateDate ||
        passwordUpdateDate.getTime() / 1000 < payload.iat
      )
        return user;
    }

    throw new UnauthorizedException();
  }
}
