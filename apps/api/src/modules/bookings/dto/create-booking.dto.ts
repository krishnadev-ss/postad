import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class CreateBookingDto {
  @IsString()
  @IsNotEmpty()
  adspace_id: string;

  @IsDateString()
  start_date: string;

  @IsDateString()
  end_date: string;
}
