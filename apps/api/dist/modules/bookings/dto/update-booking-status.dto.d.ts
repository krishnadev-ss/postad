import { BookingStatus } from '../../../common/enums';
export declare class UpdateBookingStatusDto {
    status: BookingStatus.APPROVED | BookingStatus.REJECTED;
}
