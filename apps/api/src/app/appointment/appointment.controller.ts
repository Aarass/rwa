import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CreateAppointmentDto, createAppointmentSchema } from '@rwa/shared';
import { ExtractUser } from '../auth/decorators/user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { ZodValidationPipe } from '../global/validation';
import { AppointmentService } from './appointment.service';
import { User } from '../../entities/user';

@Controller('appointment')
export class AppointmentController {
  constructor(private appointmentService: AppointmentService) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  async createAppointment(@ExtractUser() user: User, @Body(new ZodValidationPipe(createAppointmentSchema)) createAppointmentDto: CreateAppointmentDto) {
    return await this.appointmentService.createAppointment(user.id, createAppointmentDto)
  }
}
