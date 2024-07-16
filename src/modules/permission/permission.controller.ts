import { ResponseItem } from '@app/common/dtos';
import { Controller, Get } from '@nestjs/common';
import { PermissionDto } from './dto/permission.dto';
import { PermissionsService } from './permission.service';

@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Get()
  async getPermissions(): Promise<ResponseItem<PermissionDto>> {
    return this.permissionsService.getPermissions();
  }
}
