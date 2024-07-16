import { Column, Entity, OneToMany } from 'typeorm';

import { StatusEnum } from '@Constant/enums';
import { AbstractEntity } from '@Entity/abstract.entity';
import { StoreEntity } from '@app/modules/store/entities';
import { UserEntity } from '@app/modules/user/entities';

@Entity('brands')
export class BrandEntity extends AbstractEntity {
  @Column({ type: 'text' })
  name: string;

  @Column({ type: 'enum', enum: StatusEnum, default: StatusEnum.ACTIVE })
  status: StatusEnum;

  @OneToMany(() => StoreEntity, (store) => store.brand)
  stores: StoreEntity[];

  @OneToMany(() => UserEntity, (user: UserEntity) => user.brand)
  users: UserEntity[];
}
