import { Body, Controller, Post } from '@nestjs/common';
import { BookService } from './book.service';
import { AddBookDto } from './addBook.dto';

@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  // @Get()
  // getHello(@Query('search') search: string): string {
  //   return this.authorService.getHello(search);
  // }

  // @Get()
  // getAllAuthors() {
  //   return this.authorService.getAll();
  // }

  @Post()
  addBook(@Body() addBookDto: AddBookDto) {
    return this.bookService.addBook(addBookDto);
  }
}
