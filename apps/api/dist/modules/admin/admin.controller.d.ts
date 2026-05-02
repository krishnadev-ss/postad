import { AdminService } from './admin.service';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    getDashboard(): Promise<{
        stats: {
            total_users: number;
            total_providers: number;
            total_adspaces: number;
            total_bookings: number;
            pending_bookings: number;
            approved_bookings: number;
            rejected_bookings: number;
            approved_revenue: number;
        };
        recent_bookings: ({
            user: {
                name: string;
                email: string;
            };
            adspace: {
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
        recent_users: {
            name: string;
            email: string;
            role: import(".prisma/client").$Enums.Role;
            id: string;
            created_at: Date;
        }[];
    }>;
}
