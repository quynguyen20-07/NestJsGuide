import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoreEntity } from '../store/entities';
import { BrandController } from './brand.controller';
import { BrandService } from './brand.service';
import { BrandEntity } from './entities';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([BrandEntity, StoreEntity])],
  controllers: [BrandController],
  providers: [BrandService, JwtService],
})
export class BrandModule {}
