import { Expose } from 'class-transformer';

import { StatusEnum } from '@Constant/enums';
import { PermissionEntity } from '@app/modules/permission/entities';

export class RoleDto {
  @Expose()
  name: string;

  status: StatusEnum;

  @Expose()
  description: string;

  permissions: PermissionEntity[];

  @Expose()
  isEditable: boolean;
}
