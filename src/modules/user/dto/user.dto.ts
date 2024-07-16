import { StatusEnum } from '@Constant/enums';
import { BrandEntity } from '@app/modules/brand/entities';
import { RoleEntity } from '@app/modules/role/entities';
import { StoreEntity } from '@app/modules/store/entities';

export class UserDto {
  username: string;

  phone: string;

  password: string;

  status?: StatusEnum;

  rfToken: string;

  role: RoleEntity;

  stores?: StoreEntity[];

  brand?: BrandEntity;
}
