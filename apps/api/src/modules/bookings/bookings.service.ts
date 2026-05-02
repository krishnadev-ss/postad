import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingStatusDto } from './dto/update-booking-status.dto';

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateBookingDto) {
    // Verify adspace exists and is available
    const adspace = await this.prisma.adSpace.findUnique({
      where: { id: dto.adspace_id },
    });

    if (!adspace) {
      throw new NotFoundException(`Ad space with ID ${dto.adspace_id} not found`);
    }

    if (!adspace.is_available) {
      throw new BadRequestException('This ad space is not available for booking');
    }

    const startDate = new Date(dto.start_date);
    const endDate = new Date(dto.end_date);

    if (startDate >= endDate) {
      throw new BadRequestException('End date must be after start date');
    }

    if (startDate < new Date()) {
      throw new BadRequestException('Start date cannot be in the past');
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

    // Log activity
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

  async findByUser(userId: string) {
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

  async updateStatus(id: string, adminId: string, dto: UpdateBookingStatusDto) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: {
        adspace: { select: { title: true } },
        user: { select: { id: true, name: true } },
      },
    });

    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }

    if (booking.status !== 'PENDING') {
      throw new BadRequestException(
        `Booking is already ${booking.status}. Only PENDING bookings can be updated.`,
      );
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

    // Log activity for admin action
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

    // Also log activity for the booking owner
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
}
