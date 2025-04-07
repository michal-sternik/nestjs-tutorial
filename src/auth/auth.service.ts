import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { AuthorService } from 'src/author/author.service';
import { AuthJwtPayload } from './types/jwtPayload';
import refreshJwtConfig from './config/refresh-jwt.config';
import { ConfigType } from '@nestjs/config';
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
  constructor(
    private authorService: AuthorService,
    private jwtService: JwtService,
    @Inject(refreshJwtConfig.KEY)
    private refreshTokenConfig: ConfigType<typeof refreshJwtConfig>,
  ) {}

  async validateAuthor(email: string, password: string) {
    const author = await this.authorService.getAuthorByEmail(email);
    if (!author) throw new UnauthorizedException('Author is not found');
    const isPasswordMatch = await compare(password, author.password);
    if (!isPasswordMatch) throw new UnauthorizedException('Password is wrong!');
    return { id: author.id };
  }

  async login(userId: number) {
    // const payload: AuthJwtPayload = { sub: userId };
    // return this.jwtService.sign(payload);
    //wygenerowanie nowego access token i refresh token
    const { accessToken, refreshToken } = await this.generateTokens(userId);
    //zahashowanie refreshToken
    const hashedRefreshToken = await argon2.hash(refreshToken);
    //zapisanie do bazy nowego refresh token
    await this.authorService.updateRefreshToken(userId, hashedRefreshToken);
    //zwrocenie obu uzytkownikowi
    return {
      userId,
      accessToken,
      refreshToken,
    };
  }

  async refreshJwt(userId: number) {
    //wygenerowanie nowego access token i refresh token
    const { accessToken, refreshToken } = await this.generateTokens(userId);
    //zahashowanie refreshToken
    const hashedRefreshToken = await argon2.hash(refreshToken);
    //zapisanie do bazy nowego refresh token
    await this.authorService.updateRefreshToken(userId, hashedRefreshToken);
    //zwrocenie obu uzytkownikowi
    return {
      userId,
      accessToken,
      refreshToken,
    };
  }

  async generateTokens(userId: number) {
    const payload: AuthJwtPayload = { sub: userId };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, this.refreshTokenConfig),
    ]);
    return { accessToken, refreshToken };
  }

  async validateRefreshToken(userId: number, refreshToken: string) {
    const author = await this.authorService.getAuthorById(userId);
    if (!author || !author.hashedRefreshToken)
      throw new NotFoundException(
        'User with such id not found or no refresh token',
      );
    const refreshTokenMatches = await argon2.verify(
      author.hashedRefreshToken,
      refreshToken,
    );
    if (!refreshTokenMatches)
      throw new BadRequestException("Token doesn't match");
    //nie trzeba nic zwracac bo nic nie potrzebujemy
  }

  async signOut(userId: number) {
    await this.authorService.updateRefreshToken(userId, null);
  }
  async validateJwtUser(userId: number) {
    const user = await this.authorService.getAuthorById(userId);
    if (!user) throw new UnauthorizedException('User with such id not found.');
    return user.role;
  }
}
