import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, Inject } from '@nestjs/common';
import { Request } from 'express';
import { ConfigService, ConfigType } from '@nestjs/config';
import refreshJwtConfig from '../config/refresh-jwt.config';
import { AuthService } from '../auth.service';
import { AuthJwtPayload } from '../types/jwtPayload';

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(
  Strategy,
  'refresh-jwt',
) {
  constructor(
    @Inject(refreshJwtConfig.KEY)
    readonly refreshJwt: ConfigType<typeof refreshJwtConfig>,
    private readonly authService: AuthService,
    private readonly config: ConfigService,
  ) {
    const secret = refreshJwt.secret;
    console.log('Secret', refreshJwt.secret);
    if (!secret) {
      throw new Error('Missing REFRESH_JWT_SECRET in environment variables');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: secret,
      ignoreExpiration: false,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: AuthJwtPayload) {
    //token na pewno jest, bo jak nie ma to nie dojdzie tutaj nawet wiec !
    const refreshToken = req.get('authorization')!.split(' ')[1];
    await this.authService.validateRefreshToken(payload.sub, refreshToken);
    return { id: payload.sub };
  }
}
