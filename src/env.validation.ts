import { plainToInstance } from 'class-transformer';
import {
  IsDefined,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  validateSync
} from 'class-validator';

class EnviromentVariables {
  @IsNumber()
  PORT: number;

  @IsNotEmpty()
  DATABASE_HOST: string;

  @IsNumber()
  @IsDefined()
  DATABASE_PORT: number;

  @IsNotEmpty()
  DATABASE_USER: string;

  @IsNotEmpty()
  DATABASE_PASSWORD: string;

  @IsNotEmpty()
  DATABASE_NAME: string;

  @IsNotEmpty()
  JWT_SECRET: string;

  @IsPositive()
  @IsNumber()
  @IsDefined()
  DAILY_FINE: number;

  @IsPositive()
  @IsInt()
  @IsDefined()
  MAX_BORROWED_BOOKS_BY_USER: number;

  @IsPositive()
  @IsInt()
  @IsDefined()
  MAX_BORROWING_DURATION_DAYS: number;

  @IsPositive()
  @IsInt()
  @IsDefined()
  MAX_RESERVES_BY_USER: number;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnviromentVariables, config, {
    enableImplicitConversion: true
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return validatedConfig;
}
