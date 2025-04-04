import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('local')) //ewentualnie zrobic custom guard w ./guards
  @Post('login')
  login(@Request() req: { user: { id: number } }) {
    return this.authService.login(req.user.id);
  }

  @UseGuards(AuthGuard('refresh-jwt'))
  @Post('refresh')
  refreshJwt(@Request() req: { user: { id: number } }) {
    return this.authService.refreshJwt(req.user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('signout')
  signOut(@Req() req: { user: { id: number } }) {
    return this.authService.signOut(req.user.id);
  }
}
