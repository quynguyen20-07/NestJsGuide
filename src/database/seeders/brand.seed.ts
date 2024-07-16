import { createSign } from '@app/helper/create-sign';
import { CreateBrandDto } from '@app/modules/brand/dto/create-brand.dto';
import { BrandEntity } from '@app/modules/brand/entities';
import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER, HttpException, HttpStatus, Inject, Injectable, OnApplicationShutdown } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Seeder } from 'nestjs-seeder';
import { Cache } from 'cache-manager';
import { Repository } from 'typeorm';

@Injectable()
export class BrandSeeder implements Seeder, OnApplicationShutdown {
  constructor(
    @InjectRepository(BrandEntity)
    private readonly brandRepository: Repository<BrandEntity>,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    @Inject(CACHE_MANAGER) private cacheService: Cache
  ) {}

  async seed(): Promise<any> {
    await this.brandRepository.query(`TRUNCATE brands RESTART IDENTITY CASCADE;`);

    const brands: CreateBrandDto[] = [];

    const getBrand = async () => {
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

    await getBrand().then((response) => {
      if (response) {
        const companies = response.reduce((accumulator, currentValue) => {
          if (!accumulator.includes(currentValue.company)) {
            accumulator.push(currentValue.company);
          }
          return accumulator;
        }, []);

        companies.forEach((item) => {
          brands.push({
            name: item,
          });
        });
      }
    });
    await this.brandRepository.insert(brands);
  }

  async drop(): Promise<any> {
    await this.brandRepository.query(`TRUNCATE brands RESTART IDENTITY CASCADE;`);
  }

  async onApplicationShutdown(): Promise<void> {
    await this.close();
  }

  async close(): Promise<any> {
    process.exit(0);
  }
}
