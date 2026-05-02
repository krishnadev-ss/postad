import { ActivitiesService } from './activities.service';
export declare class ActivitiesController {
    private readonly activitiesService;
    constructor(activitiesService: ActivitiesService);
    findAll(user: any, page?: string, limit?: string): Promise<{
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
}
