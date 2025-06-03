import {
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
  Get,
  Patch,
} from '@nestjs/common';
import { CreateUserDTO } from 'src/users/dto/create-user-dto';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { LoginDTO } from './dto/login-dto';
import { JwtAuthGuard } from './guards/jwt.guard';
import { Enable2FAType } from './types';
import { ValidateTokenDTO } from './dto/validate-token-dto';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { User } from 'src/users/user.entity';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UsersService,
  ) {}

  @Post('signup')
  @ApiOperation({ summary: 'Register new user' })
  @ApiResponse({
    status: 201,
    description: 'It will return the user in the response',
  })
  signup(@Body() userDTO: CreateUserDTO) {
    return this.userService.create(userDTO);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({
    status: 200,
    description: 'It will give you access-token in the response',
  })
  login(@Body() loginDTO: LoginDTO) {
    return this.authService.login(loginDTO);
  }

  @Get('enable-2fa')
  @UseGuards(JwtAuthGuard)
  enable2FA(@Request() req): Promise<Enable2FAType> {
    return this.authService.enable2FA(req.user.userId);
  }

  @Post('validate-2fa')
  @UseGuards(JwtAuthGuard)
  validate2FA(@Request() req, @Body() validateTokenDTO: ValidateTokenDTO) {
    return this.authService.validate2FAToken(
      req.user.userId,
      validateTokenDTO.token,
    );
  }

  @Patch('disable-2fa')
  @UseGuards(JwtAuthGuard)
  disable2FA(@Request() req) {
    return this.authService.disable2FA(req.user.userId);
  }

  @ApiBearerAuth('JWT-auth')
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@Request() req) {
    const { password, ...rest } = req.user;
    return { msg: 'Authorized with api key', user: rest };
  }

  @Get('port')
  getPort() {
    return this.authService.getEnvVariable();
  }
}
