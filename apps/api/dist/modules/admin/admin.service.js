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
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
let AdminService = class AdminService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getDashboard() {
        const [totalUsers, totalAdSpaces, totalBookings, pendingBookings, approvedBookings, rejectedBookings, totalProviders, recentBookings, recentUsers,] = await Promise.all([
            this.prisma.user.count(),
            this.prisma.adSpace.count(),
            this.prisma.booking.count(),
            this.prisma.booking.count({ where: { status: 'PENDING' } }),
            this.prisma.booking.count({ where: { status: 'APPROVED' } }),
            this.prisma.booking.count({ where: { status: 'REJECTED' } }),
            this.prisma.provider.count(),
            this.prisma.booking.findMany({
                take: 5,
                orderBy: { created_at: 'desc' },
                include: {
                    adspace: { select: { title: true, location: true, price_per_day: true } },
                    user: { select: { name: true, email: true } },
                },
            }),
            this.prisma.user.findMany({
                take: 5,
                orderBy: { created_at: 'desc' },
                select: { id: true, name: true, email: true, role: true, created_at: true },
            }),
        ]);
        const totalRevenuePotential = await this.prisma.booking.findMany({
            where: { status: 'APPROVED' },
            include: {
                adspace: { select: { price_per_day: true } },
            },
        });
        const revenue = totalRevenuePotential.reduce((acc, booking) => {
            const days = Math.ceil((booking.end_date.getTime() - booking.start_date.getTime()) / (1000 * 60 * 60 * 24));
            return acc + booking.adspace.price_per_day * days;
        }, 0);
        return {
            stats: {
                total_users: totalUsers,
                total_providers: totalProviders,
                total_adspaces: totalAdSpaces,
                total_bookings: totalBookings,
                pending_bookings: pendingBookings,
                approved_bookings: approvedBookings,
                rejected_bookings: rejectedBookings,
                approved_revenue: revenue,
            },
            recent_bookings: recentBookings,
            recent_users: recentUsers,
        };
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdminService);
//# sourceMappingURL=admin.service.js.map