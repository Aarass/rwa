import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  AppointmentFilters,
  appointmentFiltersSchema,
  CreateAppointmentDto,
  createAppointmentSchema,
  FindAppointmentsDto,
  findAppointmentsSchema,
  UpdateAppointmentDto,
  updateAppointmentSchema,
} from '@rwa/shared';
import { User } from '../../entities/user';
import { Public } from '../auth/decorators/public.decorator';
import { ExtractUser } from '../auth/decorators/user.decorator';
import { ZodValidationPipe } from '../global/validation';
import { AppointmentsService } from './appointments.service';
import '../global/typeorm.extension';

@Controller('appointments')
export class AppointmentsController {
  constructor(private appointmentService: AppointmentsService) {}

  @Post()
  async create(
    @ExtractUser() user: User,
    @Body(new ZodValidationPipe(createAppointmentSchema))
    createAppointmentDto: CreateAppointmentDto
  ) {
    return await this.appointmentService.create(user.id, createAppointmentDto);
  }

  @Post(':id/cancel')
  @HttpCode(200)
  async cancel(@ExtractUser() user: User, @Param('id') id: number) {
    const appointment = await this.appointmentService.findOne(id);

    if (appointment == null) {
      throw new NotFoundException('The appointment does not exist');
    }

    if (appointment.organizerId != user.id) {
      throw new ForbiddenException(`Can't cancel others appointments`);
    }

    await this.appointmentService.cancel(id);
  }

  @Public()
  @Get()
  async find(
    @Body(new ZodValidationPipe(findAppointmentsSchema))
    criteria: FindAppointmentsDto
  ) {
    return await this.appointmentService.findAll(
      criteria.filters ?? {},
      criteria.ordering,
      criteria.userLocation
    );
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.appointmentService.findOne(id);
  }

  @Patch(':id')
  async update(
    @ExtractUser() user: User,
    @Param('id') id: number,
    @Body(new ZodValidationPipe(updateAppointmentSchema))
    updateAppointmentDto: UpdateAppointmentDto
  ) {
    if (Object.keys(updateAppointmentDto).length === 0) {
      throw new BadRequestException('There is nothing to update');
    }

    const appointment = await this.appointmentService.findOne(id);

    if (appointment == null) {
      throw new NotFoundException(`Appointment does not exist`);
    }

    if (appointment.organizerId != user.id) {
      throw new ForbiddenException(`Can't update others appointment`);
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
