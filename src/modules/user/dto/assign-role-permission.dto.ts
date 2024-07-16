import { RoleEntity } from '@app/modules/role/entities';
import { Expose } from 'class-transformer';

export class AssignRoleDto {
  @Expose()
  role: RoleEntity;
}
