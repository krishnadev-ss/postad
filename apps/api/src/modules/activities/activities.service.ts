import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class ActivitiesService {
  constructor(private prisma: PrismaService) {}

  async findAll(page = 1, limit = 20, userId?: string) {
    const skip = (page - 1) * limit;
    const where = userId ? { user_id: userId } : {};

    const [activities, total] = await Promise.all([
      this.prisma.activity.findMany({
        where,
        skip,
        take: limit,
        include: {
          user: {
            select: { id: true, name: true, email: true, role: true },
          },
        },
        orderBy: { created_at: 'desc' },
      }),
      this.prisma.activity.count({ where }),
    ]);

    return {
      data: activities,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async create(data: {
    user_id: string;
    type: string;
    message: string;
    metadata?: any;
  }) {
    return this.prisma.activity.create({
      data,
    });
  }
}
