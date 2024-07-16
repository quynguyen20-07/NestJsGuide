import { PermissionEntity } from '@app/modules/permission/entities';
import { CreateRoleDto } from '@app/modules/role/dto/create-role.dto';
import { RoleEntity } from '@app/modules/role/entities';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Seeder } from 'nestjs-seeder';
import { In, Not, Repository } from 'typeorm';

@Injectable()
export class RoleSeeder implements Seeder {
  constructor(
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,

    @InjectRepository(PermissionEntity)
    private readonly permissionRepository: Repository<PermissionEntity>
  ) {}

  async seed(): Promise<any> {
    await this.roleRepository.query(`TRUNCATE roles RESTART IDENTITY CASCADE;`);

    const permissions: PermissionEntity[] = await this.permissionRepository.find();

    const excludedIdsMarketing = [6, 7, 9, 10];
    const marketingPermissions: PermissionEntity[] = await this.permissionRepository.find({
      where: {
        id: Not(In(excludedIdsMarketing)),
      },
    });

    const excludedIdsQaQc = [6, 7, 10];
    const qaQcPermissions: PermissionEntity[] = await this.permissionRepository.find({
      where: {
        id: In(excludedIdsQaQc),
      },
    });
    const excludedIdsCustom = [1, 3, 5, 7, 11];
    const CustomPermissions: PermissionEntity[] = await this.permissionRepository.find({
      where: {
        id: Not(In(excludedIdsCustom)),
      },
    });

    const roles: CreateRoleDto[] = [
      {
        id: 1,
        name: 'General management',
        description: 'General management role',
        isEditable: false,
        permissions: permissions,
      },
      {
        id: 2,
        name: 'Store management',
        description: 'Store management role',
        isEditable: false,
        permissions: permissions,
      },
      {
        id: 3,
        name: 'Marketing',
        description: 'Marketing role',
        isEditable: false,
        permissions: marketingPermissions,
      },
      {
        id: 4,
        name: 'Qa Qc',
        description: 'Qa-Qc role',
        isEditable: false,
        permissions: qaQcPermissions,
      },
      {
        id: 5,
        name: 'Brand management',
        isEditable: false,
        description: 'Brand Management role',
        permissions: permissions,
      },
      {
        id: 6,
        name: 'Custom',
        description: 'Custom role',
        permissions: CustomPermissions,
      },
    ];

    await this.roleRepository.insert(roles);
    await this.roleRepository.createQueryBuilder().relation(RoleEntity, 'permissions').of(roles[0]).add(permissions);
    await this.roleRepository.createQueryBuilder().relation(RoleEntity, 'permissions').of(roles[1]).add(permissions);
    await this.roleRepository
      .createQueryBuilder()
      .relation(RoleEntity, 'permissions')
      .of(roles[2])
      .add(marketingPermissions);
    await this.roleRepository
      .createQueryBuilder()
      .relation(RoleEntity, 'permissions')
      .of(roles[3])
      .add(qaQcPermissions);
    await this.roleRepository.createQueryBuilder().relation(RoleEntity, 'permissions').of(roles[4]).add(permissions);
    await this.roleRepository
      .createQueryBuilder()
      .relation(RoleEntity, 'permissions')
      .of(roles[5])
      .add(CustomPermissions);
  }

  async drop(): Promise<any> {
    return this.roleRepository.query(`TRUNCATE roles RESTART IDENTITY CASCADE;`);
  }
}
