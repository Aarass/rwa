import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from '@rwa/shared';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { User } from '@rwa/entities';
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
    });

    return user;
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

  async setUserRefreshToken(userId: number, refreshToken: string) {
    const user = await this.getUserById(userId);

    if (user == null) {
      console.error('User not found');
      return new NotFoundException();
    }

    user.refreshTokenHash = await bcrypt.hash(refreshToken, 10);
    await this.userRepository.update(userId, user);
    // const updatedUser = await this.userRepository.save(user);
  }

  async createUser(newUser: CreateUserDto) {
    await this.locationService.checkLocation(newUser.locationId);

    let user: User = this.userRepository.create({
      ...newUser,
      roles: ['user'],
      passwordHash: await bcrypt.hash(newUser.password, 10),
    });

    await this.userRepository.insert(user);

    return user;
  }

  async deleteUserById(id: number) {
    await this.userRepository.delete(id);
  }
}
