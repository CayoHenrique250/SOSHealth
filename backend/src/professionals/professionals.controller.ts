import { Controller, Get, Post, Put, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ProfessionalsService } from './professionals.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('professionals')
@Controller('professionals')
export class ProfessionalsController {
  constructor(private readonly professionalsService: ProfessionalsService) {}

  @Get()
  findAll(
    @Query('specialty') specialty?: string,
    @Query('location') location?: string,
  ) {
    return this.professionalsService.findAll({ specialty, location });
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('me/calendar')
  async getOwnCalendar(
    @Request() req,
    @Query('month') monthKey?: string,
  ) {
    const userId = req.user.userId;
    const professional = await this.professionalsService.findProfessionalByUserId(userId);
    if (!professional) return [];
    const key = monthKey ?? (() => {
      const d = new Date();
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    })();
    return this.professionalsService.findAvailability(professional.id, key);
  }

  @Get(':id/calendar')
  getCalendar(
    @Param('id') id: string,
    @Query('month') monthKey?: string,
  ) {
    const key = monthKey ?? (() => {
      const d = new Date();
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    })();
    return this.professionalsService.findAvailability(id, key);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Put('availability')
  async upsertAvailability(
    @Request() req,
    @Body() body: { monthKey?: string; day?: number; time?: string; price?: number; mode?: string; date?: string; slots?: string[] },
  ) {
    const userId = req.user.userId;

    let date: string;
    let slots: string[];

    if (body.monthKey && body.day != null && body.time) {
      const [year, month] = body.monthKey.split('-');
      date = `${year}-${month}-${String(body.day).padStart(2, '0')}`;
      const slotLabel = `${body.time} - R$ ${body.price ?? 0} (${body.mode ?? 'Presencial'})`;

      const professional = await this.professionalsService.findProfessionalByUserId(userId);
      const existing = professional
        ? await this.professionalsService.findSlotsForDate(professional.id, date)
        : [];

      slots = [...existing.filter(s => s !== slotLabel), slotLabel];
    } else {
      date = body.date!;
      slots = body.slots ?? [];
    }

    return this.professionalsService.upsertAvailabilityByUserId(userId, date, slots);
  }
}
