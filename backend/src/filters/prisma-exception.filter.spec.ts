import { PrismaExceptionFilter } from './prisma-exception.filter';
import { Prisma } from '@prisma/client';
import { ArgumentsHost } from '@nestjs/common';

function buildMockHost(responseMock: any): ArgumentsHost {
  return {
    switchToHttp: () => ({
      getResponse: () => responseMock,
    }),
  } as unknown as ArgumentsHost;
}

function buildResponseMock() {
  const json = jest.fn();
  const status = jest.fn().mockReturnValue({ json });
  return { status, json };
}

function buildPrismaError(code: string, meta?: object): Prisma.PrismaClientKnownRequestError {
  return Object.assign(new Error('Prisma error') as any, {
    code,
    meta: meta ?? {},
    clientVersion: '4.0',
  });
}

describe('PrismaExceptionFilter', () => {
  let filter: PrismaExceptionFilter;

  beforeEach(() => {
    filter = new PrismaExceptionFilter();
  });

  it('should return 400 with email message for P2002 email constraint', () => {
    const res = buildResponseMock();
    const host = buildMockHost(res);
    const exception = buildPrismaError('P2002', { target: ['email'] });

    filter.catch(exception, host);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.status().json).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Este e-mail já está cadastrado.' }),
    );
  });

  it('should return 400 with cpf message for P2002 cpf constraint', () => {
    const res = buildResponseMock();
    const host = buildMockHost(res);
    const exception = buildPrismaError('P2002', { target: ['cpf'] });

    filter.catch(exception, host);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.status().json).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Este CPF já está cadastrado.' }),
    );
  });

  it('should return 400 with councilNumber message for P2002 councilNumber constraint', () => {
    const res = buildResponseMock();
    const host = buildMockHost(res);
    const exception = buildPrismaError('P2002', { target: ['councilNumber'] });

    filter.catch(exception, host);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.status().json).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Este número de conselho já está cadastrado.' }),
    );
  });

  it('should return 400 with generic message for P2002 unknown field', () => {
    const res = buildResponseMock();
    const host = buildMockHost(res);
    const exception = buildPrismaError('P2002', { target: ['someOtherField'] });

    filter.catch(exception, host);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.status().json).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Este valor já está em uso no sistema.' }),
    );
  });

  it('should return 400 with generic message for P2002 with no meta target', () => {
    const res = buildResponseMock();
    const host = buildMockHost(res);
    const exception = buildPrismaError('P2002', {});

    filter.catch(exception, host);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.status().json).toHaveBeenCalledWith(
      expect.objectContaining({ statusCode: 400 }),
    );
  });

  it('should return 404 for P2025 error', () => {
    const res = buildResponseMock();
    const host = buildMockHost(res);
    const exception = buildPrismaError('P2025');

    filter.catch(exception, host);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.status().json).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Registro não encontrado.', statusCode: 404 }),
    );
  });

  it('should return 500 for unknown Prisma error codes', () => {
    const res = buildResponseMock();
    const host = buildMockHost(res);
    const exception = buildPrismaError('P9999');

    filter.catch(exception, host);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.status().json).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Erro interno do servidor.', statusCode: 500 }),
    );
  });
});
