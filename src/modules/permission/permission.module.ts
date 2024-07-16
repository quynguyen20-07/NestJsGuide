import { Module } from '@nestjs/common';
import { PermissionsController } from './permission.controller';
import { PermissionsService } from './permission.service';
import { PermissionEntity } from './entities';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([PermissionEntity])],
  controllers: [PermissionsController],
  providers: [PermissionsService],
})
export class PermissionModule {}
