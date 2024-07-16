import { Exclude } from 'class-transformer';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, Unique } from 'typeorm';

import { StatusEnum } from '@Constant/enums';
import { AbstractEntity } from '@Entity/abstract.entity';
import { BrandEntity } from '@app/modules/brand/entities';
import { RoleEntity } from '@app/modules/role/entities';
import { StoreEntity } from '@app/modules/store/entities';
@Entity('users')
@Unique(['phone', 'deletedAt'])
@Unique(['username', 'deletedAt'])
export class UserEntity extends AbstractEntity {
  @Column({ type: 'varchar', length: 15, nullable: true })
  phone: string;

  @Column({ type: 'varchar' })
  @Exclude()
  password: string;

  @Column({ type: 'varchar', length: 50 })
  username: string;

  @Column({ type: 'varchar', nullable: true })
  @Exclude()
  rfToken: string;

  @ManyToOne(() => RoleEntity, (role) => role.users)
  role: RoleEntity;

  @ManyToMany(() => StoreEntity, {
    cascade: true,
  })
  @JoinTable({
    name: 'user_store',
    joinColumn: {
      name: 'userId',
      referencedColumnName: 'id',
      foreignKeyConstraintName: 'fk_user_store_userId',
    },
    inverseJoinColumn: {
      name: 'storeId',
      referencedColumnName: 'id',
      foreignKeyConstraintName: 'fk_user_store_storeId',
    },
  })
  stores: StoreEntity[];

  @ManyToOne(() => BrandEntity, (brand: BrandEntity) => brand.users)
  brand: BrandEntity;

  @Column({ type: 'enum', enum: StatusEnum, default: StatusEnum.ACTIVE })
  status: StatusEnum;
}
