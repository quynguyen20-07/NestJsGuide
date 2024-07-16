import { StatusEnum } from '@Constant/enums';
import { BrandEntity } from '@app/modules/brand/entities';
import { RoleEntity } from '@app/modules/role/entities';
import { StoreEntity } from '@app/modules/store/entities';
import { Expose } from 'class-transformer';

export class UpdateUserDto {
  @Expose()
  phone: string;

  @Expose()
  status: StatusEnum;

  @Expose()
  role: RoleEntity;

  @Expose()
  brand?: BrandEntity;

  @Expose()
  stores?: StoreEntity[];
}
