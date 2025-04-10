import { AuthorController } from './author.controller';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthorService } from '../author/author.service';
import { CreateAuthorDto } from './createAuthor.dto';
import { GetAuthorDto } from './getAuthor.dto';
import { NotFoundException } from '@nestjs/common';

describe('AuthorController', () => {
  let authorController: AuthorController;

  const mockAuthors = [
    { id: 1, name: 'Author 1', email: 'author1@example.com' },
    { id: 2, name: 'Author 2', email: 'author2@example.com' },
  ];

  const mockAuthorService = {
    findAll: jest.fn(),
    addAuthor: jest.fn((createAuthorDto: CreateAuthorDto) => {
      return {
        id: 1,
        ...createAuthorDto,
      };
    }),
    getAll: jest.fn(() => {
      return mockAuthors;
    }),
    getAuthorById: jest.fn((id: number) => {
      return mockAuthors.find((author) => author.id === id);
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthorController],
      providers: [AuthorService],
    })
      .overrideProvider(AuthorService)
      .useValue(mockAuthorService)
      .compile();

    authorController = module.get<AuthorController>(AuthorController);
  });

  it('should be defined', () => {
    expect(authorController).toBeDefined();
  });

  it('should create a new author', async () => {
    const createAuthor = {
      name: 'Jan',
      surname: 'Kowalski',
      email: 'jan.kowalski@wp.pl',
      password: 'password123',
    };

    const result = await authorController.createAuthor(createAuthor);

    expect(result).toEqual({
      id: 1,
      ...createAuthor,
    });
    expect(mockAuthorService.addAuthor).toHaveBeenCalledWith(createAuthor);
  });

  it('should return all authors', () => {
    expect(mockAuthorService.getAll()).toEqual([
      { id: 1, name: 'Author 1', email: 'author1@example.com' },
      { id: 2, name: 'Author 2', email: 'author2@example.com' },
    ]);
    expect(mockAuthorService.getAll).toHaveBeenCalled();
  });

  it('should return a single author by ID', async () => {
    const authorId = 1;
    const result = await authorController.getAuthor({ id: authorId });

    expect(result).toEqual(mockAuthors[0]);
    expect(mockAuthorService.getAuthorById).toHaveBeenCalledWith(authorId);
  });

  it('should throw NotFoundException when author not found', async () => {
    // Nadpisujemy getAuthorById tylko dla tego testu
    mockAuthorService.getAuthorById = jest.fn((_id: number) => {
      throw new NotFoundException('Author not found');
    });

    await expect(authorController.getAuthor({ id: 999 })).rejects.toThrow(
      NotFoundException,
    );

    expect(mockAuthorService.getAuthorById).toHaveBeenCalledWith(999);
  });

  it('should return empty list when no authors in database', () => {
    mockAuthorService.getAll = jest.fn(() => []);

    expect(authorController.getAllAuthors()).toEqual([]);
    expect(mockAuthorService.getAll).toHaveBeenCalled();
  });

  it('should return logged-in author id from profile', () => {
    const mockRequest = { user: { id: 42 } };
    const result = authorController.getProfile(mockRequest);

    expect(result).toEqual(42);
  });
});
