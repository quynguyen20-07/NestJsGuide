import { CacheInterceptor, CacheModule, Module, forwardRef } from '@nestjs/common';
import { RedisController } from './redis.controller';
import { RedisService } from './redis.service';
import { HttpModule } from '@nestjs/axios';
import * as redisStore from 'cache-manager-redis-store';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        store: redisStore,
        host: configService.get<string>('REDIS_HOST'),
        post: configService.get<string>('REDIS_PORT'),
        // username: configService.get<string>('REDIS_USERNAME'),
        // password: configService.get<string>('REDIS_PASSWORD'),
      }),
    }),
    HttpModule,
    JwtModule.register({
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [RedisController],
  providers: [
    RedisService,
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: CacheInterceptor,
    // },
    ConfigService,
    JwtModule,
  ],
  exports: [CacheModule, RedisService],
})
export class RedisModule {}
