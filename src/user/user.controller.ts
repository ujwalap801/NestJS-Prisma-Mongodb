import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user') // This defines the base path: http://localhost:3000/user
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get() // This maps to GET /user
  findAll() {
    return this.userService.findAllUsers();
  }

  @Get(':email') // This maps to GET /user/test@test.com
  findOne(@Param('email') email: string) {
    return this.userService.findUserByEmail(email);
  }
}
