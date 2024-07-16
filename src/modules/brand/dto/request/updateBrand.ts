import { StatusEnum } from '@Constant/enums';
import { Expose } from 'class-transformer';

export class UpdateBrandDto {
  @Expose()
  name: string;

  @Expose()
  status: StatusEnum;
}
