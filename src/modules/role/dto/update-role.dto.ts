import { StatusEnum } from '@Constant/enums';
import { Expose } from 'class-transformer';

export class UpdateRoleDto {
  @Expose()
  name: string;

  @Expose()
  code: string;

  @Expose()
  status: StatusEnum;

  @Expose()
  description: string;

  permissions: number[];
}
