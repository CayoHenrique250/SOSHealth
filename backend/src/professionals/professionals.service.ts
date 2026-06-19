import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProfessionalsService {
  constructor(private prisma: PrismaService) {}

  async findAll(filters?: { specialty?: string; location?: string }) {
    const professionals = await this.prisma.professional.findMany({
      include: {
        user: { select: { id: true, name: true, email: true, avatar: true, address: true } },
        curriculum: true,
        availabilities: true,
        appointments: {
          include: {
            review: true,
            patient: {
              include: { user: true }
            }
          }
        }
      },
    });

    return professionals
      .filter((p) => {
        if (filters?.specialty && p.specialty !== filters.specialty) return false;
        if (filters?.location && !p.user.address?.toLowerCase().includes(filters.location.toLowerCase())) return false;
        return true;
      })
      .map((p) => {
        const validReviews = p.appointments?.filter(a => a.review).map(a => ({ review: a.review!, patientName: a.patient.user.name })) || [];
        const reviewCount = validReviews.length;
        const rating = reviewCount > 0 ? validReviews.reduce((acc, r) => acc + r.review.rating, 0) / reviewCount : 0;

        return {
          id: p.id,
          name: p.user.name,
          specialty: p.specialty || 'Geral',
          location: p.user.address || '',
          image: p.user.avatar || null,
          rating: Number(rating.toFixed(1)),
          reviewCount,
          price: 150,
          attendanceMode: 'Presencial',
          proximityKm: 0,
          bio: p.curriculum?.summary || '',
          education: p.curriculum?.education ? [p.curriculum.education] : [],
          detailedCurriculum: p.curriculum?.experience || '',
          reviews: validReviews.map(r => ({
            id: r.review.id,
            author: r.patientName,
            rating: r.review.rating,
            comment: r.review.comment || '',
            date: new Date(r.review.createdAt).toLocaleDateString('pt-BR', { month: '2-digit', year: 'numeric' })
          })),
          councilNumber: p.councilNumber,
        };
      });
  }

  async findAvailability(professionalId: string, monthKey: string) {
    const availabilities = await this.prisma.availability.findMany({
      where: {
        professionalId,
        date: { startsWith: monthKey },
      },
    });

    return availabilities.map((a) => ({
      day: parseInt(a.date.split('-')[2]),
      status: 'available' as const,
      slots: a.slots.split(',').filter(Boolean),
    }));
  }

  async upsertAvailability(professionalId: string, date: string, slots: string[]) {
    return this.prisma.availability.upsert({
      where: { professionalId_date: { professionalId, date } },
      update: { slots: slots.join(',') },
      create: { professionalId, date, slots: slots.join(',') },
    });
  }

  async upsertAvailabilityByUserId(userId: string, date: string, slots: string[]) {
    const professional = await this.prisma.professional.findUnique({ where: { userId } });
    if (!professional) throw new Error('Profissional não encontrado');
    return this.upsertAvailability(professional.id, date, slots);
  }

  async findProfessionalByUserId(userId: string) {
    return this.prisma.professional.findUnique({ where: { userId } });
  }

  async findSlotsForDate(professionalId: string, date: string): Promise<string[]> {
    const record = await this.prisma.availability.findUnique({
      where: { professionalId_date: { professionalId: professionalId, date } },
    });
    if (!record) return [];
    return record.slots.split(',').filter(Boolean);
  }
}
