import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateProviderDto } from './dto/create-provider.dto';

@Injectable()
export class ProvidersService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateProviderDto) {
    const existing = await this.prisma.provider.findUnique({
      where: { user_id: userId },
    });

    if (existing) {
      throw new ConflictException('Provider profile already exists for this user');
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

  async findById(id: string) {
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
      throw new NotFoundException(`Provider with ID ${id} not found`);
    }

    return provider;
  }

  async findByUserId(userId: string) {
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
      throw new NotFoundException(`No provider profile found for user ${userId}`);
    }

    return provider;
  }
}
