import { StatusEnum } from '@Constant/enums';
import { PageMetaDto, ResponseItem, ResponsePaginate } from '@app/common/dtos';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { Repository } from 'typeorm';
import { BrandEntity } from '../brand/entities';
import { CreateStoreDto } from './dto/create-store.dto';
import { GetStoreDto } from './dto/get-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { StoreEntity } from './entities';

@Injectable()
export class StoresService {
  constructor(
    @InjectRepository(StoreEntity)
    private readonly storeRepository: Repository<StoreEntity>,
    @InjectRepository(BrandEntity)
    private readonly brandRepository: Repository<BrandEntity>
  ) {}

  async createStore(params: CreateStoreDto): Promise<ResponseItem<StoreEntity>> {
    const storeExisted = await this.storeRepository
      .createQueryBuilder('stores')
      .where('LOWER(stores.name) = LOWER(:name)', { name: params.name })
      .andWhere('stores.deletedAt IS NULL')
      .getOne();
    if (storeExisted) throw new BadRequestException('Store name already exists');

    const storeObject = this.storeRepository.create(params);
    const store = await this.storeRepository.save(storeObject);

    return new ResponseItem(store, 'Create new data successfully');
  }

  async getStores(params: GetStoreDto): Promise<ResponsePaginate<StoreEntity>> {
    const stores = this.storeRepository
      .createQueryBuilder('stores')
      .leftJoinAndSelect('stores.brand', 'brand', 'brand.deletedAt IS NULL')
      .where('stores.status = ANY(:status)', {
        status: params.status ? [params.status] : [StatusEnum.ACTIVE, StatusEnum.INACTIVE],
      })
      .orderBy(`stores.${params.orderBy}`, params.order)
      .skip(params.skip)
      .take(params.take);

    if (params.search) {
      stores.andWhere('(LOWER(stores.name)) LIKE (LOWER(:name))', {
        name: `%${params.search}%`,
      });
    }

    const [result, total] = await stores.getManyAndCount();

    const pageMetaDto = new PageMetaDto({ itemCount: total, pageOptionsDto: params });

    return new ResponsePaginate(result, pageMetaDto, 'Thành công');
  }

  async getStore(id: number): Promise<ResponseItem<StoreEntity>> {
    const store = await this.storeRepository.findOne({
      where: {
        id,
        deletedAt: null,
      },
      relations: ['brand'],
    });
    if (!store) throw new BadRequestException('The store does not exist');

    return new ResponseItem(store, 'Success');
  }

  async updateStore(id: number, updateStoreDto: UpdateStoreDto): Promise<ResponseItem<StoreEntity>> {
    const store = await this.storeRepository.findOne({
      where: {
        id,
        deletedAt: null,
      },
      relations: ['brand'],
    });
    if (!store) throw new BadRequestException('The store does not exist');

    const nameExisted = await this.storeRepository
      .createQueryBuilder('stores')
      .where('LOWER(stores.name) = LOWER(:name)', { name: updateStoreDto.name })
      .andWhere('stores.id != :id', { id })
      .andWhere('stores.deletedAt IS NULL')
      .getOne();
    if (nameExisted) throw new BadRequestException('Store name already exists');

    const brand = await this.brandRepository.findOne({
      where: {
        id: Number(updateStoreDto.brand),
        deletedAt: null,
      },
    });

    if (!brand) throw new BadRequestException('This brand does not exist');

    const result = await this.storeRepository.save({
      ...store,
      ...plainToClass(UpdateStoreDto, updateStoreDto, { excludeExtraneousValues: true }),
      brand: brand,
    });

    return new ResponseItem(result, 'Data update successful');
  }

  async deleteStore(id: number): Promise<ResponseItem<null>> {
    const storeExisted = await this.storeRepository.findOneBy({ id, deletedAt: null });
    if (!storeExisted) {
      throw new BadRequestException('This store does not exist');
    }

    await this.storeRepository.softDelete(id);

    return new ResponseItem(null, 'Delete store successfully');
  }

  async getAllStore(): Promise<ResponseItem<StoreEntity>> {
    const stores = this.storeRepository
      .createQueryBuilder('stores')
      .leftJoinAndSelect('stores.user', 'user', 'user.deletedAt IS NULL')
      .where('stores.status = :status', { status: StatusEnum.ACTIVE })
      .andWhere('stores.user IS NULL');

    const [result] = await stores.getManyAndCount();

    return new ResponseItem(result, 'Thành công');
  }
}
