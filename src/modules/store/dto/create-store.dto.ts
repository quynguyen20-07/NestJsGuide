import { BrandEntity } from '@app/modules/brand/entities';

export class CreateStoreDto {
  name: string;
  address: string;
  brand?: BrandEntity;
  dashboardId?: number;
}
