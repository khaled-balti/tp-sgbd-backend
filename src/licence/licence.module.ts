import { Module } from '@nestjs/common';
import { LicenceService } from './licence.service';
import { LicenceController } from './licence.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Licence } from './entities/licence.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Licence])],
  controllers: [LicenceController],
  providers: [LicenceService],
  exports: [LicenceService]
})
export class LicenceModule {}
