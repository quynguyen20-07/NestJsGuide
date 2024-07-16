import { StatusEnum } from '@Constant/enums';
import { BrandEntity } from '@app/modules/brand/entities';
import { Expose } from 'class-transformer';

export class UpdateStoreDto {
  @Expose()
  name: string;

  @Expose()
  status: StatusEnum;

  @Expose()
  address: string;

  brand?: number;
}
