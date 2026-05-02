import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateAdSpaceDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  location: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  latitude?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  longitude?: number;

  @IsString()
  @IsNotEmpty()
  type: string;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  price_per_day: number;

  @IsOptional()
  @IsBoolean()
  is_available?: boolean;
}
