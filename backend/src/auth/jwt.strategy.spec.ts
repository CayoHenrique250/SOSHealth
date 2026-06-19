import { JwtStrategy } from './jwt.strategy';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;

  beforeEach(() => {
    process.env.JWT_SECRET = 'test-secret';
    strategy = new JwtStrategy();
  });

  describe('validate', () => {
    it('should return userId, email, and role from payload (paciente)', async () => {
      const payload = { sub: 'user-id-1', email: 'pac@test.com', role: 'paciente' };
      const result = await strategy.validate(payload);
      expect(result).toEqual({ userId: 'user-id-1', email: 'pac@test.com', role: 'paciente' });
    });

    it('should return userId, email, and role from payload (profissional)', async () => {
      const payload = { sub: 'user-id-2', email: 'prof@test.com', role: 'profissional' };
      const result = await strategy.validate(payload);
      expect(result).toEqual({ userId: 'user-id-2', email: 'prof@test.com', role: 'profissional' });
    });

    it('should handle payload with extra fields', async () => {
      const payload = { sub: 'user-id-3', email: 'extra@test.com', role: 'paciente', extra: 'ignored' };
      const result = await strategy.validate(payload);
      expect(result).toEqual({ userId: 'user-id-3', email: 'extra@test.com', role: 'paciente' });
    });
  });
});
