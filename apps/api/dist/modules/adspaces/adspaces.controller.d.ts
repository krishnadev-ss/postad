import { AdSpacesService } from './adspaces.service';
import { CreateAdSpaceDto } from './dto/create-adspace.dto';
import { UpdateAdSpaceDto } from './dto/update-adspace.dto';
export declare class AdSpacesController {
    private readonly adSpacesService;
    constructor(adSpacesService: AdSpacesService);
    findAll(location?: string, type?: string, minPrice?: string, maxPrice?: string, isAvailable?: string): Promise<({
        provider: {
            id: string;
            company_name: string;
            contact_info: string;
        };
    } & {
        id: string;
        created_at: Date;
        type: string;
        provider_id: string;
        title: string;
        location: string;
        latitude: number | null;
        longitude: number | null;
        price_per_day: number;
        is_available: boolean;
    })[]>;
    findById(id: string): Promise<{
        provider: {
            user: {
                name: string;
                email: string;
            };
            id: string;
            company_name: string;
            contact_info: string;
        };
        bookings: {
            id: string;
            start_date: Date;
            end_date: Date;
            status: import(".prisma/client").$Enums.BookingStatus;
        }[];
    } & {
        id: string;
        created_at: Date;
        type: string;
        provider_id: string;
        title: string;
        location: string;
        latitude: number | null;
        longitude: number | null;
        price_per_day: number;
        is_available: boolean;
    }>;
    create(user: any, dto: CreateAdSpaceDto): Promise<{
        provider: {
            id: string;
            company_name: string;
        };
    } & {
        id: string;
        created_at: Date;
        type: string;
        provider_id: string;
        title: string;
        location: string;
        latitude: number | null;
        longitude: number | null;
        price_per_day: number;
        is_available: boolean;
    }>;
    update(id: string, user: any, dto: UpdateAdSpaceDto): Promise<{
        provider: {
            id: string;
            company_name: string;
        };
    } & {
        id: string;
        created_at: Date;
        type: string;
        provider_id: string;
        title: string;
        location: string;
        latitude: number | null;
        longitude: number | null;
        price_per_day: number;
        is_available: boolean;
    }>;
}
