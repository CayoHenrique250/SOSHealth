import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const {
      name,
      email,
      password,
      phone,
      address,
      role,
      cpf,
      birthDate,
      councilNumber,
    } = createUserDto;

    const normalizedEmail = email.toLowerCase();

    if (role === 'PACIENTE') {
      if (!cpf || !birthDate) {
        throw new BadRequestException(
          'CPF e Data de Nascimento são obrigatórios para Pacientes.',
        );
      }
    }

    if (role === 'PROFISSIONAL') {
      if (!councilNumber || !birthDate) {
        throw new BadRequestException(
          'Número do conselho e Data de Nascimento são obrigatórios para Profissionais.',
        );
      }
    }

    if (role !== 'PACIENTE' && role !== 'PROFISSIONAL') {
      throw new BadRequestException('Tipo de usuário inválido.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    if (role === 'PACIENTE') {
      return this.prisma.user.create({
        data: {
          name,
          email: normalizedEmail,
          password: hashedPassword,
          phone,
          address,
          role,
          patient: {
            create: {
              cpf: cpf!,
              birthDate: new Date(birthDate!),
            },
          },
        },
      });
    }

    return this.prisma.user.create({
      data: {
        name,
        email: normalizedEmail,
        password: hashedPassword,
        phone,
        address,
        role,
        professional: {
          create: {
            councilNumber: councilNumber!,
            birthDate: new Date(birthDate!),
          },
        },
      },
    });
  }

  async login(loginUserDto: LoginUserDto) {
    const email = loginUserDto.email.toLowerCase();
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new UnauthorizedException('E-mail ou senha incorretos');
    }

    const passwordMatch = await bcrypt.compare(
      loginUserDto.password,
      user.password,
    );

    if (!passwordMatch) {
      throw new UnauthorizedException('E-mail ou senha incorretos');
    }

    const role =
      user.role === 'PROFISSIONAL' ? 'profissional' : 'paciente';

    const payload = { sub: user.id, email: user.email, role };
    const token = this.jwtService.sign(payload);

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role,
        avatar: user.avatar,
      },
    };
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        patient: { include: { anamnese: true } },
        professional: { include: { curriculum: true } },
      },
    });
    
    if (!user) throw new UnauthorizedException('Usuário não encontrado');
    return user;
  }

  async updateProfile(userId: string, updateData: any) {
    const { personal, medical, curriculum } = updateData;
    
    if (personal) {
      await this.prisma.user.update({
        where: { id: userId },
        data: {
          name: personal.name,
          phone: personal.phone,
          address: personal.address,
          avatar: personal.avatar,
        },
      });
    }

    const user = await this.prisma.user.findUnique({ where: { id: userId }, include: { patient: true, professional: true } });
    if (!user) throw new UnauthorizedException('Usuário não encontrado');
    
    if (user.role === 'PACIENTE' && medical) {
      if (user.patient) {
        await this.prisma.anamnese.upsert({
          where: { patientId: user.patient.id },
          update: medical,
          create: { ...medical, patientId: user.patient.id },
        });
      }
    }

    if (user.role === 'PROFISSIONAL') {
      if (personal?.specialty && user.professional) {
        await this.prisma.professional.update({
          where: { id: user.professional.id },
          data: { specialty: personal.specialty },
        });
      }

      if (curriculum && user.professional) {
        await this.prisma.curriculum.upsert({
          where: { professionalId: user.professional.id },
          update: curriculum,
          create: { ...curriculum, professionalId: user.professional.id },
        });
      }
    }

    return this.getProfile(userId);
  }

  async updateAnamnese(userId: string, updateData: any) {
    const user = await this.prisma.user.findUnique({ where: { id: userId }, include: { patient: true } });
    if (!user || user.role !== 'PACIENTE' || !user.patient) {
      throw new BadRequestException('Apenas pacientes podem atualizar a anamnese');
    }

    await this.prisma.anamnese.upsert({
      where: { patientId: user.patient.id },
      update: updateData,
      create: { ...updateData, patientId: user.patient.id },
    });

    return this.getProfile(userId);
  }
}
