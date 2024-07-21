import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  NotFoundException,
  NotImplementedException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateParticipationDto, createParticipationSchema } from '@rwa/shared';
import { User } from '../../entities/user';
import { ExtractUser } from '../auth/decorators/user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { ParticipationsService } from './participations.service';
import { AppointmentsService } from '../appointments/appointments.service';
import { ZodValidationPipe } from '../global/validation';
import { Public } from '../auth/decorators/public.decorator';

@Controller('participations')
export class ParticipationsController {
  constructor(
    private participationsService: ParticipationsService,
    private appointmentService: AppointmentsService
  ) {}

  @Post()
  async create(
    @ExtractUser() user: User,
    @Body(new ZodValidationPipe(createParticipationSchema))
    createParticipationDto: CreateParticipationDto
  ) {
    const appointment = await this.appointmentService.findOne(
      createParticipationDto.appointmentId
    );

    if (appointment == null) {
      throw new BadRequestException();
    }

    if (appointment.missingPlayers == appointment.participants.length) {
      console.log('Termin je popunjen');
      throw new ForbiddenException();
    }

    return await this.participationsService.create(
      user.id,
      createParticipationDto
    );
  }

  @Public()
  @Get()
  async findAll() {
    return await this.participationsService.findAll();
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.participationsService.findOne(id);
  }

  @Patch(':id/seen')
  async markSeen(
    @ExtractUser() user: User,
    @Param('id', ParseIntPipe) id: number
  ) {
    const participation = await this.participationsService.findOne(id);

    if (participation == null) {
      throw new NotFoundException();
    }

    if (participation.userId != user.id) {
      throw new ForbiddenException();
    }

    await this.participationsService.markSeen(id);
  }

  @Patch(':id/reject')
  async reject(
    @ExtractUser() user: User,
    @Param('id', ParseIntPipe) id: number
  ) {
    const participation = await this.participationsService.findOne(id);

    if (participation == null) {
      throw new NotFoundException();
    }

    if (participation.appointment.organizerId != user.id) {
      throw new ForbiddenException();
    }

    await this.participationsService.reject(id);
  }

  @Delete(':id')
  async remove(
    @ExtractUser() user: User,
    @Param('id', ParseIntPipe) id: number
  ) {
    const participation = await this.participationsService.findOne(id);

    if (participation == null) {
      throw new NotFoundException();
    }

    if (participation.userId != user.id) {
      throw new ForbiddenException();
    }

    await this.participationsService.remove(id);
  }
}
