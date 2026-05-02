import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingStatusDto } from './dto/update-booking-status.dto';
export declare class BookingsController {
    private readonly bookingsService;
    constructor(bookingsService: BookingsService);
    create(user: any, dto: CreateBookingDto): Promise<{
        user: {
            name: string;
            email: string;
            id: string;
        };
        adspace: {
            id: string;
            type: string;
            title: string;
            location: string;
            price_per_day: number;
        };
    } & {
        id: string;
        created_at: Date;
        user_id: string;
        adspace_id: string;
        start_date: Date;
        end_date: Date;
        status: import(".prisma/client").$Enums.BookingStatus;
    }>;
    getUserBookings(user: any): Promise<({
        adspace: {
            id: string;
            type: string;
            title: string;
            location: string;
            price_per_day: number;
        };
    } & {
        id: string;
        created_at: Date;
        user_id: string;
        adspace_id: string;
        start_date: Date;
        end_date: Date;
        status: import(".prisma/client").$Enums.BookingStatus;
    })[]>;
    getAllBookings(page?: string, limit?: string): Promise<{
        data: ({
            user: {
                name: string;
                email: string;
                id: string;
            };
            adspace: {
                id: string;
                type: string;
                title: string;
                location: string;
                price_per_day: number;
            };
        } & {
            id: string;
            created_at: Date;
            user_id: string;
            adspace_id: string;
            start_date: Date;
            end_date: Date;
            status: import(".prisma/client").$Enums.BookingStatus;
        })[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    updateStatus(id: string, user: any, dto: UpdateBookingStatusDto): Promise<{
        user: {
            name: string;
            email: string;
            id: string;
        };
        adspace: {
            id: string;
            type: string;
            title: string;
            location: string;
            price_per_day: number;
        };
    } & {
        id: string;
        created_at: Date;
        user_id: string;
        adspace_id: string;
        start_date: Date;
        end_date: Date;
        status: import(".prisma/client").$Enums.BookingStatus;
    }>;
}
