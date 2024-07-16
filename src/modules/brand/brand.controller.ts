import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';

import { ResponseItem, ResponsePaginate } from '@app/common/dtos';
import { BrandService } from './brand.service';
import { CreateBrand } from './dto/request/createBrand';
import { UpdateBrandDto } from './dto/request/updateBrand';
import { GetBrandResponses } from './dto/response/brandResponses';
import { BrandEntity } from './entities';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Role, RoleGuard } from '@app/guards/roles.guard';

@Controller('brands')
// @UseGuards(JwtAuthGuard, RoleGuard)
// @Role('General management')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @Get('')
  async getBrands(@Query() getBrands: GetBrandResponses): Promise<ResponsePaginate<BrandEntity>> {
    return await this.brandService.getBrands(getBrands);
  }
  @Get('all')
  async getAllBrands(): Promise<ResponseItem<BrandEntity>> {
    return await this.brandService.getAllBrands();
  }

  @Post()
  async createBrand(@Body() brand: CreateBrand): Promise<ResponseItem<BrandEntity>> {
    return await this.brandService.create(brand);
  }

  @Get(':id')
  async getBrand(@Param('id', ParseIntPipe) id: number): Promise<ResponseItem<BrandEntity>> {
    return await this.brandService.getBrand(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() brand: UpdateBrandDto
  ): Promise<ResponseItem<BrandEntity>> {
    return await this.brandService.update(id, brand);
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number): Promise<ResponseItem<null>> {
    return await this.brandService.delete(id);
  }
}
