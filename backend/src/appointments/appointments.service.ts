import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';

@Injectable()
export class AppointmentsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createAppointmentDto: CreateAppointmentDto) {
    const { professionalId, date, time, mode } = createAppointmentDto;

    const patient = await this.prisma.patient.findUnique({
      where: { userId },
      include: { user: { select: { name: true } } },
    });

    if (!patient) {
      throw new BadRequestException('Apenas pacientes podem agendar consultas.');
    }

    const pendingReview = await this.prisma.appointment.findFirst({
      where: { patientId: patient.id, status: 'realizada', review: null },
    });

    if (pendingReview) {
      throw new BadRequestException('Você possui uma avaliação pendente. Avalie sua última consulta antes de agendar uma nova.');
    }

    const availability = await this.prisma.availability.findUnique({
      where: { professionalId_date: { professionalId, date } },
    });

    if (!availability) {
      throw new NotFoundException('Disponibilidade não encontrada para esta data.');
    }

    const slots = availability.slots.split(',').filter(Boolean);

    const matchedSlot = slots.find((s) => s.startsWith(time));

    if (!matchedSlot) {
      throw new BadRequestException('O horário selecionado não está mais disponível.');
    }

    const remainingSlots = slots.filter((s) => s !== matchedSlot);

    const professional = await this.prisma.professional.findUnique({
      where: { id: professionalId },
      include: { user: { select: { id: true } } },
    });

    const [appointment] = await this.prisma.$transaction([
      this.prisma.appointment.create({
        data: {
          patientId: patient.id,
          professionalId,
          date,
          time,
          mode,
          status: 'confirmada',
        },
      }),
      this.prisma.availability.update({
        where: { id: availability.id },
        data: { slots: remainingSlots.join(',') },
      }),
      ...(professional
        ? [
            this.prisma.notification.create({
              data: {
                userId: professional.user.id,
                title: 'Nova consulta agendada',
                description: `${patient.user.name} agendou uma consulta para ${date} às ${time} (${mode}).`,
                href: '/profissional/dashboard',
              },
            }),
          ]
        : []),
    ]);

    return appointment;
  }

  async submitReview(userId: string, appointmentId: string, rating: number, comment?: string) {
    
    const appointment = await this.prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: { patient: true, review: true },
    });

    if (!appointment) throw new NotFoundException('Consulta não encontrada.');

    if (appointment.patient.userId !== userId) {
      throw new ForbiddenException('Você não pode avaliar esta consulta.');
    }

    if (appointment.review) {
      throw new BadRequestException('Esta consulta já foi avaliada.');
    }

    if (appointment.status !== 'realizada') {
      await this.prisma.appointment.update({
        where: { id: appointmentId },
        data: { status: 'realizada' },
      });
    }

    return this.prisma.review.create({
      data: { appointmentId, rating, comment },
    });
  }
}
