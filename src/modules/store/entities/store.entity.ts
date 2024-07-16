import { StatusEnum } from '@Constant/enums';
import { AbstractEntity } from '@Entity/abstract.entity';
import { BrandEntity } from '@app/modules/brand/entities';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity('stores')
export class StoreEntity extends AbstractEntity {
  @Column({ type: 'varchar', length: 50 })
  name: string;

  @Column({ type: 'varchar', length: 100 })
  address: string;

  @Column({ type: 'bigint', nullable: true })
  dashboardId: number;

  @Column({ type: 'enum', enum: StatusEnum, default: StatusEnum.ACTIVE })
  status: StatusEnum;

  @ManyToOne(() => BrandEntity, (brand) => brand.stores)
  brand: BrandEntity;
}
