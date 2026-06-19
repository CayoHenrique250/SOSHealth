import { Controller, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

class CreateReviewDto {
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @IsString()
  @IsOptional()
  comment?: string;
}

@ApiTags('appointments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  @ApiOperation({ summary: 'Criar agendamento (Consome vaga na agenda)' })
  @ApiResponse({ status: 201, description: 'Agendamento criado e horário removido da disponibilidade.' })
  create(@Request() req, @Body() createAppointmentDto: CreateAppointmentDto) {
    return this.appointmentsService.create(req.user.userId, createAppointmentDto);
  }

  @Post(':id/review')
  @ApiOperation({ summary: 'Avaliar consulta realizada' })
  submitReview(
    @Request() req,
    @Param('id') appointmentId: string,
    @Body() body: CreateReviewDto,
  ) {
    return this.appointmentsService.submitReview(req.user.userId, appointmentId, body.rating, body.comment);
  }
}
