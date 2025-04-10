import { Test, TestingModule } from '@nestjs/testing';
import { AuthorService } from './author.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Author } from 'src/entities/author.entity';
import { Repository } from 'typeorm';
import { CreateAuthorDto } from './createAuthor.dto';

describe('AuthorService', () => {
  let service: AuthorService;
  let repository: Repository<Author>;

  const authorToAdd: CreateAuthorDto = {
    name: 'Jan',
    surname: 'Kowalski',
    email: 'jan.kowalski@wp.pl',
    password: 'password123',
  };

  //najlepiej jednak tutaj zostawic czyste funkcje i je nadpisywac w odpowiednich testach, zeby moc manipulowac danymi
  const mockAuthorRepository = {
    create: jest.fn().mockResolvedValue(authorToAdd),
    save: jest
      .fn()
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      .mockResolvedValue({ id: expect.any(Number), ...authorToAdd }),
    findOne: jest.fn(),
    find: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthorService,
        {
          provide: getRepositoryToken(Author),
          useValue: mockAuthorRepository,
        },
      ],
    }).compile();

    service = module.get<AuthorService>(AuthorService);
    repository = module.get<Repository<Author>>(getRepositoryToken(Author));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return the same argument', () => {
    expect(service.getHello('Hello')).toEqual('Hello');
  });

  describe('addAuthor', () => {
    it('should add author', async () => {
      const authorToAdd: CreateAuthorDto = {
        name: 'Jan',
        surname: 'Kowalski',
        email: 'jan.kowalski@wp.pl',
        password: 'password123',
      };

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const savedAuthor = { id: expect.any(Number), ...authorToAdd };

      //tutaj nadpisujemy te funkcje wczesniejsze, bo musimy zwrocic wartosc oczekiwana
      mockAuthorRepository.create.mockReturnValue(authorToAdd);
      mockAuthorRepository.save.mockResolvedValue(savedAuthor);

      //najpierw wywolujemy metode
      expect(await service.addAuthor(authorToAdd)).toEqual(savedAuthor);

      //a potem sprawdzamy, czy rzeczywiscie wywolana metoda wywolala kolejne inne metody
      expect(mockAuthorRepository.create).toHaveBeenCalledWith(authorToAdd);
      expect(mockAuthorRepository.save).toHaveBeenCalledWith(authorToAdd);
    });
  });
  describe('getAuthorById', () => {
    it('should get an author by id', async () => {
      const authorId = 1;
      const receivedAuthor = {
        name: 'Jan',
        surname: 'Kowalski',
        email: 'jan.kowalski@wp.pl',
      };
      const receivedObject = { authorId, ...receivedAuthor };
      //i tutaj mamy 1 opcje dla async czyli (i tak powinno byc)
      mockAuthorRepository.findOne.mockResolvedValue(receivedObject);
      //a jesli funkcja nie jest async czyli nie musimy wykorzystywac asynchronicznosci to mozemy zrobic na 2 sposoby:
      mockAuthorRepository.findOne = jest.fn(() => receivedObject);
      //albo tak
      mockAuthorRepository.findOne.mockReturnValue(receivedObject);

      const returnedObject = await service.getAuthorById(1);
      expect(returnedObject).toEqual(receivedObject);
      expect(mockAuthorRepository.findOne).toHaveBeenCalledWith({
        where: { id: authorId },
      });
    });
  });

  describe('updateRefreshToken', () => {
    it('should update refreshtoken of given id', async () => {
      const authorId = 1;
      const exampleRefreshToken = 'abcdef';

      mockAuthorRepository.update.mockResolvedValue({ affected: 1 });

      const update = await service.updateRefreshToken(
        authorId,
        exampleRefreshToken,
      );

      expect(update).toEqual({ affected: 1 });
      expect(mockAuthorRepository.update).toHaveBeenCalledWith(
        { id: authorId },
        { hashedRefreshToken: exampleRefreshToken },
      );
    });
  });
  //   describe('addAuthor', () => {
  //     it('should create and save a new author', async () => {
  //       const authorDto = { name: 'John Doe', email: 'john@example.com' };
  //       const savedAuthor = { id: 1, ...authorDto };

  //       mockAuthorRepository.create.mockReturnValue(authorDto);
  //       mockAuthorRepository.save.mockResolvedValue(savedAuthor);

  //       const result = await service.addAuthor(authorDto as any);

  //       expect(mockAuthorRepository.create).toHaveBeenCalledWith(authorDto);
  //       expect(mockAuthorRepository.save).toHaveBeenCalledWith(authorDto);
  //       expect(result).toEqual(savedAuthor);
  //     });
  //   });

  //   describe('getAuthorById', () => {
  //     it('should return an author by ID', async () => {
  //       const author = { id: 1, name: 'John Doe', email: 'john@example.com' };

  //       mockAuthorRepository.findOne.mockResolvedValue(author);

  //       const result = await service.getAuthorById(1);

  //       expect(mockAuthorRepository.findOne).toHaveBeenCalledWith({
  //         where: { id: 1 },
  //       });
  //       expect(result).toEqual(author);
  //     });
  //   });

  //   describe('getAuthorByEmail', () => {
  //     it('should return an author by email', async () => {
  //       const author = { id: 1, name: 'John Doe', email: 'john@example.com' };

  //       mockAuthorRepository.findOne.mockResolvedValue(author);

  //       const result = await service.getAuthorByEmail('john@example.com');

  //       expect(mockAuthorRepository.findOne).toHaveBeenCalledWith({
  //         where: { email: 'john@example.com' },
  //       });
  //       expect(result).toEqual(author);
  //     });
  //   });

  //   describe('getAll', () => {
  //     it('should return all authors', async () => {
  //       const authors = [
  //         { id: 1, name: 'John Doe', email: 'john@example.com' },
  //         { id: 2, name: 'Jane Doe', email: 'jane@example.com' },
  //       ];

  //       mockAuthorRepository.find.mockResolvedValue(authors);

  //       const result = await service.getAll();

  //       expect(mockAuthorRepository.find).toHaveBeenCalled();
  //       expect(result).toEqual(authors);
  //     });
  //   });

  //   describe('updateRefreshToken', () => {
  //     it('should update the refresh token for a user', async () => {
  //       const userId = 1;
  //       const hashedRefreshToken = 'hashed-token';

  //       mockAuthorRepository.update.mockResolvedValue({ affected: 1 });

  //       const result = await service.updateRefreshToken(
  //         userId,
  //         hashedRefreshToken,
  //       );

  //       expect(mockAuthorRepository.update).toHaveBeenCalledWith(
  //         { id: userId },
  //         { hashedRefreshToken },
  //       );
  //       expect(result).toEqual({ affected: 1 });
  //     });
  //   });
});
