import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let authController: AuthController;

  const mockAuthService = {
    login: jest.fn(),
    refreshJwt: jest.fn(),
    signOut: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });
  describe('login', () => {
    it('should return userId, accessToken and refreshToken', async () => {
      const userId = 1;
      const loggedUser = {
        userId,
        accessToken: 'access-token',
        refreshAccessToken: 'refresh-access-token',
      };

      mockAuthService.login.mockResolvedValue(loggedUser);

      const returnValue = await authController.login({ user: { id: userId } });
      expect(returnValue).toEqual(loggedUser);
      expect(mockAuthService.login).toHaveBeenCalledWith(userId);
    });
  });
  describe('signOut', () => {
    it('should call authService.signOut with correct id', async () => {
      const userId = 1;

      mockAuthService.signOut.mockResolvedValue(undefined);

      await authController.signOut({
        user: { id: userId },
      });

      expect(mockAuthService.signOut).toHaveBeenCalledWith(userId);
    });
  });
  describe('refreshJwt', () => {
    it('should return userId, accessToken, and refreshToken', async () => {
      const userId = 1;
      const refreshedTokens = {
        userId,
        accessToken: 'new-access-token',
        refreshAccessToken: 'new-refresh-access-token',
      };

      mockAuthService.refreshJwt.mockResolvedValue(refreshedTokens);

      const returnValue = await authController.refreshJwt({
        user: { id: userId },
      });

      expect(returnValue).toEqual(refreshedTokens);

      expect(mockAuthService.refreshJwt).toHaveBeenCalledWith(userId);
    });
  });
});
