import { PartialType } from '@nestjs/mapped-types';
import { CreateAdSpaceDto } from './create-adspace.dto';

export class UpdateAdSpaceDto extends PartialType(CreateAdSpaceDto) {}
