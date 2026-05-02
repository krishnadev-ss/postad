import { ProvidersService } from './providers.service';
import { CreateProviderDto } from './dto/create-provider.dto';
export declare class ProvidersController {
    private readonly providersService;
    constructor(providersService: ProvidersService);
    create(user: any, dto: CreateProviderDto): Promise<{
        user: {
            name: string;
            email: string;
            role: import(".prisma/client").$Enums.Role;
            id: string;
        };
    } & {
        id: string;
        user_id: string;
        company_name: string;
        contact_info: string;
    }>;
    findAll(): Promise<({
        user: {
            name: string;
            email: string;
            id: string;
        };
        _count: {
            adspaces: number;
        };
    } & {
        id: string;
        user_id: string;
        company_name: string;
        contact_info: string;
    })[]>;
    getMyProfile(user: any): Promise<{
        user: {
            name: string;
            email: string;
            id: string;
        };
        adspaces: {
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
        }[];
    } & {
        id: string;
        user_id: string;
        company_name: string;
        contact_info: string;
    }>;
    findById(id: string): Promise<{
        user: {
            name: string;
            email: string;
            id: string;
        };
        adspaces: {
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
        }[];
    } & {
        id: string;
        user_id: string;
        company_name: string;
        contact_info: string;
    }>;
}
