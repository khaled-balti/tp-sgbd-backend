import { Module } from '@nestjs/common';
import { LicencePerClientService } from './licence_per_client.service';
import { LicencePerClientController } from './licence_per_client.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LicencePerClient } from './entities/licence_per_client.entity';
import { ClientModule } from 'src/client/client.module';
import { ProviderModule } from 'src/provider/provider.module';
import { LicenceModule } from 'src/licence/licence.module';


@Module({
  imports: [TypeOrmModule.forFeature([LicencePerClient]), ClientModule, ProviderModule, LicenceModule],
  controllers: [LicencePerClientController],
  providers: [LicencePerClientService]
})
export class LicencePerClientModule {}
