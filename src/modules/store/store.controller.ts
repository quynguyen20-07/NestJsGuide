import { ResponseItem, ResponsePaginate } from '@app/common/dtos';
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { StoreEntity } from './entities';
import { StoresService } from './store.service';
import { GetStoreDto } from './dto/get-store.dto';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { Role, RoleGuard } from '@app/guards/roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesEnum } from '@Constant/enums';

@UseGuards(JwtAuthGuard, RoleGuard)
// @Role(RolesEnum.GENERAL_MANAGEMENT, RolesEnum.BRAND_MANAGEMENT)
@Controller('stores')
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  @Post()
  async create(@Body() createStoreDto: CreateStoreDto): Promise<ResponseItem<StoreEntity>> {
    return await this.storesService.createStore(createStoreDto);
  }

  @Get()
  async getStores(@Query() params: GetStoreDto): Promise<ResponsePaginate<StoreEntity>> {
    return await this.storesService.getStores(params);
  }

  @Get('all')
  async getAllStore(): Promise<ResponseItem<StoreEntity>> {
    return await this.storesService.getAllStore();
  }

  @Get(':id')
  async getStore(@Param('id', ParseIntPipe) id: number): Promise<ResponseItem<StoreEntity>> {
    return await this.storesService.getStore(id);
  }

  @Delete(':id')
  async deleteStore(@Param('id', ParseIntPipe) id: number): Promise<ResponseItem<null>> {
    return await this.storesService.deleteStore(id);
  }

  @Patch(':id')
  async updateStore(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCardDto: UpdateStoreDto
  ): Promise<ResponseItem<StoreEntity>> {
    return await this.storesService.updateStore(id, updateCardDto);
  }
}
