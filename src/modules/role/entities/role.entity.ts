import { StatusEnum } from '@Constant/enums';
import { AbstractEntity } from '@Entity/abstract.entity';
import { PermissionEntity } from '@app/modules/permission/entities';
import { UserEntity } from '@app/modules/user/entities';
import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('roles')
export class RoleEntity extends AbstractEntity {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ type: 'text' })
  name: string;

  @Column({ type: 'enum', enum: StatusEnum, default: StatusEnum.ACTIVE })
  status: StatusEnum;

  @Column({ type: 'varchar', length: 255, nullable: true })
  description: string;

  @Column({ type: 'boolean', default: true })
  isEditable: boolean;

  @ManyToMany(() => PermissionEntity, {
    cascade: true,
  })
  @JoinTable({
    name: 'permission_roles',
    joinColumn: {
      name: 'roleId',
      referencedColumnName: 'id',
      foreignKeyConstraintName: 'fk_permission_roles_roleId',
    },
    inverseJoinColumn: {
      name: 'permissionId',
      referencedColumnName: 'id',
      foreignKeyConstraintName: 'fk_permission_roles_permissionId',
    },
  })
  permissions: PermissionEntity[];

  @OneToMany(() => UserEntity, (user) => user.role)
  users: UserEntity[];
}
