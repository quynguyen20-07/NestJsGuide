import { PermissionEntity } from '@app/modules/permission/entities';

export class CreateRoleDto {
  id: number;
  name: string;
  description: string;
  isEditable?: boolean;
  permissions?: PermissionEntity[];
}
