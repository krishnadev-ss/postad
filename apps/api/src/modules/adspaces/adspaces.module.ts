import { Module } from '@nestjs/common';
import { AdSpacesController } from './adspaces.controller';
import { AdSpacesService } from './adspaces.service';

@Module({
  controllers: [AdSpacesController],
  providers: [AdSpacesService],
  exports: [AdSpacesService],
})
export class AdSpacesModule {}
