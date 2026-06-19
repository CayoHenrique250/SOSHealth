import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

const mockUsersService = {
  create: jest.fn(),
  login: jest.fn(),
  getProfile: jest.fn(),
  updateProfile: jest.fn(),
  updateAnamnese: jest.fn(),
};

const mockUser = { userId: 'user-1', email: 'test@test.com', role: 'paciente' };

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useValue: mockUsersService },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<UsersController>(UsersController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call usersService.create and return result', async () => {
      const dto = { name: 'Alice', email: 'alice@test.com', password: '123456', role: 'PACIENTE', cpf: '111', birthDate: '1990-01-01', phone: '11 99999', address: 'Rua X' };
      const created = { id: 'user-1', ...dto };
      mockUsersService.create.mockResolvedValue(created);

      const result = await controller.create(dto as any);

      expect(mockUsersService.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(created);
    });
  });

  describe('login', () => {
    it('should call usersService.login and return token', async () => {
      const loginDto = { email: 'alice@test.com', password: '123456' };
      const loginResult = { token: 'jwt-token', user: { id: 'user-1', name: 'Alice', email: 'alice@test.com', role: 'paciente' } };
      mockUsersService.login.mockResolvedValue(loginResult);

      const result = await controller.login(loginDto as any);

      expect(mockUsersService.login).toHaveBeenCalledWith(loginDto);
      expect(result).toEqual(loginResult);
    });
  });

  describe('getProfile', () => {
    it('should call usersService.getProfile with userId from token', async () => {
      const profile = { id: 'user-1', name: 'Alice', email: 'alice@test.com', role: 'PACIENTE' };
      mockUsersService.getProfile.mockResolvedValue(profile);

      const result = await controller.getProfile({ user: mockUser });

      expect(mockUsersService.getProfile).toHaveBeenCalledWith('user-1');
      expect(result).toEqual(profile);
    });
  });

  describe('updateProfile', () => {
    it('should call usersService.updateProfile with userId and body', async () => {
      const updateData = { personal: { name: 'Bob' } };
      const updated = { id: 'user-1', name: 'Bob' };
      mockUsersService.updateProfile.mockResolvedValue(updated);

      const result = await controller.updateProfile({ user: mockUser }, updateData);

      expect(mockUsersService.updateProfile).toHaveBeenCalledWith('user-1', updateData);
      expect(result).toEqual(updated);
    });
  });

  describe('updateAnamnese', () => {
    it('should call usersService.updateAnamnese with userId and body', async () => {
      const updateData = { bloodType: 'O+' };
      const updated = { id: 'user-1', patient: { anamnese: { bloodType: 'O+' } } };
      mockUsersService.updateAnamnese.mockResolvedValue(updated);

      const result = await controller.updateAnamnese({ user: mockUser }, updateData);

      expect(mockUsersService.updateAnamnese).toHaveBeenCalledWith('user-1', updateData);
      expect(result).toEqual(updated);
    });
  });
});
