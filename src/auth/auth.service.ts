import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthResponseDto } from './auth.dto';
import { compareSync } from 'bcrypt';

@Injectable()
export class AuthService {
  private jwtExpirationTimeInSeconds: number;

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.jwtExpirationTimeInSeconds = +this.configService.get(
      'JWT_EXPIRATION_TIME',
    );
  }

  signIn(email: string, password: string): AuthResponseDto {
    const user = this.usersService.findByEmail(email);

    if (!user) {
      throw new HttpException('Invalid credentials', HttpStatus.CONFLICT);
    }

    const passwordMatch = compareSync(password, user.password);

    if (!passwordMatch) {
      throw new HttpException('Invalid credentials', HttpStatus.CONFLICT);
    }

    const payload = { sub: user.id, email: user.email, role: user.role };

    const token = this.jwtService.sign(payload);

    return {
      token,
      expiresIn: this.jwtExpirationTimeInSeconds,
    };
  }
}
