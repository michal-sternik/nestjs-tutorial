import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { AuthorService } from 'src/author/author.service';
import { JwtService } from '@nestjs/jwt';
import refreshJwtConfig from './config/refresh-jwt.config';
import { ConfigType } from '@nestjs/config';
import * as argon2 from 'argon2';
import * as bcrypt from 'bcrypt';
import {
  UnauthorizedException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;

  const mockedAuthorService = {
    getAuthorByEmail: jest.fn(),
    getAuthorById: jest.fn(),
    updateRefreshToken: jest.fn(),
  };

  const mocketJwtService = {
    signAsync: jest.fn(),
  };

  const mockedRefreshTokenConfig = {
    secret: 'test-secret',
    expiresIn: '7d',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: AuthorService, useValue: mockedAuthorService },
        { provide: JwtService, useValue: mocketJwtService },
        { provide: refreshJwtConfig.KEY, useValue: mockedRefreshTokenConfig },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateAuthor', () => {
    it('should validate author and return its id', async () => {
      const mockedAuthor = {
        id: 1,
        email: 'test@example.com',
        password: await argon2.hash('password'),
      };
      mockedAuthorService.getAuthorByEmail.mockResolvedValue(mockedAuthor);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);

      const returnAuthorId = await service.validateAuthor(
        mockedAuthor.email,
        'password',
      );
      expect({ id: mockedAuthor.id }).toEqual(returnAuthorId);

      expect(mockedAuthorService.getAuthorByEmail).toHaveBeenCalledWith(
        mockedAuthor.email,
      );
    });
  });

  //   describe('validateAuthor', () => {
  //     it('should return author id if credentials are valid', async () => {
  //       const mockAuthor = { id: 1, password: await argon2.hash('password') };
  //       authorService.getAuthorByEmail.mockResolvedValue(mockAuthor);
  //       jest.spyOn(argon2, 'verify').mockResolvedValue(true);

  //       const result = await service.validateAuthor(
  //         'test@example.com',
  //         'password',
  //       );
  //       expect(result).toEqual({ id: mockAuthor.id });
  //     });

  //     it('should throw UnauthorizedException if author is not found', async () => {
  //       authorService.getAuthorByEmail.mockResolvedValue(null);

  //       await expect(
  //         service.validateAuthor('test@example.com', 'password'),
  //       ).rejects.toThrow(UnauthorizedException);
  //     });

  //     it('should throw UnauthorizedException if password is incorrect', async () => {
  //       const mockAuthor = { id: 1, password: await argon2.hash('password') };
  //       authorService.getAuthorByEmail.mockResolvedValue(mockAuthor);
  //       jest.spyOn(argon2, 'verify').mockResolvedValue(false);

  //       await expect(
  //         service.validateAuthor('test@example.com', 'wrong-password'),
  //       ).rejects.toThrow(UnauthorizedException);
  //     });
  //   });

  //   describe('login', () => {
  //     it('should return access and refresh tokens', async () => {
  //       const userId = 1;
  //       jwtService.signAsync
  //         .mockResolvedValueOnce('access-token')
  //         .mockResolvedValueOnce('refresh-token');
  //       jest.spyOn(argon2, 'hash').mockResolvedValue('hashed-refresh-token');
  //       authorService.updateRefreshToken.mockResolvedValue(undefined);

  //       const result = await service.login(userId);

  //       expect(result).toEqual({
  //         userId,
  //         accessToken: 'access-token',
  //         refreshToken: 'refresh-token',
  //       });
  //       expect(authorService.updateRefreshToken).toHaveBeenCalledWith(
  //         userId,
  //         'hashed-refresh-token',
  //       );
  //     });
  //   });

  //   describe('validateRefreshToken', () => {
  //     it('should throw NotFoundException if user or refresh token is not found', async () => {
  //       authorService.getAuthorById.mockResolvedValue(null);

  //       await expect(
  //         service.validateRefreshToken(1, 'refresh-token'),
  //       ).rejects.toThrow(NotFoundException);
  //     });

  //     it('should throw BadRequestException if refresh token does not match', async () => {
  //       const mockAuthor = { hashedRefreshToken: 'hashed-refresh-token' };
  //       authorService.getAuthorById.mockResolvedValue(mockAuthor);
  //       jest.spyOn(argon2, 'verify').mockResolvedValue(false);

  //       await expect(
  //         service.validateRefreshToken(1, 'wrong-refresh-token'),
  //       ).rejects.toThrow(BadRequestException);
  //     });

  //     it('should not throw if refresh token is valid', async () => {
  //       const mockAuthor = { hashedRefreshToken: 'hashed-refresh-token' };
  //       authorService.getAuthorById.mockResolvedValue(mockAuthor);
  //       jest.spyOn(argon2, 'verify').mockResolvedValue(true);

  //       await expect(
  //         service.validateRefreshToken(1, 'refresh-token'),
  //       ).resolves.not.toThrow();
  //     });
  //   });

  //   describe('signOut', () => {
  //     it('should clear the refresh token', async () => {
  //       authorService.updateRefreshToken.mockResolvedValue(undefined);

  //       await service.signOut(1);

  //       expect(authorService.updateRefreshToken).toHaveBeenCalledWith(1, null);
  //     });
  //   });
});
