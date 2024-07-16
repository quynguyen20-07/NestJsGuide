import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PermissionEntity } from './entities';
import { Repository } from 'typeorm';
import { ResponseItem } from '@app/common/dtos';
import { PermissionDto } from './dto/permission.dto';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(PermissionEntity)
    private readonly permissionRepository: Repository<PermissionEntity>
  ) {}

  async getPermissions(): Promise<ResponseItem<PermissionDto>> {
    const permissions = await this.permissionRepository.find();

    return new ResponseItem(permissions, 'Thành công');
  }
}
