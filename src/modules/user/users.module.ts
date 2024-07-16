import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { ConfigService } from '@nestjs/config';
import { RoleEntity } from '../role/entities';
import { StoreEntity } from '../store/entities';
import { BrandEntity } from '../brand/entities';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, RoleEntity, StoreEntity, BrandEntity])],
  controllers: [UsersController],
  providers: [UsersService, ConfigService, JwtService],
  exports: [UsersService],
})
export class UsersModule {}
