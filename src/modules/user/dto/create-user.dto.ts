import { Expose } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

import { RoleEntity } from '@app/modules/role/entities';
import { StoreEntity } from '@app/modules/store/entities';
import { BrandEntity } from '@app/modules/brand/entities';

export class CreateUserDto {
  @Expose()
  phone: string;

  @Expose()
  @IsNotEmpty()
  password: string;

  @Expose()
  @IsNotEmpty()
  username: string;

  @Expose()
  rfToken?: string;

  @Expose()
  @IsNotEmpty()
  role?: RoleEntity;

  @Expose()
  @IsNotEmpty()
  brand?: BrandEntity;

  @Expose()
  @IsNotEmpty()
  stores?: StoreEntity[];
}
