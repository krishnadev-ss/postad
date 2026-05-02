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
exports.BookingsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
let BookingsService = class BookingsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, dto) {
        const adspace = await this.prisma.adSpace.findUnique({
            where: { id: dto.adspace_id },
        });
        if (!adspace) {
            throw new common_1.NotFoundException(`Ad space with ID ${dto.adspace_id} not found`);
        }
        if (!adspace.is_available) {
            throw new common_1.BadRequestException('This ad space is not available for booking');
        }
        const startDate = new Date(dto.start_date);
        const endDate = new Date(dto.end_date);
        if (startDate >= endDate) {
            throw new common_1.BadRequestException('End date must be after start date');
        }
        if (startDate < new Date()) {
            throw new common_1.BadRequestException('Start date cannot be in the past');
        }
        const booking = await this.prisma.booking.create({
            data: {
                user_id: userId,
                adspace_id: dto.adspace_id,
                start_date: startDate,
                end_date: endDate,
                status: 'PENDING',
            },
            include: {
                adspace: {
                    select: {
                        id: true,
                        title: true,
                        location: true,
                        type: true,
                        price_per_day: true,
                    },
                },
                user: {
                    select: { id: true, name: true, email: true },
                },
            },
        });
        await this.prisma.activity.create({
            data: {
                user_id: userId,
                type: 'BOOKING_CREATED',
                message: `Booking created for "${adspace.title}" from ${startDate.toDateString()} to ${endDate.toDateString()}`,
                metadata: {
                    booking_id: booking.id,
                    adspace_id: adspace.id,
                    start_date: dto.start_date,
                    end_date: dto.end_date,
                },
            },
        });
        return booking;
    }
    async findByUser(userId) {
        return this.prisma.booking.findMany({
            where: { user_id: userId },
            include: {
                adspace: {
                    select: {
                        id: true,
                        title: true,
                        location: true,
                        type: true,
                        price_per_day: true,
                    },
                },
            },
            orderBy: { created_at: 'desc' },
        });
    }
    async findAll(page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const [bookings, total] = await Promise.all([
            this.prisma.booking.findMany({
                skip,
                take: limit,
                include: {
                    adspace: {
                        select: {
                            id: true,
                            title: true,
                            location: true,
                            type: true,
                            price_per_day: true,
                        },
                    },
                    user: {
                        select: { id: true, name: true, email: true },
                    },
                },
                orderBy: { created_at: 'desc' },
            }),
            this.prisma.booking.count(),
        ]);
        return {
            data: bookings,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async updateStatus(id, adminId, dto) {
        const booking = await this.prisma.booking.findUnique({
            where: { id },
            include: {
                adspace: { select: { title: true } },
                user: { select: { id: true, name: true } },
            },
        });
        if (!booking) {
            throw new common_1.NotFoundException(`Booking with ID ${id} not found`);
        }
        if (booking.status !== 'PENDING') {
            throw new common_1.BadRequestException(`Booking is already ${booking.status}. Only PENDING bookings can be updated.`);
        }
        const updatedBooking = await this.prisma.booking.update({
            where: { id },
            data: { status: dto.status },
            include: {
                adspace: {
                    select: { id: true, title: true, location: true, type: true, price_per_day: true },
                },
                user: {
                    select: { id: true, name: true, email: true },
                },
            },
        });
        await this.prisma.activity.create({
            data: {
                user_id: adminId,
                type: `BOOKING_${dto.status}`,
                message: `Booking for "${booking.adspace.title}" was ${dto.status.toLowerCase()} for ${booking.user.name}`,
                metadata: {
                    booking_id: booking.id,
                    adspace_title: booking.adspace.title,
                    advertiser_name: booking.user.name,
                },
            },
        });
        await this.prisma.activity.create({
            data: {
                user_id: booking.user.id,
                type: `BOOKING_${dto.status}`,
                message: `Your booking for "${booking.adspace.title}" has been ${dto.status.toLowerCase()}`,
                metadata: {
                    booking_id: booking.id,
                    adspace_title: booking.adspace.title,
                },
            },
        });
        return updatedBooking;
    }
};
exports.BookingsService = BookingsService;
exports.BookingsService = BookingsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BookingsService);
//# sourceMappingURL=bookings.service.js.map