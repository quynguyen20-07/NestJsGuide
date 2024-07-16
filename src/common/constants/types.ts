import { BrandEntity } from '@app/modules/brand/entities';
import { RoleEntity } from '@app/modules/role/entities';
import { StoreEntity } from '@app/modules/store/entities';

export type JwtPayload = {
  sub: number;
  username: string;
  role?: RoleEntity;
  permission?: string[];
  stores?: StoreEntity[];
  brand?: BrandEntity;
};
