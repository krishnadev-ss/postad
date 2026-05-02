import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getDashboard() {
    const [
      totalUsers,
      totalAdSpaces,
      totalBookings,
      pendingBookings,
      approvedBookings,
      rejectedBookings,
      totalProviders,
      recentBookings,
      recentUsers,
    ] = await Promise.all([
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
      const days = Math.ceil(
        (booking.end_date.getTime() - booking.start_date.getTime()) / (1000 * 60 * 60 * 24),
      );
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
}
