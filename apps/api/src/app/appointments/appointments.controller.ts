import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  AppointmentFilters,
  CreateAppointmentDto,
  createAppointmentSchema,
  UpdateAppointmentDto,
  updateAppointmentSchema,
} from '@rwa/shared';
import { User } from '../../entities/user';
import { ExtractUser } from '../auth/decorators/user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { ZodValidationPipe } from '../global/validation';
import { AppointmentsService } from './appointments.service';
import { OK } from 'zod';
import { use } from 'passport';

@Controller('appointments')
export class AppointmentsController {
  constructor(private appointmentService: AppointmentsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @ExtractUser() user: User,
    @Body()
    createAppointmentDto: CreateAppointmentDto
  ) {
    console.log('Tu sam');
    console.log(user);
    return await this.appointmentService.create(user.id, createAppointmentDto);
  }

  @Post(':id/cancel')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async cancel(@ExtractUser() user: User, @Param('id') id: number) {
    const appointment = await this.appointmentService.findOne(id);

    if (appointment == null) {
      throw new NotFoundException();
    }

    if (appointment.organizerId != user.id) {
      throw new ForbiddenException();
    }

    await this.appointmentService.cancel(id);
  }

  @Get()
  async find(@Query() filters: AppointmentFilters) {
    return await this.appointmentService.findWithFilters(filters);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.appointmentService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @ExtractUser() user: User,
    @Param('id') id: number,
    @Body(new ZodValidationPipe(updateAppointmentSchema))
    updateAppointmentDto: UpdateAppointmentDto
  ) {
    if (Object.keys(updateAppointmentDto).length === 0) {
      throw new BadRequestException();
    }

    const appointment = await this.appointmentService.findOne(id);

    if (appointment == null) {
      throw new NotFoundException();
    }

    if (appointment.organizerId != user.id) {
      throw new ForbiddenException();
    }

    if (
      Object.keys(updateAppointmentDto).every(
        (key) =>
          (updateAppointmentDto as any)[key] === (appointment as any)[key]
      )
    ) {
      console.log('Nema potrebe za update');
      return;
    }

    await this.appointmentService.update(id, updateAppointmentDto);
  }

  // Korisnik ce moci samo da otkaze termin, ne i da ga u potpunosti obrise
  // @Delete(':id')
  // async remove(@Param('id', ParseIntPipe) id: number) {
  //   return await this.appointmentService.remove(id);
  // }
}
