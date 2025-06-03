import { plainToInstance, Type } from 'class-transformer';
import { IsEnum, IsNumber, IsString, validateSync } from 'class-validator';

enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
  Provision = 'provision',
}

class EnvironmentVariables {
  @IsEnum(Environment)
  NODE_ENV: Environment;

  @Type(() => Number)
  @IsNumber()
  PORT: number;

  @IsString()
  SECRET: string;

  @IsString()
  DB_HOST: string;

  @Type(() => Number)
  @IsNumber()
  DB_PORT: number;

  @IsString()
  DB_USERNAME: string;

  @IsString()
  DB_PASSWORD: string;

  @IsString()
  DB_NAME: string;
}

// 🚨 This strips double quotes from env values like `"5432"` → `5432`
function cleanEnv(config: Record<string, unknown>) {
  const cleaned: Record<string, unknown> = {};
  for (const key in config) {
    const value = config[key];
    if (typeof value === 'string') {
      cleaned[key] = value.replace(/^"(.*)"$/, '$1');
    } else {
      cleaned[key] = value;
    }
  }
  return cleaned;
}

export function validate(config: Record<string, unknown>) {
  const cleanedConfig = cleanEnv(config);

  const validatedConfig = plainToInstance(EnvironmentVariables, cleanedConfig, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return validatedConfig;
}
