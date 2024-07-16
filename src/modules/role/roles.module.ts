import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';
import { RoleEntity } from './entities';
import { UserEntity } from '../user/entities';
import { PermissionEntity } from '../permission/entities';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([RoleEntity, UserEntity, PermissionEntity])],
  controllers: [RolesController],
  providers: [RolesService, JwtService],
})
export class RoleModule {}
