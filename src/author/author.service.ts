import { Injectable } from '@nestjs/common';
import { CreateAuthorDto } from './createAuthor.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Author } from 'src/entities/author.entity';

@Injectable()
export class AuthorService {
  constructor(
    @InjectRepository(Author)
    private readonly authorRepository: Repository<Author>,
  ) {}

  getHello(searchPhrase: string): string {
    return searchPhrase;
  }

  async addAuthor(authorDto: CreateAuthorDto) {
    const author: Author = this.authorRepository.create(authorDto);
    return await this.authorRepository.save(author);
  }

  async getAuthorById(id: number) {
    return await this.authorRepository.findOne({
      where: { id },
    });
  }

  async getAuthorByEmail(email: string) {
    return await this.authorRepository.findOne({
      where: {
        email,
      },
    });
  }

  async getAll() {
    return await this.authorRepository.find();
  }

  async updateRefreshToken(userId: number, hashedRefreshToken: string | null) {
    return await this.authorRepository.update(
      { id: userId },
      { hashedRefreshToken },
    );
  }
}
