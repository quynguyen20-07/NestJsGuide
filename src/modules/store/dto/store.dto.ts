import { Expose } from 'class-transformer';

import { StatusEnum } from '@Constant/enums';
import { PermissionEntity } from '@app/modules/permission/entities';

export class StoreDto {
  @Expose()
  name: string;

  status: StatusEnum;

  @Expose()
  description: string;

  permissions: PermissionEntity[];

  @Expose()
  isEditable: boolean;
}
