import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateAdSpaceDto } from './dto/create-adspace.dto';
import { UpdateAdSpaceDto } from './dto/update-adspace.dto';
import { Role } from '../../common/enums';

export interface AdSpaceFilters {
  location?: string;
  type?: string;
  minPrice?: number;
  maxPrice?: number;
  isAvailable?: boolean;
}

@Injectable()
export class AdSpacesService {
  constructor(private prisma: PrismaService) {}

  async findAll(filters: AdSpaceFilters = {}) {
    const where: any = {};

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

  async findById(id: string) {
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
      throw new NotFoundException(`Ad space with ID ${id} not found`);
    }

    return adspace;
  }

  async create(userId: string, userRole: string, dto: CreateAdSpaceDto) {
    // Get provider profile for this user
    let providerId: string;

    if (userRole === Role.ADMIN) {
      // Admin must specify provider or we use a default
      const provider = await this.prisma.provider.findFirst({
        orderBy: { company_name: 'asc' },
      });
      if (!provider) {
        throw new ForbiddenException('No provider profiles exist. Create a provider profile first.');
      }
      providerId = provider.id;
    } else {
      const provider = await this.prisma.provider.findUnique({
        where: { user_id: userId },
      });
      if (!provider) {
        throw new ForbiddenException(
          'You must create a provider profile before adding ad spaces',
        );
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

    // Log activity
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

  async update(id: string, userId: string, userRole: string, dto: UpdateAdSpaceDto) {
    const adspace = await this.prisma.adSpace.findUnique({
      where: { id },
      include: { provider: true },
    });

    if (!adspace) {
      throw new NotFoundException(`Ad space with ID ${id} not found`);
    }

    // Check ownership: only the provider who owns it or admin can update
    if (userRole !== Role.ADMIN) {
      const provider = await this.prisma.provider.findUnique({
        where: { user_id: userId },
      });

      if (!provider || provider.id !== adspace.provider_id) {
        throw new ForbiddenException('You can only update your own ad spaces');
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
}
