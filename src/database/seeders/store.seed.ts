import { createSign } from '@app/helper/create-sign';
import { BrandEntity } from '@app/modules/brand/entities';
import { CreateStoreDto } from '@app/modules/store/dto/create-store.dto';
import { StoreEntity } from '@app/modules/store/entities';
import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Cache } from 'cache-manager';
import { Seeder } from 'nestjs-seeder';
import { Repository } from 'typeorm';

@Injectable()
export class StoreSeeder implements Seeder {
  constructor(
    @InjectRepository(StoreEntity)
    private readonly roleRepository: Repository<StoreEntity>,

    @InjectRepository(BrandEntity)
    private readonly brandRepository: Repository<BrandEntity>,

    private readonly httpService: HttpService,

    private readonly configService: ConfigService,

    @Inject(CACHE_MANAGER) private cacheService: Cache
  ) {}

  async seed(): Promise<any> {
    await this.roleRepository.query(`TRUNCATE stores RESTART IDENTITY CASCADE;`);

    const brands: BrandEntity[] = await this.brandRepository.find({
      where: {
        deletedAt: null,
      },
    });

    const stores: CreateStoreDto[] = [];

    const getStoreData = async () => {
      try {
        const token = await this.cacheService.get('dashboard-token');

        const sign = createSign({}, String(token));

        const response = await this.httpService
          .post(
            `${this.configService.get<string>('API_URL')}/common/store/index`,
            {},
            {
              headers: { token: String(token), sign: String(sign) },
            }
          )
          .toPromise();

        return response.data.data;
      } catch (error) {
        const message = error?.response?.data?.error_description ?? 'An error occurred';
        throw new HttpException(message, HttpStatus.BAD_REQUEST);
      }
    };

    await getStoreData().then((response) => {
      if (response) {
        response.forEach((store) => {
          stores.push({
            name: store.name,
            address: store.address,
            dashboardId: store.id,
            brand: brands.find((b) => b.name === store.company),
          });
        });
      }
    });

    await this.roleRepository.insert(stores);
  }

  async drop(): Promise<any> {
    return this.roleRepository.query(`TRUNCATE stores RESTART IDENTITY CASCADE;`);
  }
}
