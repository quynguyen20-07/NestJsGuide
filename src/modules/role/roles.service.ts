import { StatusEnum } from '@Constant/enums';
import { PageMetaDto, ResponseItem, ResponsePaginate } from '@app/common/dtos';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { In, Repository } from 'typeorm';
import { PermissionEntity } from '../permission/entities';
import { UserEntity } from '../user/entities';
import { CreateRoleDto } from './dto/create-role.dto';
import { GetRolesDto } from './dto/get-roles.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RoleEntity } from './entities';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(RoleEntity)
    private rolesRepository: Repository<RoleEntity>,

    @InjectRepository(PermissionEntity)
    private permissionsRepository: Repository<PermissionEntity>,

    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>
  ) {}

  async create(params: CreateRoleDto): Promise<ResponseItem<RoleEntity>> {
    const nameExisted = await this.rolesRepository
      .createQueryBuilder('roles')
      .where('LOWER(roles.name) = LOWER(:name)', { name: params.name })
      .andWhere('roles.deletedAt IS NULL')
      .getOne();
    if (nameExisted) throw new BadRequestException('Role name already exists');

    const permissions = await this.permissionsRepository.findBy({
      id: In(params.permissions),
    });

    const role = this.rolesRepository.create({
      ...params,
      permissions: permissions,
    });

    const newRole = await this.rolesRepository.save(role);

    return new ResponseItem(newRole, 'Create new data successfully');
  }

  async getAllRoles(): Promise<ResponseItem<RoleEntity>> {
    const roles = await this.rolesRepository.find({
      where: {
        deletedAt: null,
        status: StatusEnum.ACTIVE,
      },
      relations: ['permissions'],
    });

    return new ResponseItem(roles, 'Success');
  }

  async getRoles(params: GetRolesDto): Promise<ResponsePaginate<RoleEntity>> {
    const roles = this.rolesRepository
      .createQueryBuilder('roles')
      .where('roles.status = ANY(:status)', {
        status: params.status ? [params.status] : [StatusEnum.ACTIVE, StatusEnum.INACTIVE],
      })
      .orderBy(`roles.${params.orderBy}`, params.order)
      .skip(params.skip)
      .take(params.take);

    if (params.search) {
      roles.andWhere('(LOWER(roles.name)) LIKE (LOWER(:name))', {
        name: `%${params.search}%`,
      });
    }

    const [result, total] = await roles.getManyAndCount();

    const pageMetaDto = new PageMetaDto({ itemCount: total, pageOptionsDto: params });

    return new ResponsePaginate(result, pageMetaDto, 'Success');
  }

  async getRole(id: number): Promise<ResponseItem<RoleEntity>> {
    const role = await this.rolesRepository.findOne({
      where: { id, deletedAt: null },
      relations: ['permissions'],
    });
    if (!role) throw new BadRequestException('Role does not exists');

    return new ResponseItem(role, 'Success');
  }

  async updateRole(id: number, updateRoleDto: UpdateRoleDto): Promise<ResponseItem<RoleEntity>> {
    const role = await this.rolesRepository.findOne({
      where: { id, deletedAt: null },
      relations: ['users', 'permissions'],
    });
    if (!role) throw new BadRequestException('Role does not exists');

    const nameExisted = await this.rolesRepository
      .createQueryBuilder('roles')
      .where('LOWER(roles.name) = LOWER(:name)', { name: updateRoleDto.name })
      .andWhere('roles.deletedAt IS NULL')
      .andWhere('roles.id != :id', { id })
      .getOne();
    if (nameExisted) throw new BadRequestException('Role already exists');

    if (updateRoleDto.status == StatusEnum.INACTIVE && role?.users.length > 0)
      throw new BadRequestException('Role already used');

    const isEditable = await this.rolesRepository.findOneBy({ id, isEditable: false });
    if (isEditable) throw new BadRequestException('Roles are not edited');

    const permissions = await this.permissionsRepository.findBy({
      id: In(updateRoleDto.permissions),
    });

    const result = await this.rolesRepository.save({
      ...role,
      ...plainToClass(UpdateRoleDto, updateRoleDto, { excludeExtraneousValues: true }),
      permissions: permissions,
    });

    return new ResponseItem(result, 'Data update successful');
  }

  async deleteRole(id: number): Promise<ResponseItem<null>> {
    const role = await this.rolesRepository.findOneBy({ id, deletedAt: null });
    if (!role) throw new BadRequestException('Role does not exist');
    if (role.status === StatusEnum.ACTIVE) throw new BadRequestException('The active role cannot be deleted');

    await this.rolesRepository.softDelete(id);

    return new ResponseItem(null, 'Delete role successfully');
  }
}
