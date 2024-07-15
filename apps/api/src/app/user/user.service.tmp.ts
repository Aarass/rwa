import { ConfigModule } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { testDatabaseTypeOrmConfig } from '../../../typeorm.config';
import { CreateUserDto } from '@rwa/shared';
import { User } from '../../entities/user';


// // jest.spyOn(userService, 'getAllUsers').mockImplementation(() => Promise.resolve(result));
// describe('User functionality', () => {
//   let userController: UserController;
//   let userService: UserService;
//
//   // beforeEach(async () => {
//   beforeAll(async () => {
//     const moduleRef = await Test.createTestingModule({
//       imports: [
//         TypeOrmModule.forFeature([User]),
//         ConfigModule.forRoot({ isGlobal: true }),
//         TypeOrmModule.forRoot(testDatabaseTypeOrmConfig),
//       ],
//       controllers: [UserController],
//       providers: [UserService, JwtService],
//     }).compile();
//
//     userService = moduleRef.get<UserService>(UserService);
//     userController = moduleRef.get<UserController>(UserController);
//   });
//
//   describe('Create user', () => {
//     it('should return created user', async () => {
//       const newUser: CreateUserDto = {
//         password: 'password',
//         name: 'Aleksandar',
//         surname: 'Prokopovic',
//         city: 'Leskovac',
//         username: 'Aaras',
//         biography: '',
//         birthDate: '1999-01-08',
//         phoneNumber: '0621715606',
//       };
//
//       const result = await userController.createUser(newUser);
//       expect(result).toMatchObject({
//         id: 1,
//         name: 'Aleksandar',
//         surname: 'Prokopovic',
//         city: 'Leskovac',
//         username: 'Aaras',
//         biography: '',
//         birthDate: '1999-01-08',
//         phoneNumber: '0621715606',
//       });
//
//       console.log(result);
//     });
//   });
// });
