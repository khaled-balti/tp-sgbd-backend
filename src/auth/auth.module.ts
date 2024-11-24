import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { localStartegy } from './strategies/Local.strategy';
import { JwtStategy } from './strategies/Jwt.strategy';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [ UserModule, PassportModule, JwtModule.register({
    secret: "users",
    signOptions: { expiresIn: "24h" }
  })],
  controllers: [AuthController],
  providers: [AuthService, localStartegy, JwtStategy]
})
export class AuthModule {}
