import { Expose } from 'class-transformer';

export class CreateBrand {
  @Expose()
  name: string;
}
