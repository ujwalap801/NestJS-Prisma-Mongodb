import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signUp(email: string, pass: string) {
    const hashedPassword = await bcrypt.hash(pass, 10);
    return this.userService.createUser({
      email,
      name: email.split('@')[0],
      password: hashedPassword,
    });
  }

  async signIn(email: string, pass: string) {
    const user = await this.userService.findUserByEmail(email);
    if (!user) throw new UnauthorizedException();

    // Verify password with bcrypt
    const isPasswordValid = await bcrypt.compare(pass, user.password);
    if (!isPasswordValid) throw new UnauthorizedException();

    const payload = { sub: user.id, email: user.email };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
