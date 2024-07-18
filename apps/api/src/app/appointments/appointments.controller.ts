import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateAppointmentDto, createAppointmentSchema } from '@rwa/shared';
import { ExtractUser } from '../auth/decorators/user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { ZodValidationPipe } from '../global/validation';
import { AppointmentsService } from './appointments.service';
import { User } from '../../entities/user';

@Controller('appointments')
export class AppointmentsController {
  constructor(private appointmentService: AppointmentsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @ExtractUser() user: User,
    @Body(new ZodValidationPipe(createAppointmentSchema))
    createAppointmentDto: CreateAppointmentDto
  ) {
    return await this.appointmentService.create(user.id, createAppointmentDto);
  }

  @Get()
  async findAll() {
    return await this.appointmentService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.appointmentService.findOne(id);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.appointmentService.remove(id);
  }
}
