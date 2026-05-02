import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AdSpacesService } from './adspaces.service';
import { CreateAdSpaceDto } from './dto/create-adspace.dto';
import { UpdateAdSpaceDto } from './dto/update-adspace.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Role } from '../../common/enums';

@Controller('adspaces')
export class AdSpacesController {
  constructor(private readonly adSpacesService: AdSpacesService) {}

  @Get()
  async findAll(
    @Query('location') location?: string,
    @Query('type') type?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('isAvailable') isAvailable?: string,
  ) {
    return this.adSpacesService.findAll({
      location,
      type,
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
      isAvailable: isAvailable !== undefined ? isAvailable === 'true' : undefined,
    });
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.adSpacesService.findById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.PROVIDER, Role.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  async create(@CurrentUser() user: any, @Body() dto: CreateAdSpaceDto) {
    return this.adSpacesService.create(user.id, user.role, dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.PROVIDER, Role.ADMIN)
  async update(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() dto: UpdateAdSpaceDto,
  ) {
    return this.adSpacesService.update(id, user.id, user.role, dto);
  }
}
