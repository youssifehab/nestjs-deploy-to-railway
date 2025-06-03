import { plainToInstance } from 'class-transformer';
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

  @IsNumber()
  PORT: number;

  @IsNumber()
  DB_PORT: number;

  @IsString()
  DB_HOST: string;

  @IsString()
  USERNAME: string;

  @IsString()
  PASSWORD: string;

  @IsString()
  DB_NAME: string;

  @IsString()
  SECRET: string;
}

export function validate(config: Record<string, unknown>) {
  const cleanedConfig = cleanEnv(config);

  // console.log('config ', config);
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  // console.log(validatedConfig);

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}

function cleanEnv(config: Record<string, unknown>) {
  const cleaned = { ...config };

  for (const key in cleaned) {
    const value = cleaned[key];
    if (typeof value === 'string') {
      // Strip surrounding quotes
      cleaned[key] = value.replace(/^"(.*)"$/, '$1');
    }
  }

  return cleaned;
}
