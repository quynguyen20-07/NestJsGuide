import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';

import { ResponseItem, ResponsePaginate } from '@app/common/dtos';
import { GetRolesDto } from './dto/get-roles.dto';
import { CreateRoleDto } from './dto/create-role.dto';
import { RoleDto } from './dto/role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RolesService } from './roles.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Role, RoleGuard } from '@app/guards/roles.guard';
import { RolesEnum } from '@Constant/enums';

@UseGuards(JwtAuthGuard, RoleGuard)
@Role(RolesEnum.GENERAL_MANAGEMENT, RolesEnum.BRAND_MANAGEMENT)
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  async create(@Body() createRoleDto: CreateRoleDto): Promise<ResponseItem<RoleDto>> {
    return await this.rolesService.create(createRoleDto);
  }

  @Get()
  async getRoles(@Query() getRolesDto: GetRolesDto): Promise<ResponsePaginate<RoleDto>> {
    return await this.rolesService.getRoles(getRolesDto);
  }

  @Get('all')
  async getAllRoles(): Promise<ResponseItem<RoleDto>> {
    return await this.rolesService.getAllRoles();
  }

  @Get(':id')
  async getRole(@Param('id', ParseIntPipe) id: number): Promise<ResponseItem<RoleDto>> {
    return await this.rolesService.getRole(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRoleDto: UpdateRoleDto
  ): Promise<ResponseItem<RoleDto>> {
    return await this.rolesService.updateRole(id, updateRoleDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<ResponseItem<null>> {
    return await this.rolesService.deleteRole(id);
  }
}
