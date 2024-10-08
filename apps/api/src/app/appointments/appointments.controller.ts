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
} from '@nestjs/common';
import {
  CreateAppointmentDto,
  createAppointmentSchema,
  FindAppointmentsDto,
  findAppointmentsSchema,
  TokenUser,
  UpdateAppointmentDto,
  updateAppointmentSchema,
} from '@rwa/shared';
import { Public } from '../auth/decorators/public.decorator';
import { ExtractUser } from '../auth/decorators/user.decorator';
import '../global/typeorm.extension';
import { ZodValidationPipe } from '../global/validation';
import { AppointmentsService } from './appointments.service';
import { Appointment } from '@rwa/entities';

@Controller('appointments')
export class AppointmentsController {
  constructor(private appointmentService: AppointmentsService) {}

  @Post()
  async create(
    @ExtractUser() user: TokenUser,
    @Body(new ZodValidationPipe(createAppointmentSchema))
    createAppointmentDto: CreateAppointmentDto
  ) {
    return await this.appointmentService.create(user.id, createAppointmentDto);
  }

  @Post(':id/cancel')
  @HttpCode(200)
  async cancel(@ExtractUser() user: TokenUser, @Param('id') id: number) {
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
  @Post('search')
  @HttpCode(200)
  async find(
    @Body(new ZodValidationPipe(findAppointmentsSchema))
    criteria: FindAppointmentsDto
  ) {
    return await this.appointmentService.findAll(criteria);
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.appointmentService.findOne(id);
  }

  @Patch(':id')
  async update(
    @ExtractUser() user: TokenUser,
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
          updateAppointmentDto[key as keyof UpdateAppointmentDto] ===
          appointment[key as keyof Appointment]
      )
    ) {
      console.log('Nema potrebe za update');
      return;
    }

    await this.appointmentService.update(id, updateAppointmentDto);
    return await this.appointmentService.findOne(id);
  }

  // Korisnik ce moci samo da otkaze termin, ne i da ga u potpunosti obrise
  // @Delete(':id')
  // async remove(@Param('id', ParseIntPipe) id: number) {
  //   return await this.appointmentService.remove(id);
  // }
}
