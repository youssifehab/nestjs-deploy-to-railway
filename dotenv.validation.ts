import { plainToInstance, Transform, Type } from 'class-transformer';
import { IsEnum, IsNumber, IsString, validateSync } from 'class-validator';

enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
  Provision = 'provision',
}

class EnvironmentVariables {
  @IsEnum(Environment)
  @Transform(({ value }) => value?.trim())
  NODE_ENV: Environment;

  @Type(() => Number)
  @IsNumber({}, { message: 'PORT must be a number' })
  PORT: number;

  @Transform(({ value }) => value?.trim())
  @IsString({ message: 'SECRET must be a string' })
  SECRET: string;

  @Transform(({ value }) => value?.trim())
  @IsString({ message: 'DB_HOST must be a string' })
  DB_HOST: string;

  @Type(() => Number)
  @IsNumber({}, { message: 'DB_PORT must be a number' })
  DB_PORT: number;

  @Transform(({ value }) => value?.trim())
  @IsString({ message: 'DB_USERNAME must be a string' })
  DB_USERNAME: string;

  @Transform(({ value }) => value?.trim())
  @IsString({ message: 'DB_PASSWORD must be a string' })
  DB_PASSWORD: string;

  @Transform(({ value }) => value?.trim())
  @IsString({ message: 'DB_NAME must be a string' })
  DB_NAME: string;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    console.error(JSON.stringify(errors, null, 2));
    throw new Error('Config validation failed. See error output above.');
  }

  return validatedConfig;
}
