import * as bcrypt from 'bcrypt';

import { PageMetaDto, ResponseItem, ResponsePaginate } from '@app/common/dtos';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { In, Not, Repository } from 'typeorm';
import { RoleEntity } from '../role/entities';
import { CreateUserDto } from './dto/create-user.dto';
import { GetUsersDto } from './dto/get-users.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';
import { UserEntity } from './entities';
import { StatusEnum } from '@Constant/enums';
import { StoreEntity } from '../store/entities';
import { BrandEntity } from '../brand/entities';
import { hashPassword } from '@Constant/hash-password';

@Injectable()
export class UsersService {
  constructor(
    private readonly configService: ConfigService,

    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,

    @InjectRepository(RoleEntity)
    private roleRepository: Repository<RoleEntity>,

    @InjectRepository(StoreEntity)
    private readonly storeRepository: Repository<StoreEntity>,

    @InjectRepository(BrandEntity)
    private readonly brandRepository: Repository<BrandEntity>
  ) {}

  async create(params: CreateUserDto): Promise<ResponseItem<UserDto>> {
    const userExisted = await this.userRepository.findOneBy({
      username: params.username,
      deletedAt: null,
    });
    if (userExisted) throw new BadRequestException('Username already exists');

    const existPhone = await this.userRepository.findOneBy({
      phone: params.phone,
      deletedAt: null,
    });
    if (existPhone) throw new BadRequestException('Phone number already exists');

    const stores = await this.storeRepository.findBy({
      id: In(params.stores),
    });

    const brand = await this.brandRepository.findOneBy({
      id: Number(params.brand),
    });
    if (!brand) {
      throw new BadRequestException('Brand does not exist');
    }

    const newPassword = await hashPassword(params.password);

    const userParams = this.userRepository.create({ ...params, password: newPassword });

    const user = await this.userRepository.save({
      ...userParams,
      ...plainToClass(CreateUserDto, userParams, { excludeExtraneousValues: true }),
      brand,
      stores,
    });

    return new ResponseItem(user, 'Create new data successfully');
  }

  async resetPassword(id: number): Promise<ResponseItem<UserDto>> {
    const user = await this.userRepository.findOneBy({ id, deletedAt: null });
    if (!user) {
      throw new BadRequestException('User does not exist');
    }
    const newPassword = await bcrypt.hash(this.configService.get<string>('USER_PASSWORD'), 10);

    await this.userRepository.update(id, {
      ...user,
      password: newPassword,
    });

    const response = await this.userRepository.findOneBy({ id, deletedAt: null });

    const result = {
      ...response,
      password: this.configService.get<string>('USER_PASSWORD'),
    };

    return new ResponseItem(result, 'Password reset successfully');
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<ResponseItem<UserDto>> {
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
      relations: ['role', 'brand', 'stores'],
    });

    if (!user) {
      throw new BadRequestException('User does not exist');
    }

    const phoneExisted = await this.userRepository.findOneBy({
      phone: updateUserDto.phone,
      id: Not(id),
      deletedAt: null,
    });
    if (phoneExisted) {
      throw new BadRequestException('Phone number already exists');
    }
    const role = await this.roleRepository.findOneBy({
      id: Number(updateUserDto.role),
      deletedAt: null,
    });
    if (!role) {
      throw new BadRequestException('Role does not exist');
    }

    const stores = await this.storeRepository.findBy({
      id: In(updateUserDto.stores),
    });

    const brand = await this.brandRepository.findOneBy({
      id: Number(updateUserDto.brand),
    });
    if (!brand) {
      throw new BadRequestException('Brand does not exist');
    }

    const result = await this.userRepository.save({
      ...user,
      ...plainToClass(UpdateUserDto, updateUserDto, { excludeExtraneousValues: true }),
      role,
      brand,
      stores,
    });

    return new ResponseItem(result, 'Update data successfully');
  }

  async deleteUser(id: number): Promise<ResponseItem<null>> {
    const user = await this.userRepository.findOneBy({ id, deletedAt: null });
    if (!user) throw new BadRequestException('User does not exist');

    await this.userRepository.softDelete(id);

    return new ResponseItem(null, 'Delete user successfully');
  }

  async getUsers(params: GetUsersDto): Promise<ResponsePaginate<UserDto>> {
    const users = this.userRepository
      .createQueryBuilder('users')
      .leftJoinAndSelect('users.role', 'role', 'role.deletedAt IS NULL')
      .leftJoinAndSelect('users.stores', 'stores', 'stores.deletedAt IS NULL')
      .leftJoinAndSelect('users.brand', 'brand', 'brand.deletedAt IS NULL')
      .where('users.status = ANY(:status)', {
        status: params.status ? [params.status] : [StatusEnum.ACTIVE, StatusEnum.INACTIVE],
      })
      .andWhere('users.roleId != :roleId', { roleId: 1 })
      .orderBy(`users.${params.orderBy}`, params.order)
      .skip(params.skip)
      .take(params.take);

    if (params.search) {
      users.andWhere('LOWER(users.username) LIKE LOWER(:username)', {
        username: `%${params.search}%`,
      });
    }

    if (params.storeName) {
      users.andWhere('LOWER(stores.name) LIKE LOWER(:storeName)', { storeName: `%${params.storeName}%` });
    }

    if (params.brand) {
      users.andWhere('LOWER(brand.name) LIKE LOWER(:brand)', { brand: `%${params.brand}%` });
    }

    const [result, total] = await users.getManyAndCount();

    const pageMetaDto = new PageMetaDto({ itemCount: total, pageOptionsDto: params });

    return new ResponsePaginate(result, pageMetaDto, 'Success');
  }

  async getUser(id: number): Promise<ResponseItem<UserDto>> {
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
      relations: ['role', 'brand', 'stores'],
    });
    if (!user) throw new BadRequestException('User does not exist');

    return new ResponseItem({ ...user }, 'Success');
  }

  async updateRfToken(id, update) {
    if (update.rfToken) {
      await this.userRepository.update(id, { rfToken: update.rfToken });
    }
  }

  async getUserByRefresh(refresh: string, sub: number) {
    const user = await this.userRepository.findOne({
      where: {
        id: sub,
      },
      join: {
        alias: 'user',
        leftJoinAndSelect: {
          role: 'user.role',
          permissions: 'role.permissions',
        },
      },
    });
    if (!user) {
      throw new BadRequestException('Invalid token');
    }

    if (!(refresh === user.rfToken)) {
      return false;
    }

    return user;
  }
}
