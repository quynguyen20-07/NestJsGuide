import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';

import { DatabaseModule } from '@app/config/database.module';
import { ConfigModule } from '@nestjs/config';
import { GlobalModule } from './common/provider/global/global.module';
import { GlobalService } from './common/provider/global/token-global';
import { RedisModule } from './modules/api/redis.module';
import { AuthModule } from './modules/auth/auth.module';
import { BrandModule } from './modules/brand/brand.module';
import { PermissionModule } from './modules/permission/permission.module';
import { RoleModule } from './modules/role/roles.module';
import { StoreModule } from './modules/store/store.module';
import { UsersModule } from './modules/user/users.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    DatabaseModule,
    AuthModule,
    RedisModule,
    PermissionModule,
    RoleModule,
    UsersModule,
    BrandModule,
    StoreModule,
    GlobalModule,
  ],
  providers: [
    GlobalService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],
})
export class AppModule {}
