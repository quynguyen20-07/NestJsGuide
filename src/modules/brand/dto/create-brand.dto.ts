import { StoreEntity } from '@app/modules/store/entities';

export class CreateBrandDto {
  name: string;

  stores?: StoreEntity[];
}
