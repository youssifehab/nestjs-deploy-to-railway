import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDTO {
  @ApiProperty({
    example: 'John',
    description: 'provide the firstName of the user',
  })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({
    example: 'Snow',
    description: 'provide the lastName of the user',
  })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({
    example: 'john@gmail.com',
    description: 'provide the email of the user',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: '123345',
    description: 'provide the password of the user',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
