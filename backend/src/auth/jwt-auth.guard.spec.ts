import { UnauthorizedException } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;

  beforeEach(() => {
    guard = new JwtAuthGuard();
  });

  describe('handleRequest', () => {
    it('should return user when no error and user exists', () => {
      const user = { userId: 'user-1', email: 'test@test.com', role: 'paciente' };
      const result = guard.handleRequest(null, user, null);
      expect(result).toBe(user);
    });

    it('should throw UnauthorizedException when no user and no error', () => {
      expect(() => guard.handleRequest(null, null, null)).toThrow(UnauthorizedException);
      expect(() => guard.handleRequest(null, null, null)).toThrow('Token inválido ou ausente.');
    });

    it('should rethrow the error when err is provided', () => {
      const error = new Error('JWT expired');
      expect(() => guard.handleRequest(error, null, null)).toThrow(error);
    });

    it('should throw UnauthorizedException when user is undefined', () => {
      expect(() => guard.handleRequest(null, undefined, null)).toThrow(UnauthorizedException);
    });

    it('should return user even when info is provided', () => {
      const user = { userId: 'user-2', email: 'doc@test.com', role: 'profissional' };
      const result = guard.handleRequest(null, user, { message: 'some info' });
      expect(result).toBe(user);
    });
  });
});
