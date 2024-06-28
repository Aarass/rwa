import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './models/user';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '@rwa/shared';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>
  ) {}

  getUserById(id: number) {
    return this.userRepository.findOne({
      where: {
        id: id,
      },
    });
  }

  getUserByUsername(username: string) {
    return this.userRepository.findOne({
      where: {
        username: username,
      },
    });
  }

  getAllUsers() {
    return this.userRepository.find();
  }

  async createUser(newUser: CreateUserDto) {
    let user: User = this.userRepository.create({
      username: newUser.username,
      passwordHash: await bcrypt.hash(newUser.password, 10),
      name: newUser.name,
      surname: newUser.surname,
    });
    this.userRepository.save(user);
  }

  async deleteUserById(id: number) {
    await this.userRepository.delete(id);
  }
}
