import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user-dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository, UpdateResult } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { LoginDTO } from 'src/auth/dto/login-dto';
import { v4 as uuid4 } from 'uuid';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  async create(userDto: CreateUserDTO): Promise<Partial<User>> {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(userDto.password, salt);

    const user = this.userRepo.create({
      ...userDto,
      password: hashedPassword,
      apiKey: uuid4(),
    });
    const savedUser = await this.userRepo.save(user);

    const { password, ...rest } = savedUser;
    return rest;
  }

  async findOne(data: LoginDTO): Promise<User> {
    const user = await this.userRepo.findOneBy({ email: data.email });
    if (!user) {
      throw new UnauthorizedException('Email or Password is wrong');
    }
    return user;
  }

  async findById(id: number): Promise<User> {
    return await this.userRepo.findOneBy({ id });
  }

  async updateSecretKey(id: number, secret: string): Promise<UpdateResult> {
    return await this.userRepo.update(
      { id },
      { twoFASecret: secret, enable2FA: true },
    );
  }

  async disable2FA(userId: number): Promise<UpdateResult> {
    return this.userRepo.update(
      { id: userId },
      { enable2FA: false, twoFASecret: null },
    );
  }

  async findUserByApiKey(apiKey: string): Promise<User> {
    const user = await this.userRepo.findOneBy({ apiKey });
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
