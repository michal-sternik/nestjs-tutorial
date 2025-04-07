import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthorService } from './author.service';
import { CreateAuthorDto } from './createAuthor.dto';
import { GetAuthorDto } from './getAuthor.dto';
import { AuthGuard } from '@nestjs/passport';
import { Role } from 'src/auth/enums/role.enum';
import { Roles } from 'src/auth/decorators/role.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@Controller('author')
export class AuthorController {
  constructor(private readonly authorService: AuthorService) {}

  // @Get()
  // getHello(@Query('search') search: string): string {
  //   return this.authorService.getHello(search);
  // }
  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  getProfile(@Req() req: { user: { id: number } }) {
    return req.user.id;
  }

  @Get(':id')
  getAuthor(@Param() authorDto: GetAuthorDto) {
    return this.authorService.getAuthorById(authorDto.id);
  }

  @Roles(Role.ADMIN, Role.USER)
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard('jwt'))
  @Get()
  getAllAuthors() {
    return this.authorService.getAll();
  }

  @Post()
  createAuthor(@Body() authorDto: CreateAuthorDto) {
    return this.authorService.addAuthor(authorDto);
  }
}
