import { PrismaService } from '../../database/prisma.service';
export declare class ActivitiesService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(page?: number, limit?: number, userId?: string): Promise<{
        data: ({
            user: {
                name: string;
                email: string;
                role: import(".prisma/client").$Enums.Role;
                id: string;
            };
        } & {
            id: string;
            created_at: Date;
            type: string;
            message: string;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
            user_id: string;
        })[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    create(data: {
        user_id: string;
        type: string;
        message: string;
        metadata?: any;
    }): Promise<{
        id: string;
        created_at: Date;
        type: string;
        message: string;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        user_id: string;
    }>;
}
