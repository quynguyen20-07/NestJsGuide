import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Seeder } from 'nestjs-seeder';
import { Repository } from 'typeorm';
import { CreatePermissionDto } from '@app/modules/permission/dto/create-permission.dto';
import { PermissionEntity } from '@app/modules/permission/entities';
import { ChartPermission } from '@Constant/enums';

@Injectable()
export class PermissionSeeder implements Seeder {
  constructor(
    @InjectRepository(PermissionEntity)
    private readonly permissionRepository: Repository<PermissionEntity>
  ) {}

  async seed(): Promise<any> {
    await this.permissionRepository.query(`TRUNCATE permissions RESTART IDENTITY CASCADE;`);

    const permissions: CreatePermissionDto[] = [
      {
        id: 1,
        name: 'Seven-day Traffic History',
        code: ChartPermission.HISTORY_TRAFFIC,
        description: 'Seven-day Traffic History chart',
      },
      {
        id: 2,
        name: 'Traffic statistics',
        code: ChartPermission.TRAFFIC_STATISTICS,
        description: 'Traffic statistics chart',
      },
      {
        id: 3,
        name: 'Visitors and visits',
        code: ChartPermission.VISITORS_VISITS,
        description: 'Visitors and visits chart',
      },
      {
        id: 4,
        name: 'Headmap',
        code: ChartPermission.HEADMAP,
        description: 'Headmap chart',
      },
      {
        id: 5,
        name: 'Frequency of visits',
        code: ChartPermission.FREQUENCY,
        description: 'Frequency of visits chart',
      },
      {
        id: 6,
        name: 'Live faces',
        code: ChartPermission.LIVE_FACE,
        description: 'Live faces chart',
      },
      {
        id: 7,
        name: 'Subject notification',
        code: ChartPermission.SUBJECT_NOTIFICATION,
        description: 'Subject notification chart',
      },
      {
        id: 8,
        name: 'Dwell camera',
        code: ChartPermission.DWELL_CAMERA,
        description: 'Dwell camera chart',
      },
      {
        id: 9,
        name: 'Customer & staff',
        code: ChartPermission.CUSTOMER_STAFF,
        description: 'Customer staff chart',
      },
      {
        id: 10,
        name: 'Customer interaction',
        code: ChartPermission.CUSTOMMER_INTERACTION,
        description: 'Customer & interaction chart',
      },
      {
        id: 11,
        name: 'Device totals',
        code: ChartPermission.DEVICES_TOTALS,
        description: 'Device total chart',
      },
    ];

    await this.permissionRepository.insert(permissions);
  }

  async drop(): Promise<any> {
    return this.permissionRepository.query(`TRUNCATE permissions RESTART IDENTITY CASCADE;`);
  }
}
