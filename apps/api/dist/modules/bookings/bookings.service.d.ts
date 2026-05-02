import { PrismaService } from '../../database/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingStatusDto } from './dto/update-booking-status.dto';
export declare class BookingsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(userId: string, dto: CreateBookingDto): Promise<{
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
    findByUser(userId: string): Promise<({
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
    findAll(page?: number, limit?: number): Promise<{
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
    updateStatus(id: string, adminId: string, dto: UpdateBookingStatusDto): Promise<{
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
