import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserDto } from './users.dto';
import { randomUUID } from 'crypto';
import { hashSync } from 'bcrypt';

@Injectable()
export class UsersService {
  private readonly users: UserDto[] = [];

  create(user: UserDto) {
    const userExists = this.findByEmail(user.email);

    if (userExists) {
      throw new HttpException('User already exists', HttpStatus.CONFLICT);
    }

    this.users.push({
      ...user,
      id: randomUUID(),
      password: hashSync(user.password, 6),
      role: 'user',
    });
  }

  findByEmail(email: string) {
    return this.users.find((user) => user.email === email);
  }
}
