import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Book } from 'src/entities/book.entity';
import { AddBookDto } from './addBook.dto';
import { Author } from 'src/entities/author.entity';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,

    @InjectRepository(Author)
    private readonly authorsRepository: Repository<Book>,
  ) {}

  getHello(searchPhrase: string): string {
    return searchPhrase;
  }

  async addBook(bookDto: AddBookDto) {
    const { authorsId, ...bookData } = bookDto;
    const authors = await this.authorsRepository.findBy({
      id: In(authorsId),
    });

    if (authors.length !== authorsId.length) {
      throw new HttpException('Some authors not found', HttpStatus.BAD_REQUEST);
    }

    const newBook = this.bookRepository.create({
      title: bookData.title,
      description: bookData.description,
      writtenBy: authors,
    });

    return await this.bookRepository.save(newBook);
  }

  getAuthor(id: number) {
    return id;
  }

  // async getAll() {
  //   return await this.authorRepository.find();
  // }
}
