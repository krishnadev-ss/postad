import { IsEnum, IsNotEmpty } from 'class-validator';
import { BookingStatus } from '../../../common/enums';

export class UpdateBookingStatusDto {
  @IsEnum([BookingStatus.APPROVED, BookingStatus.REJECTED])
  @IsNotEmpty()
  status: BookingStatus.APPROVED | BookingStatus.REJECTED;
}
