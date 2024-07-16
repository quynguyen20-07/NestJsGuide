import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoreEntity } from './entities';
import { BrandEntity } from '../brand/entities';
import { StoresService } from './store.service';
import { StoresController } from './store.controller';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([StoreEntity, BrandEntity])],
  controllers: [StoresController],
  providers: [StoresService, JwtService, ConfigService],
  exports: [StoresService],
})
export class StoreModule {}
