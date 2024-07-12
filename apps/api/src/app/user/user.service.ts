import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from '@rwa/shared';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { User } from '../models/user';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>
  ) { }

  async getUserById(id: number) {
    const user: User | null = await this.userRepository.findOne({
      where: {
        id: id,
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

    return true;
  }

  async createUser(newUser: CreateUserDto) {
    let user: User = this.userRepository.create({
      ...newUser,
      passwordHash: await bcrypt.hash(newUser.password, 10),
    });

    await this.userRepository.insert(user);

    return user;
  }

  async deleteUserById(id: number) {
    await this.userRepository.delete(id);
  }
}
