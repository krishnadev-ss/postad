import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(dto: RegisterDto): Promise<{
        user: {
            name: string;
            email: string;
            role: import(".prisma/client").$Enums.Role;
            id: string;
            created_at: Date;
        };
        access_token: string;
    }>;
    login(dto: LoginDto): Promise<{
        user: {
            name: string;
            email: string;
            role: import(".prisma/client").$Enums.Role;
            id: string;
            created_at: Date;
        };
        access_token: string;
    }>;
}
