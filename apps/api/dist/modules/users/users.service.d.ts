import { PrismaService } from '../../database/prisma.service';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    findById(id: string): Promise<{
        provider: {
            id: string;
            company_name: string;
            contact_info: string;
        };
        name: string;
        email: string;
        role: import(".prisma/client").$Enums.Role;
        id: string;
        created_at: Date;
    }>;
    findByEmail(email: string): Promise<{
        name: string;
        email: string;
        role: import(".prisma/client").$Enums.Role;
        id: string;
        password_hash: string;
        created_at: Date;
    }>;
    findAll(): Promise<{
        name: string;
        email: string;
        role: import(".prisma/client").$Enums.Role;
        id: string;
        created_at: Date;
    }[]>;
}
