import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ProvidersService } from './providers.service';
import { CreateProviderDto } from './dto/create-provider.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Role } from '../../common/enums';

@Controller('providers')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProvidersController {
  constructor(private readonly providersService: ProvidersService) {}

  @Post()
  @Roles(Role.PROVIDER, Role.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  async create(@CurrentUser() user: any, @Body() dto: CreateProviderDto) {
    return this.providersService.create(user.id, dto);
  }

  @Get()
  async findAll() {
    return this.providersService.findAll();
  }

  @Get('my-profile')
  @Roles(Role.PROVIDER)
  async getMyProfile(@CurrentUser() user: any) {
    return this.providersService.findByUserId(user.id);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.providersService.findById(id);
  }
}
