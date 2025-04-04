import { Module } from '@nestjs/common';
import { BookController } from './book.controller';
import { BookService } from './book.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from 'src/entities/book.entity';
import { Author } from 'src/entities/author.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Book, Author])],
  controllers: [BookController],
  providers: [BookService],
})
export class BookModule {}
