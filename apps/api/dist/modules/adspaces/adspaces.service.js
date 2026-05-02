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
exports.AdSpacesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
const enums_1 = require("../../common/enums");
let AdSpacesService = class AdSpacesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(filters = {}) {
        const where = {};
        if (filters.location) {
            where.location = {
                contains: filters.location,
                mode: 'insensitive',
            };
        }
        if (filters.type) {
            where.type = {
                contains: filters.type,
                mode: 'insensitive',
            };
        }
        if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
            where.price_per_day = {};
            if (filters.minPrice !== undefined) {
                where.price_per_day.gte = filters.minPrice;
            }
            if (filters.maxPrice !== undefined) {
                where.price_per_day.lte = filters.maxPrice;
            }
        }
        if (filters.isAvailable !== undefined) {
            where.is_available = filters.isAvailable;
        }
        return this.prisma.adSpace.findMany({
            where,
            include: {
                provider: {
                    select: {
                        id: true,
                        company_name: true,
                        contact_info: true,
                    },
                },
            },
            orderBy: { created_at: 'desc' },
        });
    }
    async findById(id) {
        const adspace = await this.prisma.adSpace.findUnique({
            where: { id },
            include: {
                provider: {
                    select: {
                        id: true,
                        company_name: true,
                        contact_info: true,
                        user: {
                            select: { name: true, email: true },
                        },
                    },
                },
                bookings: {
                    where: {
                        status: { in: ['PENDING', 'APPROVED'] },
                    },
                    select: {
                        id: true,
                        start_date: true,
                        end_date: true,
                        status: true,
                    },
                    orderBy: { start_date: 'asc' },
                },
            },
        });
        if (!adspace) {
            throw new common_1.NotFoundException(`Ad space with ID ${id} not found`);
        }
        return adspace;
    }
    async create(userId, userRole, dto) {
        let providerId;
        if (userRole === enums_1.Role.ADMIN) {
            const provider = await this.prisma.provider.findFirst({
                orderBy: { company_name: 'asc' },
            });
            if (!provider) {
                throw new common_1.ForbiddenException('No provider profiles exist. Create a provider profile first.');
            }
            providerId = provider.id;
        }
        else {
            const provider = await this.prisma.provider.findUnique({
                where: { user_id: userId },
            });
            if (!provider) {
                throw new common_1.ForbiddenException('You must create a provider profile before adding ad spaces');
            }
            providerId = provider.id;
        }
        const adspace = await this.prisma.adSpace.create({
            data: {
                provider_id: providerId,
                title: dto.title,
                location: dto.location,
                latitude: dto.latitude,
                longitude: dto.longitude,
                type: dto.type,
                price_per_day: dto.price_per_day,
                is_available: dto.is_available ?? true,
            },
            include: {
                provider: {
                    select: { id: true, company_name: true },
                },
            },
        });
        await this.prisma.activity.create({
            data: {
                user_id: userId,
                type: 'ADSPACE_CREATED',
                message: `Ad space "${adspace.title}" was created at ${adspace.location}`,
                metadata: { adspace_id: adspace.id, location: adspace.location },
            },
        });
        return adspace;
    }
    async update(id, userId, userRole, dto) {
        const adspace = await this.prisma.adSpace.findUnique({
            where: { id },
            include: { provider: true },
        });
        if (!adspace) {
            throw new common_1.NotFoundException(`Ad space with ID ${id} not found`);
        }
        if (userRole !== enums_1.Role.ADMIN) {
            const provider = await this.prisma.provider.findUnique({
                where: { user_id: userId },
            });
            if (!provider || provider.id !== adspace.provider_id) {
                throw new common_1.ForbiddenException('You can only update your own ad spaces');
            }
        }
        return this.prisma.adSpace.update({
            where: { id },
            data: dto,
            include: {
                provider: {
                    select: { id: true, company_name: true },
                },
            },
        });
    }
};
exports.AdSpacesService = AdSpacesService;
exports.AdSpacesService = AdSpacesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdSpacesService);
//# sourceMappingURL=adspaces.service.js.map