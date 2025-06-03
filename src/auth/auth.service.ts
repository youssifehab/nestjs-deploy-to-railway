import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDTO } from './dto/login-dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { ArtistsService } from 'src/artists/artists.service';
import { Enable2FAType, Payload } from './types';
import * as speakeasy from 'speakeasy';
import { UpdateResult } from 'typeorm';
import { User } from 'src/users/user.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private artistService: ArtistsService,
    private configService: ConfigService,
  ) {}

  async login(
    loginDTO: LoginDTO,
  ): Promise<
    { accessToken: string } | { validate2FA: string; message: string }
  > {
    const user = await this.userService.findOne(loginDTO);
    const passwordMatched = await bcrypt.compare(
      loginDTO.password,
      user.password,
    );
    if (!passwordMatched) {
      throw new UnauthorizedException('Email or Password is wrong');
    }
    const payload: Payload = { email: user.email, userId: user.id };

    const artist = await this.artistService.findArtist(user.id);
    if (artist) {
      payload.artistId = artist.id;
    }

    if (user.enable2FA && user.twoFASecret) {
      return {
        validate2FA: 'http://localhost:3001/auth/validate-2fa',
        message:
          'Please send the one time password/token from your Google Authenticator app',
      };
    }

    return { accessToken: this.jwtService.sign(payload) };
  }

  async enable2FA(userId: number): Promise<Enable2FAType> {
    const user = await this.userService.findById(userId);
    if (user.enable2FA) {
      return { secret: user.twoFASecret };
    }
    const secret = speakeasy.generateSecret();
    console.log(secret);
    user.twoFASecret = secret.base32;
    await this.userService.updateSecretKey(user.id, user.twoFASecret);
    return { secret: user.twoFASecret };
  }

  async validate2FAToken(
    userId: number,
    token: string,
  ): Promise<{ verified: boolean }> {
    try {
      const user = await this.userService.findById(userId);

      const verified = speakeasy.totp.verify({
        secret: user.twoFASecret,
        token,
        encoding: 'base32',
      });

      if (verified) {
        return { verified: true };
      }
      return { verified: false };
    } catch (err) {
      throw new UnauthorizedException('Error verifying token');
    }
  }

  async disable2FA(userId: number): Promise<UpdateResult> {
    return this.userService.disable2FA(userId);
  }

  async validateUserByApiKey(apiKey: string): Promise<User> {
    const user = this.userService.findUserByApiKey(apiKey);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }

  getEnvVariable() {
    return this.configService.get<number>('port');
  }
}
