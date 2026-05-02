"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProvidersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
let ProvidersService = class ProvidersService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, dto) {
        const existing = await this.prisma.provider.findUnique({
            where: { user_id: userId },
        });
        if (existing) {
            throw new common_1.ConflictException('Provider profile already exists for this user');
        }
        return this.prisma.provider.create({
            data: {
                user_id: userId,
                company_name: dto.company_name,
                contact_info: dto.contact_info,
            },
            include: {
                user: {
                    select: { id: true, name: true, email: true, role: true },
                },
            },
        });
    }
    async findAll() {
        return this.prisma.provider.findMany({
            include: {
                user: {
                    select: { id: true, name: true, email: true },
                },
                _count: {
                    select: { adspaces: true },
                },
            },
            orderBy: { company_name: 'asc' },
        });
    }
    async findById(id) {
        const provider = await this.prisma.provider.findUnique({
            where: { id },
            include: {
                user: {
                    select: { id: true, name: true, email: true },
                },
                adspaces: {
                    where: { is_available: true },
                    orderBy: { created_at: 'desc' },
                },
            },
        });
        if (!provider) {
            throw new common_1.NotFoundException(`Provider with ID ${id} not found`);
        }
        return provider;
    }
    async findByUserId(userId) {
        const provider = await this.prisma.provider.findUnique({
            where: { user_id: userId },
            include: {
                user: {
                    select: { id: true, name: true, email: true },
                },
                adspaces: {
                    orderBy: { created_at: 'desc' },
                },
            },
        });
        if (!provider) {
            throw new common_1.NotFoundException(`No provider profile found for user ${userId}`);
        }
        return provider;
    }
};
exports.ProvidersService = ProvidersService;
exports.ProvidersService = ProvidersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProvidersService);
//# sourceMappingURL=providers.service.js.map