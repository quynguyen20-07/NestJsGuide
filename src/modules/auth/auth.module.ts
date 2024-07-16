import { GlobalModule } from '@app/common/provider/global/global.module';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisModule } from '../api/redis.module';
import { UserEntity } from '../user/entities';
import { UsersModule } from '../user/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    HttpModule,
    RedisModule,
    PassportModule,
    UsersModule,
    GlobalModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRETKEY'),
        signOptions: { expiresIn: `${configService.get<number>('JWT_EXPIRES')}s` },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, ConfigService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
