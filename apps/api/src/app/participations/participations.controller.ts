import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { User } from '@rwa/entities';
import { CreateParticipationDto, createParticipationSchema } from '@rwa/shared';
import { AppointmentsService } from '../appointments/appointments.service';
import { Public } from '../auth/decorators/public.decorator';
import { ExtractUser } from '../auth/decorators/user.decorator';
import { ZodValidationPipe } from '../global/validation';
import { UpsService } from '../ups/ups.service';
import { ParticipationsService } from './participations.service';

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

    // if (appointment.missingPlayers == appointment.participants.length) {
    //   throw new ForbiddenException('Appointment is full');
    // }

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
      const participation = await this.participationsService.create(
        user.id,
        createParticipationDto
      );
      if (participation == null) {
        throw new InternalServerErrorException('Unexpected error');
      }
      return await this.participationsService.findOne(participation.id);
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

  @Get('user/me')
  async findMy(@ExtractUser() user: User) {
    return await this.participationsService.findMy(user.id);
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

  // @Delete('appointment/:appointmentId')
  // async removeByAppointmentId(
  //   @ExtractUser() user: User,
  //   @Param('appointmentId', ParseIntPipe) appointmentId: number
  // ) {
  //   const participation = await this.participationsService.findOneWithoutId(
  //     appointmentId,
  //     user.id
  //   );

  //   if (participation == null) {
  //     throw new NotFoundException('Participation not found');
  //   }

  //   if (participation.userId != user.id) {
  //     throw new ForbiddenException(`Can't delete others participation`);
  //   }

  //   await this.participationsService.remove(participation.id);
  // }
}
