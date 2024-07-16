import { StatusEnum } from '@Constant/enums';
import { PageMetaDto, ResponseItem, ResponsePaginate } from '@app/common/dtos';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { EntityManager, Not, Repository } from 'typeorm';
import { StoreEntity } from '../store/entities';
import { CreateBrand } from './dto/request/createBrand';
import { UpdateBrandDto } from './dto/request/updateBrand';
import { GetBrandResponses } from './dto/response/brandResponses';
import { BrandEntity } from './entities';

@Injectable()
export class BrandService {
  constructor(
    @InjectRepository(BrandEntity)
    private readonly brandRepository: Repository<BrandEntity>,
    private entityManager: EntityManager
  ) {}

  async getBrands(getBrands: GetBrandResponses): Promise<ResponsePaginate<BrandEntity>> {
    const brandQuery = this.brandRepository
      .createQueryBuilder('brands')
      .select('brands')
      .leftJoinAndSelect('brands.stores', 'store')
      .where('brands.status = ANY(:status)', {
        status: getBrands.status ? [getBrands.status] : [StatusEnum.ACTIVE, StatusEnum.INACTIVE],
      })
      .andWhere('brands.deletedAt IS NULL')
      .loadRelationCountAndMap('brands.storeCount', 'brands.stores')
      .orderBy(`brands.${getBrands.orderBy}`, getBrands.order)
      .skip(getBrands.skip)
      .take(getBrands.take);

    if (getBrands.search) {
      brandQuery.where('LOWER(brands.name) like LOWER(:name)', { name: `%${getBrands.search}%` });
    }

    const [result, total] = await brandQuery.getManyAndCount();
    const pageMetaDto = new PageMetaDto({ itemCount: total, pageOptionsDto: getBrands });
    return new ResponsePaginate(result, pageMetaDto, 'Success');
  }

  async getAllBrands(): Promise<ResponseItem<BrandEntity>> {
    const brands = await this.brandRepository
      .createQueryBuilder('brands')
      .leftJoinAndSelect('brands.users', 'users', 'users.deletedAt IS NULL')
      .leftJoinAndSelect('brands.stores', 'stores', 'stores.deletedAt IS NULL')
      .andWhere('brands.status = :status', { status: StatusEnum.ACTIVE })
      .andWhere('brands.deletedAt IS NULL')
      .getMany();

    return new ResponseItem(brands, 'Success');
  }

  async getBrand(id: number): Promise<ResponseItem<BrandEntity>> {
    const brand = await this.brandRepository.findOne({
      where: {
        id,
        deletedAt: null,
      },
      relations: ['stores'],
    });

    if (!brand) {
      throw new BadRequestException('Brand does not exist');
    }

    return new ResponseItem(brand, 'Success');
  }

  async create(brand: CreateBrand): Promise<ResponseItem<BrandEntity>> {
    return await this.entityManager.transaction(async (trx) => {
      const existBrand = await trx.getRepository(BrandEntity).findOne({
        where: {
          name: brand.name,
          deletedAt: null,
        },
      });

      if (existBrand) {
        throw new BadRequestException('Brand already exists');
      }

      const brandCreate = trx.getRepository(BrandEntity).create(brand);
      const brandSave = await trx.getRepository(BrandEntity).save(brandCreate);

      return new ResponseItem(brandSave, 'Create new data successfully');
    });
  }

  async update(id: number, brand: UpdateBrandDto): Promise<ResponseItem<BrandEntity>> {
    return await this.entityManager.transaction(async (trx) => {
      const existBrand = await trx.getRepository(BrandEntity).findOne({
        where: {
          id,
          deletedAt: null,
        },
      });

      const existName = await trx.getRepository(BrandEntity).findOne({
        where: {
          name: brand.name,
          id: Not(id),
        },
      });

      if (existName) {
        throw new BadRequestException('Brand name already exists');
      }

      if (!existBrand) {
        throw new NotFoundException('Brand already exists');
      }

      const isUsed = await this.brandRepository.findOne({
        where: {
          id,
          deletedAt: null,
        },
        relations: ['stores'],
      });

      if (brand.status === StatusEnum.INACTIVE && isUsed.stores.length > 0) {
        throw new NotFoundException('This brand contains active stores');
      }

      await trx.getRepository(BrandEntity).update(id, {
        ...existBrand,
        ...plainToClass(UpdateBrandDto, brand, { excludeExtraneousValues: true }),
      });

      const result = await trx.getRepository(BrandEntity).findOne({
        where: {
          id,
          deletedAt: null,
        },
      });

      return new ResponseItem(result, 'Update data successfully');
    });
  }

  async delete(id: number): Promise<ResponseItem<null>> {
    return await this.entityManager.transaction(async (trx) => {
      const brand = await trx.getRepository(BrandEntity).findOne({
        where: { id, deletedAt: null },
        relations: ['stores'],
      });

      if (!brand) {
        throw new BadRequestException('Brand already exists');
      }

      await trx.getRepository(StoreEntity).remove(brand.stores);

      await trx.getRepository(BrandEntity).softDelete(id);

      return new ResponseItem(null, 'Delete brand successfully');
    });
  }
}
