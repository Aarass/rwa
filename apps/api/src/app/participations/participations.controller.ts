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
import { User } from '@rwa/entities';
import { ExtractUser } from '../auth/decorators/user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { ParticipationsService } from './participations.service';
import { AppointmentsService } from '../appointments/appointments.service';
import { ZodValidationPipe } from '../global/validation';
import { Public } from '../auth/decorators/public.decorator';
import { UpsService } from '../ups/ups.service';

@Controller('participations')
export class ParticipationsController {
  constructor(
    private participationsService: ParticipationsService,
    private appointmentService: AppointmentsService,
    private upsService: UpsService
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
      throw new NotFoundException('Appointment does not exist');
    }

    if (appointment.canceled) {
      throw new ForbiddenException(`Can't register for a canceled appointment`);
    }

    if (appointment.missingPlayers == appointment.participants.length) {
      throw new ForbiddenException('Appointment is full');
    }

    const userAge = Math.abs(
      new Date(
        Date.now() - new Date(user.birthDate).getTime()
      ).getUTCFullYear() - 1970
    );

    if (userAge < appointment.minAge || userAge > appointment.maxAge) {
      throw new ForbiddenException(
        'User is outside the age range for this appointment'
      );
    }

    const ups = await this.upsService.getUserSport(
      user.id,
      appointment.sportId
    );

    if (ups == null) {
      throw new ForbiddenException('User does not play that sport');
    }

    const userSkillLevel = ups.selfRatedSkillLevel;
    if (
      userSkillLevel < appointment.minSkillLevel ||
      userSkillLevel > appointment.maxSkillLevel
    ) {
      throw new ForbiddenException(
        'User is outside the skill range for this appointment'
      );
    }

    try {
      return await this.participationsService.create(
        user.id,
        createParticipationDto
      );
    } catch (err: any) {
      if (err.code != undefined && err.code == 23505) {
        console.error('unique_key_violation');
        throw new ForbiddenException(
          `Can't register for the same appointment more than once`
        );
      }
      throw new ForbiddenException('Unknown error');
    }
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
      throw new NotFoundException('Participation not found');
    }

    if (participation.userId != user.id) {
      throw new ForbiddenException(`Can't edit others participation`);
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
      throw new NotFoundException('Participation not found');
    }

    if (participation.appointment.organizerId != user.id) {
      throw new ForbiddenException(
        `User is not the organizer of the appointment`
      );
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
      throw new NotFoundException('Participation not found');
    }

    if (participation.userId != user.id) {
      throw new ForbiddenException(`Can't delete others participation`);
    }

    await this.participationsService.remove(id);
  }
}
