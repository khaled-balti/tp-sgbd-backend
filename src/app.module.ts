import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from './client/entities/client.entity';
import { Provider } from './provider/entities/provider.entity';
import { Licence } from './licence/entities/licence.entity';
import { Address } from './address/entities/address.entity';
import { LicencePerClient } from './licence_per_client/entities/licence_per_client.entity';
import { User } from './user/entities/user.entity';
import { Report } from './report/entities/report.entity';
import { ClientModule } from './client/client.module';
import { LicenceModule } from './licence/licence.module';
import { ProviderModule } from './provider/provider.module';
import { LicencePerClientModule } from './licence_per_client/licence_per_client.module';
import { AddressModule } from './address/address.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ReportModule } from './report/report.module';

@Module({
  imports: [
    ClientModule,
    ProviderModule,
    LicenceModule,
    LicencePerClientModule,
    AuthModule,
    ReportModule,
    UserModule,
    AddressModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: +process.env.DB_PORT || 3306,
      username: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'microsoft_plateform',
      entities: [
        Client,
        Provider,
        Licence,
        Address,
        LicencePerClient,
        User,
        Report,
      ],
      synchronize: true,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
