import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import 'dotenv/config';
import { seeder } from 'nestjs-seeder';
import { DatabaseModule } from './config/database.module';
import { BrandSeeder } from './database/seeders/brand.seed';
import { PermissionSeeder } from './database/seeders/permission.seed';
import { RoleSeeder } from './database/seeders/role.seed';
import { StoreSeeder } from './database/seeders/store.seed';
import { RedisModule } from './modules/api/redis.module';
import { BrandEntity } from './modules/brand/entities';
import { PermissionEntity } from './modules/permission/entities';
import { RoleEntity } from './modules/role/entities';
import { StoreEntity } from './modules/store/entities';
import { UserSeeder } from './database/seeders/user.seed';
import { UserEntity } from './modules/user/entities';

seeder({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([PermissionEntity, RoleEntity, BrandEntity, StoreEntity, UserEntity]),
    RedisModule,
    HttpModule,
  ],
  providers: [ConfigService],
}).run([PermissionSeeder, RoleSeeder, BrandSeeder, StoreSeeder, UserSeeder]);
