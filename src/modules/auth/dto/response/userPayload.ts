import { BrandEntity } from '@app/modules/brand/entities';
import { RoleEntity } from '@app/modules/role/entities';
import { StoreEntity } from '@app/modules/store/entities';

export class UserPayloadDto {
  id: number;
  username: string;
  role: RoleEntity;
  stores?: StoreEntity[];
  brand?: BrandEntity;
}

export class TokenPayloadDto {
  session: string;
}
