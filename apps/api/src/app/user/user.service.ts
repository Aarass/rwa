import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './interfaces/user';
import { Repository } from 'typeorm';
import { NewUserDto } from '@rwa/shared';

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

  getAllUsers() {
    return this.userRepository.find();
  }

  createUser(newUser: NewUserDto) {
    let user: User = this.userRepository.create(newUser);
    this.userRepository.save(user);
  }

  async deleteUserById(id: number) {
    await this.userRepository.delete(id);
  }
}
