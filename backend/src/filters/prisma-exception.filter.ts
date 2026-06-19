import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  BadRequestException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();

    if (exception.code === 'P2002') {
      const field = (exception.meta?.target as string[])?.[0];

      const fieldMessages: Record<string, string> = {
        email: 'Este e-mail já está cadastrado.',
        cpf: 'Este CPF já está cadastrado.',
        councilNumber: 'Este número de conselho já está cadastrado.',
      };

      const message =
        fieldMessages[field] || 'Este valor já está em uso no sistema.';

      return response.status(400).json({
        statusCode: 400,
        message,
        error: 'Bad Request',
      });
    }

    if (exception.code === 'P2025') {
      return response.status(404).json({
        statusCode: 404,
        message: 'Registro não encontrado.',
        error: 'Not Found',
      });
    }

    return response.status(500).json({
      statusCode: 500,
      message: 'Erro interno do servidor.',
      error: 'Internal Server Error',
    });
  }
}
