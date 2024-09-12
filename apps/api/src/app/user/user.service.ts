import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@rwa/entities';
import { CreateUserDto } from '@rwa/shared';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { LocationsService } from '../locations/locations.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private locationService: LocationsService
  ) {}

  async getUserById(id: number) {
    const user: User | null = await this.userRepository.findOne({
      where: {
        id,
      },
      relations: ['location'],
    });

    return user;
  }

  async getUserStats(id: number) {
    return await this.userRepository.query(
      `SELECT
       (SELECT COUNT(*)::int FROM appointment WHERE appointment.canceled = false AND appointment."organizerId" = ${id}) as "organizedAppointments",
       (SELECT COALESCE(MAX("count"), 0)::int FROM (SELECT COUNT(*) FROM appointment WHERE appointment.canceled = false GROUP BY appointment."organizerId")) as "maxOrganizedAppointments",
       (SELECT COUNT(*)::int FROM participation WHERE participation."userId" = ${id} AND participation.approved = true) as "participatedAppointments",
       (SELECT COALESCE(MAX("count"), 0)::int FROM (SELECT COUNT(*) FROM participation WHERE participation.approved = true GROUP BY participation."userId")) as "maxParticipations"`
    );
  }

  async getUserByUsername(username: string) {
    const user: User | null = await this.userRepository.findOne({
      where: {
        username: username,
      },
    });

    return user;
  }

  async getAllUsers() {
    const users: User[] = await this.userRepository.find();

    return users;
  }

  async setUserProfileImage(userId: number, imageName: string | null) {
    await this.userRepository.update(userId, {
      imageName,
    });
  }

  async setUserRefreshToken(userId: number, refreshToken: string) {
    const user = await this.getUserById(userId);

    if (user == null) {
      console.error('User not found');
      return new NotFoundException();
    }

    user.refreshTokenHash = await bcrypt.hash(refreshToken, 10);
    await this.userRepository.update(userId, user);
  }

  async createUser(newUser: CreateUserDto) {
    await this.locationService.checkLocation(newUser.locationId);

    const user: User = this.userRepository.create({
      ...newUser,
      roles: ['user'],
      passwordHash: await bcrypt.hash(newUser.password, 10),
    });

    try {
      await this.userRepository.insert(user);
    } catch (err) {
      if ((err as Error & { code: string }).code === '23505') {
        throw new ConflictException('Username is taken');
      }
    }

    return user;
  }

  async deleteUserById(id: number) {
    await this.userRepository.delete(id);
  }
}
