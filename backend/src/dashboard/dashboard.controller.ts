import { Controller, Get, Patch, Param, UseGuards, Request } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('dashboard')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('patient')
  getPatientDashboard(@Request() req) {
    return this.dashboardService.getPatientDashboard(req.user.userId);
  }

  @Get('professional')
  getProfessionalDashboard(@Request() req) {
    return this.dashboardService.getProfessionalDashboard(req.user.userId);
  }

  @Get('notifications')
  getNotifications(@Request() req) {
    return this.dashboardService.getNotifications(req.user.userId);
  }

  @Patch('notifications/:id/read')
  markRead(@Param('id') id: string, @Request() req) {
    return this.dashboardService.markNotificationRead(id, req.user.userId);
  }
}
